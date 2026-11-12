/**
 * What the frame draws to explain materials per model: a tag over each helmet saying whether it draws the source's
 * shared material or a copy of its own
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

/** Each tag's point in its helmet's space: just over the crown, which stays put as the helmet sways */
const CROWN = { x: 0, y: 1.15, z: 0 };

export function createVisuals({ app, view3d, stage, source, helmets }) {
  const labels = new LabelLayer({ view3d, stage });
  const tags = helmets.map((helmet) =>
    labels.add({ text: '', node: helmet, at: CROWN }),
  );

  app.stage.addChild(labels);

  return {
    update() {
      // A model whose `materials` is the source's own list draws the shared ones; any other list is its own.
      for (let i = 0; i < helmets.length; i++) {
        const own = helmets[i].materials !== source.materials;

        tags[i].text = own ? 'own copy' : 'shared';
        tags[i].color = own ? 'accent' : null;
      }
      labels.update();
    },
  };
}
