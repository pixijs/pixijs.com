import { BUNNY_INSET, HALF_DEPTH, ROLL } from './bunny';
import {
  capsuleHull,
  extrudedHull,
  roundedCylinderHull,
  roundedPyramidHull,
  sphereHull,
  superellipsoidHull,
  torusHull,
} from './hull';

import type { ClayShapeName } from '@site/src/components/ui/Clay';
import type { Hull } from './hull';

export type ShapeKind = 'sphere' | 'pyramid' | 'torus' | 'capsule' | 'cube' | 'octahedron' | 'cylinder' | 'bunny';
export type ClayKind = Exclude<ShapeKind, 'bunny'>;
/** The tints the clay images come in */
export type ImageTint = 'pink' | 'rose' | 'violet' | 'cyan';
/** A clay shape's tint, or the bunny's gold */
export type ShapeTint = ImageTint | 'gold';
/** A hero shape: one of the clay images, or the bunny, whose images `scripts/render-bunny.mjs` renders */
export type HeroShapeName = ClayShapeName | 'bunny-gold';

/** `--px-pink`, `--px-pink-hi`, `--px-violet` and `--px-sky` */
export const TINTS: Record<ImageTint, number> = {
  pink: 0xe91e63,
  rose: 0xf06695,
  violet: 0x8b5cf6,
  cyan: 0x38bdf8,
};

/**
 * How each kind is built. Named rather than written inline because the collision hulls are derived
 * from the very same numbers, which is what stops the two describing different shapes. Every kind
 * is authored to fill roughly the same unit sphere, so a body's radius means the same thing whichever
 * shape is in it, and every edge is rolled off, the pyramid's included.
 */
export const SPHERE = { radius: 1, widthSegments: 48, heightSegments: 32 };
export const CUBE = { radius: 0.8, roundness: 0.22, segments: 64 };
export const OCTAHEDRON = { radius: 1.05, roundness: 1.78, segments: 64 };
export const CYLINDER = { radius: 0.74, height: 1.5, rounding: 0.2, roundness: 1, segments: 56 };
export const PYRAMID = { radius: 0.88, height: 1.9, rounding: 0.15, roundness: 0.22, segments: 56 };
export const TORUS = { radius: 0.7, tube: 0.33, radialSegments: 28, tubularSegments: 72 };
export const CAPSULE = { radius: 0.54, height: 2, radialSegments: 40, heightSegments: 6 };

/** Per-kind scale, applied on top of a body's radius, where a kind needs its proportions nudged */
export const KIND_SCALE: Record<ShapeKind, { x: number; y: number; z: number }> = {
  sphere: { x: 1, y: 1, z: 1 },
  pyramid: { x: 1.05, y: 1, z: 1.05 },
  torus: { x: 1, y: 1, z: 1 },
  capsule: { x: 1, y: 1, z: 1 },
  cube: { x: 1, y: 1, z: 1 },
  octahedron: { x: 1, y: 1, z: 1 },
  cylinder: { x: 1, y: 1, z: 1 },
  bunny: { x: 1, y: 1, z: 1 },
};

interface Form {
  /** What the field collides with: the shape's own surface rather than a circle around it; see {@link Hull} */
  hull: Hull;
  /** The furthest it ever reaches, in the same units as a body's radius; the broad phase of {@link stepField} */
  reach: number;
}

const form = (kind: ShapeKind, hull: Hull): Form => ({ hull, reach: hull.furthest(KIND_SCALE[kind]) });

export const FORMS: Record<ShapeKind, Form> = {
  sphere: form('sphere', sphereHull(SPHERE)),
  cube: form('cube', superellipsoidHull(CUBE)),
  octahedron: form('octahedron', superellipsoidHull(OCTAHEDRON)),
  cylinder: form('cylinder', roundedCylinderHull(CYLINDER)),
  pyramid: form('pyramid', roundedPyramidHull(PYRAMID)),
  torus: form('torus', torusHull(TORUS)),
  capsule: form('capsule', capsuleHull(CAPSULE)),
  bunny: form('bunny', extrudedHull(BUNNY_INSET, HALF_DEPTH, ROLL)),
};

/**
 * Resting pitch per kind. A torus ring lies in the XZ plane, so it needs a quarter turn to face the
 * camera at all; every other kind already presents its profile square on, the outline its shadow is
 * cast from.
 */
export const KIND_PITCH: Record<ShapeKind, number> = {
  sphere: 0,
  pyramid: 0,
  torus: Math.PI / 2,
  capsule: 0,
  cube: 0,
  octahedron: 0,
  cylinder: 0,
  bunny: 0,
};

/**
 * The pose each clay image is rendered in: pitch and yaw on top of its kind's rest pitch, and roll counter-clockwise
 * in the screen plane. The field rests every shape in its image's pose, so a poster image and the live shape that
 * takes over from it are one picture; `scripts/render-clay.mjs` renders the images from this table.
 */
export const CLAY_POSES: Record<ClayShapeName, readonly [pitch: number, yaw: number, roll: number]> = {
  'capsule-rose': [0.2, 0.3, 0.9],
  'cube-pink': [0.45, -0.5, 0.2],
  'cube-violet': [0.5, 0.6, 0.15],
  'cylinder-cyan': [0.5, 0.3, 0.6],
  'octahedron-violet': [0.3, 0.4, 0.2],
  'pyramid-cyan': [0.3, -0.4, 0.5],
  'pyramid-pink': [0.2, 0.5, -0.4],
  'sphere-cyan': [0, 0, 0],
  'sphere-pink': [0, 0, 0],
  'sphere-violet': [0, 0, 0],
  'torus-cyan': [0.3, -0.3, 0.3],
  'torus-pink': [0.35, 0.25, -0.2],
};

/** {@link CLAY_POSES}, and the bunny's: turned just enough to show its depth and still read face on */
export const HERO_POSES: Record<HeroShapeName, readonly [pitch: number, yaw: number, roll: number]> = {
  ...CLAY_POSES,
  'bunny-gold': [0.12, 0.42, 0.12],
};

/** The furthest an opaque pixel of a clay image sits from its centre, as a share of the image: `FILL` in `scripts/render-clay.mjs` */
const CLAY_FILL = 0.45;

/** Half the side of the square a flat outline is drawn in (`silhouette.ts`), in the units its geometry is authored in */
export const SILHOUETTE_REACH = 1.1;

/**
 * Distance from the camera, by a shape's depth: 0 in the middle of the slab, 1 the nearest and -1 the furthest. The
 * sim is screen-space and the projection cancels distance out of a shape's size and place, so this sets what passes
 * in front of what and how the lens bends a shape.
 */
export const MID_DIST = 9.2;
const DEPTH_SPREAD = 0.9;

/** A direction in a shape's own axes */
interface Axis {
  x: number;
  y: number;
  z: number;
}

/** Where a shape starts: one of the poster's, measured off the page */
export interface ShapeSeed {
  /** Which of the poster's shapes it is */
  slot: number;
  kind: ShapeKind;
  tint: ShapeTint;
  /** Centre, and the side of the square the poster draws it in, in the host's pixels */
  x: number;
  y: number;
  size: number;
  /** -1 the furthest back to 1 the nearest */
  depth: number;
}

/**
 * A shape as the simulation sees it: `radius` pixels of one kind somewhere on the hero, carrying its
 * own velocity and spin. Everything here is screen space; the 3D placement is derived from it.
 */
export interface ShapeBody {
  slot: number;
  kind: ShapeKind;
  tint: ShapeTint;
  /** Pixels per unit of its geometry */
  radius: number;
  /** The side of the poster's square, and the radius per pixel of it */
  size: number;
  perPixel: number;
  /** From the middle of the clay image to the shape's own centre, in units of its geometry: the image is centred on what it shows */
  offsetX: number;
  offsetY: number;
  depth: number;
  dist: number;
  x: number;
  y: number;
  /** Where the composition has it: it wanders and gets knocked about, and always drifts back */
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  /** Roll in the screen plane, the rate it is turning at, and the roll it's sprung back to */
  angle: number;
  spin: number;
  restAngle: number;
  /** Live pitch and yaw, and the rate each is turning at */
  pitch: number;
  yaw: number;
  pitchSpin: number;
  yawSpin: number;
  /**
   * The pose pitch and yaw are sprung back to. A shape left to tumble freely spends half its life
   * pointing down the camera axis, where a pyramid reads as a circle and a torus as a line; a spring
   * lets a hit knock a shape well off its pose and still always brings it back.
   */
  restPitch: number;
  restYaw: number;
  /** When a puff, or the entrance, reaches this shape: 0 at its origin, 1 the furthest out */
  wave: number;
  /** Frequencies and phases for the two idle sines that keep a shape from ever settling */
  f1: number;
  f2: number;
  p1: number;
  p2: number;
  /** Flinch on a hard hit, decaying back to zero */
  squash: number;
  /**
   * Screen right and screen up in the shape's own axes, refreshed from its rotation once a step. A
   * screen direction `(nx, ny)` is `nx * right - ny * up` in that frame (screen y runs down where a
   * shape's own axis runs up), which is what a {@link Form}'s hull asks for.
   */
  right: Axis;
  up: Axis;
}

/**
 * Writes screen right and screen up in a shape's own axes, for a shape rolled in the screen plane and then pitched
 * and yawed: the first two rows of `Rz(roll)·Rx(pitch)·Ry(yaw)`.
 */
export function screenAxes(pitch: number, yaw: number, roll: number, right: Axis, up: Axis): void {
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const cosRoll = Math.cos(roll);
  const sinRoll = Math.sin(roll);

  right.x = cosRoll * cosYaw - sinRoll * sinPitch * sinYaw;
  right.y = -sinRoll * cosPitch;
  right.z = cosRoll * sinYaw + sinRoll * sinPitch * cosYaw;
  up.x = sinRoll * cosYaw + cosRoll * sinPitch * sinYaw;
  up.y = cosRoll * cosPitch;
  up.z = sinRoll * sinYaw - cosRoll * sinPitch * cosYaw;
}

/** How far a kind's surface reaches along the screen direction `(nx, ny)`, in units of its geometry */
export function reachOnScreen(kind: ShapeKind, right: Axis, up: Axis, nx: number, ny: number): number {
  const scale = KIND_SCALE[kind];

  return FORMS[kind].hull.reach(
    (nx * right.x - ny * up.x) * scale.x,
    (nx * right.y - ny * up.y) * scale.y,
    (nx * right.z - ny * up.z) * scale.z,
  );
}

/** A pose's bounding box on screen: its centre, and half its longer side */
function frame(kind: ShapeKind, pitch: number, yaw: number, roll: number): { x: number; y: number; extent: number } {
  const right = { x: 1, y: 0, z: 0 };
  const up = { x: 0, y: 1, z: 0 };

  screenAxes(pitch, yaw, roll, right, up);

  const east = reachOnScreen(kind, right, up, 1, 0);
  const west = reachOnScreen(kind, right, up, -1, 0);
  const south = reachOnScreen(kind, right, up, 0, 1);
  const north = reachOnScreen(kind, right, up, 0, -1);

  return { x: (east - west) / 2, y: (south - north) / 2, extent: Math.max(east + west, south + north) / 2 };
}

/** Deterministic 0-1 stream, so the field is the same composition on every visit */
function makeRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;

    return state / 4294967296;
  };
}

/**
 * How a shape sits in its poster square: its radius per pixel of the square, and the offset from the square's middle
 * to its own centre, in units of its geometry. An image is scaled to fill its square and centred on what it shows.
 * The clay images were rendered at the scale they shared with their old flat, face-on renderings, so the larger of the
 * two poses still sets it; `scripts/render-clay.mjs` now fits the clay pose alone, so drop `flat` here when the clay
 * images are next rendered.
 */
export function posterFit(kind: ShapeKind, tint: ShapeTint): { radius: number; offsetX: number; offsetY: number } {
  const [pitch, yaw, roll] = HERO_POSES[`${kind}-${tint}` as HeroShapeName];
  const clay = frame(kind, KIND_PITCH[kind] + pitch, yaw, roll);
  const flat = frame(kind, KIND_PITCH[kind], 0, roll);

  return { radius: CLAY_FILL / Math.max(clay.extent, flat.extent), offsetX: -clay.x, offsetY: -clay.y };
}

/** The field's shapes, standing where the poster's stand, each with its own idle rhythm */
export function createBodies(seeds: readonly ShapeSeed[]): ShapeBody[] {
  const random = makeRandom(0x5eed);

  return seeds.map((seed) => {
    const [pitch, yaw, roll] = HERO_POSES[`${seed.kind}-${seed.tint}` as HeroShapeName];
    const restPitch = KIND_PITCH[seed.kind] + pitch;
    const fit = posterFit(seed.kind, seed.tint);

    return {
      slot: seed.slot,
      kind: seed.kind,
      tint: seed.tint,
      radius: seed.size * fit.radius,
      size: seed.size,
      perPixel: fit.radius,
      offsetX: fit.offsetX,
      offsetY: fit.offsetY,
      depth: seed.depth,
      dist: MID_DIST - seed.depth * DEPTH_SPREAD,
      x: seed.x,
      y: seed.y,
      homeX: seed.x,
      homeY: seed.y,
      vx: (random() - 0.5) * 30,
      vy: (random() - 0.5) * 30,
      angle: roll,
      spin: 0,
      restAngle: roll,
      pitch: restPitch,
      yaw,
      pitchSpin: 0,
      yawSpin: 0,
      restPitch,
      restYaw: yaw,
      wave: 0,
      f1: 0.4 + random() * 0.7,
      f2: 0.4 + random() * 0.7,
      p1: random() * Math.PI * 2,
      p2: random() * Math.PI * 2,
      squash: 0,
      right: { x: 1, y: 0, z: 0 },
      up: { x: 0, y: 1, z: 0 },
    };
  });
}
