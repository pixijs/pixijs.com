/** A second picture in a corner panel: the kit's side view, minimap, magnifier and texture card */

import { BitmapText, Rectangle } from 'pixi.js';

import { Helper } from './Helper';
import { fitCamera, projectToPicture, unitsPerPixel } from './insetCamera';

import { InsetPicture } from './InsetPicture';
import { InsetTitle } from './InsetTitle';
import { LabelLayer } from './LabelLayer';
import { LABEL_FONT, overlayColor } from './overlay';

import { Panel } from './Panel';

/** The panel's rim round the picture unless `padding` says otherwise, the caption's row and size, in px */
const RIM = 4;
const CAPTION_ROW = 16;
const CAPTION_SIZE = 12;
/** How far inside the picture its labels stay, in px: closer than the screen's 16, since the picture is small */
const LABEL_MARGIN = 8;

/**
 * A rounded corner panel holding a second picture, with a title tag, a caption, labels and screen marks of its own
 *
 * The options pick the mode. With `view3d` it draws that view's scene again from `inset.camera`, a new camera under
 * its root, through passes it appends to `view3d.passes`; kit helpers with `pass: inset.pass` draw there and nowhere
 * else. With `texture` it shows that texture. With neither it holds a small `View3D` of its own, `inset.view3d`. Call
 * {@link InsetView#update} each frame once the scene and its camera have moved. Panel's `note` and title row don't
 * apply. `destroy()` takes its passes out of the view and frees its camera, render texture, own view and labels.
 * @example
 * ```ts
 * const inset = new InsetView({ app, view3d, stage, title: 'side view', corner: 'bottom-right' });
 *
 * new DotHelper({ color: 'accent', pass: inset.pass, parent: view3d.root });
 * app.stage.addChild(view3d, inset);
 * inset.camera!.position.set(8, 2, 0);
 * app.ticker.add((ticker) => inset.update(ticker.deltaMS / 1000));
 * ```
 */
export class InsetView extends Panel {
  /** The camera the picture is drawn from, or `null` for a texture */
  camera;
  /** The inset's own view, or `null` for the same scene or a texture; set its environment and tone mapping here */
  view3d;
  /** The root of the inset's own view, or `null` for the same scene or a texture */
  root;
  /** The MeshPass inset-only helpers draw in, in the same-scene mode; `null` otherwise */
  pass;
  /** Over the picture and clipped to it, under the labels, in global px: for `ScreenLines` marks */
  overlay;
  /** The picture's rect in global px, sized from construction and placed by each {@link InsetView#update} */
  picture = new Rectangle();
  _content;
  _labels = null;
  _radius = 10;
  /** The picture's narrow size as given, and the panel's, which Panel docks by and setSize writes */
  _narrow;
  _narrowPanel;
  _title;
  _caption = new BitmapText({
    style: { fontFamily: LABEL_FONT, fontSize: CAPTION_SIZE },
  });
  /** The panel's own rect, for presses; its size is the panel's at the last layout, 0 until the first */
  _hit = new Rectangle();
  _width = 320;
  _height = 180;
  /** The depth in front of the camera of the points' middle at the last {@link InsetView#frame} */
  _frameDepth = 0;

  constructor(options) {
    const {
      app,
      view3d,
      texture,
      width = 320,
      height = 180,
      mode = 'perspective',
      pass = 'inset',
      ...rest
    } = options;
    const {
      title = '',
      caption = '',
      titleCorner = 'top-left',
      resolution = app.renderer.resolution,
      ...more
    } = rest;
    const { eventMode = 'static', narrow, ...panel } = more;
    const content = {
      view3d,
      texture,
      mode,
      pass,
      width,
      height,
      resolution,
      darkness: panel.stage.darkness,
    };
    const narrowPanel = { ...narrow };

    super({
      ...panel,
      screen: panel.screen ?? app.screen,
      padding: panel.padding ?? RIM,
      narrow: narrowPanel,
    });
    this._narrowPanel = narrowPanel;
    this._narrow = { width: narrow?.width, height: narrow?.height };
    this._radius = panel.radius ?? 10;
    this._content = this.addChild(new InsetPicture(content));
    this.camera = this._content.camera;
    this.view3d = this._content.view3d;
    this.root = this.view3d?.root ?? null;
    this.pass = view3d ? pass : null;
    this.overlay = this._content.overlay;

    const scene = view3d ?? this.view3d;
    const tags = {
      stage: this.stage,
      margin: LABEL_MARGIN,
      bounds: this.picture,
      project: this.project.bind(this),
    };

    if (scene)
      this._labels = this.addChild(new LabelLayer({ ...tags, view3d: scene }));
    this._title = this.addChild(new InsetTitle(titleCorner, title));
    this.addChild(this._caption).text = caption;
    this.eventMode = eventMode;
    this.hitArea = this._hit;
    this.interactiveChildren = false;
    this.setSize(width, height);
  }

  /** Tags pinned through the inset's camera, kept inside the picture; a texture inset has no camera, so it throws */
  get labels() {
    if (!this._labels)
      throw new Error(
        'InsetView: a texture inset has no camera to pin labels through; use overlay',
      );

    return this._labels;
  }

  /** The texture a texture inset shows, aspect kept; `null` in the other modes, where setting it does nothing */
  get texture() {
    return this._content.texture;
  }
  set texture(value) {
    this._content.texture = value;
  }

  /** The small neutral tag on the panel's edge at `titleCorner`; empty hides it */
  get title() {
    return this._title.text;
  }
  set title(value) {
    this._title.text = value;
  }

  /** Panel's note, which an inset has no row for: it reads empty, and setting it does nothing */
  get note() {
    return '';
  }
  set note(_value) {}

  /** The one-line soft caption under the picture; empty drops its row, and the panel shrinks round it at once */
  get caption() {
    return this._caption.text;
  }
  set caption(value) {
    const rowChanged = !value !== !this._caption.text;

    this._caption.text = value;
    if (rowChanged) this.setSize(this._width, this._height);
  }

  /** World units per screen px: at the depth the last {@link InsetView#frame} fitted, for a perspective camera */
  get unitsPerPixel() {
    return this.camera
      ? unitsPerPixel(this.camera, this.picture, this._frameDepth)
      : 0;
  }

  /** Sets the picture's size in px and lays it out; the panel grows round it by its rim and the caption's row */
  setSize(width, height) {
    const rim = this.padding * 2;
    const row = this._caption.text ? CAPTION_ROW : 0;
    const narrow = this._narrow;

    this._width = width;
    this._height = height;
    this._narrowPanel.width =
      typeof narrow.width === 'number' ? narrow.width + rim : narrow.width;
    this._narrowPanel.height =
      narrow.height === undefined ? undefined : narrow.height + rim + row;
    super.setSize(width + rim, height + rim + row);
    this._layout();

    return this;
  }

  /** Makes every kit helper under `node` draw in this inset only, by setting its `pass`; same scene only */
  only(node) {
    if (this.pass === null)
      throw new Error(
        'InsetView.only: only a same-scene inset has a pass of its own',
      );
    if (node instanceof Helper) node.pass = this.pass;
    for (const child of node.children) this.only(child);

    return this;
  }

  /** A world point through the inset's camera into global px; `null` behind a perspective camera or with no camera */
  project(point, out) {
    return this.camera
      ? projectToPicture(this.camera, this.picture, point, out)
      : null;
  }

  /** Moves the camera along the way it faces so `points` fill the picture less `margin` px, near and far round them */
  frame(points, margin = 16) {
    if (this.camera && points.length > 0)
      this._frameDepth = fitCamera(this.camera, this.picture, points, margin);

    return this;
  }

  /** Lights the outline and the title in accent for {@link Panel#hold} seconds, then fades them back */
  light() {
    this._title.light();

    return this;
  }

  /** Lights the title, which is the tag on an inset: the same as {@link InsetView#light} */
  lightTitle() {
    this.light();
  }

  /** Lights the outline and the title in accent until `focus(false)`: a card that stays lit while its layer shows */
  focus(on = true) {
    this._title.focus(on);

    return this;
  }

  /** Docks it, lays the picture out when its size changes, follows the theme, runs the light and updates the labels */
  update(dt = 0) {
    super.update(dt);
    this._title.update(dt, this.hold);
    this._layout();
    this._labels?.update();
  }

  paint(darkness) {
    super.paint(darkness);
    this._caption.tint = overlayColor('inkSoft', darkness);
    this._title.paint(darkness);
    this._content.paint(darkness);
  }

  /** Places the picture on the panel, and the title, caption and hit area when the panel's size changes */
  _layout() {
    const { padding: rim, rect, _hit: hit } = this;
    const row = this._caption.text ? CAPTION_ROW : 0;
    const width = Math.max(1, rect.width - rim * 2);
    const height = Math.max(1, rect.height - rim * 2 - row);

    this.picture.set(rect.x + rim, rect.y + rim, width, height);
    this._content.layout(rim, width, height, Math.max(0, this._radius - rim));
    if (hit.width === rect.width && hit.height === rect.height) return;
    hit.set(0, 0, rect.width, rect.height);
    this._title.layout(rect.width, rect.height, this._radius, rim);
    this._caption.position.set(
      rim + 4,
      Math.round(rim + height + (row + rim - CAPTION_SIZE) / 2) - 1,
    );
  }
}
