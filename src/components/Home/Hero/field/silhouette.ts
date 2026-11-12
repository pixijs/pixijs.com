import { BUNNY_POINTS } from './bunny';
import { cornerRoll } from './hull';
import { CAPSULE, CUBE, CYLINDER, KIND_SCALE, OCTAHEDRON, PYRAMID, SPHERE, TORUS } from './kinds';

import type { ShapeKind } from './kinds';

/**
 * Each kind's outline face on, in the units its geometry is authored in, with y running down as on screen: what
 * `shadows.ts` blurs into the shadow a shape casts.
 */

const SAMPLES = 96;
const ARC_STEPS = 12;

const signPow = (value: number, exponent: number): number => Math.sign(value) * Math.abs(value) ** exponent;
const fixed = (value: number): string => String(Math.round(value * 1000) / 1000);

function polygon(points: [number, number][]): string {
  return `M${points.map(([x, y]) => `${fixed(x)} ${fixed(-y)}`).join('L')}Z`;
}

function circle(radius: number): string {
  const r = fixed(radius);

  return `M-${r} 0A${r} ${r} 0 1 0 ${r} 0A${r} ${r} 0 1 0 -${r} 0Z`;
}

/** A superellipsoid's section through its middle, which is also its outline from the front */
function superellipse({ radius, roundness }: { radius: number; roundness: number }): string {
  return polygon(
    Array.from({ length: SAMPLES }, (_, i) => {
      const angle = (i / SAMPLES) * Math.PI * 2;

      return [radius * signPow(Math.cos(angle), roundness), radius * signPow(Math.sin(angle), roundness)];
    }),
  );
}

/** A lathed shape's profile, bottom to top, mirrored about its axis: the rings its geometry is swept from */
function lathe(profile: [number, number][], scaleX: number): string {
  const right = profile.map(([x, y]): [number, number] => [x * scaleX, y]);
  const left = right
    .slice()
    .reverse()
    .filter(([x]) => x > 1e-6)
    .map(([x, y]): [number, number] => [-x, y]);

  return polygon([...right, ...left]);
}

const arc = (cx: number, cy: number, radius: number, from: number, to: number): [number, number][] =>
  Array.from({ length: ARC_STEPS + 1 }, (_, step) => {
    const angle = from + ((to - from) * step) / ARC_STEPS;

    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  });

function pyramid(): string {
  const roll = cornerRoll(PYRAMID);
  const inner = PYRAMID.radius - roll;
  const slope = Math.atan2(inner, PYRAMID.height - 2 * roll);

  return lathe(
    [
      ...arc(inner, -PYRAMID.height / 2 + roll, roll, -Math.PI / 2, slope),
      ...arc(0, PYRAMID.height / 2 - roll, roll, slope, Math.PI / 2),
    ],
    KIND_SCALE.pyramid.x,
  );
}

function cylinder(): string {
  const roll = cornerRoll(CYLINDER);
  const inner = CYLINDER.radius - roll;

  return lathe(
    [
      ...arc(inner, -CYLINDER.height / 2 + roll, roll, -Math.PI / 2, 0),
      ...arc(inner, CYLINDER.height / 2 - roll, roll, 0, Math.PI / 2),
    ],
    KIND_SCALE.cylinder.x,
  );
}

function capsule(): string {
  const half = CAPSULE.height / 2 - CAPSULE.radius;

  return lathe(
    [...arc(0, -half, CAPSULE.radius, -Math.PI / 2, 0), ...arc(0, half, CAPSULE.radius, 0, Math.PI / 2)],
    KIND_SCALE.capsule.x,
  );
}

/** SVG path data per kind; the torus's hole needs `fill-rule="evenodd"` */
export const SILHOUETTES: Record<ShapeKind, string> = {
  sphere: circle(SPHERE.radius),
  cube: superellipse(CUBE),
  octahedron: superellipse(OCTAHEDRON),
  cylinder: cylinder(),
  pyramid: pyramid(),
  torus: circle(TORUS.radius + TORUS.tube) + circle(TORUS.radius - TORUS.tube),
  capsule: capsule(),
  bunny: polygon(
    Array.from({ length: BUNNY_POINTS.length / 2 }, (_, i) => [BUNNY_POINTS[i * 2], BUNNY_POINTS[i * 2 + 1]]),
  ),
};
