/**
 * What the frame draws to explain projection: a tag on each of the two identical houses, axes on a tower that come out
 * the same length in an isometric view, and a side view in the bottom-right corner with the camera and its view
 * volume, a pyramid in perspective and a box in orthographic
 *
 * It reads the camera each frame and never changes it, so `index.ts` runs the same without it.
 */

import { AmbientLight, DirectionalLight, Spherical, Vector3 } from '@pixi/3d';

import { DEG_TO_RAD } from 'pixi.js';

import { ArrowHelper } from './theme/ArrowHelper';
import { AxesHelper } from './theme/AxesHelper';
import { FrustumHelper } from './theme/FrustumHelper';
import { InsetView } from './theme/InsetView';
import { LabelLayer } from './theme/LabelLayer';

import { createTown, TOWN_CENTER, TOWN_HEIGHT, TOWN_RADIUS } from './scene';

/** How far past each axis's tip its tag sits, as a share of the axis */
const TAG_PAST = 1.35;
/**
 * The side view's picture in px; the most of the screen's height it takes, so on a phone held sideways, 360 px tall and
 * up, it sits under the opened pane and clear of the town's corner; and its height on a phone held upright, where it
 * spans the bottom
 */
const PICTURE = { width: 320, height: 180, share: 0.25, narrowHeight: 150 };
/** Line widths and the camera glyph's length, in px in the side view */
const PX = { volume: 1.5, ground: 1, glyph: 18 };
/** Room round what the side view frames, in px: over the eye for its tag, and behind it for the glyph */
const MARGIN = { top: 30, right: 12, bottom: 12, left: 12 + PX.glyph };
/** Where the `camera` tag's corner sits from the eye, in px: right of it over a pyramid, left of it over a box */
const CAMERA_TAG = { pyramid: { x: 10, y: -6 }, box: { x: -12, y: -24 } };
/**
 * The side view's own lights: a key that follows its camera, 45° up and 30° round to the left, so the walls it faces
 * take light and shade, and a soft fill
 */
const SIDE_LIGHT = {
  key: 2.2,
  up: Math.PI / 4,
  round: Math.PI / 6,
  ambient: 0.9,
};

const _sight = new Vector3();
const _up = new Vector3();
const _spherical = new Spherical();

export function createVisuals({ app, view3d, stage, town, orbit }) {
  const camera = view3d.camera;
  const labels = new LabelLayer({ view3d, stage });
  // As the town's child, on the purple tower's roof.
  const axes = new AxesHelper({
    length: 1.1,
    position: town.towerTop,
    parent: town.root,
  });

  for (const axis of ['x', 'y', 'z']) {
    const at = axes.tips[axis].clone().multiplyScalar(TAG_PAST);

    labels.add({
      text: axis,
      node: axes,
      at,
      color: axis,
      offset: { x: 0, y: 0 },
    });
  }
  for (const ridge of town.twinRidges)
    labels.add({ text: 'same house', node: town.root, at: ridge });

  const inset = new InsetView({
    app,
    stage,
    title: 'from the side',
    corner: 'bottom-right',
    // Orthographic, so the volume's angles show true.
    mode: 'orthographic',
    width: PICTURE.width,
    height: PICTURE.height,
    narrow: { width: 'full', height: PICTURE.narrowHeight },
    // A drag that starts over the side view still orbits the main view.
    eventMode: 'none',
  });
  // An inset with neither a view nor a texture always has a view, a scene and a camera of its own: here a copy of the
  // town, the main camera's view volume and the ground line.
  const sideView = inset.view3d;
  const sideRoot = inset.root;
  const sideCamera = inset.camera;
  const sideKey = new DirectionalLight({
    intensity: SIDE_LIGHT.key,
    parent: sideRoot,
  });
  const frustum = new FrustumHelper({
    camera,
    view: view3d,
    // The edges stop where they meet the ground, or run on out of the picture.
    floor: 0,
    far: false,
    color: 'accent',
    parent: sideRoot,
  });
  const ground = new ArrowHelper({
    color: 'ink',
    head: false,
    parent: sideRoot,
  });
  const cameraTag = inset.labels.add({ text: 'camera' });
  // Along the camera's line of sight, flattened: the town's near and far edges, the ground line's ends, and the top of
  // the town. With the eye and an orthographic box's near side, the town's edges and top are what the side view fits.
  const townNear = new Vector3();
  const townFar = new Vector3();
  const townTop = new Vector3(TOWN_CENTER.x, TOWN_HEIGHT, TOWN_CENTER.z);
  const boxTop = new Vector3();
  const boxBottom = new Vector3();
  const groundStart = new Vector3();
  const groundEnd = new Vector3();
  const framed = [
    camera.position,
    boxTop,
    boxBottom,
    townNear,
    townFar,
    townTop,
  ];
  const margin = { ...MARGIN };
  let pictureHeight = PICTURE.height;

  createTown(sideRoot);
  sideRoot.addChild(new AmbientLight({ intensity: SIDE_LIGHT.ambient }));
  // No background, so the panel shows through: behind an orthographic camera one covers only the middle of the view.
  sideView.background = null;
  app.stage.addChild(labels, inset);

  /** Shrinks the picture on a short screen */
  function fitPicture() {
    const height = Math.min(
      PICTURE.height,
      Math.round(app.screen.height * PICTURE.share),
    );

    if (height === pictureHeight) return;
    pictureHeight = height;
    inset.setSize(
      Math.round((height * PICTURE.width) / PICTURE.height),
      height,
    );
  }

  /**
   * Stands the side camera level and a quarter turn round from the main one, so the main camera's line of sight runs
   * across the picture and the volume's left and right edges land on its top and bottom ones
   */
  function placeSideCamera() {
    _sight.copyFrom(orbit.target).subtract(camera.position);
    _sight.y = 0;
    _sight.normalize();
    townNear
      .set(TOWN_CENTER.x, 0, TOWN_CENTER.z)
      .addScaledVector(_sight, -TOWN_RADIUS);
    townFar
      .set(TOWN_CENTER.x, 0, TOWN_CENTER.z)
      .addScaledVector(_sight, TOWN_RADIUS);
    // A box starts at the camera and reaches half the view's height above and below it; a pyramid starts at the eye.
    const half =
      camera.mode === 'orthographic'
        ? camera.orthographicSize / camera.zoom / (view3d.width / view3d.height)
        : 0;

    _up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    boxTop.copyFrom(camera.position).addScaledVector(_up, half);
    boxBottom.copyFrom(camera.position).addScaledVector(_up, -half);
    _spherical.set(1, Math.PI / 2, orbit.azimuthAngle + Math.PI / 2);
    sideCamera.position.setFromSpherical(_spherical).add(orbit.target);
    sideCamera.lookAt(orbit.target);
    inset.frame(framed, margin);
    _spherical.set(
      1,
      Math.PI / 2 - SIDE_LIGHT.up,
      orbit.azimuthAngle + Math.PI / 2 - SIDE_LIGHT.round,
    );
    sideKey.position.setFromSpherical(_spherical).add(orbit.target);
    sideKey.lookAt(orbit.target);
  }

  /**
   * Keeps the tag off the volume's edges. Over a pyramid it sits right of the eye, above the top edge, which rises at
   * fov / 2 less the camera's elevation, so the tag rises with it and the frame leaves it room. A box's near side runs
   * up and to the right through the eye, so over a box it sits up and to the left, over the glyph.
   */
  function placeCameraTag() {
    const box = camera.mode === 'orthographic';
    const elevation = Math.PI / 2 - orbit.polarAngle;
    const rise = box
      ? 0
      : Math.max(0, Math.tan((camera.fov * DEG_TO_RAD) / 2 - elevation));
    const lift = Math.round(rise * (CAMERA_TAG.pyramid.x + cameraTag.width));
    const corner = box ? CAMERA_TAG.box : CAMERA_TAG.pyramid;

    cameraTag.anchor.set(box ? 1 : 0, 1);
    cameraTag.offset.set(corner.x, corner.y - lift);
    margin.top = MARGIN.top + lift;
  }

  /** The ground under the line of sight, from behind the camera to past the town, so the volume's lower edges land on it */
  function placeGround() {
    const reach = orbit.distance + TOWN_RADIUS;

    groundStart
      .set(camera.position.x, 0, camera.position.z)
      .addScaledVector(_sight, -reach);
    groundEnd.copyFrom(townFar).addScaledVector(_sight, reach);
    ground.thickness = inset.unitsPerPixel * PX.ground;
    ground.set(groundStart, groundEnd);
  }

  return {
    update() {
      fitPicture();
      placeCameraTag();
      placeSideCamera();
      placeGround();
      // Twice the camera's distance, so an edge that never meets the ground runs on out of the picture.
      frustum.length = 2 * orbit.distance;
      frustum.thickness = inset.unitsPerPixel * PX.volume;
      frustum.size = inset.unitsPerPixel * PX.glyph;
      frustum.update();
      cameraTag.at.copyFrom(frustum.eye);
      labels.update();
      inset.update();
    },
  };
}
