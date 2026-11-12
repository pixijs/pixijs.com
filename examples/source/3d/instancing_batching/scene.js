/**
 * The props the lesson needs but doesn't teach: which shape and colour each piece wears, where it stands on the disc,
 * where the scout looks as it sweeps round, and how far back the main camera stands on a tablet held sideways
 *
 * Every roll is seeded and kept per piece, so piece `i` keeps its shape, colour and turn when the count changes.
 */

import { seededRandom, Vector3 } from '@pixi/3d';

import { CLAY_COLORS, CLAY_WEIGHTS } from './theme/palette';

import { CLAY_SHAPES } from './theme/shapes';

/** The disc's radius: 18 units across fills the overview with room for the inset below it */
const FIELD_RADIUS = 9;
/** The most pieces the pane allows */
export const MAX_COUNT = 3000;
/**
 * The widest shape, the rounded cube corner to corner, is about 1.01 across at scale 1. At this scale and
 * `MAX_COUNT` the spiral's nearest centres are 0.254 apart, which still leaves a gap between neighbours.
 */
export const PIECE_SCALE = 0.23;
/**
 * The clay colours most common first, so the first few the pane keeps are the ones a crowd shows most. Sky leads, so
 * a field of one colour stands apart from the scout's accent-pink footprint rather than melting into it.
 */
export const COLOR_ORDER = [
  'sky',
  ...CLAY_COLORS.filter((color) => color !== 'sky').sort(
    (a, b) => CLAY_WEIGHTS[b] - CLAY_WEIGHTS[a],
  ),
];

/**
 * Where the scout looks at first, in degrees from +x toward +z: left and a little toward the viewer, so the overview
 * sees its footprint side on and the culled half of the disc beside it
 */
const SCOUT_HEADING = 160;

/** Seconds the scout takes to sweep once round the disc: slow enough to watch the pieces wink in and out at its edges */
const SWEEP_PERIOD = 32;

/** The turn between neighbours on a sunflower spiral, which covers a disc evenly at any count */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
/** The scout hangs 4 units over the disc's centre and aims at the floor this far out, which tilts it 55° down */
const SCOUT_REACH = 2.8;
const _aim = new Vector3();

const random = seededRandom('instancing-batching');
const shapeRolls = Float32Array.from({ length: MAX_COUNT }, random);
const colorRolls = Float32Array.from({ length: MAX_COUNT }, random);
const turns = Float32Array.from(
  { length: MAX_COUNT },
  () => random() * Math.PI * 2,
);

/** Piece `i`'s shape among the first `shapes` of `CLAY_SHAPES` */
export function pieceShape(i, shapes) {
  return CLAY_SHAPES[Math.floor(shapeRolls[i] * shapes)];
}

/** Piece `i`'s colour among the first `colors` of {@link COLOR_ORDER}, as often as `CLAY_WEIGHTS` says */
export function pieceColor(i, colors) {
  let total = 0;

  for (let c = 0; c < colors; c++) total += CLAY_WEIGHTS[COLOR_ORDER[c]];

  let roll = colorRolls[i] * total;

  for (let c = 0; c < colors - 1; c++) {
    roll -= CLAY_WEIGHTS[COLOR_ORDER[c]];
    if (roll < 0) return COLOR_ORDER[c];
  }

  return COLOR_ORDER[colors - 1];
}

/** Spreads the pieces over the disc on a sunflower spiral, each resting on the floor at its own turn */
export function layoutField(pieces) {
  const count = pieces.length;

  for (let i = 0; i < count; i++) {
    const piece = pieces[i];
    const radius = FIELD_RADIUS * Math.sqrt((i + 0.5) / count);
    const angle = i * GOLDEN_ANGLE;

    piece.position.set(
      Math.cos(angle) * radius,
      -piece.geometry.bounds3D.min.y * PIECE_SCALE,
      Math.sin(angle) * radius,
    );
    piece.rotation.y = turns[i];
  }
}

/** Turns the scout to look `heading` degrees from +x toward +z, its view still tilted down at the floor */
function aimScout(scout, heading) {
  const angle = (heading * Math.PI) / 180;

  scout.lookAt(
    _aim.set(Math.cos(angle) * SCOUT_REACH, 0, Math.sin(angle) * SCOUT_REACH),
  );
}

/** The scout's sweep round the disc, like a radar beam; {@link createSweep} makes one */

/** Aims the scout at {@link SCOUT_HEADING} and sweeps it from there, turning from +x toward +z */
export function createSweep(scout) {
  let heading = SCOUT_HEADING;
  const sweep = {
    on: true,
    get heading() {
      return heading;
    },
    aim(to) {
      sweep.on = false;
      heading = to;
      aimScout(scout, heading);
    },
    update(dt) {
      if (!sweep.on) return;
      heading = (heading + (360 * dt) / SWEEP_PERIOD) % 360;
      aimScout(scout, heading);
    },
  };

  aimScout(scout, heading);

  return sweep;
}

/**
 * Backs the camera and the fog off on a landscape narrower than `minAspect`, by `minAspect / aspect`, so the disc
 * clears the panels down the right; it follows the renderer's resizes
 *
 * `fitPortrait` covers an upright screen. Call this after it: both zoom the orbit by a factor, so they stack, and
 * `fitPortrait` sets the fog afresh on each resize before this scales it.
 */
export function fitBesidePanels(options) {
  const { renderer, orbit, stage, minAspect, portraitBelow } = options;
  let backOff = 1;
  const refit = () => {
    const aspect = renderer.screen.width / renderer.screen.height;
    const next = aspect < portraitBelow ? 1 : Math.max(minAspect / aspect, 1);

    orbit.zoom(backOff / next);
    backOff = next;
    stage.fog.near *= next;
    stage.fog.far *= next;
  };

  refit();
  renderer.on('resize', refit);
}
