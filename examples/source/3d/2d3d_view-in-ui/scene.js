/**
 * The props: the product card the view sits in, built from plain pixi objects the way an app's UI is, and the stage
 * settings a view inside a card needs
 *
 * The card is a rounded panel with a title, a subtitle and a row of colour swatches that listen for taps. `index.ts`
 * adds the view to it, so the view takes the card's position and scale like any of its children.
 */

import { Container, Graphics, Rectangle, Sprite, Text, Texture } from 'pixi.js';

import { NARROW_BELOW, overlayColor } from './theme/overlay';
import { BRAND, mixColor, THEMES } from './theme/palette';

/**
 * The card's size in its own px, and the margin inside its edges that its text keeps. It ends 20 px under the
 * lowest, tallest view the pane allows.
 */
const CARD = { width: 440, height: 540, radius: 24, inset: 24 };
/**
 * The farthest the pane's Layout rows move and widen the view, in the card's px. At x 60 the view's right edge runs
 * 20 px past the card's, which shows the card doesn't clip it.
 */
export const VIEW_REACH = { x: 60, width: 400 };
/** The swatches' colours, the logo's own pink first */
const SWATCH_COLORS = [BRAND.logoFace, BRAND.purple, BRAND.sky, BRAND.orange];
/** A swatch's radius in the card's px, a finger's width across */
const SWATCH_RADIUS = 18;
/** The swatch row's middle and spacing in the card's px: inside the view's rectangle, under the logo */
const SWATCH_ROW = { y: 414, spacing: 60 };
/**
 * ThemePane opens folded on a screen under 600 px wide or 500 px tall, to a bar over the top-right corner. A wide
 * screen keeps the pane's column either way; a tall one keeps it only where the pane opens, and the bar's band where
 * it folds.
 */
const SHORT_BELOW = 500;
const PANE_ROOM = 280;
const PANE_BAR = 52;
/** The gap to the screen's edges */
const GUTTER = 16;
/** How near the screen's edge the pane may slide the view, in px */
const EDGE = 8;
/** The card's fill on the dark theme: a step up from the page, so the card reads as one */
const DARK_PANEL = mixColor(THEMES.dark.haze, THEMES.dark.floor, 0.25);
const FONT = 'system-ui, sans-serif';

/** The page: a product card with a title, a subtitle and four colour swatches, on a backdrop that fills the screen */
export function createProductCard() {
  const backdrop = new Sprite(Texture.WHITE);
  const card = new Container({ label: 'card' });
  const panel = new Graphics()
    .roundRect(0, 0, CARD.width, CARD.height, CARD.radius)
    .fill(0xffffff);
  const border = new Graphics({ alpha: 0.15 })
    .roundRect(0, 0, CARD.width, CARD.height, CARD.radius)
    .stroke({ width: 1, color: 0xffffff });
  // Drawn white and tinted, so a theme fade only re-tints them.
  const title = new Text({
    text: 'PixiJS logo',
    style: {
      fontFamily: FONT,
      fontSize: 26,
      fontWeight: '700',
      fill: 0xffffff,
    },
    position: { x: CARD.inset, y: 20 },
  });
  const subtitle = new Text({
    text: 'Drag to turn it. Tap a colour.',
    style: { fontFamily: FONT, fontSize: 15, fill: 0xffffff },
    position: { x: CARD.inset, y: 56 },
  });
  const swatches = new Container({ label: 'swatches' });
  const check = new Graphics()
    .moveTo(-7, 0)
    .lineTo(-2, 5)
    .lineTo(8, -6)
    .stroke({ width: 3, color: 0xffffff, cap: 'round', join: 'round' });
  const firstX =
    (CARD.width - SWATCH_ROW.spacing * (SWATCH_COLORS.length - 1)) / 2;
  // Each listens for taps like any pixi button.
  const circles = SWATCH_COLORS.map((color, i) => {
    const circle = new Graphics({
      eventMode: 'static',
      cursor: 'pointer',
      position: { x: firstX + i * SWATCH_ROW.spacing, y: SWATCH_ROW.y },
    });

    circle.circle(0, 0, SWATCH_RADIUS).fill(color);
    circle.on('pointertap', () => pick(i));

    return circle;
  });
  const viewRoom = new Rectangle();
  let onPicked = null;
  let painted = -1;

  function pick(i) {
    check.position.copyFrom(circles[i].position);
    onPicked?.(SWATCH_COLORS[i]);
  }

  swatches.addChild(...circles, check);
  check.position.copyFrom(circles[0].position);
  card.addChild(panel, border, title, subtitle, swatches);

  return {
    root: new Container({ children: [backdrop, card] }),
    card,
    swatches,
    viewRoom,
    onPick(fn) {
      onPicked = fn;
    },
    layout(screen) {
      const tall = screen.height > screen.width;
      const paneOpen =
        screen.width >= NARROW_BELOW && screen.height >= SHORT_BELOW;
      const room = screen.width - (paneOpen || !tall ? PANE_ROOM : 0);
      const top = tall && !paneOpen ? PANE_BAR : GUTTER;
      const scale = Math.min(
        1,
        (room - GUTTER * 2) / CARD.width,
        (screen.height - top - GUTTER) / CARD.height,
      );

      backdrop.setSize(screen.width, screen.height);
      card.scale.set(scale);
      card.position.set(
        Math.round((room - CARD.width * scale) / 2),
        Math.round(Math.max(top, (screen.height - CARD.height * scale) / 2)),
      );
      viewRoom.x = EDGE;
      viewRoom.width = room - EDGE * 2;
    },
    paint(darkness) {
      if (darkness === painted) return;
      painted = darkness;
      backdrop.tint = mixColor(THEMES.light.haze, THEMES.dark.haze, darkness);
      panel.tint = mixColor(BRAND.white, DARK_PANEL, darkness);
      // Mid-fade the panel is grey, so each text takes whichever theme's ink reads better on it rather than a mix.
      title.tint = overlayColor('ink', darkness);
      subtitle.tint = border.tint = overlayColor('inkSoft', darkness);
    },
  };
}

/**
 * Fits the stage to a view inside a card: it keeps its lights and theme and loses what a card has no use for, the
 * floor (the card is the floor here), the fog (nothing in a card is far away) and the shadows, which have nowhere to
 * land
 */
export function fitStageToCard(stage, view3d) {
  stage.floor.visible = false;
  stage.key.castShadow = false;
  if (stage.spot) stage.spot.castShadow = false;
  view3d.fog = null;
}
