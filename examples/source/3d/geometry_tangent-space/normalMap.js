/** Nine raised round pads encoded as RGB normals; the mesh they shade stays flat. */

import { Texture } from 'pixi.js';

/** Three pads across, each about 85 px, enough for a smooth bevel at the tiles' size on screen */
const SIZE = 256;

/**
 * Draws the normal map on a canvas, in tangent space: red is the slope along T (right in the image), green along B
 * (up the image) and blue out of the surface along N, each mapped from -1..1 to 0..255
 */
export function createNormalMap() {
  const canvas = document.createElement('canvas');

  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('A 2D context is required to draw the normal map.');
  const pixels = ctx.createImageData(SIZE, SIZE);

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const u = ((((x + 0.5) / SIZE) * 3) % 1) - 0.5;
      const v = ((((y + 0.5) / SIZE) * 3) % 1) - 0.5;
      const radius = Math.hypot(u, v);
      // Differentiate a smoothstep height bevel. Its flat cap and flat border share the same normal.
      const t = Math.min(1, Math.max(0, (radius - 0.2) / 0.2));
      const slope = radius > 0 ? (5.7 * t * (1 - t)) / radius : 0;
      const length = Math.hypot(u * slope, v * slope, 1);
      const offset = (y * SIZE + x) * 4;

      pixels.data[offset] = Math.round(
        (((u * slope) / length) * 0.5 + 0.5) * 255,
      );
      // Image rows run down, so green negates v to point up the image.
      pixels.data[offset + 1] = Math.round(
        (((-v * slope) / length) * 0.5 + 0.5) * 255,
      );
      pixels.data[offset + 2] = Math.round(((1 / length) * 0.5 + 0.5) * 255);
      pixels.data[offset + 3] = 255;
    }
  }
  ctx.putImageData(pixels, 0, 0);

  return Texture.from({ resource: canvas, autoGenerateMipmaps: true });
}
