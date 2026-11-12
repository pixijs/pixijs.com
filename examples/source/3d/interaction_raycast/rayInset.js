/**
 * The side view of the pick: the ray `raycast` casts, seen from beside the field
 *
 * The main camera looks straight down every ray it casts, so the main view shows the ray as a point. This kit
 * InsetView draws the scene again from the camera `sideCamera.ts` places, and draws the ray over it: the main camera's
 * view volume, whose end face stands for the screen, the pointer where the ray crosses it, the accent ray to the hit,
 * and a faint dashed line where the ray carries on past it into any shape behind, which loses to the closer hit. A
 * miss is a faint line to the floor.
 *
 * The view volume and the ray are world-space lines projected into the inset's overlay, not 3D helpers with
 * `inset.only`, because the side camera draws only a slab round the ray's end, and that would clip a 3D helper: the
 * main camera's eye lies past its far plane. It's a visual like `visuals.ts`, which owns it, in a file of its own to
 * keep both short.
 */

import { Matrix4, Ray, Vector3 } from '@pixi/3d';

import { Point, Rectangle } from 'pixi.js';

import { InsetView } from './theme/InsetView';
import { NARROW_BELOW, viewRect } from './theme/overlay';
import { ScreenLines } from './theme/ScreenLines';

import { createSideCamera } from './sideCamera';

/** How far the faint line runs on past a hit at most, and how far a ray that never meets the floor is drawn */
const PAST_HIT = 3;
const MISS_LENGTH = 16;
/**
 * How deep the main camera's view volume is drawn, as a share of the camera's distance to the point it orbits; its end
 * face stands for the screen. A share, so the volume keeps its size against the ray when the camera backs off on a
 * phone or the reader zooms.
 */
const FRUSTUM_SHARE = 0.2;
/** Line widths, the pointer dot's radius and the arrowhead's size, in px */
const PX = { edge: 1.5, ray: 2, past: 1.5, dot: 4, head: 8 };
/**
 * The picture's size in px: tall for the near-vertical ray, and the shortest it shrinks to under the open pane on a
 * short screen before it hides. Under 600 px wide it spans the screen along the bottom at `narrowHeight`.
 */
const PICTURE = { width: 220, height: 224, minHeight: 150, narrowHeight: 200 };
/**
 * The px of the screen's height under the pane that aren't picture, less the panel's gap to the screen's bottom: its
 * 4 px rim top and bottom, the 15 px the title tag stands out above it, and 8 px between the tag and the pane
 */
const UNDER_PANE = 8 + 15 + 8;
/** The panel's gap to the screen's bottom, in px: the kit Panel's margin, smaller under 600 px wide */
const SCREEN_GAP = { wide: 24, narrow: 16 };

const _matrix = new Matrix4();
const _up = new Vector3();
const _back = new Vector3();
const _cornerRay = new Ray();
const _corner = new Point();
const _screen = new Rectangle();
const _from = new Point();
const _to = new Point();

export function createRayInset({ app, view3d, stage, orbit, pane, shapes }) {
  const viewPasses = view3d.passes.length;
  const inset = new InsetView({
    app,
    view3d,
    stage,
    title: 'the ray, from the side',
    // Under the pane, with the rest of the UI.
    corner: 'bottom-right',
    width: PICTURE.width,
    height: PICTURE.height,
    narrow: { width: 'full', height: PICTURE.narrowHeight },
  });
  // The inset appends four passes to the view's, which draw the scene again from its camera. They and the panel stay
  // off until the first ray, so nothing draws a picture no one sees before the reader's pointer arrives, and while
  // the pane leaves the picture no room.
  const passes = view3d.passes.slice(viewPasses);
  // The ray's points in world space, rewritten each frame; the side camera frames them.
  const framedRay = {
    eye: new Vector3(),
    face: [new Vector3(), new Vector3(), new Vector3(), new Vector3()],
    end: new Vector3(),
    far: new Vector3(),
    forward: new Vector3(),
    right: new Vector3(),
  };
  const { eye, face, end, far, forward, right } = framedRay;
  const sideCamera = createSideCamera({ inset, shapes, ray: framedRay });
  const marks = inset.overlay.addChild(new ScreenLines({ stage }));
  const dot = new Vector3();
  const eye2d = new Point();
  const face2d = new Float32Array(8);
  // Above the eye and right of it, clear of the view volume, which opens down-right.
  const cameraTag = inset.labels.add({
    text: 'camera',
    anchor: { x: 0, y: 1 },
    offset: { x: 8, y: -8 },
  });
  const pointerTag = inset.labels.add({
    text: 'pointer',
    anchor: { x: 0, y: 0.5 },
    offset: { x: 10, y: 0 },
  });
  /** Whether the reader's pointer has come over the canvas, and whether the picture fits under the pane */
  let arrived = false;
  let fits = true;

  function show() {
    const on = arrived && fits;

    if (inset.visible === on) return;
    inset.visible = on;
    for (const pass of passes) pass.enabled = on;
  }

  /**
   * Shrinks the picture to the room left under the pane, which grows as the reader opens it or its hit folder, and
   * hides it when even the shortest picture won't fit: on a short screen with the pane open. Under 600 px wide the
   * picture keeps its height, and hides the same way.
   */
  function fit() {
    const { width, height } = app.screen;
    const narrow = width < NARROW_BELOW;
    const room =
      height -
      pane.element.getBoundingClientRect().bottom -
      UNDER_PANE -
      SCREEN_GAP[narrow ? 'narrow' : 'wide'];

    fits = room >= (narrow ? PICTURE.narrowHeight : PICTURE.minHeight);
    if (fits && !narrow)
      inset.setSize(PICTURE.width, Math.min(PICTURE.height, Math.floor(room)));
    show();
  }

  show();
  fit();
  app.renderer.on('resize', fit);
  // Tweakpane's fold animates the pane's height, and the observer follows it frame by frame.
  new ResizeObserver(fit).observe(pane.element);

  /** Where a ray from the main camera crosses the view volume's end face, `depth` in front of the camera */
  function onEndFace(from, depth, out) {
    return from.at(depth / from.direction.dot(forward), out);
  }

  /** Projects a world point into the picture, in global px; every point drawn is in front of the side camera */
  function project(point, out) {
    return inset.project(point, out) ?? out;
  }

  /** The main camera's view volume, cut off at the end face that stands for the screen */
  function drawVolume() {
    marks.style('ink', PX.edge, 0.7);
    for (let i = 0; i < 4; i++) {
      project(face[i], _to);
      face2d[i * 2] = _to.x;
      face2d[i * 2 + 1] = _to.y;
      marks.line(eye2d.x, eye2d.y, _to.x, _to.y);
    }
    marks.polyline(face2d, 4, true);
  }

  /** A 3D segment as a 2D line or arrow in the current style */
  function drawSegment(from, to, arrow = false) {
    project(from, _from);
    project(to, _to);
    if (arrow) marks.arrow(_from.x, _from.y, _to.x, _to.y, PX.head);
    else marks.line(_from.x, _from.y, _to.x, _to.y);
  }

  /**
   * The ray's points for this frame: its start, the view volume's end face round it, its end, and where the faint line
   * past a hit stops
   */
  function measure(ray, hit, floorPoint) {
    view3d.camera
      .getGlobalTransform(_matrix, true)
      .extractBasis(right, _up, _back);
    right.normalize();
    forward.copyFrom(_back).normalize().multiplyScalar(-1);
    eye.copyFrom(ray.origin);
    viewRect(view3d, _screen);
    const depth = orbit.distance * FRUSTUM_SHARE;

    for (let i = 0; i < 4; i++) {
      _corner.set(
        i === 1 || i === 2 ? _screen.right : _screen.x,
        i >= 2 ? _screen.bottom : _screen.y,
      );
      onEndFace(view3d.screenToRay(_corner, _cornerRay, true), depth, face[i]);
    }
    onEndFace(ray, depth, dot);
    if (hit) end.copyFrom(hit.point);
    else if (floorPoint) end.copyFrom(floorPoint);
    else ray.at(MISS_LENGTH, end);
    if (hit) {
      // On past the hit to the floor, a few units at most: the part of the ray where a farther shape loses.
      const floorDistance = floorPoint ? eye.distanceTo(floorPoint) : Infinity;

      ray.at(Math.min(floorDistance, hit.distance + PAST_HIT), far);
    } else {
      far.copyFrom(end);
    }
  }

  return {
    inset,
    update(ray, hit, floorPoint, dt) {
      if (!arrived) {
        arrived = true;
        show();
      }
      if (!inset.visible) return;
      measure(ray, hit, floorPoint);
      sideCamera.place(hit ? hit.target : null, dt);

      marks.clear();
      project(eye, eye2d);
      drawVolume();
      marks.style('ink', PX.past, 0.8, 4, 3);
      if (hit) {
        drawSegment(end, far);
        marks.style('accent', PX.ray);
        drawSegment(eye, end, true);
      } else {
        drawSegment(eye, end);
      }
      project(dot, _to);
      // A haze rim under the dot parts it from the lines it sits on.
      marks
        .style('haze')
        .dot(_to.x, _to.y, PX.dot + 1.5)
        .style('ink')
        .dot(_to.x, _to.y, PX.dot);
      marks.update();

      cameraTag.at.copyFrom(eye);
      pointerTag.at.copyFrom(dot);
      inset.update(dt);
    },
  };
}
