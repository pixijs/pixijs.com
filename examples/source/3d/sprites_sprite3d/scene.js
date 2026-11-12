/**
 * The props: the wordmark texture the sprites show, and three clay cubes floating in a row in front of them, with
 * their slow spin and bob
 *
 * None of it is the lesson: `index.ts` makes the sprites from the texture and sets the cubes' `billboardMode`.
 */

import { Mesh3D } from '@pixi/3d';

import { Graphics, Rectangle } from 'pixi.js';

import { clayMaterial } from './theme/clay';

import { clayGeometry } from './theme/shapes';
import { WORDMARK_SIZE, wordmarkContext } from './theme/wordmark';

/**
 * A clear border round the wordmark, in px, so the artwork never touches the texture's edge. 16 px still leaves a
 * clear pixel four mip levels down
 */
const TEXTURE_MARGIN = 16;

/** Softer than the sprites' brand tints, so the cubes never read as a fourth sprite */
const SHAPE_COLORS = ['lilac', 'paleSky', 'palePink'];
/** Each cube's own turn, so in `'none'` they spin out of step */
const SHAPE_YAWS = [0.5, -0.6, 0.25];
/**
 * Close together near the middle of the frame, where perspective barely leans an upright cube, so a front squared to
 * the camera reads as squared
 */
const SHAPE_SPACING = 1.5;
/**
 * In front of the sprites and low, so from the opening view the cubes stay under the sightlines to the sprites' feet;
 * high enough that a cube tipped by a spherical turn clears the floor
 */
const ROW = { y: 0.56, z: 4.4 };
/** 0.72 across: big enough on a phone to see which faces show */
const SHAPE_SCALE = 0.9;
/** Radians a second; it only shows in `'none'`, since both billboard modes replace a turn about the up axis */
const SPIN = 0.6;
const BOB = { height: 0.03, rate: 1.6 };

/**
 * The kit's white wordmark drawn into a 767 × 321 px texture, the margin included. It draws a third of its size or
 * less, so mipmaps keep its edges from shimmering as the camera moves, and resolution 1 keeps it from growing on a
 * high-density screen
 */
export function createWordmarkTexture(renderer) {
  const artwork = new Graphics(wordmarkContext());
  const texture = renderer.generateTexture({
    target: artwork,
    frame: new Rectangle(
      -TEXTURE_MARGIN,
      -TEXTURE_MARGIN,
      WORDMARK_SIZE.width + TEXTURE_MARGIN * 2,
      WORDMARK_SIZE.height + TEXTURE_MARGIN * 2,
    ),
    resolution: 1,
    antialias: true,
    textureSourceOptions: { autoGenerateMipmaps: true },
  });

  artwork.destroy({ context: true });

  return texture;
}

/** The three cubes, left to right */
export function createShapes(parent) {
  return SHAPE_COLORS.map(
    (color, i) =>
      new Mesh3D({
        geometry: clayGeometry('cube'),
        material: clayMaterial(color),
        // The shadow pass doesn't turn billboards, so a cube would cast the shadow of its unturned pose.
        castShadow: false,
        scale: SHAPE_SCALE,
        position: { x: (i - 1) * SHAPE_SPACING, y: ROW.y, z: ROW.z },
        rotation: { x: 0, y: SHAPE_YAWS[i], z: 0 },
        parent,
      }),
  );
}

/** Spins each cube from its own yaw and bobs it, out of step with the others, at `time` seconds */
export function animateShapes(shapes, time) {
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].rotation.y = SHAPE_YAWS[i] + time * SPIN;
    shapes[i].position.y = ROW.y + Math.sin(time * BOB.rate + i) * BOB.height;
  }
}
