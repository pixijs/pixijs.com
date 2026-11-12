/**
 * The base of every 3D teaching helper: a node drawn as light, in one settable colour, opacity and look
 *
 * A helper is a `Container3D` whose meshes ("parts") draw in flat helper colour with no shading, shadows or fog, and
 * that never joins the pick list (`eventMode: 'none'`). `color`, `opacity`, `xray`, `muted` and `pass` repaint every
 * part at once. Painting swaps shared cached materials until the opacity or a 0xRRGGBB colour moves off what the
 * helper was built with, then writes into materials of the helper's own, so a fade or a colour picker makes nothing per frame.
 */

import { Container3D, Mesh3D } from '@pixi/3d';

import { HelperMaterial } from './HelperMaterial';
import {
  helperMaterial,
  unwatchHelperTheme,
  watchHelperTheme,
} from './helpers';

/** The quiet look's opacity: see-through ink that keeps the helper's place without drawing the eye */
const MUTED_OPACITY = 0.3;

/** Options every helper takes, on top of the usual node options */

/** One mesh of a helper, and how it takes the helper's look */

/**
 * The base class of the kit's 3D helpers
 *
 * A subclass adds its meshes with {@link Helper#_addPart}, shows and hides them with {@link Helper#_showPart}
 * rather than writing `mesh.visible`, changes a part's opacity share with {@link Helper#_setShade}, and frees the
 * geometry it built itself in `destroy()`.
 */
export class Helper extends Container3D {
  _parts = [];
  _builtColor;
  _builtOpacity = 1;
  _color;
  _opacity = 1;
  _xray;
  _muted = false;
  _pass;
  /** The helper's own materials by part colour and shade, made on the first change the shared cache can't hold */
  _own = null;

  constructor(options, defaultColor) {
    const {
      color = defaultColor,
      opacity = 1,
      xray = false,
      muted = false,
      pass = null,
      ...rest
    } = options;

    super({ eventMode: 'none', ...rest });
    this._builtColor = this._color = color;
    this._builtOpacity = this._opacity = opacity;
    this._xray = xray;
    this._muted = muted;
    this._pass = pass;
    if (pass !== null) watchHelperTheme(this, true);
  }

  /** Its colour: an axis, `'ink'`, `'accent'`, `'haze'` or any 0xRRGGBB. Parts with a colour of their own keep it */
  get color() {
    return this._color;
  }
  set color(value) {
    if (value === this._color) return;
    this._color = value;
    if (typeof value === 'number' && value !== this._builtColor)
      this._own ??= new Map();
    this._paint();
  }

  /** How solid it draws, 0 to 1; a fade can write it every frame */
  get opacity() {
    return this._opacity;
  }
  set opacity(value) {
    if (value === this._opacity) return;
    this._opacity = value;
    if (value !== this._builtOpacity) this._own ??= new Map();
    this._paint();
  }

  /** Whether it draws through whatever is in front of it, after the opaque scene, with no depth test */
  get xray() {
    return this._xray;
  }
  set xray(value) {
    if (value === this._xray) return;
    this._xray = value;
    if (this._own) {
      for (const material of this._own.values()) material.destroy();
      this._own.clear();
      for (const part of this._parts) part.own = null;
    }
    this._paint();
  }

  /** The quiet look, see-through ink at 0.3, for a helper that isn't the point right now; `color` and `opacity` stay */
  get muted() {
    return this._muted;
  }
  set muted(value) {
    if (value === this._muted) return;
    this._muted = value;
    this._paint();
  }

  /**
   * The `MeshPass` it draws in instead of the main view, or `null` for the main view
   *
   * In a pass it draws solid: see-through parts (a wedge, a fill) and camera-facing ones (a dot's outline) hide, and
   * `muted` draws solid ink. Each colour is a shader of its own there, so keep a pass helper's colour steady.
   */
  get pass() {
    return this._pass;
  }
  set pass(value) {
    if (value === this._pass) return;
    this._pass = value;
    if (value === null) unwatchHelperTheme(this);
    else watchHelperTheme(this, true);
    this._paint();
  }

  /** Paints every part again; the kit calls it for a pass helper when the theme crosses the middle of a fade */
  repaint() {
    this._paint();
  }

  /** Destroys its meshes and own materials, leaving the kit's shared geometry and materials */
  destroy(options) {
    if (this.destroyed) return;
    unwatchHelperTheme(this);
    for (const part of this._parts) part.mesh.destroy();
    this._parts.length = 0;
    if (this._own)
      for (const material of this._own.values()) material.destroy();
    this._own = null;
    super.destroy(options);
  }

  /**
   * Adds a mesh, casting and taking no shadow, whose material the helper manages
   *
   * `shade` scales its opacity (an angle's wedge is 0.22), and a `color` overrides the helper's (an axis arrow).
   */
  _addPart(geometry, shade = 1, color) {
    const mesh = new Mesh3D({
      geometry,
      // Solid ink, which most scenes draw anyway, holds the place until the paint below picks the part's own.
      material: helperMaterial('ink'),
      castShadow: false,
      receiveShadow: false,
      parent: this,
    });
    const part = {
      mesh,
      color,
      shade,
      key: `${color ?? ''}:${shade}`,
      shown: true,
      own: null,
    };

    this._parts.push(part);
    this._paintPart(part);

    return mesh;
  }

  /** Shows or hides a part; a pass that can't draw it keeps it hidden either way */
  _showPart(mesh, shown) {
    const part = this._part(mesh);

    if (!part || part.shown === shown) return;
    part.shown = shown;
    this._paintPart(part);
  }

  /**
   * Changes a part's `shade` after it was added, such as a box's fill
   *
   * The part takes a material of its own on the first change, which later changes write in place.
   */
  _setShade(mesh, shade) {
    const part = this._part(mesh);

    if (!part || part.shade === shade) return;
    if (!part.key.startsWith('#')) {
      part.key = `#${this._parts.indexOf(part)}`;
      part.own = null;
    }
    part.shade = shade;
    this._own ??= new Map();
    this._paintPart(part);
  }

  /** Reapplies every part's material for the current colour, opacity, x-ray, muted look and pass */
  _paint() {
    for (let i = 0; i < this._parts.length; i++)
      this._paintPart(this._parts[i]);
  }

  _part(mesh) {
    for (let i = 0; i < this._parts.length; i++)
      if (this._parts[i].mesh === mesh) return this._parts[i];

    return null;
  }

  _paintPart(part) {
    const mesh = part.mesh;
    const color = this._muted ? 'ink' : (part.color ?? this._color);
    const alpha = (this._muted ? MUTED_OPACITY : this._opacity) * part.shade;
    // The solid pass shader can't blend or face the camera.
    const drawable =
      this._pass === null
        ? alpha > 0
        : (this._muted ? part.shade : alpha) >= 1 &&
          mesh.billboardMode === 'none';

    mesh.visible = part.shown && drawable;
    if (!mesh.visible) {
      // A part that can't draw holds solid ink, not a cached material per colour that never draws, nor an own one an
      // x-ray change may free.
      mesh.material = helperMaterial('ink');
    } else if (this._pass !== null) {
      mesh.material = helperMaterial(color, 1, this._xray, this._pass);
    } else if (this._own) {
      if (!part.own) {
        // Parts of one colour and shade share an own material.
        part.own =
          this._own.get(part.key) ?? new HelperMaterial({ xray: this._xray });
        this._own.set(part.key, part.own);
      }
      part.own.color = color;
      part.own.alpha = alpha;
      mesh.material = part.own;
    } else {
      mesh.material = helperMaterial(color, alpha, this._xray);
    }
  }
}
