import { type CodeColors, codeDark, codeLight } from '@site/src/theme/prism/pixi';

import type { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

export type MonacoThemeName = 'pixi-light' | 'pixi-dark';

/** Surface and ink tokens around the code (`src/css/tokens.scss`); Monaco wants hex, so they're repeated here */
interface ChromeColors {
  raised: string;
  active: string;
  line: string;
  lineStrong: string;
  ink2: string;
  ink3: string;
  accent: string;
  warn: string;
}

const chromeLight: ChromeColors = {
  raised: '#ffffff',
  active: '#e9e6f0',
  line: '#16131f17',
  lineStrong: '#16131f29',
  ink2: '#4b5466',
  ink3: '#5f6878',
  accent: '#c2185b',
  warn: '#d97706',
};

const chromeDark: ChromeColors = {
  raised: '#232122',
  active: '#302e2e',
  line: '#ffffff14',
  lineStrong: '#ffffff24',
  ink2: '#aab4c6',
  ink3: '#8d97a7',
  accent: '#f06695',
  warn: '#f59e0b',
};

const PINK = '#e91e63';

const bare = (hex: string) => hex.slice(1);

function theme(base: 'vs' | 'vs-dark', code: CodeColors, ui: ChromeColors): editor.IStandaloneThemeData {
  return {
    base,
    inherit: true,
    rules: [
      { token: '', foreground: bare(code.plain) },
      { token: 'identifier', foreground: bare(code.plain) },
      { token: 'keyword', foreground: bare(code.kw) },
      { token: 'storage', foreground: bare(code.kw) },
      { token: 'meta.preprocessor', foreground: bare(code.kw) },
      { token: 'string', foreground: bare(code.str) },
      { token: 'regexp', foreground: bare(code.str) },
      { token: 'type', foreground: bare(code.fn) },
      { token: 'type.identifier', foreground: bare(code.fn) },
      { token: 'entity', foreground: bare(code.fn) },
      { token: 'support', foreground: bare(code.fn) },
      { token: 'invalid', foreground: bare(code.plain) },
      { token: 'number', foreground: bare(code.num) },
      { token: 'number.hex', foreground: bare(code.num) },
      { token: 'constant', foreground: bare(code.num) },
      { token: 'comment', foreground: bare(code.com), fontStyle: 'italic' },
      { token: 'delimiter', foreground: bare(code.punct) },
      { token: 'operator', foreground: bare(code.punct) },
    ],
    colors: {
      'editor.background': code.bg,
      'editor.foreground': code.plain,
      'editorGutter.background': code.bg,
      'editor.lineHighlightBackground': `${PINK}14`,
      'editor.lineHighlightBorder': '#00000000',
      'editorCursor.foreground': PINK,
      'editor.selectionBackground': `${PINK}33`,
      'editor.inactiveSelectionBackground': `${PINK}1f`,
      'editor.selectionHighlightBackground': `${PINK}1a`,
      'editor.wordHighlightBackground': `${PINK}14`,
      'editor.findMatchBackground': `${PINK}59`,
      'editor.findMatchHighlightBackground': `${PINK}26`,
      'editorBracketMatch.background': `${PINK}1f`,
      'editorBracketMatch.border': `${PINK}66`,
      ...Object.fromEntries([1, 2, 3, 4, 5, 6].map((n) => [`editorBracketHighlight.foreground${n}`, code.punct])),
      'editorLineNumber.foreground': ui.ink3,
      'editorLineNumber.activeForeground': ui.ink2,
      'editorIndentGuide.background1': ui.line,
      'editorIndentGuide.activeBackground1': ui.lineStrong,
      'editorWhitespace.foreground': ui.line,
      'editorWidget.background': ui.raised,
      'editorWidget.border': ui.lineStrong,
      'editorSuggestWidget.background': ui.raised,
      'editorSuggestWidget.border': ui.lineStrong,
      'editorSuggestWidget.selectedBackground': ui.active,
      'editorSuggestWidget.highlightForeground': ui.accent,
      'editorSuggestWidget.focusHighlightForeground': ui.accent,
      'editorHoverWidget.background': ui.raised,
      'editorHoverWidget.border': ui.lineStrong,
      'editorError.foreground': code.deleted,
      'editorWarning.foreground': ui.warn,
      'editorOverviewRuler.border': '#00000000',
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': ui.line,
      'scrollbarSlider.hoverBackground': ui.lineStrong,
      'scrollbarSlider.activeBackground': `${PINK}66`,
      focusBorder: '#00000000',
    },
  };
}

/** Registers `pixi-light` and `pixi-dark`, built from the same colours as the site's Prism themes */
export function definePixiThemes(monaco: Monaco) {
  monaco.editor.defineTheme('pixi-light', theme('vs', codeLight, chromeLight));
  monaco.editor.defineTheme('pixi-dark', theme('vs-dark', codeDark, chromeDark));
}

export const monacoTheme = (colorMode: 'light' | 'dark'): MonacoThemeName =>
  colorMode === 'dark' ? 'pixi-dark' : 'pixi-light';
