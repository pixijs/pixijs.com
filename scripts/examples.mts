/**
 * Builds a library's example sources and the example data that the gallery, `<PixiExample>` and the preview
 * capture read: `node scripts/examples.mts [2d|3d]` (`npm run generate:examples` runs it for pixi.js). Everything
 * library-specific comes from `scripts/libraries.mts`.
 *
 * Examples come from the library's `.repos` checkout (its gallery folder, plus the hidden `__docs__/examples`
 * snippets under `src` that the guides embed) and, for pixi.js, from the site's own `blog/examples`. TypeScript is
 * stripped to JavaScript, dependencies are inferred from imports, and every `<PixiExample>` for the library in its
 * docs folders must name one of them.
 *
 * The library's example assets are served at `/<publishedAssets>` from its static folder, beside the site's own
 * `static/assets`. Every `https://pixijs.com/assets/` URL in the examples and docs must be a file the site serves.
 */
import fs from 'node:fs';
import path from 'node:path';

import type { Item } from '../src/components/Examples/types';
import { getLibrary, LIBRARIES, type Library } from './libraries.mts';
import { formatScript, installedPackage, PIXI_EXAMPLE, prune, readScript, writeIfChanged } from './shared.mts';

/** An example on disk: a single script, or a folder whose entry is `index` */
interface Source {
  name: string;
  path: string;
  hidden: boolean;
}

const ROOT = process.cwd();
const STATIC_DIR = path.join(ROOT, 'static');
const NOT_EXAMPLES = new Set(['assets', 'shared']);

const SCRIPT = /\.[jt]s$/;
const HEADER = /^(?:\/\/\s*description:.*\r?\n)+/;
const IMPORT =
  /^\s*(?:import|export)\s*(?:[\w$*{},\s]+?\s*from\s*)?['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)/gm;
const SHARED_IMPORT = /(['"])\.\.\/shared\/([^'"]+)\1/g;
const LOCAL_IMPORT = /(['"])\.\/([^'"]+)\1/g;
const ASSET_URL = /https:\/\/pixijs\.com\/(assets\/[^\s'"`)?#]+)/g;

const toPosix = (file: string) => file.split(path.sep).join('/');
const warn = (message: string) => console.log(`warning: ${message}`);

function listSources(dir: string, hidden: Set<string> | true): Source[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !NOT_EXAMPLES.has(entry.name) && (entry.isDirectory() || SCRIPT.test(entry.name)))
    .map((entry) => {
      const name = entry.name.replace(SCRIPT, '');

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

/** Rewrites `../shared/x` imports to `./x` and adds the shared files they reach, transitively */
function addSharedFiles(files: Map<string, string>, sharedDir: string): void {
  const shared = fs.existsSync(sharedDir) ? fs.readdirSync(sharedDir) : [];
  const findShared = (spec: string) => shared.find((file) => file === spec || file.replace(SCRIPT, '') === spec);
  const pending: string[] = [];

  for (const [name, code] of files) {
    if (!name.endsWith('.js')) continue;
    files.set(
      name,
      code.replace(SHARED_IMPORT, (match, quote: string, spec: string) => {
        const file = findShared(spec);

        if (!file) return match;
        pending.push(file);

        return `${quote}./${spec}${quote}`;
      }),
    );
  }

  while (pending.length) {
    const file = pending.pop()!;
    const name = file.replace(/\.ts$/, '.js');

    if (files.has(name)) continue;
    const code = readScript(path.join(sharedDir, file));

    files.set(name, code);
    for (const [, , spec] of code.matchAll(LOCAL_IMPORT)) {
      const next = findShared(spec);

      if (next) pending.push(next);
    }
  }
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
    const manifest = `${library.repo}/${library.examples.dir}/package.json`;

    throw new Error(`${name} imports ${unknown.join(', ')}, which ${manifest} doesn't list`);
  }

  return Object.fromEntries([...packages].sort().map((pkg) => [pkg, versions[pkg]]));
}

async function buildExample(
  source: Source,
  library: Library,
  versions: Record<string, string>,
  output: Map<string, string>,
) {
  const single = fs.statSync(source.path).isFile();
  const inputs: [string, string][] = single
    ? [['index.js', source.path]]
    : fs
        .readdirSync(source.path, { recursive: true, encoding: 'utf8' })
        .filter((file) => !path.basename(file).startsWith('.') && fs.statSync(path.join(source.path, file)).isFile())
        .map((file) => [toPosix(file).replace(/\.ts$/, '.js'), path.join(source.path, file)]);
  const files = new Map(inputs.map(([name, file]) => [name, readScript(file)]));

  addSharedFiles(files, path.join(ROOT, library.examples.sharedDir));

  const header = HEADER.exec(files.get('index.js') ?? '')?.[0] ?? '';
  const example: Item = {
    name: source.name,
    pkg: library.id,
    description: /description:\s*(.*)/.exec(header)?.[1].trim() ?? '',
    dependencies: inferDependencies(source.name, files, library, versions),
    files: [],
  };

  if (source.hidden) example.hidden = true;

  for (const [name, code] of [...files].sort(([a], [b]) => a.localeCompare(b))) {
    const location = single ? `${source.name}.js` : `${source.name}/${name}`;
    const content = name.endsWith('.js') ? await formatScript(code.replace(HEADER, '')) : code;

    example.files.push({ name, location });
    output.set(location, content);
  }

  return example;
}

/** The library's assets by their published path; a site copy of one of them throws, so there's one source */
function collectAssets(library: Library): Map<string, string> {
  const assetsDir = path.join(ROOT, library.repo, library.examples.assets);
  const assets = new Map<string, string>();
  const duplicates: string[] = [];

  if (!fs.existsSync(assetsDir)) return assets;
  for (const file of fs.readdirSync(assetsDir, { recursive: true, encoding: 'utf8' })) {
    const source = path.join(assetsDir, file);

    if (path.basename(file).startsWith('.') || !fs.statSync(source).isFile()) continue;
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
 * Every `<PixiExample>` for the library in its docs folders must be one of its examples, and every
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
  const pages = scanDocs
    .flatMap((dir) => fs.globSync(`${dir}/**/*.{md,mdx}`, { cwd: ROOT }))
    .map((file): [string, string] => [file, fs.readFileSync(path.join(ROOT, file), 'utf8')]);
  const sources = [...output].map(([location, code]): [string, string] => [`${source}/${location}`, code]);
  const examples = pages.flatMap(([file, text]) =>
    [...text.matchAll(PIXI_EXAMPLE)]
      .filter(([, name, pkg = '2d']) => pkg === library.id && !names.has(name))
      .map(([, name]) => `${file}: <PixiExample name="${name}"> isn't a ${library.id} example`),
  );
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
    const manifest = path.join(ROOT, library.repo, config.dir, 'package.json');
    const { dependencies = {} } = fs.existsSync(manifest)
      ? (JSON.parse(fs.readFileSync(manifest, 'utf8')) as { dependencies?: Record<string, string> })
      : {};
    const versions: Record<string, string> = {
      ...Object.fromEntries(Object.entries(dependencies).filter(([pkg]) => !pkg.startsWith('@types/'))),
      [library.pkg]: installedPackage(library.pkg).version,
    };

    for (const source of collectSources(library)) {
      examples.push(await buildExample(source, library, versions, output));
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
