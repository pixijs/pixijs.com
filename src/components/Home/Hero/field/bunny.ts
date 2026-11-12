import { BUNNY_OUTLINE, OUTLINE_SCALE } from './bunnyOutline';
import { BUNNY_PALETTE, BUNNY_SPRITE } from './bunnySprite';

import type { SpritePixels } from './spriteExtrude';

/**
 * The bunny's numbers: its sprite's pixels are extruded into voxels (`clay.ts`, through `spriteExtrude.ts`), and its
 * traced silhouette is what the field collides with and the shadow it drops. One sprite pixel is 2/37 of a unit, the
 * sprite's height spanning -1 to 1.
 */
export const PX = 2 / 37;

/** Voxels six sprite pixels deep, as the beta launch film's bunnies are */
export const DEPTH_PX = 6;
export const HALF_DEPTH = (DEPTH_PX / 2) * PX;
/** How far the collision hull's edges are rounded */
export const ROLL = 1.3 * PX;

const rgba = (hex: string | undefined): number[] =>
  hex ? [...[0, 2, 4].map((at) => parseInt(hex.slice(at, at + 2), 16)), 255] : [0, 0, 0, 0];

/** The sprite as RGBA pixels, from its grid in `bunnySprite.ts` */
export const BUNNY_PIXELS: SpritePixels = {
  width: BUNNY_SPRITE[0].length,
  height: BUNNY_SPRITE.length,
  data: Uint8Array.from([...BUNNY_SPRITE.join('')].flatMap((pixel) => rgba(BUNNY_PALETTE[pixel]))),
};

const unpack = (text: string): Uint8Array => Uint8Array.from(atob(text), (char) => char.charCodeAt(0));

/** The outline, as x, y pairs */
export const BUNNY_POINTS = Array.from(new Int16Array(unpack(BUNNY_OUTLINE).buffer), (value) => value / OUTLINE_SCALE);

/** Each point's outward normal: the outline runs counter-clockwise, so it's the right of the way it's heading */
function normalsOf(points: readonly number[]): number[] {
  const count = points.length / 2;
  const normals: number[] = [];

  for (let p = 0; p < count; p++) {
    const prev = ((p + count - 1) % count) * 2;
    const next = ((p + 1) % count) * 2;
    const ex = points[next] - points[prev];
    const ey = points[next + 1] - points[prev + 1];
    const length = Math.hypot(ex, ey) || 1;

    normals.push(ey / length, -ex / length);
  }

  return normals;
}

const OUTWARD = normalsOf(BUNNY_POINTS);

/** The outline inset by the roll, which the collision hull is grown from */
export const BUNNY_INSET = BUNNY_POINTS.map((value, i) => value - OUTWARD[i] * ROLL);
