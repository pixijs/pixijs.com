/**
 * The terrain's texture: a gradient from pale sky at u = 0 to lilac at u = 1, with the PixiJS wordmark across it
 *
 * The wordmark is there so the uvs show: it reads left to right along u and stands with its top at v = 0, so a
 * reader can tell which way u and v run across the patch, which a symmetric pattern couldn't show.
 */

import { CanvasSource, Texture } from 'pixi.js';

import { BRAND, CLAY, cssColor } from './theme/palette';
import { WORDMARK_SIZE, wordmarkSvg } from './theme/wordmark';

/** The texture's side in px */
const TEXTURE_SIZE = 512;
/** The wordmark's width, as a share of the texture's */
const WORDMARK_WIDTH = 0.7;

export async function createTerrainTexture() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) throw new Error('No 2D canvas for the terrain texture');
  canvas.width = canvas.height = TEXTURE_SIZE;

  const gradient = context.createLinearGradient(0, 0, TEXTURE_SIZE, 0);

  gradient.addColorStop(0, cssColor(CLAY.paleSky));
  gradient.addColorStop(1, cssColor(CLAY.lilac));
  context.fillStyle = gradient;
  context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

  const image = new Image();
  const width = TEXTURE_SIZE * WORDMARK_WIDTH;
  const height = (width * WORDMARK_SIZE.height) / WORDMARK_SIZE.width;
  // Purple, not white, so the letters read as printed on the sheet rather than as holes onto the light stage's white.
  const svg = wordmarkSvg(cssColor(BRAND.purple), cssColor(BRAND.night));

  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await image.decode();
  context.drawImage(
    image,
    (TEXTURE_SIZE - width) / 2,
    (TEXTURE_SIZE - height) / 2,
    width,
    height,
  );

  // Mipmaps keep the letters clean where the terrain tilts away from the camera.
  return new Texture({
    source: new CanvasSource({ resource: canvas, autoGenerateMipmaps: true }),
  });
}
