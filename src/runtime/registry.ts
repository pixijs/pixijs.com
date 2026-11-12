import runtime from '../data/generated/runtime.json';

/** An import map's `imports`: bare specifier to absolute URL */
export type Imports = Record<string, string>;

/** The pixi.js major a run targets: 8 (with `@pixi/3d`) or 7 (the frozen 7.x docs) */
export type RuntimeMajor = 7 | 8;

const registry: Record<'7' | '8' | 'types', Record<string, string>> = runtime;

/** Declarations for the code editor: `pixi.js@<version>` → pixi.js's bundled `.d.ts`, `@pixi/3d` → its `types.json` */
export const runtimeTypes = registry.types;

/** The package a bare specifier names: `name` or `@scope/name` */
function packageName(spec: string): string {
  return spec.split('/', spec.startsWith('@') ? 2 : 1).join('/');
}

/**
 * A URL for a bare specifier the registry doesn't list, from esm.sh with every package the registry maps kept
 * external, so the module shares their single instances (one pixi.js) through the import map
 * @param spec - Bare specifier, like `lodash-es` or `@scope/pkg/sub`
 * @param range - Version or range; latest when empty
 * @param major - The registry whose packages stay external
 */
export function resolveBare(spec: string, range = '', major: RuntimeMajor = 8): string {
  const name = packageName(spec);
  const external = [...new Set(Object.keys(registry[`${major}`]).map(packageName))].join(',');

  return `https://esm.sh/${name}${range ? `@${range}` : ''}${spec.slice(name.length)}?external=${external}`;
}

/**
 * The import map for a run: the registry for `major` with absolute URLs, plus the code's bare specifiers it lacks
 * @param major - pixi.js major
 * @param specs - Bare specifiers the code imports
 * @param dependencies - Version ranges by package name, for the specifiers the registry lacks
 */
export function importMap(major: RuntimeMajor, specs: string[], dependencies: Record<string, string> = {}): Imports {
  const imports: Imports = {};

  for (const [spec, url] of Object.entries(registry[`${major}`])) imports[spec] = new URL(url, location.origin).href;
  for (const spec of specs) imports[spec] ??= resolveBare(spec, dependencies[packageName(spec)], major);

  return imports;
}
