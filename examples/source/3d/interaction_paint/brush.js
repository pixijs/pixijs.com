/**
 * The brush: round strokes on a canvas's 2D context, pixel to pixel
 *
 * Plain 2D drawing with nothing 3D in it. `index.ts` turns each hit's uv into a canvas pixel and hands it here, then
 * sends the canvas to the GPU once a frame while `dirty` says something was painted.
 */

import { Point } from 'pixi.js';

import { cssColor } from './theme/palette';

/**
 * A jump between two points wider than this share of the canvas is a stroke crossing the ball's seam, where u wraps
 * from 1 to 0: a line there would streak across the whole picture, so the stroke starts again on the other side
 */
const MAX_JOIN = 0.25;

export function createBrush({ paint, primer, radius, color }) {
  const last = new Point();
  let open = false;
  const brush = {
    radius,
    color,
    dirty: false,
    apply() {
      paint.fillStyle = paint.strokeStyle = cssColor(brush.color);
      paint.lineWidth = brush.radius * 2;
    },
    strokeTo(x, y) {
      paint.beginPath();
      if (open && Math.abs(x - last.x) < paint.canvas.width * MAX_JOIN) {
        paint.moveTo(last.x, last.y);
        paint.lineTo(x, y);
        paint.stroke();
      } else {
        paint.arc(x, y, brush.radius, 0, Math.PI * 2);
        paint.fill();
      }
      last.set(x, y);
      open = true;
      brush.dirty = true;
    },
    lift() {
      open = false;
    },
    clear() {
      // Saved and restored round the primer, so the brush's own style survives it.
      paint.save();
      primer(paint);
      paint.restore();
      open = false;
      brush.dirty = true;
    },
  };

  paint.lineCap = 'round';
  primer(paint);
  brush.apply();

  return brush;
}
