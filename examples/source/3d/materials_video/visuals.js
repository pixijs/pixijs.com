/**
 * What the frame draws to explain the shared video: a tag on each display naming how its material shades it
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

export function createVisuals({ app, view3d, stage, displays }) {
  const labels = new LabelLayer({ view3d, stage });

  labels.add({
    text: 'unlit display',
    node: displays[0],
    at: { x: 0, y: 1.2, z: 0 },
  });
  labels.add({
    text: 'lit display',
    node: displays[1],
    at: { x: 0, y: 1.2, z: 0 },
  });
  app.stage.addChild(labels);

  return {
    update() {
      labels.update();
    },
  };
}
