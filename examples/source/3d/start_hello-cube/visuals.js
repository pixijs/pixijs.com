/**
 * What the frame draws to explain the scene: the light's rays, the cube's triangles when the pane asks, and a side
 * view of the scene from outside, where the camera the main view draws from shows
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { DirectionalLight, Mesh3D, Vector3 } from '@pixi/3d';

import { FrustumHelper } from './theme/FrustumHelper';
import { InsetView } from './theme/InsetView';
import { LabelLayer } from './theme/LabelLayer';
import { LightHelper } from './theme/LightHelper';

import { WireframeHelper } from './theme/WireframeHelper';

/** The rays' length: short enough that a portrait camera needn't back off far to fit them */
const RAY_LENGTH = 0.85;
/** How far past the rays' tails the light's tag sits, in world units */
const TAG_BEYOND_TAILS = 0.4;
/** The side view's picture in px, and the most of the screen's height it takes, so a phone held sideways has room */
const PICTURE = { width: 320, height: 180, share: 0.35 };
/** The side view's distance from the screen's edges, in px: a phone's gutter */
const GUTTER = 16;
/** The view volume's lines and the camera glyph, in screen px at the inset's scale: big enough to show box and lens */
const LINE_PX = 2;
const GLYPH_PX = 28;
/** How far above the camera glyph its tag sits, in px */
const TAG_LIFT = 24;
/**
 * The side view's margin round what it frames, in px: room above the camera for its tag, and to its right for the
 * glyph, which reaches back past the eye
 */
const MARGIN = {
  top: TAG_LIFT + 20,
  right: 16 + GLYPH_PX,
  bottom: 16,
  left: 16,
};
/** The cube's reach as it turns: half its height, and its corner's distance from its axis */
const HALF = 0.5;
const CORNER = Math.SQRT1_2;

export function createVisuals(options) {
  const { app, view3d, stage, cube, light } = options;
  const labels = new LabelLayer({ view3d, stage });
  const rays = new LightHelper({
    light,
    target: cube.position,
    spread: 0.64,
    length: RAY_LENGTH,
    parent: view3d.root,
  });
  const wireframe = new WireframeHelper({
    geometry: cube.geometry,
    thickness: 0.014,
    parent: cube,
  });
  // The light shines along its -z, so its +z points back the way the light comes from.
  const toLight = new Vector3(0, 0, 1).applyQuaternion(light.quaternion);
  const side = createSideView(options);

  wireframe.visible = false;
  rays.update();
  labels.add({
    text: 'light',
    at: rays.tail.clone().addScaledVector(toLight, TAG_BEYOND_TAILS),
  });
  app.stage.addChild(side.inset, labels);

  return {
    wireframe,
    update(dt) {
      rays.update();
      side.update(dt);
      labels.update();
    },
  };
}

/**
 * A corner panel with the scene seen from the side, where the camera the main view draws from shows
 *
 * It's a small view of its own: a copy of the cube sharing its geometry and material, a copy of the light, and the
 * main camera drawn as a glyph whose view volume opens towards the cube.
 */
function createSideView({ app, stage, view3d, cube, light }) {
  const inset = new InsetView({
    app,
    stage,
    margin: GUTTER,
    title: 'from the side',
    titleCorner: 'top-left',
    corner: 'bottom-right',
    mode: 'orthographic',
    narrow: { corner: 'top', width: 'full', height: 150 },
  });
  // An own-scene inset always has a view, a root and a camera.
  const side = inset.view3d;
  const root = inset.root;
  const camera = inset.camera;
  const copy = new Mesh3D({
    geometry: cube.geometry,
    material: cube.material,
    parent: root,
  });
  const lightCopy = new DirectionalLight({ parent: root });
  const frustum = new FrustumHelper({
    camera: view3d.camera,
    view: view3d,
    far: false,
    parent: root,
  });
  const tag = inset.labels.add({
    text: 'camera',
    offset: { x: 0, y: -TAG_LIFT },
  });
  const eye = view3d.camera.position;
  // The camera and the cube's reach as it turns, which the picture frames.
  const framed = [
    eye,
    new Vector3(0, -HALF, -CORNER),
    new Vector3(0, HALF, CORNER),
  ];
  let pictureHeight = 0;

  // No background, so the panel shows through: behind an orthographic camera one covers only the middle of the view.
  side.background = null;
  // Looking along +x, so the main camera's z runs left to right across the picture and the cube sits at its left.
  camera.position.set(-10, 0, 0);
  camera.lookAt({ x: 0, y: 0, z: 0 });

  return {
    inset,
    update(dt) {
      const height = Math.min(
        PICTURE.height,
        Math.round(app.screen.height * PICTURE.share),
      );

      if (height !== pictureHeight) {
        pictureHeight = height;
        inset.setSize(
          Math.round((height * PICTURE.width) / PICTURE.height),
          height,
        );
      }
      // The pane changes the light and the environment, so the copies follow them.
      side.environment = view3d.environment;
      lightCopy.intensity = light.intensity;
      lightCopy.quaternion.copyFrom(light.quaternion);
      copy.rotation.y = cube.rotation.y;
      inset.frame(framed, MARGIN);
      // Twice the camera's distance, so the volume's edges run on out of the picture.
      frustum.length = eye.distanceTo(cube.position) * 2;
      frustum.thickness = inset.unitsPerPixel * LINE_PX;
      frustum.size = inset.unitsPerPixel * GLYPH_PX;
      frustum.update();
      tag.at.copyFrom(frustum.eye);
      inset.update(dt);
    },
  };
}
