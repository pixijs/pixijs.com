/**
 * What the frame draws to explain bloom: the names on the glow row, so a reader can tell which strength each ball has
 * while the threshold cuts the row
 *
 * The labels are 2D, drawn after the view, so the bloom never touches them. It reads the scene each frame and never
 * changes it, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';
import { NARROW_BELOW } from './theme/overlay';

/** How far over the balls' middles the row's heading line stands: a little over their tops */
const HEADING_LIFT = 0.4;
/**
 * Where the cube's name hangs on its point, across: centred, or on a phone, where the shapes stand closer than the
 * name is wide, mostly to the cube's left, clear of the strengths' heading
 */
const CUBE_ANCHOR = { wide: 0.5, narrow: 0.85 };
/** Where a ball's strength hangs: just under the ball, in its own space */
const UNDER_BALL = {
  at: { x: 0, y: -0.5, z: 0 },
  anchor: { x: 0.5, y: 0 },
  offset: { x: 0, y: 8 },
};

export function createVisuals({ app, view3d, stage, glowRow, glowStrengths }) {
  const labels = new LabelLayer({ view3d, stage });
  // A heading line over the row, the cube's name and the strengths', then each ball's strength under it.
  const first = glowRow.balls[0].position;
  const last = glowRow.balls[glowRow.balls.length - 1].position;
  const heading = { y: first.y + HEADING_LIFT, z: first.z };
  const cubeTag = labels.add({
    text: 'no emissive',
    at: { x: glowRow.cube.position.x, ...heading },
  });

  labels.add({
    text: 'emissive.strength',
    at: { x: (first.x + last.x) / 2, ...heading },
  });
  glowRow.balls.forEach((ball, i) =>
    labels.add({ text: String(glowStrengths[i]), node: ball, ...UNDER_BALL }),
  );

  app.stage.addChild(labels);

  return {
    update() {
      cubeTag.anchor.x =
        app.screen.width < NARROW_BELOW ? CUBE_ANCHOR.narrow : CUBE_ANCHOR.wide;
      labels.update();
    },
  };
}
