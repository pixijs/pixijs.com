/**
 * What the frame draws to explain `from()`: a ghost of the assembled logo, where every tween ends, and a label naming
 * it, shown while the entrance plays
 *
 * It reads the entrance's progress each frame and changes nothing, so `index.ts` runs the same without it.
 */

import { Container3D } from '@pixi/3d';

import { GhostHelper } from './theme/GhostHelper';
import { LabelLayer } from './theme/LabelLayer';
import { LOGO_PIECES } from './theme/logo';

import { NARROW_BELOW } from './theme/overlay';

/** The ghosts' scale about each piece's centre: tucked just inside the solid piece, so the two never z-fight */
const GHOST_INSET = 0.97;
/** Px from the P's foot down to the label on a phone, past the floor shadows under the logo */
const PAST_SHADOWS = 70;

export function createVisuals({ app, view3d, stage, logo }) {
  const labels = new LabelLayer({ view3d, stage });
  const ghosts = new Container3D({ parent: logo.root });
  // Copied before any tween has moved a piece, so each ghost holds that piece's end pose. A landed piece hides its ghost.
  const [pGhost] = LOGO_PIECES.map((id) => {
    const ghost = new GhostHelper({
      source: logo.pieces[id].pivot,
      parent: ghosts,
    });

    ghost.scale.set(GHOST_INSET);

    return ghost;
  });
  const { half } = logo.pieces.p;
  // The label names the ghosts at the P's: the largest, and the first a piece falls into.
  const label = labels.add({ text: 'end pose', node: pGhost });
  let narrow = app.screen.width < NARROW_BELOW;

  // Left of the P's lower half, clear of its fall; a phone has no room there, so under its foot with a line back to it.
  function place() {
    label.at.set(
      narrow ? -0.6 * half.x : -half.x,
      narrow ? -half.y : -0.6 * half.y,
      0,
    );
    label.offset.set(narrow ? 0 : -10, narrow ? PAST_SHADOWS : 0);
    label.anchor.set(narrow ? 0.5 : 1, 0.5);
    label.leader = narrow;
  }

  place();
  app.stage.addChild(labels);

  return {
    update(progress) {
      if (app.screen.width < NARROW_BELOW !== narrow) {
        narrow = !narrow;
        place();
      }
      ghosts.visible = progress < 1;
      labels.update();
    },
  };
}
