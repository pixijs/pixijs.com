/**
 * The rounded clay shapes of the pixijs.com/3d hero, and a rounded box and cylinder
 *
 * The engine's primitives have hard edges; clay needs rolled ones. Every shape is about a unit across, so one
 * instance scale reads as "size" for all of them. UVs are unique across each surface, so a texture painted at a
 * hit's UV lands in one place: lathed shapes run u round the axis and v along the profile by arc length, and
 * flat-faced shapes give each face its own cell of an atlas.
 */

import { Geometry3D } from '@pixi/3d';

/** The seven clay shapes, in the order a crowd's geometry slots use */
export const CLAY_SHAPES = [
  'cube',
  'capsule',
  'sphere',
  'puck',
  'pyramid',
  'octahedron',
  'torus',
];

/**
 * How finely the shapes are cut
 *
 * `'high'` (1,560 to 3,072 indices a shape) is for hero shapes a viewer looks at; `'low'` (108 to 324) is for
 * crowds of tens of thousands of small ones, where vertices are what costs.
 */

const CUBE_SIZE = 0.8;

/** Each lathed shape's profile, cut with `steps` segments round each curve */
const PROFILES = {
  capsule: (steps) => capsuleProfile(0.23, 0.5, steps),
  sphere: (steps) => sphereProfile(0.45, steps),
  puck: (steps) => roundedCylinderProfile(0.4, 0.6, 0.11, steps),
  torus: (steps) => torusProfile(0.325, 0.155, steps),
};

/** The high-detail profiles, which the UV tables at the end of the file also measure */
const HIGH_PROFILES = {
  capsule: PROFILES.capsule(6),
  sphere: PROFILES.sphere(14),
  puck: PROFILES.puck(4),
  torus: PROFILES.torus(16),
};

const BUILDERS = {
  high: {
    cube: () => roundedBox(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 0.15, 3),
    capsule: () => lathe(HIGH_PROFILES.capsule, 20),
    sphere: () => lathe(HIGH_PROFILES.sphere, 24),
    puck: () => lathe(HIGH_PROFILES.puck, 28),
    pyramid: () => roundedPolyhedron(PYRAMID, 0.07, 12),
    octahedron: () => roundedPolyhedron(OCTAHEDRON, 0.1, 10),
    torus: () => lathe(HIGH_PROFILES.torus, 32),
  },
  low: {
    cube: () => roundedBox(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 0.15, 1),
    capsule: () => lathe(PROFILES.capsule(2), 8),
    sphere: () => lathe(PROFILES.sphere(5), 8),
    puck: () => lathe(PROFILES.puck(1), 8),
    pyramid: () => roundedPolyhedron(PYRAMID, 0.07, 3),
    octahedron: () => roundedPolyhedron(OCTAHEDRON, 0.1, 3),
    torus: () => lathe(PROFILES.torus(5), 8),
  },
};

const cache = new Map();

/**
 * The shared geometry for one clay shape, built on first use
 *
 * The kit owns these: don't destroy them yourself. Call {@link releaseClayGeometries} in your teardown, after
 * `view3d.unload()`. Every shape is an indexed triangle list with its bounds filled in, so `hitVolume: 'geometry'`
 * works on it.
 * @param shape - Which shape.
 * @param detail - How finely it's cut.
 */
export function clayGeometry(shape, detail = 'high') {
  const key = `${shape}:${detail}`;
  let geometry = cache.get(key);

  if (!geometry) {
    geometry = BUILDERS[detail][shape]();
    cache.set(key, geometry);
  }

  return geometry;
}

/** Destroys every cached clay geometry; the next {@link clayGeometry} call builds afresh */
export function releaseClayGeometries() {
  for (const geometry of cache.values()) geometry.destroy(true);
  cache.clear();
}

/**
 * A box with every edge and corner rolled to `radius`
 *
 * Each face is a grid whose middle is one flat quad and whose rim steps round the roll, so a big flat box costs
 * no more than a small one. Its UVs are a 3 × 2 atlas, one cell a face (+x, -x, +y, -y, +z, -z). The caller owns
 * the result.
 * @param width - Size along x.
 * @param height - Size along y.
 * @param depth - Size along z.
 * @param radius - Roll radius, clamped to half the smallest side.
 * @param steps - Segments round each 45° of roll.
 */
export function roundedBox(width, height, depth, radius, steps = 4) {
  const half = [width / 2, height / 2, depth / 2];
  const r = Math.max(1e-4, Math.min(radius, half[0], half[1], half[2]));
  const inner = half.map((h) => h - r);
  const samples = inner.map((edge) => {
    const out = [];

    for (let i = 0; i <= steps; i++)
      out.push(-edge - r * Math.tan((Math.PI / 4) * (1 - i / steps)));
    for (let i = edge > 0 ? 0 : 1; i <= steps; i++)
      out.push(edge + r * Math.tan((Math.PI / 4) * (i / steps)));

    return out;
  });
  // Normal axis, its sign, and the two in-plane axes ordered so u × v points outward.
  const faces = [
    [0, 1, 1, 2],
    [0, -1, 2, 1],
    [1, 1, 2, 0],
    [1, -1, 0, 2],
    [2, 1, 0, 1],
    [2, -1, 1, 0],
  ];
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];
  const p = [0, 0, 0];

  for (let face = 0; face < faces.length; face++) {
    const [n, sign, u, v] = faces[face];
    const us = samples[u];
    const vs = samples[v];
    const base = positions.length / 3;

    for (let j = 0; j < vs.length; j++) {
      for (let i = 0; i < us.length; i++) {
        p[n] = sign * half[n];
        p[u] = us[i];
        p[v] = vs[j];

        let length = 0;

        for (let k = 0; k < 3; k++) {
          const d = p[k] - Math.max(-inner[k], Math.min(inner[k], p[k]));

          length += d * d;
        }
        length = Math.sqrt(length);

        for (let k = 0; k < 3; k++) {
          const c = Math.max(-inner[k], Math.min(inner[k], p[k]));
          const normal = (p[k] - c) / length;

          positions.push(c + normal * r);
          normals.push(normal);
        }
        uvs.push(
          atlasU(face, 3, (us[i] + half[u]) / (2 * half[u])),
          atlasV(face, 3, 2, (vs[j] + half[v]) / (2 * half[v])),
        );
      }
    }

    const columns = us.length;

    for (let j = 0; j < vs.length - 1; j++) {
      for (let i = 0; i < columns - 1; i++) {
        const p00 = base + j * columns + i;
        const p10 = p00 + 1;
        const p01 = p00 + columns;
        const p11 = p01 + 1;

        indices.push(p00, p10, p11, p00, p11, p01);
      }
    }
  }

  return new Geometry3D({
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    uvs: new Float32Array(uvs),
    indices: new Uint16Array(indices),
  });
}

/**
 * A cylinder with flat caps and a rolled rim, like the clay puck but sized freely, e.g. for a pedestal
 *
 * UVs run round the axis and along the profile by arc length. The caller owns the result.
 * @param radius - Radius of the widest part.
 * @param height - Full height.
 * @param edge - Radius of the rolled rim, clamped to fit.
 * @param segments - Facets round the axis.
 * @param edgeSteps - Segments round each rim's quarter turn.
 */
export function roundedCylinder(
  radius,
  height,
  edge,
  segments = 64,
  edgeSteps = 6,
) {
  const rim = Math.max(1e-4, Math.min(edge, radius, height / 2));

  return lathe(
    roundedCylinderProfile(radius, height, rim, edgeSteps),
    segments,
  );
}

/** Space left round each atlas cell, as a share of the cell, so painting near an edge doesn't bleed across */
const ATLAS_GUTTER = 0.03;

function atlasU(cell, columns, u) {
  return (
    ((cell % columns) + ATLAS_GUTTER + u * (1 - 2 * ATLAS_GUTTER)) / columns
  );
}

function atlasV(cell, columns, rows, v) {
  return (
    (Math.floor(cell / columns) + ATLAS_GUTTER + v * (1 - 2 * ATLAS_GUTTER)) /
    rows
  );
}

/** A lathe profile point: radius and height, and the outward normal in that half-plane */

/** Cumulative arc length at each profile point */
function arcLengths(profile) {
  const out = [0];

  for (let p = 1; p < profile.length; p++) {
    out.push(
      out[p - 1] +
        Math.hypot(
          profile[p][0] - profile[p - 1][0],
          profile[p][1] - profile[p - 1][1],
        ),
    );
  }

  return out;
}

/** Length round the lathe at the profile's arc midpoint over the profile's length */
function profileAspect(profile) {
  const lengths = arcLengths(profile);
  const total = lengths[lengths.length - 1];
  const middle = lengths.findIndex((length) => length >= total / 2);

  return (Math.PI * 2 * profile[Math.max(0, middle)][0]) / total;
}

function arc(out, cr, cy, radius, from, to, steps) {
  for (let i = 0; i <= steps; i++) {
    const angle = from + ((to - from) * i) / steps;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    out.push([cr + cos * radius, cy + sin * radius, cos, sin]);
  }
}

function sphereProfile(radius, rings) {
  const out = [];

  arc(out, 0, 0, radius, Math.PI / 2, -Math.PI / 2, rings);

  return out;
}

/** A pill: two hemispheres joined by a straight side `length` long */
function capsuleProfile(radius, length, capRings) {
  const out = [];

  arc(out, 0, length / 2, radius, Math.PI / 2, 0, capRings);
  arc(out, 0, -length / 2, radius, 0, -Math.PI / 2, capRings);

  return out;
}

/** A puck with flat caps and a rolled rim of radius `edge` */
function roundedCylinderProfile(radius, height, edge, edgeRings) {
  const half = height / 2;
  const out = [[0, half, 0, 1]];

  arc(out, radius - edge, half - edge, edge, Math.PI / 2, 0, edgeRings);
  arc(out, radius - edge, -half + edge, edge, 0, -Math.PI / 2, edgeRings);
  out.push([0, -half, 0, -1]);

  return out;
}

/** The tube's cross-section, walked so the outward normal sits on the lathe's winding side */
function torusProfile(radius, tube, steps) {
  const out = [];

  arc(out, radius, 0, tube, Math.PI / 2, Math.PI / 2 - Math.PI * 2, steps);

  return out;
}

/** Revolves a profile, ordered top to bottom along its outer side, round the Y axis */
function lathe(profile, segments) {
  const rows = profile.length;
  const columns = segments + 1;
  const count = rows * columns;
  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  const indices = new Uint16Array((rows - 1) * segments * 6);
  const lengths = arcLengths(profile);
  const total = lengths[rows - 1];

  for (let p = 0, v = 0; p < rows; p++) {
    const [r, y, nr, ny] = profile[p];

    for (let s = 0; s < columns; s++, v++) {
      const angle = (s / segments) * Math.PI * 2;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      positions[v * 3] = r * sin;
      positions[v * 3 + 1] = y;
      positions[v * 3 + 2] = r * cos;
      normals[v * 3] = nr * sin;
      normals[v * 3 + 1] = ny;
      normals[v * 3 + 2] = nr * cos;
      uvs[v * 2] = s / segments;
      uvs[v * 2 + 1] = lengths[p] / total;
    }
  }

  for (let p = 0, i = 0; p < rows - 1; p++) {
    for (let s = 0; s < segments; s++, i += 6) {
      const a = p * columns + s;
      const b = a + 1;
      const c = a + columns;
      const d = c + 1;

      indices[i] = a;
      indices[i + 1] = c;
      indices[i + 2] = b;
      indices[i + 3] = b;
      indices[i + 4] = c;
      indices[i + 5] = d;
    }
  }

  return new Geometry3D({ positions, normals, uvs, indices });
}

/** A regular polyhedron and the atlas its faces' UVs sit in, one cell a face */

const OCTAHEDRON = {
  vertices: [
    [0.56, 0, 0],
    [-0.56, 0, 0],
    [0, 0.56, 0],
    [0, -0.56, 0],
    [0, 0, 0.56],
    [0, 0, -0.56],
  ],
  faces: [
    [0, 2, 4],
    [0, 4, 3],
    [0, 3, 5],
    [0, 5, 2],
    [1, 4, 2],
    [1, 3, 4],
    [1, 5, 3],
    [1, 2, 5],
  ],
  columns: 4,
  rows: 2,
};

/** A regular tetrahedron standing on a face, apex up: the site's triangular pyramid */
const PYRAMID = (() => {
  const circumradius = 0.58;
  const base = (circumradius * Math.sqrt(8)) / 3;
  const vertices = [[0, circumradius, 0]];

  for (let k = 0; k < 3; k++) {
    const angle = Math.PI / 2 + (k * Math.PI * 2) / 3;

    vertices.push([
      Math.cos(angle) * base,
      -circumradius / 3,
      Math.sin(angle) * base,
    ]);
  }

  return {
    vertices,
    faces: [
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 1],
      [1, 2, 3],
    ],
    columns: 2,
    rows: 2,
  };
})();

/** An equilateral triangle's height over its side, and the margin that centres it in a square cell */
const TRIANGLE_HEIGHT = Math.sqrt(3) / 2;
const TRIANGLE_INSET = (1 - TRIANGLE_HEIGHT) / 2;

/** Packs samples toward 0 and 1, where the rounded edges need them; flat face middles need few */
function edgeWarp(t) {
  return t - (0.85 * Math.sin(Math.PI * 2 * t)) / (Math.PI * 2);
}

function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalize(v) {
  const length = Math.sqrt(dot(v, v)) || 1;

  return [v[0] / length, v[1] / length, v[2] / length];
}

function closestOnSegment(p, a, b) {
  const ab = sub(b, a);
  const t = Math.max(0, Math.min(1, dot(sub(p, a), ab) / dot(ab, ab)));

  return [a[0] + ab[0] * t, a[1] + ab[1] * t, a[2] + ab[2] * t];
}

/**
 * A triangular-faced convex polyhedron with every edge and corner rolled to `radius`
 *
 * Each subdivided face point moves onto the sphere-swept inner (shrunk) solid along that sweep's normal, so
 * edges come out as smooth cylinders and corners as sphere patches. Assumes an inscribed sphere at the origin,
 * so the inner solid is the outer one scaled about it. UVs are an atlas of `columns` × `rows` cells, one a face,
 * each face an equilateral triangle centred in its cell, so texture scale is the same along u and v.
 */
function roundedPolyhedron(
  { vertices, faces: faceList, columns, rows },
  radius,
  steps,
) {
  const faces = faceList.map((face) => {
    const [a, b, c] = face.map((i) => vertices[i]);

    return dot(cross(sub(b, a), sub(c, a)), a) < 0 ? [...face].reverse() : face;
  });
  const inradius = Math.min(
    ...faces.map((face) =>
      dot(
        normalize(
          cross(
            sub(vertices[face[1]], vertices[face[0]]),
            sub(vertices[face[2]], vertices[face[0]]),
          ),
        ),
        vertices[face[0]],
      ),
    ),
  );
  const shrink = 1 - radius / inradius;
  const inner = vertices.map((v) => [
    v[0] * shrink,
    v[1] * shrink,
    v[2] * shrink,
  ]);

  const closestInner = (p) => {
    let best = inner[0];
    let bestDistance = Infinity;
    const consider = (q) => {
      const d = sub(p, q);
      const distance = dot(d, d);

      if (distance < bestDistance) {
        bestDistance = distance;
        best = q;
      }
    };

    for (const face of faces) {
      const a = inner[face[0]];
      const normal = normalize(
        cross(sub(inner[face[1]], a), sub(inner[face[2]], a)),
      );
      const height = dot(sub(p, a), normal);
      const q = [
        p[0] - normal[0] * height,
        p[1] - normal[1] * height,
        p[2] - normal[2] * height,
      ];
      let inside = true;

      for (let k = 0; k < face.length; k++) {
        const from = inner[face[k]];
        const to = inner[face[(k + 1) % face.length]];

        if (dot(cross(sub(to, from), sub(q, from)), normal) < -1e-9)
          inside = false;
        consider(closestOnSegment(p, from, to));
      }

      if (inside) consider(q);
    }

    return best;
  };

  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let cell = 0; cell < faces.length; cell++) {
    const face = faces[cell];
    const base = positions.length / 3;
    const [a, b, c] = face.map((i) => vertices[i]);
    const row = [];

    for (let j = 0, offset = 0; j <= steps; j++) {
      row.push(offset);
      offset += steps + 1 - j;
    }

    for (let j = 0; j <= steps; j++) {
      for (let i = 0; i <= steps - j; i++) {
        let wa = edgeWarp((steps - i - j) / steps);
        let wb = edgeWarp(i / steps);
        let wc = edgeWarp(j / steps);
        const sum = wa + wb + wc;

        wa /= sum;
        wb /= sum;
        wc /= sum;

        const p = [
          a[0] * wa + b[0] * wb + c[0] * wc,
          a[1] * wa + b[1] * wb + c[1] * wc,
          a[2] * wa + b[2] * wb + c[2] * wc,
        ];
        const centre = closestInner(p);
        const n = normalize(sub(p, centre));

        positions.push(
          centre[0] + n[0] * radius,
          centre[1] + n[1] * radius,
          centre[2] + n[2] * radius,
        );
        normals.push(n[0], n[1], n[2]);
        uvs.push(
          atlasU(cell, columns, wb + wc / 2),
          atlasV(cell, columns, rows, TRIANGLE_INSET + wc * TRIANGLE_HEIGHT),
        );
      }
    }

    for (let j = 0; j < steps; j++) {
      for (let i = 0; i < steps - j; i++) {
        const p0 = base + row[j] + i;
        const p1 = p0 + 1;
        const p2 = base + row[j + 1] + i;

        indices.push(p0, p1, p2);
        if (i < steps - j - 1) indices.push(p1, p2 + 1, p2);
      }
    }
  }

  return new Geometry3D({
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    uvs: new Float32Array(uvs),
    indices: new Uint16Array(indices),
  });
}

/**
 * Each shape's texture aspect: its surface's length along u over its length along v
 *
 * Size a paint canvas `aspect` times wider than tall and a round brush stays round (on the atlas shapes, each
 * face's cell comes out square).
 */
export const CLAY_UV_ASPECT = {
  cube: 1.5,
  capsule: profileAspect(HIGH_PROFILES.capsule),
  sphere: profileAspect(HIGH_PROFILES.sphere),
  puck: profileAspect(HIGH_PROFILES.puck),
  pyramid: PYRAMID.columns / PYRAMID.rows,
  octahedron: OCTAHEDRON.columns / OCTAHEDRON.rows,
  torus: profileAspect(HIGH_PROFILES.torus),
};

/**
 * Where a clay shape's UVs sit on its texture, for painting at `hit3D.uv`
 *
 * `uLength` and `vLength` are the lengths of surface, at scale 1, that the texture's full width and height span,
 * so a brush `size` units wide covers `size / uLength` of the width.
 * - `'atlas'`: one cell a face in a `columns` × `rows` grid, with `gutter` (a share of the cell) left empty on
 *   each side. Face `i` sits in column `i % columns` and row `floor(i / columns)`, row 0 at v = 0, so the face
 *   at a UV is `floor(v * rows) * columns + floor(u * columns)`.
 * - `'lathe'`: u runs round the axis and wraps at the seam; v runs top to bottom along the profile by arc length.
 *   The lengths hold at `radius`, the widest ring; at `d` from the axis, u packs `radius / d` times tighter.
 * The lengths are measured on the `'high'` cut; the `'low'` one is within 6%.
 */

function atlasLayout(columns, rows, faceSize) {
  const span = 1 - 2 * ATLAS_GUTTER;

  return {
    kind: 'atlas',
    columns,
    rows,
    gutter: ATLAS_GUTTER,
    uLength: (columns * faceSize) / span,
    vLength: (rows * faceSize) / span,
  };
}

function polyhedronLayout({ vertices, faces, columns, rows }) {
  const [a, b] = faces[0];

  return atlasLayout(
    columns,
    rows,
    Math.hypot(...sub(vertices[b], vertices[a])),
  );
}

function latheLayout(profile) {
  const lengths = arcLengths(profile);
  const radius = Math.max(...profile.map((point) => point[0]));

  return {
    kind: 'lathe',
    radius,
    uLength: Math.PI * 2 * radius,
    vLength: lengths[lengths.length - 1],
  };
}

/** Each shape's UV layout; see {@link ClayUvLayout} */
export const CLAY_UV_LAYOUT = {
  cube: atlasLayout(3, 2, CUBE_SIZE),
  capsule: latheLayout(HIGH_PROFILES.capsule),
  sphere: latheLayout(HIGH_PROFILES.sphere),
  puck: latheLayout(HIGH_PROFILES.puck),
  pyramid: polyhedronLayout(PYRAMID),
  octahedron: polyhedronLayout(OCTAHEDRON),
  torus: latheLayout(HIGH_PROFILES.torus),
};
