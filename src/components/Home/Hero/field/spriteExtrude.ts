import { Geometry3D } from '@pixi/3d';

/** Pixels darker than this count as the sprite's outline */
const OUTLINE_LUMA = 48;

/** A sprite's pixels, row-major from the top, as `ImageData` has them */
export interface SpritePixels {
  width: number;
  height: number;
  data: ArrayLike<number>;
}

/**
 * A pixel-art sprite as voxels, the way pixi-3d's beta launch film builds its bunnies (`spriteExtrude.ts` there): a
 * front and a back quad carrying the sprite's texture, which an alpha-masked material cuts to its silhouette, and a
 * side wall along every edge of its opaque pixels, merged into runs along each row and column. Every wall's UVs sit
 * on the centre of one texel, so it takes that pixel's colour through the same texture; an outline pixel's wall takes
 * the pixel just inside it, so the sides read as the body rather than a dark rim.
 *
 * Built centred on the origin and facing +Z, with one sprite pixel `unit` across and `depth` pixels deep.
 */
export function extrudeSprite({ width, height, data }: SpritePixels, depth: number, unit: number): Geometry3D {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const halfDepth = depth / 2;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const opaque = (x: number, y: number): boolean =>
    x >= 0 && y >= 0 && x < width && y < height && data[(y * width + x) * 4 + 3] >= 128;

  const luma = (x: number, y: number): number => {
    const o = (y * width + x) * 4;

    return data[o] * 0.3 + data[o + 1] * 0.59 + data[o + 2] * 0.11;
  };

  /** The texel a wall on pixel (x, y) facing (dx, dy) takes its colour from */
  const wallTexel = (x: number, y: number, dx: number, dy: number): number => {
    if (luma(x, y) < OUTLINE_LUMA) {
      for (let step = 1; step <= 2; step++) {
        const ix = x - dx * step;
        const iy = y - dy * step;

        if (opaque(ix, iy) && luma(ix, iy) >= OUTLINE_LUMA) return iy * width + ix;
      }
    }

    return y * width + x;
  };

  const sameColour = (a: number, b: number): boolean =>
    a === b ||
    (data[a * 4] === data[b * 4] && data[a * 4 + 1] === data[b * 4 + 1] && data[a * 4 + 2] === data[b * 4 + 2]);

  /** A quad from four corners (in sprite pixels) and one normal, wound to face along the normal */
  const quad = (corners: number[][], normal: number[], quadUvs: number[][]): void => {
    const base = positions.length / 3;
    const [a, b, c] = corners;
    const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const facing =
      (e1[1] * e2[2] - e1[2] * e2[1]) * normal[0] +
      (e1[2] * e2[0] - e1[0] * e2[2]) * normal[1] +
      (e1[0] * e2[1] - e1[1] * e2[0]) * normal[2];

    for (let k = 0; k < 4; k++) {
      positions.push(corners[k][0] * unit, corners[k][1] * unit, corners[k][2] * unit);
      normals.push(normal[0], normal[1], normal[2]);
      uvs.push(quadUvs[k][0], quadUvs[k][1]);
    }

    if (facing >= 0) indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    else indices.push(base, base + 2, base + 1, base, base + 3, base + 2);
  };

  const faceUvs = [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 0],
  ];

  for (const side of [1, -1]) {
    quad(
      [
        [-halfWidth, halfHeight, halfDepth * side],
        [-halfWidth, -halfHeight, halfDepth * side],
        [halfWidth, -halfHeight, halfDepth * side],
        [halfWidth, halfHeight, halfDepth * side],
      ],
      [0, 0, side],
      faceUvs,
    );
  }

  /** One wall run along a pixel edge, from (x0, y0) to (x1, y1) in pixel-grid coordinates */
  const wall = (x0: number, y0: number, x1: number, y1: number, dx: number, dy: number, texel: number): void => {
    const uv = [((texel % width) + 0.5) / width, (Math.floor(texel / width) + 0.5) / height];
    const ax = -halfWidth + x0;
    const ay = halfHeight - y0;
    const bx = -halfWidth + x1;
    const by = halfHeight - y1;

    quad(
      [
        [ax, ay, halfDepth],
        [ax, ay, -halfDepth],
        [bx, by, -halfDepth],
        [bx, by, halfDepth],
      ],
      [dx, -dy, 0],
      [uv, uv, uv, uv],
    );
  };

  // Walls facing up or down, merged along each row
  for (const dy of [-1, 1]) {
    for (let y = 0; y < height; y++) {
      let runStart = -1;
      let runTexel = -1;

      for (let x = 0; x <= width; x++) {
        const edge = x < width && opaque(x, y) && !opaque(x, y + dy);
        const texel = edge ? wallTexel(x, y, 0, dy) : -1;

        if (runStart >= 0 && (!edge || !sameColour(texel, runTexel))) {
          const line = dy < 0 ? y : y + 1;

          wall(runStart, line, x, line, 0, dy, runTexel);
          runStart = -1;
        }
        if (edge && runStart < 0) {
          runStart = x;
          runTexel = texel;
        }
      }
    }
  }

  // Walls facing left or right, merged down each column
  for (const dx of [-1, 1]) {
    for (let x = 0; x < width; x++) {
      let runStart = -1;
      let runTexel = -1;

      for (let y = 0; y <= height; y++) {
        const edge = y < height && opaque(x, y) && !opaque(x + dx, y);
        const texel = edge ? wallTexel(x, y, dx, 0) : -1;

        if (runStart >= 0 && (!edge || !sameColour(texel, runTexel))) {
          const line = dx < 0 ? x : x + 1;

          wall(line, runStart, line, y, dx, 0, runTexel);
          runStart = -1;
        }
        if (edge && runStart < 0) {
          runStart = y;
          runTexel = texel;
        }
      }
    }
  }

  return new Geometry3D({
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    uvs: new Float32Array(uvs),
    indices: positions.length / 3 > 65536 ? new Uint32Array(indices) : new Uint16Array(indices),
  });
}
