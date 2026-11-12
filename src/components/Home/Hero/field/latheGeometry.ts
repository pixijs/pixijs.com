import { Geometry3D } from '@pixi/3d';

/**
 * One step of a lathe's silhouette: how far it stands off the axis and how high it sits, plus the
 * direction the silhouette is heading in there, which is what the surface normal is built from.
 */
export interface LatheRing {
  halfWidth: number;
  y: number;
  tangentWidth: number;
  tangentY: number;
}

export interface LatheOptions {
  /** The silhouette, running bottom to top. Ends that stand off the axis are capped for you. */
  rings: LatheRing[];
  /** Cross-section exponent: 1 sweeps a circle, 0 a hard square. */
  roundness: number;
  /** Segments around the cross-section. */
  segments: number;
}

export interface LatheArc {
  /** Centre of the corner being rolled, as a half-width and a height. */
  width: number;
  y: number;
  radius: number;
  /** Angles the arc runs between, measured from the +width axis toward +y. */
  from: number;
  to: number;
  steps: number;
}

/** Distance from the cusp at which the cross-section's slope is clamped; it is unbounded there. */
const SLOPE_EPSILON = 1e-3;

/** Below this a silhouette end counts as already sitting on the axis and needs no cap. */
const ON_AXIS = 1e-6;

const signPow = (value: number, exponent: number): number => Math.sign(value) * Math.abs(value) ** exponent;

/** `d/dw` of {@link signPow}, which is `e·|w|^(e-1)` and blows up at the cusp — hence the clamp. */
const signPowSlope = (value: number, exponent: number): number =>
  exponent * Math.max(Math.abs(value), SLOPE_EPSILON) ** (exponent - 1);

/** Samples a rolled corner of a silhouette, ready to be spread into a {@link LatheOptions.rings}. */
export function latheArc({ width, y, radius, from, to, steps }: LatheArc): LatheRing[] {
  return Array.from({ length: steps + 1 }, (_, step) => {
    const angle = from + ((to - from) * step) / steps;

    return {
      halfWidth: width + radius * Math.cos(angle),
      y: y + radius * Math.sin(angle),
      tangentWidth: -Math.sin(angle),
      tangentY: Math.cos(angle),
    };
  });
}

/**
 * Sweeps a silhouette around the +Y axis through a superellipse rather than a circle, which is what
 * lets one builder produce both a round drum and a square-based pyramid.
 *
 * Because the cross-section is not a circle, a ring's normal is no longer the direction it stands
 * off the axis, so normals come from the analytic cross product of the two surface tangents: along
 * the cross-section, and along the silhouette.
 *
 * Rows run bottom to top, the reverse of {@link SphereGeometry}, which is why the winding below is
 * mirrored against it.
 */
export function latheGeometry({ rings, roundness, segments }: LatheOptions): Geometry3D {
  const cols = Math.max(3, Math.round(segments));
  const first = rings[0];
  const last = rings[rings.length - 1];
  const profile: LatheRing[] = [
    ...(first.halfWidth > ON_AXIS ? [{ halfWidth: 0, y: first.y, tangentWidth: 1, tangentY: 0 }] : []),
    ...rings,
    ...(last.halfWidth > ON_AXIS ? [{ halfWidth: 0, y: last.y, tangentWidth: -1, tangentY: 0 }] : []),
  ];
  const rowSize = cols + 1;
  const positions = new Float32Array(profile.length * rowSize * 3);
  const normals = new Float32Array(positions.length);
  const uvs = new Float32Array(profile.length * rowSize * 2);
  const indices = new Uint32Array((profile.length - 1) * cols * 6);

  let vertex = 0;

  for (let row = 0; row < profile.length; row++) {
    const ring = profile[row];

    for (let col = 0; col <= cols; col++, vertex++) {
      const angle = (col / cols) * Math.PI * 2;
      const cosAngle = Math.cos(angle);
      const sinAngle = Math.sin(angle);
      const shapeX = signPow(cosAngle, roundness);
      const shapeZ = signPow(sinAngle, roundness);
      const slopeX = signPowSlope(cosAngle, roundness) * -sinAngle;
      const slopeZ = signPowSlope(sinAngle, roundness) * cosAngle;
      const nx = slopeZ * ring.tangentY;
      const ny = -ring.tangentWidth * (slopeZ * shapeX - slopeX * shapeZ);
      const nz = -slopeX * ring.tangentY;
      const length = Math.hypot(nx, ny, nz) || 1;
      const p = vertex * 3;

      positions[p] = ring.halfWidth * shapeX;
      positions[p + 1] = ring.y;
      positions[p + 2] = ring.halfWidth * shapeZ;
      normals[p] = nx / length;
      normals[p + 1] = ny / length;
      normals[p + 2] = nz / length;
      uvs[vertex * 2] = col / cols;
      uvs[vertex * 2 + 1] = row / (profile.length - 1);
    }
  }

  let index = 0;

  for (let row = 0; row < profile.length - 1; row++) {
    for (let col = 0; col < cols; col++) {
      const a = row * rowSize + col;
      const b = a + 1;
      const c = a + rowSize;
      const d = c + 1;

      if (row !== 0) {
        indices[index++] = a;
        indices[index++] = c;
        indices[index++] = b;
      }
      if (row !== profile.length - 2) {
        indices[index++] = b;
        indices[index++] = c;
        indices[index++] = d;
      }
    }
  }

  return new Geometry3D({ positions, normals, uvs, indices: indices.subarray(0, index) });
}
