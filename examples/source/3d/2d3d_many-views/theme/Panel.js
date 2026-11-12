/** The rounded card every 2D panel is: InsetView and an example's own cards (a menu, a loupe, a shelf) build on it */

import { BitmapText, Container, Graphics, Point, Rectangle } from 'pixi.js';

import {
  LABEL_FONT,
  LABEL_FONT_SIZE,
  NARROW_BELOW,
  overlayColor,
  PANEL_ALPHA,
  releaseLabelFont,
  useLabelFont,
} from './overlay';

import { BRAND, mixColor } from './palette';

/** The gap to the screen's edges: room enough that a card never crowds the frame */
const MARGIN = 24;
/** The gap under 600 px wide, smaller since a phone has little width to spare */
const NARROW_MARGIN = 16;
/** Under 600 px wide a top panel sits this far down, just under the collapsed pane */
const NARROW_TOP = 52;
/** The gap between stacked panels: enough to part their cards, close enough that they read as one group */
const STACK_GAP = 8;
/** The title row's height, its gap to the content included */
const TITLE_ROW = LABEL_FONT_SIZE + 9;
/** Seconds a light takes to fade once its hold is over */
const FADE = 0.4;
/** How strongly a lit title row's accent wash shows: a hint behind the accent title, never a block of colour */
const LIGHT_WASH = 0.14;
/** How strongly a raised card's ink shows: a step darker or lighter than the panel it sits in */
const RAISED_ALPHA = 0.08;
/** How strongly the 1 px rim's soft ink shows: enough to edge a card on white checks or a dark sky */
const RIM_ALPHA = 0.12;
const LABEL_STYLE = { fontFamily: LABEL_FONT, fontSize: LABEL_FONT_SIZE };
const _global = new Point();

/**
 * A rounded card over the view, in the neutral tag's colours, that docks itself in a screen corner or stacks on
 * another panel, and keeps to the narrow layout on a phone
 *
 * Give it a size with {@link Panel#setSize} and call {@link Panel#update} each frame, after the panel it stacks on:
 * it repaints when the theme changes, docks, and runs the title's light. A subclass draws its content from
 * {@link Panel#contentTop} down, repaints it in `paint()`, and calls `super.update(dt)`. A drag over it still orbits.
 * @example
 * ```ts
 * const card = new Panel({ stage, screen: app.screen, corner: 'bottom-right', title: 'scene' });
 *
 * card.setSize(240, 120);
 * app.stage.addChild(view3d, card);
 * app.ticker.add((ticker) => card.update(ticker.deltaMS / 1000));
 * ```
 */
export class Panel extends Container {
  /** Its rect in global px after the last {@link Panel#update}, for stacking, fitting and keeping tags off it */
  rect = new Rectangle();
  /** The space between its edge and its content, in px */
  padding = 12;
  /** Seconds a light holds before it fades */
  hold = 1.5;
  /** Where its theme comes from */
  stage;
  _panelOptions;
  /** The screen it docks in: its own, else the one the panel under it in the stack docks in */
  _screen;
  _card = new Graphics();
  _rim = new Graphics({ alpha: RIM_ALPHA });
  _titleWash = new Graphics({ visible: false });
  _titleText;
  _noteText;
  _givenWidth = 0;
  _givenHeight = 0;
  _isNarrow = false;
  _availableWidth = Number.POSITIVE_INFINITY;
  /** The corner it docked in at the last update, which a panel stacked on it takes when it has none */
  _dockedCorner = null;
  _paintedDarkness = -1;
  /** Seconds since the title lit, or -1 while it's unlit */
  _titleLitFor = -1;

  constructor(options) {
    super({ eventMode: 'none' });
    useLabelFont();
    this.stage = options.stage;
    this._panelOptions = options;
    this._screen = options.screen ?? options.stackOn?._screen ?? null;
    this.padding = options.padding ?? 12;
    this.hold = options.hold ?? 1.5;
    this._titleText = new BitmapText({
      text: options.title ?? '',
      style: LABEL_STYLE,
    });
    this._noteText = new BitmapText({
      text: options.note ?? '',
      style: LABEL_STYLE,
      anchor: { x: 1, y: 0 },
    });
    this.addChild(
      this._card,
      this._rim,
      this._titleWash,
      this._titleText,
      this._noteText,
    );
  }

  /** The soft title along the top; empty for none */
  get title() {
    return this._titleText.text;
  }
  set title(value) {
    this._titleText.text = value;
  }

  /** The text at the right end of the title row; empty for none */
  get note() {
    return this._noteText.text;
  }
  set note(value) {
    this._noteText.text = value;
  }

  /** Whether the screen is under 600 px wide, so the panel docks the narrow way */
  get narrow() {
    return this._isNarrow;
  }

  /** The width it may take on this screen: the screen less its gutters, or `narrow.width` when that's smaller */
  get availableWidth() {
    return this._availableWidth;
  }

  /** Where content starts, in the panel's own px: under the title row when there is one, else at the padding */
  get contentTop() {
    return (
      this.padding +
      (this._titleText.text || this._noteText.text ? TITLE_ROW : 0)
    );
  }

  /** Sets the panel's size, padding included; the background redraws only when it changes */
  setSize(width, height) {
    this._givenWidth = width;
    this._givenHeight = height;
    this._dockAndMeasure();

    return this;
  }

  /** Lights the title row in accent for {@link Panel#hold} seconds, then fades it back */
  lightTitle() {
    this._titleLitFor = 0;
  }

  /** Repaints on a theme change, docks, and runs the title's light; `dt` is the frame time in seconds */
  update(dt = 0) {
    if (this._titleLitFor >= 0) {
      this._titleLitFor += dt;
      this._paintTitle();
      if (this._titleLitFor >= this.hold + FADE) this._titleLitFor = -1;
    }
    if (this.stage.darkness !== this._paintedDarkness) {
      this._paintedDarkness = this.stage.darkness;
      this.paint(this._paintedDarkness);
    }
    this._dockAndMeasure();
  }

  /** Frees the panel and its children, their Graphics contexts included, and releases the label font */
  destroy() {
    if (this.destroyed) return;
    super.destroy({ children: true, context: true });
    releaseLabelFont();
  }

  /** Paints the panel for a darkness, 0 light to 1 dark; a subclass repaints its own content here too */
  paint(darkness) {
    this._card.tint = overlayColor(
      this._panelOptions.raised ? 'ink' : 'panel',
      darkness,
    );
    this._card.alpha = this._panelOptions.raised ? RAISED_ALPHA : PANEL_ALPHA;
    this._rim.tint = overlayColor('inkSoft', darkness);
    this._titleWash.tint = BRAND.hotPink;
    this._paintTitle();
  }

  _paintTitle() {
    const soft = overlayColor('inkSoft', Math.max(this._paintedDarkness, 0));
    const light =
      this._titleLitFor < 0
        ? 0
        : Math.min(1, Math.max(0, 1 - (this._titleLitFor - this.hold) / FADE));

    this._titleText.tint =
      light > 0 ? mixColor(soft, BRAND.hotPink, light) : soft;
    this._noteText.tint = soft;
    this._titleWash.visible = light > 0;
    this._titleWash.alpha = LIGHT_WASH * light;
  }

  /** Sizes, docks and measures the panel for the current screen */
  _dockAndMeasure() {
    const { stackOn, narrow: narrowOptions } = this._panelOptions;
    const screen = this._screen;

    this._isNarrow = screen !== null && screen.width < NARROW_BELOW;

    const margin =
      this._panelOptions.margin ?? (this._isNarrow ? NARROW_MARGIN : MARGIN);
    const narrowWidth = this._isNarrow ? narrowOptions?.width : undefined;

    this._availableWidth = screen
      ? screen.width - margin * 2
      : Number.POSITIVE_INFINITY;
    if (typeof narrowWidth === 'number')
      this._availableWidth = Math.min(this._availableWidth, narrowWidth);

    const width =
      narrowWidth !== undefined ? this._availableWidth : this._givenWidth;
    const height =
      (this._isNarrow ? narrowOptions?.height : undefined) ?? this._givenHeight;
    // The panel under it docked first this update, hidden or not; a hidden one leaves its place to the one under it.
    let corner = this._panelOptions.corner ?? stackOn?._dockedCorner ?? null;
    let base = stackOn;

    if (this._isNarrow && corner)
      corner =
        narrowOptions?.corner ??
        (corner.startsWith('bottom') ? 'bottom' : corner);
    this._dockedCorner = corner;
    while (base && !base.visible) base = base._panelOptions.stackOn;
    if (width !== this.rect.width || height !== this.rect.height)
      this._redrawCard(width, height);
    if (corner && screen) {
      const across = corner.endsWith('left')
        ? 0
        : corner.endsWith('right')
          ? 1
          : 0.5;
      const x =
        screen.x + margin + (screen.width - margin * 2 - width) * across;
      const top = base
        ? base.rect.bottom + STACK_GAP
        : screen.y + (this._isNarrow ? NARROW_TOP : margin);
      const y = corner.startsWith('top')
        ? top
        : (base ? base.rect.y - STACK_GAP : screen.bottom - margin) - height;

      _global.set(Math.round(x), Math.round(y));
      this.position.copyFrom(
        this.parent
          ? this.parent.toLocal(_global, undefined, _global)
          : _global,
      );
    }
    this.getGlobalPosition(_global);
    this.rect.set(_global.x, _global.y, width, height);
  }

  /** Redraws the background, its rim and the title row's wash for a new size */
  _redrawCard(width, height) {
    const pad = this.padding;
    const radius = this._panelOptions.radius ?? 10;

    this._card.clear().roundRect(0, 0, width, height, radius).fill(0xffffff);
    this._rim
      .clear()
      .roundRect(0, 0, width, height, radius)
      .stroke({ width: 1, color: 0xffffff, alignment: 1 });
    this._titleWash
      .clear()
      .roundRect(
        pad / 2,
        pad / 2,
        width - pad,
        LABEL_FONT_SIZE + pad,
        Math.min(radius, 6),
      )
      .fill(0xffffff);
    this._titleText.position.set(pad, pad);
    this._noteText.position.set(width - pad, pad);
  }
}
