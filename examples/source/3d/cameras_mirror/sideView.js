/**
 * The side view: the mirror seen edge-on with both cameras, so the reader sees `mirrorCamera` stand as far under the
 * glass as `view3d.camera` stands over it, and rise as the view's camera sinks
 *
 * It's a small orthographic view of its own, turned with the orbit so it always looks across the upright plane the
 * viewer's line of sight lies in. Flat copies of the logo and the stand sit behind the frusta, and the wash under the
 * mirror line is the half of the world the clipping plane hides from `mirrorCamera`. It reads the lesson's objects
 * each frame and never changes them.
 */

import { Container3D, Mesh3D, PlaneGeometry, Vector3 } from '@pixi/3d';

import { DEG_TO_RAD } from 'pixi.js';

import { ArrowHelper } from './theme/ArrowHelper';
import { FrustumHelper } from './theme/FrustumHelper';
import { GhostHelper } from './theme/GhostHelper';
import { helperMaterial } from './theme/helpers';
import { InsetView } from './theme/InsetView';

import { BRAND, CLAY } from './theme/palette';
import { RIM, SIDE } from './layout';

/** Room round the framed span for the camera tags, in px: they hang over and under the eyes, behind them */
const MARGIN = { top: 46, right: 8, bottom: 46, left: 92 };
/** Line widths, the frusta's camera glyph and their most length, in px */
const PX = { line: 2, glyph: 22, frustum: 44 };
/**
 * The most a frustum's far end opens out from its middle, as a share of the lowest eye's height over the glass, so a
 * lens widened for a narrow screen never opens the two so far they meet at the mirror line
 */
const OPENING = 0.6;
/** The least the framed span runs behind the target: past the stand's far end from the side the camera opens on */
const BEHIND = 2.6;
/** The wash's distance behind the plane, past the props, and its size, more than any picture shows */
const WASH = { depth: 10, width: 80, height: 40 };
/** The clipping plane's tag's inset from the picture's bottom-right corner, in px: in the wash, clear of the frusta */
const CLIP_CORNER = 8;
/** How far out on the viewer's right the side view's camera starts; `frame()` slides it along its view to fit */
const CAMERA_OUT = 30;

const _aim = new Vector3();

export function createSideView(options) {
  const { app, stage, view3d, orbit, logo, stand, mirrorCamera, mirrorY } =
    options;
  const inset = new InsetView({
    app,
    stage,
    title: 'from the side',
    mode: 'orthographic',
    width: SIDE.width,
    height: SIDE.height,
    padding: RIM,
    // A drag that starts over the side view still orbits the main view.
    eventMode: 'none',
  });
  // An inset with neither a view nor a texture always has a view, a scene and a camera of its own.
  const root = inset.root;
  const camera = inset.camera;

  // The panel behind the picture is already the background's colour. The engine draws a background as a cube round the
  // camera, which an orthographic lens shows at its size in the scene: a small square in the picture's middle.
  inset.view3d.background = null;

  // The upright plane through the target that the viewer's line of sight lies in: local +z runs toward the viewer.
  const sightPlane = new Container3D({ parent: root });
  // A plane faces +z; turned a quarter, it faces the side view's camera, which looks along -x.
  const wash = new Mesh3D({
    geometry: new PlaneGeometry({ width: WASH.width, height: WASH.height }),
    material: helperMaterial('ink', 0.1),
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
    position: { x: -WASH.depth, y: mirrorY - WASH.height / 2, z: 0 },
    parent: sightPlane,
  });
  const mirrorLine = new ArrowHelper({
    color: 'ink',
    head: false,
    xray: true,
    parent: sightPlane,
  });
  const logoCopy = new GhostHelper({
    source: logo.root,
    color: BRAND.logoFace,
    opacity: 1,
    parent: root,
  });
  const viewFrustum = new FrustumHelper({
    camera: view3d.camera,
    view: view3d,
    xray: true,
    parent: root,
  });
  const mirrorFrustum = new FrustumHelper({
    camera: mirrorCamera,
    color: BRAND.sky,
    xray: true,
    parent: root,
  });
  const frusta = [viewFrustum, mirrorFrustum];
  const labels = inset.labels;
  // Over and under the eyes and behind them, so a wide portrait lens's frustum never runs into them. Where the picture
  // is too small for that, they slide in from its left edge, leaving the clipping plane's tag its room.
  const viewTag = labels.add({
    text: 'camera',
    offset: { x: 0, y: -24 },
    anchor: { x: 1, y: 1 },
  });
  const mirrorTag = labels.add({
    text: 'mirror camera',
    color: BRAND.sky,
    offset: { x: 0, y: 24 },
    anchor: { x: 1, y: 0 },
  });
  const clipTag = labels.add({
    text: 'clipped',
    screen: { x: 0, y: 0 },
    anchor: { x: 1, y: 1 },
  });
  // A label made with `screen` always has its point.
  const clipAt = clipTag.screen;
  // The span the picture frames, in the plane: from behind the target to the farthest the eye gets, and from the
  // highest the eye gets down to its reflection.
  const corners = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];
  // Along the ground toward the viewer, and to their right, where the side view's camera stands.
  const across = new Vector3();
  const right = new Vector3();
  const reach = orbit.distance * Math.sin(orbit.maxPolarAngle);
  const standBox = stand.geometry.bounds3D;
  const rise =
    orbit.target.y + orbit.distance * Math.cos(orbit.minPolarAngle) - mirrorY;
  const lowest =
    orbit.target.y + orbit.distance * Math.cos(orbit.maxPolarAngle) - mirrorY;
  let pxSize = 0;
  let fovSize = 0;

  new GhostHelper({
    source: stand,
    color: CLAY.lilac,
    opacity: 1,
    parent: root,
  });
  mirrorLine.set(
    { x: 0, y: mirrorY, z: -WASH.width / 2 },
    { x: 0, y: mirrorY, z: WASH.width / 2 },
  );

  /** Turns the side view's camera to look across the viewer's plane from their right, and fits the span to the view */
  function frame() {
    const target = orbit.target;
    const theta = orbit.azimuthAngle;

    across.set(Math.sin(theta), 0, Math.cos(theta));
    right.set(across.z, 0, -across.x);
    sightPlane.position.set(target.x, 0, target.z);
    sightPlane.rotation.y = theta;
    camera.position
      .set(target.x, mirrorY, target.z)
      .addScaledVector(right, CAMERA_OUT);
    camera.lookAt(_aim.set(target.x, mirrorY, target.z));
    // Seen from another side, the stand's far end lies further behind the target than from the opening side.
    const standX =
      stand.position.x +
      (across.x > 0 ? standBox.min.x : standBox.max.x) -
      target.x;
    const standZ =
      stand.position.z +
      (across.z > 0 ? standBox.min.z : standBox.max.z) -
      target.z;
    const behind = Math.max(BEHIND, -(standX * across.x + standZ * across.z));

    for (let i = 0; i < 4; i++) {
      const s = i < 2 ? -behind : reach;

      corners[i].set(
        target.x + across.x * s,
        mirrorY + (i % 2 ? rise : -rise),
        target.z + across.z * s,
      );
    }
    inset.frame(corners, MARGIN);
  }

  /** Sizes the mirror line and the frusta to hold their widths in px, when the picture's scale or the lens changed */
  function size(px) {
    const { fov } = view3d.camera;

    if (px === pxSize && fov === fovSize) return;
    pxSize = px;
    fovSize = fov;
    // A picture shrunk to fit beside or under the subject shortens the frusta with it, so they stay clear of the tags
    // and of each other.
    const shrink = Math.min(1, inset.picture.height / SIDE.height);
    const length = Math.min(
      px * PX.frustum * shrink,
      (OPENING * lowest) / Math.tan((fov * DEG_TO_RAD) / 2),
    );

    mirrorLine.thickness = px * PX.line;
    for (const frustum of frusta) {
      frustum.length = length;
      frustum.size = px * PX.glyph;
      frustum.thickness = px * PX.line;
    }
  }

  return {
    inset,
    update(dt) {
      frame();
      size(inset.unitsPerPixel);
      // The wash shows only while the clipping plane hides that half from mirrorCamera.
      wash.visible = mirrorCamera.clippingPlane !== null;
      clipTag.hidden = !wash.visible;
      clipAt.set(
        inset.picture.right - CLIP_CORNER,
        inset.picture.bottom - CLIP_CORNER,
      );
      logoCopy.position.copyFrom(logo.root.position);
      logoCopy.rotation.y = logo.root.rotation.y;
      viewFrustum.update();
      mirrorFrustum.update();
      viewTag.at.copyFrom(viewFrustum.eye);
      mirrorTag.at.copyFrom(mirrorFrustum.eye);
      inset.update(dt);
    },
  };
}
