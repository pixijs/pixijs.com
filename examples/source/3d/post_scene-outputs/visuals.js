/**
 * What the frame draws to explain scene outputs: a card for each output's copy, down the right or along the bottom
 *
 * Each card shows the middle of one `ExtractPass`'s texture, through a `Texture` frame over its source, so the subject
 * fills the small picture. A card whose pass is off holds no picture, only a `not written` tag, since the copy keeps
 * the last frame it took. It reads the passes each frame and never changes them, so `index.ts` runs the same without
 * it.
 */

import { Rectangle, Texture } from 'pixi.js';

import { InsetView } from './theme/InsetView';

import { LabelLayer } from './theme/LabelLayer';
import { NARROW_BELOW } from './theme/overlay';

/**
 * Wider screens than this, width over height, stack the cards down the right side, beside the shapes' arc. Squarer
 * ones have no room there, so the cards go side by side along the bottom, under it.
 */
const COLUMN_ABOVE_ASPECT = 1.55;
/**
 * How far the logo and the shapes reach at the opening pose, in shares of the screen's height from its middle: to
 * either side, and down. The cards keep out of that box.
 */
const SUBJECT = { side: 0.46, below: 0.2 };
/** In the column: the widest picture in px and its shape */
const COLUMN_WIDTH = 240;
const COLUMN_ASPECT = 1.6;
/** In the row: the widest picture in px and its shape */
const ROW_WIDTH = 224;
const ROW_ASPECT = 1.25;
/** Px between the cards, from them to the screen's edges, and the title tag's height above each */
const GAP = 12;
const MARGIN = 24;
const NARROW_MARGIN = 16;
const TAG = 16;
/**
 * The box round the frame's middle, where the orbit holds the subject, that a card shows at least, in shares of the
 * frame's height: as wide as the arc with a little floor either side, and tall enough for the logo
 */
const CROP = { width: 1, height: 0.6 };

export function createVisuals({ app, view3d, stage, pane, extracts }) {
  const screen = app.screen;
  const labels = new LabelLayer({ view3d, stage, bounds: screen });
  // Each tag centred over its picture, so a name wider than a small picture spills evenly into the gaps.
  const cards = Object.entries(extracts).map(([title, extract]) => {
    // Dynamic, so the card's sprite hears each refit of the frame.
    const crop = new Texture({
      source: extract.texture.source,
      frame: new Rectangle(0, 0, 1, 1),
      dynamic: true,
    });
    const notWritten = labels.add({
      text: 'not written',
      screen: { x: 0, y: 0 },
    });

    return {
      extract,
      inset: new InsetView({
        app,
        stage,
        texture: crop,
        title,
        titleCorner: 'top',
      }),
      crop,
      notWritten,
      // Added with a screen point, so it has one.
      tagAt: notWritten.screen,
      showing: null,
      fitted: { width: 0, height: 0, aspect: 0 },
    };
  });
  // The screen size and pane height the cards were last laid out for.
  const laidOut = { width: 0, height: 0 };
  // The pictures' shape, width over height, at the last layout.
  let pictureAspect = 1;
  let paneResized = true;

  // Tweakpane's fold animates the pane's height, and the observer follows it frame by frame.
  new ResizeObserver(() => (paneResized = true)).observe(pane.element);
  app.stage.addChild(...cards.map((card) => card.inset), labels);

  /**
   * Sizes and places the pictures in card order: top to bottom in a column at the right, under the pane, or left to
   * right in a row along the bottom
   */
  function layOut() {
    if (
      !paneResized &&
      laidOut.width === screen.width &&
      laidOut.height === screen.height
    )
      return;
    paneResized = false;
    laidOut.width = screen.width;
    laidOut.height = screen.height;

    const count = cards.length;
    const column = screen.width / screen.height > COLUMN_ABOVE_ASPECT;
    const margin = screen.width < NARROW_BELOW ? NARROW_MARGIN : MARGIN;
    const rim = cards[0].inset.padding * 2;
    let width;

    if (column) {
      const paneBottom = pane.element.getBoundingClientRect().bottom;
      const tall =
        (screen.height - paneBottom - GAP - margin - GAP * (count - 1)) /
          count -
        TAG -
        rim;
      const beside =
        screen.width / 2 - SUBJECT.side * screen.height - GAP - margin - rim;

      width = Math.min(COLUMN_WIDTH, tall * COLUMN_ASPECT, beside);
    } else {
      const across =
        (screen.width - margin * 2 - GAP * (count - 1)) / count - rim;
      const under =
        screen.height * (0.5 - SUBJECT.below) - GAP - TAG - rim - margin;

      width = Math.min(ROW_WIDTH, across, under * ROW_ASPECT);
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
      cards[i].inset
        .setSize(width, height)
        .position.set(
          Math.round(left + i * stepX),
          Math.round(top + i * stepY),
        );
    }
    pictureAspect = width / height;
  }

  /**
   * Frames the middle of the copy in the picture's shape, so nothing stretches: the smallest frame that holds the
   * subject's box, shrunk to fit a copy too narrow for it, as on a phone. The pass sizes its texture to the view as
   * the view renders, so the frame follows whenever that size or the picture's shape changes.
   */
  function fitCrop(card) {
    const { source } = card.extract.texture;
    const { fitted, crop } = card;
    const aspect = pictureAspect;

    if (
      fitted.width === source.width &&
      fitted.height === source.height &&
      fitted.aspect === aspect
    )
      return;
    fitted.width = source.width;
    fitted.height = source.height;
    fitted.aspect = aspect;

    const wanted = Math.max(CROP.width, CROP.height * aspect) * source.height;
    const width = Math.min(wanted, source.width, source.height * aspect);
    const height = width / aspect;

    crop.frame.x = (source.width - width) / 2;
    crop.frame.y = (source.height - height) / 2;
    crop.frame.width = width;
    crop.frame.height = height;
    crop.update();
  }

  /** Shows the copy while the pass writes it, and an empty picture while it doesn't */
  function showState(card) {
    const { enabled } = card.extract;

    if (card.showing === enabled) return;
    card.showing = enabled;
    card.inset.texture = enabled ? card.crop : Texture.EMPTY;
    card.notWritten.hidden = enabled;
  }

  return {
    update(dt) {
      layOut();
      for (const card of cards) {
        const { inset } = card;

        fitCrop(card);
        showState(card);
        inset.update(dt);
        card.tagAt.set(
          inset.picture.x + inset.picture.width / 2,
          inset.picture.y + inset.picture.height / 2,
        );
      }
      labels.update();
    },
  };
}
