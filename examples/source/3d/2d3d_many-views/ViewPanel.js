/**
 * The panel a view sits on: the kit's InsetView look, a rounded panel edged by its rim with a picture inside and a
 * title tag on its edge, drawn in 2D under a view the example builds and places itself
 *
 * An InsetView holds a view of its own; this panel holds none, so every `View3D` stays in `index.ts`, which puts each
 * one on its panel's {@link ViewPanel#picture}. The views have no background, so the picture's 2D backdrop is what
 * shows round their meshes.
 */

import { Graphics, Rectangle } from 'pixi.js';

import { InsetTitle } from './theme/InsetTitle';
import { overlayColor } from './theme/overlay';

import { mixColor, THEMES } from './theme/palette';
import { Panel } from './theme/Panel';

/** The panel's corner radius, and the rim between its edge and the picture, in px: an InsetView's */
const RADIUS = 10;
const RIM = 4;
/** How strongly the picture's edge shows, in soft ink, as an InsetView's does */
const EDGE_ALPHA = 0.3;
/**
 * How much of a card's colour its backdrop takes above the line and below it, on each theme; the dark panel needs
 * more to show
 */
const TINT = {
  above: { light: 0.05, dark: 0.08 },
  below: { light: 0.16, dark: 0.22 },
};
/**
 * Where a card's line falls, as a share of the picture's height: a little below the shape's middle, so it passes
 * behind the lower part of even the flattest product, the capsule lying down
 */
const LINE_AT = 0.54;

/** A rounded panel with a 2D picture for a view to sit on, a title tag on its edge, and an accent look for the focus */
export class ViewPanel extends Panel {
  /** The picture's rect in global px, where the view goes, as the last {@link ViewPanel#place} laid it */
  picture = new Rectangle();
  _tint;
  _above = new Graphics();
  _below = new Graphics();
  _edge = new Graphics({ alpha: EDGE_ALPHA });
  _tag;

  constructor({ stage, title, tint }) {
    super({ stage, radius: RADIUS, padding: RIM });
    this._tint = tint ?? null;
    // White, so `tint` paints each part in the theme's colour without a redraw.
    this.addChild(this._above, this._below, this._edge);
    this._tag = this.addChild(new InsetTitle('top-left', title));
  }

  /** Lays the panel over `cell`, in global px, and returns its picture, the rect inside the rim where the view goes */
  place(cell) {
    const width = cell.width - RIM * 2;
    const height = cell.height - RIM * 2;
    const radius = RADIUS - RIM;
    const line = RIM + Math.round(height * LINE_AT);

    this.position.set(cell.x, cell.y);
    this.setSize(cell.width, cell.height);
    this.picture.set(this.rect.x + RIM, this.rect.y + RIM, width, height);
    this._above
      .clear()
      .roundRect(RIM, RIM, width, height, radius)
      .fill(0xffffff);
    this._below.clear();
    // Square at the top, where it crosses the picture, and rounded at the picture's bottom corners.
    if (this._tint !== null) {
      this._below
        .roundRect(RIM, line, width, RIM + height - line, radius)
        .fill(0xffffff)
        .rect(RIM, line, width, radius)
        .fill(0xffffff);
    }
    this._edge
      .clear()
      .roundRect(RIM, RIM, width, height, radius)
      .stroke({ color: 0xffffff, alignment: 1 });
    this._tag.layout(cell.width, cell.height, RADIUS, RIM);

    return this.picture;
  }

  /** Lights the tag and an outline round the panel in accent while `on` */
  focus(on) {
    this._tag.focus(on);

    return this;
  }

  /** Follows the theme and runs the tag's light; `dt` is the frame time in seconds */
  update(dt = 0) {
    super.update(dt);
    this._tag.update(dt, this.hold);
  }

  paint(darkness) {
    super.paint(darkness);

    const panel = overlayColor('panel', darkness);
    const tint = this._tint;

    if (tint === null) {
      this._above.tint = mixColor(
        THEMES.light.haze,
        THEMES.dark.haze,
        darkness,
      );
    } else {
      this._above.tint = mixColor(
        panel,
        tint,
        TINT.above.light + (TINT.above.dark - TINT.above.light) * darkness,
      );
      this._below.tint = mixColor(
        panel,
        tint,
        TINT.below.light + (TINT.below.dark - TINT.below.light) * darkness,
      );
    }
    this._edge.tint = overlayColor('inkSoft', darkness);
    this._tag.paint(darkness);
  }
}
