/** An InsetView's picture: what it shows in each mode, under a rounded clip with a soft edge, and the marks over it */

import { View3D } from '@pixi/3d';

import { Container, Graphics, Point, Sprite } from 'pixi.js';

import { InsetPasses } from './InsetPasses';
import { overlayColor } from './overlay';
import { screenColor } from './palette';

/** Options for {@link InsetPicture}: InsetView's mode options, and the picture's size in px */

/** How strongly the picture's edge shows, in `inkSoft`, inside the panel's own rim */
const EDGE_ALPHA = 0.3;

/**
 * The picture an InsetView holds: a texture's sprite, a second camera's render texture, or a small View3D of its own,
 * clipped to a rounded rect with a soft edge, with an overlay on top for screen marks
 *
 * With `texture` it fits the sprite inside, aspect kept, and refits when the texture's size changes. With `view3d` it
 * builds an {@link InsetPasses} and fills the picture with its render texture. With neither, its own view's background
 * is the panel colour and follows the theme until something else sets one. `destroy()` frees what it built, the
 * passes included, and leaves a given texture alone.
 * @example
 * ```ts
 * const options = { texture, mode: 'perspective', pass: 'inset', width: 200, height: 120, resolution: 1, darkness: 0 };
 * const picture = panel.addChild(new InsetPicture(options));
 *
 * picture.layout(4, 200, 120, 6);
 * ```
 */
export class InsetPicture extends Container {
  /** The camera it's drawn from, or `null` for a texture */
  camera = null;
  /** Its own view, in the own-scene mode; `null` otherwise */
  view3d = null;
  /** The second camera, its render texture and its passes, in the same-scene mode; `null` otherwise */
  passes = null;
  /** Over the picture and clipped to it, for screen marks in global px: each layout cancels the panel's offset */
  overlay = new Container({ eventMode: 'none' });
  /** The texture's sprite or the render texture's; `null` for an own view */
  _sprite = null;
  _clipped = new Container();
  _clip = new Graphics();
  _edge = new Graphics({ alpha: EDGE_ALPHA });
  /** The own view's background as the picture last set it; it stops following once something else sets one */
  _background = -1;
  /** The size, corner radius and texture size at the last layout; NaN until the first */
  _laid = {
    width: Number.NaN,
    height: 0,
    radius: 0,
    textureWidth: 0,
    textureHeight: 0,
  };

  constructor({
    view3d,
    texture,
    mode,
    pass,
    width,
    height,
    resolution,
    darkness,
  }) {
    super({ eventMode: 'none' });
    if (texture) {
      this._sprite = this._clipped.addChild(new Sprite(texture));
    } else if (view3d) {
      this.passes = new InsetPasses({
        view3d,
        mode,
        pass,
        width,
        height,
        resolution,
      });
      this._sprite = this._clipped.addChild(new Sprite(this.passes.target));
      this.camera = this.passes.camera;
    } else {
      this._background = screenColor(overlayColor('panel', darkness));
      this.view3d = this._clipped.addChild(
        new View3D({
          width,
          height,
          toneMapping: 'none',
          background: this._background,
        }),
      );
      this.camera = this.view3d.camera;
      this.camera.mode = mode;
      this.camera.fov = 40;
    }
    this._clipped.mask = this._clip;
    this._clipped.addChild(this.overlay);
    this.addChild(this._clipped, this._clip, this._edge);
  }

  /** The texture shown in texture mode; `null` in the other modes, where setting it does nothing */
  get texture() {
    return this._sprite && !this.passes ? this._sprite.texture : null;
  }
  set texture(value) {
    if (this._sprite && !this.passes && value) this._sprite.texture = value;
  }

  /** Places it `offset` px into its parent, `width` × `height` px with corners of `radius`; it redraws on a change */
  layout(offset, width, height, radius) {
    const { _laid: laid, _sprite: sprite, texture } = this;
    const textureWidth = texture?.width ?? 0;
    const textureHeight = texture?.height ?? 0;
    const sameRect =
      laid.width === width && laid.height === height && laid.radius === radius;

    this.position.set(offset);
    this.toLocal(Point.shared, undefined, this.overlay.position);
    if (
      sameRect &&
      laid.textureWidth === textureWidth &&
      laid.textureHeight === textureHeight
    )
      return;
    laid.width = width;
    laid.height = height;
    laid.radius = radius;
    laid.textureWidth = textureWidth;
    laid.textureHeight = textureHeight;
    this._clip.clear().roundRect(0, 0, width, height, radius).fill(0xffffff);
    this._edge
      .clear()
      .roundRect(0, 0, width, height, radius)
      .stroke({ color: 0xffffff, alignment: 1 });
    this.passes?.resize(width, height);
    this.view3d?.setSize(width, height);
    if (sprite) fitSprite(sprite, width, height, this.passes === null);
  }

  /** Paints the edge for a darkness, 0 light to 1 dark, and the own view's background while it's still the picture's */
  paint(darkness) {
    this._edge.tint = overlayColor('inkSoft', darkness);
    if (this.view3d?.background === this._background) {
      this.view3d.background = this._background = screenColor(
        overlayColor('panel', darkness),
      );
    }
  }

  /** Frees its sprite or own view (with everything under its root), the clip and the edge, and the passes */
  destroy() {
    if (this.destroyed) return;
    super.destroy({ children: true, context: true });
    this.passes?.destroy();
  }
}

/** Fills the picture with a render texture's sprite, or fits a texture's inside it with its aspect kept, centred */
function fitSprite(sprite, width, height, contain) {
  const scale = contain
    ? Math.min(width / sprite.texture.width, height / sprite.texture.height)
    : 1;

  sprite.scale.set(scale);
  sprite.position.set(
    (width - sprite.texture.width * scale) / 2,
    (height - sprite.texture.height * scale) / 2,
  );
}
