/**
 * PixelLoupe: a patch of the canvas's own pixels, magnified, in a corner panel
 *
 * A second camera would draw the scene again, with its own render texture's samples. The loupe copies the finished
 * canvas instead, after MSAA's resolve and every effect, FXAA included, so it shows the very pixels the screen does. It
 * draws each canvas pixel as a square `zoom` px wide.
 */

import {
  CanvasSource,
  Rectangle,
  RenderContainer,
  RendererType,
  RenderTexture,
  Sprite,
  Texture,
} from 'pixi.js';

import { Panel } from './theme/Panel';

/** The rim between the panel's edge and the picture */
const RIM = 8;
/** The most of the screen's height it takes, so a phone held sideways keeps the view above it */
const MAX_HEIGHT_SHARE = 0.4;

const _origin = { x: 0, y: 0 };
const _size = { width: 0, height: 0 };
const _dest = { x: 0, y: 0 };

/**
 * The canvas's real pixels round a point, magnified with no smoothing
 *
 * Add it to `app.stage` last: its copy runs once everything else has drawn, so it holds the frame as the screen shows
 * it, and the picture shows that copy on the next frame. Everything under the patch is copied, 2D included, so keep
 * other marks off it. Aim it with {@link PixelLoupe#aimAt}, and call {@link PixelLoupe#update} each frame to dock it.
 */
export class PixelLoupe extends Panel {
  /** The patch's rect on screen, in CSS px */
  patch = new Rectangle();
  _app;
  /** The rect it docks in */
  _bounds;
  _zoom;
  _patchSize;
  /** The 2D canvas WebGL draws the patch into, or `null` on WebGPU */
  _canvas;
  /**
   * The copy of the patch, a canvas pixel a texel, a frame behind the screen: a render texture on WebGPU, a 2D
   * canvas's texture on WebGL
   */
  _texture;
  _sprite;
  _columns = 0;
  _rows = 0;

  constructor({ app, zoom, columns, rows, narrowRows, ...panel }) {
    const bounds = panel.screen ?? app.screen;

    super({ ...panel, screen: bounds, padding: RIM });
    this._app = app;
    this._bounds = bounds;
    this._zoom = zoom;
    this._patchSize = { columns, rows, narrowRows };
    // WebGL can't copy an opaque canvas, which has no alpha channel, into a texture that has one, so on WebGL the
    // patch goes through a small 2D canvas instead.
    this._canvas =
      app.renderer.type === RendererType.WEBGL
        ? new CanvasSource({
            width: columns,
            height: rows,
            resolution: 1,
            scaleMode: 'nearest',
          })
        : null;
    this._texture = this._canvas
      ? new Texture({ source: this._canvas })
      : RenderTexture.create({
          width: columns,
          height: rows,
          resolution: 1,
          scaleMode: 'nearest',
        });
    this._sprite = new Sprite(this._texture);
    this.addChild(
      this._sprite,
      new RenderContainer({ render: (renderer) => this._copy(renderer) }),
    );
    this.update();
  }

  /**
   * Centres the patch on a screen point, in CSS px, snapped to whole canvas pixels and kept inside the canvas. It holds
   * there until aimed again
   */
  aimAt(x, y) {
    const { canvas, renderer } = this._app;
    const resolution = renderer.resolution;
    const left = Math.round(x * resolution - this._columns / 2);
    const top = Math.round(y * resolution - this._rows / 2);

    this.patch.set(
      Math.max(0, Math.min(canvas.width - this._columns, left)) / resolution,
      Math.max(0, Math.min(canvas.height - this._rows, top)) / resolution,
      this._columns / resolution,
      this._rows / resolution,
    );
  }

  /** Docks it and sizes the picture for the screen, once a frame before anything reads `rect` or `patch` */
  update(dt = 0) {
    super.update(dt);

    const fit = Math.floor((this.availableWidth - RIM * 2) / this._zoom);
    const columns = this.narrow
      ? Math.min(this._patchSize.columns, fit)
      : this._patchSize.columns;
    const fitRows = Math.floor(
      (this._bounds.height * MAX_HEIGHT_SHARE - this.contentTop - RIM) /
        this._zoom,
    );
    const rows = Math.min(
      this.narrow ? this._patchSize.narrowRows : this._patchSize.rows,
      fitRows,
    );

    // A new size docks again, from the panel's width on this screen.
    if (columns !== this._columns || rows !== this._rows)
      this._resize(columns, rows);
  }

  /** Frees the copy's texture */
  destroy() {
    if (this.destroyed) return;
    this._texture.destroy(true);
    super.destroy();
  }

  /** Resizes the copy and the picture to a patch of `columns` by `rows` canvas pixels */
  _resize(columns, rows) {
    const top = this.contentTop;

    this._columns = columns;
    this._rows = rows;
    this._texture.source.resize(columns, rows);
    this._sprite.scale.set(this._zoom);
    this._sprite.position.set(RIM, top);
    this.setSize(columns * this._zoom + RIM * 2, top + rows * this._zoom + RIM);
    this.aimAt(
      this.patch.x + this.patch.width / 2,
      this.patch.y + this.patch.height / 2,
    );
  }

  /** Copies the patch off the screen, once everything before it has drawn */
  _copy(renderer) {
    const { _columns: width, _rows: height } = this;
    const x = Math.round(this.patch.x * renderer.resolution);
    const y = Math.round(this.patch.y * renderer.resolution);

    if (this._canvas) {
      // WebGL has drawn everything before this into the canvas, so a 2D draw of it reads the frame as it stands.
      this._canvas.context2D.drawImage(
        this._app.canvas,
        x,
        y,
        width,
        height,
        0,
        0,
        width,
        height,
      );
      this._canvas.update();

      return;
    }
    // The copy trims the size to the canvas in place, so it's set afresh each time; the origin is never past an edge.
    _origin.x = x;
    _origin.y = y;
    _size.width = width;
    _size.height = height;
    renderer.renderTarget.copyToTexture(
      renderer.renderTarget.rootRenderTarget,
      this._texture,
      _origin,
      _size,
      _dest,
    );
  }
}
