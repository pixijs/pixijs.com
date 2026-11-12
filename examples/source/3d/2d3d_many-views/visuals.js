/**
 * What the overview draws: the focus card's world seen from outside, with the card's camera as an object in it
 *
 * A stand-in shape and a copy of the card's light are the card's root as it is now, the accent frustum is the card's
 * camera and what it sees, and a faint grid gives the space depth. It reads the focus card each frame and never
 * changes it, so `index.ts` runs the same without it.
 */

import { DirectionalLight, Mesh3D, Vector3 } from '@pixi/3d';

import { FrustumHelper } from './theme/FrustumHelper';
import { GridHelper } from './theme/GridHelper';
import { LabelLayer } from './theme/LabelLayer';

/**
 * The overview's camera: high and to the right of the card's world, looking at the middle of every pose the orbit
 * limits allow, and far enough back that all of them and the grid stay inside the panel. The page never lays the
 * overview out taller than wide, so one distance fits every size.
 */
const LOOK_AT = { x: 0, y: -0.13, z: 1.2 };
const LOOK_FROM = new Vector3(0.45, 0.75, 0.5).normalize();
const DISTANCE = 8.75;
const OVERVIEW_FOV = 40;
/** Lines thick enough to read at the overview's scale, about 1.3 px */
const LINE = { thickness: 0.03 };
/** Faint, so the grid reads as a guide to depth and not as a floor the card's world has */
const GRID_OPACITY = 0.5;
/** How far inside the overview its tag keeps, in px, and how far under the camera's eye it hangs */
const MARGIN = 8;
const CAMERA_TAG_DROP = 20;

export function createVisuals({ app, overview, stage, first }) {
  const root = overview.root;
  // Its lines pass under the shape's origin, and it reaches back under the camera.
  new GridHelper({
    size: 4,
    opacity: GRID_OPACITY,
    position: { x: 0, y: -0.75, z: 1 },
    parent: root,
  });
  const standIn = new Mesh3D({
    geometry: first.shape.geometry,
    material: first.shape.material,
    parent: root,
  });
  // A light lights only the view it's in, so the stand-in needs its own copy of the card's.
  const light = new DirectionalLight({ parent: root });
  const frustum = new FrustumHelper({ color: 'accent', ...LINE, parent: root });
  const labels = new LabelLayer({ view3d: overview, stage, margin: MARGIN });
  let shown = null;

  // The frustum places itself at the camera's eye, so a tag on its origin follows the camera.
  labels.add({
    text: 'camera',
    node: frustum,
    offset: { x: 0, y: CAMERA_TAG_DROP },
  });
  app.stage.addChild(labels);
  overview.camera.fov = OVERVIEW_FOV;
  overview.camera.position
    .copyFrom(LOOK_FROM)
    .multiplyScalar(DISTANCE)
    .add(LOOK_AT);
  overview.camera.lookAt(LOOK_AT);

  /** Takes on a new focus card's shape, light and camera */
  function show(focus) {
    shown = focus;
    standIn.geometry = focus.shape.geometry;
    standIn.material = focus.shape.material;
    // A copy, so the overview's light never shares the card's `Color`.
    light.color.setValue(focus.light.color);
    light.intensity = focus.light.intensity;
    light.quaternion.copyFrom(focus.light.quaternion);
    frustum.camera = focus.view.camera;
  }

  return {
    update(focus) {
      if (focus !== shown) show(focus);
      standIn.rotation.copyFrom(focus.shape.rotation);
      // Each view has its own size, so the frustum takes the card's aspect, and runs out to the shape.
      frustum.aspect = focus.view.width / focus.view.height;
      frustum.length = focus.orbit.distance;
      frustum.update();
      labels.update();
    },
  };
}
