/** An InsetView's title tag on the panel's edge, and the accent outline its light draws round the panel */

import { BitmapText, Container, Graphics } from 'pixi.js';

import {
  LABEL_FONT,
  LABEL_FONT_SIZE,
  overlayColor,
  PANEL_ALPHA,
  textOn,
} from './overlay';

import { BRAND, mixColor } from './palette';

/** The tag's padding round its text, and its height: a label tag's */
const TAG_PAD = 6;
const TAG_HEIGHT = LABEL_FONT_SIZE + 6;
/** Seconds a light takes to fade once its hold is over */
const FADE = 0.4;

/**
 * A small neutral tag that sits on a panel's edge at a corner, and the 2 px accent outline that lights with it
 *
 * The tag overlaps the panel by its rim and stands out past the edge by the rest, so it never covers the picture.
 * {@link InsetTitle#light} lights the tag and the outline in accent for a hold, then fades them; `focus` holds the
 * look until it's turned off.
 * @example
 * ```ts
 * const title = panel.addChild(new InsetTitle('top-left', 'side view'));
 *
 * title.layout(328, 188, 10, 4);
 * app.ticker.add((ticker) => title.update(ticker.deltaMS / 1000, 1.5));
 * ```
 */
export class InsetTitle extends Container {
  _corner;
  _outline = new Graphics({ visible: false });
  _tag = new Graphics();
  _text = new BitmapText({
    style: { fontFamily: LABEL_FONT, fontSize: LABEL_FONT_SIZE },
  });
  /** The panel's size, corner radius and rim at the last layout */
  _panel = { width: 0, height: 0, radius: 0, rim: 0 };
  _darkness = 0;
  /** Seconds since the light began, or -1 while it's unlit */
  _litFor = -1;
  _focused = false;
  _light = 0;

  constructor(corner, text = '') {
    super({ eventMode: 'none' });
    this._corner = corner;
    this.addChild(this._outline, this._tag, this._text);
    this.text = text;
  }

  /** The tag's text; empty hides it */
  get text() {
    return this._text.text;
  }
  set text(value) {
    if (value === this._text.text) return;
    this._text.text = value;
    this._tag.clear();
    if (value)
      this._tag
        .roundRect(0, 0, this._tagWidth(), TAG_HEIGHT, TAG_HEIGHT / 2)
        .fill(0xffffff);
    this._place();
  }

  /** Lights the tag and the outline in accent, held for the `hold` that {@link InsetTitle#update} gets, then faded */
  light() {
    this._litFor = 0;
  }

  /** Holds the lit look until `focus(false)` */
  focus(on) {
    this._focused = on;
  }

  /** Runs the light by `dt` seconds, holding it `hold` seconds before the fade */
  update(dt, hold) {
    if (this._litFor >= 0)
      this._litFor = this._litFor + dt > hold + FADE ? -1 : this._litFor + dt;

    const light = this._focused
      ? 1
      : this._litFor < 0
        ? 0
        : Math.min(1, 1 - (this._litFor - hold) / FADE);

    if (light !== this._light) {
      this._light = light;
      this.paint(this._darkness);
    }
  }

  /** Paints the tag and the outline for a darkness, 0 light to 1 dark, mixed toward accent by the light */
  paint(darkness) {
    const light = this._light;

    this._darkness = darkness;
    this._tag.tint = mixColor(
      overlayColor('panel', darkness),
      BRAND.hotPink,
      light,
    );
    this._tag.alpha = PANEL_ALPHA + (1 - PANEL_ALPHA) * light;
    this._text.tint = mixColor(
      overlayColor('ink', darkness),
      textOn(BRAND.hotPink),
      light,
    );
    this._outline.visible = light > 0;
    this._outline.alpha = light;
  }

  /** Lays the tag and the outline out on a panel `width` × `height` px with that corner `radius` and `rim` */
  layout(width, height, radius, rim) {
    Object.assign(this._panel, { width, height, radius, rim });
    this._outline
      .clear()
      .roundRect(0, 0, width, height, radius)
      .stroke({ width: 2, color: BRAND.hotPink });
    this._place();
  }

  /** Puts the tag past the corner's curve, overlapping the panel by its rim, or by half the tag on a wider rim */
  _place() {
    const { width, height, radius, rim } = this._panel;
    const corner = this._corner;
    const across = corner.endsWith('left')
      ? 0
      : corner.endsWith('right')
        ? 1
        : 0.5;
    const overlap = Math.min(rim, TAG_HEIGHT / 2);

    this._tag.x = Math.round(
      radius + (width - radius * 2 - this._tagWidth()) * across,
    );
    this._tag.y = corner.startsWith('top')
      ? overlap - TAG_HEIGHT
      : height - overlap;
    this._text.position.set(this._tag.x + TAG_PAD, this._tag.y + 3);
  }

  _tagWidth() {
    return Math.ceil(this._text.width) + TAG_PAD * 2;
  }
}
