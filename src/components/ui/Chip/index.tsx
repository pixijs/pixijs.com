import Link from '@docusaurus/Link';
import clsx from 'clsx';
import Icon from '../Icon';
import styles from './styles.module.scss';

import type { ReactNode } from 'react';

interface ChipProps {
  /** Without `to` the chip is static text and drops its arrow */
  to?: string;
  /** Pill badge at the start, such as "NEW" */
  badge?: ReactNode;
  /** Shows the `›_` prompt before the text */
  prompt?: boolean;
  className?: string;
  /** Pins the hover look, for the styleguide's state matrix */
  'data-state'?: 'hover';
  children: ReactNode;
}

/** Announcement chip: "NEW ›_ PixiJS 3D is in preview →" */
export default function Chip({ to, badge, prompt = true, className, children, ...rest }: ChipProps) {
  const content = (
    <>
      {badge && <span className={styles.badge}>{badge}</span>}
      {prompt && (
        <span className={styles.prompt} aria-hidden="true">
          ›_
        </span>
      )}
      <span className={styles.text}>{children}</span>
      {to && <Icon name="arrow-right" size={14} strokeWidth={2} className={styles.arrow} />}
    </>
  );

  return to ? (
    <Link to={to} className={clsx(styles.chip, styles.link, !badge && styles.plain, className)} {...rest}>
      {content}
    </Link>
  ) : (
    <span className={clsx(styles.chip, !badge && styles.plain, className)} {...rest}>
      {content}
    </span>
  );
}
