import { cornerRoll } from './hull';
import { latheArc, latheGeometry } from './latheGeometry';

import type { Geometry3D } from '@pixi/3d';

export interface RoundedPyramidOptions {
  /** Half-width of the square base. */
  radius: number;
  /** Total height, base to apex. */
  height: number;
  /** How far the base rim, the four edges and the apex are rolled off. */
  rounding: number;
  /** Cross-section exponent: 1 is a circle, 0 a hard square. */
  roundness: number;
  /** Segments around the cross-section. */
  segments: number;
  /** Segments across each of the two rounded arcs. */
  arcSegments: number;
}

const DEFAULTS: RoundedPyramidOptions = {
  radius: 0.85,
  height: 1.9,
  rounding: 0.16,
  roundness: 0.22,
  segments: 56,
  arcSegments: 8,
};

/**
 * A square-based pyramid with every edge rolled off: the silhouette is a rounded triangle, and the
 * near-square cross-section it is swept through is what makes the base square and the four faces
 * flat.
 *
 * The silhouette is the outward offset of a triangle — axis, base, slope — by `rounding`, so each
 * of its corners becomes an arc of that radius: the base rim, and the apex. The straight stretch
 * between the two arcs is the sloping face.
 */
export function roundedPyramidGeometry(options: Partial<RoundedPyramidOptions> = {}): Geometry3D {
  const { radius, height, rounding, roundness, segments, arcSegments } = { ...DEFAULTS, ...options };
  const steps = Math.max(2, Math.round(arcSegments));
  const roll = cornerRoll({ radius, height, rounding });
  // The triangle the silhouette is offset from: base corner at (innerWidth, -height/2 + roll) and
  // apex at (0, height/2 - roll), so the offset lands exactly on the requested size.
  const innerWidth = radius - roll;
  const slopeAngle = Math.atan2(innerWidth, height - 2 * roll);

  return latheGeometry({
    roundness,
    segments,
    rings: [
      ...latheArc({
        width: innerWidth,
        y: -height / 2 + roll,
        radius: roll,
        from: -Math.PI / 2,
        to: slopeAngle,
        steps,
      }),
      ...latheArc({ width: 0, y: height / 2 - roll, radius: roll, from: slopeAngle, to: Math.PI / 2, steps }),
    ],
  });
}
