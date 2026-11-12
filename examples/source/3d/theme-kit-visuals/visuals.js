/**
 * What the gallery draws: every teaching visual in the kit on its station, each named by a tag, and the 2D overlays
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it. Each visual comes back
 * as a GalleryVisual, which the pane shows or hides by name.
 */

import { LabelLayer } from './theme/LabelLayer';

import { visual } from './galleryVisual';

import { createHelperVisuals } from './helperVisuals';

import { createMeshVisuals } from './meshVisuals';
import { createNameTags } from './nameTags';
import { createOverlayVisuals } from './overlayVisuals';

export function createVisuals({ app, view3d, stage, scene, widen }) {
  const labels = new LabelLayer({ view3d, stage });
  const tags = createNameTags(labels, scene);
  // The overlays place the inset's camera, so they update before the frustum that draws it.
  const overlays = createOverlayVisuals({ app, view3d, stage, scene, tags });
  const sets = [
    createHelperVisuals(scene, tags, widen),
    overlays,
    createMeshVisuals({
      camera: view3d.camera,
      lens: overlays.lens,
      scene,
      tags,
      widen,
    }),
  ];
  const labelLayer = visual(
    'LabelLayer',
    'Overlays',
    [labels],
    tags.add('mark', 'LabelLayer'),
  );

  // The inset draws over the name tags.
  app.stage.addChild(labels, overlays.layer);

  return {
    visuals: [...sets.flatMap((set) => set.visuals), labelLayer],
    update(dt) {
      for (const set of sets) set.update(dt);
      labels.update();
    },
    arrange(shape) {
      return overlays.arrange(shape);
    },
  };
}
