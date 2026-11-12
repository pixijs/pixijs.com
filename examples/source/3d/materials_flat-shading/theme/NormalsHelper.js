/**
 * Short hairs out of a mesh's vertices along their normals, for showing which way a surface faces
 *
 * Each hair is a thin bar from a vertex along its normal, all of them in one {@link BarsGeometry}, drawn in one call.
 * It reads float normals or the quantized ones a default geometry stores, so it shows any mesh's normals as they are.
 */

import { BarsGeometry } from './BarsGeometry';
import { Helper } from './Helper';

/** Options for {@link NormalsHelper}: a `geometry`, or the arrays */

const NONE = new Float32Array(0);

/**
 * A short hair out of each vertex along its normal
 *
 * Give it a `geometry`, or `positions` and `normals` of your own (a slice through a mesh, the normals blended at a
 * hit), and add it as the mesh's child so the hairs move with the mesh. It draws one hair a point, `length` long
 * whatever the normal's length. After rewriting the arrays in place, call {@link NormalsHelper#update}.
 * @example
 * ```ts
 * const hairs = new NormalsHelper({ geometry: terrain.geometry, length: 0.3, parent: terrain });
 *
 * app.ticker.add(() => hairs.update()); // the terrain rewrites its positions and normals each frame
 * ```
 */
export class NormalsHelper extends Helper {
  _bars;
  _positions;
  _normals;
  /** Values a normal: four in a quantized geometry's `Int16Array`, three otherwise */
  _stride = 3;
  _radius;
  _length = 0.3;

  constructor({
    geometry,
    positions = geometry?.positions,
    normals = geometry?.normals,
    length = 0.3,
    thickness = 0.012,
    ...options
  } = {}) {
    super(options, 'ink');

    this._positions = positions ?? NONE;
    this._normals = normals ?? NONE;
    this._stride = this._normals instanceof Int16Array ? 4 : 3;
    this._length = length;
    this._radius = thickness / 2;

    const hairs = Math.min(
      Math.floor(this._positions.length / 3),
      Math.floor(this._normals.length / this._stride),
    );

    this._bars = new BarsGeometry(Math.max(hairs, 1));
    this._bars.count = hairs;
    this._showPart(this._addPart(this._bars), hairs > 0);
    this.update();
  }

  /** Each hair's length; setting it redraws the hairs */
  get length() {
    return this._length;
  }
  set length(value) {
    if (value === this._length) return;
    this._length = value;
    this.update();
  }

  /** Redraws every hair from the positions and normals as they are now, after they were rewritten in place */
  update() {
    const positions = this._positions;
    const normals = this._normals;

    for (let i = 0; i < this._bars.count; i++) {
      const p = i * 3;
      const n = i * this._stride;
      const nx = normals[n];
      const ny = normals[n + 1];
      const nz = normals[n + 2];
      const size = Math.sqrt(nx * nx + ny * ny + nz * nz);
      // Each normal is normalised, so a quantized one's scale drops out; a zero one gives a hair that draws nothing.
      const scale = size > 0 ? this._length / size : 0;
      const x = positions[p];
      const y = positions[p + 1];
      const z = positions[p + 2];

      this._bars.setBar(
        i,
        x,
        y,
        z,
        x + nx * scale,
        y + ny * scale,
        z + nz * scale,
        this._radius,
      );
    }
    this._bars.update();

    return this;
  }

  /** Destroys its meshes and its own geometry */
  destroy(options) {
    if (this.destroyed) return;
    super.destroy(options);
    this._bars.destroy();
  }
}
