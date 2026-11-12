/**
 * What the frame draws to explain a view in a 2D layout: the view's rectangle, the point `position` names, and the
 * region that takes pointer events (`hitRegion.ts`)
 *
 * It reads the view and the card each frame and never writes to them, so `index.ts` runs the same without it. The one
 * thing it adds to the card is the hit region's hatching.
 */

import { Point, Rectangle } from 'pixi.js';

import { LabelLayer } from './theme/LabelLayer';
import { viewRect } from './theme/overlay';
import { ScreenLines } from './theme/ScreenLines';

import { createHitRegion } from './hitRegion';

/** The outline's dash and gap, in px */
const DASH = 8;
const GAP = 6;
/** The dot's radius and its haze rim, in px */
const DOT = 5;
const RIM = 2;
/** The dot's label sits inside the rectangle, this far right of and under the dot, in px */
const LABEL_INSET = { x: 8, y: 8 };

const _screen = new Rectangle();
const _rect = new Rectangle();
const _origin = new Point();

/** How the view shares pointer input, read from the view and the card */
function pointerModeOf(view3d, page) {
  if (view3d.eventMode === 'none') return 'none';
  if (page.card.getChildIndex(page.swatches) > page.card.getChildIndex(view3d))
    return 'swatchesAbove';

  return view3d.hitArea ? 'logoArea' : 'default';
}

export function createVisuals({ app, view3d, stage, page, logoArea }) {
  const marks = new ScreenLines({ stage });
  const labels = new LabelLayer({ view3d, stage, bounds: app.screen });
  const region = createHitRegion({
    view3d,
    stage,
    card: page.card,
    logoArea,
    marks,
  });
  const dotLabel = labels.add({
    text: 'position',
    screen: { x: 0, y: 0 },
    anchor: { x: 0, y: 0 },
  });

  app.stage.addChild(marks, labels);

  return {
    update() {
      const mode = pointerModeOf(view3d, page);
      const { width, height, anchor, position } = view3d;
      // The view's rectangle in the card's px, for the hatching in the card, and on screen, for the outline.
      const rect = _rect.set(
        position.x - anchor.x * width,
        position.y - anchor.y * height,
        width,
        height,
      );
      const screen = viewRect(view3d, _screen);
      // The point `position` names: the view's own (0, 0).
      const origin = view3d.getGlobalPosition(_origin);

      marks.clear().style('ink', 1.5, 1, DASH, GAP);
      marks.rect(screen.x, screen.y, screen.width, screen.height);
      region.update(mode, rect);
      marks.style('haze').dot(origin.x, origin.y, DOT + RIM);
      marks.style('ink').dot(origin.x, origin.y, DOT);
      dotLabel.screen?.set(origin.x + LABEL_INSET.x, origin.y + LABEL_INSET.y);
      marks.update();
      labels.update();
    },
  };
}
