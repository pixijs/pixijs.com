/**
 * The props: five clay shapes resting on and against each other, so there are creases and contacts to darken
 *
 * A cube with a pyramid on top, a capsule lying against the cube's front, a torus lying flat, and the ball, which the
 * pane lifts off the floor.
 */

import { Container3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { clayGeometry } from './theme/shapes';

/** The kit's clay sphere's radius at scale 1, so the ball's centre sits this high when it rests on the floor */
export const BALL_RADIUS = 0.45;

/** One clay prop under `parent`, posed */
function prop(shape, color, parent, pose) {
  return new Mesh3D({
    geometry: clayGeometry(shape),
    material: clayMaterial(color),
    parent,
    ...pose,
  });
}

/** Builds the cluster: each shape rests flush on the floor or on another, and the capsule's end touches the cube */
export function createCluster() {
  const root = new Container3D({ label: 'cluster' });
  const ball = prop('sphere', 'purple', root, {
    position: { x: 0.35, y: BALL_RADIUS, z: 0.6 },
  });
  const props = [
    prop('cube', 'pink', root, {
      position: { x: -0.9, y: 0.56, z: -0.55 },
      scale: 1.4,
      rotation: { x: 0, y: 0.3, z: 0 },
    }),
    prop('pyramid', 'paleSky', root, {
      position: { x: -0.9, y: 1.295, z: -0.55 },
      scale: 0.9,
      rotation: { x: 0, y: 0.5, z: 0 },
    }),
    prop('capsule', 'sky', root, {
      position: { x: -1.06, y: 0.23, z: 0.375 },
      rotation: { x: 0, y: 0.45, z: Math.PI / 2 },
    }),
    prop('torus', 'orange', root, {
      position: { x: 1.6, y: 0.17, z: -0.3 },
      scale: 1.1,
    }),
    ball,
  ];

  return { root, props, ball };
}
