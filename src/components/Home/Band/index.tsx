import clsx from 'clsx';
import WaveDivider from '@site/src/components/ui/WaveDivider';
import { scoped } from '../scoped';

import type { WaveVariant } from '@site/src/components/ui/WaveDivider';
import type { ReactNode } from 'react';

/** `hm-band`, `hm-container`, `hm-wave`, `hm-head` and `hm-glow`: `_band.scss`, which `/3d` includes on its own */
const styles = scoped();

export type BandSurface = 'bg' | 'bg-alt';

/** For a `SectionHead` in a band: the space between it and what follows */
export const HEAD = styles.head;

interface BandProps {
  surface?: BandSurface;
  /** The surface of the band below; draws the wave into it */
  next?: BandSurface;
  wave?: WaveVariant;
  /** Mirrors the wave */
  flip?: boolean;
  /** A soft light behind the band's content */
  glow?: boolean;
  /** `false` when the content spans the band itself, as the marquee does */
  contained?: boolean;
  /** Id of the heading that names the section */
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}

/**
 * One full-bleed section of a homepage (section 8): a layer of the page, tiled (`bg`) or plain (`bg-alt`), with
 * the centred container, and the wave that is the next band's edge, which overlaps the seam
 * instead of adding to it.
 */
export default function Band({
  surface = 'bg',
  next,
  wave = 'a',
  flip,
  glow,
  contained = true,
  labelledBy,
  className,
  children,
}: BandProps) {
  return (
    <>
      <section
        className={clsx(styles.band, glow && styles.glow, className)}
        aria-labelledby={labelledBy}
        data-band=""
        data-surface={surface}
      >
        {contained ? <div className={styles.container}>{children}</div> : children}
      </section>
      {next && <WaveDivider from={surface} to={next} variant={wave} flip={flip} className={styles.wave} />}
    </>
  );
}
