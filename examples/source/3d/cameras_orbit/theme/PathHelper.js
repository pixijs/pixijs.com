/**
 * A thin line through points: an orbit ring, a trail, a spark's path, a wave, an arc from a ghost to where a shape
 * jumped. However many curves and dashes it holds, it's one {@link BarsGeometry} in one draw, written in place, so a
 * path rewritten every frame allocates nothing until it needs more bars than it has ever held.
 */

import { Vector3 } from '@pixi/3d';

import { BarsGeometry } from './BarsGeometry';
import { Helper } from './Helper';

import { HEAD_LENGTH, HEAD_WIDTH } from './helpers';

/** Options for {@link PathHelper} */

/** The stretch being drawn, as where it starts and its run to where it ends, and the ends of the bar being written */
const _from = new Vector3();
const _run = new Vector3();
const _a = new Vector3();
const _b = new Vector3();

/**
 * A line through points in its parent's space: {@link PathHelper#setPoints} draws a line, where a NaN `x` lifts the
 * pen so one helper draws many curves; {@link PathHelper#setSegments} draws separate point pairs;
 * {@link PathHelper#push} grows a trail that drops its oldest point past `capacity`.
 * @example
 * ```ts
 * const ring = new PathHelper({ closed: true, parent: orbitPivot }).setPoints(PathHelper.circle(2.5));
 * const trail = new PathHelper({ color: 'accent', capacity: 90, taper: true, parent: view3d.root });
 * app.ticker.add(() => trail.push(planet.position, 0.04));
 * ```
 */
export class PathHelper extends Helper {
  _closed;
  _dash;
  _period = 0;
  _taper;
  _head;
  _mesh;
  _bars;
  _thickness = 0.02;
  /** The points, xyz, oldest first; separate pairs have a NaN point after each */
  _points;
  _count = 0;
  /** Bars written by this build; past the geometry's capacity they're only counted */
  _used = 0;
  /** How far into the current dash and its gap the line has run; a solid line is one endless dash */
  _phase = 0;
  _shown = true;

  constructor({
    thickness = 0.02,
    capacity = 64,
    closed = false,
    dash = 0,
    gap = dash,
    taper = false,
    head = false,
    ...options
  } = {}) {
    super(options, 'ink');

    this._thickness = thickness;
    this._closed = closed;
    this._dash = dash > 0 && gap > 0 ? dash : Infinity;
    this._period = this._dash + gap;
    this._taper = taper;
    this._head = head;
    this._points = new Float32Array(capacity * 3);
    this._bars = new BarsGeometry(capacity + 1);
    this._mesh = this._addPart(this._bars);
    this._set(0);
  }

  /** The line's width; setting it rewrites the bars in place, for a resize rather than every frame */
  get thickness() {
    return this._thickness;
  }
  set thickness(value) {
    if (value === this._thickness) return;
    this._thickness = value;
    this._set(this._count);
  }

  /** Draws a line through the first `count` points of `xyz`, three numbers each; a NaN `x` lifts the pen */
  setPoints(xyz, count = Math.floor(xyz.length / 3)) {
    if (count * 3 > this._points.length)
      this._points = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) this._points[i] = xyz[i];

    return this._set(count);
  }

  /** Draws `count` separate segments, each a pair of points in `xyz`, for ticks, edges and spokes */
  setSegments(xyz, count = Math.floor(xyz.length / 6)) {
    if (count * 9 > this._points.length)
      this._points = new Float32Array(count * 9);
    for (let i = 0; i < count; i++) {
      for (let k = 0; k < 6; k++) this._points[i * 9 + k] = xyz[i * 6 + k];
      this._points[i * 9 + 6] = Number.NaN;
    }

    return this._set(count * 3);
  }

  /** Adds a point at the end, dropping the oldest past `capacity`; skips one within `minStep` of the last */
  push(point, minStep = 0) {
    const points = this._points;
    const last = (this._count - 1) * 3;

    if (
      last >= 0 &&
      _a.fromArray(points, last).distanceToSquared(point) < minStep * minStep
    )
      return this;
    if (this._count * 3 < points.length) this._count++;
    else points.copyWithin(0, 3);
    points[this._count * 3 - 3] = point.x;
    points[this._count * 3 - 2] = point.y;
    points[this._count * 3 - 1] = point.z;

    return this._set(this._count);
  }

  /** Removes every point, hiding the line */
  clear() {
    return this._set(0);
  }

  /** Frees its bars, after the base destroys its mesh */
  destroy(options) {
    if (this.destroyed) return;
    super.destroy(options);
    this._bars.destroy();
  }

  /**
   * `segments` points round local +y in the xz plane, from +x the way a positive `rotation.y` turns, for
   * {@link PathHelper#setPoints} with `closed: true`; pass `out` to fill an array you keep
   */
  static circle(radius, segments = 48, out = new Float32Array(segments * 3)) {
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;

      out[i * 3] = Math.cos(angle) * radius;
      out[i * 3 + 1] = 0;
      out[i * 3 + 2] = -Math.sin(angle) * radius;
    }

    return out;
  }

  /** Takes the first `count` points and writes every bar, growing the geometry once if they didn't fit */
  _set(count) {
    this._count = count;
    this._write();
    if (this._used > this._bars.capacity) {
      this._bars.destroy();
      this._bars = new BarsGeometry(
        Math.max(this._used, this._bars.capacity * 2),
      );
      this._mesh.geometry = this._bars;
      this._write();
    }
    this._bars.count = this._used;
    this._bars.update();
    if (this._used > 0 !== this._shown)
      this._showPart(this._mesh, (this._shown = !this._shown));

    return this;
  }

  _write() {
    const points = this._points;
    const n = this._count;

    this._used = 0;
    for (let start = 0, end = 0; start < n; start = ++end) {
      if (Number.isNaN(points[start * 3])) continue;
      while (end + 1 < n && !Number.isNaN(points[end * 3 + 3])) end++;

      // A pair is a segment, never a loop. A head takes the curve's last stretch, so the line stops where it starts.
      const loop = this._closed && end - start > 1;
      const length = this._head
        ? this._walk(start, end, loop, Infinity, false)
        : 0;
      const limit = this._head
        ? length - Math.min(this._thickness * HEAD_LENGTH, length / 2)
        : Infinity;

      this._walk(start, end, loop, limit, true);
    }
  }

  /** Walks a curve, drawing it if `draw`, up to `limit` along it, where its head starts; returns its length */
  _walk(start, end, loop, limit, draw) {
    const half = this._thickness / 2;
    const taper = this._taper ? half / Math.max(this._count - 1, 1) : 0;
    let walked = 0;

    this._phase = 0;
    for (let a = start; a < (loop ? end + 1 : end); a++) {
      const b = a === end ? start : a + 1;
      const radius = taper ? a * taper : half;
      const radiusRun = (taper ? b * taper : half) - radius;

      _from.fromArray(this._points, a * 3);
      _run.fromArray(this._points, b * 3).subtract(_from);

      const length = _run.magnitude();
      const t = length > 0 ? Math.min((limit - walked) / length, 1) : 1;

      walked += length * t;
      // The dashes run on along the whole curve, so short stretches still dash evenly. Solid is one endless dash.
      for (let done = 0; draw && done < length * t;) {
        const inDash = this._phase < this._dash;
        const step = Math.min(
          length * t - done,
          (inDash ? this._dash : this._period) - this._phase,
        );

        if (inDash && step > 1e-9)
          this._piece(done / length, (done + step) / length, radius, radiusRun);
        done += step;
        this._phase = (this._phase + step) % this._period;
      }
      if (t < 1) {
        _from.addScaledVector(_run, t);
        _run.fromArray(this._points, (loop ? start : end) * 3).subtract(_from);
        this._piece(
          0,
          1,
          (this._thickness * HEAD_WIDTH) / 2,
          (-this._thickness * HEAD_WIDTH) / 2,
        );
        break;
      }
    }

    return walked;
  }

  /** Writes the next bar, `u` to `v` of the way along the stretch, whose half width runs from `r` by `dr` */
  _piece(u, v, r, dr) {
    if (this._used < this._bars.capacity) {
      _a.copyFrom(_from).addScaledVector(_run, u);
      _b.copyFrom(_from).addScaledVector(_run, v);
      this._bars.setBar(
        this._used,
        _a.x,
        _a.y,
        _a.z,
        _b.x,
        _b.y,
        _b.z,
        r + dr * u,
        r + dr * v,
      );
    }
    this._used++;
  }
}
