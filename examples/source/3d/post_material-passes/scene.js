/**
 * The props the passes draw again: three clay shapes in a row that a pointer can hover, and their idle motion
 *
 * Nothing here touches a pass. `index.ts` makes every pass call on the shapes' materials.
 */

import { Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { clayGeometry } from './theme/shapes';

/** The gap between the shapes' centres, and their height over the floor, so each casts a shadow apart from it */
const SPACING = 1.65;
const HEIGHT = 0.62;
/** About z, so the puck shows its cap and its rolled rim, and its outline swings between them as it turns */
const PUCK_TILT = 0.5;
/** About x, so the torus's hole faces the camera and the outline traces the hole too */
const TORUS_TILT = 1.1;
/** Turns in rad/s; the sphere's shows only in the wireframe, where its lines slide round */
const SPIN = 0.35;
/** How far the torus rocks either way, in rad */
const ROCK = 0.3;
/** How fast its rocking phase turns, in rad/s, so one rock takes 4π s and reads as idle */
const ROCK_RATE = 0.5;

/** A clay shape that hears the pointer, picked by its triangles, so the torus's hole hovers nothing */
function createShape(parent, shape, color, x) {
  return new Mesh3D({
    label: shape,
    geometry: clayGeometry(shape),
    material: clayMaterial(color),
    position: { x, y: HEIGHT, z: 0 },
    eventMode: 'static',
    hitVolume: 'geometry',
    cursor: 'pointer',
    parent,
  });
}

/** The puck, sphere and torus, each in its own clay colour and so its own material */
export function createShapes(parent) {
  const puck = createShape(parent, 'puck', 'orange', -SPACING);
  const sphere = createShape(parent, 'sphere', 'purple', 0);
  const torus = createShape(parent, 'torus', 'sky', SPACING);

  puck.rotation.z = PUCK_TILT;
  torus.rotation.x = TORUS_TILT;

  return { puck, sphere, torus, all: [puck, sphere, torus] };
}

/** Turns the puck and the sphere and rocks the torus, from elapsed time */
export function turnShapes(shapes, time) {
  shapes.puck.rotation.y = time * SPIN;
  shapes.sphere.rotation.y = time * SPIN;
  shapes.torus.rotation.z = Math.sin(time * ROCK_RATE) * ROCK;
}
