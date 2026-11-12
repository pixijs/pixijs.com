/**
 * The props: the striped 2D panel behind the view, the page colour round it, and where the card fits on the screen
 *
 * None of it is 3D. The panel is what the mask's cut corners and the fade show through to.
 */

import {
  Container,
  Graphics,
  Rectangle,
  Sprite,
  Texture,
  TilingSprite,
} from 'pixi.js';

import { BRAND, CLAY, THEMES, mixColor } from './theme/palette';

/**
 * The view's narrowest and widest shapes, width over height. Between them the view fills the place the pane leaves;
 * past them it would be a strip of floor, so it stops there and centres.
 */
const MIN_ASPECT = 0.6;
const MAX_ASPECT = 2;
/**
 * How far the striped panel stands out past the view on every side, the screen edge's gutter, and the gap kept from
 * the pane, in px. A phone gets half of each, so the view takes more of its narrow screen.
 */
const PANEL_MARGIN = 24;
const GUTTER = 16;
const PANE_GAP = 24;
/** A screen whose shorter side is under this, in px, is a phone's, either way up */
const PHONE_BELOW = 500;
/** The stripes repeat every 16 px across, each 5 px wide */
const STRIPE_EVERY = 16;
const STRIPE_WIDTH = 5;

/**
 * The panel's fill and stripes on each theme: lilac on a pale lilac, and a dim purple on night. Both sit darker than
 * the checker floor, so the mask's cut corners read against it at a glance.
 */
const LIGHT_FILL = mixColor(BRAND.white, CLAY.lilac, 0.22);
const DARK_FILL = mixColor(BRAND.night, BRAND.purple, 0.08);
const LIGHT_STRIPE = mixColor(BRAND.white, BRAND.purple, 0.55);
const DARK_STRIPE = mixColor(BRAND.purple, BRAND.night, 0.6);

/** Builds the striped panel and paints it, and the page, for the stage's theme */
export function createPage({ app, stage }) {
  const fill = new Sprite({ texture: Texture.WHITE, anchor: 0.5 });
  const stripes = new TilingSprite({
    texture: stripeTile(app.renderer),
    anchor: 0.5,
  });
  const panel = new Container({ children: [fill, stripes] });
  let paintedDarkness = -1;

  const page = {
    panel,
    frameView({ width, height, margin }) {
      fill.setSize(width + margin * 2, height + margin * 2);
      stripes.setSize(width + margin * 2, height + margin * 2);
    },
    update() {
      const { darkness } = stage;

      if (darkness === paintedDarkness) return;
      paintedDarkness = darkness;
      app.renderer.background.color = mixColor(
        THEMES.light.haze,
        THEMES.dark.haze,
        darkness,
      );
      fill.tint = mixColor(LIGHT_FILL, DARK_FILL, darkness);
      stripes.tint = mixColor(LIGHT_STRIPE, DARK_STRIPE, darkness);
    },
  };

  page.update();

  return page;
}

/** One tile of the stripes, drawn once in white so a tint colours it; the bands meet across the tile's edges */
function stripeTile(renderer) {
  const tile = new Graphics();

  for (const x of [-STRIPE_EVERY, 0, STRIPE_EVERY])
    tile.moveTo(x, STRIPE_EVERY).lineTo(x + STRIPE_EVERY, 0);
  tile.stroke({ color: 0xffffff, width: STRIPE_WIDTH });

  const texture = renderer.generateTexture({
    target: tile,
    frame: new Rectangle(0, 0, STRIPE_EVERY, STRIPE_EVERY),
    antialias: true,
  });

  tile.destroy();

  return texture;
}

/** The card's centre, the view's size, and how far the striped panel stands out past it, in px */

/**
 * Where the card goes: in one of the two places the pane leaves, beside it or under it, whichever shows the logo bigger
 *
 * The view fills its place, keeping its shape between `MIN_ASPECT` and `MAX_ASPECT`. The logo grows with the view's
 * height until the view is narrower than `fitAspect`, where `fitPortrait` backs the camera off and the logo grows with
 * the width instead. The card centres in its place's height, and on the screen unless that would run under the pane.
 */
export function fitCard(screen, pane, fitAspect) {
  const spacing = Math.min(screen.width, screen.height) < PHONE_BELOW ? 0.5 : 1;
  const gutter = GUTTER * spacing;
  const gap = PANE_GAP * spacing;
  const beside = new Rectangle(
    gutter,
    gutter,
    pane.left - gap - gutter,
    screen.height - gutter * 2,
  );
  const under = new Rectangle(
    gutter,
    pane.bottom + gap,
    screen.width - gutter * 2,
    0,
  );

  under.height = screen.height - gutter - under.y;

  const besideFit = fitIn(beside, PANEL_MARGIN * spacing, screen.width);
  const underFit = fitIn(under, PANEL_MARGIN * spacing, screen.width);
  const logoSize = (fit) => Math.min(fit.width, fit.height * fitAspect);

  return logoSize(underFit) > logoSize(besideFit) ? underFit : besideFit;
}

/** The card's biggest fit in one place, with the panel standing `margin` px out past the view */
function fitIn(place, margin, screenWidth) {
  const roomWidth = place.width - margin * 2;
  const roomHeight = place.height - margin * 2;
  // Even sizes keep the view's edges, centred on a whole pixel, on whole pixels too.
  const width = even(Math.max(Math.min(roomWidth, roomHeight * MAX_ASPECT), 2));
  const height = even(Math.max(Math.min(roomHeight, width / MIN_ASPECT), 2));

  return {
    x: Math.round(Math.min(screenWidth / 2, place.right - margin - width / 2)),
    y: Math.round(place.y + place.height / 2),
    width,
    height,
    margin,
  };
}

function even(value) {
  return 2 * Math.floor(value / 2);
}
