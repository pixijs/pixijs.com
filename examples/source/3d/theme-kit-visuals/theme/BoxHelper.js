/**
 * A box's twelve edges, for bounds, hit volumes and fitting boxes, with optional see-through faces
 *
 * The edges are one {@link BarsGeometry}, one draw, rewritten in place by {@link BoxHelper#setBox}. They lie just
 * outside the box, so a model that fills it shows whole, and a frame round a frame nests. A `fill` above 0 adds the
 * faces, see-through, as one more draw; WebGPU keeps that draw, empty, at 0 too.
 */

import { Vector3 } from '@pixi/3d';

import { BarsGeometry } from './BarsGeometry';
import { Helper } from './Helper';

import { helperGeometry } from './helpers';

/** Options for {@link BoxHelper} */

/** The axis each group of four edges runs along, and for each axis the two it lies across */
const AXES = ['x', 'y', 'z'];
const ACROSS_U = { x: 'y', y: 'z', z: 'x' };
const ACROSS_V = { x: 'z', y: 'x', z: 'y' };
const _low = new Vector3();
const _high = new Vector3();
const _a = new Vector3();
const _b = new Vector3();

/** A box's edges as bars, with optional see-through faces; one draw, two with a fill (two either way on WebGPU) */
export class BoxHelper extends Helper {
  _bars = new BarsGeometry(12);
  _faces;
  _thickness = 0.03;
  _fill = 0;

  constructor({ thickness = 0.03, fill = 0, ...options } = {}) {
    super(options, 'ink');

    this._thickness = thickness;
    this._fill = fill;
    this._bars.count = 12;
    this._addPart(this._bars);
    this._faces = this._addPart(helperGeometry('bar'), fill);
    this._faces.scale.set(0);
    this._showPart(this._faces, fill > 0);
  }

  /** The faces' opacity, as a share of the helper's; 0 hides them */
  get fill() {
    return this._fill;
  }
  set fill(value) {
    if (value === this._fill) return;
    this._fill = value;
    this._setShade(this._faces, value);
    this._showPart(this._faces, value > 0);
  }

  /** Frames `box`, given in the parent's space */
  setBox(box) {
    const half = this._thickness / 2;

    // Each edge runs half a bar outside the box's faces, and half a bar past each corner, so the corners close.
    _low.set(box.min.x - half, box.min.y - half, box.min.z - half);
    _high.set(box.max.x + half, box.max.y + half, box.max.z + half);
    for (let i = 0; i < 12; i++) {
      const along = AXES[i >> 2];
      const u = ACROSS_U[along];
      const v = ACROSS_V[along];

      _a[u] = _b[u] = i & 1 ? _high[u] : _low[u];
      _a[v] = _b[v] = i & 2 ? _high[v] : _low[v];
      _a[along] = _low[along] - half;
      _b[along] = _high[along] + half;
      this._bars.setBar(i, _a.x, _a.y, _a.z, _b.x, _b.y, _b.z, half);
    }
    this._bars.update();
    this._faces.position.set(
      (box.min.x + box.max.x) / 2,
      (box.min.y + box.max.y) / 2,
      (box.min.z + box.max.z) / 2,
    );
    this._faces.scale.set(
      box.max.x - box.min.x,
      box.max.y - box.min.y,
      box.max.z - box.min.z,
    );

    return this;
  }

  /** Destroys its meshes and its edge geometry */
  destroy(options) {
    if (this.destroyed) return;
    super.destroy(options);
    this._bars.destroy();
  }
}
