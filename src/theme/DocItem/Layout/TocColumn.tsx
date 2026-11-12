import styles from './TocColumn.module.scss';

import type { ReactNode } from 'react';

interface TocColumnProps {
  /** Links under the list, such as "Edit this page" */
  footer?: ReactNode;
  /** The theme's `TOC` */
  children: ReactNode;
}

/** "On this page" for docs and blog posts: the right column from 1280 px, sticking below the top bar */
export default function TocColumn({ footer, children }: TocColumnProps) {
  return (
    <div className={styles.column}>
      <div className={styles.sticky}>
        <nav className={styles.nav} aria-labelledby="toc-label">
          <p id="toc-label" className={styles.label}>
            On this page
          </p>
          {children}
        </nav>
        {footer}
      </div>
    </div>
  );
}
