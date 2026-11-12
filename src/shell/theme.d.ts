/** Props the shell adds to the ejected `Layout` (src/theme/Layout) */
declare module '@theme/Layout' {
  import type { ReactNode } from 'react';

  export interface Props {
    /** `docs`: `DocRoot/Layout` renders the rail itself, with the doc tree */
    readonly rail?: 'default' | 'docs';
    /** Drill-down panel for the rail, such as the blog's posts */
    readonly railSection?: ReactNode;
    /** App mode: compact rail, no footer, full-bleed main */
    readonly app?: boolean;
  }
}

/** `@types/react-dom` isn't installed; the theme switch needs only this */
declare module 'react-dom' {
  export function flushSync<R>(fn: () => R): R;
}
