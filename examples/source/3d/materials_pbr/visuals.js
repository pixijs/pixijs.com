/**
 * What the frame draws to explain the spheres: the names of their two axes, so a reader can tell the metal row from the
 * other one and the rough end from the smooth
 *
 * It never changes the scene, so `index.ts` runs the same without it.
 */

import { Vector3 } from '@pixi/3d';

import { LabelLayer } from './theme/LabelLayer';

import { SPHERE_RADIUS, spherePosition } from './scene';

/**
 * Px between an axis name and the spheres it names. Orbited to a corner on a phone the rows slant on screen, and the
 * `roughness` name, wider than a column there, still clears the sphere beside the middle one.
 */
const GAP = 16;

export function createVisuals({ app, view3d, stage }) {
  const labels = new LabelLayer({ view3d, stage });
  const topLeft = spherePosition(0, 1, new Vector3());
  const bottomMiddle = spherePosition(0.5, 0, new Vector3());

  // Over the top row's first sphere, reaching left from its right edge: orbited to the side, the row slants up on
  // screen, and a name reaching right would cross the next sphere.
  labels.add({
    text: 'metallic ↑',
    at: {
      x: topLeft.x + SPHERE_RADIUS,
      y: topLeft.y + SPHERE_RADIUS,
      z: topLeft.z,
    },
    anchor: { x: 1, y: 1 },
    offset: { x: 0, y: -GAP },
  });
  labels.add({
    text: 'roughness →',
    at: {
      x: bottomMiddle.x,
      y: bottomMiddle.y - SPHERE_RADIUS,
      z: bottomMiddle.z,
    },
    anchor: { x: 0.5, y: 0 },
    offset: { x: 0, y: GAP },
  });

  app.stage.addChild(labels);

  return {
    update() {
      labels.update();
    },
  };
}
