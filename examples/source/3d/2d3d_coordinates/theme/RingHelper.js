/**
 * A flat ring lying on a surface: a tap's landing point, a brush cursor, a found shape's halo
 *
 * It's one closed six-sided tube of `segments` steps round local +y, drawn in one call and rewritten in place when its
 * radius or width changes. Neighbouring steps share the ring of vertices where they meet, so the line runs unbroken,
 * with no notch at a joint and no cap inside it. The ring rests on its plane rather than straddling it, so on a floor
 * it shows whole.
 */

import { Geometry3D, Vector3 } from '@pixi/3d';

import { Helper } from './Helper';

import { upNormals } from './helpers';

/** Options for {@link RingHelper} */

/** Sides round the ring's tube; it's flat colour, so only its outline shows */
const SIDES = 6;

const UP = { x: 0, y: 1, z: 0 };
const _normal = new Vector3();

/**
 * A ring in its own xz plane, square to its +y, for marking a point on a surface
 *
 * {@link RingHelper#place} moves it onto a point and turns it to face along the surface's normal there.
 * @example
 * ```ts
 * const ring = new RingHelper({ radius: 0.18, color: 'ink', parent: view3d.root });
 *
 * shape.on('pointermove', (e) => e.hit3D && ring.place(e.hit3D.point, e.hit3D.normal));
 * ```
 */
export class RingHelper extends Helper {
  _tube;
  _radius = 0.3;
  _thickness = 0.03;

  constructor({
    radius = 0.3,
    thickness = 0.03,
    segments = 48,
    ...options
  } = {}) {
    super(options, 'accent');

    this._radius = radius;
    this._thickness = thickness;
    this._tube = new Geometry3D({
      positions: new Float32Array(segments * SIDES * 3),
      normals: upNormals(segments * SIDES),
      indices: tubeIndices(segments),
      dynamic: true,
    });
    this._addPart(this._tube);
    this._build();
  }

  /** The ring's radius, to the middle of its line; setting it rewrites the ring in place, keeping the line's width */
  get radius() {
    return this._radius;
  }
  set radius(value) {
    if (value === this._radius) return;
    this._radius = value;
    this._build();
  }

  /** The line's width; setting it rewrites the ring in place, keeping its radius */
  get thickness() {
    return this._thickness;
  }
  set thickness(value) {
    if (value === this._thickness) return;
    this._thickness = value;
    this._build();
  }

  /**
   * Moves the ring to `point` and turns its +y onto `normal`, both in its parent's space, so it lies on the surface
   *
   * `normal` needn't be unit length; a zero one leaves the ring turned as it was.
   */
  place(point, normal) {
    const length = _normal.copyFrom(normal).magnitude();

    this.position.copyFrom(point);
    if (length > 1e-9)
      this.quaternion.setFromUnitVectors(
        UP,
        _normal.multiplyScalar(1 / length),
      );

    return this;
  }

  /** Frees its tube, after the base destroys its mesh */
  destroy(options) {
    if (this.destroyed) return;
    super.destroy(options);
    this._tube.destroy(true);
  }

  _build() {
    const positions = this._tube.positions;
    const segments = positions.length / 3 / SIDES;
    const half = this._thickness / 2;

    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2;

      for (let j = 0; j < SIDES; j++) {
        const b = (j / SIDES) * Math.PI * 2;
        const out = this._radius + Math.cos(b) * half;
        const o = (i * SIDES + j) * 3;

        // Raised by half the line's width, so the ring sits on its plane and a floor at the same height doesn't cut it.
        positions[o] = Math.cos(a) * out;
        positions[o + 1] = half + Math.sin(b) * half;
        positions[o + 2] = -Math.sin(a) * out;
      }
    }
    this._tube.attributes.aPosition.buffer.update();
  }
}

/** Triangles joining each ring of the tube to the next, the last back to the first, facing out */
function tubeIndices(segments) {
  const indices = new Uint16Array(segments * SIDES * 6);
  let k = 0;

  for (let i = 0; i < segments; i++) {
    const next = ((i + 1) % segments) * SIDES;

    for (let j = 0; j < SIDES; j++) {
      const a = i * SIDES + j;
      const b = i * SIDES + ((j + 1) % SIDES);
      const c = next + j;
      const d = next + ((j + 1) % SIDES);

      indices.set([a, c, b, b, c, d], k);
      k += 6;
    }
  }

  return indices;
}
