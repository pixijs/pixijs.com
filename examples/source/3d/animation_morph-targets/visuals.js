/**
 * What the frame draws to explain morph targets from glTF: a tag under each copy naming the base or the target it
 * shows
 *
 * It reads the copies each frame and never changes them, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

/** A copy's base in its own units: the 2-unit cube's bottom face, whose corners reach √2 from its middle */
const BASE_Y = -1;
const BASE_REACH = Math.SQRT2;
/** Px from a copy's base down to the top of its tag */
const TAG_DROP = 16;

/** A copy of the cube from the same source, held at one pose */

export function createVisuals({ app, view3d, stage, previews }) {
  const labels = new LabelLayer({ view3d, stage });
  const tags = previews.map(({ model, weights }) => {
    const target = weights.indexOf(1);
    // Hung by its top edge, so the copy never reaches into it.
    const label = labels.add({
      text: target < 0 ? 'base' : `target ${target}`,
      anchor: { x: 0.5, y: 0 },
      offset: { x: 0, y: TAG_DROP },
    });

    return { label, model };
  });

  app.stage.addChild(labels);

  /** Hangs each copy's tag under the edge of its base nearest the camera, wherever the orbit goes */
  function hangTags() {
    const eye = view3d.camera.position;

    for (const { label, model } of tags) {
      const { position, scale } = model;
      const dx = eye.x - position.x;
      const dz = eye.z - position.z;
      const reach = (BASE_REACH * scale.x) / Math.hypot(dx, dz);

      label.at.set(
        position.x + dx * reach,
        position.y + BASE_Y * scale.y,
        position.z + dz * reach,
      );
    }
  }

  return {
    update() {
      hangTags();
      labels.update();
    },
  };
}
