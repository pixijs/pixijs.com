/**
 * The ring's slice through the ball: where each hair stands on the outline, and the two normals a material can light
 * it with there
 *
 * Each hair is a ray from the ball's centre across the plane that faces the camera, so the hairs fan round the outline
 * and every one is seen side on. Where a ray leaves the surface, the slice keeps that triangle's face normal, which
 * flat shading lights with, and its three vertex normals blended at that point, which smooth shading lights with.
 */

import { Vector3 } from '@pixi/3d';

const DEGREE = Math.PI / 180;
/** The ring starts just under the right side and runs over the top to the same height on the left, clear of the shadow */
const RING_FROM = -18 * DEGREE;
/** Close enough that each face the slice crosses at detail 1 gets a bundle of a few hairs */
const RING_STEP = 6 * DEGREE;
/** As many hairs as fit from `RING_FROM` over the top to its mirror on the left */
export const HAIR_COUNT = Math.round((Math.PI - 2 * RING_FROM) / RING_STEP) + 1;
/** The hair nearest straight up, the ring's top, which the tags stand on */
export const TOP_HAIR = Math.round((Math.PI / 2 - RING_FROM) / RING_STEP);

/** Three floats a hair, in the geometry's own space */

const _right = new Vector3();
const _upward = new Vector3();
const _ray = new Vector3();
const _a = new Vector3();
const _b = new Vector3();
const _c = new Vector3();
const _edge1 = new Vector3();
const _edge2 = new Vector3();
const _h = new Vector3();
const _s = new Vector3();
const _q = new Vector3();
const _normal = new Vector3();
const _vertexNormal = new Vector3();

export function createRingSlice() {
  return {
    roots: new Float32Array(HAIR_COUNT * 3),
    faceNormals: new Float32Array(HAIR_COUNT * 3),
    blendedNormals: new Float32Array(HAIR_COUNT * 3),
  };
}

/** Reads vertex `index` of an array with `stride` values a vertex into `out` */
function readVertex(array, index, stride, out) {
  return out.set(
    array[index * stride],
    array[index * stride + 1],
    array[index * stride + 2],
  );
}

/**
 * Slices `geometry`, a closed shape round its origin, in the plane facing `toCamera` (a unit vector in the geometry's
 * space), and writes each hair into `slice`
 */
export function sliceRing(geometry, toCamera, slice) {
  const { positions, normals, indices } = geometry;

  if (!normals) return;

  // A quantized geometry stores four values a normal; normalising the blend drops their scale.
  const normalStride = normals instanceof Int16Array ? 4 : 3;

  _right.set(0, 1, 0).cross(toCamera).normalize();
  _upward.copyFrom(toCamera).cross(_right);
  for (let i = 0; i < HAIR_COUNT; i++) {
    const angle = RING_FROM + i * RING_STEP;

    _ray
      .copyFrom(_right)
      .multiplyScalar(Math.cos(angle))
      .addScaledVector(_upward, Math.sin(angle));
    // Möller-Trumbore against each triangle, the ray starting at the origin: `h = ray × e2`, `s = origin − a` and
    // `q = s × e1` give the hit's barycentric `u` and `v` and its `distance` along the ray.
    for (let t = 0; t < indices.length; t += 3) {
      readVertex(positions, indices[t], 3, _a);
      readVertex(positions, indices[t + 1], 3, _b).subtract(_a, _edge1);
      readVertex(positions, indices[t + 2], 3, _c).subtract(_a, _edge2);
      _ray.cross(_edge2, _h);

      const det = _edge1.dot(_h);

      if (Math.abs(det) < 1e-9) continue;
      _a.negate(_s);

      const u = _s.dot(_h) / det;

      if (u < 0 || u > 1) continue;
      _s.cross(_edge1, _q);

      const v = _ray.dot(_q) / det;
      const distance = _edge2.dot(_q) / det;

      if (v < 0 || u + v > 1 || distance <= 0) continue;
      _ray.multiplyScalar(distance).toArray(slice.roots, i * 3);
      _edge1.cross(_edge2, _normal).normalize();
      // The winding may face it inward; a closed shape's outside is away from its centre.
      if (_normal.dot(_ray) < 0) _normal.negate();
      _normal.toArray(slice.faceNormals, i * 3);
      _normal.set(0, 0, 0);
      _normal.addScaledVector(
        readVertex(normals, indices[t], normalStride, _vertexNormal),
        1 - u - v,
      );
      _normal.addScaledVector(
        readVertex(normals, indices[t + 1], normalStride, _vertexNormal),
        u,
      );
      _normal.addScaledVector(
        readVertex(normals, indices[t + 2], normalStride, _vertexNormal),
        v,
      );
      _normal.normalize().toArray(slice.blendedNormals, i * 3);
      break;
    }
  }
}
