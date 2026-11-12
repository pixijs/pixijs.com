/** The props: a field of clay, four columns of one shape each, running away from the camera into the fog */

import { Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { clayGeometry } from './theme/shapes';

/**
 * A column keeps one shape and one colour all the way back, so how pale each one looks comes from the fog alone. The
 * aisle down the middle keeps the floor's depth in view.
 */
const COLUMNS = [
  { x: -4.4, shape: 'puck', color: 'orange' },
  { x: -1.8, shape: 'capsule', color: 'purple' },
  { x: 1.8, shape: 'cube', color: 'pink' },
  { x: 4.4, shape: 'sphere', color: 'sky' },
];
/** Rows from just past the linear fog's `near` to depth 93, where exponential fog is still only 80% */
const ROWS = 14;
/** World units between rows: 14 rows, 6 apart, end at depth 93 */
const ROW_GAP = 6;
/** The first row stands 16.6 deep from the camera at z 13, just past linear fog's `near` 15, so it starts crisp */
const FIRST_ROW_Z = -3;
/** A touch over the clay's unit size, so the far rows still read as shapes while the aisle between columns stays open */
const SCALE = 1.15;
/** The cubes' turn, radians a second, and the step between one row's start and the next */
const SPIN = 0.3;
const SPIN_PHASE = 0.7;

/** Builds the field under `parent`; `spin(time)` turns the cubes, the one shape whose turn shows */
export function createClayField(parent) {
  const cubes = [];

  for (const { x, shape, color } of COLUMNS) {
    // One geometry and one material per column, so the 56 shapes draw in four batches.
    const geometry = clayGeometry(shape);
    const material = clayMaterial(color);

    for (let row = 0; row < ROWS; row++) {
      const mesh = new Mesh3D({
        geometry,
        material,
        // Resting on the floor: the shape's lowest point at y 0.
        position: {
          x,
          y: -geometry.bounds3D.min.y * SCALE,
          z: FIRST_ROW_Z - row * ROW_GAP,
        },
        scale: SCALE,
        parent,
      });

      if (shape === 'cube') cubes.push(mesh);
    }
  }

  return {
    spin(time) {
      // The other shapes are round about y, so a turn wouldn't show on them.
      for (let i = 0; i < cubes.length; i++)
        cubes[i].rotation.y = i * SPIN_PHASE + time * SPIN;
    },
  };
}
