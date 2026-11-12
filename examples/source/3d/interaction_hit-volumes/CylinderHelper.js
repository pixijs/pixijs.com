/**
 * An upright cylinder's outline, for a hit volume round a node's local y axis, with an optional see-through fill
 *
 * It's SphereHelper's sibling: the top and bottom rings, and the two side edges where the camera's sight lines graze
 * the wall, all in one BarsGeometry and one draw, laid just outside the radius and height so a puck that fills the
 * cylinder shows whole. The fill is a closed cylinder in the same colour, one more draw. It's a kit `Helper`, so it
 * follows the theme and never joins the pick list. It lives in this example until a second one needs it.
 */

import { CylinderGeometry, Vector3 } from '@pixi/3d';

import { BarsGeometry } from './theme/BarsGeometry';
import { Helper } from './theme/Helper';

import { sharedHelperResource } from './theme/helpers';

/** Bars round each ring; enough that a puck filling the view reads as round */
const RING_SEGMENTS = 48;
/** The two side edges' bars come after both rings' */
const FIRST_SIDE = RING_SEGMENTS * 2;
const ORIGIN = { x: 0, y: 0, z: 0 };

const _eye = new Vector3();

/**
 * A capped cylinder standing along its parent's y axis, drawn as two rings and its two side edges
 * @example
 * ```ts
 * const outline = new CylinderHelper({ camera: view3d.camera, parent: puck }).set(0.4, 0.3);
 *
 * outline.color = 'accent';
 * outline.fill = 0.14;
 * app.ticker.add(() => outline.update());
 * ```
 */
export class CylinderHelper extends Helper {
  _bars = new BarsGeometry(FIRST_SIDE + 2);
  _fill;
  _camera;
  _thickness = 0.02;
  _fillOpacity = 0;
  _radius = 0;
  _halfHeight = 0;
  /** Where the camera stood, round the axis and out from it, when the side edges were last placed */
  _eyeAngle = NaN;
  _eyeDistance = NaN;

  constructor({ camera, thickness = 0.02, fill = 0, ...options }) {
    super(options, 'ink');

    this._camera = camera;
    this._thickness = thickness;
    this._fillOpacity = fill;
    this._bars.count = FIRST_SIDE + 2;
    this._addPart(this._bars);
    // A unit radius and a height of 2, so its scale is the radius and the half height.
    this._fill = this._addPart(
      sharedHelperResource(
        'cylinderHelper:fill',
        () => new CylinderGeometry({ radialSegments: RING_SEGMENTS }),
      ),
      fill,
    );
  }

  /** The see-through fill's opacity, 0 to 1, as a share of the helper's; 0 draws none */
  get fill() {
    return this._fillOpacity;
  }
  set fill(value) {
    if (value === this._fillOpacity) return;
    this._fillOpacity = value;
    this._setShade(this._fill, value);
  }

  /** Fits it to a cylinder of `radius` and `halfHeight` round the parent's y axis, centred on the parent's origin */
  set(radius, halfHeight) {
    const half = this._thickness / 2;
    const r = radius + half;
    const y = halfHeight + half;
    const step = (Math.PI * 2) / RING_SEGMENTS;

    this._radius = radius;
    this._halfHeight = halfHeight;
    for (let i = 0; i < RING_SEGMENTS; i++) {
      const ax = Math.cos(i * step) * r;
      const az = Math.sin(i * step) * r;
      const bx = Math.cos((i + 1) * step) * r;
      const bz = Math.sin((i + 1) * step) * r;

      this._bars.setBar(i, ax, y, az, bx, y, bz, half);
      this._bars.setBar(RING_SEGMENTS + i, ax, -y, az, bx, -y, bz, half);
    }
    // On the rings' inner edge rather than the volume's own, so it never fights a puck's wall at the same radius.
    this._fill.scale.set(radius + half, halfHeight + half, radius + half);
    this._eyeAngle = NaN;

    return this.update();
  }

  /**
   * Moves the side edges onto the wall's outline as the camera sees it; call it after the camera moves
   *
   * Seen from above, the camera's sight lines graze the wall at `acos(r / d)` either side of the camera's bearing,
   * for a camera `d` out from the axis. A camera over the top or under the bottom sees no side edges.
   */
  update() {
    const eye = this.toLocal(ORIGIN, this._camera, _eye);
    const angle = Math.atan2(eye.z, eye.x);
    const distance = Math.hypot(eye.x, eye.z);

    if (angle === this._eyeAngle && distance === this._eyeDistance) return this;
    this._eyeAngle = angle;
    this._eyeDistance = distance;

    const half = this._thickness / 2;
    const r = this._radius + half;
    const y = distance > r ? this._halfHeight + half : 0;
    const spread = distance > r ? Math.acos(r / distance) : 0;

    for (let side = 0; side < 2; side++) {
      const x = Math.cos(angle + (side ? spread : -spread)) * r;
      const z = Math.sin(angle + (side ? spread : -spread)) * r;

      // A bar of no length draws nothing, which is how the edges hide.
      this._bars.setBar(FIRST_SIDE + side, x, -y, z, x, y, z, half);
    }
    this._bars.update();

    return this;
  }

  /** Destroys its meshes and its own geometry, leaving the shared fill cylinder to the kit */
  destroy(options) {
    if (this.destroyed) return;
    super.destroy(options);
    this._bars.destroy();
  }
}
