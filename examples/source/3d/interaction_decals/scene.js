/** A shallow framed drawing tablet, with a quiet ruled surface that makes translucent ink readable */

import { Mesh3D } from '@pixi/3d';

import { CanvasSource, Texture } from 'pixi.js';

import { clayMaterial } from './theme/clay';
import { cssColor, mixColor, THEMES } from './theme/palette';
import { roundedBox } from './theme/shapes';

/** The tablet's face: the paper the marks land on, and the height of its top */
export const SURFACE = { width: 7.2, depth: 4.4, y: 0.68 };

/** Adds the tablet's two clay slabs under `parent`; the face that takes the stamps is built in `index.ts` */
export function addTabletFrame(parent) {
  new Mesh3D({
    geometry: roundedBox(8, 0.42, 5.2, 0.2),
    material: clayMaterial('purple'),
    position: { x: 0, y: 0.29, z: 0 },
    parent,
  });
  new Mesh3D({
    geometry: roundedBox(7.8, 0.2, 5, 0.09),
    material: clayMaterial('lilac'),
    position: { x: 0, y: 0.57, z: 0 },
    parent,
  });
}

/**
 * The tablet face's ruled paper: a fine grid and an inset border, drawn once to a canvas
 *
 * It's painted in the light floor's two check colours, so under the stage's lights it shows as the floor does: white
 * with lavender rules on the light theme, dimmed with the floor on the dark one.
 */
export function createPaperTexture() {
  const source = new CanvasSource({
    width: 720,
    height: 440,
    autoGenerateMipmaps: true,
  });
  const ctx = source.context2D;
  const { floor, check } = THEMES.light;

  ctx.fillStyle = cssColor(floor);
  ctx.fillRect(0, 0, 720, 440);
  ctx.strokeStyle = cssColor(mixColor(0, floor, check));
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 30; x < 720; x += 30) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 440);
  }
  for (let y = 30; y < 440; y += 30) {
    ctx.moveTo(0, y);
    ctx.lineTo(720, y);
  }
  ctx.stroke();
  ctx.strokeStyle = cssColor(THEMES.light.inkSoft);
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, 696, 416);

  return new Texture({ source });
}
