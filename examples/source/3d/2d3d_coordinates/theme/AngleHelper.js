/**
 * An angle drawn as an arc, a wedge and a head, the way a protractor shows a turn
 *
 * Place it at the point something turns about, in the same parent, and call {@link AngleHelper#setAxis} with the
 * turning axis and the direction the turn starts from. Then set {@link AngleHelper#radians} to the turn in radians: a
 * positive angle sweeps the way a positive rotation about that axis turns. The arc and wedge are its own geometry,
 * rebuilt in place only when the angle, radius or thickness changes.
 */

import { Geometry3D, Quaternion, Vector3 } from '@pixi/3d';

import { Helper } from './Helper';

import { HEAD_LENGTH, HEAD_WIDTH, helperGeometry, upNormals } from './helpers';

/** Options for {@link AngleHelper} */

/** An angle's wedge opacity, under its arc */
const WEDGE_OPACITY = 0.22;
/** Points along the arc; enough that a half turn reads as a curve */
const ARC_SEGMENTS = 48;
/** Sides round the arc's tube; it's flat colour, so only its outline shows */
const ARC_SIDES = 6;

const UP = { x: 0, y: 1, z: 0 };
/** The axis the arc is built round */
const LOCAL_Z = { x: 0, y: 0, z: 1 };
const _direction = new Vector3();
const _twist = new Quaternion();
const _start = new Vector3();
const _wanted = new Vector3();
const _axis = new Vector3();

/** An arc with a see-through wedge and a head, for a turn; three draws, two without the wedge */
export class AngleHelper extends Helper {
  _arc;
  _arcMesh;
  _wedge;
  _wedgeMesh;
  _head;
  _radius = 1;
  _thickness = 0.03;
  _radians = 0;

  constructor({
    radius = 1,
    thickness = 0.03,
    wedge = true,
    head = true,
    ...options
  } = {}) {
    super(options, 'accent');

    const arcVertices = (ARC_SEGMENTS + 1) * ARC_SIDES;

    this._radius = radius;
    this._thickness = thickness;
    this._arc = new Geometry3D({
      positions: new Float32Array(arcVertices * 3),
      normals: upNormals(arcVertices),
      indices: tubeIndices(),
      dynamic: true,
    });
    this._arcMesh = this._addPart(this._arc);
    this._wedge = wedge
      ? new Geometry3D({
          positions: new Float32Array((ARC_SEGMENTS + 2) * 3),
          normals: upNormals(ARC_SEGMENTS + 2),
          indices: fanIndices(),
          dynamic: true,
        })
      : null;
    this._wedgeMesh = this._wedge
      ? this._addPart(this._wedge, WEDGE_OPACITY)
      : null;
    this._head = head ? this._addPart(helperGeometry('head')) : null;
    this._build();
  }

  /** The angle it shows, in radians; the arc is rebuilt only when it changes */
  get radians() {
    return this._radians;
  }
  set radians(value) {
    if (value === this._radians) return;
    this._radians = value;
    this._build();
  }

  /** The arc's distance from the turning point */
  get radius() {
    return this._radius;
  }
  set radius(value) {
    if (value === this._radius) return;
    this._radius = value;
    this._build();
  }

  /** The arc's width; the head scales with it */
  get thickness() {
    return this._thickness;
  }
  set thickness(value) {
    if (value === this._thickness) return;
    this._thickness = value;
    this._build();
  }

  /**
   * Lays the arc square to `axis`, starting along `from`, both in the parent's space
   *
   * `from` needn't be square to the axis: only its part across the axis counts.
   */
  setAxis(axis, from) {
    // The arc is built round local +z, starting along local +x, so turn +z onto the axis, then twist about the axis
    // until +x lies along `from`.
    _axis.copyFrom(axis).normalize();
    this.quaternion.setFromUnitVectors(LOCAL_Z, _axis);
    _start.set(1, 0, 0).applyQuaternion(this.quaternion);
    _wanted.copyFrom(from).addScaledVector(_axis, -_axis.dot(from)).normalize();

    const cos = _start.dot(_wanted);
    const sin = _axis.dot(_start.cross(_wanted));

    this.quaternion.premultiply(
      _twist.setFromAxisAngle(_axis, Math.atan2(sin, cos)),
    );

    return this;
  }

  /** Destroys its meshes and its own arc and wedge geometry */
  destroy(options) {
    if (this.destroyed) return;
    super.destroy(options);
    this._arc.destroy(true);
    this._wedge?.destroy(true);
  }

  _build() {
    const angle = this._radians;
    const radius = this._radius;
    const turn = Math.sign(angle);
    // The head takes the arc's last stretch, so the arc stops where the head starts.
    const headAngle = this._head
      ? Math.min(
          (this._thickness * HEAD_LENGTH) / radius,
          Math.abs(angle) / 2,
        ) * turn
      : 0;
    const headLength = Math.abs(headAngle) * radius;
    const sweep = angle - headAngle;
    const arc = this._arc.positions;
    const half = this._thickness / 2;

    for (let i = 0; i <= ARC_SEGMENTS; i++) {
      const a = (sweep * i) / ARC_SEGMENTS;
      const cos = Math.cos(a);
      const sin = Math.sin(a);

      for (let j = 0; j < ARC_SIDES; j++) {
        // A backwards sweep runs round the tube the other way too, so its triangles still face out.
        const b = (j / ARC_SIDES) * Math.PI * 2 * turn;
        const out = radius + Math.cos(b) * half;
        const o = (i * ARC_SIDES + j) * 3;

        arc[o] = cos * out;
        arc[o + 1] = sin * out;
        arc[o + 2] = Math.sin(b) * half;
      }
    }
    this._arc.attributes.aPosition.buffer.update();

    if (this._wedge) {
      const wedge = this._wedge.positions;

      wedge.fill(0, 0, 3);
      for (let i = 0; i <= ARC_SEGMENTS; i++) {
        const a = (angle * i) / ARC_SEGMENTS;
        const o = (i + 1) * 3;

        wedge[o] = Math.cos(a) * radius;
        wedge[o + 1] = Math.sin(a) * radius;
        wedge[o + 2] = 0;
      }
      this._wedge.attributes.aPosition.buffer.update();
    }

    const shown = turn !== 0;

    this._showPart(this._arcMesh, shown);
    if (this._wedgeMesh) this._showPart(this._wedgeMesh, shown);
    if (!this._head) return;
    this._showPart(this._head, shown);
    if (!shown) return;
    // The head stands where the arc stops and points along it, the way the angle grows.
    _direction.set(-Math.sin(sweep) * turn, Math.cos(sweep) * turn, 0);
    this._head.quaternion.setFromUnitVectors(UP, _direction);
    this._head.scale.set(half * HEAD_WIDTH, headLength, half * HEAD_WIDTH);
    this._head.position.set(
      Math.cos(sweep) * radius + (_direction.x * headLength) / 2,
      Math.sin(sweep) * radius + (_direction.y * headLength) / 2,
      0,
    );
  }
}

/** Triangles joining each ring of the arc's tube to the next */
function tubeIndices() {
  const indices = new Uint16Array(ARC_SEGMENTS * ARC_SIDES * 6);
  let k = 0;

  for (let i = 0; i < ARC_SEGMENTS; i++) {
    for (let j = 0; j < ARC_SIDES; j++) {
      const a = i * ARC_SIDES + j;
      const b = i * ARC_SIDES + ((j + 1) % ARC_SIDES);
      const c = a + ARC_SIDES;
      const d = b + ARC_SIDES;

      indices.set([a, c, b, b, c, d], k);
      k += 6;
    }
  }

  return indices;
}

/** A fan of triangles from the wedge's centre, vertex 0, round its rim */
function fanIndices() {
  const indices = new Uint16Array(ARC_SEGMENTS * 3);

  for (let i = 0; i < ARC_SEGMENTS; i++) indices.set([0, i + 1, i + 2], i * 3);

  return indices;
}
