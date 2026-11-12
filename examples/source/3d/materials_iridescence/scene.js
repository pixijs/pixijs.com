/**
 * The props: the logo's place and its slow sweep, and the film strip under it, a flat plane in the logo's film read
 * through a thickness map, laid out like a ruler from `thicknessMinimum` at its left end to `thicknessMaximum` at its
 * right
 */

import { Mesh3D, PlaneGeometry } from '@pixi/3d';

import { BufferImageSource, Texture } from 'pixi.js';

/** The logo's width, so the two line up, and tall enough to read each band of colour */
export const STRIP_WIDTH = 4;
export const STRIP_HEIGHT = 0.42;
/** One texel per step of an 8-bit channel, so the ramp is as smooth as its green can be */
const RAMP_TEXELS = 256;
/** Room under the logo for the strip and its end tags */
const LOGO_HEIGHT = 2.45;
/** Tips the logo's top back, so its faces mirror the bright sky of the reflections, not the dark ground */
const LOGO_TILT = -0.18;
/**
 * The logo's sweep about y, in radians and seconds. It leans right, since turned further left the faces mirror the
 * dark side of the reflections and their colour goes with it
 */
const SWAY = { centre: 0.3, amplitude: 0.7, period: 14 };
/** The sweep's clock at the first frame, which catches the logo turned well away (θ about 53°) and still turning */
export const SWAY_START = 2.5;

/**
 * A thickness map whose green runs from 0 at its left edge to 1 at its right
 *
 * Its red stays white: the map shares the iridescence slot, whose red scales `factor`.
 */
export function createThicknessRamp() {
  const texels = new Uint8Array(RAMP_TEXELS * 4).fill(255);

  for (let i = 0; i < RAMP_TEXELS; i++) texels[i * 4 + 1] = i;

  return new Texture({
    source: new BufferImageSource({
      resource: texels,
      width: RAMP_TEXELS,
      height: 1,
      format: 'rgba8unorm',
    }),
  });
}

/** The strip in front of the logo, wearing `material` */
export function createFilmStrip(material) {
  return new Mesh3D({
    geometry: new PlaneGeometry({ width: STRIP_WIDTH, height: STRIP_HEIGHT }),
    material,
    // Tilted back to face the camera, so it's seen near straight on and mirrors the bright sky of the reflections.
    position: { x: 0, y: 0.8, z: 0.8 },
    rotation: { x: -0.25, y: 0, z: 0 },
    // It casts nothing, so the only shadow on the floor is the logo's.
    castShadow: false,
  });
}

/** Lifts the logo over the strip and tips it back */
export function placeLogo(logo) {
  logo.root.position.y = LOGO_HEIGHT;
  logo.root.rotation.x = LOGO_TILT;
}

/** Turns the logo about y to where its sweep is `time` seconds in */
export function swayLogo(logo, time) {
  logo.root.rotation.y =
    SWAY.centre + SWAY.amplitude * Math.sin((time / SWAY.period) * Math.PI * 2);
}
