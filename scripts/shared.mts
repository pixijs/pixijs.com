/** Helpers the generators and the markdown pages plugin share */
import fs from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import path from 'node:path';
import prettier from 'prettier';

/** A fenced code block at any indent, opened with ``` or ~~~ and closed by the same fence at the same indent */
const FENCE = /^([ \t]*)(([`~])\3{2,})[^\n]*\n[\s\S]*?^\1\2\3*[ \t]*$/gm;
const CODE_SPAN = /(?<!`)(`+)(?!`).*?[^`]\1(?!`)/g;
const MASK = /\0(\d+)\0/g;

/** A self-closing `<PixiExample>` tag; group 1 is its `name`, group 2 its `pkg`, which means `2d` when it's missing */
export const PIXI_EXAMPLE =
  /<PixiExample\s(?=[^>]*?\bname=["']([^"']+)["'])(?=(?:[^>]*?\bpkg=["']([^"']+)["'])?)[^>]*\/>/g;

/** The fields the generators read from an installed package's manifest */
export interface Manifest {
  version: string;
  description?: string;
  /** The commit a vendored build was packed from */
  gitHead?: string;
}

/**
 * Reads an installed npm package's manifest
 * @param pkg - Package name
 */
export function installedPackage(pkg: string): Manifest {
  const file = path.join(process.cwd(), 'node_modules', pkg, 'package.json');
  if (!fs.existsSync(file)) throw new Error(`${pkg} isn't installed; run npm install`);
  return JSON.parse(fs.readFileSync(file, 'utf8')) as Manifest;
}

/**
 * The `repos.pin` that `npm run sync:repos` records for a checkout that follows an npm package:
 * `<pkg>@<version>`, plus `#<sha7>` for a vendored build that carries its `gitHead`
 * @param pkg - Package name
 */
export function repoPin(pkg: string): string {
  const { version, gitHead } = installedPackage(pkg);
  return `${pkg}@${version}${gitHead ? `#${gitHead.slice(0, 7)}` : ''}`;
}

/**
 * Writes a file unless it already has this content
 * @param file - Absolute path
 * @param content - New content
 * @returns Whether it was written
 */
export function writeIfChanged(file: string, content: string | Buffer): boolean {
  const data = typeof content === 'string' ? Buffer.from(content) : content;
  if (fs.existsSync(file) && fs.readFileSync(file).equals(data)) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
  return true;
}

/**
 * Deletes files under a folder that aren't in `keep`, then any folders left empty; a missing folder is a no-op
 * @param dir - Folder to clean
 * @param keep - Absolute paths to keep
 * @returns How many files were deleted
 */
export function prune(dir: string, keep: Set<string>): number {
  if (!fs.existsSync(dir)) return 0;
  let deleted = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      deleted += prune(file, keep);
      if (!fs.readdirSync(file).length) fs.rmdirSync(file);
    } else if (!keep.has(file)) {
      fs.rmSync(file);
      deleted++;
    }
  }
  return deleted;
}

/**
 * A tutorial's page, which imports the tutorial's steps so they load with that route only
 * @param tutorial - The tutorial's package, id, title and description, and the module its steps are imported from
 */
export function tutorialPage(tutorial: {
  pkg: string;
  id: string;
  title: string;
  description: string;
  content: string;
}): string {
  return [
    '---',
    `title: ${JSON.stringify(tutorial.title)}`,
    `description: ${JSON.stringify(tutorial.description)}`,
    'hide_title: true',
    'pagination_next: null',
    'pagination_prev: null',
    'custom_edit_url: null',
    'app: true',
    '---',
    '',
    "import Tutorial from '@site/src/components/Tutorial';",
    `import content from '${tutorial.content}';`,
    '',
    `<Tutorial pkg="${tutorial.pkg}" id="${tutorial.id}" content={content} />`,
    '',
  ].join('\n');
}

/**
 * Reads an example or tutorial file as JavaScript
 * @param file - A `.js` file, or a `.ts` file whose types are stripped
 */
export function readScript(file: string): string {
  const code = fs.readFileSync(file, 'utf8');
  return file.endsWith('.ts') ? stripTypeScriptTypes(code, { mode: 'strip' }) : code;
}

/**
 * Formats JavaScript the way the site publishes example and tutorial code
 * @param code - JavaScript
 */
export function formatScript(code: string): Promise<string> {
  return prettier.format(code, { parser: 'babel', semi: true, singleQuote: true, tabWidth: 2 });
}

/**
 * Swaps fenced code blocks and inline code spans for placeholders, so markdown rewrites skip code
 * @param text - Markdown
 * @returns The masked markdown, and a function that puts the code back into it
 */
export function maskCode(text: string): { text: string; restore(text: string): string } {
  const code: string[] = [];
  const mask = (block: string) => `\0${code.push(block) - 1}\0`;
  return {
    text: text.replace(FENCE, mask).replace(CODE_SPAN, mask),
    restore: (masked) => masked.replace(MASK, (_, index: string) => code[Number(index)]),
  };
}
