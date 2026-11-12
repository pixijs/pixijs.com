/** One label of a LabelLayer: a small rounded tag naming a node, an axis or a point, at a 3D point or a screen point */

import { Vector3 } from '@pixi/3d';

import { BitmapText, Container, Graphics, Point } from 'pixi.js';

import {
  helperColorAt,
  LABEL_FONT,
  LABEL_FONT_SIZE,
  overlayColor,
  PANEL_ALPHA,
  textOn,
} from './overlay';

import { ScreenLines } from './ScreenLines';

/** A tag's padding round its text, in px, and a single-line tag's height */
const PAD_X = 6;
const PAD_Y = 3;
const TAG_HEIGHT = LABEL_FONT_SIZE + PAD_Y * 2;
/** The swatch chip's side, its gap to the text, and how strongly its ring shows the tag's ink */
const SWATCH = 10;
const SWATCH_GAP = 5;
const RING_ALPHA = 0.6;
/** The leader's dot radius and line width */
const LEADER_DOT = 2.5;
const LEADER_WIDTH = 1;

const _local = new Point();

/**
 * One label; change its `text`, `node`, `at`, `screen`, `offset`, `anchor`, `color`, `swatch` or `hidden` at any time
 *
 * `alpha`, `width` and `height` are pixi's own: a muted label is `label.alpha = 0.4`. Remove it with
 * `labels.remove(label)`.
 */
export class Label extends Container {
  /** The node it follows */
  node;
  /** The point it marks, in `node`'s space; write it with `at.set(…)` or `at.copyFrom(…)` */
  at;
  /** The screen point in global px it's pinned to instead, a Point the caller moves; `null` for a 3D label */
  screen;
  /** Where the tag's anchored point sits from the point, in px */
  offset;
  /** Which part of the tag sits on the point plus `offset`, 0 to 1 across and down */
  anchor;
  /** Hides the label until it's cleared; the layer's update keeps it */
  hidden = false;
  _stage;
  _tag = new Graphics();
  _ring = new Graphics({ alpha: RING_ALPHA })
    .roundRect(0, 0, SWATCH, SWATCH, 3)
    .fill(0xffffff);
  _chip = new Graphics()
    .roundRect(1, 1, SWATCH - 2, SWATCH - 2, 2)
    .fill(0xffffff);
  _text = new BitmapText({
    style: {
      fontFamily: LABEL_FONT,
      fontSize: LABEL_FONT_SIZE,
      align: 'center',
    },
  });
  _color;
  _swatch;
  _leader = null;
  _tagWidth = 0;
  _tagHeight = 0;
  _painted = -1;

  constructor(options) {
    super();
    this._stage = options.stage;
    this.node = options.node;
    this.at = new Vector3().copyFrom(options.at ?? { x: 0, y: 0, z: 0 });
    this.screen = options.screen
      ? new Point(options.screen.x, options.screen.y)
      : null;
    this.offset = new Point(
      options.offset?.x ?? 0,
      options.offset?.y ?? (this.screen ? 0 : -18),
    );
    this.anchor = new Point(options.anchor?.x ?? 0.5, options.anchor?.y ?? 0.5);
    this._color = options.color ?? null;
    this._swatch = options.swatch ?? null;
    this.addChild(this._tag, this._ring, this._chip, this._text);
    this.leader = options.leader ?? false;
    this.text = options.text;
  }

  /** The text it shows */
  get text() {
    return this._text.text;
  }
  set text(value) {
    if (value === this._text.text) return;
    this._text.text = value;
    this._fit();
  }

  /** `null` for the neutral tag that follows the theme, or a helper colour for a solid tag; repaints on the next update */
  get color() {
    return this._color;
  }
  set color(value) {
    if (value !== this._color) this._painted = -1;
    this._color = value;
  }

  /** A colour chip before the text, as 0xRRGGBB, or `null` for none; the tag widens to fit */
  get swatch() {
    return this._swatch;
  }
  set swatch(value) {
    if (value === this._swatch) return;
    this._swatch = value;
    this._painted = -1;
    this._fit();
  }

  /** Whether a dot at the point and a line to the tag join them */
  get leader() {
    return this._leader !== null;
  }
  set leader(value) {
    if (value && !this._leader) {
      this._leader = this.addChildAt(
        new ScreenLines({ stage: this._stage, width: LEADER_WIDTH }),
        0,
      );
    } else if (!value && this._leader) {
      this._leader.destroy();
      this._leader = null;
    }
  }

  /**
   * Places the tag for its point in global px, `margin` px inside `bounds` (sliding along an edge rather than leaving
   * it), and draws its leader; its {@link LabelLayer} calls it each update with the layer's global transform
   */
  place(point, bounds, margin, layer) {
    if (this._stage.darkness !== this._painted)
      this._paint(this._stage.darkness);

    const width = this._tagWidth;
    const height = this._tagHeight;
    const left = Math.min(
      point.x + this.offset.x - this.anchor.x * width,
      bounds.right - margin - width,
    );
    const top = Math.min(
      point.y + this.offset.y - this.anchor.y * height,
      bounds.bottom - margin - height,
    );

    layer.applyInverse(
      _local.set(
        Math.max(bounds.x + margin, left),
        Math.max(bounds.y + margin, top),
      ),
      _local,
    );
    // Whole pixels keep the text sharp.
    this.position.set(Math.round(_local.x), Math.round(_local.y));
    if (!this._leader) return;

    layer.applyInverse(point, _local);

    const x = _local.x - this.position.x;
    const y = _local.y - this.position.y;
    // The line meets the tag's nearest side: its flat top or bottom from above or below, else the middle of an end.
    const beside = y >= 0 && y <= height;
    const endX = beside
      ? x < 0
        ? 0
        : width
      : Math.max(height / 2, Math.min(x, width - height / 2));

    this._leader.update();
    this._leader.clear().style(this._color ?? 'ink', LEADER_WIDTH);
    if (!beside || x < 0 || x > width)
      this._leader.line(
        x,
        y,
        endX,
        beside ? height / 2 : y > height ? height : 0,
      );
    this._leader.dot(x, y, LEADER_DOT);
  }

  /** Paints the tag, text and swatch for a darkness, 0 light to 1 dark */
  _paint(darkness) {
    const fill =
      this._color === null
        ? overlayColor('panel', darkness)
        : helperColorAt(this._color, darkness);

    this._painted = darkness;
    this._tag.tint = fill;
    this._tag.alpha = this._color === null ? PANEL_ALPHA : 1;
    this._text.tint = this._ring.tint =
      this._color === null ? overlayColor('ink', darkness) : textOn(fill);
    this._chip.tint = this._swatch ?? 0;
  }

  /** Redraws the tag round the text and the swatch, only when their size changes */
  _fit() {
    const swatch = this._swatch !== null ? SWATCH + SWATCH_GAP : 0;
    const text = this._text.text;
    let lines = 1;

    for (let i = text.indexOf('\n'); i >= 0; i = text.indexOf('\n', i + 1))
      lines++;

    const width = Math.ceil(this._text.width) + PAD_X * 2 + swatch;
    const height =
      TAG_HEIGHT + Math.ceil((this._text.height * (lines - 1)) / lines);

    this._ring.visible = this._chip.visible = swatch > 0;
    this._ring.position.set(PAD_X, Math.round((height - SWATCH) / 2));
    this._chip.position.copyFrom(this._ring.position);
    this._text.position.set(
      PAD_X + swatch,
      Math.round((height - this._text.height) / 2),
    );
    if (width === this._tagWidth && height === this._tagHeight) return;
    this._tagWidth = width;
    this._tagHeight = height;
    this._tag
      .clear()
      .roundRect(0, 0, width, height, Math.min(height, TAG_HEIGHT) / 2)
      .fill(0xffffff);
  }
}
