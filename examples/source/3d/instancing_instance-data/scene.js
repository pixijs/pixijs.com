/**
 * The field's layout and the numbers each slot carries: where slot `i` stands, its place on the wave for each
 * pattern, and its colour on a ramp of clay colours
 *
 * Plain numbers, no engine objects: `index.ts` writes them into the batch, and `visuals.ts` reads where the probe
 * stands.
 */

import { srgbToLinear } from '@pixi/3d';

import { Color } from 'pixi.js';

import { CLAY, DARK_ORANGE } from './theme/palette';

/**
 * Cubes across: ±26.5 units, the widest any view the orbit allows sees before the fog closes, so a wider orbit needs
 * more. An odd count puts a column on the centre line, so the camera looks along cubes rather than down a gap.
 */
const COLUMNS = 157;
/** Rows deep: back to z ≈ −36, past where a phone's fog, pushed out by `fitPortrait`, closes. A closer zoom needs more */
const ROWS = 120;
export const SLOT_COUNT = COLUMNS * ROWS;
/** Centre to centre, in world units */
const SPACING = 0.34;
/** The clay cube's scale in the field: it leaves a gap of about a sixth of the spacing between neighbours */
export const CUBE_SCALE = 0.35;
/** The front row, well in front of the camera's target, so the probe sits low with just enough floor for its two tags */
const FRONT_Z = 4.5;
/** The height every matrix puts a cube at, high enough that the deepest trough still clears the floor */
const REST_Y = 0.8;

/** Where the ripple and the spiral start, a little behind the middle of the field */
const WAVE_CENTRE = { x: 0, z: -3.5 };
/** Radians of wave a unit: one wavelength is 3.9 units, about 11 cubes */
const WAVE_NUMBER = 1.6;
/** The lift at the wave's centre, which falls off with distance so the rim rolls calmer */
const MAX_LIFT = 0.6;
/** The distance at which the lift halves: the probe, 8 units out, rises 0.36, and the rim under 0.2 */
const FALLOFF = 12;

/** Each pattern's phase offset for a slot at `x`, `z`: how far behind the wave's start it rises */
export const WAVE_PATTERNS = {
  ripple: (x, z) => WAVE_NUMBER * distanceFromCentre(x, z),
  diagonal: (x, z) => (WAVE_NUMBER * (x + z)) / Math.SQRT2,
  spiral: (x, z) =>
    WAVE_NUMBER * distanceFromCentre(x, z) +
    3 * Math.atan2(z - WAVE_CENTRE.z, x - WAVE_CENTRE.x),
};

/**
 * The colours a slot can wear, in the order the pane's Colours adds them
 *
 * The last is the amber that orange clay turns to in the dark: a tint is written once, not repainted per theme, and
 * the brand orange reads as brown on the dark floor.
 */
const COLOR_RAMP = [
  CLAY.sky,
  CLAY.paleSky,
  CLAY.lilac,
  CLAY.purple,
  CLAY.pink,
  CLAY.palePink,
  DARK_ORANGE,
];

export const RAMP_SIZE = COLOR_RAMP.length;

/** The ramp's colours as rgb in linear light, since the bit multiplies `albedo`, which is linear: three numbers each */
export const RAMP_LINEAR = new Float32Array(
  COLOR_RAMP.flatMap((color) =>
    Color.shared
      .setValue(color)
      .toRgbArray()
      .map((channel) => srgbToLinear(channel)),
  ),
);

function distanceFromCentre(x, z) {
  return Math.hypot(x - WAVE_CENTRE.x, z - WAVE_CENTRE.z);
}

/** Where slot `i`'s matrix puts it: rows run back from the front, so the GPU draws the near cubes first */
export function slotPosition(i, out) {
  out.x = ((i % COLUMNS) - (COLUMNS - 1) / 2) * SPACING;
  out.y = REST_Y;
  out.z = FRONT_Z - Math.floor(i / COLUMNS) * SPACING;

  return out;
}

/** How high a slot at `x`, `z` rises: 0.6 at the wave's centre, under 0.2 toward the rim */
export function waveHeight(x, z) {
  return MAX_LIFT / (1 + distanceFromCentre(x, z) / FALLOFF);
}

/** Where slot `i`'s colour starts in {@link RAMP_LINEAR}, when the slots share the ramp's first `count` colours */
export function rampOffset(i, count) {
  return Math.floor(slotHash(i) * count) * 3;
}

/** A number from 0 to 1 fixed per slot, so neighbours differ and two runs match */
function slotHash(i) {
  let h = Math.imul(i ^ 0x1b873593, 0x85ebca6b);

  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;

  return (h >>> 0) / 4294967296;
}
