import type { CapsuleGeometryOptions, SphereGeometryOptions, TorusGeometryOptions } from '@pixi/3d';
import type { RoundedCylinderOptions } from './roundedCylinderGeometry';
import type { RoundedPyramidOptions } from './roundedPyramidGeometry';
import type { SuperellipsoidOptions } from './superellipsoidGeometry';

/**
 * How far each kind of shape actually reaches, so the field can hold shapes apart at their own
 * surfaces rather than at a circle drawn around them.
 *
 * A body carries one radius, but only a sphere is one number wide: a cube reaches a quarter
 * further at its corners than at its faces, and the pyramid half again. Colliding on the radius
 * alone let those corners slide into a neighbour, and padding the radius out to reach them would
 * hold every flat face apart instead. What a contact test actually needs is the support function —
 * the furthest a surface reaches along one direction — which costs a handful of multiplies.
 *
 * Most kinds are solids of revolution about their own y axis, swept through a superellipse rather
 * than a circle (see {@link latheGeometry}), so their support splits in two: how far the
 * cross-section reaches around the axis, and how far the silhouette reaches in the plane that holds
 * the axis (see {@link lathed}). Each hull is built from the same options object its geometry is,
 * so the two cannot drift apart.
 */
export interface Hull {
  /** How far the surface reaches from its centre along the unit direction `d`, in the shape's own axes */
  reach(dx: number, dy: number, dz: number): number;
  /** The furthest it reaches in any direction once `scale` is applied */
  furthest(scale: Scale): number;
}

interface Scale {
  x: number;
  y: number;
  z: number;
}

/** The fields of a lathed geometry's options that set its size rather than its tessellation. */
type LathedShape = Pick<RoundedCylinderOptions & RoundedPyramidOptions, 'radius' | 'height' | 'rounding' | 'roundness'>;

/**
 * How far a lathed shape's corners are actually rolled: the `rounding` asked for, clamped so the
 * arcs can neither eat past the axis nor meet in the middle of the height.
 */
export const cornerRoll = ({ radius, height, rounding }: Omit<LathedShape, 'roundness'>): number =>
  Math.min(rounding, radius * 0.9, height * 0.45);

/** The q-norm of a non-negative pair, with the two exponents that carry no cost written out. */
const norm = (a: number, b: number, q: number): number =>
  q === 1 ? a + b : q === 2 ? Math.hypot(a, b) : (a ** q + b ** q) ** (1 / q);

/**
 * Support exponent of a cross-section authored with `roundness`, where 1 sweeps a circle and 0 a
 * square. That curve is `|x|^p + |z|^p = 1` with `p = 2 / roundness`, and the support of a p-norm
 * ball is its conjugate q-norm, `1/p + 1/q = 1`.
 */
export const crossSection = (roundness: number): number => 2 / (2 - roundness);

/** Tilts sampled by {@link lathed}'s `furthest`, and the slack that covers the ones falling between them. */
const SWEEP = 48;
const SWEEP_MARGIN = 1.02;

/**
 * A solid of revolution's hull: `ringQ` is the support exponent of its cross-section (see {@link crossSection}),
 * and `profile` how far its silhouette reaches, given how far the cross-section already reaches around the axis
 * (`ring`) and how much of the direction runs along it (`dy`).
 *
 * Its furthest reach sweeps only the tilt away from the axis. Every profile grows with how far the cross-section
 * reaches, so the way round the axis that reaches furthest is known outright rather than searched for: the
 * diagonal of a squarish cross-section, straight out along an axis for a pointed one. That leaves a half turn to
 * walk, and it is walked rather than solved because each kind's profile is shaped differently and a sweep cannot
 * fall out of step with them. Erring high is free — a pair let through only pays for the exact test that then
 * finds nothing — where erring low would drop a real contact, hence the margin over the tilts between samples.
 */
function lathed(ringQ: number, profile: (ring: number, dy: number) => number): Hull {
  return {
    reach: (dx, dy, dz) => profile(norm(Math.abs(dx), Math.abs(dz), ringQ), dy),
    furthest(scale) {
      // How far the cross-section reaches at its widest, per unit of tilt away from the axis. The
      // shapes are all round about their axis, so either of the two scales standing in for both.
      const widest = Math.max(1, 2 ** (1 / ringQ - 0.5)) * Math.max(scale.x, scale.z);
      let most = 0;

      for (let step = 0; step <= SWEEP; step++) {
        const tilt = (step / SWEEP - 0.5) * Math.PI;

        most = Math.max(most, profile(Math.cos(tilt) * widest, Math.sin(tilt) * scale.y));
      }

      return most * SWEEP_MARGIN;
    },
  };
}

export const sphereHull = ({ radius }: Pick<SphereGeometryOptions, 'radius'>): Hull =>
  lathed(2, (ring, dy) => radius * Math.hypot(ring, dy));

/** The convex hull of the ring, so nothing is ever let through the hole. */
export const torusHull = ({ radius, tube }: Pick<TorusGeometryOptions, 'radius' | 'tube'>): Hull =>
  lathed(2, (ring, dy) => radius * ring + tube * Math.hypot(ring, dy));

export const capsuleHull = ({ radius, height }: Pick<CapsuleGeometryOptions, 'radius' | 'height'>): Hull => {
  // What is left of the height once the two caps are taken off: the segment they are swept along.
  const half = Math.max(0, height / 2 - radius);

  return lathed(2, (ring, dy) => half * Math.abs(dy) + radius * Math.hypot(ring, dy));
};

/**
 * A superellipsoid's support is the same nested pair of norms its surface is built from: the
 * cross-section around the axis, then that against the axis itself.
 */
export const superellipsoidHull = ({
  radius,
  roundness,
}: Pick<SuperellipsoidOptions, 'radius' | 'roundness'>): Hull => {
  const q = crossSection(roundness);

  return lathed(q, (ring, dy) => radius * norm(ring, Math.abs(dy), q));
};

/**
 * The silhouette is a rectangle with its two outer corners rolled, so its support is the
 * rectangle's plus the roll's. The roll is an offset within the silhouette's own plane rather than
 * a sweep in three dimensions, which is why it answers to the cross-section as well.
 */
export const roundedCylinderHull = (options: LathedShape): Hull => {
  const roll = cornerRoll(options);
  const barrel = options.radius - roll;
  const half = options.height / 2 - roll;

  return lathed(
    crossSection(options.roundness),
    (ring, dy) => barrel * ring + half * Math.abs(dy) + roll * Math.hypot(ring, dy),
  );
};

/**
 * The silhouette is a triangle with every corner rolled: whichever of the apex and the base rim
 * lies further along the direction is what the surface reaches to.
 */
export const roundedPyramidHull = (options: LathedShape): Hull => {
  const roll = cornerRoll(options);
  const base = options.radius - roll;
  const half = options.height / 2 - roll;

  return lathed(
    crossSection(options.roundness),
    (ring, dy) => Math.max(half * dy, base * ring - half * dy) + roll * Math.hypot(ring, dy),
  );
};

/**
 * A flat outline pushed out along z and rolled at every edge: the outline `points` (x, y pairs) already inset by
 * the roll, swept `halfDepth - roll` either way of its middle, and grown by `roll` all round. That growth is a ball,
 * so its support is the prism's plus the roll, whichever way the direction points.
 */
export function extrudedHull(points: ArrayLike<number>, halfDepth: number, roll: number): Hull {
  const side = halfDepth - roll;

  return {
    reach(dx, dy, dz) {
      let most = -Infinity;

      for (let i = 0; i < points.length; i += 2) most = Math.max(most, dx * points[i] + dy * points[i + 1]);

      return most + Math.abs(dz) * side + roll;
    },
    furthest(scale) {
      let most = 0;

      for (let i = 0; i < points.length; i += 2) {
        most = Math.max(most, Math.hypot(points[i] * scale.x, points[i + 1] * scale.y, side * scale.z));
      }

      return most + roll * Math.max(scale.x, scale.y, scale.z);
    },
  };
}
