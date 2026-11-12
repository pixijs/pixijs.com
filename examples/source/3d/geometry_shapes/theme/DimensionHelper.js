/**
 * A measured span drawn like a technical drawing's: a bar between two points, a tick square to it at each end, and
 * shorter ticks between, for a size, a distance or a range
 *
 * It's one {@link BarsGeometry} drawn in one call. {@link DimensionHelper#set} rebuilds it only when something it
 * reads has changed since the last call, so calling it every frame costs a few comparisons.
 */

import { Vector3 } from '@pixi/3d';

import { BarsGeometry } from './BarsGeometry';
import { Helper } from './Helper';

/** Options for {@link DimensionHelper} */

/** A short tick's length, in end ticks */
const INNER_TICK = 0.5;
/** What the ticks stand along when the span runs along `across`, +x first, so a height's ticks read from the front */
const FALLBACKS = [
  { x: 1, y: 0, z: 0 },
  { x: 0, y: 0, z: 1 },
];
const _span = new Vector3();
const _side = new Vector3();

/**
 * A span between two points in its parent's space, with end ticks and even or chosen ticks between
 *
 * `divisions`, `ticks` and `across` are read on the next {@link DimensionHelper#set}. Tag it at `middle`.
 * @example
 * ```ts
 * const width = new DimensionHelper({ tick: 0.12, divisions: 4, parent: group });
 *
 * width.set({ x: -0.9, y: -0.3, z: 0 }, { x: 0.9, y: -0.3, z: 0 });
 * labels.add({ text: 'width = 1.80', node: group, at: width.middle, offset: { x: 0, y: 18 } });
 * ```
 */
export class DimensionHelper extends Helper {
  /** Equal parts the span splits into, with a short tick between each: `divisions - 1` of them */
  divisions = 1;
  /** Fractions 0 to 1 along the span for the short ticks, in place of the even ones; `null` uses `divisions` */
  ticks;
  /** The direction the ticks stand along, +y by default; copy into it. A span along it falls back to +x, then +z */
  across = new Vector3();
  /** The span's middle, in the parent's space, for its tag */
  middle = new Vector3();
  _radius = 0;
  _tick = 0;
  _mesh;
  _bars;
  /** What the last {@link DimensionHelper#set} drew, to tell whether the next one changes anything */
  _from = new Vector3(Number.NaN);
  _to = new Vector3();
  _drawnAcross = new Vector3();
  _drawnTicks = [];
  _drawnDivisions = 0;
  /** Whether the last set drew from `ticks`, rather than `divisions` */
  _drawnFromTicks = false;
  _shown = true;

  constructor({
    thickness = 0.02,
    tick = 0.12,
    divisions = 1,
    ticks = null,
    across = { x: 0, y: 1, z: 0 },
    ...options
  } = {}) {
    super(options, 'ink');

    this._radius = thickness / 2;
    this._tick = tick;
    this.divisions = divisions;
    this.ticks = ticks;
    this.across.copyFrom(across);
    this._bars = new BarsGeometry(
      3 + Math.max(ticks?.length ?? divisions - 1, 0),
    );
    this._mesh = this._addPart(this._bars);
    this._show(false);
  }

  /** Runs the span from `from` to `to`, in the parent's space, rebuilding it only when an end or a setting changed */
  set(from, to) {
    if (!this._changed(from, to)) return this;
    this._from.copyFrom(from);
    this._to.copyFrom(to);
    this._drawnAcross.copyFrom(this.across);
    this._drawnDivisions = this.divisions;
    this._drawnFromTicks = this.ticks !== null;
    this._drawnTicks.length = 0;
    if (this.ticks)
      for (const fraction of this.ticks) this._drawnTicks.push(fraction);
    this.middle.copyFrom(from).add(to).multiplyScalar(0.5);
    this._build();

    return this;
  }

  /** Frees its bars, after the base destroys its mesh */
  destroy(options) {
    if (this.destroyed) return;
    super.destroy(options);
    this._bars.destroy();
  }

  _changed(from, to) {
    const ticks = this.ticks;

    if (
      !this._from.equals(from) ||
      !this._to.equals(to) ||
      !this._drawnAcross.equals(this.across)
    )
      return true;
    if (
      this.divisions !== this._drawnDivisions ||
      (ticks !== null) !== this._drawnFromTicks
    )
      return true;
    if (ticks === null) return false;
    if (ticks.length !== this._drawnTicks.length) return true;
    for (let i = 0; i < ticks.length; i++)
      if (ticks[i] !== this._drawnTicks[i]) return true;

    return false;
  }

  _build() {
    const from = this._from;
    const length = _span.copyFrom(this._to).subtract(from).magnitude();

    if (length < 1e-9) {
      this._show(false);

      return;
    }

    const ticks = this.ticks;
    const inner = Math.max(ticks?.length ?? this.divisions - 1, 0);

    if (3 + inner > this._bars.capacity) {
      this._bars.destroy();
      this._bars = new BarsGeometry(3 + inner);
      this._mesh.geometry = this._bars;
    }

    const bars = this._bars;
    const r = this._radius;

    // The ticks stand along `across` squared to the span; a span that runs along it falls back to +x, then +z.
    let side = this._squareSide(this.across);

    for (let i = 0; side < 1e-6 && i < FALLBACKS.length; i++)
      side = this._squareSide(FALLBACKS[i]);
    _side.multiplyScalar(this._tick / 2 / side);
    bars.setBar(
      0,
      from.x,
      from.y,
      from.z,
      this._to.x,
      this._to.y,
      this._to.z,
      r,
    );
    this._tickAt(0, 1, 1);
    this._tickAt(1, 1, 2);
    for (let i = 0; i < inner; i++)
      this._tickAt(
        ticks ? ticks[i] : (i + 1) / this.divisions,
        INNER_TICK,
        3 + i,
      );
    bars.count = 3 + inner;
    bars.update();
    this._show(true);
  }

  /** Sets `_side` to `direction`'s part square to the span, and returns how long that is */
  _squareSide(direction) {
    return _side
      .copyFrom(direction)
      .addScaledVector(_span, -_span.dot(direction) / _span.magnitudeSquared())
      .magnitude();
  }

  /** Writes bar `i`, a tick `size` end ticks long, `fraction` of the way along the span */
  _tickAt(fraction, size, i) {
    const x = this._from.x + _span.x * fraction;
    const y = this._from.y + _span.y * fraction;
    const z = this._from.z + _span.z * fraction;
    const sx = _side.x * size;
    const sy = _side.y * size;
    const sz = _side.z * size;

    this._bars.setBar(
      i,
      x - sx,
      y - sy,
      z - sz,
      x + sx,
      y + sy,
      z + sz,
      this._radius,
    );
  }

  _show(shown) {
    if (shown === this._shown) return;
    this._shown = shown;
    this._showPart(this._mesh, shown);
  }
}
