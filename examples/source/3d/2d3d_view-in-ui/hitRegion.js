/**
 * The hit region: the part of the view that takes pointer events, hatched so nobody takes it for paint
 *
 * The hatching is a ScreenLines in the card, kept just over the view in the card's list, so an opaque background
 * doesn't hide it and it sits where the view sits in the display order: across the swatches while the view is over
 * them, under them once they're added after it. With a `hitArea` it hatches only the logo's ellipse inside the view's
 * rectangle, and outlines it. Its lines are pooled
 * sprites, so a Layout row's drag redraws it every frame without allocating.
 */

import { Ellipse, Matrix, Point, Rectangle } from 'pixi.js';

import { ScreenLines } from './theme/ScreenLines';

/** The hatching's line spacing in the card's px, and its strength on the light and dark theme */
const HATCH_GAP = 9;
const HATCH_ALPHA = { light: 0.4, dark: 0.45 };
const ELLIPSE_SEGMENTS = 64;

const _card = new Matrix();
const _point = new Point();
const _outline = new Float32Array((ELLIPSE_SEGMENTS + 1) * 2);

/**
 * Draws 45° lines `HATCH_GAP` apart across `rect`, or across the part of `area` inside it, with no mask: each line is
 * cut to the rectangle, then to the chord the ellipse makes on it
 */
function drawHatch(hatch, rect, area) {
  hatch.clear();
  // Each line runs up and right from (c, rect.bottom): x = c + s, y = rect.bottom - s.
  for (let c = rect.x - rect.height; c < rect.right; c += HATCH_GAP) {
    let from = Math.max(rect.x - c, 0);
    let to = Math.min(rect.right - c, rect.height);

    if (area) {
      const a = 1 / (area.halfWidth * area.halfWidth);
      const b = 1 / (area.halfHeight * area.halfHeight);
      const u = c - area.x;
      const v = rect.bottom - area.y;
      const quad = a + b;
      const half = u * a - v * b;
      const disc = half * half - quad * (u * u * a + v * v * b - 1);

      if (disc <= 0) continue;
      from = Math.max(from, (-half - Math.sqrt(disc)) / quad);
      to = Math.min(to, (-half + Math.sqrt(disc)) / quad);
    }
    if (from < to)
      hatch.line(c + from, rect.bottom - from, c + to, rect.bottom - to);
  }
}

export function createHitRegion({ view3d, stage, card, logoArea, marks }) {
  // In the card's own px, so the lines move and scale with it. The lines never cross, so one alpha fades them all.
  const hatch = new ScreenLines({ stage, color: 'accent', width: 1 });
  // The ellipse in the card's px: the shape is in the view's own, where the view's position adds to it.
  const area = new Ellipse();
  // What the hatching was last drawn for, so it redraws only when the region changes.
  const drawn = { mode: '', rect: new Rectangle(), area: new Ellipse() };

  card.addChild(hatch);

  /** Keeps the hatching just over the view in the card's list */
  function keepOverView() {
    const view = card.getChildIndex(view3d);
    const own = card.getChildIndex(hatch);

    // setChildIndex takes the hatching out first, which moves the view down one when the hatching was under it.
    if (own !== view + 1)
      card.setChildIndex(hatch, own < view ? view : view + 1);
  }

  /** Whether the region differs from the one last drawn; it remembers this one either way */
  function regionChanged(mode, rect) {
    const last = drawn.rect;
    const same =
      mode === drawn.mode &&
      rect.x === last.x &&
      rect.y === last.y &&
      rect.width === last.width &&
      rect.height === last.height &&
      area.x === drawn.area.x &&
      area.y === drawn.area.y &&
      area.halfWidth === drawn.area.halfWidth &&
      area.halfHeight === drawn.area.halfHeight;

    drawn.mode = mode;
    last.copyFrom(rect);
    drawn.area.copyFrom(area);

    return !same;
  }

  /** The ellipse's outline in global px, the pen lifted where it leaves the view's rectangle, as the region does */
  function outline(rect) {
    card.getGlobalTransform(_card);
    for (let i = 0; i <= ELLIPSE_SEGMENTS; i++) {
      const angle = (i / ELLIPSE_SEGMENTS) * Math.PI * 2;
      const x = area.x + Math.cos(angle) * area.halfWidth;
      const y = area.y + Math.sin(angle) * area.halfHeight;
      const inside =
        x >= rect.x && x <= rect.right && y >= rect.y && y <= rect.bottom;

      _card.apply(_point.set(x, y), _point);
      _outline[i * 2] = inside ? _point.x : NaN;
      _outline[i * 2 + 1] = _point.y;
    }
    marks.style('accent', 1.5).polyline(_outline);
  }

  return {
    update(mode, rect) {
      area.copyFrom(logoArea);
      area.x += view3d.position.x;
      area.y += view3d.position.y;
      keepOverView();
      hatch.visible = mode !== 'none';
      hatch.alpha =
        HATCH_ALPHA.light +
        (HATCH_ALPHA.dark - HATCH_ALPHA.light) * stage.darkness;
      if (regionChanged(mode, rect))
        drawHatch(hatch, rect, mode === 'logoArea' ? area : null);
      if (mode === 'logoArea') outline(rect);
    },
  };
}
