/**
 * What the frame draws to explain the split: each half's name under its logo
 *
 * The labels are pixi 2D drawn after the views, outside both graphs, so no curve or encode touches them. It reads the
 * scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

/** A name hangs from the bottom of its logo's turning axis, this many px below, so it stays put while the logo sways */
const NAME_GAP = 14;

/** A layer over one half with the half's name under its logo */
function createName(view3d, stage, logo, text) {
  const labels = new LabelLayer({ view3d, stage });

  labels.add({
    text,
    node: logo.root,
    at: { x: 0, y: -logo.half.y, z: 0 },
    anchor: { x: 0.5, y: 0 },
    offset: { x: 0, y: NAME_GAP },
  });

  return labels;
}

export function createVisuals({ app, views, logos, stage }) {
  const clipLabels = createName(views[0], stage, logos[0], 'no curve');
  const curveLabels = createName(views[1], stage, logos[1], 'Reinhard');

  app.stage.addChild(clipLabels, curveLabels);

  return {
    update() {
      clipLabels.update();
      curveLabels.update();
    },
  };
}
