import { Geometry3D } from '@pixi/3d';

export interface SuperellipsoidOptions {
  /** Half-extent along each axis, before the mesh's own scale. */
  radius: number;
  /** Exponent: 1 is a sphere, 0 a hard-edged cube, 2 a hard-edged octahedron. */
  roundness: number;
  /** Segments around the equator. Latitude uses half as many. */
  segments: number;
}

const DEFAULTS: SuperellipsoidOptions = { radius: 1, roundness: 0.32, segments: 64 };

const signPow = (value: number, exponent: number): number => Math.sign(value) * Math.abs(value) ** exponent;

/**
 * The soft-edged solids from the hero field, built on the same longitude-by-latitude grid a UV
 * sphere uses with each trig term raised to `roundness`. Below 1 the surface bulges out toward the
 * corners of a cube; above it the surface pulls in toward the six points of an octahedron, and at
 * either extreme the edges stay rolled off rather than creased.
 *
 * Normals are the analytic superquadric normals (the same terms at `2 - roundness`), so the rounded
 * edges shade smoothly instead of faceting. Row and column order match {@link SphereGeometry},
 * which is where the counter-clockwise winding and the degenerate pole rows come from.
 */
export function superellipsoidGeometry(options: Partial<SuperellipsoidOptions> = {}): Geometry3D {
  const { radius, roundness, segments } = { ...DEFAULTS, ...options };
  const cols = Math.max(3, Math.round(segments));
  const rows = Math.max(2, cols >> 1);
  const normalExponent = 2 - roundness;
  const rowSize = cols + 1;
  const positions = new Float32Array(rowSize * (rows + 1) * 3);
  const normals = new Float32Array(positions.length);
  const uvs = new Float32Array(rowSize * (rows + 1) * 2);
  const indices = new Uint32Array((rows - 1) * cols * 6);

  let vertex = 0;

  for (let row = 0; row <= rows; row++) {
    const latitude = Math.PI / 2 - (row / rows) * Math.PI;
    const cosLat = Math.cos(latitude);
    const sinLat = Math.sin(latitude);
    const ringRadius = signPow(cosLat, roundness);
    const ringNormal = signPow(cosLat, normalExponent);
    const height = signPow(sinLat, roundness);
    const heightNormal = signPow(sinLat, normalExponent);

    for (let col = 0; col <= cols; col++, vertex++) {
      const longitude = (col / cols) * Math.PI * 2;
      const cosLon = Math.cos(longitude);
      const sinLon = Math.sin(longitude);
      const nx = ringNormal * signPow(cosLon, normalExponent);
      const ny = heightNormal;
      const nz = ringNormal * signPow(sinLon, normalExponent);
      const length = Math.hypot(nx, ny, nz) || 1;
      const p = vertex * 3;

      positions[p] = ringRadius * signPow(cosLon, roundness) * radius;
      positions[p + 1] = height * radius;
      positions[p + 2] = ringRadius * signPow(sinLon, roundness) * radius;
      normals[p] = nx / length;
      normals[p + 1] = ny / length;
      normals[p + 2] = nz / length;
      uvs[vertex * 2] = col / cols;
      uvs[vertex * 2 + 1] = row / rows;
    }
  }

  let index = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const a = row * rowSize + col;
      const b = a + 1;
      const c = a + rowSize;
      const d = c + 1;

      if (row !== 0) {
        indices[index++] = a;
        indices[index++] = b;
        indices[index++] = c;
      }
      if (row !== rows - 1) {
        indices[index++] = b;
        indices[index++] = d;
        indices[index++] = c;
      }
    }
  }

  return new Geometry3D({ positions, normals, uvs, indices });
}
