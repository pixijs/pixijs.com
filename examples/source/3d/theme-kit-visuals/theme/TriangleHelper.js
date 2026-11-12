/**
 * One filled triangle laid over a surface, for marking the triangle a ray struck or one an index buffer names
 *
 * It sits a hair off the surface toward the triangle's front, so it shows over the face it marks, and draws from
 * both sides in one call.
 */

import { Geometry3D, Vector3 } from '@pixi/3d';

import { Helper } from './Helper';

import { upNormals } from './helpers';

/** How far the triangle stands off the face it marks, toward that face's front */
const LIFT = 0.004;

/** Options for {@link TriangleHelper} */

const _edgeB = new Vector3();
const _edgeC = new Vector3();

/**
 * A filled triangle through three corners in its parent's space
 *
 * Add it as the mesh's child and {@link TriangleHelper#set} the struck triangle's corners straight from the
 * geometry's positions. Its front is the side the corners run anticlockwise round, as for the mesh's own faces. A
 * second copy faces the other way, a hair off the back, so it shows from either side; a see-through look draws both
 * sides from one copy, so the second collapses and the triangle never blends over itself.
 * @example
 * ```ts
 * const struck = new TriangleHelper({ parent: torus });
 *
 * struck.set(a, b, c); // read from the geometry at hit.triangleIndex
 * struck.xray = true; // a low-poly stand-in's facet lies inside the clay
 * ```
 */
export class TriangleHelper extends Helper {
  _geometry;
  _mesh;
  /** The corners last set, xyz each */
  _corners = new Float32Array(9);
  /** The triangle's unit normal, toward its front */
  _normal = new Vector3();
  /** Whether the back copy draws: only while the material culls back faces */
  _back = true;

  constructor(options = {}) {
    super(options, 'accent');

    // The front copy (vertices 0 to 2) and the back copy (3 to 5), wound the other way. The normals are only there
    // for the pass shader, which reads the attribute; flat helper colour ignores them.
    this._geometry = new Geometry3D({
      positions: new Float32Array(18),
      normals: upNormals(6),
      indices: new Uint16Array([0, 1, 2, 3, 5, 4]),
      dynamic: true,
    });
    this._mesh = this._addPart(this._geometry);
    this._back = !this._mesh.material.doubleSided;
  }

  /** Lays the triangle over `a`, `b` and `c`, in its parent's space */
  set(a, b, c) {
    const corners = this._corners;

    corners[0] = a.x;
    corners[1] = a.y;
    corners[2] = a.z;
    corners[3] = b.x;
    corners[4] = b.y;
    corners[5] = b.z;
    corners[6] = c.x;
    corners[7] = c.y;
    corners[8] = c.z;
    _edgeB.set(b.x - a.x, b.y - a.y, b.z - a.z);
    _edgeC.set(c.x - a.x, c.y - a.y, c.z - a.z);
    _edgeB.cross(_edgeC, this._normal);

    const size = this._normal.magnitude();

    this._normal.multiplyScalar(size > 0 ? 1 / size : 0);
    this._write();

    return this;
  }

  /** Destroys its mesh and its own geometry */
  destroy(options) {
    if (this.destroyed) return;
    super.destroy(options);
    this._geometry.destroy(true);
  }

  /** Repaints, then keeps the back copy only while the new material culls back faces */
  _paint() {
    super._paint();

    const back = !this._mesh.material.doubleSided;

    if (back === this._back) return;
    this._back = back;
    this._write();
  }

  /** Writes both copies from the corners, each a hair off its own side; a collapsed back copy draws nothing */
  _write() {
    const positions = this._geometry.positions;
    const corners = this._corners;
    const { x, y, z } = this._normal;

    for (let i = 0; i < 9; i += 3) {
      positions[i] = corners[i] + x * LIFT;
      positions[i + 1] = corners[i + 1] + y * LIFT;
      positions[i + 2] = corners[i + 2] + z * LIFT;
      positions[i + 9] = this._back ? corners[i] - x * LIFT : corners[0];
      positions[i + 10] = this._back ? corners[i + 1] - y * LIFT : corners[1];
      positions[i + 11] = this._back ? corners[i + 2] - z * LIFT : corners[2];
    }
    this._geometry.attributes.aPosition.buffer.update();
  }
}
