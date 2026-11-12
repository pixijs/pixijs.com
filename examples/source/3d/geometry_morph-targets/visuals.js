/**
 * What the frame draws to explain morph targets: a tag under each preview naming the pose it holds, the base shape or
 * one target alone, so a reader can tell which weight row leads to which shape
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

/** In a preview's own space, under it, so its tag hangs below it at any width */
const PREVIEW_TAG_AT = { x: 0, y: -1.25, z: 0 };
/** How far under that point the tag hangs, in px */
const PREVIEW_TAG_OFFSET = 16;

export function createVisuals({ app, view3d, stage, previews }) {
  const labels = new LabelLayer({ view3d, stage });

  for (const preview of previews) {
    labels.add({
      text: poseName(preview),
      node: preview,
      at: PREVIEW_TAG_AT,
      offset: { x: 0, y: PREVIEW_TAG_OFFSET },
    });
  }

  app.stage.addChild(labels);

  return {
    update() {
      labels.update();
    },
  };
}

/** `target i` for a preview that holds target i at weight 1, `base` for one with every weight at 0 */
function poseName(preview) {
  const target = preview.weights?.indexOf(1) ?? -1;

  return target < 0 ? 'base' : `target ${target}`;
}
