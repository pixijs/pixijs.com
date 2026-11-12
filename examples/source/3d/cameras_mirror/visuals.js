/**
 * What the frame draws to explain the mirror: the side view of both cameras, and the feed card
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it. Each time `layout`
 * fits, it moves the side view and the card where the layout puts them, on the right with the pane, clear of the logo
 * and the stand.
 */

import { createFeedCard } from './feedCard';

import { createSideView } from './sideView';

export function createVisuals(options) {
  const {
    app,
    view3d,
    stage,
    orbit,
    logo,
    stand,
    layout,
    mirror,
    mirrorCamera,
    feed,
  } = options;
  const side = createSideView({
    app,
    stage,
    view3d,
    orbit,
    logo,
    stand,
    mirrorCamera,
    mirrorY: mirror.position.y,
  });
  const card = createFeedCard({ app, stage, layout, feed });
  // The layout's fit the panels were last placed for.
  let placed = -1;

  app.stage.addChild(side.inset, card.inset);

  /** Moves a panel so its picture fills `picture`, in global px */
  function place(inset, picture) {
    inset.position.set(picture.x - inset.padding, picture.y - inset.padding);
    inset.setSize(picture.width, picture.height);
  }

  return {
    update(dt) {
      if (layout.fits !== placed) {
        placed = layout.fits;
        place(side.inset, layout.side);
        place(card.inset, layout.card);
        card.frameBand();
      }
      side.update(dt);
      card.inset.update(dt);
    },
  };
}
