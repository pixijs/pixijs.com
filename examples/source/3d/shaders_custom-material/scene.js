/** The props: three colour ramps the material picks from, each drawn into a texture */

import { CanvasSource, Texture } from 'pixi.js';

import { BRAND, CLAY, cssColor } from './theme/palette';

export const RAMP_NAMES = ['candy', 'sky', 'sunset'];

/** Each ramp's colours, evenly spaced from its edge-on end to its facing end */
const RAMP_STOPS = {
  candy: [BRAND.pink, CLAY.palePink, BRAND.white],
  sky: [BRAND.sky, CLAY.paleSky, BRAND.white],
  sunset: [BRAND.pink, BRAND.orange, BRAND.white],
};

/** Texels across a ramp: plenty for a smooth gradient, and one row, since the shader reads only along it */
const RAMP_WIDTH = 256;

/** A texture for each ramp */
export function createRamps() {
  return {
    candy: createRampTexture(RAMP_STOPS.candy),
    sky: createRampTexture(RAMP_STOPS.sky),
    sunset: createRampTexture(RAMP_STOPS.sunset),
  };
}

/** A gradient through the colours, left to right, on a canvas one texel tall */
function createRampTexture(stops) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) throw new Error('A 2D canvas is needed to draw the ramps');
  canvas.width = RAMP_WIDTH;
  canvas.height = 1;

  const gradient = context.createLinearGradient(0, 0, RAMP_WIDTH, 0);

  stops.forEach((color, i) =>
    gradient.addColorStop(i / (stops.length - 1), cssColor(color)),
  );
  context.fillStyle = gradient;
  context.fillRect(0, 0, RAMP_WIDTH, 1);

  // No mip chain: `t` jumps at every band's edge, and the mip level picked from that jump would draw a blurred seam
  // along each band line.
  return new Texture({
    source: new CanvasSource({ resource: canvas, autoGenerateMipmaps: false }),
  });
}
