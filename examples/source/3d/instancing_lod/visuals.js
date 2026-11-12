/**
 * What the frame draws to explain level of detail: a tag on each subject naming whether it waits a hysteresis band
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

export function createVisuals({ app, view3d, stage, subjects }) {
  const labels = new LabelLayer({ view3d, stage });

  // Each tag hangs off the outer side of its subject, so the two never meet when the pair shrinks into the distance.
  // The leader is short, so the right tag stays clear of the open pane on a phone held sideways.
  subjects.forEach(({ name, mesh }, i) =>
    labels.add({
      text: name,
      node: mesh,
      at: { x: 0, y: 1.6, z: 0 },
      offset: { x: i === 0 ? -3 : 3, y: -20 },
      anchor: { x: i === 0 ? 1 : 0, y: 0.5 },
      leader: true,
    }),
  );
  app.stage.addChild(labels);

  return {
    update() {
      labels.update();
    },
  };
}
