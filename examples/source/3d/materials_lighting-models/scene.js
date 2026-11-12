/**
 * The props: where the three columns stand on each shape of screen, and the builder that stands a logo and its ball
 * in one column
 *
 * A landscape screen gets a row of columns, each a logo over its ball. A short landscape screen, such as a phone held
 * sideways, sets each ball beside its logo so the three pairs fit the height. A portrait screen stacks the pairs.
 */

import { Container3D } from '@pixi/3d';

/** Three logos this wide fill a landscape row with a gap between them */
export const LOGO_WIDTH = 3;
/** Big enough that its highlight and reflection read at a glance, small enough to sit by its logo */
export const BALL_RADIUS = 0.6;

/** Below this px height the row's logos and balls stand too small to read, so the short layout pairs them up */
const ROW_MIN_HEIGHT = 440;

/**
 * How far the orbit turns: from level to 14° above it, and 26° either way. That's far enough to watch the PBR ball's
 * reflection slide over it; higher or further round, the key light's rays run into the middle column's tag. No
 * panning, which would slide the columns off the centre they're framed on.
 */
const ORBIT_LIMITS = {
  enablePan: false,
  minPolarAngle: Math.PI * 0.42,
  maxPolarAngle: Math.PI / 2,
  minAzimuthAngle: -0.45,
  maxAzimuthAngle: 0.45,
};

/** Where a light's rays end: the point they aim at, how far short of it they stop, and each ray's length */

/**
 * Where the columns, the camera and the fog sit on one shape of screen
 *
 * The last four fields place what `visuals.ts` draws, its tags and the key light's rays, which move with the columns.
 */

const ROW = {
  first: { x: -3.8, y: 0, z: 0 },
  step: { x: 3.8, y: 0, z: 0 },
  logo: { x: 0, y: 2.75, z: 0 },
  ball: { x: 0, y: 1.05, z: 0.3 },
  shadows: true,
  fov: 40,
  camera: { x: 0, y: 3.1, z: 10.8 },
  target: { x: 0, y: 2.6, z: 0 },
  orbit: { minDistance: 7, maxDistance: 16, ...ORBIT_LIMITS },
  fog: { near: 12, far: 40 },
  minAspect: 1.5,
  tagsBelow: false,
  keyRays: { target: { x: 0, y: 2.75, z: 0 }, gap: 1.7, length: 0.9 },
  rayThickness: 0.022,
  reflection: { clock: 1.75, offset: { x: 112, y: -22 } },
};

const SHORT = {
  first: { x: -5.3, y: 0, z: 0 },
  step: { x: 5.3, y: 0, z: 0 },
  logo: { x: -0.75, y: 2, z: 0 },
  ball: { x: 1.65, y: 2, z: 0.2 },
  shadows: true,
  // The pairs fill a wide view, so a wide lens would see the outer balls from 35° off its axis and draw them as ovals.
  // A longer lens, backed off to frame the same width, sees them from about 20°, where they stay round.
  fov: 22,
  camera: { x: 0, y: 3.8, z: 19.1 },
  target: { x: 0, y: 2.7, z: 0 },
  orbit: { minDistance: 13, maxDistance: 30, ...ORBIT_LIMITS },
  fog: { near: 22, far: 75 },
  minAspect: 2.2,
  tagsBelow: true,
  keyRays: { target: { x: 1.65, y: 2.6, z: 0.2 }, gap: 0.75, length: 0.6 },
  rayThickness: 0.022,
  reflection: { clock: 1, offset: { x: 40, y: -24 } },
};

const STACK = {
  first: { x: 0, y: 7.2, z: 0 },
  step: { x: 0, y: -2.6, z: 0 },
  logo: { x: -0.75, y: 0.25, z: 0 },
  ball: { x: 1.65, y: 0.25, z: 0.2 },
  shadows: false,
  fov: 40,
  camera: { x: 0, y: 5.5, z: 16 },
  target: { x: 0, y: 5.2, z: 0 },
  orbit: { minDistance: 11, maxDistance: 22, ...ORBIT_LIMITS },
  // The camera stands 16 back, past the kit's default fog start.
  fog: { near: 18, far: 46 },
  minAspect: 0.45,
  tagsBelow: true,
  keyRays: { target: { x: -1.3, y: 7.8, z: 0 }, gap: 0.45, length: 0.6 },
  rayThickness: 0.04,
  reflection: { clock: 1, offset: { x: -28, y: -22 } },
};

/**
 * Picks the layout at boot: a stack on a portrait screen, else the row, unless the row would stand so small that its
 * model tags run into each other
 */
export function pickLayout(width, height) {
  if (width < height) return STACK;

  // On a view narrower than the row's minAspect, fitPortrait backs off until the row fits the width, so the row is
  // framed for that height rather than the screen's.
  return Math.min(height, width / ROW.minAspect) >= ROW_MIN_HEIGHT
    ? ROW
    : SHORT;
}

/** Stands a logo and its ball in the layout's column `index` */
export function createColumn({ logo, ball, layout, index, parent }) {
  const { first, step } = layout;
  const root = new Container3D({
    position: {
      x: first.x + step.x * index,
      y: first.y + step.y * index,
      z: first.z + step.z * index,
    },
    parent,
  });

  logo.root.position.copyFrom(layout.logo);
  ball.position.copyFrom(layout.ball);
  root.addChild(logo.root, ball);

  return { logo, ball };
}
