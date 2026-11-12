/**
 * The assembly's keyframes as plain numbers, and the value layout `'CUBICSPLINE'` needs
 *
 * Every position is in the logo's space, the space of the player's target, where the floor is at `-LOGO_HEIGHT`.
 */

import { Quaternion } from '@pixi/3d';

/** The pane's order */
export const INTERPOLATIONS = ['STEP', 'LINEAR', 'CUBICSPLINE'];
/** Seconds in one pass; the last keyframe is at 3.3 s, so the assembled logo holds before the loop */
export const DURATION = 4;
/** The logo's centre above the floor */
export const LOGO_HEIGHT = 1.6;
/** The order the pieces move in */
export const HOP_ORDER = ['ixi', 'p', 'dotL', 'dotR', 'js'];
/** Bright enough to flush the pink enamel on the light theme, well over the stage's key */
export const FLASH_PEAK = 70;

/** One property's keyframes, as `TrackOptions` takes them: `values` holds one value's numbers per time, in turn */

/** One piece's hop: when it starts, bends and lands, where it starts (on the floor when `y` is left out), its bend */

/**
 * `p` and the badge hop sideways off the floor, so their arcs are seen side on; the dots swoop down from above, clear
 * of them. `ixi` bends just under its own place and rises straight up through the X's solid middle, so its path never
 * shows through the X's holes.
 */
const HOPS = {
  ixi: {
    times: [0, 0.45, 0.75],
    from: { x: -1.4, z: 0.6 },
    via: { x: 0.16, y: -0.95, z: 0.25 },
  },
  p: {
    times: [0.35, 0.75, 1.15],
    from: { x: -3.4, z: 0 },
    via: { x: -2.45, y: 0.85, z: 0 },
  },
  dotL: {
    times: [0.9, 1.2, 1.45],
    from: { x: -1.5, y: 2.4, z: 0 },
    via: { x: -0.62, y: 1.55, z: 0 },
  },
  dotR: {
    times: [1.1, 1.4, 1.65],
    from: { x: 2.1, y: 2.4, z: 0 },
    via: { x: 0.98, y: 1.55, z: 0 },
  },
  js: {
    times: [1.5, 1.95, 2.4],
    from: { x: 3.4, z: 0 },
    via: { x: 2.55, y: 1.25, z: 0 },
  },
};

/** A piece's three position keyframes, x, y and z each: its start, its bend, and its own place in the logo */
export function hopKeys(piece) {
  const { times, from, via } = HOPS[piece.id];
  const startY = from.y ?? -LOGO_HEIGHT + piece.half.y;
  const { rest } = piece;

  return {
    times,
    values: [
      from.x,
      startY,
      from.z,
      via.x,
      via.y,
      via.z,
      rest.x,
      rest.y,
      rest.z,
    ],
  };
}

/** A turn about z as a quaternion's four numbers */
const roll = (z) => new Quaternion().setFromEuler({ x: 0, y: 0, z }).toArray();

/**
 * The badge's roll as it hops, from upside down to on its side to upright. A `QuaternionTrack` slerps the short way
 * round, so keys stay under half a turn apart: the half turn is two quarter turns.
 */
export const JS_ROLL = {
  times: HOPS.js.times,
  values: [-Math.PI, -Math.PI / 2, 0].flatMap(roll),
};

/**
 * Keyframes laid out the way `interpolation` stores them: `'CUBICSPLINE'` keeps an in-tangent and an out-tangent
 * round every value, and the others keep the values alone
 */
export function layout(keyframes, interpolation) {
  return interpolation === 'CUBICSPLINE' ? withTangents(keyframes) : keyframes;
}

/**
 * The same keyframes in the `'CUBICSPLINE'` layout: in-tangent, value, out-tangent for each key
 *
 * Each value is as many numbers as `values` holds per time: 3 for a position, 4 for a quaternion, 1 for a number. A
 * middle key's tangent is the slope between its neighbours, in and out alike, so the curve runs smoothly through it;
 * the first and last keys get 0, so the motion eases off and in. Tangents are rates of change per second, as glTF
 * stores them and `TrackOptions.values` expects.
 */
function withTangents({ times, values }) {
  const size = values.length / times.length;
  const last = times.length - 1;
  const out = [];

  for (let i = 0; i <= last; i++) {
    for (let k = 0; k < size; k++) {
      const slope =
        i > 0 && i < last
          ? (values[(i + 1) * size + k] - values[(i - 1) * size + k]) /
            (times[i + 1] - times[i - 1])
          : 0;

      out[i * size * 3 + k] = slope;
      out[i * size * 3 + size + k] = values[i * size + k];
      out[i * size * 3 + size * 2 + k] = slope;
    }
  }

  return { times, values: out };
}
