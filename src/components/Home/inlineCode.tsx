import type { ReactNode } from 'react';

/** Copy with `backticked` names set as inline code */
export function inlineCode(text: string): ReactNode[] {
  return text.split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}
