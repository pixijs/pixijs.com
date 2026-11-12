/** A camera's view volume and a small camera glyph, copied from a camera anywhere into the helper's parent's space */

import { Camera3D, Geometry3D, Matrix4, Quaternion, Vector3 } from '@pixi/3d';

import { DEG_TO_RAD } from 'pixi.js';

import { BarsGeometry } from './BarsGeometry';
import { Helper } from './Helper';

/** Options for {@link FrustumHelper} */

/** Edges, end and start rectangles (a box has both) and the glyph's two bars */
const CAPACITY = 14;
/** How far a bar's middle sits outside the volume, in bar radii: past its own radius, so the camera never sees it */
const CLEARANCE = 1.5;
/** The glyph in `size`s, from just behind the eye: a lens flaring forward off the front of a box */
const GLYPH = { lens: 0.35, lensFront: 0.22, lensBack: 0.1, box: 0.22 };
/** Each corner's side across, then up: top-left first and round clockwise as the camera sees them */
const CORNERS = [-1, 1, 1, 1, 1, -1, -1, -1];
/** The fill's normals, +y, which only a pass's shader reads, and its two triangles */
const UP = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
const QUAD = new Uint16Array([0, 1, 2, 0, 2, 3]);

const _matrix = new Matrix4();
const _toParent = new Matrix4();
const _position = new Vector3();
const _quaternion = new Quaternion();
const _vector = new Vector3();
/** The shape to draw, laid out as `_built` */
const _shape = new Float64Array(7);
/** Where each corner's bar starts: at the tip just behind the eye for a pyramid, on the near rectangle for a box */
const _starts = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];

/**
 * A camera's view volume, cut at `length` or a floor, with a camera glyph behind its eye
 *
 * {@link FrustumHelper#update} reads the camera's world pose, so a camera in another scene or posed this tick draws
 * where it is, and places the helper there in its parent's space: don't add it under the camera. A perspective camera
 * draws a pyramid, an orthographic one a box, both just outside the volume so a camera never sees its own. The bars
 * are one draw, rebuilt only when the shape changes; a `fill` is one more.
 * @example
 * ```ts
 * const frustum = new FrustumHelper({ camera: securityCamera, floor: 0, length: 12, fill: 0.12, parent: view3d.root });
 *
 * app.ticker.add(() => {
 *   frustum.update();
 *   tag.at.copyFrom(frustum.corners[3]);
 * });
 * ```
 */
export class FrustumHelper extends Helper {
  /** The eye, in the parent's space */
  eye = new Vector3();
  /** The end rectangle or footprint, in the parent's space: top-left, top-right, bottom-right, bottom-left */
  corners = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];
  /** The camera it shows; `null` holds the pose and shape it has, for a stored pose set with `setPose` */
  camera;
  /** The aspect, width over height, for a camera with neither a renderTexture nor a `view` */
  aspect = 1;
  /** How far the volume runs along the camera's forward axis; with a `floor`, the furthest it runs */
  length = 2;
  /** A height in the parent's space the edges run down to, as far as `length`, outlining the footprint; or `null` */
  floor;
  /** The glyph's length, eye to back */
  size = 0.3;
  /** Each bar's width */
  thickness = 0.02;
  _view;
  _far;
  _body;
  _bars = new BarsGeometry(CAPACITY);
  _fill = null;
  _local = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];
  /** What the bars were last built from: mode, the two spans, length, floor, size and thickness */
  _built = new Float64Array(7).fill(Number.NaN);
  _placed = new Quaternion(Number.NaN);
  _perspective = true;
  /** Half the view's height one unit ahead (perspective) or its half-width (orthographic) */
  _spread = Math.tan((Camera3D.defaultOptions.fov * DEG_TO_RAD) / 2);

  constructor(options = {}) {
    const {
      camera = null,
      view = null,
      aspect = 1,
      length = 2,
      floor = null,
      far = true,
      fill = 0,
      ...rest
    } = options;
    const { body = true, size = 0.3, thickness = 0.02, ...helper } = rest;

    super(helper, 'ink');
    this.camera = camera;
    this.aspect = aspect;
    this.length = length;
    this.floor = floor;
    this.size = size;
    this.thickness = thickness;
    this._view = view;
    this._far = far;
    this._body = body;
    this._addPart(this._bars);
    if (fill > 0) {
      this._fill = new Geometry3D({
        positions: new Float32Array(12),
        normals: UP,
        indices: QUAD,
        dynamic: true,
      });
      this._addPart(this._fill, fill);
    }
    this.update();
  }

  /** Copies the camera's pose and projection, then rebuilds the bars if the shape changed; allocates nothing */
  update() {
    const camera = this.camera;

    if (camera) {
      camera.getGlobalTransform(_matrix);
      // Into the parent's space, so a helper under a moved container still lands on the camera.
      if (this.parent)
        _matrix.premultiply(
          this.parent.getGlobalTransform(_toParent).getInverse(_toParent),
        );
      _matrix.decompose(_position, _quaternion, _vector);
      this.position.copyFrom(_position);
      this.quaternion.copyFrom(_quaternion);
      this._perspective = camera.mode === 'perspective';
      // A square projection's y scale is one over the half-height it sees, one unit ahead for a perspective camera.
      this._spread = 1 / camera.computeProjection(1, _matrix).elements[5];
    }

    return this._refresh();
  }

  /** Holds a stored pose in the parent's space, for a ghost of an earlier view; set `camera = null` first */
  setPose(position, quaternion) {
    this.position.copyFrom(position);
    this.quaternion.copyFrom(quaternion);

    return this._refresh();
  }

  /** Destroys its meshes and the geometry it built */
  destroy(options) {
    if (this.destroyed) return;
    super.destroy(options);
    this._bars.destroy();
    this._fill?.destroy(true);
    this.camera = null;
  }

  _refresh() {
    const aspect = this._aspect();
    // A footprint changes shape as the camera moves; a volume cut at `length` only moves with it.
    let changed =
      this.floor !== null &&
      !(this.eye.equals(this.position) && this._placed.equals(this.quaternion));

    _shape[0] = this._perspective ? 1 : 0;
    _shape[1] = this._perspective ? this._spread * aspect : this._spread;
    _shape[2] = this._perspective ? this._spread : this._spread / aspect;
    _shape[3] = this.length;
    _shape[4] = this.floor ?? Number.POSITIVE_INFINITY;
    _shape[5] = this.size;
    _shape[6] = this.thickness;
    for (let i = 0; i < _shape.length; i++)
      changed ||= this._built[i] !== _shape[i];
    this.eye.copyFrom(this.position);
    this._placed.copyFrom(this.quaternion);
    if (changed) this._build(this._perspective, _shape[1], _shape[2]);
    for (let i = 0; i < 4; i++)
      this.corners[i]
        .copyFrom(this._local[i])
        .applyQuaternion(this._placed)
        .add(this.eye);

    return this;
  }

  /** The aspect the camera draws at: its texture's, else its rect of the view, else `aspect` */
  _aspect() {
    const viewport = this.camera?.viewport;
    const target = this.camera?.renderTexture ?? this._view;
    const aspect = target
      ? ((viewport?.width ?? 1) * target.width) /
        ((viewport?.height ?? 1) * target.height)
      : 0;

    return aspect > 0 && Number.isFinite(aspect) ? aspect : this.aspect;
  }

  _build(perspective, spanX, spanY) {
    const bars = this._bars;
    const radius = this.thickness / 2;
    const clearance = radius * CLEARANCE;
    // A pyramid's side planes face out along (±1, 0, spanX) and (0, ±1, spanY). The same pyramid moved back by `back`
    // lies at least `clearance` outside every one, and its four edges still meet in a point.
    const back = perspective
      ? clearance *
        Math.max(Math.hypot(1, spanX) / spanX, Math.hypot(1, spanY) / spanY)
      : 0;
    const most = this.length + back;
    let n = 0;

    this._built.set(_shape);
    for (let i = 0; i < 4; i++) {
      const x = CORNERS[i * 2];
      const y = CORNERS[i * 2 + 1];
      const dx = perspective ? x * spanX : 0;
      const dy = perspective ? y * spanY : 0;
      // A pyramid's bars start at its moved-back tip, a box's on its near rectangle pushed out past its sides.
      const start = perspective
        ? _starts[i].set(0, 0, back)
        : _starts[i].set(x * (spanX + clearance), y * (spanY + clearance), 0);
      const reach =
        this.floor === null
          ? most
          : Math.min(this._reach(this.floor + radius, start, dx, dy), most);
      const end = this._local[i].set(
        start.x + dx * reach,
        start.y + dy * reach,
        back - reach,
      );

      bars.setBar(n++, start.x, start.y, start.z, end.x, end.y, end.z, radius);
    }
    if (this._far) n = loop(bars, n, this._local, radius);
    if (!perspective) n = loop(bars, n, _starts, radius);
    if (this._body) {
      const size = this.size;
      const lens = clearance + size * GLYPH.lens;

      bars.setBar(
        n++,
        0,
        0,
        clearance,
        0,
        0,
        lens,
        size * GLYPH.lensFront,
        size * GLYPH.lensBack,
      );
      bars.setBar(n++, 0, 0, lens, 0, 0, clearance + size, size * GLYPH.box);
    }
    bars.count = n;
    bars.update();
    if (this._fill) {
      for (let i = 0; i < 4; i++)
        this._local[i].toArray(this._fill.positions, i * 3);
      this._fill.attributes.aPosition.buffer.update();
    }
  }

  /** How far along the forward axis a bar from `start` runs down to the parent-space height `y`; infinite if never */
  _reach(y, start, dx, dy) {
    const drop =
      y - this.eye.y - _vector.copyFrom(start).applyQuaternion(this._placed).y;
    const reach =
      drop / _vector.set(dx, dy, -1).applyQuaternion(this._placed).y;

    return reach > 0 ? reach : Number.POSITIVE_INFINITY;
  }
}

/** Joins four corners in a loop of bars from bar `n`, each a radius longer at both ends so the corners close */
function loop(bars, n, corners, radius) {
  for (let i = 0; i < 4; i++) {
    const a = corners[i];
    const b = corners[(i + 1) % 4];
    const step = b
      .subtract(a, _vector)
      .multiplyScalar(radius / (a.distanceTo(b) || 1));

    bars.setBar(
      n++,
      a.x - step.x,
      a.y - step.y,
      a.z - step.z,
      b.x + step.x,
      b.y + step.y,
      b.z + step.z,
      radius,
    );
  }

  return n;
}
