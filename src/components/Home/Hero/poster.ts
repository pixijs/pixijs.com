/**
 * The hero's first frame as markup: the backdrop's blob masses and specks at `elapsed = 0` (the clay shapes that
 * stand in for the field until it starts are in `posterShapes.ts`, so the pages that share this backdrop don't
 * load them). Pure and computed at module load, so the server and the client render the same paths.
 * `field/backdrop.ts` draws from the same tables, which is what makes the swap from this poster to the live
 * canvas invisible.
 */

/** The design space the blobs are laid out in, scaled like `xMidYMid slice` to cover the hero */
export const DESIGN_WIDTH = 1280;
export const DESIGN_HEIGHT = 720;

/** Blob layout: centre and radius as fractions of the design, and the control points its outline runs through */
const BLOBS: readonly [x: number, y: number, radius: number, points: number][] = [
  [0.12, 0.1, 0.62, 7],
  [0.92, 0.2, 0.52, 6],
  [0.55, 0.5, 0.72, 8],
  [0.85, 0.9, 0.55, 7],
  [0.1, 0.88, 0.48, 6],
  [0.4, 0.06, 0.36, 6],
];

/** Radius the blob outline breathes by, and how fast the whole blob drifts */
const WOBBLE_MIN = 0.08;
const WOBBLE_RANGE = 0.14;
const WOBBLE_RATE_MIN = 0.25;
const WOBBLE_RATE_RANGE = 0.3;
const DRIFT_X = 0.04;
const DRIFT_Y = 0.05;
/** Masses are wider than they are tall */
const BLOB_SQUASH = 0.82;
const RADIUS_SCALE = 0.62;

/** Each mass's shadow: a skirt pushed down by the offset and out to `SHADOW_GROW` times the outline */
export const SHADOW_OFFSET_Y = 14;
export const SHADOW_GROW = 1.16;

/** How far down a mass the light catching its top reaches */
export const RIM_REACH = 0.65;

const SPECK_COLORS = [0xf2a65a, 0x38bdf8, 0xe91e63, 0x8b5cf6, 0xffffff];
const SPECK_COUNT = 10;
export const SPECK_DRIFT_X = 26;
export const SPECK_DRIFT_Y = 20;

const TAU = Math.PI * 2;

/** Deterministic 0-1 value, so the composition is the same on every visit */
const hash = (n: number): number => {
  const value = Math.sin(n * 78.233) * 43758.5453;

  return value - Math.floor(value);
};

export interface Blob {
  x: number;
  y: number;
  radius: number;
  driftRateX: number;
  driftRateY: number;
  driftPhaseX: number;
  driftPhaseY: number;
  wobbleRate: number;
  phases: number[];
  amplitudes: number[];
}

export const blobs: Blob[] = BLOBS.map(([x, y, radius, points], index) => ({
  x,
  y,
  radius: radius * DESIGN_WIDTH * RADIUS_SCALE,
  driftRateX: 0.05 + hash(index) * 0.07,
  driftRateY: 0.05 + hash(index + 3) * 0.07,
  driftPhaseX: hash(index + 7) * TAU,
  driftPhaseY: hash(index + 13) * TAU,
  wobbleRate: WOBBLE_RATE_MIN + hash(index + 17) * WOBBLE_RATE_RANGE,
  phases: Array.from({ length: points }, (_, p) => hash(index * 31 + p) * TAU),
  amplitudes: Array.from({ length: points }, (_, p) => WOBBLE_MIN + hash(index * 47 + p) * WOBBLE_RANGE),
}));

/** Writes a blob's centre and control points at `elapsed` seconds, in design units */
export function blobPoints(blob: Blob, elapsed: number, xs: number[], ys: number[]): [cx: number, cy: number] {
  const cx = (blob.x + Math.cos(elapsed * blob.driftRateX + blob.driftPhaseX) * DRIFT_X) * DESIGN_WIDTH;
  const cy = (blob.y + Math.sin(elapsed * blob.driftRateY + blob.driftPhaseY) * DRIFT_Y) * DESIGN_HEIGHT;
  const count = blob.phases.length;

  xs.length = 0;
  ys.length = 0;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * TAU;
    const breathe = 1 + Math.sin(elapsed * blob.wobbleRate + blob.phases[i]) * blob.amplitudes[i];

    xs.push(cx + Math.cos(angle) * blob.radius * breathe);
    ys.push(cy + Math.sin(angle) * blob.radius * breathe * BLOB_SQUASH);
  }

  return [cx, cy];
}

export interface Speck {
  x: number;
  y: number;
  radius: number;
  color: number;
  rate: number;
  phase: number;
}

/** The middle of the hero, where the copy stands: a speck drifting behind a line of it reads as stray punctuation */
const overCopy = (x: number, y: number): boolean => Math.abs(x - 0.5) < 0.44 && y > 0.14 && y < 0.86;

/** Places are drawn from the hash stream until enough of them fall clear of the copy */
const SPECK_PLACES = Array.from({ length: SPECK_COUNT * 12 }, (_, index) => index)
  .filter((index) => !overCopy(hash(index + 61), hash(index + 71)))
  .slice(0, SPECK_COUNT);

export const specks: Speck[] = SPECK_PLACES.map((place, index) => ({
  x: hash(place + 61),
  y: hash(place + 71),
  radius: 1.6 + hash(index + 83) * 2.4,
  color: SPECK_COLORS[index % SPECK_COLORS.length],
  rate: 0.3 + hash(index + 97) * 0.5,
  phase: hash(index + 101) * TAU,
}));

export const speckAlpha = (speck: Speck, elapsed: number): number => 0.35 + 0.3 * Math.sin(elapsed * 1.3 + speck.phase);

const round = (value: number): string => String(Math.round(value * 10) / 10);

/**
 * An outline through the midpoints between control points, each point the handle of a quadratic curve,
 * which keeps the join smooth however the points move. `field/backdrop.ts` flattens the same curves.
 */
function outlinePath(xs: number[], ys: number[], scale = 1, cx = 0, cy = 0, dy = 0): string {
  const count = xs.length;
  const x = (i: number) => cx + (xs[(i + count) % count] - cx) * scale;
  const y = (i: number) => cy + (ys[(i + count) % count] - cy) * scale + dy;
  const mid = (i: number) => `${round((x(i) + x(i + 1)) / 2)} ${round((y(i) + y(i + 1)) / 2)}`;
  let path = `M${mid(-1)}`;

  for (let i = 0; i < count; i++) path += `Q${round(x(i))} ${round(y(i))} ${mid(i)}`;

  return `${path}Z`;
}

export interface PosterBlob {
  body: string;
  shadow: string;
}

export const posterBlobs: PosterBlob[] = blobs.map((blob) => {
  const xs: number[] = [];
  const ys: number[] = [];
  const [cx, cy] = blobPoints(blob, 0, xs, ys);

  return { body: outlinePath(xs, ys), shadow: outlinePath(xs, ys, SHADOW_GROW, cx, cy, SHADOW_OFFSET_Y) };
});
