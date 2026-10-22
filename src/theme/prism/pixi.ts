import type { PrismTheme } from 'prism-react-renderer';

/**
 * Code colours for Prism and Monaco (`src/components/Editor/Monaco/theme.ts`). Keep in step with the `--px-code-*`,
 * `--px-green` and `--px-danger` tokens in `src/css/tokens.scss`
 */
export interface CodeColors {
  bg: string;
  plain: string;
  kw: string;
  str: string;
  fn: string;
  num: string;
  com: string;
  punct: string;
  inserted: string;
  deleted: string;
}

function codeTheme(c: CodeColors): PrismTheme {
  return {
    plain: { color: c.plain, backgroundColor: c.bg },
    styles: [
      { types: ['keyword', 'operator', 'control', 'module', 'important'], style: { color: c.kw } },
      { types: ['string', 'char', 'attr-value', 'template-string', 'regex', 'url'], style: { color: c.str } },
      { types: ['function', 'class-name', 'method', 'builtin', 'maybe-class-name'], style: { color: c.fn } },
      { types: ['number', 'boolean', 'constant', 'symbol'], style: { color: c.num } },
      { types: ['comment', 'prolog', 'doctype'], style: { color: c.com, fontStyle: 'italic' } },
      { types: ['punctuation'], style: { color: c.punct } },
      { types: ['inserted'], style: { color: c.inserted } },
      { types: ['deleted'], style: { color: c.deleted } },
    ],
  };
}

export const codeLight: CodeColors = {
  bg: '#f6f5fa',
  plain: '#24212e',
  kw: '#c2185b',
  str: '#0369a1',
  fn: '#6d28d9',
  num: '#b45309',
  com: '#5f6878',
  punct: '#5f6878',
  inserted: '#099268',
  deleted: '#dc2626',
};

export const codeDark: CodeColors = {
  bg: '#141414',
  plain: '#e6e8ee',
  kw: '#ff5c93',
  str: '#38bdf8',
  fn: '#c4b5fd',
  num: '#f2a65a',
  com: '#8b95a5',
  punct: '#8d97a7',
  inserted: '#12b886',
  deleted: '#ef4444',
};

export const pixiLight = codeTheme(codeLight);
export const pixiDark = codeTheme(codeDark);
