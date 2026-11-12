/**
 * The props: the primer the ball wears under the paint, and the camera round the ball
 *
 * A real project paints over whatever base texture it has. The primer here is a grid in uv space, so the ball wears
 * its own uv layout.
 */

import { OrbitCamera } from '@pixi/3d/extras';

import { fitPortrait } from './theme/fitPortrait';
import { BRAND, CLAY, cssColor } from './theme/palette';

/** The primer's grid: columns round the ball, which meet at the poles, and rows from pole to pole */
const GRID_COLUMNS = 8;
const GRID_ROWS = 4;
/** A thin, see-through grid line, so paint sits over it */
const GRID_WIDTH = 3;
const GRID_ALPHA = 0.8;
/** Drawn down both edges of the canvas, half of it shows on each, so the seam is one meridian twice as wide */
const SEAM_WIDTH = 6;

/** The narrowest view, width over height, that shows the ball whole from the landscape distance */
const FIT_ASPECT = 0.62;
/** Px a phone keeps free over the ball for the collapsed pane */
const PANE_CLEAR = 64;

/** Paints the primer over the whole canvas: white, the uv grid in lilac, and the seam in purple down both edges */
export function drawPrimer(paint) {
  const { width, height } = paint.canvas;

  paint.fillStyle = cssColor(BRAND.white);
  paint.fillRect(0, 0, width, height);
  paint.beginPath();
  for (let i = 1; i < GRID_COLUMNS; i++) {
    paint.moveTo((i / GRID_COLUMNS) * width, 0);
    paint.lineTo((i / GRID_COLUMNS) * width, height);
  }
  for (let i = 1; i < GRID_ROWS; i++) {
    paint.moveTo(0, (i / GRID_ROWS) * height);
    paint.lineTo(width, (i / GRID_ROWS) * height);
  }
  paint.globalAlpha = GRID_ALPHA;
  paint.strokeStyle = cssColor(CLAY.lilac);
  paint.lineWidth = GRID_WIDTH;
  paint.stroke();
  paint.beginPath();
  paint.moveTo(0, 0);
  paint.lineTo(0, height);
  paint.moveTo(width, 0);
  paint.lineTo(width, height);
  paint.globalAlpha = 1;
  paint.strokeStyle = cssColor(BRAND.purple);
  paint.lineWidth = SEAM_WIDTH;
  paint.stroke();
}

/**
 * Aims the camera at the ball, with an orbit round it that stays above the floor, and on a phone backs the camera off
 * until the ball fits under the pane
 */
export function frameBall({ renderer, view3d, stage, ball }) {
  view3d.camera.fov = 40;
  view3d.camera.position.set(0, 2.4, 7);

  const orbit = new OrbitCamera({
    view: view3d,
    target: ball.position,
    enableDamping: true,
    enablePan: false,
    minDistance: 5,
    maxDistance: 12,
    // Stays above the floor.
    maxPolarAngle: Math.PI * 0.45,
  });

  fitPortrait({
    renderer,
    orbit,
    stage,
    minAspect: FIT_ASPECT,
    clearTop: PANE_CLEAR,
  });

  return orbit;
}
