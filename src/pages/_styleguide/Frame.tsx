import useBrokenLinks from '@docusaurus/useBrokenLinks';
import clsx from 'clsx';
import styles from './classes';

import type { ReactNode } from 'react';

interface BandProps {
  id?: string;
  surface?: 'bg' | 'bg-alt';
  grid?: boolean;
  className?: string;
  children: ReactNode;
}

/** A full-bleed page band with the marketing container inside */
export function Band({ id, surface = 'bg', grid, className, children }: BandProps) {
  const brokenLinks = useBrokenLinks();

  if (id) brokenLinks.collectAnchor(id);

  return (
    <section id={id} className={clsx(styles.band, surface === 'bg-alt' && styles.alt, grid && styles.grid, className)}>
      <div className={styles.container}>{children}</div>
    </section>
  );
}

interface BlockProps {
  title: string;
  note?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A titled group inside a band */
export function Block({ title, note, className, children }: BlockProps) {
  return (
    <div className={clsx(styles.block, className)}>
      <div className={styles.blockHead}>
        <h3 className={styles.blockTitle}>{title}</h3>
        {note && <p className={styles.blockNote}>{note}</p>}
      </div>
      {children}
    </div>
  );
}

interface StateProps {
  label: string;
  children: ReactNode;
}

/** One cell of a state matrix: the specimen above its label */
export function State({ label, children }: StateProps) {
  return (
    <div className={styles.state}>
      <div className={styles.stateStage}>{children}</div>
      <span className={styles.stateLabel}>{label}</span>
    </div>
  );
}
