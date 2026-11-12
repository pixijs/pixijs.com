/**
 * What the frame draws to explain the texture set: a row of cards along the bottom, one per slot, each showing the
 * very texture the material samples there now, its map or the neutral texture standing in for it
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { BitmapText, Texture } from 'pixi.js';

import { InsetView } from './theme/InsetView';
import { LABEL_FONT, NARROW_BELOW, overlayColor } from './theme/overlay';

import { MAP_SLOTS } from './scene';

/** A compact card's slot name under its image; `metallicRoughness` breaks at its capital to fit a phone's row */
const COMPACT_NAMES = {
  baseColor: 'baseColor',
  metallicRoughness: 'metallic\nRoughness',
  normal: 'normal',
  occlusion: 'occlusion',
  emissive: 'emissive',
};
/** A card's image and the gap after it, in px: wide enough for the `metallicRoughness` title tag, or a phone's row */
const FULL = { size: 120, gap: 12 };
const COMPACT = { size: 58, gap: 7 };
/** The compact names' font size, their gap under the card, and the row they take, two lines high, in px */
const NAME_SIZE = 10;
const NAME_GAP = 3;
const NAME_ROW = 28;
/** The row's gap to the screen's edges, in px, and the height under which full cards would crowd the helmet */
const MARGIN = 24;
const PHONE_MARGIN = 16;
const SHORT_BELOW = 500;

export function createVisuals({ app, stage, material }) {
  const screen = app.screen;
  const cards = MAP_SLOTS.map(
    (slot) =>
      new InsetView({
        app,
        stage,
        texture: heldTexture(slot),
        title: slot,
        titleCorner: 'top',
      }),
  );
  // A compact card is narrower than its title tag, so its slot's name goes under it instead.
  const names = cards.map((card, i) =>
    card.addChild(
      new BitmapText({
        text: COMPACT_NAMES[MAP_SLOTS[i]],
        style: { fontFamily: LABEL_FONT, fontSize: NAME_SIZE, align: 'center' },
        anchor: { x: 0.5, y: 0 },
      }),
    ),
  );
  let darkness = -1;
  let laidOutWidth = 0;
  let laidOutHeight = 0;

  app.stage.addChild(...cards);

  /** What a slot holds now: its map, or the neutral texture that stands in for it */
  function heldTexture(slot) {
    // Only a material built with the emissive group has that slot, so it's typed optional; this one has it.
    return material.textures[slot] ?? Texture.WHITE;
  }

  /** Centres the row along the bottom, compact on a screen too narrow or too short for full cards */
  function arrange() {
    const margin = screen.width < NARROW_BELOW ? PHONE_MARGIN : MARGIN;
    const fullWidth = (FULL.size + FULL.gap) * cards.length - FULL.gap;
    const compact =
      fullWidth + margin * 2 > screen.width || screen.height < SHORT_BELOW;
    const { size, gap } = compact ? COMPACT : FULL;
    const left = (screen.width - ((size + gap) * cards.length - gap)) / 2;
    const foot = screen.height - margin - (compact ? NAME_ROW : 0);

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];

      card.title = compact ? '' : MAP_SLOTS[i];
      card.setSize(size, size);
      card.position.set(
        Math.round(left + i * (size + gap)),
        foot - card.rect.height,
      );
      names[i].visible = compact;
      names[i].position.set(
        Math.round(card.rect.width / 2),
        card.rect.height + NAME_GAP,
      );
    }
    laidOutWidth = screen.width;
    laidOutHeight = screen.height;
  }

  return {
    update(dt) {
      if (screen.width !== laidOutWidth || screen.height !== laidOutHeight)
        arrange();
      // The names sit on the floor, not a panel, so they take the theme's text colour.
      if (stage.darkness !== darkness) {
        darkness = stage.darkness;
        for (const name of names) name.tint = overlayColor('ink', darkness);
      }
      for (let i = 0; i < cards.length; i++) {
        cards[i].texture = heldTexture(MAP_SLOTS[i]);
        cards[i].update(dt);
      }
    },
  };
}
