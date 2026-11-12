/** The props: the three clay shapes the lesson changes, in front of the logo, and the motion that keeps them moving */

import { Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { clayGeometry } from './theme/shapes';

/** The shapes, left to right */
const SHAPES = ['sphere', 'puck', 'octahedron'];
/** The twin's bob takes the phase after the shapes', so it never moves in step with the sphere it copies */
const TWIN_PHASE = SHAPES.length;
/** How far every shape, the twin too, bobs above and below its resting height */
const BOB_HEIGHT = 0.15;
/** World units between the shapes, so they stand under the logo's width */
const SPACING = 1.7;

/** Each shape's clay, the colour theme-kit's arc gives it */
export const SHAPE_COLORS = {
  sphere: 'purple',
  puck: 'lilac',
  octahedron: 'paleSky',
};

/**
 * The shapes in a shallow arc, each in its {@link SHAPE_COLORS}
 *
 * Each is labelled with its shape, so the overlay's lists and the snapshot's `meshes[].label` read `puck`, `sphere`.
 */
export function createShapes(view3d) {
  const place = (shape) => {
    const offset = SHAPES.indexOf(shape) - (SHAPES.length - 1) / 2;

    return new Mesh3D({
      geometry: clayGeometry(shape),
      material: clayMaterial(SHAPE_COLORS[shape]),
      label: shape,
      position: {
        x: offset * SPACING,
        y: 0.7,
        z: 1.8 - offset * offset * 0.12,
      },
      parent: view3d.root,
    });
  };

  return {
    sphere: place('sphere'),
    puck: place('puck'),
    octahedron: place('octahedron'),
  };
}

/** Bobs and turns every shape and sways the logo, from elapsed time, so two runs move the same */
export function createMotion({ shapes, twin, logo }) {
  const rest = twin.position.y;

  return {
    update(time) {
      for (let i = 0; i < SHAPES.length; i++) {
        const mesh = shapes[SHAPES[i]];

        mesh.position.y = 0.7 + Math.sin(time * 1.6 + i) * BOB_HEIGHT;
        mesh.rotation.y = time * 0.5 + i;
      }
      twin.position.y = rest + Math.sin(time * 1.6 + TWIN_PHASE) * BOB_HEIGHT;
      twin.rotation.y = time * 0.5 + TWIN_PHASE;
      logo.root.rotation.y = Math.sin(time * 0.4) * 0.25;
    },
  };
}
