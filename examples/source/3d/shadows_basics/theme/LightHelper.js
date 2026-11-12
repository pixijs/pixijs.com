/**
 * A light's shape, the part of a light a reader can't see: a directional light's parallel rays, a point light's bulb
 * and reach, a spot's cone
 *
 * It follows the light from anywhere in the scene, in the light's own colour, or in ink while that's near white and
 * would vanish into the light theme's haze. Its lines are {@link BarsGeometry} bars, which `lightShapes.ts` rewrites in
 * place only when a size changes, such as a cone's angle or a range. Following a light that turns or slides costs only
 * a transform, except that a point light's footprint rebuilds as its light moves up or down.
 */

import { Matrix4, Quaternion, Vector3 } from '@pixi/3d';

import { BarsGeometry } from './BarsGeometry';
import { DotHelper } from './DotHelper';
import { Helper } from './Helper';

import { helperColor } from './helpers';

import {
  RING_SEGMENTS,
  setCone,
  setPointRing,
  setRays,
  SPOT_BARS,
} from './lightShapes';
import { mixColor } from './palette';

/** A light whose every channel is at least this is near white, which vanishes into the light theme's 0xf3f1f7 haze */
const NEAR_WHITE = 0xe0;
/** A switched-off bulb's opacity, the muted look's */
const OFF_OPACITY = 0.3;

const _world = new Matrix4();
const _toParent = new Matrix4();
const _position = new Vector3();
const _rotation = new Quaternion();
const _scale = new Vector3();
const _beam = new Vector3();

/** Options for {@link LightHelper}: the light, and the options for its kind */

/**
 * A light's shape: a directional light's rays, a point light's bulb and reach, a spot light's cone and rings
 *
 * Put it under the light's parent or `view3d.root` (under the light, it would hide with it) and call
 * {@link LightHelper#update} each frame, which places it at the light. A hidden light keeps its helper, drawn in the
 * muted look with the bulb off, so a switched-off light still shows where it is.
 * @example
 * ```ts
 * const sun = new LightHelper({ light: stage.key, target: { x: 0, y: 1.5, z: 0 }, parent: view3d.root });
 * const tag = labels.add({ text: 'stage.key' });
 *
 * app.ticker.add(() => tag.at.copyFrom(sun.update().tail));
 * ```
 */
export class LightHelper extends Helper {
  /** The light it draws */
  light;
  /** DirectionalLight: how many rays; fixed, since it sizes the lines' buffers */
  rays = 3;
  /** Every line's width; it and the fields below are read on the next {@link LightHelper#update} */
  thickness = 0.02;
  /** DirectionalLight: the distance between neighbouring rays */
  spread = 0.6;
  /** Each ray's length, or the spot's cone's */
  length = 1;
  /** DirectionalLight: how far short of the target the rays end */
  gap = 0.9;
  /** DirectionalLight: the point in the parent's space the rays end `gap` short of; `null`, 1 along the beam */
  target = null;
  /** PointLight: whether the camera-facing ring at the light's range draws */
  range = false;
  /** PointLight: the footprint ring's world height, or `null` for none */
  footprint = null;
  /** PointLight: the bulb's look, 0 to 1, from muted ink at 30% (a switched-off light) to the light's own colour */
  brightness = 1;
  /** Whether the rays, cone and rings take the light's colour; setting `color` turns it off, `true` resumes it */
  followColor;
  /** In the parent's space, for a tag: the bulb, the spot's apex, or the rays' tails' centre (a gap for even `rays`) */
  tail = new Vector3();
  _bars;
  _barsMesh;
  _ring = null;
  _ringMesh = null;
  _bulb = null;
  /** The sizes `lightShapes` last wrote: the rays, cone or footprint in slots 0 to 3, the range ring in 4 to 7 */
  _built = new Float64Array(8).fill(Number.NaN);
  /** The light's colour as the helper shows it: its own, or 'ink' while that's near white */
  _lightColor = 'ink';
  _quiet = false;
  _lightOn = true;

  constructor(options) {
    const {
      light,
      color,
      target,
      thickness,
      rays,
      spread,
      length,
      gap,
      bulb,
      range,
      footprint,
      ...rest
    } = options;
    const point = light.type === 'point';

    // Built in a palette colour, so a light's own colour, from outside the palette, paints the helper's own materials
    // and never grows the kit's cache.
    super({ ...rest, color: color ?? 'ink' }, 'ink');
    this.light = light;
    this.rays = rays ?? this.rays;
    this.thickness = thickness ?? this.thickness;
    this.spread = spread ?? this.spread;
    this.length = length ?? this.length;
    this.gap = gap ?? this.gap;
    this.range = range ?? this.range;
    this.footprint = footprint ?? this.footprint;
    this.followColor = color === undefined;
    this.target = target ? new Vector3().copyFrom(target) : null;
    this._bars = new BarsGeometry(
      point ? RING_SEGMENTS : light.type === 'spot' ? SPOT_BARS : this.rays * 2,
    );
    this._barsMesh = this._addPart(this._bars);
    if (point) {
      this._ring = new BarsGeometry(RING_SEGMENTS);
      this._ringMesh = this._addPart(this._ring);
      this._ringMesh.billboardMode = 'spherical';
      // Hidden until it has bars. The repaint also sees that it faces the camera now, which a pass can't draw.
      this._showPart(this._ringMesh, false);
      this._bulb = new DotHelper({ parent: this });
      this.bulb = bulb ?? 0.08;
    }
    this.update();
  }

  /** The rays', cone's and rings' colour; setting it stops them following the light's */
  get color() {
    return super.color;
  }
  set color(value) {
    this.followColor = false;
    super.color = value;
  }

  /** The quiet look, for a light a mesh ignores; a hidden light draws muted too, and this keeps its value */
  get muted() {
    return this._quiet;
  }
  set muted(value) {
    this._quiet = value;
    super.muted = value || !this._lightOn;
  }

  /** PointLight: the bulb's radius; 0 hides it. Settable, for a bulb that swells with its light */
  get bulb() {
    return this._bulb?.radius ?? 0;
  }
  set bulb(value) {
    if (!this._bulb) return;
    this._bulb.radius = value;
    this._bulb.visible = value > 0;
  }

  /** Follows the light: its pose and colour, whether it's on, and a spot's cone or a point light's range */
  update() {
    const light = this.light;
    const lightY = light.getGlobalTransform(_world).elements[13];

    if (this.parent)
      _world.premultiply(
        this.parent.getGlobalTransform(_toParent).getInverse(_toParent),
      );
    else _toParent.identity();
    _world.decompose(_position, _rotation, _scale);
    _beam.set(0, 0, -1).applyQuaternion(_rotation);
    this.tail.copyFrom(_position);
    if (light.type === 'directional') {
      if (this.target)
        _position.copyFrom(this.target).addScaledVector(_beam, -this.gap);
      else _position.add(_beam);
      this.tail.copyFrom(_position).addScaledVector(_beam, -this.length);
      setRays(
        this._bars,
        this._built,
        this.rays,
        this.spread,
        this.length,
        this.thickness,
      );
    } else if (light.type === 'spot') {
      setCone(
        this._bars,
        this._built,
        this.length,
        this.thickness,
        light.coneAngle,
        light.penumbra,
      );
    } else {
      // A range is a sphere and a footprint a world plane, so a point light's helper keeps the world's axes.
      _rotation.setFromScaledRotationMatrix(_toParent);
      this._buildRings(light, lightY);
    }
    this.position.copyFrom(_position);
    this.quaternion.copyFrom(_rotation);
    this._follow();

    return this;
  }

  destroy(options) {
    if (this.destroyed) return;
    this._bulb?.destroy();
    super.destroy(options);
    this._bars.destroy();
    this._ring?.destroy();
    this.light = null;
  }

  /** Takes the light's colour, while following it, and its on or off look, and paints the bulb to match */
  _follow() {
    const value = this.light.color.toNumber();
    const on = this.light.visible;
    const bulb = this._bulb;

    this._lightColor =
      Math.min((value >> 16) & 255, (value >> 8) & 255, value & 255) >=
      NEAR_WHITE
        ? 'ink'
        : value;
    if (this.followColor) super.color = this._lightColor;
    if (on !== this._lightOn) {
      this._lightOn = on;
      super.muted = this._quiet || !on;
    }
    if (!bulb) return;

    const lit = this._quiet || !on ? 0 : Math.min(this.brightness, 1);
    // A pass draws solid, so there the bulb is just on or off; elsewhere a part-lit one mixes with the theme's ink.
    const mix = this.pass === null && lit < 1;

    bulb.xray = this.xray;
    bulb.pass = this.pass;
    bulb.muted = lit <= 0;
    bulb.color = mix
      ? mixColor(helperColor('ink'), helperColor(this._lightColor), lit)
      : this._lightColor;
    bulb.opacity = mix
      ? OFF_OPACITY + (this.opacity - OFF_OPACITY) * lit
      : this.opacity;
  }

  /**
   * The footprint ring, where the range sphere meets the plane y = footprint, and the camera-facing range ring, each
   * hidden while it has no bars. The footprint rebuilds as the light's height changes its radius; the range's doesn't.
   */
  _buildRings(light, lightY) {
    const reach = light.range;
    const height = (this.footprint ?? lightY) - lightY;
    const footprint =
      this.footprint !== null && Math.abs(height) < reach
        ? Math.sqrt(reach ** 2 - height ** 2)
        : 0;
    const half = this.thickness / 2;

    this._showPart(
      this._barsMesh,
      setPointRing(this._bars, this._built, 0, footprint, height, true, half),
    );
    if (this._ring && this._ringMesh) {
      this._showPart(
        this._ringMesh,
        setPointRing(
          this._ring,
          this._built,
          4,
          this.range ? reach : 0,
          0,
          false,
          half,
        ),
      );
    }
  }
}
