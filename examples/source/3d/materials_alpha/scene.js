/**
 * The props: the wordmark texture, the PixiJS wordmark on an otherwise clear card; the two cards that wear it; and
 * where the cards and the glass logo float and sway
 */

import { Mesh3D, PlaneGeometry } from '@pixi/3d';

import { Graphics, Rectangle } from 'pixi.js';

import { WORDMARK_SIZE, brandWordmarkContext } from './theme/wordmark';

/** Room round the wordmark on the card, in the artwork's px */
const MARGIN = 72;
const TEXTURE_SIZE = {
  width: WORDMARK_SIZE.width + MARGIN * 2,
  height: WORDMARK_SIZE.height + MARGIN * 2,
};
/** A card's size in world units, the texture's shape */
export const CARD_WIDTH = 2.7;
export const CARD_HEIGHT =
  (CARD_WIDTH * TEXTURE_SIZE.height) / TEXTURE_SIZE.width;
/**
 * The two cards, either side of the middle and turned in a little, in degrees: the left one shows the camera its
 * front face, and the right one is turned past a half turn, so it shows its back and the wordmark reads mirrored
 */
const CARDS = {
  front: { x: -1.6, y: 1.4, z: 0.3, turn: 16 },
  back: { x: 1.6, y: 1.4, z: 0.3, turn: 180 - 16 },
};
/**
 * Where the glass logo floats and how wide it is: behind and between the cards, low and wide enough that its foot sits
 * behind both cards' JS badges, so the blend order shows from the front and from behind. It's a little right of
 * centre, since its own JS badge rides high and its foot ends at the last 'i'.
 */
export const LOGO_AT = { x: 0.12, y: 1.92, z: -1.8 };
export const LOGO_WIDTH = 2.5;
/** The cards' sway in degrees, the logo's in radians and its bob in units; rates in radians a second */
const CARD_SWAY = { turn: 7, rate: 0.4 };
const LOGO_SWAY = { turn: 0.2, rate: 0.3, bob: 0.05, bobRate: 0.8 };

/**
 * The PixiJS wordmark drawn into a texture as the brand draws it, pink with the fold at the foot of the P shaded:
 * alpha 1 on the letters and 0 on the rest of the card
 *
 * Pixi stores the texture premultiplied, so the clear card keeps no colour, and the shader's divide by alpha can't
 * bring any back: `'opaque'` draws it black. The same divide turns any texel with a trace of alpha full pink, so
 * `'opaque'` draws the letters' edges hard. Mipmaps keep the edges from shimmering when a phone draws the card small;
 * there they spread a trace of alpha past the letters, which `'opaque'` draws a little heavy.
 */
export function createWordmarkTexture(renderer) {
  const context = brandWordmarkContext();
  const logo = new Graphics({ context });
  const texture = renderer.generateTexture({
    target: logo,
    frame: new Rectangle(
      -MARGIN,
      -MARGIN,
      TEXTURE_SIZE.width,
      TEXTURE_SIZE.height,
    ),
    resolution: 1,
    antialias: true,
    textureSourceOptions: { autoGenerateMipmaps: true },
  });

  logo.destroy();
  context.destroy();

  return texture;
}

/** The four alpha options the card material is built with, the ones the pane edits */

/** The two cards the lesson's material goes on: one geometry and one material, so they draw together */

/** The two wordmark cards, floating either side of the middle */
export function createCards(material, parent) {
  // Rendered textures store their top row first, so `flipV` puts it at the card's top.
  const geometry = new PlaneGeometry({
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    flipV: true,
  });
  const card = ({ x, y, z, turn }) =>
    new Mesh3D({
      geometry,
      material,
      position: { x, y, z },
      angle: { x: 0, y: turn, z: 0 },
      // The shadow pass doesn't read `alphaMode` or `doubleSided` yet: a masked card would cast a solid rectangle,
      // and a card whose back faces the light none. The guide's advice is to turn casting off on such cards; turn it
      // back on once shadows follow the mask.
      castShadow: false,
      parent,
    });

  return { front: card(CARDS.front), back: card(CARDS.back) };
}

/** Sways each card about its upright, out of step, and sways and bobs the logo, at `time` seconds */
export function swayProps(cards, logo, time) {
  cards.front.angle.y =
    CARDS.front.turn + Math.sin(time * CARD_SWAY.rate) * CARD_SWAY.turn;
  cards.back.angle.y =
    CARDS.back.turn + Math.sin(time * CARD_SWAY.rate + 2) * CARD_SWAY.turn;
  logo.root.rotation.y = Math.sin(time * LOGO_SWAY.rate) * LOGO_SWAY.turn;
  logo.root.position.y =
    LOGO_AT.y + Math.sin(time * LOGO_SWAY.bobRate) * LOGO_SWAY.bob;
}
