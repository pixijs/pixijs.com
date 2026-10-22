/**
 * Writes the import-map registry the editor runs code with, and the files the site serves for it:
 * `npm run generate:runtime`.
 *
 * `src/data/generated/runtime.json` maps bare specifiers to URLs for pixi.js 8 (with `@pixi/3d` and the add-ons the
 * examples use) and for the frozen 7.x docs, plus the declaration files Monaco loads. Installed packages are served
 * at their installed (locked) versions; the others are pinned in `PINNED`. `static-runtime/` holds:
 * - `runtime/pixi.js@<v>/<subpath>.mjs`: ES modules for the pixi.js subpaths `pixi.min.mjs` doesn't register
 * - `pixi-3d/<v>[-<sha7>]/`: the `@pixi/3d` CDN build when it's installed from a `file:` tarball, and `types.json`
 *
 * Installing `@pixi/3d` from npm instead switches its URLs to jsDelivr; nothing else changes. The script fails when an
 * add-on doesn't import `pixi.js` bare (it would load a second pixi.js), when a pinned file doesn't exist, when a
 * pixi.js subpath can't be served, or when a generated module doesn't load or exports nothing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { PIXI_V7_VERSION } from '../src/data/packages.ts';
import { prune, writeIfChanged } from './shared.mts';

interface Manifest {
  version: string;
  gitHead?: string;
  exports?: Record<string, string | { import?: string | { types?: string; default?: string }; default?: string }>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/** A package served from jsDelivr that the site doesn't install */
interface Pin {
  version: string;
  file: string;
  /** Plugs into pixi.js, so it must import `pixi.js` bare */
  addon?: boolean;
}

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'static-runtime');
const DATA_FILE = path.join(ROOT, 'src/data/generated/runtime.json');
const JSDELIVR = 'https://cdn.jsdelivr.net/npm';

const PINNED: Record<string, Pin> = {
  '@esotericsoftware/spine-pixi-v8': { version: '4.3.7', file: 'dist/esm/spine-pixi-v8.min.mjs', addon: true },
  three: { version: '0.182.0', file: 'build/three.module.min.js' },
};

const BARE_PIXI = /\b(?:from|import)\s*["']pixi\.js["']/;
const REGISTRATION = /\bextensions\.add\(([^)]*)\)/g;
const SIDE_EFFECT_IMPORT = /^import\s+['"](\.[^'"]+)['"];?$/gm;
const SOURCE_MAP = /\n\/\/# sourceMappingURL=\S+\s*$/;

const read = (file: string) => fs.readFileSync(file, 'utf8');
const manifest = (dir: string): Manifest => JSON.parse(read(path.join(dir, 'package.json')));
const moduleDir = (name: string) => path.join(ROOT, 'node_modules', name);

/** The installed copy of `file` in package `name`, which jsDelivr serves at the same path for that version */
function packageFile(name: string, file: string): string {
  const full = path.join(moduleDir(name), file);
  if (!fs.existsSync(full)) throw new Error(`${name} has no ${file}; fix its URL in scripts/runtime.mts`);
  return full;
}

function assertBarePixi(label: string, code: string): void {
  if (!BARE_PIXI.test(code)) {
    throw new Error(
      `${label} doesn't import pixi.js bare, so it would run against a second pixi.js; serve another file`,
    );
  }
}

/** Checks a pinned file exists and, for an add-on, imports pixi.js bare; skipped with a warning when offline */
async function checkPin(name: string, pin: Pin, url: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  } catch (error) {
    console.log(`warning: couldn't fetch ${url} to check it (${(error as Error).message})`);
    return;
  }
  if (!response.ok) throw new Error(`${name}@${pin.version}: ${url} is ${response.status}`);
  if (pin.addon) assertBarePixi(url, await response.text());
}

/** Names an init module passes to `extensions.add`, following its side-effect imports */
function registrations(file: string): string[] {
  const code = read(file);
  const own = [...code.matchAll(REGISTRATION)].flatMap(([, args]) => args.split(',').map((name) => name.trim()));
  const imported = [...code.matchAll(SIDE_EFFECT_IMPORT)].flatMap(([, spec]) =>
    registrations(path.resolve(path.dirname(file), spec)),
  );
  return [...own, ...imported].filter(Boolean);
}

/**
 * Serves every `pixi.js/<subpath>` from the one pixi.js the map loads. A subpath with an IIFE build in
 * `dist/packages` gets a wrapper that runs it against that pixi.js. Otherwise its init module's registrations
 * decide: all in `pixi.min.mjs` maps it to pixi.js itself; the rest get a module that registers them.
 */
function pixiSubpaths(pkg: Manifest, pixiUrl: string, files: Map<string, string>): Record<string, string> {
  const dir = moduleDir('pixi.js');
  const bundled = new Set(registrations(path.join(dir, 'dist/pixi.mjs')));
  const imports: Record<string, string> = {};

  for (const [key, target] of Object.entries(pkg.exports ?? {})) {
    if (key === '.' || key === './package.json') continue;
    const subpath = key.slice(2);
    const url = `/runtime/pixi.js@${pkg.version}/${subpath}.mjs`;
    const out = path.join(OUT_DIR, url);
    const iife = path.join(dir, `dist/packages/${subpath}.min.js`);

    if (fs.existsSync(iife)) {
      const build = read(path.join(dir, `dist/packages/${subpath}.js`));
      const names = [...new Set([...build.matchAll(/exports\.(\w+) = /g)].map(([, name]) => name))];
      if (!names.length) throw new Error(`pixi.js/${subpath}: dist/packages/${subpath}.js exports nothing`);
      const wrapper = [
        "import * as pixi from 'pixi.js';",
        'const PIXI = { ...pixi };',
        `(function () {\n${read(iife).replace(SOURCE_MAP, '')}\n}).call({ PIXI });`,
        `export const { ${names.join(', ')} } = PIXI;`,
      ];

      files.set(out, `${wrapper.join('\n')}\n`);
      imports[`pixi.js/${subpath}`] = url;
      continue;
    }

    const conditions = typeof target === 'string' ? target : (target.import ?? target.default);
    const entry = typeof conditions === 'string' ? conditions : conditions?.default;
    const names = entry ? registrations(path.join(dir, entry)) : [];
    const missing = names.filter((name) => !bundled.has(name));

    if (!names.length) throw new Error(`pixi.js/${subpath} registers nothing and has no IIFE build to wrap`);
    if (!missing.length) {
      imports[`pixi.js/${subpath}`] = pixiUrl;
      continue;
    }
    files.set(
      out,
      `import { extensions, ${missing.join(', ')} } from 'pixi.js';\n\nextensions.add(${missing.join(', ')});\n`,
    );
    imports[`pixi.js/${subpath}`] = url;
  }

  return imports;
}

/** Loads each generated pixi.js module in Node against the installed pixi.js; a wrapper's exports must all be set */
async function checkPixiModules(files: Map<string, string>): Promise<void> {
  const modules = [...files.keys()].filter((file) => file.startsWith(path.join(OUT_DIR, 'runtime')));

  for (const file of modules) {
    const exports: Record<string, unknown> = await import(pathToFileURL(file).href);
    const unset = Object.keys(exports).filter((name) => exports[name] === undefined);

    if (unset.length) throw new Error(`${path.relative(ROOT, file)} exports nothing for ${unset.join(', ')}`);
  }
}

/**
 * Maps `@pixi/3d` and each of its subpaths to its CDN build, copies the build when it's vendored, and writes
 * `types.json` (every `.d.ts`, plus an `index.d.ts` per export) for Monaco
 */
function pixi3d(files: Map<string, string>): { imports: Record<string, string>; types: string } {
  const dir = moduleDir('@pixi/3d');
  if (!fs.existsSync(dir)) throw new Error("@pixi/3d isn't installed; run npm install");
  const pkg = manifest(dir);
  const site = manifest(ROOT);
  const spec = site.dependencies?.['@pixi/3d'] ?? site.devDependencies?.['@pixi/3d'];
  const vendored = spec?.startsWith('file:') ?? false;
  const folder = `/pixi-3d/${pkg.version}${pkg.gitHead ? `-${pkg.gitHead.slice(0, 7)}` : ''}/`;
  const base = vendored ? folder : `${JSDELIVR}/@pixi/3d@${pkg.version}/dist/`;
  const dist = path.join(dir, 'dist');
  const imports: Record<string, string> = {};
  const types: Record<string, string> = {};
  // `@pixi/3d` relies on two pixi.js changes from a dev build after 8.22.0: `BindGroup.setResourceUnwatched`, and depth
  // on multisampled render targets. Without the second, a WebGL app with `useBackBuffer` and `antialias` (the glass
  // examples) draws nothing once a View3D renders, because its depth texture can't join the multisampled back buffer.
  // While the installed pixi.js lacks them, every entry maps to a wrapper that first falls back to the watched
  // `setResource` and keeps the back buffer single-sampled.
  const compat = !read(packageFile('pixi.js', 'lib/rendering/renderers/gpu/shader/BindGroup.mjs')).includes(
    'setResourceUnwatched',
  );

  if (compat) {
    files.set(
      path.join(OUT_DIR, folder, 'compat.mjs'),
      `import { BindGroup, GlBackBufferSystem } from 'pixi.js';

BindGroup.prototype.setResourceUnwatched ??= BindGroup.prototype.setResource;

const initBackBuffer = GlBackBufferSystem.prototype.init;

GlBackBufferSystem.prototype.init = function (options) {
  initBackBuffer.call(this, options);
  this._antialias = false;
};
`,
    );
  }

  for (const [key, target] of Object.entries(pkg.exports ?? {})) {
    if (key === './package.json') continue;
    const subpath = key.slice(2);
    const file = `pixi-3d${subpath ? `-${subpath}` : ''}.min.mjs`;

    assertBarePixi(`@pixi/3d ${file}`, read(packageFile('@pixi/3d', `dist/${file}`)));
    const specifier = `@pixi/3d${subpath ? `/${subpath}` : ''}`;

    if (compat) {
      const wrapper = `compat-${file}`;
      const target = vendored ? `./${file}` : `${base}${file}`;

      files.set(path.join(OUT_DIR, folder, wrapper), `import './compat.mjs';\nexport * from '${target}';\n`);
      imports[specifier] = `${folder}${wrapper}`;
    } else {
      imports[specifier] = `${base}${file}`;
    }

    const declarations = typeof target === 'object' && typeof target.import === 'object' ? target.import.types : null;
    if (declarations) {
      const stub = subpath ? `${subpath}/index.d.ts` : 'index.d.ts';
      const from = path.posix.relative(
        path.posix.dirname(stub),
        declarations.replace(/^\.\//, '').replace(/\.d\.ts$/, ''),
      );
      types[stub] = `export * from '${from.startsWith('.') ? from : `./${from}`}';\n`;
    }
  }

  for (const file of fs.readdirSync(dist, { recursive: true, encoding: 'utf8' })) {
    const full = path.join(dist, file);
    if (path.basename(file).startsWith('.')) continue;
    if (file.endsWith('.d.ts')) types[`dist/${file.split(path.sep).join('/')}`] = read(full);
    if (vendored && /^pixi-3d.*\.min\.mjs$/.test(file)) {
      files.set(path.join(OUT_DIR, folder, file), read(full).replace(SOURCE_MAP, ''));
    }
  }
  files.set(path.join(OUT_DIR, folder, 'types.json'), JSON.stringify(types));

  return { imports, types: `${folder}types.json` };
}

async function main(): Promise<void> {
  const files = new Map<string, string>();
  const pixi = manifest(moduleDir('pixi.js'));
  const pixiUrl = `${JSDELIVR}/pixi.js@${pixi.version}/dist/pixi.min.mjs`;

  packageFile('pixi.js', 'dist/pixi.min.mjs');
  packageFile('pixi.js', 'dist/pixi.js.d.ts');

  const filters = manifest(moduleDir('pixi-filters'));
  const filtersFile = 'dist/pixi-filters.mjs';
  assertBarePixi(`pixi-filters ${filtersFile}`, read(packageFile('pixi-filters', filtersFile)));

  const gsap = manifest(moduleDir('gsap'));
  const gsapUrl = (file: string) => `${JSDELIVR}/gsap@${gsap.version}/${file}`;
  const gsapPlugins = fs
    .readdirSync(moduleDir('gsap'))
    .filter((file) => file.endsWith('.js') && file !== 'index.js')
    .sort();

  const pinned = Object.entries(PINNED).map(([name, pin]) => [name, `${JSDELIVR}/${name}@${pin.version}/${pin.file}`]);
  const threeD = pixi3d(files);
  const v7 = `${JSDELIVR}/pixi.js@${PIXI_V7_VERSION}/dist/pixi.min.mjs`;
  const registry = {
    8: {
      'pixi.js': pixiUrl,
      ...pixiSubpaths(pixi, pixiUrl, files),
      ...threeD.imports,
      'pixi-filters': `${JSDELIVR}/pixi-filters@${filters.version}/${filtersFile}`,
      gsap: gsapUrl('index.js'),
      ...Object.fromEntries(gsapPlugins.map((file) => [`gsap/${file.replace(/\.js$/, '')}`, gsapUrl(file)])),
      ...Object.fromEntries(pinned),
    },
    7: {
      'pixi.js': v7,
      '@pixi/core': v7,
      '@pixi/graphics': v7,
      '@pixi/math': v7,
      '@pixi/display': v7,
      '@pixi/graphics-extras': `https://esm.sh/@pixi/graphics-extras@${PIXI_V7_VERSION}?external=@pixi/core,@pixi/graphics`,
      '@pixi/math-extras': `https://esm.sh/@pixi/math-extras@${PIXI_V7_VERSION}?external=@pixi/core,@pixi/math`,
    },
    types: {
      [`pixi.js@${pixi.version}`]: `${JSDELIVR}/pixi.js@${pixi.version}/dist/pixi.js.d.ts`,
      '@pixi/3d': threeD.types,
    },
  };

  await Promise.all(pinned.map(([name, url]) => checkPin(name, PINNED[name], url)));
  const written = [...files].filter(([file, content]) => writeIfChanged(file, content)).length;

  await checkPixiModules(files);
  writeIfChanged(DATA_FILE, `${JSON.stringify(registry, null, 2)}\n`);
  const deleted = prune(OUT_DIR, new Set(files.keys()));

  console.log(
    `runtime: pixi.js ${pixi.version}, @pixi/3d at ${threeD.imports['@pixi/3d']}, ` +
      `${files.size} files (${written} written, ${deleted} deleted)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
