/** SurfaceShape: an emitter shape that starts particles on a mesh's surface, heading out from it */

import { Matrix4, seededRandom, Vector3 } from '@pixi/3d';

/** Enough that a 0.2-wide strip of the logo holds several hundred points, in 480 KB */
const DEFAULT_POINTS = 20_000;

const _toSpace = new Matrix4();
const _meshToSpace = new Matrix4();
const _corner = new Vector3();
const _ab = new Vector3();
const _ac = new Vector3();
const _normal = new Vector3();

/**
 * Starts each particle at a random point on the meshes' surface, heading straight out of the face it's on
 *
 * A random point on a mesh means a triangle picked in proportion to its area, then a point inside it. Picking a
 * vertex instead would crowd the points onto edges and curves, where the vertices are, and leave big flat faces
 * bare. That's a search over every triangle, too slow to run for every spark, so the constructor does it `points`
 * times up front and keeps the answers sorted along x, and `sample` is a lookup that never allocates, as
 * `EmitterShape` asks. The sort makes the strip past `front` one run of the list. Leave `front` and `strip` unset to
 * emit from the whole surface.
 *
 * It reads indexed triangle lists with float xyz positions, and expects faces that wind counter-clockwise, as glTF's
 * do.
 */
export class SurfaceShape {
  /** Each point's x, y and z in `space`, sorted by x */
  positions;
  /** The outward unit normal of each point's face */
  normals;
  /** The width along x of the band past `front` that emits */
  strip = 0;
  _front = 0;
  _first = 0;
  _count = 0;

  constructor({
    meshes,
    space,
    points = DEFAULT_POINTS,
    strip = Infinity,
    random = seededRandom('surface'),
  }) {
    const corners = collectTriangles(meshes, space);
    const areas = runningAreas(corners);
    const baked = new Float32Array(points * 3);
    const bakedNormals = new Float32Array(points * 3);

    for (let i = 0; i < points; i++)
      bakePoint(corners, areas, random, baked, bakedNormals, i);

    const order = Array.from({ length: points }, (_, i) => i).sort(
      (p, q) => baked[p * 3] - baked[q * 3],
    );

    this.positions = new Float32Array(points * 3);
    this.normals = new Float32Array(points * 3);
    order.forEach((from, to) => {
      for (let k = 0; k < 3; k++) {
        this.positions[to * 3 + k] = baked[from * 3 + k];
        this.normals[to * 3 + k] = bakedNormals[from * 3 + k];
      }
    });
    this.strip = strip;
    this.front = -Infinity;
  }

  /** The x the emitting strip starts at, in `space`; it reaches `strip` further along x */
  get front() {
    return this._front;
  }
  set front(x) {
    const total = this.positions.length / 3;
    // An infinite strip reaches the end of the list; `-Infinity + Infinity` would be NaN.
    const end =
      this.strip === Infinity
        ? total
        : firstPast(this.positions, x + this.strip, 3);
    const first = firstPast(this.positions, x, 3);

    this._front = x;
    // Counted before the clamp, so a strip past the last point holds none rather than one.
    this._count = Math.max(end - first, 0);
    this._first = Math.min(first, total - 1);
  }

  /** The first point in the strip, counted in points into `positions` */
  get stripFirst() {
    return this._first;
  }

  /** How many points the strip holds; 0 when it's past the surface at either end */
  get stripCount() {
    return this._count;
  }

  sample(rng, outPos, outDir) {
    const i = this._first + Math.floor(rng() * this._count);

    outPos.fromArray(this.positions, i * 3);
    outDir.fromArray(this.normals, i * 3);
  }
}

/** Every triangle corner of the meshes, nine floats a triangle, in `space`'s coordinates */
export function collectTriangles(meshes, space) {
  const positions = meshes.map(floatPositions);
  const corners = new Float32Array(
    meshes.reduce((size, mesh) => size + mesh.geometry.indices.length * 3, 0),
  );
  let at = 0;

  _toSpace.getInverse(space.getGlobalTransform(_toSpace));
  for (let m = 0; m < meshes.length; m++) {
    // A node's transform doesn't project, so the cheaper affine apply skips the divide `applyMatrix4` does.
    meshes[m].getGlobalTransform(_meshToSpace).premultiply(_toSpace);
    for (const index of meshes[m].geometry.indices) {
      _corner
        .fromArray(positions[m], index * 3)
        .applyAffineMatrix4(_meshToSpace)
        .toArray(corners, at);
      at += 3;
    }
  }

  return corners;
}

/** A mesh's vertex positions, once it's checked they're the indexed, packed float xyz that the bake reads */
function floatPositions(mesh) {
  const { geometry } = mesh;
  const { format, stride = 12, offset = 0 } = geometry.attributes.aPosition;
  // The raw buffer: not floats for a quantized geometry, and every attribute for an interleaved one.
  const positions = geometry.positions;

  if (
    geometry.topology !== 'triangle-list' ||
    !geometry.indexBuffer ||
    !(positions instanceof Float32Array) ||
    format !== 'float32x3' ||
    stride !== 12 ||
    offset !== 0
  ) {
    throw new Error(
      `SurfaceShape reads indexed triangle lists with packed float xyz positions; mesh '${mesh.label}' isn't one`,
    );
  }

  return positions;
}

/** The surface's area up to the end of each triangle */
function runningAreas(corners) {
  const areas = new Float64Array(corners.length / 9);
  let total = 0;

  for (let t = 0; t < areas.length; t++) {
    edges(corners, t);
    total += _ab.cross(_ac, _normal).magnitude() / 2;
    areas[t] = total;
  }

  return areas;
}

/** Writes point `index`: a triangle picked by area, a uniform point inside it, and its face's outward normal */
function bakePoint(corners, areas, random, positions, normals, index) {
  const t = firstPast(areas, random() * areas[areas.length - 1]);
  let u = random();
  let v = random();

  // A point past the unit square's diagonal folds back, so points are uniform over the triangle.
  if (u + v > 1) {
    u = 1 - u;
    v = 1 - v;
  }

  edges(corners, t);
  _corner
    .addScaledVector(_ab, u)
    .addScaledVector(_ac, v)
    .toArray(positions, index * 3);
  // Faces wind counter-clockwise, so this points out.
  _ab
    .cross(_ac, _normal)
    .normalize()
    .toArray(normals, index * 3);
}

/** Sets `_corner` to triangle `t`'s first corner, and `_ab` and `_ac` to its two edges from there */
function edges(corners, t) {
  const a = t * 9;

  _corner.fromArray(corners, a);
  _ab.fromArray(corners, a + 3).subtract(_corner);
  _ac.fromArray(corners, a + 6).subtract(_corner);
}

/** The first element over `value` in a list sorted ascending, reading every `stride`-th entry; the count if none is */
function firstPast(sorted, value, stride = 1) {
  let low = 0;
  let high = sorted.length / stride;

  while (low < high) {
    const middle = (low + high) >> 1;

    if (sorted[middle * stride] > value) high = middle;
    else low = middle + 1;
  }

  return low;
}
