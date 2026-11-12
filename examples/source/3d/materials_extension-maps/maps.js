/** Small instructional data textures, with deliberately separate channels rather than decorative artwork */

import { CanvasSource, Texture } from 'pixi.js';

/** Texels a side: enough for the coat's dimples, which sit 8 texels apart round the sphere */
const SIZE = 256;
/** Dimples round the sphere and from pole to pole: four across each coated stripe, as tall as wide at the equator */
const DIMPLES_AROUND = 32;
const DIMPLES_DOWN = 16;
/** A dimple's radius as a share of their spacing, leaving flat coat between them to reflect the world whole */
const DIMPLE_RADIUS = 0.3;
/** How far a dimple's rim tilts the coat's normal, enough for each rim to catch the light as a ring */
const DIMPLE_TILT = 0.5;

/** Each texture's RGB and alpha channels mean something different to its material extension. */
export function createDataMaps() {
  const kinds = [
    'mask',
    'roughness',
    'thickness',
    'normal',
    'direction',
    'packed',
  ];
  const maps = {};

  for (const kind of kinds) {
    const source = new CanvasSource({
      width: SIZE,
      height: SIZE,
      autoGenerateMipmaps: true,
    });
    const image = source.context2D.createImageData(SIZE, SIZE);

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const u = x / (SIZE - 1);
        const v = y / (SIZE - 1);
        const stripe = Math.floor(u * 8) % 2 === 0;
        const band = Math.floor(v * 4) % 2 === 0;
        const offset = (y * SIZE + x) * 4;
        let r = 255;
        let g = 255;
        let b = 255;
        let a = 255;

        if (kind === 'mask') r = stripe ? 255 : 12;
        // Bands across the mask's stripes: hazy where green is full, as rough as the plain coat; glossy between.
        else if (kind === 'roughness') g = band ? 255 : 8;
        else if (kind === 'thickness') g = 20 + 235 * v;
        else if (kind === 'normal') {
          // A grid of round dents on an otherwise flat coat; each dent's wall tilts toward its centre.
          const du = ((u * DIMPLES_AROUND) % 1) - 0.5;
          const dv = ((v * DIMPLES_DOWN) % 1) - 0.5;
          const inside = Math.hypot(du, dv) < DIMPLE_RADIUS;
          // The dents fade toward the poles, where the sphere's UVs pinch them into dark specks.
          const depth = inside
            ? (DIMPLE_TILT * Math.sin(v * Math.PI)) / DIMPLE_RADIUS
            : 0;
          const nx = -du * depth;
          const ny = dv * depth;

          r = (nx * 0.5 + 0.5) * 255;
          g = (ny * 0.5 + 0.5) * 255;
          b = (Math.sqrt(1 - nx * nx - ny * ny) * 0.5 + 0.5) * 255;
        } else if (kind === 'direction') {
          // RG stores a signed direction shifted into 0 to 1, not a colour; blue scales strength.
          r = stripe ? 255 : 128;
          g = stripe ? 128 : 255;
        } else {
          // RGB is a colour; alpha is extension data, not surface transparency. Pixi multiplies RGB by alpha on
          // upload, as it does a glTF's images, and the sheen and specular shaders divide it back out.
          r = stripe ? 255 : 80;
          g = stripe ? 110 : 190;
          b = stripe ? 170 : 255;
          a = 30 + 225 * v;
        }
        image.data[offset] = r;
        image.data[offset + 1] = g;
        image.data[offset + 2] = b;
        image.data[offset + 3] = a;
      }
    }
    source.context2D.putImageData(image, 0, 0);
    maps[kind] = new Texture({ source });
  }

  return maps;
}
