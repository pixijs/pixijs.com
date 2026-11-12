/** The 2D pixi UI the monitor's screen shows: the PixiJS wordmark bouncing round the screen, over a clock's strip */

import { Container, Graphics, Text } from 'pixi.js';

import { BRAND } from './theme/palette';
import { brandWordmarkContext, WORDMARK_SIZE } from './theme/wordmark';

/** The wordmark's height in UI pixels: big enough to lead the screen, small enough to travel across it */
const LOGO_HEIGHT = 84;
/** The space the wordmark keeps from the screen's edges and the strip, in UI pixels */
const MARGIN = 16;
/** The strip along the bottom that holds the clock, and the rule over it, in UI pixels; the wordmark stays above */
const STRIP_HEIGHT = 52;
const RULE = 2;
/** The wordmark crosses the screen in 3 s and runs top to bottom in 2 s, so every bounce lands on a whole second */
const CROSS_SECONDS = 3;
const DROP_SECONDS = 2;

/** Builds the UI at `width` × `height` pixels, posed for time 0 so a capture straight away shows the opening frame */
export function createScreenUi({ width, height }) {
  const logoSize = {
    width: (LOGO_HEIGHT * WORDMARK_SIZE.width) / WORDMARK_SIZE.height,
    height: LOGO_HEIGHT,
  };
  const stripTop = height - STRIP_HEIGHT;
  // The wordmark's centre runs between the screen's edges and the rule, less its own half-size and the margin.
  const left = MARGIN + logoSize.width / 2;
  const right = width - left;
  const top = MARGIN + logoSize.height / 2;
  const bottom = stripTop - RULE - top;
  const logo = new Graphics({
    context: brandWordmarkContext(),
    pivot: { x: WORDMARK_SIZE.width / 2, y: WORDMARK_SIZE.height / 2 },
    scale: LOGO_HEIGHT / WORDMARK_SIZE.height,
  });
  const clock = new Text({
    text: '00:00',
    anchor: 0.5,
    position: { x: width / 2, y: stripTop + STRIP_HEIGHT / 2 },
    // Twice the UI's pixels, so it stays sharp in a texture at resolution 2.
    resolution: 2,
    style: {
      fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
      fontSize: 30,
      fill: BRAND.white,
    },
  });
  const root = new Container({ label: 'ui' });

  root.addChild(
    // Texels nothing covers stay transparent black, which an opaque material shows as black, so a backdrop fills them.
    new Graphics().rect(0, 0, width, height).fill(BRAND.night),
    new Graphics()
      .rect(0, stripTop - RULE, width, RULE)
      .fill({ color: BRAND.purple, alpha: 0.6 }),
    clock,
    logo,
  );

  let second = 0;

  function update(time) {
    // A triangle wave on each axis; half a period's offset on y starts the wordmark mid-height, heading down.
    logo.position.set(
      left + (right - left) * triangle(time / CROSS_SECONDS),
      top + (bottom - top) * triangle(time / DROP_SECONDS + 0.5),
    );

    const now = Math.floor(time);

    if (now === second) return false;
    second = now;
    clock.text = `${twoDigits(Math.floor(now / 60) % 60)}:${twoDigits(now % 60)}`;

    return true;
  }

  update(0);

  return { root, logo, logoSize, update };
}

/** 0 at even `u` and 1 at odd, in straight lines between: a bounce at every whole `u` */
function triangle(u) {
  return 1 - Math.abs((((u % 2) + 2) % 2) - 1);
}

function twoDigits(value) {
  return value < 10 ? `0${value}` : `${value}`;
}
