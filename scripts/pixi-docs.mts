/**
 * Generates a library's guides, guides sidebar and `llms.txt` from the docs in its `.repos` checkout, at the
 * installed version: `node scripts/pixi-docs.mts [2d|3d]` (`npm run generate:docs` runs it for pixi.js).
 * Everything library-specific comes from `scripts/libraries.mts`.
 *
 * Guides are TypeDoc documents (`src/**\/__docs__/*.md(x)`). Each one becomes a Docusaurus page at the path the
 * library's `pages` gives it: `{@link}` tags resolve against the API search index published for that version
 * (or render as code while a library's API isn't hosted), GitHub alerts become admonitions, `@stackblitz(name)`
 * becomes `<PixiExample>`, and relative links point at the generated pages and at media copied into
 * `<docsDir>/guides/_media`. The sidebar follows the library's own nav: the `@document` order in
 * `src/index.docs.ts`, each doc's `children`, and `categoryOrder`.
 *
 * A library with `tutorials` also gets its upstream tutorials: each step's `step.md` goes through the same
 * conversion, its `.ts` files are stripped to JavaScript, and each tutorial gets a module of its steps, a card in
 * the registry module and a page that imports the steps. A library with a `stub` publishes placeholder guides when
 * its checkout is missing.
 *
 * Outputs are gitignored. A file is rewritten only when its content changes, and anything else in the generated
 * folders is deleted. Problems that need an upstream or table fix throw; anything that only needs a look prints a
 * line starting with `warning:`.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { inflateSync } from 'node:zlib';
import prettier from 'prettier';

import { getLibrary, type Library } from './libraries.mts';
import {
  formatScript,
  installedPackage,
  maskCode,
  prune,
  readScript,
  repoPin,
  tutorialPage,
  writeIfChanged,
} from './shared.mts';

/** A guide, converted to a Docusaurus page */
interface Doc {
  /** Path in `<repo>/src` */
  source: string;
  /** Path of the page in `<docsDir>/guides` */
  output: string;
  /** Docusaurus doc ID */
  id: string;
  /** Sidebar label: the title, or the H1 when the title is "Overview" */
  label: string;
  description: string;
  /** TypeDoc category, which groups root docs in the sidebar */
  category: string;
  children: Doc[];
  /** Front matter lines of the page */
  frontMatter: string[];
  /** Markdown after the front matter, starting at the H1, with the library's patches applied */
  body: string;
}

/** A front matter entry; TypeDoc docs only use `key: value` lines and `- item` lists */
interface Field {
  line: string;
  value: string;
  items: string[];
}

/** A row of TypeDoc's search index */
interface SearchRow {
  kind: number;
  name: string;
  url: string;
  parent?: string;
}

/** API URL per symbol name (`Name` or `Parent.member`), or null when the name points at more than one page */
type ApiIndex = Map<string, string | null>;

type SidebarItem =
  string | { type: 'category'; label: string; link: { type: 'doc'; id: string }; items: SidebarItem[] };

/** State shared by every doc's conversion */
interface Context {
  library: Library;
  /** `<repo>/src`, absolute */
  src: string;
  /**
   * The library's API index, or null while its API isn't hosted and links render as code. There's no fallback to
   * another library's index: a 3D guide can only link 3D names, and pixi.js has some of the same ones.
   */
  api: ApiIndex | null;
  docs: Map<string, Doc>;
  /** Media to copy: path in `<docsDir>/guides` to absolute source path */
  media: Map<string, string>;
  errors: string[];
  counts: { links: number; code: number; admonitions: number; embeds: number };
}

/** A tutorial's `tutorial.json` */
interface TutorialMeta {
  title: string;
  description: string;
  level: string;
  minutes: number;
  dependencies?: Record<string, string>;
}

/** A tutorial step's editor files: `index` and `src/<file>.js`, where `*` marks the active tab and `!` a hidden one */
type StepCode = string | Record<string, string>;

const ROOT = process.cwd();
const SITE_URL = 'https://pixijs.com';
const CACHE_DIR = path.join(ROOT, 'node_modules/.cache/pixi-docs');
const MEDIA_DIR = '_media';

const FRONT_MATTER_KEYS = new Set(['title', 'description', 'category', 'children', 'sidebar_position']);
const STEP_KEYS = new Set(['title', 'active', 'hidden']);
/** TypeDoc's `ReflectionKind.Document`: guide pages, which `{@link}` doesn't target */
const DOCUMENT_KIND = 8388608;

const FRONT_MATTER = /^---\n([\s\S]*?)\n---\n/;
const LINK_TAG = /\{@link\s+([\w.#]+)(?:\s*\|\s*([^}]*?))?\s*\}/g;
const ALERT = /^> ?\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(.*)\n?((?:>.*(?:\n|$))*)/gm;
const STACKBLITZ = /^@stackblitz\(([\w.-]+)\)[ \t]*$/gm;
const RELATIVE_LINK = /\]\((\.{1,2}\/[^)\s#]*)(#[^)\s]*)?\)/g;
const LEFTOVER = /\{@\w*|^[ \t]*> ?\[!\w*\]|@stackblitz/gm;
const STEP_DIR = /^(\d+)-[\w-]+$/;
const SLUG = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

const warn = (message: string) => console.log(`warning: ${message}`);

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
}

/**
 * Reads a URL from the download cache, downloading it on a miss
 * @param url - Where to download it from; versioned, so a cached copy never goes stale
 */
async function fetchCached(url: string): Promise<string> {
  const file = path.join(CACHE_DIR, url.replace(/^https?:\/\//, ''));
  if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8');
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, text);
      return text;
    } catch (error) {
      if (attempt === 3) throw new Error(`can't download ${url}: ${(error as Error).message}`);
      await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
    }
  }
}

/**
 * The TypeDoc base URL of a library's installed version, or null while its API isn't hosted
 * @param library - The library
 */
function apiBase(library: Library): string | null {
  const { version, gitHead } = installedPackage(library.pkg);
  return library.api(version, gitHead);
}

/**
 * Maps every API symbol to its page, from TypeDoc's `assets/search.js`
 * @param base - TypeDoc base URL, which page paths are relative to
 */
async function loadApiIndex(base: string): Promise<ApiIndex> {
  const js = await fetchCached(`${base}assets/search.js`);
  const encoded = /"([^"]+)"/.exec(js)?.[1];
  if (!encoded) throw new Error(`can't find the search data in ${base}assets/search.js`);
  const { rows } = JSON.parse(inflateSync(Buffer.from(encoded, 'base64')).toString()) as { rows: SearchRow[] };
  const api: ApiIndex = new Map();
  for (const row of rows) {
    if (row.kind === DOCUMENT_KIND) continue;
    const key = row.parent ? `${row.parent}.${row.name}` : row.name;
    const url = `${base}${row.url}`;
    api.set(key, api.has(key) && api.get(key) !== url ? null : url);
  }
  return api;
}

/**
 * Reads YAML front matter
 * @param yaml - The text between the `---` lines
 * @param source - Doc path, for errors
 */
function parseFrontMatter(yaml: string, source: string): Map<string, Field> {
  const unquote = (value: string) => value.trim().replace(/^(['"])(.*)\1$/, '$2');
  const fields = new Map<string, Field>();
  let field: Field | undefined;
  for (const line of yaml.split('\n')) {
    const entry = /^(\w+):(.*)$/.exec(line);
    const item = /^\s+-\s+(.+)$/.exec(line);
    if (entry) {
      field = { line, value: unquote(entry[2]), items: [] };
      fields.set(entry[1], field);
    } else if (item && field) {
      field.items.push(unquote(item[1]));
    } else if (line.trim()) {
      throw new Error(`${source}: can't read front matter line "${line}"`);
    }
  }
  return fields;
}

/**
 * Splits a markdown file into its front matter and body, warning about keys the site drops
 * @param file - Absolute path
 * @param source - Path for messages
 * @param keys - Front matter keys the site reads
 */
function readMarkdown(file: string, source: string, keys: Set<string>): { fields: Map<string, Field>; body: string } {
  const text = fs.readFileSync(file, 'utf8');
  const match = FRONT_MATTER.exec(text);
  if (!match) throw new Error(`${source} has no front matter`);
  const fields = parseFrontMatter(match[1], source);
  const dropped = [...fields.keys()].filter((key) => !keys.has(key));
  if (dropped.length) warn(`${source}: dropped front matter keys ${dropped.join(', ')}`);
  return { fields, body: text.slice(match[0].length).trimStart() };
}

/**
 * The page path for a doc missing from the library's `pages`, always inside a generated folder
 * @param source - Doc path
 * @param category - Its TypeDoc category
 * @param library - The library
 */
function defaultPage(source: string, category: string, library: Library): string {
  const stem = source.replace(/\.mdx?$/, '');
  const section = library.sections[category];
  if (section) return `${section}/${path.posix.basename(stem)}`;
  return path.posix.join('components', stem.replace(/(^|\/)__docs__\//, '/'));
}

/**
 * The front matter line that sets or hides a page's "Edit this page" link
 * @param library - The library
 * @param source - Doc path
 */
function editLine(library: Library, source: string): string {
  return `custom_edit_url: ${library.editUrl ? `${library.editUrl}${source}` : 'null'}`;
}

/**
 * Reads one doc and works out its page
 * @param source - Path in `<repo>/src`
 * @param context - Conversion state
 * @returns The doc, without its children yet, and the paths of its children
 */
function readDoc(source: string, context: Context): { doc: Doc; children: string[] } {
  const { library } = context;
  const file = path.join(context.src, source);
  if (!fs.existsSync(file)) throw new Error(`${library.repo} lists ${source}, which doesn't exist`);
  const { fields, body: raw } = readMarkdown(file, source, FRONT_MATTER_KEYS);

  const body = patch(source, raw, library);
  const h1 = /^# (.+)/.exec(body)?.[1].trim();
  if (!h1) throw new Error(`${source} doesn't start with a # heading`);
  const title = fields.get('title')?.value;
  const label = !title || title === 'Overview' ? h1 : title;

  const category = fields.get('category')?.value || 'Other';
  let page = library.pages[source];
  if (!page) {
    page = defaultPage(source, category, library);
    warn(`${source} isn't in pages, so it's published at ${page}; add it to scripts/libraries.mts to choose its URL`);
  }

  const description = fields.get('description');
  const doc: Doc = {
    source,
    output: `${page}${path.posix.extname(source)}`,
    id: `guides/${page}`,
    label,
    description: description?.value ?? '',
    category,
    children: [],
    frontMatter: [
      `sidebar_label: ${JSON.stringify(label)}`,
      ...(description?.value ? [description.line] : []),
      editLine(library, source),
    ],
    body,
  };
  const children = (fields.get('children')?.items ?? []).map((child) =>
    path.posix.join(path.posix.dirname(source), child),
  );
  return { doc, children };
}

/**
 * Reads the library's doc tree: the `@document` paths in `src/index.docs.ts`, in order, each with its `children`
 * @param context - Conversion state; its `docs` gets every doc by source path
 * @returns The root docs
 */
function loadDocs(context: Context): Doc[] {
  const { library, docs } = context;
  const ids = new Map<string, string>();

  const load = (source: string): Doc => {
    if (docs.has(source)) throw new Error(`${source} appears twice in the doc tree`);
    const { doc, children } = readDoc(source, context);
    if (ids.has(doc.id)) throw new Error(`${source} and ${ids.get(doc.id)} both publish to ${doc.id}`);
    ids.set(doc.id, source);
    docs.set(source, doc);
    doc.children = children.map(load);
    return doc;
  };

  const roots = documentPaths(context.src).map(load);

  const missing = Object.keys(library.pages).filter((source) => !docs.has(source));
  if (missing.length && library.draft) {
    warn(`${missing.length} of the ${library.id} guides in scripts/libraries.mts aren't in ${library.repo} yet`);
  } else if (missing.length) {
    throw new Error(
      `${library.repo} removed or renamed ${missing.join(', ')}: update pages and add a client redirect from the old URL`,
    );
  }
  for (const source of Object.keys(library.patches)) {
    if (!docs.has(source)) warn(`patches has ${source}, which isn't a doc; delete it`);
  }
  return roots;
}

/**
 * The `@document` paths in `src/index.docs.ts`, in order; none when the file or the checkout is missing
 * @param src - `<repo>/src`, absolute
 */
function documentPaths(src: string): string[] {
  const registry = path.join(src, 'index.docs.ts');
  if (!fs.existsSync(registry)) return [];
  return [...fs.readFileSync(registry, 'utf8').matchAll(/@document\s+(\S+)/g)].map((match) =>
    path.posix.normalize(match[1]),
  );
}

/**
 * Placeholder getting-started guides for a checkout the build can't read
 * @param library - A library with a `stub`
 */
function stubDocs(library: Library): Doc[] {
  const note =
    `The ${library.name} guides are built from the ${path.basename(library.repo)} repository, which this build ` +
    "of the site couldn't read, so this page is a placeholder.";
  return Object.entries(library.stub!.pages).map(([source, title]) => {
    const page = library.pages[source];
    return {
      source,
      output: `${page}.md`,
      id: `guides/${page}`,
      label: title,
      description: '',
      category: 'getting-started',
      children: [],
      frontMatter: [`sidebar_label: ${JSON.stringify(title)}`, editLine(library, source)],
      body: `# ${title}\n\n${note}\n`,
    };
  });
}

/**
 * Applies a doc's patches to its body, before anything reads the H1
 * @param source - Path in `<repo>/src`
 * @param body - Markdown after the front matter
 * @param library - The library
 */
function patch(source: string, body: string, library: Library): string {
  for (const [from, to] of library.patches[source] ?? []) {
    if (body.includes(from)) body = body.replaceAll(from, to);
    else warn(`${source}: the patch for ${from} no longer applies; delete it from patches`);
  }
  return body;
}

/**
 * What a relative link points at
 * @param from - Path in the checkout of the file the link is in
 * @param href - The link, starting with `./` or `../`
 * @param context - Conversion state
 * @returns The doc, or the path in `src` of a file other than a doc, or null when it's neither
 */
function linkTarget(from: string, href: string, context: Context): Doc | string | null {
  const target = path.posix.join(path.posix.dirname(from), href);
  if (!target.startsWith('src/')) return null;
  const source = target.slice('src/'.length);
  const doc = context.docs.get(source);
  if (doc) return doc;
  const file = path.join(context.src, source);
  return /\.mdx?$/.test(source) || !fs.statSync(file, { throwIfNoEntry: false })?.isFile() ? null : source;
}

/**
 * Points a relative link in a doc at the generated page, or at a copy of the file in `_media`
 * @param doc - The doc the link is in
 * @param href - The link, starting with `./` or `../`
 * @param context - Conversion state
 */
function resolveRelative(doc: Doc, href: string, context: Context): string | null {
  const target = linkTarget(`src/${doc.source}`, href, context);
  if (!target) {
    context.errors.push(`${doc.source}: ${href} isn't a doc or a file in src`);
    return null;
  }
  let output = typeof target === 'string' ? path.posix.join(MEDIA_DIR, target) : target.output;
  if (typeof target === 'string') context.media.set(output, path.join(context.src, target));
  output = path.posix.relative(path.posix.dirname(doc.output), output);
  return output.startsWith('../') ? output : `./${output}`;
}

/**
 * The site path of a doc's page
 * @param doc - The doc
 * @param library - Its library
 */
function pagePath(doc: Doc, library: Library): string {
  return `${library.guidesPath}${doc.output.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '')}`;
}

/**
 * Converts TypeDoc markdown to Docusaurus MDX
 * @param body - Markdown after the front matter
 * @param source - Its path, for errors
 * @param context - Conversion state
 * @param resolveLink - The new target of a relative link (`./` or `../`), or null when it's broken
 * @param embeds - Whether `@stackblitz` is allowed
 */
function convertBody(
  body: string,
  source: string,
  context: Context,
  resolveLink: (href: string) => string | null,
  embeds = true,
): string {
  const { library } = context;
  const code = maskCode(body);
  const text = code.text
    .replace(LINK_TAG, (tag, target: string, label?: string) => {
      context.counts.links++;
      const name = target.replace('#', '.');
      const url = context.api?.get(name);
      const shown = `\`${label || name}\``;
      if (url) return `[${shown}](${url})`;
      if (!context.api) {
        context.counts.code++;
        return shown;
      }
      const reason = url === null ? 'matches more than one API page' : "isn't in the API index";
      context.errors.push(`${source}: ${tag} ${reason}`);
      return target;
    })
    .replace(ALERT, (_, type: string, first: string, rest: string) => {
      context.counts.admonitions++;
      const content = [first, ...rest.split('\n').map((line) => line.replace(/^> ?/, ''))].join('\n').trim();
      return `:::${type.toLowerCase()}\n\n${content}\n\n:::\n`;
    })
    .replace(STACKBLITZ, (tag, name: string) => {
      if (!embeds) return tag;
      context.counts.embeds++;
      return `\n<PixiExample${library.id === '2d' ? '' : ` pkg="${library.id}"`} name="${name}" />\n`;
    })
    .replace(RELATIVE_LINK, (link, href: string, anchor = '') => {
      const resolved = resolveLink(href);
      return resolved ? `](${resolved}${anchor})` : link;
    })
    .replace(/\n{3,}/g, '\n\n');

  for (const [leftover] of text.matchAll(LEFTOVER)) {
    context.errors.push(`${source}: unconverted ${leftover.trim()} outside code`);
  }
  return code.restore(text).trimEnd();
}

/**
 * Converts one doc to a Docusaurus page
 * @param doc - The doc
 * @param context - Conversion state
 */
function convert(doc: Doc, context: Context): string {
  const body = convertBody(doc.body, doc.source, context, (href) => resolveRelative(doc, href, context));
  return `---\n${doc.frontMatter.join('\n')}\n---\n\n${body}\n`;
}

/**
 * Builds the guides sidebar from the library's nav: one list per `sections` value, and every other category in
 * `categoryOrder` as `components`. Lists come in the order their first `@document` does, so pixi.js keeps
 * concepts, components, migrations.
 * @param roots - The `@document` docs, in order
 * @param library - The library
 * @param categoryOrder - TypeDoc's `categoryOrder`
 */
function buildSidebar(roots: Doc[], library: Library, categoryOrder: string[]): Record<string, SidebarItem[]> {
  const item = (doc: Doc): SidebarItem =>
    doc.children.length
      ? { type: 'category', label: doc.label, link: { type: 'doc', id: doc.id }, items: doc.children.map(item) }
      : doc.id;

  const rank = (category: string) => {
    const index = categoryOrder.indexOf(category);
    const rest = categoryOrder.indexOf('*');
    return index !== -1 ? index : rest !== -1 ? rest : categoryOrder.length;
  };

  const sectionOf = (doc: Doc) => library.sections[doc.category] ?? 'components';
  const categories = new Map<string, Doc[]>();
  for (const doc of roots) {
    if (sectionOf(doc) === 'components') categories.set(doc.category, [...(categories.get(doc.category) ?? []), doc]);
  }
  const components = [...categories]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([, [first, ...rest]]): SidebarItem => {
      if (!rest.length) return item(first);
      const items = [...first.children.map(item), ...rest.map(item)];
      return { type: 'category', label: first.label, link: { type: 'doc', id: first.id }, items };
    });

  const keys = new Set([...roots.map(sectionOf), ...Object.values(library.sections), 'components']);
  return Object.fromEntries(
    [...keys].map((key) => [
      key,
      key === 'components' ? components : roots.filter((doc) => sectionOf(doc) === key).map(item),
    ]),
  );
}

/**
 * Lists the guides in sidebar order, for a library whose `llms.txt` isn't published by TypeDoc
 * @param sidebar - The generated sidebar
 * @param context - Conversion state
 */
function buildLlms(sidebar: Record<string, SidebarItem[]>, context: Context): string {
  const byId = new Map([...context.docs.values()].map((doc) => [doc.id, doc]));
  const ids = (items: SidebarItem[]): string[] =>
    items.flatMap((entry) => (typeof entry === 'string' ? [entry] : [entry.link.id, ...ids(entry.items)]));
  const { library } = context;
  const lines = Object.values(sidebar)
    .flatMap(ids)
    .map((id) => byId.get(id)!)
    .map(
      (doc) =>
        `- [${doc.label}](${SITE_URL}${pagePath(doc, library)}.md)${doc.description ? `: ${doc.description}` : ''}`,
    );
  const { description } = installedPackage(library.pkg);
  return [`# ${library.name}`, '', ...(description ? [`> ${description}`, ''] : []), ...lines, ''].join('\n');
}

/**
 * Reads a tutorial step's files for the editor, and their solution when a file has a `.completed` twin
 * @param stepDir - The step folder, absolute
 * @param fields - The step's front matter: `active` names the tab opened first, `hidden` files kept out of tabs
 * @param stepSource - Path of `step.md`, for errors
 * @param context - Conversion state
 */
async function readStepCode(
  stepDir: string,
  fields: Map<string, Field>,
  stepSource: string,
  context: Context,
): Promise<{ code: StepCode; completedCode?: StepCode }> {
  const files = fs.readdirSync(stepDir).filter((file) => file.endsWith('.ts'));
  const editable = files
    .filter((file) => !file.endsWith('.completed.ts'))
    .sort((a, b) => Number(b === 'index.ts') - Number(a === 'index.ts') || a.localeCompare(b));
  const solved = new Set(
    files.filter((file) => file.endsWith('.completed.ts')).map((file) => file.replace(/\.completed\.ts$/, '.ts')),
  );
  const active =
    fields.get('active')?.value || editable.find((file) => file !== 'index.ts' && solved.has(file)) || 'index.ts';
  const listed = fields.get('hidden');
  const hidden = new Set([...(listed?.items ?? []), ...(listed?.value ? [listed.value] : [])]);

  if (!editable.includes('index.ts')) context.errors.push(`${stepSource}: the step has no index.ts`);
  for (const file of new Set([active, ...hidden, ...solved])) {
    if (!editable.includes(file)) context.errors.push(`${stepSource}: ${file} isn't a .ts file of the step`);
  }

  const key = (file: string) =>
    file === 'index.ts'
      ? 'index'
      : `src/${file.replace(/\.ts$/, '.js')}${active === file ? '*' : hidden.has(file) ? '!' : ''}`;
  const build = async (completed: boolean): Promise<StepCode> => {
    const entries = await Promise.all(
      editable.map(async (file) => {
        const read = completed && solved.has(file) ? file.replace(/\.ts$/, '.completed.ts') : file;
        return [key(file), await formatScript(readScript(path.join(stepDir, read)))] as const;
      }),
    );
    return entries.length === 1 ? entries[0][1] : Object.fromEntries(entries);
  };

  return { code: await build(false), completedCode: solved.size ? await build(true) : undefined };
}

/** Formats a generated TypeScript module and queues it for writing */
async function writeModule(file: string, lines: string[], outputs: Map<string, string | Buffer>) {
  const config = await prettier.resolveConfig(file);
  outputs.set(file, await prettier.format(lines.join('\n'), { ...config, parser: 'typescript' }));
}

/**
 * Converts one upstream tutorial: each `NN-<step>/` folder is a full snapshot of the step's files plus `step.md`.
 * Writes the step text (titled with the step's `title`), a module of the steps and the page, which imports that
 * module so the steps load with the page's route and nowhere else.
 * @param slug - Folder name, and the page's slug
 * @param context - Conversion state
 * @param outputs - Files to write, by absolute path
 * @returns Its card in the registry module
 */
async function convertTutorial(slug: string, context: Context, outputs: Map<string, string | Buffer>): Promise<string> {
  const { library } = context;
  const { dir, out, pages } = library.tutorials!;
  const tutorialDir = path.join(ROOT, library.repo, dir, slug);
  if (!SLUG.test(slug)) throw new Error(`${dir}/index.json: ${slug} isn't a kebab-case slug`);
  const meta = readJson<TutorialMeta>(path.join(tutorialDir, 'tutorial.json'));
  const imports: string[] = [];
  const steps: string[] = [];

  const stepDirs = fs.readdirSync(tutorialDir).filter((name) => STEP_DIR.test(name));
  for (const step of stepDirs.sort()) {
    const number = STEP_DIR.exec(step)![1];
    const stepSource = `${dir}/${slug}/${step}/step.md`;
    const { fields, body } = readMarkdown(path.join(tutorialDir, step, 'step.md'), stepSource, STEP_KEYS);
    const header = fields.get('title')?.value;
    if (!header) throw new Error(`${stepSource} has no title`);

    const resolveLink = (href: string) => {
      const target = linkTarget(stepSource, href, context);
      if (target && typeof target !== 'string') return pagePath(target, library);
      context.errors.push(`${stepSource}: ${href} isn't a guide`);
      return null;
    };
    outputs.set(
      path.join(ROOT, out, slug, `${number}.md`),
      `# ${header}\n\n${convertBody(body, stepSource, context, resolveLink, false)}\n`,
    );
    const content = `step${number}`;
    imports.push(`import ${content} from './${number}.md';`);

    const { code, completedCode } = await readStepCode(path.join(tutorialDir, step), fields, stepSource, context);
    const solution = completedCode ? `, completedCode: ${JSON.stringify(completedCode)}` : '';
    steps.push(`{ header: ${JSON.stringify(header)}, Content: ${content}, code: ${JSON.stringify(code)}${solution} },`);
  }
  if (!steps.length) throw new Error(`${dir}/${slug} has no NN-<step> folders`);

  const thumbnail = path.join(tutorialDir, 'thumbnail.webp');
  const thumbnailPath = `/images/tutorials/${library.id}/${slug}.webp`;
  const hasThumbnail = fs.existsSync(thumbnail);
  if (hasThumbnail) outputs.set(path.join(ROOT, library.staticDir, thumbnailPath), fs.readFileSync(thumbnail));
  else warn(`${dir}/${slug} has no thumbnail.webp`);

  outputs.set(
    path.join(ROOT, pages, `${slug}.md`),
    tutorialPage({
      pkg: library.id,
      id: slug,
      title: meta.title,
      description: meta.description,
      content: `@site/${out}/${slug}`,
    }),
  );

  const dependencies = meta.dependencies ? [`extraPackages: ${JSON.stringify(meta.dependencies)},`] : [];
  await writeModule(
    path.join(ROOT, out, slug, 'index.ts'),
    [
      `// Generated by scripts/pixi-docs.mts from ${library.repo}/${dir}/${slug}; edit the tutorial there`,
      "import type { TutorialContent } from '@site/src/tutorials';",
      ...imports,
      '',
      `const tutorial: TutorialContent = { ${dependencies.join('')} steps: [${steps.join('\n')}] };`,
      '',
      'export default tutorial;',
    ],
    outputs,
  );

  const fields = [
    `id: ${JSON.stringify(slug)}`,
    `title: ${JSON.stringify(meta.title)}`,
    `description: ${JSON.stringify(meta.description)}`,
    `level: ${JSON.stringify(meta.level)}`,
    `minutes: ${Number(meta.minutes)}`,
    `steps: ${steps.length}`,
    ...(hasThumbnail ? [`thumbnail: ${JSON.stringify(thumbnailPath)}`] : []),
  ];
  return `{ ${fields.join(', ')} },`;
}

/**
 * Converts the library's upstream tutorials into step content, a module per tutorial that its page imports, a
 * registry module of their cards and one page per tutorial
 * @param context - Conversion state
 * @param outputs - Files to write, by absolute path
 * @param slugs - Tutorials in gallery order; none writes an empty registry
 */
async function convertTutorials(context: Context, outputs: Map<string, string | Buffer>, slugs: string[]) {
  const { library } = context;
  const { dir, out } = library.tutorials!;
  const cards = [];
  for (const slug of slugs) cards.push(await convertTutorial(slug, context, outputs));

  await writeModule(
    path.join(ROOT, out, 'index.ts'),
    [
      `// Generated by scripts/pixi-docs.mts from ${library.repo}/${dir}; edit the tutorials there`,
      "import type { TutorialMeta } from '@site/src/tutorials';",
      '',
      `const tutorials: TutorialMeta[] = [${cards.join('\n')}];`,
      '',
      'export default tutorials;',
    ],
    outputs,
  );
}

async function main(): Promise<void> {
  const library = getLibrary(process.argv[2]);
  const repoDir = path.join(ROOT, library.repo);
  const guidesDir = path.join(ROOT, library.docsDir, 'guides');
  const context: Context = {
    library,
    src: path.join(repoDir, 'src'),
    api: null,
    docs: new Map(),
    media: new Map(),
    errors: [],
    counts: { links: 0, code: 0, admonitions: 0, embeds: 0 },
  };

  const stubbed = !!library.stub && !documentPaths(context.src).length;
  let roots: Doc[];
  let categoryOrder: string[] = [];
  let typedocLlms: string | null = null;
  if (stubbed) {
    if (library.stub!.required) {
      throw new Error(`${library.repo} is missing or lists no @document, and ${library.name} docs are required`);
    }
    const name = library.id.toUpperCase();
    warn(`no ${name} guides available, ${name} docs are stubbed`);
    roots = stubDocs(library);
    for (const doc of roots) context.docs.set(doc.source, doc);
  } else {
    const pin = spawnSync('git', ['-C', repoDir, 'config', 'repos.pin'], { encoding: 'utf8' }).stdout?.trim();
    const expected = repoPin(library.pkg);
    if (pin !== expected) {
      throw new Error(`${library.repo} is at ${pin || 'nothing'}, not ${expected}: run npm run sync:repos`);
    }
    const base = apiBase(library);
    if (base) {
      context.api = await loadApiIndex(base);
      const llms = await fetchCached(`${base}llms.txt`);
      typedocLlms = llms.replaceAll('](./', `](${base}`).replace(/\{@link\s+([^}]*?)\s*\}/g, '$1');
    }
    ({ categoryOrder = [] } = readJson<{ categoryOrder?: string[] }>(path.join(repoDir, '.configs/typedoc.json')));
    roots = loadDocs(context);
  }

  const outputs = new Map<string, string | Buffer>();
  for (const doc of context.docs.values()) outputs.set(path.join(guidesDir, doc.output), convert(doc, context));
  let slugs: string[] = [];
  if (library.tutorials) {
    const index = path.join(repoDir, library.tutorials.dir, 'index.json');
    if (!stubbed && fs.existsSync(index)) slugs = readJson<string[]>(index);
    await convertTutorials(context, outputs, slugs);
  }
  if (context.errors.length) {
    throw new Error(`${library.repo} needs a fix before its docs can be published:\n  ${context.errors.join('\n  ')}`);
  }
  for (const [output, file] of context.media) outputs.set(path.join(guidesDir, output), fs.readFileSync(file));

  const sidebar = buildSidebar(roots, library, categoryOrder);
  outputs.set(path.join(ROOT, library.sidebarFile), `${JSON.stringify(sidebar, null, 2)}\n`);
  outputs.set(
    path.join(ROOT, library.llmsFile),
    typedocLlms === null ? buildLlms(sidebar, context) : `${typedocLlms}${library.llmsFooter ?? ''}`,
  );

  let written = 0;
  for (const [file, content] of outputs) if (writeIfChanged(file, content)) written++;
  const keep = new Set(outputs.keys());
  const generated = library.generatedGuideDirs.map((dir) => path.join(guidesDir, dir));
  if (library.tutorials) {
    const { out, pages } = library.tutorials;
    keep.add(path.join(ROOT, pages, 'index.md'));
    generated.push(path.join(ROOT, out), path.join(ROOT, pages));
    generated.push(path.join(ROOT, library.staticDir, 'images/tutorials', library.id));
  }
  let deleted = 0;
  for (const dir of generated) deleted += prune(dir, keep);

  const { links, code, admonitions, embeds } = context.counts;
  if (code) warn(`${library.id} API isn't hosted yet; ${code} links render as code`);
  console.log(
    `docs ${context.docs.size}, links ${links}, admonitions ${admonitions}, embeds ${embeds}, media ${context.media.size}` +
      (library.tutorials ? `, tutorials ${slugs.length}` : ''),
  );
  console.log(`${library.pkg} ${installedPackage(library.pkg).version}: ${written} files written, ${deleted} deleted`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
