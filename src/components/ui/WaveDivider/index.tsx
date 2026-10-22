import clsx from 'clsx';
import styles from './styles.module.scss';

import type { CSSProperties } from 'react';

export type WaveSurface = 'ground' | 'bg' | 'bg-alt' | 'hero' | 'well' | 'rail';
export type WaveVariant = 'a' | 'b' | 'c' | 'drift';

const PATHS: Record<WaveVariant, string> = {
  a: 'M0 30C180 10 360 6 560 18S940 48 1140 40 1360 20 1440 22V56H0Z',
  b: 'M0 26C220 44 420 50 640 36S1040 6 1240 14 1400 30 1440 28V56H0Z',
  c: 'M0 34C240 18 420 14 660 26S1080 52 1280 40C1340 36.4 1400 25 1440 24V56H0Z',
  drift: 'M0 28C240 8 480 8 720 28S1200 48 1440 28S1920 8 2160 28S2640 48 2880 28V56H0Z',
};

interface WaveDividerProps {
  /** Surface above the wave */
  from: WaveSurface;
  /** Surface below the wave */
  to: WaveSurface;
  variant?: WaveVariant;
  /** Mirror horizontally */
  flip?: boolean;
  className?: string;
}

/**
 * Joins two bands with a soft wave. `drift` is twice as wide so its `[data-wave-path]` can slide (M16). The data
 * attributes name the wave for the homes' section system, which draws the lower band's edge with it.
 */
export default function WaveDivider({ from, to, variant = 'a', flip, className }: WaveDividerProps) {
  const drift = variant === 'drift';

  return (
    <div
      className={clsx(styles.wave, flip && styles.flip, className)}
      style={{ '--from': `var(--px-${from})`, '--to': `var(--px-${to})` } as CSSProperties}
      aria-hidden="true"
      data-wave={variant}
      data-to={to}
      data-flip={flip ? '' : undefined}
    >
      <svg
        className={clsx(styles.svg, drift && styles.drift)}
        viewBox={`0 0 ${drift ? 2880 : 1440} 56`}
        preserveAspectRatio="none"
        data-wave-path=""
      >
        <path d={PATHS[variant]} />
      </svg>
    </div>
  );
}
