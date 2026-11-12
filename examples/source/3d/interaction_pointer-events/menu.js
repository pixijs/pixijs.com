/**
 * The colour menu a right click on a shape opens: a small card of clay swatches beside the pointer
 *
 * Nothing here listens to the pointer. `index.ts` gives the card and its swatches the same pointer calls as the shapes.
 */

import { Graphics } from 'pixi.js';

import { clayMaterial } from './theme/clay';
import { helperColor } from './theme/helpers';

import { CLAY } from './theme/palette';

import { Panel } from './theme/Panel';

/** The colours the menu offers: the torus's own orange, and three no shape starts in */
const MENU_COLORS = ['orange', 'lilac', 'palePink', 'paleSky'];
/** The menu's swatch dots: their radius, the gap from one centre to the next, and the ring round the current one */
const SWATCH_RADIUS = 9;
const SWATCH_STEP = 28;
const RING_RADIUS = 12.5;
/** How far from the pointer the menu opens, clear of the cursor and the torus's rim, and how far inside the screen */
const MENU_OFFSET = 24;
const MENU_MARGIN = 16;
const MENU_PADDING = 10;

/** A small card of clay swatches that opens beside the pointer for one shape */

export function createColorMenu({ stage, screen }) {
  // Titled from the start, so the swatches sit under the title row that open() writes the shape's name into.
  const card = new Panel({ stage, padding: MENU_PADDING, title: 'shape' });
  const ring = new Graphics()
    .circle(0, 0, RING_RADIUS)
    .stroke({ width: 2, color: helperColor('accent') });
  const swatches = MENU_COLORS.map((color, i) =>
    new Graphics({
      x: MENU_PADDING + SWATCH_RADIUS + i * SWATCH_STEP,
      y: card.contentTop + SWATCH_RADIUS,
    })
      .circle(0, 0, SWATCH_RADIUS)
      .fill(CLAY[color]),
  );
  const width =
    MENU_PADDING * 2 +
    SWATCH_RADIUS * 2 +
    SWATCH_STEP * (MENU_COLORS.length - 1);
  const height = card.contentTop + SWATCH_RADIUS * 2 + MENU_PADDING;
  let openFor = null;

  function close() {
    openFor = null;
    card.visible = false;
  }

  card.setSize(width, height);
  card.addChild(ring, ...swatches);
  card.visible = false;

  return {
    card,
    swatches,
    open(toy, at) {
      const current = MENU_COLORS.indexOf(toy.color);
      // Beside the pointer and level with it; to its left where the right is short.
      const right = at.x + MENU_OFFSET + width <= screen.right - MENU_MARGIN;
      const top = at.y - height / 2;

      openFor = toy;
      card.title = toy.mesh.label ?? '';
      card.position.set(
        right ? at.x + MENU_OFFSET : at.x - MENU_OFFSET - width,
        Math.min(
          Math.max(top, screen.top + MENU_MARGIN),
          screen.bottom - MENU_MARGIN - height,
        ),
      );
      ring.visible = current >= 0;
      if (current >= 0) ring.position.copyFrom(swatches[current].position);
      card.visible = true;
    },
    close,
    pick(index) {
      if (!openFor) return;
      openFor.color = MENU_COLORS[index];
      openFor.mesh.material = clayMaterial(openFor.color);
      close();
    },
  };
}
