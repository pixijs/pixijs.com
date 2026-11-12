/**
 * Builds a library's example sources and the example data that the gallery, `<PixiExample>` and the preview
 * capture read: `node scripts/examples.mts [2d|3d]` (`npm run generate:examples` runs it for pixi.js). Everything
 * library-specific comes from `scripts/libraries.mts`.
 *
 * Examples come from the library's `.repos` checkout (its gallery folder, plus the hidden `__docs__/examples`
 * snippets under `src` that the guides embed) and, for pixi.js, from the site's own `blog/examples`. TypeScript is
 * stripped to JavaScript, dependencies are inferred from imports, and every `<PixiExample>` and gallery link for the
 * library in its docs folders must name one of them.
 *
 * An example's files are its own scripts and shaders plus what they import from outside its folder: shared files at
 * their path in the shared folder, the site's stub for each module it replaces, and a `manifest.js` with the URLs of
 * the assets the example loads by name. Its title is the H1 of its `README.md`, and its description the
 * `// description:` header or the first paragraph of the doc comment that opens the entry.
 *
 * The library's example assets are served at `/<publishedAssets>` from its static folder, beside the site's own
 * `static/assets`. Every `https://pixijs.com/assets/` URL in the examples and docs must be a file the site serves.
 */
import { init, parse } from 'es-module-lexer';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import type { Item } from '../src/components/Examples/types';
import { getLibrary, LIBRARIES, type Library } from './libraries.mts';
import { formatScript, installedPackage, PIXI_EXAMPLE, prune, readScript, writeIfChanged } from './shared.mts';

/** An example on disk: a single script, or a folder whose entry is `index` */
interface Source {
  name: string;
  path: string;
  hidden: boolean;
}

/** The remote URL of each file the library's asset manifest names, by the path its functions return */
interface AssetManifest {
  /** Where it is, for the comment that opens each example's copy: `pixi-3d's examples/assets/manifest.ts` */
  label: string;
  module: Record<string, unknown>;
  urls: Map<string, string>;
}

const ROOT = process.cwd();
const STATIC_DIR = path.join(ROOT, 'static');
const SITE_ASSETS = 'https://pixijs.com/';

const SCRIPT = /\.[jt]s$/;
/** What an example runs: scripts, and the shader and text files the editor imports as strings */
const RUNNABLE = /\.([jt]s|frag|vert|wgsl|glsl|txt|svg)$/;
/** pixi-3d's playground runs these, but they aren't published */
const UNPUBLISHED = /\.example\.[jt]s$/;
/** The comment lines that open a pixi.js example; the site infers `dependencies` from its imports */
const HEADER = /^(?:\/\/\s*(?:description|dependencies):.*\r?\n)+/;
const DOC_COMMENT = /^\s*\/\*\*([\s\S]*?)\*\//;
const IMPORT =
  /^\s*(?:import|export)\s*(?:[\w$*{},\s]+?\s*from\s*)?['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)/gm;
const ASSET_URL = /https:\/\/pixijs\.com\/(assets\/[^\s'"`)?#]+)/g;
/** GitHub's raw file host, which isn't a CDN; jsDelivr serves the same files */
const RAW_GITHUB = /^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\//;

const toPosix = (file: string) => file.split(path.sep).join('/');
const withoutScriptExtension = (file: string) => file.replace(SCRIPT, '');
const warn = (message: string) => console.log(`warning: ${message}`);

function listSources(dir: string, hidden: Set<string> | true): Source[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) =>
      entry.isDirectory()
        ? ['index.ts', 'index.js'].some((file) => fs.existsSync(path.join(dir, entry.name, file)))
        : SCRIPT.test(entry.name) && !UNPUBLISHED.test(entry.name),
    )
    .map((entry) => {
      const name = withoutScriptExtension(entry.name);

      return { name, path: path.join(dir, entry.name), hidden: hidden === true || hidden.has(name) };
    });
}

/** The library's docs snippets, then its gallery examples (which win a name clash), then the site's own */
function collectSources(library: Library): Source[] {
  const repo = path.join(ROOT, library.repo);
  const { dir, siteDir, hidden } = library.examples;
  const sources = new Map<string, Source>();
  const snippetDirs = fs.globSync('src/**/__docs__/examples', { cwd: repo }).sort();

  for (const source of snippetDirs.flatMap((snippets) => listSources(path.join(repo, snippets), true))) {
    sources.set(source.name, source);
  }
  for (const source of listSources(path.join(repo, dir), hidden)) {
    if (sources.has(source.name)) warn(`${library.repo} example ${source.name} replaces a docs snippet`);
    sources.set(source.name, source);
  }
  for (const source of siteDir ? listSources(path.join(ROOT, siteDir), hidden) : []) {
    if (sources.has(source.name)) {
      throw new Error(`${siteDir}/${source.name} now exists in ${library.repo}: delete the site copy`);
    }
    sources.set(source.name, source);
  }

  return [...sources.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** The file a relative import names: as written, with a script extension, or a folder's `index` */
function resolveImport(target: string): string | undefined {
  return [
    target,
    `${target}.ts`,
    `${target}.js`,
    path.join(target, 'index.ts'),
    path.join(target, 'index.js'),
    target.replace(/\.js$/, '.ts'),
  ].find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
}

/** A relative specifier from one editor file to another, without `.js` when the original left it off */
function editorSpecifier(from: string, to: string, original: string): string {
  const relative = path.posix.relative(path.posix.dirname(from), to);
  const specifier = relative.startsWith('.') ? relative : `./${relative}`;

  return SCRIPT.test(original) ? specifier : specifier.replace(/\.js$/, '');
}

/** The files along an import cycle, which the editor's runner can't load, or undefined when there's none */
function findCycle(imports: Map<string, Set<string>>): string[] | undefined {
  const done = new Set<string>();
  const visit = (name: string, chain: string[]): string[] | undefined => {
    if (chain.includes(name)) return [...chain.slice(chain.indexOf(name)), name];
    if (done.has(name)) return undefined;
    for (const next of imports.get(name) ?? []) {
      const cycle = visit(next, [...chain, name]);

      if (cycle) return cycle;
    }
    done.add(name);

    return undefined;
  };

  for (const name of imports.keys()) {
    const cycle = visit(name, []);

    if (cycle) return cycle;
  }

  return undefined;
}

/**
 * The module that stands in for the library's asset manifest: the URL of every asset the example names in a call of
 * a manifest function, which must name it with a string literal
 * @param name - The example
 * @param importers - The code of each file that imports the manifest, and the names it imports
 * @param manifest - The library's asset manifest
 */
function manifestModule(name: string, importers: Map<string, string>, manifest: AssetManifest): string {
  const urls = new Map<string, string>();
  const functions = new Set<string>();

  for (const [code, imports] of importers) {
    if (!imports.trim()) throw new Error(`${name} imports the asset manifest without naming its functions`);
    for (const binding of imports.split(',').map((part) => part.trim())) {
      if (!binding) continue;
      const [imported, local = imported] = binding.split(/\s+as\s+/);
      const accessor = manifest.module[imported];
      const calls = [...code.matchAll(new RegExp(`\\b${local}\\(\\s*(['"])([^'"]+)\\1\\s*\\)`, 'g'))];

      if (typeof accessor !== 'function') throw new Error(`${name} imports ${imported} from the asset manifest`);
      if (calls.length !== code.match(new RegExp(`\\b${local}\\(`, 'g'))?.length) {
        throw new Error(`${name} calls ${imported}() with a name that isn't a string, so the site can't list its URL`);
      }
      functions.add(imported);
      for (const [, , asset] of calls) {
        const url = manifest.urls.get((accessor as (asset: string) => string)(asset));

        if (!url) throw new Error(`${name}: the asset manifest has no URL for ${asset}`);
        urls.set(asset, url.replace(RAW_GITHUB, 'https://cdn.jsdelivr.net/gh/$1/$2@$3/'));
      }
    }
  }
  const entries = [...urls].sort(([a], [b]) => a.localeCompare(b));

  return [
    `// The files this example loads, by their names in ${manifest.label}`,
    `const urls = { ${entries.map(([asset, url]) => `${JSON.stringify(asset)}: ${JSON.stringify(url)}`).join(', ')} };`,
    'const url = (name) => urls[name];',
    `export { ${[...functions].map((fn) => `url as ${fn}`).join(', ')} };`,
  ].join('\n');
}

/**
 * Reads an example's files, and those they import from outside its folder, by their name in the editor. Relative
 * imports are rewritten to match, and URLs of the library's local assets point at the published ones.
 * @returns The files, and the names of the example's own, which get a tab in the editor
 */
function readFiles(
  source: Source,
  library: Library,
  manifest: AssetManifest | undefined,
): { files: Map<string, string>; own: Set<string> } {
  const repo = path.join(ROOT, library.repo);
  const { dir, siteDir, localAssets, publishedAssets, stubs = {} } = library.examples;
  const sharedDirs = [path.join(repo, dir, 'shared'), ...(siteDir ? [path.join(ROOT, siteDir, 'shared')] : [])];
  const manifestFile = library.examples.manifest && path.join(repo, library.examples.manifest);
  const single = fs.statSync(source.path).isFile();
  const files = new Map<string, string>();
  /** Source file per editor name; a stub or the manifest has its path without extension */
  const origins = new Map<string, string>();
  const manifestImports = new Map<string, string>();
  /** The files each file imports, by editor name */
  const graph = new Map<string, Set<string>>();
  const pending: [name: string, file: string][] = single
    ? [['index.js', source.path]]
    : fs
        .readdirSync(source.path, { recursive: true, encoding: 'utf8' })
        .filter((file) => RUNNABLE.test(file) && !path.basename(file).startsWith('.'))
        .map((file) => [toPosix(file).replace(/\.ts$/, '.js'), path.join(source.path, file)]);
  const own = new Set(pending.map(([name]) => name));
  const isStub = (module: string) => Object.keys(stubs).some((stub) => path.join(repo, stub) === module);

  /** The editor name of an imported file: its path in the example's folder or in a shared folder */
  const nameOf = (file: string, from: string): string => {
    const folder = [...(single ? [] : [source.path]), ...sharedDirs].find((root) => file.startsWith(root + path.sep));

    if (!folder) {
      throw new Error(`${from} imports ${path.relative(ROOT, file)}, which isn't in the example or a shared folder`);
    }

    return toPosix(path.relative(folder, file)).replace(/\.ts$/, '.js');
  };

  for (const [name, file] of pending) origins.set(name, file);
  while (pending.length) {
    const [name, file] = pending.pop()!;

    if (files.has(name)) continue;
    let code = readScript(file);

    if (SCRIPT.test(file)) {
      let rewritten = '';
      let last = 0;

      // The lexer the editor's runner uses, so imports in comments and strings don't count
      for (const { n: spec, s: start, e: end, ss, se, d: dynamic } of parse(code, file)[0]) {
        if (!spec?.startsWith('./') && !spec?.startsWith('../')) continue;
        const target = path.resolve(path.dirname(file), spec);
        const module = withoutScriptExtension(target);
        const replaced = module === manifestFile || isStub(module);
        const resolved = replaced ? module : resolveImport(target);

        if (!resolved) throw new Error(`${path.relative(ROOT, file)}: can't find ${spec}`);
        const imported = replaced ? `${path.basename(module)}.js` : nameOf(resolved, path.relative(ROOT, file));
        const origin = origins.get(imported);

        if (origin && origin !== resolved) {
          throw new Error(`${source.name}: ${imported} would be both ${origin} and ${resolved}`);
        }
        if (!origin) {
          origins.set(imported, resolved);
          if (!replaced) pending.push([imported, resolved]);
        }
        graph.set(name, (graph.get(name) ?? new Set()).add(imported));
        if (module === manifestFile) manifestImports.set(code, /\{([^}]*)\}/.exec(code.slice(ss, se))?.[1] ?? '');
        const specifier = editorSpecifier(name, imported, spec);

        rewritten += code.slice(last, start) + (dynamic > -1 ? JSON.stringify(specifier) : specifier);
        last = end;
      }
      code = rewritten + code.slice(last);
      if (localAssets) code = code.replaceAll(localAssets, `${SITE_ASSETS}${publishedAssets}/`);
    }
    files.set(name, code);
  }
  const cycle = findCycle(graph);

  if (cycle) throw new Error(`${source.name} imports in a cycle, which the editor can't run: ${cycle.join(' → ')}`);
  for (const [name, origin] of origins) {
    if (files.has(name)) continue;
    if (origin === manifestFile) {
      if (!manifest) throw new Error(`${library.repo} has no asset manifest at ${library.examples.manifest}`);
      files.set(name, manifestModule(source.name, manifestImports, manifest));
    } else {
      files.set(name, stubs[toPosix(path.relative(repo, origin))]);
    }
  }

  return { files, own };
}

/** The `// description:` header, else the first paragraph of the entry's opening doc comment, as plain text */
function describe(entry: string): string {
  const header = HEADER.exec(entry)?.[0];

  if (header) return /description:\s*(.*)/.exec(header)?.[1].trim() ?? '';
  const comment = DOC_COMMENT.exec(entry)?.[1] ?? '';
  const [summary = ''] = comment
    .replace(/^[ \t]*\* ?/gm, '')
    .trim()
    .split(/\n\s*\n/);

  return summary.replace(/\s+/g, ' ').replaceAll('`', '');
}

function inferDependencies(
  name: string,
  files: Map<string, string>,
  library: Library,
  versions: Record<string, string>,
) {
  const packages = new Set<string>();

  for (const [file, code] of files) {
    if (!file.endsWith('.js')) continue;
    for (const [, staticSpec, dynamicSpec] of code.matchAll(IMPORT)) {
      const spec = staticSpec ?? dynamicSpec;

      if (spec.startsWith('.') || spec.startsWith('/')) continue;
      packages.add(spec.split('/', spec.startsWith('@') ? 2 : 1).join('/'));
    }
  }
  packages.delete('pixi.js');

  const unknown = [...packages].filter((pkg) => !versions[pkg]);

  if (unknown.length) {
    const manifest = `${library.repo}/${library.examples.packageJson}`;

    throw new Error(`${name} imports ${unknown.join(', ')}, which ${manifest} doesn't list`);
  }

  return Object.fromEntries([...packages].sort().map((pkg) => [pkg, versions[pkg]]));
}

async function buildExample(
  source: Source,
  library: Library,
  versions: Record<string, string>,
  manifest: AssetManifest | undefined,
  output: Map<string, string>,
) {
  const single = fs.statSync(source.path).isFile();
  const { files, own } = readFiles(source, library, manifest);
  const readme = single ? '' : path.join(source.path, 'README.md');
  const title = readme && fs.existsSync(readme) ? /^#\s+(.+)$/m.exec(fs.readFileSync(readme, 'utf8'))?.[1] : undefined;
  const example: Item = {
    name: source.name,
    pkg: library.id,
    description: describe(files.get('index.js') ?? ''),
    dependencies: inferDependencies(source.name, files, library, versions),
    files: [],
  };

  if (title) example.title = title.replaceAll('`', '');
  if (source.hidden) example.hidden = true;

  for (const [name, code] of [...files].sort(([a], [b]) => a.localeCompare(b))) {
    const location = single ? `${source.name}.js` : `${source.name}/${name}`;
    const content = name.endsWith('.js') ? await formatScript(code.replace(HEADER, '')) : code;

    example.files.push(own.has(name) ? { name, location } : { name, location, hidden: true });
    output.set(location, content);
  }

  return example;
}

/** The library's asset manifest, and the remote URL of each file it lists by the path its functions return */
async function readManifest(library: Library): Promise<AssetManifest | undefined> {
  const { manifest } = library.examples;

  if (!manifest) return undefined;
  const module = (await import(pathToFileURL(path.join(ROOT, library.repo, `${manifest}.ts`)).href)) as Record<
    string,
    unknown
  >;
  const assetEntries = module.assetEntries as
    ((category: Record<string, unknown>) => { url: string; path: string }[]) | undefined;

  if (typeof assetEntries !== 'function') throw new Error(`${library.repo}/${manifest} no longer exports assetEntries`);
  const categories = Object.values(module).filter(
    (value): value is Record<string, unknown> => !!value && typeof value === 'object',
  );

  return {
    label: `${path.basename(library.repo)}'s ${manifest}.ts`,
    module,
    urls: new Map(categories.flatMap(assetEntries).map((entry) => [entry.path, entry.url])),
  };
}

/** The library's assets by their published path; a site copy of one of them throws, so there's one source */
function collectAssets(library: Library): Map<string, string> {
  const assetsDir = path.join(ROOT, library.repo, library.examples.assets);
  const assets = new Map<string, string>();
  const duplicates: string[] = [];

  if (!fs.existsSync(assetsDir)) return assets;
  for (const file of fs.readdirSync(assetsDir, { recursive: true, encoding: 'utf8' })) {
    const source = path.join(assetsDir, file);

    // Scripts, such as the asset manifest, aren't assets
    if (path.basename(file).startsWith('.') || SCRIPT.test(file) || !fs.statSync(source).isFile()) continue;
    const published = `${library.examples.publishedAssets}/${toPosix(file)}`;

    if (fs.existsSync(path.join(STATIC_DIR, published))) duplicates.push(`static/${published}`);
    assets.set(published, source);
  }
  if (duplicates.length) {
    throw new Error(
      `${library.repo} assets now include these, so delete the site copies:\n  ${duplicates.join('\n  ')}`,
    );
  }

  return assets;
}

/**
 * Every `<PixiExample>` and gallery link for the library in its docs folders must be one of its examples, and every
 * `https://pixijs.com/assets/` URL in those docs and its examples a file the site serves: one of the library's
 * assets, or a file in `static/` or another library's static folder
 */
function validateReferences(
  library: Library,
  names: Set<string>,
  output: Map<string, string>,
  assets: Map<string, string>,
): void {
  const { scanDocs, source } = library.examples;
  const others = Object.values(LIBRARIES).filter((other) => other.id !== library.id);
  const served = [STATIC_DIR, ...others.map((other) => path.join(ROOT, other.staticDir))];
  const gallery = library.guidesPath.replace('guides/', 'examples');
  const galleryLink = new RegExp(`\\(${gallery.replaceAll('.', '\\.')}/?\\?example=([\\w.-]+)`, 'g');
  const pages = scanDocs
    .flatMap((dir) => fs.globSync(`${dir}/**/*.{md,mdx}`, { cwd: ROOT }))
    .map((file): [string, string] => [file, fs.readFileSync(path.join(ROOT, file), 'utf8')]);
  const sources = [...output].map(([location, code]): [string, string] => [`${source}/${location}`, code]);
  const examples = pages.flatMap(([file, text]) => [
    ...[...text.matchAll(PIXI_EXAMPLE)]
      .filter(([, name, pkg = '2d']) => pkg === library.id && !names.has(name))
      .map(([, name]) => `${file}: <PixiExample name="${name}"> isn't a ${library.id} example`),
    ...[...text.matchAll(galleryLink)]
      .filter(([, name]) => !names.has(name))
      .map(([, name]) => `${file}: ${gallery}?example=${name} isn't a ${library.id} example`),
  ]);
  const urls = [...pages, ...sources].flatMap(([file, text]) =>
    [...text.matchAll(ASSET_URL)]
      .filter(([, asset]) => !assets.has(asset) && !served.some((dir) => fs.existsSync(path.join(dir, asset))))
      .map(([url]) => `${file}: ${url} isn't a file the site serves`),
  );

  if (library.draft) {
    for (const problem of examples) warn(problem);
  }
  const problems = library.draft ? urls : [...examples, ...urls];

  if (problems.length) throw new Error(`Broken references:\n  ${problems.join('\n  ')}`);
}

async function main(): Promise<void> {
  const library = getLibrary(process.argv[2]);
  const { examples: config } = library;
  const outDir = path.join(ROOT, config.source);
  const dataFile = path.join(ROOT, config.data);
  const assetsDir = path.join(ROOT, library.staticDir, config.publishedAssets);
  const output = new Map<string, string>();
  const examples: Item[] = [];
  let assets = new Map<string, string>();

  if (library.stub && !fs.existsSync(path.join(ROOT, library.repo))) {
    if (library.stub.required) throw new Error(`${library.repo} is missing, and ${library.name} examples are required`);
    warn(`no ${library.repo}, so there are no ${library.id} examples`);
  } else {
    const packageJson = path.join(ROOT, library.repo, config.packageJson);
    const { dependencies = {}, devDependencies = {} } = JSON.parse(fs.readFileSync(packageJson, 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const versions: Record<string, string> = {
      ...Object.fromEntries(
        Object.entries({ ...devDependencies, ...dependencies }).filter(([pkg]) => !pkg.startsWith('@types/')),
      ),
      [library.pkg]: installedPackage(library.pkg).version,
    };
    const manifest = await readManifest(library);

    await init;

    for (const source of collectSources(library)) {
      examples.push(await buildExample(source, library, versions, manifest, output));
    }
    const names = new Set(examples.map((example) => example.name));

    assets = collectAssets(library);
    for (const name of config.hidden) {
      if (!names.has(name)) warn(`hidden has ${name}, which isn't an example; delete it`);
    }
    validateReferences(library, names, output, assets);
  }

  const files = new Map<string, string | Buffer>([[dataFile, `${JSON.stringify(examples, null, 2)}\n`]]);

  for (const [location, code] of output) files.set(path.join(outDir, location), code);
  for (const [published, source] of assets) {
    files.set(path.join(ROOT, library.staticDir, published), fs.readFileSync(source));
  }
  for (const [file, content] of files) writeIfChanged(file, content);
  const keep = new Set(files.keys());

  prune(outDir, keep);
  prune(assetsDir, keep);

  const visible = examples.filter((example) => !example.hidden);

  for (const { name } of visible) {
    if (!fs.existsSync(path.join(ROOT, config.previews, `${name}.webp`))) warn(`no preview: ${name}`);
  }
  console.log(
    `examples ${examples.length}, hidden ${examples.length - visible.length}, files ${output.size}, assets ${assets.size}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
