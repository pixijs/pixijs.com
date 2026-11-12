/**
 * The props the lesson drags: a white clay board, and the five clay shapes that stand on its grid
 *
 * Nothing here listens to the pointer; `index.ts` makes every pointer call on the shapes.
 */

import { Mesh3D, Vector3 } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { clayGeometry, roundedBox } from './theme/shapes';

/** The board in units: seven by five grid squares, as a thin slab */
export const BOARD = { width: 7, depth: 5, top: 0.12 };

/** A clay shape on the board, and the grid crossing it stands on at rest */

function piece(shape, color, x, z) {
  return {
    shape,
    color,
    spot: new Vector3(x, BOARD.top - clayGeometry(shape).bounds3D.min.y, z),
  };
}

/** None is clay pink, so the only pink on the board is the accent that marks the drag */
export const PIECES = [
  piece('cube', 'sky', -2, 1),
  piece('puck', 'lilac', -2, -1),
  piece('sphere', 'purple', 0, -1),
  piece('pyramid', 'paleSky', 2, -1),
  piece('torus', 'orange', 2, 1),
];

/** The board, which takes no pointer events, so a press on it reaches the view and orbits the camera */
export function createBoard(parent) {
  return new Mesh3D({
    geometry: roundedBox(BOARD.width, BOARD.top, BOARD.depth, 0.04),
    material: clayMaterial('white'),
    position: { x: 0, y: BOARD.top / 2, z: 0 },
    // A thin slab's shadow is lost under it, and as a caster it would stretch the key light's shadow box.
    castShadow: false,
    parent,
  });
}
