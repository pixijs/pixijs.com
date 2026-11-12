/**
 * What the frame draws to explain painting at a hit: the brush ring lying flat on the ball at the last hit, a dab
 * wide and banded in the brush's colour, the hit's normal as an arrow out of it, and, on `hitVolume: 'box'`, the box
 * the pointer hits instead, with the face it struck outlined
 *
 * It reads the brush, the last hit and the scene each frame and never changes them, so `index.ts` runs the same
 * without it.
 */

import { Box, Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { ArrowHelper } from './theme/ArrowHelper';
import { BoxHelper } from './theme/BoxHelper';
import { GHOST_OPACITY } from './theme/helpers';
import { THEMES } from './theme/palette';
import { RingHelper } from './theme/RingHelper';

/**
 * The ring's ink: the ball is white on both themes, so the ring takes the light theme's dark grey ink rather than
 * the dark theme's pale one, which wouldn't show on it
 */
const RING_INK = THEMES.light.inkSoft;
/** The ring's ink line, in world units: thin enough not to hide the paint under it */
const RING_LINE = 0.03;
/**
 * The width of the band of the brush's colour just inside the ink line, in world units. A ring is as tall as it is
 * wide, so a wider band would stand off the ball and seem to slide off the ink line as the camera turns
 */
const COLOR_BAND = 0.05;
/** The normal arrow's length, in world units: long enough to read its tilt, short of the ball's edge */
const NORMAL_LENGTH = 0.6;
const NORMAL_THICKNESS = 0.04;
/** Px the arrow must span on screen to draw at full width; shorter, it points near the camera and thins */
const FULL_ARROW = 60;
/** The thinnest the arrow gets, as a share of its width, so its head seen end on is a dot inside the brush ring */
const MIN_THINNING = 0.25;
/** The box's edge width in the ball's space, which is scaled 3 times, so it draws about as fine as the ring's line */
const BOX_EDGE = 0.006;
/** The struck face's edge, twice the box's, so it stands out from the edges behind it */
const FACE_EDGE = 0.012;
/** The struck face's depth: a box flat to nothing scales its see-through faces to 0, which draws them black */
const FACE_DEPTH = 0.002;
/** The struck face's fill: half a ghost's, as its thin box shows two faces, one over the other */
const FACE_FILL = GHOST_OPACITY / 2;
const AXES = ['x', 'y', 'z'];

export function createVisuals({
  view3d,
  ball,
  brush,
  brushHit,
  worldPerPixel,
}) {
  const ring = new RingHelper({
    thickness: RING_LINE,
    color: RING_INK,
    parent: view3d.root,
  });
  const colorBand = new RingHelper({
    thickness: COLOR_BAND,
    color: brush.color,
    parent: view3d.root,
  });
  const normalArrow = new ArrowHelper({
    thickness: NORMAL_THICKNESS,
    parent: view3d.root,
  });
  // As the ball's children, these sit on its bounding box in its own space, the box `hitVolume: 'box'` picks.
  const bounds = ball.geometry.bounds3D;
  const boxFrame = new BoxHelper({ thickness: BOX_EDGE, parent: ball }).setBox(
    bounds,
  );
  const struckFace = new BoxHelper({
    thickness: FACE_EDGE,
    color: 'accent',
    fill: FACE_FILL,
    parent: ball,
  });
  const faceBox = new Box();
  let struckAxis = '';
  let struckPlane = NaN;
  const tip = new Vector3();
  const hitOnScreen = new Point();
  const tipOnScreen = new Point();

  /** Lays the ring on the hit at the brush's size, with a band of the brush's colour inside its ink line */
  function drawRing() {
    const radius = brush.radius * worldPerPixel;

    ring.radius = radius;
    // The band's outer edge meets the ink line's inner edge; on the smallest brush it closes into a dot.
    colorBand.radius = Math.max(0, radius - (RING_LINE + COLOR_BAND) / 2);
    colorBand.color = brush.color;
    ring.place(brushHit.point, brushHit.normal);
    colorBand.place(brushHit.point, brushHit.normal);
  }

  /** Draws the normal from the hit; seen nearly end on it thins, so its head is a dot in the ring, not a blot over it */
  function drawNormal() {
    tip
      .copyFrom(brushHit.point)
      .addScaledVector(brushHit.normal, NORMAL_LENGTH);

    const onScreen =
      view3d.worldToScreen(brushHit.point, hitOnScreen) &&
      view3d.worldToScreen(tip, tipOnScreen);
    const arrowPx = onScreen
      ? Math.hypot(tipOnScreen.x - hitOnScreen.x, tipOnScreen.y - hitOnScreen.y)
      : 0;

    normalArrow.thickness =
      NORMAL_THICKNESS *
      Math.max(MIN_THINNING, Math.min(1, arrowPx / FULL_ARROW));
    normalArrow.set(brushHit.point, tip);
  }

  /** Outlines the face of the box the box hit lies on: of its six faces, the one whose plane is nearest the hit */
  function outlineStruckFace() {
    const point = brushHit.localPoint;
    let nearest = Infinity;
    let axis = 'x';
    let plane = 0;

    for (let i = 0; i < AXES.length; i++) {
      const a = AXES[i];
      const toMin = Math.abs(point[a] - bounds.min[a]);
      const toMax = Math.abs(point[a] - bounds.max[a]);

      if (Math.min(toMin, toMax) < nearest) {
        nearest = Math.min(toMin, toMax);
        axis = a;
        plane = toMin < toMax ? bounds.min[a] : bounds.max[a];
      }
    }
    // Rewritten only when the hit crosses onto another face.
    if (axis === struckAxis && plane === struckPlane) return;
    struckAxis = axis;
    struckPlane = plane;
    faceBox.copyFrom(bounds);
    faceBox.min[axis] = plane - FACE_DEPTH / 2;
    faceBox.max[axis] = plane + FACE_DEPTH / 2;
    struckFace.setBox(faceBox);
  }

  return {
    update() {
      // A box hit has neither a uv nor a normal (`triangleIndex` is -1), so the ring and arrow show for a surface hit.
      const surfaceHit =
        ball.hitVolume === 'geometry' && brushHit.triangleIndex !== -1;
      const boxHit = ball.hitVolume === 'box' && brushHit.triangleIndex === -1;

      ring.visible = colorBand.visible = normalArrow.visible = surfaceHit;
      boxFrame.visible = ball.hitVolume === 'box';
      struckFace.visible = boxHit;
      if (surfaceHit) {
        drawRing();
        drawNormal();
      }
      if (boxHit) outlineStruckFace();
    },
  };
}
