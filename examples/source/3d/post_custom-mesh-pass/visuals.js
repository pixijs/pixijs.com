/**
 * What the frame draws to explain the pass: an inset that looks down over the wall at the critters as they are
 *
 * The inset runs no x-ray, so it shows the shaded clay the silhouettes stand for, and the critters out of the pass
 * too. It reads the scene each frame and never changes it, with one exception: it draws the scene again from its own
 * camera through passes it appends to `view3d.passes`, the only public way to ask a view for a second picture. That's
 * why `index.ts` swaps its own pass in place rather than assigning a new list.
 */

import { InsetView } from './theme/InsetView';

import { CRITTER_Z } from './scene';

const INSET_SIZE = { width: 300, height: 170 };
/** Narrow enough to sit beside the wall where the full inset would meet it */
const SMALL_INSET_SIZE = { width: 200, height: 110 };
/**
 * The wall's bottom corner nearest the inset, at the orbit's fence corners zoomed in, as shares of the screen's shorter
 * side from its middle: the wall's size follows that side, since `fitPortrait` backs off on a portrait screen
 */
const WALL_CORNER = { x: 0.41, y: 0.23 };
/** Px the full inset takes from the screen's right and bottom edges, with its title and a gap */
const INSET_ROOM = { x: 340, y: 225 };

/** Whether the wall's corner clears the full inset, beside it or above it */
function fullInsetFits({ width, height }) {
  const side = Math.min(width, height);

  return (
    width / 2 + WALL_CORNER.x * side <= width - INSET_ROOM.x ||
    height / 2 + WALL_CORNER.y * side <= height - INSET_ROOM.y
  );
}

export function createVisuals({ app, view3d, stage }) {
  const inset = new InsetView({
    app,
    view3d,
    stage,
    title: 'behind the wall, from above',
    // Centred, the title stays on screen when the small inset is narrower than it.
    titleCorner: 'top',
    corner: 'bottom-right',
    ...INSET_SIZE,
    narrow: { width: 'full', height: 150 },
    // It has nothing to tap, so a drag that starts over it still orbits.
    eventMode: 'none',
  });
  // A same-scene inset always has a camera. It looks down over the wall's top at the critters, in the same
  // left-to-right order as their silhouettes.
  const insetCamera = inset.camera;
  /** Whether the inset is at its small size */
  let small = false;

  insetCamera.fov = 32;
  insetCamera.position.set(0, 5.6, 0.3);
  insetCamera.lookAt({ x: 0, y: 0.3, z: CRITTER_Z });
  app.stage.addChild(inset);

  return {
    update(dt) {
      const needsSmall = !fullInsetFits(app.screen);

      if (needsSmall !== small) {
        const size = needsSmall ? SMALL_INSET_SIZE : INSET_SIZE;

        small = needsSmall;
        inset.setSize(size.width, size.height);
      }
      inset.update(dt);
    },
  };
}
