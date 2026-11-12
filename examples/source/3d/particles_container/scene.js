/** What the lesson needs but doesn't teach: the PixiJS logo's surface as a cloud of points */

import { Matrix4, seededRandom, Vector3 } from '@pixi/3d';

import { loadPixiLogo } from './theme/logo';

const _meshToLogo = new Matrix4();
const _corner = new Vector3();
const _ab = new Vector3();
const _ac = new Vector3();

/**
 * Loads the logo and samples `count` points spread evenly over its whole surface, front, sides and back, as x, y, z
 * triples in the logo's space, so the cloud keeps the logo's shape from any side. They come in random order, so any
 * first run of them covers the whole logo.
 */
export async function loadLogoPoints(count) {
  const logo = await loadPixiLogo({ material: 'source' });
  const points = sampleSurface(logo.meshes, count, seededRandom('logo-points'));

  // Only its surface was needed; the logo itself never joins the view.
  logo.destroy();

  return points;
}

/**
 * `count` random points on the meshes' triangles, each triangle getting a share in proportion to its area
 *
 * Picking vertices instead would crowd the points onto the curves, where the vertices are, and leave flat faces bare.
 */
function sampleSurface(meshes, count, random) {
  const corners = trianglesInLogoSpace(meshes);
  const triangles = corners.length / 9;
  // The surface's area up to the end of each triangle, so a random share of the total finds its triangle.
  const areaUpTo = new Float64Array(triangles);
  let total = 0;

  for (let t = 0; t < triangles; t++) {
    _corner.fromArray(corners, t * 9);
    _ab.fromArray(corners, t * 9 + 3).subtract(_corner);
    _ac.fromArray(corners, t * 9 + 6).subtract(_corner);
    total += _ab.cross(_ac).magnitude() / 2;
    areaUpTo[t] = total;
  }

  const points = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = firstAbove(areaUpTo, random() * total) * 9;
    // A uniform point in the triangle: the square root keeps the points from bunching at the first corner.
    const r1 = Math.sqrt(random());
    const r2 = random();
    const a = 1 - r1;
    const b = r1 * (1 - r2);
    const c = r1 * r2;

    for (let axis = 0; axis < 3; axis++) {
      points[i * 3 + axis] =
        corners[t + axis] * a +
        corners[t + 3 + axis] * b +
        corners[t + 6 + axis] * c;
    }
  }

  return points;
}

/** Every triangle's three corners, nine floats a triangle, in the logo's space */
function trianglesInLogoSpace(meshes) {
  const corners = [];

  for (const mesh of meshes) {
    const positions = mesh.geometry.positions;

    // The logo's glTF stores plain float positions; a quantized model would need decoding first.
    if (!(positions instanceof Float32Array))
      throw new Error(`Mesh '${mesh.label}' has quantized positions`);
    // The logo's root has no parent, so a mesh's global transform takes it into the logo's space.
    mesh.getGlobalTransform(_meshToLogo);
    for (const index of mesh.geometry.indices) {
      _corner.fromArray(positions, index * 3).applyAffineMatrix4(_meshToLogo);
      corners.push(_corner.x, _corner.y, _corner.z);
    }
  }

  return new Float32Array(corners);
}

/** The first index whose value is above `value`, by binary search on a rising list */
function firstAbove(list, value) {
  let lo = 0;
  let hi = list.length - 1;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;

    if (list[mid] > value) hi = mid;
    else lo = mid + 1;
  }

  return lo;
}
