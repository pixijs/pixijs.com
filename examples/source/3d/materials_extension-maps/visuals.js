/**
 * What the frame draws to explain extension maps: a label naming each side of the comparison
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

export function createVisuals({
  app,
  view3d,
  stage,
  plainSphere,
  mappedSphere,
}) {
  const labels = new LabelLayer({ view3d, stage });

  labels.add({
    text: 'plain values',
    node: plainSphere,
    at: { x: 0, y: 1.35, z: 0 },
  });
  const mappedLabel = labels.add({
    text: 'texture maps',
    node: mappedSphere,
    at: { x: 0, y: 1.35, z: 0 },
  });

  app.stage.addChild(labels);

  return {
    update() {
      // With Maps off the right sphere wears the left one's material, so it takes the same name.
      mappedLabel.text =
        mappedSphere.material === plainSphere.material
          ? 'plain values'
          : 'texture maps';
      labels.update();
    },
  };
}
