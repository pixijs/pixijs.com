/**
 * What the frame draws to explain glass and liquid: a tag on each, named like the pane folder that sets it
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

import { BOTTLE_WIDTH } from './scene';

/** Each tag hangs below a point on the floor at its subject's front, where the bars behind never reach it */
const FLOOR_TAG = { anchor: { x: 0.5, y: 0 }, offset: { x: 0, y: 6 } };

export function createVisuals({ app, view3d, stage, logo, bottle }) {
  const labels = new LabelLayer({ view3d, stage });
  const { x, z } = logo.root.position;

  labels.add({
    text: 'glass',
    at: { x, y: 0, z: z + logo.half.z },
    ...FLOOR_TAG,
  });
  labels.add({
    text: 'liquid',
    node: bottle,
    at: { x: 0, y: 0, z: BOTTLE_WIDTH / 2 },
    ...FLOOR_TAG,
  });
  app.stage.addChild(labels);

  return {
    update() {
      labels.update();
    },
  };
}
