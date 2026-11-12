import { useColorMode } from '@docusaurus/theme-common';
import { Highlight, type PrismTheme } from 'prism-react-renderer';
import styles from './classes';
import { type CodeColors, codeDark, codeLight } from '@site/src/theme/prism/pixi';

import type { CSSProperties, ReactNode } from 'react';

/**
 * The site's code colours on Prism's tokens the way Monaco's JavaScript tokenizer assigns them (calls stay plain,
 * capitalised names and constants take the type colour, operators the punctuation colour), so the swap keeps them
 */
function monacoLike(code: CodeColors): PrismTheme {
  return {
    plain: { color: code.plain, backgroundColor: code.bg },
    styles: [
      { types: ['keyword', 'boolean', 'module', 'control'], style: { color: code.kw } },
      { types: ['string', 'char', 'template-string', 'regex', 'url', 'attr-value'], style: { color: code.str } },
      { types: ['class-name', 'maybe-class-name', 'constant', 'builtin'], style: { color: code.fn } },
      { types: ['number'], style: { color: code.num } },
      { types: ['comment', 'prolog', 'doctype'], style: { color: code.com, fontStyle: 'italic' } },
      { types: ['punctuation', 'operator'], style: { color: code.punct } },
    ],
  };
}

const THEMES = { light: monacoLike(codeLight), dark: monacoLike(codeDark) };

const PRISM: Record<string, string> = {
  javascript: 'jsx',
  typescript: 'tsx',
  glsl: 'cpp',
  rust: 'rust',
};

/** Where Monaco's word wrap may break a line: before these characters, and after these */
const BREAK_BEFORE = '([{+';
const BREAK_AFTER = ' \t})]?|/&.,;';

/** Monaco's line height for a font size, so the static preview lines up with the editor that replaces it */
export const lineHeightFor = (fontSize: number) => Math.round(fontSize * 1.65);

/** Touch screens get 16 px code, so iOS doesn't zoom in on focus, and no line numbers */
export const isTouch = () => typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;

/**
 * Where Monaco's word wrap may break `line` (its `canBreak`): the indices of the characters a wrapped row can start
 * with. Never before a space, after the last of a run of break-after characters, before the first of a run of
 * break-before ones.
 */
function breakPoints(line: string): Set<number> {
  const points = new Set<number>();

  for (let i = 1; i < line.length; i++) {
    const [previous, char] = [line[i - 1], line[i]];
    const after = BREAK_AFTER.includes(previous) && !BREAK_AFTER.includes(char);
    const before = BREAK_BEFORE.includes(char) && !BREAK_BEFORE.includes(previous);

    if (char !== ' ' && (after || before)) points.add(i);
  }

  return points;
}

/** A token's text, starting at `start` in its line, with a `<wbr>` at each break point */
function withBreaks(text: string, start: number, points: Set<number>): ReactNode[] {
  const parts: ReactNode[] = [];
  let from = 0;

  for (let i = 0; i < text.length; i++) {
    if (!points.has(start + i)) continue;
    parts.push(text.slice(from, i), <wbr key={i} />);
    from = i;
  }

  return [...parts, text.slice(from)];
}

/**
 * Monaco's indent guides: the indent size it would detect (2 or 4 spaces), and how many guides each line gets, one per
 * level of its indent; a blank line gets as many as its neighbours suggest
 */
function indentGuides(lines: string[]): { tab: number; levels: number[] } {
  const spaces = lines.map((line) => (line.trim() ? (/^ */.exec(line)?.[0].length ?? 0) : -1));
  const tab = spaces.every((count) => count % 4 === 0 || count < 0) ? 4 : 2;
  const own = spaces.map((count) => (count < 0 ? -1 : Math.ceil(count / tab)));
  const levels = own.map((level, row) => {
    if (level >= 0) return level;
    const above = own.slice(0, row).findLast((other) => other >= 0) ?? -1;
    const below = own.slice(row + 1).find((other) => other >= 0) ?? -1;

    if (above < 0 || below < 0) return 0;

    return above === below ? below : Math.min(above, below) + 1;
  });

  return { tab, levels };
}

interface CodePreviewProps {
  code: string;
  language: string;
  fontSize: number;
}

/**
 * The code highlighted with Prism, shown while Monaco loads so the panel never sits empty. It wraps, indents wrapped
 * rows and draws indent guides the way Monaco does, so the swap doesn't move the text.
 */
export default function CodePreview({ code, language, fontSize }: CodePreviewProps) {
  const { colorMode } = useColorMode();
  const touch = isTouch();
  const size = touch ? 16 : fontSize;

  return (
    <Highlight code={code} language={PRISM[language] ?? 'clike'} theme={THEMES[colorMode]}>
      {({ tokens, getTokenProps }) => {
        const lines = tokens.map((line) => line.map((token) => token.content).join(''));
        const { tab, levels } = indentGuides(lines);

        return (
          <pre
            className={styles.codePreview}
            style={{ fontSize: size, lineHeight: `${lineHeightFor(size)}px`, '--tab': `${tab}ch` } as CSSProperties}
            aria-hidden="true"
          >
            {tokens.map((line, row) => {
              const indent = /^ */.exec(lines[row])?.[0].length ?? 0;
              const points = breakPoints(lines[row]);
              let start = 0;

              return (
                <span key={row} className={styles.codeLine}>
                  {!touch && <span className={styles.lineNumber}>{row + 1}</span>}
                  <span
                    className={styles.codeText}
                    style={{ '--indent': `${indent}ch`, '--guides': levels[row] } as CSSProperties}
                  >
                    {line.map((token, index) => {
                      const parts = withBreaks(token.content, start, points);

                      start += token.content.length;

                      return (
                        <span key={index} {...getTokenProps({ token })}>
                          {parts}
                        </span>
                      );
                    })}
                    {'\n'}
                  </span>
                </span>
              );
            })}
          </pre>
        );
      }}
    </Highlight>
  );
}
