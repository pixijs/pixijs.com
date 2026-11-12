import { init, parse } from 'es-module-lexer';

/** Source files by path, like `index.js` or `src/scene.ts` */
export type SourceFiles = Record<string, string>;

/**
 * How modules reference each other: `data` inlines each one as a `data:` URL for the runner frame; `relative` keeps
 * them as files (`.ts` → `.js`, `wave.frag` → `wave.frag.js`) for exporting a project
 */
export type LinkMode = 'data' | 'relative';

export interface Compiled {
  /** What to import to run the code */
  entryUrl: string;
  /** Module URL → the source file it came from */
  urlToFile: Map<string, string>;
  /** Module URL → its compiled code */
  modules: Map<string, string>;
  /** Bare specifiers the modules import, for the import map */
  imports: string[];
}

const TEXT = /\.(frag|vert|wgsl|glsl|txt|svg)$/;
const TYPESCRIPT = /\.tsx?$/;

let sucrase: Promise<typeof import('sucrase')> | undefined;

/** The file a relative specifier names, trying the extensions and `index` files an editor user leaves off */
function resolve(files: SourceFiles, from: string, spec: string): string | undefined {
  const parts = from.split('/').slice(0, -1);

  for (const part of spec.split('/')) {
    if (part === '..') parts.pop();
    else if (part !== '.') parts.push(part);
  }
  const file = parts.join('/');
  const candidates = [file, `${file}.ts`, `${file}.js`, `${file}/index.ts`, `${file}/index.js`];

  return [...candidates, file.replace(/\.js$/, '.ts')].find((candidate) => candidate in files);
}

/** A path from the folder of `from` to `to`, starting with `./` or `../` */
function relativePath(from: string, to: string): string {
  const fromDir = from.split('/').slice(0, -1);
  const target = to.split('/');
  let shared = 0;

  while (shared < fromDir.length && shared < target.length - 1 && fromDir[shared] === target[shared]) shared++;

  return (fromDir.length > shared ? '../'.repeat(fromDir.length - shared) : './') + target.slice(shared).join('/');
}

function outputName(file: string): string {
  return TEXT.test(file) ? `${file}.js` : file.replace(TYPESCRIPT, '.js');
}

function dataUrl(code: string, file: string): string {
  const source = `${code}\n//# sourceURL=${file}`;

  return `data:text/javascript;charset=utf-8,${encodeURIComponent(source).replaceAll("'", '%27')}`;
}

/**
 * Turns source files into native ES modules, depth first from `entry`: shader, text and SVG files become string
 * modules, TypeScript loses its types, and relative imports point at the compiled modules
 * @param files - Source files by path
 * @param entry - Path of the file to run
 * @param options - How modules reference each other
 * @param options.link - `data` (default) or `relative`
 */
export async function compile(
  files: SourceFiles,
  entry: string,
  { link = 'data' }: { link?: LinkMode } = {},
): Promise<Compiled> {
  await init;
  const urls = new Map<string, string>();
  const urlToFile = new Map<string, string>();
  const modules = new Map<string, string>();
  const imports = new Set<string>();

  const visit = async (file: string, chain: string[]): Promise<string> => {
    const done = urls.get(file);

    if (done) return done;
    if (chain.includes(file)) throw new Error(`Circular import: ${[...chain, file].join(' → ')}`);
    let code = files[file];

    if (TEXT.test(file)) {
      code = `export default ${JSON.stringify(code)};\n`;
    } else {
      if (TYPESCRIPT.test(file)) {
        const { transform } = await (sucrase ??= import('sucrase'));

        code = transform(code, { transforms: ['typescript'], disableESTransforms: true, filePath: file }).code;
      }
      let out = '';
      let last = 0;

      for (const { n: spec, s: start, e: end, d: dynamic } of parse(code, file)[0]) {
        if (!spec) continue;
        if (!spec.startsWith('./') && !spec.startsWith('../')) {
          if (!/^[a-z][\w+.-]*:|^\//i.test(spec)) imports.add(spec);
          continue;
        }
        const target = resolve(files, file, spec);

        if (!target) throw new Error(`${file}: can't find '${spec}'`);
        const url = await visit(target, [...chain, file]);
        const specifier = link === 'data' ? url : relativePath(file, url);

        out += code.slice(last, start) + (dynamic > -1 ? JSON.stringify(specifier) : specifier);
        last = end;
      }
      code = out + code.slice(last);
    }
    const url = link === 'data' ? dataUrl(code, file) : outputName(file);

    urls.set(file, url);
    urlToFile.set(url, file);
    modules.set(url, code);

    return url;
  };

  if (!(entry in files)) throw new Error(`There's no ${entry} to run`);

  return { entryUrl: await visit(entry, []), urlToFile, modules, imports: [...imports] };
}
