/**
 * A sphere's outline, for bounding spheres, hit spheres and trigger zones
 *
 * A ring traces the sphere's edge on screen, and a ring round its equator shows which way is level, both just outside
 * the radius so a ball that fills the sphere shows whole. An optional see-through fill shows the volume itself.
 */

import { Vector3 } from '@pixi/3d';

import { BarsGeometry } from './BarsGeometry';
import { Helper } from './Helper';

import { helperGeometry } from './helpers';

/** Bars round each ring; enough that the outline reads as a circle on a sphere filling the frame */
const RING_SEGMENTS = 64;
/** The ring's own axis, which the outline turns toward the camera */
const RING_AXIS = { x: 0, y: 0, z: 1 };
const ORIGIN = { x: 0, y: 0, z: 0 };

const _toCamera = new Vector3();

/** Options for {@link SphereHelper} */

/**
 * A sphere drawn as its outline on screen and its equator, with an optional see-through fill
 *
 * {@link SphereHelper#setSphere} places it on a `Sphere` in its parent's space, such as a mesh's `hitVolume` with the
 * helper as the mesh's child. Give it the view's `camera` and call {@link SphereHelper#update} each frame, so the
 * outline stays on the sphere's edge as the camera moves. Centred on the floor, the floor hides its lower half and it
 * reads as a dome.
 * @example
 * ```ts
 * const zone = new SphereHelper({ camera: view3d.camera, parent: view3d.root });
 *
 * zone.setSphere(new Sphere(new Vector3(2, 0, 1), 1.2));
 * zone.fill = 0.14;
 * app.ticker.add(() => zone.update());
 * ```
 */
export class SphereHelper extends Helper {
  _ring;
  _outline;
  _equator;
  _fill;
  _thickness = 0.02;
  _center = new Vector3();
  _camera;
  _fillOpacity = 0;
  /** The radius the rings were last built for */
  _radius = -1;
  /** Whether the last sphere set has any volume */
  _placed = false;

  constructor({ thickness = 0.02, fill = 0, camera = null, ...options } = {}) {
    super(options, 'ink');

    this._thickness = thickness;
    this._fillOpacity = fill;
    this._camera = camera;
    this._ring = new BarsGeometry(RING_SEGMENTS);
    this._ring.count = RING_SEGMENTS;
    // The ring is built in the xy plane, which the outline turns to face the camera; the equator lies it flat.
    this._outline = this._addPart(this._ring);
    this._equator = this._addPart(this._ring);
    this._equator.rotation.x = Math.PI / 2;
    this._fill = this._addPart(helperGeometry('dot'), fill);
    if (!camera) {
      this._outline.billboardMode = 'spherical';
      // A pass can't draw a camera-facing part, and the outline only turned into one after it was added.
      this._paint();
    }
    this._show();
    this.update();
  }

  /** The see-through fill's opacity, 0 to 1, as a share of the helper's; 0 draws none */
  get fill() {
    return this._fillOpacity;
  }
  set fill(value) {
    this._fillOpacity = value;
    this._setShade(this._fill, value);
  }

  /** Places it on `sphere`, in its parent's space, and fits the outline; the rings are rebuilt only for a new radius */
  setSphere(sphere) {
    const { center, radius } = sphere;

    this._placed = !sphere.isEmpty();
    this._center.copyFrom(center);
    this._outline.position.copyFrom(center);
    this._equator.position.copyFrom(center);
    this._fill.position.copyFrom(center);
    this._fill.scale.set(radius);
    if (radius !== this._radius) this._build(radius);
    this._show();

    return this.update();
  }

  /**
   * Turns the outline to the camera and fits it to the sphere's edge as the camera sees it; call it after either moves
   *
   * The camera sees the edge where its sight lines graze the sphere: for radius `r` at distance `d`, a circle of
   * radius `r · sqrt(1 − r² / d²)`, `r² / d` from the centre toward the camera. From inside the sphere there's no
   * edge, so the outline hides. Without a `camera` there's nothing to do.
   */
  update() {
    const camera = this._camera;

    if (!camera) return this;

    const outline = this._outline;
    const r = this._radius;
    const toCamera = this.toLocal(ORIGIN, camera, _toCamera).subtract(
      this._center,
    );
    const d = toCamera.magnitude();
    const edge = this._placed && d > r;

    this._showPart(outline, edge);
    if (!edge) return this;
    toCamera.multiplyScalar(1 / d);
    outline.position
      .copyFrom(this._center)
      .addScaledVector(toCamera, (r * r) / d);
    outline.quaternion.setFromUnitVectors(RING_AXIS, toCamera);
    // The ring's inner edge is at r, so this scale lands it on the edge's circle; its width shrinks the same share.
    outline.scale.set(Math.sqrt(1 - (r * r) / (d * d)));

    return this;
  }

  /** Destroys its meshes and its own geometry, leaving the kit's shared sphere */
  destroy(options) {
    if (this.destroyed) return;
    super.destroy(options);
    this._ring.destroy();
    this._camera = null;
  }

  /** Shows the parts while the sphere has volume; with a camera, `update()` decides the outline */
  _show() {
    if (!this._camera) this._showPart(this._outline, this._placed);
    this._showPart(this._equator, this._placed);
    this._showPart(this._fill, this._placed);
  }

  /** Writes the ring round local +z, a half width outside `radius` so its inner edge meets the sphere */
  _build(radius) {
    const ring = this._ring;
    const half = this._thickness / 2;
    const r = radius + half;
    const step = (Math.PI * 2) / RING_SEGMENTS;

    this._radius = radius;
    for (let i = 0; i < RING_SEGMENTS; i++) {
      const a = i * step;
      const b = a + step;

      ring.setBar(
        i,
        Math.cos(a) * r,
        Math.sin(a) * r,
        0,
        Math.cos(b) * r,
        Math.sin(b) * r,
        0,
        half,
      );
    }
    ring.update();
  }
}
