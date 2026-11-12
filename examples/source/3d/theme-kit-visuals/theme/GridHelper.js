/**
 * A flat grid on the xz plane, centred on its origin: graph paper for coordinates, snapping and measured moves
 *
 * The inner lines are one {@link BarsGeometry} and the edge another, so the grid is one draw, or two with its outline,
 * at any size. The lines rest 0.002 above the plane, so the grid never fights a floor at the same height.
 */

import { BarsGeometry } from './BarsGeometry';
import { Helper } from './Helper';

/** A grid's size: one number for a square, or its width along x and depth along z */

/** Options for {@link GridHelper} */

/** How far the lines rest above the plane */
const LIFT = 0.002;

/** Half a grid's `width` along x or `depth` along z */
function half(size, side) {
  return (typeof size === 'number' ? size : size[side]) / 2;
}

/**
 * A grid of lines at multiples of `step` from its centre, with a solid edge
 *
 * `opacity` is the whole grid's, and `lines` the inner lines' share of it, so `grid.opacity = 0.5` halves both and
 * `muted` comes back to them. Number the lines with LabelLayer labels at multiples of `step`.
 * @example
 * ```ts
 * const grid = new GridHelper({ size: { width: 6, depth: 4 }, step: 0.5, parent: board });
 *
 * grid.step = 0.25; // rebuilds once
 * labels.add({ text: '1', node: grid, at: { x: 1, y: 0, z: 2.2 } });
 * ```
 */
export class GridHelper extends Helper {
  _thickness = 0;
  _inner;
  _innerBars;
  _edgeBars;
  _size;
  _step = 1;
  _lines = 0.35;
  _innerShown = true;

  constructor({
    size = 4,
    step = 1,
    lines = 0.35,
    outline = true,
    thickness = 0.01,
    ...options
  } = {}) {
    super(options, 'ink');

    this._size = size;
    this._step = step;
    this._lines = lines;
    this._thickness = thickness;
    this._edgeBars = outline ? new BarsGeometry(4) : null;
    // At least one bar, so a grid of size 0 never builds empty buffers.
    this._innerBars = new BarsGeometry(Math.max(this._innerCount(), 1));
    this._inner = this._addPart(this._innerBars, lines);
    if (this._edgeBars) this._addPart(this._edgeBars);
    this._build();
  }

  /** One number for a square, or its width along x and depth along z; setting it rebuilds the grid once */
  get size() {
    return this._size;
  }
  set size(value) {
    this._size = value;
    this._build();
  }

  /** The spacing of the lines, which run at multiples of it from the centre; setting it rebuilds the grid once */
  get step() {
    return this._step;
  }
  set step(value) {
    if (value === this._step) return;
    this._step = value;
    this._build();
  }

  /** The inner lines' share of the grid's opacity, 0 to 1 */
  get lines() {
    return this._lines;
  }
  set lines(value) {
    if (value === this._lines) return;
    this._lines = value;
    this._setShade(this._inner, value);
  }

  /** Frees its bars, after the base destroys its meshes */
  destroy(options) {
    if (this.destroyed) return;
    super.destroy(options);
    this._innerBars.destroy();
    this._edgeBars?.destroy();
  }

  _build() {
    const r = this._thickness / 2;
    const y = LIFT + r;
    const w = half(this._size, 'width');
    const d = half(this._size, 'depth');
    // With an edge, the inner lines stop at it rather than running under it, and the lines on it are the edge's.
    const end = this._edgeBars ? r : 0;
    const across = this._lineCount(w);
    const along = this._lineCount(d);
    const count = this._innerCount();

    if (count > this._innerBars.capacity) {
      this._innerBars.destroy();
      this._innerBars = new BarsGeometry(count);
      this._inner.geometry = this._innerBars;
    }

    const bars = this._innerBars;
    let used = 0;

    for (let k = -across; k <= across; k++)
      bars.setBar(
        used++,
        k * this._step,
        y,
        end - d,
        k * this._step,
        y,
        d - end,
        r,
      );
    for (let k = -along; k <= along; k++)
      bars.setBar(
        used++,
        end - w,
        y,
        k * this._step,
        w - end,
        y,
        k * this._step,
        r,
      );
    bars.count = used;
    bars.update();
    if (used > 0 !== this._innerShown)
      this._showPart(this._inner, (this._innerShown = used > 0));

    const edge = this._edgeBars;

    if (!edge) return;
    // Each edge runs half a line's width past both corners, so the corners close.
    edge.setBar(0, -w - r, y, -d, w + r, y, -d, r);
    edge.setBar(1, -w - r, y, d, w + r, y, d, r);
    edge.setBar(2, -w, y, -d - r, -w, y, d + r, r);
    edge.setBar(3, w, y, -d - r, w, y, d + r, r);
    edge.count = 4;
    edge.update();
  }

  /** The inner lines the size and step make: those across x, then those along z, each side's and the centre's */
  _innerCount() {
    return (
      Math.max(this._lineCount(half(this._size, 'width')) * 2 + 1, 0) +
      Math.max(this._lineCount(half(this._size, 'depth')) * 2 + 1, 0)
    );
  }

  /** How many lines sit on each side of the centre within `extent`, leaving the edge to the outline if there is one */
  _lineCount(extent) {
    const lines = Math.floor(extent / this._step + 1e-6);

    return this._edgeBars && lines * this._step > extent - 1e-6
      ? lines - 1
      : lines;
  }
}
