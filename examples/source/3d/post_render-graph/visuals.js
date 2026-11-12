/**
 * What the frame draws to explain the render graph: the frame's copies, in run order, at the right or along the bottom
 *
 * Each inset shows one copy's texture, named for the point in the list it was taken at. Beyond sizing the copies to
 * the insets, it changes nothing, so `index.ts` teaches the same without it.
 */

import { InsetView } from './theme/InsetView';
import { NARROW_BELOW } from './theme/overlay';

/** Wider screens than this, width over height, stack the copies down the right side, clear of the logo */
const COLUMN_ABOVE_ASPECT = 1.2;
/** In the column: the widest picture in px, its shape, and the most of the screen's width it takes */
const COLUMN_WIDTH = 240;
const COLUMN_ASPECT = 1.6;
const COLUMN_WIDTH_SHARE = 0.2;
/** The band the column leaves the pane at the top, in px: it opens on a screen 500 px tall or more, folded under */
const PANE_OPEN = 236;
const PANE_FOLDED = 60;
const PANE_FOLDS_BELOW = 500;
/** Narrower screens put them side by side along the bottom, under the logo: the widest picture and its shape */
const ROW_WIDTH = 224;
const ROW_ASPECT = 1.25;
/** Px between the insets, from them to the screen's edges, and the title tag's height above each */
const GAP = 12;
const MARGIN = 24;
const NARROW_MARGIN = 16;
const TAG = 16;

export function createVisuals({ app, stage, copies }) {
  const frameCopies = Object.values(copies);
  // Each tag centred over its picture, so a name wider than a small picture spills evenly into the gaps.
  const insets = Object.entries(copies).map(
    ([title, copy]) =>
      new InsetView({
        app,
        stage,
        texture: copy.texture,
        title,
        titleCorner: 'top',
      }),
  );
  const screen = app.screen;
  // The screen size the copies were last laid out for, so they lay out again only when it changes.
  const laidOut = { width: 0, height: 0 };

  app.stage.addChild(...insets);

  /**
   * Sizes the pictures and their copies, and places them in run order: top to bottom in a column at the right, under
   * the pane, or left to right in a row along the bottom
   */
  function layout() {
    const count = insets.length;
    const column = screen.width / screen.height > COLUMN_ABOVE_ASPECT;
    const margin = screen.width < NARROW_BELOW ? NARROW_MARGIN : MARGIN;
    const rim = insets[0].padding * 2;
    let width;

    if (column) {
      const top = screen.height >= PANE_FOLDS_BELOW ? PANE_OPEN : PANE_FOLDED;
      const tall =
        (screen.height - top - margin - GAP * (count - 1)) / count - TAG - rim;

      width = Math.min(
        COLUMN_WIDTH,
        screen.width * COLUMN_WIDTH_SHARE,
        tall * COLUMN_ASPECT,
      );
    } else {
      width = Math.min(
        ROW_WIDTH,
        (screen.width - margin * 2 - GAP * (count - 1)) / count - rim,
      );
    }
    width = Math.floor(width);

    const height = Math.round(width / (column ? COLUMN_ASPECT : ROW_ASPECT));
    const stepX = column ? 0 : width + rim + GAP;
    const stepY = column ? height + rim + GAP + TAG : 0;
    const left = column
      ? screen.width - margin - width - rim
      : (screen.width - stepX * (count - 1) - width - rim) / 2;
    const top = screen.height - margin - height - rim - stepY * (count - 1);

    for (let i = 0; i < count; i++) {
      insets[i]
        .setSize(width, height)
        .position.set(
          Math.round(left + i * stepX),
          Math.round(top + i * stepY),
        );
      // The view fills the screen, so the frame a copy crops has the screen's shape.
      frameCopies[i].resize(
        width,
        height,
        app.renderer.resolution,
        screen.width / screen.height,
      );
    }
    laidOut.width = screen.width;
    laidOut.height = screen.height;
  }

  return {
    update() {
      if (laidOut.width !== screen.width || laidOut.height !== screen.height)
        layout();
      for (const inset of insets) inset.update();
    },
  };
}
