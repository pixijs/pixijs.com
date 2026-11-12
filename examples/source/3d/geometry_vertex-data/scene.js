/**
 * The mound's shape: a low-poly hill of rings round a peak, as the position, normal and index arrays a `Geometry3D`
 * takes, and the palette colour each of its vertices gets
 */

import { CLAY, DARK_ORANGE, mixColor } from './theme/palette';

/** The rim's radius and the peak's height, in scene units */
export const MOUND_RADIUS = 2.2;
const MOUND_HEIGHT = 1.5;
/** Rings round the peak; ring r holds 6r vertices, so 61 in all, few enough that the facets show */
const RINGS = 4;
const RING_SPACING = MOUND_RADIUS / RINGS;
/** How far an inner vertex's height strays, so neighbouring facets catch the light differently */
const JITTER = 0.06;
/** The first side of every ring starts on the front-right slope, 30° from +x towards +z */
const FIRST_SIDE = Math.PI / 6;
const SIDE = Math.PI / 3;
/**
 * One colour per side, from the front-right slope round towards +z: pink, then orange facing the camera, then purple.
 * The orange is the amber clay turns to on the dark theme: these bytes are baked once and can't follow the theme as
 * clay does, and the brand orange reads as a muddy salmon under the dark lights.
 */
const SIDE_COLORS = [
  CLAY.pink,
  DARK_ORANGE,
  CLAY.purple,
  CLAY.paleSky,
  CLAY.lilac,
  CLAY.sky,
];
/** The white cap fades to full colour between these shares of the way to the rim, so the first ring comes out pastel */
const CAP_FROM = 0.15;
const CAP_TO = 0.45;

/** The index of ring `r`'s vertex `k`, counting round from the front-right slope; ring 0 is the peak */
function vertexAt(r, k) {
  return r === 0 ? 0 : 1 + 3 * r * (r - 1) + (k % (6 * r));
}

/** Builds the mound: vertices ring by ring from the peak, triangles from each ring in to the one inside it */
export function createMoundShape() {
  const vertexCount = vertexAt(RINGS + 1, 0);
  const positions = new Float32Array(vertexCount * 3);
  const distances = new Float32Array(vertexCount);
  const angles = new Float32Array(vertexCount);
  const indices = [];

  for (let r = 0; r <= RINGS; r++) {
    const along = r / RINGS;

    for (let k = 0; k < Math.max(1, 6 * r); k++) {
      const i = vertexAt(r, k);
      const angle = r === 0 ? 0 : FIRST_SIDE + (SIDE * k) / r;
      // The peak and the rim stay true, so the mound has a point and its rim sits on the floor at exactly 0.
      const jitter =
        r === 0 || r === RINGS ? 0 : JITTER * Math.sin(i * 12.9898 + 4.1414);

      distances[i] = r * RING_SPACING;
      angles[i] = angle;
      positions[i * 3] = distances[i] * Math.cos(angle);
      positions[i * 3 + 1] = MOUND_HEIGHT * (1 - along * along) + jitter;
      positions[i * 3 + 2] = distances[i] * Math.sin(angle);
    }
  }

  // Each side of ring r has r outer vertices; it meets the r − 1 of the ring inside it in 2r − 1 triangles.
  for (let r = 1; r <= RINGS; r++) {
    for (let side = 0; side < 6; side++) {
      for (let s = 0; s < r; s++) {
        const outer = vertexAt(r, side * r + s);
        const nextOuter = vertexAt(r, side * r + s + 1);
        const inner = vertexAt(r - 1, side * (r - 1) + s);

        indices.push(outer, inner, nextOuter);
        if (s < r - 1)
          indices.push(
            inner,
            vertexAt(r - 1, side * (r - 1) + s + 1),
            nextOuter,
          );
      }
    }
  }

  return {
    positions,
    normals: vertexNormals(positions, indices),
    indices: new Uint16Array(indices),
    distances,
    angles,
    vertexCount,
  };
}

/** Each vertex's normal: the sum of the faces round it, normalised, so flat shading knows which side is out */
function vertexNormals(positions, indices) {
  const normals = new Float32Array(positions.length);

  for (let t = 0; t < indices.length; t += 3) {
    const a = indices[t] * 3;
    const b = indices[t + 1] * 3;
    const c = indices[t + 2] * 3;
    const ux = positions[b] - positions[a];
    const uy = positions[b + 1] - positions[a + 1];
    const uz = positions[b + 2] - positions[a + 2];
    const vx = positions[c] - positions[a];
    const vy = positions[c + 1] - positions[a + 1];
    const vz = positions[c + 2] - positions[a + 2];

    for (const v of [a, b, c]) {
      normals[v] += uy * vz - uz * vy;
      normals[v + 1] += uz * vx - ux * vz;
      normals[v + 2] += ux * vy - uy * vx;
    }
  }
  for (let v = 0; v < normals.length; v += 3) {
    const length = Math.hypot(normals[v], normals[v + 1], normals[v + 2]);

    normals[v] /= length;
    normals[v + 1] /= length;
    normals[v + 2] /= length;
  }

  return normals;
}

/**
 * The palette colour vertex `i` gets: its side's colour, washed to white near the peak, so the mound wears a white
 * cap over a pastel ring
 */
export function moundColor(shape, i) {
  const side =
    ((Math.round((shape.angles[i] - FIRST_SIDE) / SIDE) % 6) + 6) % 6;
  const along = shape.distances[i] / MOUND_RADIUS;
  const white = Math.min(
    1,
    Math.max(0, (CAP_TO - along) / (CAP_TO - CAP_FROM)),
  );

  return mixColor(SIDE_COLORS[side], CLAY.white, white);
}
