/**
 * The props: five clay shapes resting in a shallow arc in front of the logo, each in its own clay colour, rocking
 * slowly
 *
 * The sphere in the middle is handed back, so `index.ts` can swap it to see-through clay.
 */

import { Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { clayGeometry } from './theme/shapes';

/**
 * Left to right, in a different clay each, so the albedo card has colours to tell apart. `turn` is the angle each
 * rocks about, picked so the cube shows a corner, the pyramid an edge and the torus its hole, face on.
 */
const ARC = [
  { shape: 'cube', color: 'purple', turn: 0.6 },
  { shape: 'capsule', color: 'orange', turn: 0 },
  { shape: 'sphere', color: 'sky', turn: 0 },
  { shape: 'torus', color: 'palePink', turn: Math.PI / 2, onRim: true },
  { shape: 'pyramid', color: 'lilac', turn: 0 },
];
/** Big enough to read in the small cards */
const SCALE = 1.25;
/**
 * World units between neighbours along x, how far the middle sits in front of the logo, and how far the ends curve
 * back
 */
const SPACING = 1.45;
const FRONT = 1.5;
const CURVE = 0.18;
/**
 * How far each shape rocks either side of its `turn`, in radians, and how fast, so the normal card's colours drift.
 * A full turn would show the torus edge-on, a thin capsule, for seconds at a time.
 */
const ROCK = 0.4;
const ROCK_SPEED = 0.4;

export function createShapeArc({ parent }) {
  const shapes = ARC.map(({ shape, color, onRim }, i) => {
    const offset = i - (ARC.length - 1) / 2;
    const geometry = clayGeometry(shape);
    // Rests on the floor: a shape on its rim rests on its widest radius, an upright one on its lowest point.
    const rest = onRim ? geometry.bounds3D.max.x : -geometry.bounds3D.min.y;

    return new Mesh3D({
      geometry,
      material: clayMaterial(color),
      position: {
        x: offset * SPACING,
        y: rest * SCALE,
        z: FRONT - offset * offset * CURVE,
      },
      // Rotations apply z first, so a torus tipped onto its rim about z still turns about the floor's up.
      rotation: { x: 0, y: 0, z: onRim ? Math.PI / 2 : 0 },
      scale: SCALE,
      parent,
    });
  });
  const middle = (ARC.length - 1) / 2;

  return {
    sphere: shapes[middle],
    sphereColor: ARC[middle].color,
    update(time) {
      // Each a radian of the rock behind the last, so they don't move as one.
      for (let i = 0; i < shapes.length; i++) {
        shapes[i].rotation.y =
          ARC[i].turn + Math.sin(time * ROCK_SPEED - i) * ROCK;
      }
    },
  };
}
