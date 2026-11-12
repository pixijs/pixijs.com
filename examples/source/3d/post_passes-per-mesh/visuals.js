/**
 * What the frame draws to explain the hidden capsule: a tag over its empty spot that says what of it still draws
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { LabelLayer } from './theme/LabelLayer';

/** Px between where the capsule's head would be and the tag's middle, so its silhouette never runs under the tag */
const HEAD_GAP = 18;

export function createVisuals({ app, view3d, stage, hidden, hiddenState }) {
  const labels = new LabelLayer({ view3d, stage, bounds: app.screen });
  const { min, max } = hidden.geometry.bounds3D;
  // The leader's dot marks its foot, the bottom of its bounds.
  const tag = labels.add({
    text: 'shadow only',
    node: hidden,
    at: { x: 0, y: min.y, z: 0 },
    leader: true,
  });
  const foot = new Vector3();
  const head = new Vector3();
  const footOnScreen = new Point();
  const headOnScreen = new Point();
  /** Whether the pointer is on it, so its outline shows it and the tag stands aside */
  let found = false;

  // Listening reads the scene; index.ts's own listeners make the pass calls.
  hidden.on('pointerenter', () => (found = true));
  hidden.on('pointerleave', () => (found = false));
  app.stage.addChild(labels);

  return {
    update() {
      // Drawn or outlined, it needs no name.
      tag.hidden = hiddenState.opaque || found;
      // Out of the shadow pass too, nothing of it draws, yet the pointer still finds it.
      tag.text = hidden.castShadow ? 'shadow only' : 'nothing drawn';
      // The tag rides just over where its head would be, however near the camera is.
      hidden.getGlobalPosition(foot);
      head.copyFrom(foot);
      foot.y += min.y * hidden.scale.y;
      head.y += max.y * hidden.scale.y;
      if (
        view3d.worldToScreen(foot, footOnScreen) &&
        view3d.worldToScreen(head, headOnScreen)
      ) {
        tag.offset.y = headOnScreen.y - footOnScreen.y - HEAD_GAP;
      }
      labels.update();
    },
  };
}
