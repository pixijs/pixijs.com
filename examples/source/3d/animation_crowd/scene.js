/**
 * Where each fox of the herd stands and which way it faces, by its index in the crowd
 *
 * Fox 0 stands front and centre at the origin. Every other fox gets a small offset from a fixed hash of its index, so
 * the herd looks loose but the same on every run.
 */

/** Foxes per row, front to back. The front three widen so 12 foxes make a wedge; narrow rows of 3 trail behind it. */
const CROWD_ROWS = [3, 4, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
/** The rows of the wedge, which centre on the front fox */
const WEDGE_ROWS = 3;
/**
 * How far left each row behind the wedge steps from the one before. The far rows climb the screen toward the pane in
 * the top-right corner, so the herd trails off to the left of it, on a tablet held upright as well as on a laptop.
 */
const ROW_DRIFT = 0.3;
/** Every slot the rows hold: the largest crowd the pane offers */
export const MAX_FOXES = CROWD_ROWS.reduce((sum, count) => sum + count, 0);
/** Between rows, and between foxes in a row: room for each fox's legs and pose to read */
const ROW_SPACING = 1.9;
const FOX_SPACING = 2.1;
/** Radians about y: each fox faces right and a little toward the camera, side-on enough for its gait to read */
const HEADING = 0.95;
/** The full spread of each fox's offset from its seat */
const JITTER = { x: 0.5, z: 0.4, heading: 0.3 };

/** Where a fox stands and which way it faces, to spread into its `Model3D` options */

/** A fixed number from 0 to 1 for each `n`, so the herd's offsets come out the same on every run */
function hash(n) {
  const value = Math.sin(n * 12.9898 + 78.233) * 43758.5453;

  return value - Math.floor(value);
}

/** The seat a row's `k`th fox takes, in fox spacings from the row's centre: the middle first, then out to each side */
function seat(k, rowSize) {
  const side = k % 2 === 0 ? 1 : -1;

  return rowSize % 2 === 1
    ? side * Math.ceil(k / 2)
    : -side * (Math.floor(k / 2) + 0.5);
}

export function crowdSlot(index) {
  let row = 0;
  let first = 0;

  while (index >= first + CROWD_ROWS[row]) first += CROWD_ROWS[row++];

  const spread = index === 0 ? 0 : 1;
  const x =
    seat(index - first, CROWD_ROWS[row]) * FOX_SPACING -
    Math.max(0, row + 1 - WEDGE_ROWS) * ROW_DRIFT;
  const jitter = (channel) => spread * (hash(index * 3 + channel) - 0.5);

  return {
    position: {
      x: x + jitter(0) * JITTER.x,
      y: 0,
      z: -row * ROW_SPACING + jitter(1) * JITTER.z,
    },
    rotation: { x: 0, y: HEADING + jitter(2) * JITTER.heading, z: 0 },
  };
}
