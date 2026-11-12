import clsx from 'clsx';
import styles from './styles.module.scss';

import type { CSSProperties } from 'react';

/** The rendered set in `static/images/clay` (`scripts/render-clay.mjs`); keep in step with `$shapes` in the styles */
export const CLAY_SHAPES = [
  'capsule-rose',
  'cube-pink',
  'cube-violet',
  'cylinder-cyan',
  'octahedron-violet',
  'pyramid-cyan',
  'pyramid-pink',
  'sphere-cyan',
  'sphere-pink',
  'sphere-violet',
  'torus-cyan',
  'torus-pink',
] as const;

export type ClayShapeName = (typeof CLAY_SHAPES)[number];

/**
 * The 2D set in `static/assets/standard`, the shapes the PixiJS examples use; keep in step with `$flat-*` in the
 * styles. A page uses this set or the clay one, not both.
 */
export type FlatShapeName =
  `${'circle' | 'pentagon' | 'square' | 'star' | 'triangle'}-${'blue' | 'green' | 'orange' | 'pink' | 'purple'}-${'fill' | 'stroke'}`;

/** Glossy 3D clay, or a flat 2D shape */
export type ClayDim = 'clay' | 'flat';

/** Flat names end in their style, clay names in their tint */
const dimOf = (shape: ClayShapeName | FlatShapeName): ClayDim => (/-(fill|stroke)$/.test(shape) ? 'flat' : 'clay');

export interface ClayShapeProps {
  shape: ClayShapeName | FlatShapeName;
  /** Rendered width and height, in px or any CSS length; defaults to `--sz` */
  size?: number | string;
  /** How far `useClayField` moves it with the scroll, 0.3-1.2 */
  depth?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * One pre-rendered shape (section 6.4), clay or flat by its name. The image is a CSS background, clay's picked by
 * the theme, so a theme switch needs no JS and only the active theme's files download. The `clay` class and data
 * attributes are what `useClayField` drives. A swap paints at once only to an image the page already uses.
 */
export default function ClayShape({ shape, size, depth, className, style }: ClayShapeProps) {
  return (
    <span
      className={clsx('clay', styles.clay, className)}
      data-shape={shape}
      data-dim={dimOf(shape)}
      data-depth={depth}
      aria-hidden="true"
      style={
        size === undefined
          ? style
          : ({ '--sz': typeof size === 'number' ? `${size}px` : size, ...style } as CSSProperties)
      }
    >
      <span className={styles.shade} />
    </span>
  );
}
