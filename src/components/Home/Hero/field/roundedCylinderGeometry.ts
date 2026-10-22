import { cornerRoll } from './hull';
import { latheArc, latheGeometry } from './latheGeometry';

import type { Geometry3D } from '@pixi/3d';

export interface RoundedCylinderOptions {
  /** Radius of the barrel. */
  radius: number;
  /** Total height, cap to cap. */
  height: number;
  /** How far the two rims are rolled off. */
  rounding: number;
  /** Cross-section exponent: 1 is a circle, 0 a hard square. */
  roundness: number;
  /** Segments around the cross-section. */
  segments: number;
  /** Segments across each of the two rim arcs. */
  arcSegments: number;
}

const DEFAULTS: RoundedCylinderOptions = {
  radius: 0.72,
  height: 1.5,
  rounding: 0.2,
  roundness: 1,
  segments: 56,
  arcSegments: 8,
};

/**
 * A drum with both rims rolled off: the silhouette is a rounded rectangle, swept through a circle.
 *
 * Offsetting the rectangle outward by `rounding` turns its two outer corners into arcs of that
 * radius, and the straight stretch between them is the barrel. Unlike a capsule the flat caps
 * survive, which is what reads as a cylinder rather than a pill.
 */
export function roundedCylinderGeometry(options: Partial<RoundedCylinderOptions> = {}): Geometry3D {
  const { radius, height, rounding, roundness, segments, arcSegments } = { ...DEFAULTS, ...options };
  const steps = Math.max(2, Math.round(arcSegments));
  const roll = cornerRoll({ radius, height, rounding });
  const innerWidth = radius - roll;

  return latheGeometry({
    roundness,
    segments,
    rings: [
      ...latheArc({ width: innerWidth, y: -height / 2 + roll, radius: roll, from: -Math.PI / 2, to: 0, steps }),
      ...latheArc({ width: innerWidth, y: height / 2 - roll, radius: roll, from: 0, to: Math.PI / 2, steps }),
    ],
  });
}
