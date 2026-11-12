/**
 * What the frame draws to explain sheen: a tag under each sphere saying which one wears it
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

/** Px between a sphere's lowest point and its tag */
const TAG_GAP = 16;

export function createVisuals({
  app,
  view3d,
  stage,
  sheenSphere,
  plainSphere,
}) {
  const labels = new LabelLayer({ view3d, stage });
  // Pinned to the floor in front of each sphere, so they hang under it from any angle the orbit allows. The twins
  // share one geometry, so its box serves both.
  const { min, max } = sheenSphere.geometry.bounds3D;
  const under = { x: 0, y: min.y, z: max.z };
  const offset = { x: 0, y: TAG_GAP };

  labels.add({ text: 'sheen', node: sheenSphere, at: under, offset });
  labels.add({ text: 'no sheen', node: plainSphere, at: under, offset });
  app.stage.addChild(labels);

  return {
    update() {
      labels.update();
    },
  };
}
