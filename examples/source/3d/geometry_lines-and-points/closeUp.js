/**
 * The close-up of vertex 0: the same scene from a camera a hand's width away, where a dot with a size in the world draws
 * big and the line leaving it still draws one pixel wide
 */

import { Vector3 } from '@pixi/3d';

import { Point, Rectangle } from 'pixi.js';

import { InsetView } from './theme/InsetView';
import { ScreenLines } from './theme/ScreenLines';

/** The camera's place and aim, from vertex 0: near enough that its dot is big and the line still 1 px */
const EYE = { x: 0.3, y: 0.32, z: 0.42 };
const AIM = { x: 0.05, y: 0, z: -0.2 };
/**
 * The picture's size in px: the pane's 260 less the panel's rim, so the two line up. On a short screen it shrinks to
 * this share of the height, so it clears the path.
 */
const PICTURE = { width: 252, height: 151, heightShare: 0.25 };
/** The gap to the screen's edges: the pane's, so the close-up's edges line up with it */
const MARGIN = 12;
/** The room between the pane and the panel, for the title tag on the panel's top edge, in px */
const UNDER_PANE = 12;
/** The room the scene keeps from the close-up on a screen taller than wide, in px */
const CLEAR_GAP = 8;

/** The inset, and its frame's update */

export function createCloseUp(options) {
  const { app, view3d, stage, positions, pane, fit, startRadius, tipRadius } =
    options;
  const vertex0 = new Vector3(positions[0], positions[1], positions[2]);
  // An open pane leaves the corner under it free. A short screen opens it folded, and the reader unfolds it over that
  // corner, so there the close-up docks bottom-right; on a phone it docks along the bottom.
  const underPane = pane.expanded;
  const paneBottom = underPane
    ? pane.element.getBoundingClientRect().bottom + UNDER_PANE
    : 0;
  // The screen less the band the pane takes along the top, refitted each frame.
  const screen = new Rectangle();

  const panel = new InsetView({
    app,
    view3d,
    stage,
    title: 'vertex 0, up close',
    screen,
    corner: underPane ? 'top-right' : 'bottom-right',
    margin: MARGIN,
    width: PICTURE.width,
    height: PICTURE.height,
    narrow: { corner: 'bottom', width: 'full', height: 170 },
  });
  // A same-scene inset always has a camera.
  const camera = panel.camera;
  // Drawn over the picture rather than as meshes in it: the inset has no antialiasing, so a mesh dot's edge steps.
  const dots = panel.overlay.addChild(new ScreenLines({ stage }));
  // The camera's right, so a point a radius along it from a dot's centre lands on the dot's edge.
  const across = new Vector3(EYE.z - AIM.z, 0, AIM.x - EYE.x).normalize();
  const edge = new Vector3();
  const centreAt = new Point();
  const edgeAt = new Point();
  let pictureScale = 1;

  camera.position.set(vertex0.x + EYE.x, vertex0.y + EYE.y, vertex0.z + EYE.z);
  camera.lookAt({
    x: vertex0.x + AIM.x,
    y: vertex0.y + AIM.y,
    z: vertex0.z + AIM.z,
  });

  /** Sizes the picture for the screen's height and docks the panel */
  function dock(dt) {
    const scale = Math.min(
      1,
      (app.screen.height * PICTURE.heightShare) / PICTURE.height,
    );

    if (scale !== pictureScale) {
      pictureScale = scale;
      panel.setSize(
        Math.round(PICTURE.width * scale),
        Math.round(PICTURE.height * scale),
      );
    }
    screen.copyFrom(app.screen);
    screen.y += paneBottom;
    screen.height -= paneBottom;
    panel.update(dt);
  }

  /** Draws a dot `radius` world units round `point`, the size it shows from the camera, when it fits the picture */
  function dot(point, radius, color) {
    edge.copyFrom(point).addScaledVector(across, radius);
    if (!panel.project(point, centreAt) || !panel.project(edge, edgeAt)) return;

    const r = Math.hypot(edgeAt.x - centreAt.x, edgeAt.y - centreAt.y);
    const { picture } = panel;

    if (centreAt.x - r < picture.x || centreAt.x + r > picture.right) return;
    if (centreAt.y - r < picture.y || centreAt.y + r > picture.bottom) return;
    dots.style(color).dot(centreAt.x, centreAt.y, r);
  }

  // A screen taller than wide gives the close-up a band of its own and centres the scene in the rest: under the
  // close-up where it sits below the pane, over it where a phone docks it along the bottom. Set at load.
  dock(0);
  if (app.screen.height > app.screen.width) {
    if (panel.narrow)
      fit.clearBottom = app.screen.bottom - panel.rect.top + CLEAR_GAP;
    else fit.clearTop = panel.rect.bottom + CLEAR_GAP;
    fit.refit();
  }

  return {
    panel,
    update(dt, tip, startShown) {
      dock(dt);
      dots.clear();
      if (startShown) dot(vertex0, startRadius, 'ink');
      dot(tip, tipRadius, 'accent');
      dots.update();
    },
  };
}
