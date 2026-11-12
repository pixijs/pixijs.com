/**
 * The props: the stripe tile and the bounce atlas, drawn with the canvas 2D API since the example ships no image, and
 * the clay belt and monitor that wear them
 *
 * A real project would load both images; the atlas would come with a TexturePacker file.
 */

import { Container3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { BRAND, CLAY, cssColor } from './theme/palette';
import { roundedBox, roundedCylinder } from './theme/shapes';

/** The stripe tile's side in px: one copy of the picture the belt repeats */
const TILE = 128;
/** The atlas's grid and each frame's size in px, 4:3 like the screen */
const COLUMNS = 4;
const ROWS = 2;
const CELL_WIDTH = 192;
const CELL_HEIGHT = 144;
/** The floor line's height in a frame, and how far above it the ball's centre rises at the top of the bounce */
const FLOOR_Y = 118;
const BOUNCE = 66;
const BALL_RADIUS = 18;
/** The rollers' radius: they stand this far out past the band's two ends */
export const ROLLER_RADIUS = 0.3;
/** The plinth's height, and the belt's middle: its rollers, 0.3 taller than the face, stand on the plinth */
const PLINTH_HEIGHT = 0.35;
const BELT_Y = 1.1;
/** The screen's middle, above the belt with a short neck showing between them */
const SCREEN_Y = 2.85;

/** A blank canvas's 2D context, its canvas at `context.canvas` */
function canvas2d(width, height) {
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  // A new canvas always gives a 2D context; only one already holding another kind returns null.
  return canvas.getContext('2d');
}

/** One copy of the belt's picture: a left-pointing chevron on white, with a pale seam on its left edge to count by */
export function drawStripeTile() {
  const context = canvas2d(TILE, TILE);

  context.fillStyle = cssColor(BRAND.white);
  context.fillRect(0, 0, TILE, TILE);
  context.fillStyle = cssColor(CLAY.paleSky);
  context.fillRect(0, 0, 6, TILE);
  context.strokeStyle = cssColor(BRAND.purple);
  context.lineWidth = 26;
  context.lineJoin = 'miter';
  context.beginPath();
  context.moveTo(88, 14);
  context.lineTo(42, 64);
  context.lineTo(88, 114);
  context.stroke();

  return context.canvas;
}

/**
 * Eight frames of a bouncing ball in a 4 × 2 grid, each numbered in its corner, and the spritesheet data that names
 * them `bounce-0` to `bounce-7`
 *
 * Frame 0 is the top of the bounce and frame 4 the squashed landing. Everything sits 2 px inside its cell, so the only
 * pixels a frame's filtering reaches across are the night fill.
 */
export function drawBounceAtlas() {
  const context = canvas2d(CELL_WIDTH * COLUMNS, CELL_HEIGHT * ROWS);
  const bounce = [];
  const data = { frames: {}, animations: { bounce }, meta: { scale: 1 } };

  context.fillStyle = cssColor(BRAND.night);
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.font = 'bold 40px ui-monospace, Menlo, monospace';
  context.textBaseline = 'top';

  for (let i = 0; i < COLUMNS * ROWS; i++) {
    const x = (i % COLUMNS) * CELL_WIDTH;
    const y = Math.floor(i / COLUMNS) * CELL_HEIGHT;
    // A parabola through the frames: 1 at frame 0, 0 at frame 4.
    const k = ((i + 4) % 8) / 4 - 1;
    const height = 1 - k * k;
    const landed = height === 0;
    const centreX = x + CELL_WIDTH / 2;

    context.fillStyle = cssColor(BRAND.purple);
    context.fillRect(x + 16, y + FLOOR_Y, CELL_WIDTH - 32, 3);
    context.globalAlpha = 0.5;
    context.beginPath();
    context.ellipse(
      centreX,
      y + FLOOR_Y + 1,
      26 - height * 12,
      5 - height * 2,
      0,
      0,
      Math.PI * 2,
    );
    context.fill();
    context.globalAlpha = 1;
    context.fillStyle = cssColor(BRAND.sky);
    context.beginPath();
    if (landed)
      context.ellipse(centreX, y + FLOOR_Y - 12, 24, 12, 0, 0, Math.PI * 2);
    else
      context.arc(
        centreX,
        y + FLOOR_Y - BALL_RADIUS - height * BOUNCE,
        BALL_RADIUS,
        0,
        Math.PI * 2,
      );
    context.fill();
    context.fillStyle = cssColor(BRAND.white);
    context.fillText(String(i), x + 14, y + 10);

    data.frames[`bounce-${i}`] = {
      frame: { x, y, w: CELL_WIDTH, h: CELL_HEIGHT },
    };
    bounce.push(`bounce-${i}`);
  }

  return { canvas: context.canvas, data };
}

/**
 * An upright conveyor belt: a plinth, a purple body read as the closed loop, a white roller at each end, and `face`
 * just in front of the body, its ends on the rollers' front lines
 */
export function createBelt({ face, width, height }) {
  const roller = roundedCylinder(ROLLER_RADIUS, height + 0.3, 0.1);
  const white = clayMaterial('white');
  const belt = new Container3D();

  face.position.set(0, BELT_Y, 0.605);
  belt.addChild(
    new Mesh3D({
      geometry: roundedBox(width + 0.8, PLINTH_HEIGHT, 1.1, 0.12),
      material: clayMaterial('lilac'),
      position: { x: 0, y: PLINTH_HEIGHT / 2, z: 0.3 },
    }),
    new Mesh3D({
      geometry: roundedBox(width, height, 0.6, 0.05),
      material: clayMaterial('purple'),
      position: { x: 0, y: BELT_Y, z: 0.3 },
    }),
    new Mesh3D({
      geometry: roller,
      material: white,
      position: { x: -width / 2, y: BELT_Y, z: 0.3 },
    }),
    new Mesh3D({
      geometry: roller,
      material: white,
      position: { x: width / 2, y: BELT_Y, z: 0.3 },
    }),
    face,
  );

  return belt;
}

/**
 * A monitor mounted on the belt body's back, so nothing stands on the floor behind the belt: a neck from behind the
 * body up into a lilac bezel, and `face` as its screen
 */
export function createMonitor({ face, width, height }) {
  const monitor = new Container3D();

  face.position.set(0, SCREEN_Y, -0.075);
  monitor.addChild(
    // Its front sits on the body's back face; from the front only its top shows, between the belt and the bezel.
    new Mesh3D({
      geometry: roundedBox(0.3, 1.0, 0.16, 0.06),
      material: clayMaterial('purple'),
      position: { x: 0, y: 1.5, z: -0.08 },
    }),
    new Mesh3D({
      geometry: roundedBox(width + 0.3, height + 0.3, 0.24, 0.1),
      material: clayMaterial('lilac'),
      position: { x: 0, y: SCREEN_Y, z: -0.2 },
    }),
    face,
  );

  return monitor;
}
