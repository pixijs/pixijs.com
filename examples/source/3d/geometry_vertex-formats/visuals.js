/**
 * What the frame draws to explain vertex formats: a name over each sphere, since the two look the same
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

export function createVisuals({
  app,
  view3d,
  stage,
  floatSphere,
  packedSphere,
}) {
  // fitPortrait grows the view past a phone's screen, so the tags keep to the screen instead.
  const labels = new LabelLayer({ view3d, stage, bounds: app.screen });
  labels.add({
    text: 'Float32',
    node: floatSphere,
    at: { x: 0, y: 1.25, z: 0 },
  });
  labels.add({
    text: 'Packed integers',
    node: packedSphere,
    at: { x: 0, y: 1.25, z: 0 },
  });
  app.stage.addChild(labels);

  return {
    update() {
      labels.update();
    },
  };
}
