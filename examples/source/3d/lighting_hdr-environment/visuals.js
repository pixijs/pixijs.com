/**
 * What the frame draws to explain an HDR sky: each half's source named in its corner
 *
 * The captions are 2D, drawn after the views, so no exposure or tone curve touches them. Nothing here changes the
 * scene, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

/** The gap between a caption and its half's edges, in px, as the label layer keeps every tag */
const MARGIN = 16;
/** On a stacked screen the top caption sits under the pane's collapsed bar */
const UNDER_PANE = 52;

/** A layer of labels over one half, holding the caption that names its source */
function createCaption(view3d, stage, text, color) {
  const labels = new LabelLayer({ view3d, stage });
  const caption = labels.add({ text, color, screen: { x: 0, y: 0 } });

  // A screen label always has its point.
  return { labels, caption, corner: caption.screen };
}

export function createVisuals({ app, split, hdrView, cubeView, stage }) {
  const hdr = createCaption(hdrView, stage, '.hdr', 'accent');
  const cube = createCaption(cubeView, stage, '.cubemap', 'ink');

  app.stage.addChild(hdr.labels, cube.labels);

  /** Pins each caption in its half's corner: the bottom left side by side, the top left stacked */
  function placeCaptions() {
    const [first, second] = split.halves;

    hdr.caption.anchor.set(0, split.stacked ? 0 : 1);
    cube.caption.anchor.set(0, split.stacked ? 0 : 1);
    if (split.stacked) {
      hdr.corner.set(first.x + MARGIN, first.y + UNDER_PANE);
      cube.corner.set(second.x + MARGIN, second.y + MARGIN);
    } else {
      hdr.corner.set(first.x + MARGIN, first.bottom - MARGIN);
      cube.corner.set(second.x + MARGIN, second.bottom - MARGIN);
    }
  }

  // The captions follow the layout, which changes only on a resize. The split listened first, so its halves are
  // already laid out when this runs.
  placeCaptions();
  app.renderer.on('resize', placeCaptions);

  return {
    update() {
      hdr.labels.update();
      cube.labels.update();
    },
  };
}
