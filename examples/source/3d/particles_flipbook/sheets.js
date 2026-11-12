/**
 * The particles' pictures, drawn once on canvases in palette colours: a 4 × 4 flame sheet, a 2 × 2 sheet of smoke
 * puffs and a soft ring
 *
 * A real effect would load its sheets from a texture packer; drawing them here keeps the example free of assets and
 * the grid exact.
 */

import { Texture } from 'pixi.js';

import { BRAND, cssColor, mixColor } from './theme/palette';

/** The flame sheet's grid: 16 frames of a flame's life */
export const FLAME_GRID = { columns: 4, rows: 4 };
/** The smoke sheet's grid: four puff shapes */
export const SMOKE_GRID = { columns: 2, rows: 2 };
/** One cell's side on every sheet, in px */
const CELL = 128;
/** Px each picture keeps clear of its cell's edge, so sampling a cell never bleeds its neighbour in */
const FLAME_PAD = 10;
/** Where a flame's round base sits on its cell: the bottom of the base, and the base's radius when it's newborn */
const FLAME_BASE = { bottom: CELL - FLAME_PAD - 6, radius: 38 };
/**
 * The four smoke puffs, each a few overlapping soft discs: x and y from the cell's middle, then the radius, in px. A
 * round puff, a wide pair, a three-lobed cloud and a tall stack, so they tell apart on the sheet and in the column
 */
const PUFFS = [
  [0, 4, 44, -14, -10, 26, 16, -8, 24],
  [-22, 6, 30, 22, 2, 32, 0, -10, 20],
  [-26, 14, 24, 26, 14, 24, 0, -8, 34],
  [0, 20, 30, 4, -18, 28, -10, -38, 16],
];

/**
 * A flame's life in 16 frames, left to right then top to bottom: a small bright teardrop, a tall orange tongue, then a
 * pink wisp that splits off and fades, so a flame on its last frame is nearly gone and never pops
 */
export function drawFlameSheet() {
  const last = FLAME_GRID.columns * FLAME_GRID.rows - 1;

  return drawSheet(FLAME_GRID.columns, FLAME_GRID.rows, (context, frame) =>
    drawFlame(context, frame / last, 10 * Math.sin(1.9 * frame)),
  );
}

/** Four different white puffs on a 2 × 2 sheet; white, so a particle's `color` tints them */
export function drawSmokeSheet() {
  return drawSheet(SMOKE_GRID.columns, SMOKE_GRID.rows, (context, frame) => {
    const puff = PUFFS[frame];

    for (let i = 0; i < puff.length; i += 3) {
      const x = CELL / 2 + puff[i];
      const y = CELL / 2 + puff[i + 1];
      const gradient = context.createRadialGradient(x, y, 0, x, y, puff[i + 2]);

      // A firm core with a soft rim, so each disc keeps its outline where it overlaps the others.
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.55)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, CELL, CELL);
    }
  });
}

/** A soft white ring, clear in the middle and at the edge; white, so a particle's `color` tints it */
export function drawRingTexture() {
  return drawSheet(1, 1, (context) => {
    const half = CELL / 2;
    const gradient = context.createRadialGradient(
      half,
      half,
      0,
      half,
      half,
      half,
    );

    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.82, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.94, 'rgba(255, 255, 255, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, CELL, CELL);
  });
}

/**
 * One flame frame in the cell at the context's origin: an orange body cooling to pink at its tip, round a bright core
 * that fades as the flame ages
 * @param context - Drawn into, its origin at the cell's top left.
 * @param t - How far through its life the frame is, 0 to 1.
 * @param lean - How far the tip leans sideways, in px.
 */
function drawFlame(context, t, lean) {
  const radius = FLAME_BASE.radius * (1 - 0.45 * t);
  const x = CELL / 2;
  const y = FLAME_BASE.bottom - radius;
  // Tallest a third of the way through; past the middle the body sinks as its top breaks away.
  const sink = t > 0.55 ? 1 - (t - 0.55) * 1.2 : 1;
  const height = (70 + 30 * Math.sin(Math.PI * Math.min(1, 1.6 * t))) * sink;
  const tip = FLAME_BASE.bottom - height;
  const tipColor = cssColor(mixColor(BRAND.hotPink, BRAND.purple, t));
  // Solid for most of its life, then fading to 0.12 on the last frame, so a dying flame never pops.
  const fade = t < 0.6 ? 1 : 1 - ((t - 0.6) / 0.4) * 0.88;
  const body = context.createLinearGradient(0, FLAME_BASE.bottom, 0, tip);
  const core = context.createLinearGradient(0, FLAME_BASE.bottom, 0, tip);

  body.addColorStop(
    0,
    cssColor(mixColor(BRAND.orange, BRAND.hotPink, 0.3 * t)),
  );
  body.addColorStop(
    0.5,
    cssColor(mixColor(BRAND.orange, BRAND.hotPink, 0.35 + 0.4 * t)),
  );
  body.addColorStop(1, tipColor);
  core.addColorStop(0, cssColor(BRAND.white));
  core.addColorStop(1, cssColor(mixColor(BRAND.white, BRAND.orange, 0.6)));
  context.globalAlpha = fade;
  context.shadowColor = cssColor(BRAND.orange);
  context.shadowBlur = 8;
  context.fillStyle = body;
  teardrop(context, x, y, radius, x + lean, tip);
  context.shadowBlur = 0;
  context.globalAlpha *= 1 - t;
  context.fillStyle = core;
  teardrop(
    context,
    x,
    y + radius * 0.3,
    radius * 0.55,
    x + lean * 0.5,
    FLAME_BASE.bottom - height * 0.6,
  );
  context.globalAlpha = fade;
  if (t > 0.55) {
    const rise = (t - 0.55) * 40;

    context.fillStyle = tipColor;
    teardrop(
      context,
      x + lean * 1.4,
      tip - 8 - rise,
      8 - 4 * t,
      x + lean * 1.8,
      tip - 28 - rise,
    );
  }
  context.globalAlpha = 1;
}

/** Fills a teardrop: a round base of `radius` centred on (x, y), narrowing to a point at (tipX, tipY) */
function teardrop(context, x, y, radius, tipX, tipY) {
  const rise = y - tipY;

  context.beginPath();
  context.moveTo(x + radius, y);
  context.arc(x, y, radius, 0, Math.PI);
  context.bezierCurveTo(
    x - radius,
    y - rise * 0.45,
    tipX - radius * 0.3,
    tipY + rise * 0.25,
    tipX,
    tipY,
  );
  context.bezierCurveTo(
    tipX + radius * 0.3,
    tipY + rise * 0.25,
    x + radius,
    y - rise * 0.45,
    x + radius,
    y,
  );
  context.fill();
}

/** A mipmapped sheet of `columns` × `rows` cells, each drawn by `draw` with the context's origin at its top left */
function drawSheet(columns, rows, draw) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = columns * CELL;
  canvas.height = rows * CELL;
  for (let frame = 0; frame < columns * rows; frame++) {
    context.save();
    context.translate(
      (frame % columns) * CELL,
      Math.floor(frame / columns) * CELL,
    );
    context.beginPath();
    context.rect(0, 0, CELL, CELL);
    context.clip();
    draw(context, frame);
    context.restore();
  }

  return Texture.from({ resource: canvas, autoGenerateMipmaps: true });
}
