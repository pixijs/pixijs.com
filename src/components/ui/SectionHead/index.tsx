import clsx from 'clsx';
import styles from './styles.module.scss';

import type { ReactNode } from 'react';

interface SectionHeadProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  /** Draws the hand-drawn squiggle under the title */
  underline?: boolean;
  /** `split` puts the title left and `control` right, on the baseline; it stacks below 768 */
  layout?: 'center' | 'split';
  control?: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  id?: string;
  className?: string;
}

/**
 * The hand-drawn underline; also used under accent words in hero headlines, where `stretch` lets it take
 * the words' width at a fixed stroke
 */
export function Squiggle({ className, stretch }: { className?: string; stretch?: boolean }) {
  return (
    <svg
      className={clsx(styles.squiggle, className)}
      viewBox="0 0 160 18"
      preserveAspectRatio={stretch ? 'none' : undefined}
      aria-hidden="true"
      data-squiggle=""
    >
      <path
        d="M4 12C20 3 32 3 44 10S68 17 82 10 108 3 122 9 146 15 156 7"
        vectorEffect={stretch ? 'non-scaling-stroke' : undefined}
      />
    </svg>
  );
}

/**
 * Eyebrow, title, optional underline and lede. The `data-*` hooks are what `useSplitTitle` animates (M3, M5);
 * the title's children must not re-render once SplitText has split them.
 */
export default function SectionHead({
  eyebrow,
  title,
  lede,
  underline,
  layout = 'center',
  control,
  as: Heading = 'h2',
  id,
  className,
}: SectionHeadProps) {
  const text = (
    <div className={styles.text}>
      {eyebrow && (
        <p className={styles.eyebrow} data-eyebrow="">
          {eyebrow}
        </p>
      )}
      <Heading className={styles.title} id={id} data-title="">
        {title}
      </Heading>
      {underline && <Squiggle />}
      {lede && (
        <p className={styles.lede} data-lede="">
          {lede}
        </p>
      )}
    </div>
  );

  return (
    <header className={clsx(styles.head, styles[layout], className)} data-section-head={layout}>
      {text}
      {control && (
        <div className={styles.control} data-control="">
          {control}
        </div>
      )}
    </header>
  );
}
