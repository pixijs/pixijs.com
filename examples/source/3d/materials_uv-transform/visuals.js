/**
 * What the frame draws to explain the uv transform: `u 0` and `u 1` on the belt's two ends, where the face's own uvs
 * start and stop, so the tiling reads as copies of the texture between them
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

import { ROLLER_RADIUS } from './scene';

export function createVisuals({ app, view3d, stage, beltFace, beltWidth }) {
  const labels = new LabelLayer({ view3d, stage });
  // Level with the band, just outside the rollers, so they mark its ends without covering the picture.
  const end = beltWidth / 2 + ROLLER_RADIUS;

  labels.add({
    text: 'u 0',
    node: beltFace,
    at: { x: -end, y: 0, z: 0 },
    anchor: { x: 1, y: 0.5 },
    offset: { x: -6, y: 0 },
  });
  labels.add({
    text: 'u 1',
    node: beltFace,
    at: { x: end, y: 0, z: 0 },
    anchor: { x: 0, y: 0.5 },
    offset: { x: 6, y: 0 },
  });
  app.stage.addChild(labels);

  return {
    update() {
      labels.update();
    },
  };
}
