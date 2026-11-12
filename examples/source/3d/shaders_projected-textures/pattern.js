/** A tiling grayscale data texture: white marks the dark cloud, black leaves the clay alone */

import { CanvasSource, Texture } from 'pixi.js';

export function createCloudMask() {
  // Repeat wraps the sampler, so the shader samples the projected UVs as they are. Wrapping them with `fract` in the
  // shader would break the UV's slope at each tile edge, and the mipmap pick there would draw a seam.
  const source = new CanvasSource({
    width: 128,
    height: 128,
    autoGenerateMipmaps: true,
    addressMode: 'repeat',
  });
  const image = source.context2D.createImageData(128, 128);

  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const u = (x / 128) * Math.PI * 2;
      const v = (y / 128) * Math.PI * 2;
      const field = Math.sin(u + Math.sin(v)) + Math.cos(v * 2 - u) * 0.45;
      const value = Math.round(
        Math.min(1, Math.max(0, (field + 0.3) / 1.1)) * 255,
      );
      const at = (y * 128 + x) * 4;

      image.data[at] = image.data[at + 1] = image.data[at + 2] = value;
      image.data[at + 3] = 255;
    }
  }
  source.context2D.putImageData(image, 0, 0);

  return new Texture({ source });
}
