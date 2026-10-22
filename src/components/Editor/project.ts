import type { SourceFiles } from '@site/src/runtime/compile';

/** A file passed to the editor: its code, plus whether it gets a tab (`hidden`) and opens first (`active`) */
export interface EditorFile {
  code: string;
  hidden?: boolean;
  active?: boolean;
}

export type EditorFiles = Record<string, EditorFile | string>;

export interface Project {
  sources: SourceFiles;
  /** Files with a tab, the entry first */
  visible: string[];
  entry: string;
  active: string;
}

const ENTRIES = ['index.js', 'src/index.js', 'index.ts', 'src/index.ts'];

const LANGUAGES: Record<string, string> = {
  js: 'javascript',
  mjs: 'javascript',
  ts: 'typescript',
  frag: 'glsl',
  vert: 'glsl',
  glsl: 'glsl',
  wgsl: 'rust',
  json: 'json',
  css: 'css',
  html: 'html',
  svg: 'xml',
};

/** Normalises the `files` prop: paths lose a leading `/`, and the entry is `index.js`, `src/index.js` or the first file */
export function toProject(files: EditorFiles): Project {
  const sources: SourceFiles = {};
  const hidden = new Set<string>();
  let active: string | undefined;

  for (const [name, file] of Object.entries(files)) {
    const path = name.replace(/^\/+/, '');
    const { code, hidden: isHidden, active: isActive } = typeof file === 'string' ? { code: file } : file;

    sources[path] = code;
    if (isHidden) hidden.add(path);
    if (isActive) active ??= path;
  }

  const names = Object.keys(sources);
  const entry = ENTRIES.find((name) => name in sources) ?? names[0] ?? 'index.js';
  const visible = [entry, ...names.filter((name) => name !== entry)].filter(
    (name) => name in sources && !hidden.has(name),
  );

  return { sources, visible, entry, active: active ?? visible[0] ?? entry };
}

/** Monaco's language for a file; WGSL borrows Rust's highlighting, which shares its syntax */
export function languageOf(file: string): string {
  return LANGUAGES[file.split('.').pop() ?? ''] ?? 'plaintext';
}

/** Whether the code uses `@pixi/3d`, so the editor adds its types */
export function imports3d(sources: SourceFiles): boolean {
  return Object.values(sources).some((code) => code.includes('@pixi/3d'));
}
