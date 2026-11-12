/**
 * Thin bars between pairs of points, all in one dynamic geometry: the line most 3D helpers draw with
 *
 * A bar is a capped six-sided prism, so it reads as a line from any side, and a bar whose far radius is 0 is a cone,
 * which is how an arrow's head joins its line in the same draw. The buffers are sized once for `capacity` bars and
 * written in place, so moving a bar every frame allocates nothing. A helper that needs more bars builds a bigger
 * `BarsGeometry` once and swaps its mesh's geometry.
 */

import { Geometry3D } from '@pixi/3d';

import { upNormals } from './helpers';

/** Sides round each bar */
const SIDES = 6;
/** Vertices per bar: a ring of sides at each end */
const BAR_VERTICES = SIDES * 2;
/** Indices per bar: two triangles per side and a fan of four on each cap */
const BAR_INDICES = (SIDES * 2 + (SIDES - 2) * 2) * 3;

/** Unit offsets round a ring, one per side */
const RING_COS = Array.from({ length: SIDES }, (_, k) =>
  Math.cos((k / SIDES) * Math.PI * 2),
);
const RING_SIN = Array.from({ length: SIDES }, (_, k) =>
  Math.sin((k / SIDES) * Math.PI * 2),
);

/** A geometry of `capacity` bars between point pairs, written in place with {@link BarsGeometry#setBar} */
export class BarsGeometry extends Geometry3D {
  /** How many bars the buffers hold */
  capacity = 0;
  _count = 0;

  /** Sizes the positions, normals and indices for `capacity` bars, all collapsed to nothing */
  constructor(capacity) {
    const vertices = capacity * BAR_VERTICES;

    super({
      positions: new Float32Array(vertices * 3),
      normals: upNormals(vertices),
      indices: barIndices(capacity, vertices > 65535),
      dynamic: true,
    });
    this.capacity = capacity;
  }

  /**
   * The bars in use, counted from the first
   *
   * Lowering it collapses the dropped bars onto one point, so they draw nothing; raising it leaves the new ones for
   * {@link BarsGeometry#setBar}. The index count stays the whole capacity. Call {@link BarsGeometry#update} after.
   */
  get count() {
    return this._count;
  }
  set count(value) {
    if (value < this._count)
      this.positions.fill(
        0,
        value * BAR_VERTICES * 3,
        this._count * BAR_VERTICES * 3,
      );
    this._count = value;
  }

  /**
   * Writes bar `i` from `a` to `b`, `radiusA` wide at `a` and `radiusB` at `b`
   *
   * `radiusB = 0` ends it in a point, for an arrow head. A bar of zero length collapses to nothing. Call
   * {@link BarsGeometry#update} once the frame's bars are written.
   */
  setBar(i, ax, ay, az, bx, by, bz, radiusA, radiusB = radiusA) {
    const positions = this.positions;
    const base = i * BAR_VERTICES * 3;
    let dx = bx - ax;
    let dy = by - ay;
    let dz = bz - az;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (length < 1e-9) {
      positions.fill(0, base, base + BAR_VERTICES * 3);

      return;
    }
    dx /= length;
    dy /= length;
    dz /= length;

    // u and v run square to the bar and to each other, with u × v along it, so each ring goes round anticlockwise
    // seen from b and the side triangles face out. u is the bar crossed with x, or with y for a bar near x.
    const alongX = Math.abs(dx) >= 0.9;
    let ux = alongX ? -dz : 0;
    let uy = alongX ? 0 : dz;
    let uz = alongX ? dx : -dy;
    const uLength = Math.sqrt(ux * ux + uy * uy + uz * uz);

    ux /= uLength;
    uy /= uLength;
    uz /= uLength;

    const vx = dy * uz - dz * uy;
    const vy = dz * ux - dx * uz;
    const vz = dx * uy - dy * ux;

    for (let k = 0; k < SIDES; k++) {
      const cos = RING_COS[k];
      const sin = RING_SIN[k];
      const ox = ux * cos + vx * sin;
      const oy = uy * cos + vy * sin;
      const oz = uz * cos + vz * sin;
      const o = base + k * 3;
      const p = o + SIDES * 3;

      positions[o] = ax + ox * radiusA;
      positions[o + 1] = ay + oy * radiusA;
      positions[o + 2] = az + oz * radiusA;
      positions[p] = bx + ox * radiusB;
      positions[p + 1] = by + oy * radiusB;
      positions[p + 2] = bz + oz * radiusB;
    }
  }

  /** Uploads what {@link BarsGeometry#setBar} and {@link BarsGeometry#count} wrote */
  update() {
    this.attributes.aPosition.buffer.update();
  }

  /** Frees the geometry and its buffers, which no other geometry shares */
  destroy() {
    super.destroy(true);
  }
}

/** Each bar's sides and two capping fans, ring a (vertices 0 to 5) facing back along the bar, ring b forward */
function barIndices(capacity, wide) {
  const indices = wide
    ? new Uint32Array(capacity * BAR_INDICES)
    : new Uint16Array(capacity * BAR_INDICES);
  let n = 0;

  for (let bar = 0; bar < capacity; bar++) {
    const a = bar * BAR_VERTICES;
    const b = a + SIDES;

    for (let k = 0; k < SIDES; k++) {
      const next = (k + 1) % SIDES;

      indices[n++] = a + k;
      indices[n++] = a + next;
      indices[n++] = b + k;
      indices[n++] = a + next;
      indices[n++] = b + next;
      indices[n++] = b + k;
    }
    for (let k = 1; k < SIDES - 1; k++) {
      indices[n++] = a;
      indices[n++] = a + k + 1;
      indices[n++] = a + k;
      indices[n++] = b;
      indices[n++] = b + k;
      indices[n++] = b + k + 1;
    }
  }

  return indices;
}
