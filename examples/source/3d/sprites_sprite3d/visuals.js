/**
 * What the frame draws to explain Sprite3D: a dot on each sprite's `position`, which shows where its `anchor` puts the
 * image, and a tag under each sprite naming its `billboardMode`
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Vector3 } from '@pixi/3d';

import { DotHelper } from './theme/DotHelper';
import { LabelLayer } from './theme/LabelLayer';

const DOT_RADIUS = 0.075;
/** Each tag hangs this many px under the dot or the edge it names, clear of the dot's rim */
const UNDER = { anchor: { x: 0.5, y: 0 }, offset: { x: 0, y: 14 } };

const _up = new Vector3();

export function createVisuals({ app, view3d, stage, sign, cutout, marker }) {
  const labels = new LabelLayer({ view3d, stage });

  // On the root, not the sprite: a sprite's child would inherit its texture size.
  for (const sprite of [sign, cutout, marker]) {
    new DotHelper({
      radius: DOT_RADIUS,
      outline: true,
      position: sprite.position,
      parent: view3d.root,
    });
  }

  labels.add({ text: 'none', at: sign.position, ...UNDER });
  labels.add({ text: 'cylindrical', at: cutout.position, ...UNDER });
  // update() hangs it under the marker's bottom edge.
  const markerTag = labels.add({ text: 'spherical', ...UNDER });

  app.stage.addChild(labels);

  return {
    update() {
      // The spherical turn stands the marker along the camera's own up, so its bottom edge is half its height down that
      // way from its centre.
      _up.set(0, 1, 0).applyQuaternion(view3d.camera.quaternion);
      markerTag.at
        .copyFrom(_up)
        .multiplyScalar(-marker.height / 2)
        .add(marker.position);
      labels.update();
    },
  };
}
