/**
 * What the frame draws to show what the blur follows: an inset at the bottom right, or along the bottom on a phone,
 * that draws the scene through a `VelocityViewer`
 *
 * The inset is a small `View3D` of its own, with its own copy of the props and a floor, and the viewer in its passes.
 * Its camera copies the main one each tick before the frame renders. It has to be a camera of its own: each camera
 * measures motion against its own previous render, so a camera drawn twice in a frame would read no motion the second
 * time. It reads the scene each frame and never changes it, so `index.ts` runs the same without it; it only asks the
 * portrait fit to keep the inset's band free of the main picture.
 */

import { Material3D, Mesh3D, PlaneGeometry } from '@pixi/3d';

import { InsetView } from './theme/InsetView';

import { createScene } from './scene';

/**
 * The picture's size in px, 16:9 like the main view at 1280 × 720 and small enough that the posts pass clear of it, and
 * its height on a phone
 */
const PICTURE = { width: 256, height: 144, narrowHeight: 170 };
/**
 * Far wider than the stage's floor, which the fog hides long before its edge: this one reaches the horizon, so the only
 * black above it is the sky, which never moves
 */
const FLOOR_SIZE = 1000;
/** How far the title tag stands out above the panel, and the gap kept above it, in px */
const TAG = 15;
const GAP = 8;

export async function createVisuals(options) {
  const { app, view3d, stage, orbit, minDistance, fit, velocityViewer } =
    options;
  const inset = new InsetView({
    app,
    stage,
    title: 'velocity',
    corner: 'bottom-right',
    width: PICTURE.width,
    height: PICTURE.height,
    narrow: { width: 'full', height: PICTURE.narrowHeight },
    // A drag that starts over the inset still orbits the main view.
    eventMode: 'none',
  });
  // An inset with neither a view nor a texture always has a view, a scene and a camera of its own.
  const insetView = inset.view3d;
  const root = inset.root;
  const camera = inset.camera;
  const mainCamera = view3d.camera;
  const copy = await createScene(root);

  // The viewer replaces the picture with the velocity, so the floor only has to be there to write it.
  new Mesh3D({
    geometry: new PlaneGeometry({ width: FLOOR_SIZE, height: FLOOR_SIZE }),
    material: new Material3D(),
    rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    parent: root,
  });
  insetView.passes = [velocityViewer];
  app.stage.addChild(inset);

  /** Docks the inset on the screen, then keeps its band free of the main picture, title tag and a gap included */
  function clearBand() {
    inset.update();
    fit.clearBottom = app.screen.height - inset.rect.y + TAG + GAP;
    fit.refit();
  }

  clearBand();
  // A resize can change the picture's shape, and so the camera's projection: a cut, like the main view's.
  app.renderer.on('resize', () => {
    clearBand();
    camera.resetHistory();
  });

  /**
   * Puts the inset's camera where the main one is and faces it the same way. On a phone the fit backs the main camera
   * off to fit the ring across a narrow screen, but the inset stays wide, so its camera keeps the landscape distance.
   */
  function follow() {
    const target = orbit.target;
    const undoFit = minDistance / orbit.minDistance;

    camera.position
      .copyFrom(mainCamera.position)
      .subtract(target)
      .multiplyScalar(undoFit)
      .add(target);
    camera.quaternion.copyFrom(mainCamera.quaternion);
    camera.fov = mainCamera.fov;
  }

  return {
    update(dt, time) {
      inset.update(dt);
      follow();
      copy.spin(time);
    },
  };
}
