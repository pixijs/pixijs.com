import clsx from 'clsx';
import styles from './styles.module.scss';

import type { ReactNode } from 'react';

interface TagProps {
  /** `accent` tints the tag with the page's accent and colours the text pink */
  tone?: 'neutral' | 'accent';
  /** Package chip: the dot and tint come from that package's colour (`--px-pkg-*`), the text stays ink */
  pkg?: string;
  dot?: boolean;
  pill?: boolean;
  className?: string;
  children: ReactNode;
}

/** Mono label: HUD captions, code-card headers, gallery filters, package chips */
export default function Tag({ tone = 'neutral', pkg, dot = !!pkg, pill, className, children }: TagProps) {
  return (
    <span
      className={clsx(
        styles.tag,
        tone === 'accent' && styles.accent,
        pkg && styles.pkg,
        pill && styles.pill,
        className,
      )}
      data-package={pkg}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
