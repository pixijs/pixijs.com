/**
 * What the frame draws to explain tone mapping: each half's curve named in its corner, and the balls' strengths
 *
 * The labels are 2D, drawn after the views, so no tone curve or exposure touches them. It reads the scene each frame
 * and never changes it, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

/** The gap between a caption and its half's edges, in px, as the label layer keeps every tag */
const MARGIN = 16;
/** On a stacked screen the top caption sits under the pane's collapsed bar */
const UNDER_PANE = 52;
/**
 * A ball's strength hangs from a point on the floor (y 0) a little in front of the ball, so it clears the contact shadow
 * the stage's key casts behind the ball
 */
const ON_FLOOR = {
  ahead: 0.05,
  anchor: { x: 0.5, y: 0 },
  offset: { x: 0, y: 2 },
};

/** A layer of labels over one half: its balls' strengths and the caption naming its curve */
function createHalfLabels(view3d, stage, balls, strengths) {
  const labels = new LabelLayer({ view3d, stage });

  // A label with no node measures `at` in the view's root, the balls' parent, so a ball's position places its tag.
  balls.forEach(({ position }, i) =>
    labels.add({
      text: String(strengths[i]),
      at: { x: position.x, y: 0, z: position.z + ON_FLOOR.ahead },
      anchor: ON_FLOOR.anchor,
      offset: ON_FLOOR.offset,
    }),
  );

  const caption = labels.add({
    text: view3d.toneMapping,
    screen: { x: 0, y: 0 },
  });

  // A screen label always has its point.
  return { labels, caption, corner: caption.screen };
}

export function createVisuals(options) {
  const { app, split, noneView, curveView, stage, glowRows, glowStrengths } =
    options;
  const none = createHalfLabels(noneView, stage, glowRows[0], glowStrengths);
  const curve = createHalfLabels(curveView, stage, glowRows[1], glowStrengths);

  none.caption.color = 'ink';
  curve.caption.color = 'accent';
  app.stage.addChild(none.labels, curve.labels);

  /** Pins each caption in its half's corner: the bottom left side by side, the top left stacked */
  function placeCaptions() {
    const [left, right] = split.halves;

    none.caption.anchor.set(0, split.stacked ? 0 : 1);
    curve.caption.anchor.set(0, split.stacked ? 0 : 1);
    if (split.stacked) {
      none.corner.set(left.x + MARGIN, left.y + UNDER_PANE);
      curve.corner.set(right.x + MARGIN, right.y + MARGIN);
    } else {
      none.corner.set(left.x + MARGIN, left.bottom - MARGIN);
      curve.corner.set(right.x + MARGIN, right.bottom - MARGIN);
    }
  }

  // The captions follow the layout, which changes only on a resize. The split listened first, so its halves are
  // already laid out when this runs.
  placeCaptions();
  app.renderer.on('resize', placeCaptions);

  return {
    update() {
      // The pane sets the right view's curve; a label writes new text only when it changes.
      curve.caption.text = curveView.toneMapping;
      none.labels.update();
      curve.labels.update();
    },
  };
}
