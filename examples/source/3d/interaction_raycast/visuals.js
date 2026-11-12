/**
 * What the frame draws to explain the pick: a ring where the ray struck and the hit's normal standing out of it, the
 * struck shape's box in 'box' mode, and the side view of the ray from `rayInset.ts`
 *
 * It reads the scene and each frame's hit and never changes them, so `index.ts` runs the same without it.
 */

import { Mesh3D, Plane, Ray, Vector3 } from '@pixi/3d';

import { ArrowHelper } from './theme/ArrowHelper';
import { BoxHelper } from './theme/BoxHelper';
import { RingHelper } from './theme/RingHelper';

import { createRayInset } from './rayInset';

/** The hit's normal as an arrow this long, in world units */
const NORMAL_LENGTH = 0.6;

// The plane of the stage's floor, y = 0, for where a missed ray lands.
const FLOOR = new Plane(new Vector3(0, 1, 0), 0);
const _ray = new Ray();
const _floorHit = new Vector3();
const _normal = new Vector3();
const _tip = new Vector3();

export function createVisuals({
  app,
  view3d,
  stage,
  orbit,
  pane,
  field,
  settings,
}) {
  const ring = new RingHelper({
    radius: 0.18,
    color: 'ink',
    parent: view3d.root,
  });
  // No tag, like the ring and the glow: the pane's `normal` row names it.
  const normalArrow = new ArrowHelper({
    color: 'ink',
    thickness: 0.03,
    parent: view3d.root,
  });
  // In the turntable's space, where each shape's box sits at the shape's position.
  const box = new BoxHelper({ color: 'ink', parent: field.root });
  const rayInset = createRayInset({
    app,
    view3d,
    stage,
    orbit,
    pane,
    shapes: field.shapes,
  });
  let boxed = null;

  app.stage.addChild(rayInset.inset);

  /** The ring on the hit, the normal standing out of it, and in 'box' mode the box the ray struck */
  function drawHit(hit) {
    const onFace = hit !== null && hit.triangleIndex !== -1;

    ring.visible = hit !== null;
    normalArrow.visible = onFace;
    box.visible = hit !== null && settings.hitVolume === 'box';
    if (!hit) return;

    // A box hit has no normal, so its ring turns to face the camera. Upright on a cube's front, half of it would sink
    // into the cube, so it draws through.
    if (onFace) _normal.copyFrom(hit.normal);
    else view3d.camera.getGlobalPosition(_normal, true).subtract(hit.point);
    ring.place(hit.point, _normal);
    ring.xray = !onFace;
    if (onFace)
      normalArrow.set(
        hit.point,
        _tip.copyFrom(hit.normal).multiplyScalar(NORMAL_LENGTH).add(hit.point),
      );
    // Shapes never move inside the turntable, so the box moves only when the target changes.
    if (box.visible && hit.target !== boxed && hit.target instanceof Mesh3D) {
      boxed = hit.target;
      box.setBox(boxed.geometry.bounds3D);
      box.position.copyFrom(boxed.position);
    }
  }

  return {
    update(hit, pointer, dt) {
      drawHit(hit);
      // No ray to show until the reader's pointer arrives.
      if (!pointer) return;
      // The ray the pick cast, from the transforms the last frame was drawn with, and where it meets the floor.
      view3d.screenToRay(pointer, _ray, true);
      rayInset.update(_ray, hit, _ray.intersectPlane(FLOOR, _floorHit), dt);
    },
  };
}
