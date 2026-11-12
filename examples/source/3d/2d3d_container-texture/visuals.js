/**
 * What the frame draws to explain the capture: while only the dirty flag captures, an outline round the wordmark
 * where the container has it now, so the reader sees the screen's wordmark fall behind it and catch up at each capture
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { PathHelper } from './theme/PathHelper';

/** How far the outline floats off the glass: clear of it, but close enough to read as a mark on the picture */
const LIFT = 0.03;
/** The space between the wordmark's edges and the outline, in UI pixels */
const PADDING = 8;

export function createVisuals({ monitor, ui, uiSize }) {
  const { logo, logoSize } = ui;
  const outline = new PathHelper({
    color: 'accent',
    thickness: 0.014,
    closed: true,
    parent: monitor.screen,
  });
  const scaleX = monitor.size.width / uiSize.width;
  const scaleY = monitor.size.height / uiSize.height;
  const halfX = (logoSize.width / 2 + PADDING) * scaleX;
  const halfY = (logoSize.height / 2 + PADDING) * scaleY;

  outline.setPoints(
    new Float32Array([
      -halfX,
      -halfY,
      0,
      halfX,
      -halfY,
      0,
      halfX,
      halfY,
      0,
      -halfX,
      halfY,
      0,
    ]),
  );

  return {
    /** `onChange` says the screen captures only when the flag is set, so its wordmark can lag the container's */
    update(onChange) {
      outline.visible = onChange;
      // UI pixels run y down from the top-left; the plane's units run y up from its middle.
      outline.position.set(
        (logo.x - uiSize.width / 2) * scaleX,
        (uiSize.height / 2 - logo.y) * scaleY,
        LIFT,
      );
    },
  };
}
