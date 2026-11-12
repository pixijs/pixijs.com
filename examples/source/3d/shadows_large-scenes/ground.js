/**
 * Straight-line math over the ground for the visuals: scaling a `GroundLinear`, turning one into an edge a grid patch
 * keeps to, and finding where a view depth crosses the road
 */

import { ROAD } from './scene';

const _edge = { x: 0, z: 0, c: 0 };
/** The stretch of a line still kept, from and to, as a clip narrows it */
const _span = new Float64Array(2);

/** `f` times `s`, into `out` */
export function scaled(out, f, s) {
  out.x = f.x * s;
  out.z = f.z * s;
  out.c = f.c * s;

  return out;
}

/** An edge that keeps where `f ≥ value` (`sign` 1) or where `f ≤ value` (`sign` −1); shared, so use it at once */
export function side(f, sign, value) {
  _edge.x = sign * f.x;
  _edge.z = sign * f.z;
  _edge.c = sign * (f.c - value);

  return _edge;
}

/**
 * Where the ground at view depth `d` crosses the road, into `a` and `b`, `b` on the camera's right; false when it
 * misses the road. `depth` is the camera's view depth over the ground.
 */
export function crossRoad(depth, d, a, b) {
  const g2 = depth.x * depth.x + depth.z * depth.z;

  if (g2 < 1e-12) return false;

  // The line's point nearest the origin, and its direction, square to the way depth grows.
  const k = (d - depth.c) / g2;
  const px = depth.x * k;
  const pz = depth.z * k;

  _span[0] = -Infinity;
  _span[1] = Infinity;
  if (
    !clipSpan(px, -depth.z, -ROAD.halfWidth, ROAD.halfWidth) ||
    !clipSpan(pz, depth.x, ROAD.far, ROAD.near)
  ) {
    return false;
  }
  a.set(px - depth.z * _span[0], 0, pz + depth.x * _span[0]);
  b.set(px - depth.z * _span[1], 0, pz + depth.x * _span[1]);

  return true;
}

/** Narrows `_span`, the stretch of `p + t · d` kept, to where it lies from `lo` to `hi`; false once none is left */
function clipSpan(p, d, lo, hi) {
  if (Math.abs(d) < 1e-12) return p >= lo && p <= hi;

  const t0 = (lo - p) / d;
  const t1 = (hi - p) / d;

  _span[0] = Math.max(_span[0], Math.min(t0, t1));
  _span[1] = Math.min(_span[1], Math.max(t0, t1));

  return _span[0] < _span[1];
}
