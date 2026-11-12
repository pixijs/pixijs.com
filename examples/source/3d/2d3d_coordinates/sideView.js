/**
 * The side view: the scene again from a second camera beside the main one, for what the main view can't show, that
 * a screen point is a ray from the camera and a world point reaches the screen along a line to it
 *
 * A kit InsetView in the bottom-right corner. It draws the main camera and its view volume, cut off at a card that
 * stands for the screen. The pointer's ray runs from the camera through the pointer's place on the card to the point
 * it aims at, and the pyramid's line comes back the other way, through the pixel its tag sits on. With `drop on` at a
 * distance, an arc that far from the camera crosses the ray at the point. Those draw in the inset only; the floor, the
 * pieces and the ring show in both views.
 */

import { Vector3 } from '@pixi/3d';

import { AngleHelper } from './theme/AngleHelper';
import { ArrowHelper } from './theme/ArrowHelper';
import { DotHelper } from './theme/DotHelper';
import { FrustumHelper } from './theme/FrustumHelper';
import { InsetView } from './theme/InsetView';

import { createSideCamera, GLYPH_PX, PICTURE } from './sideCamera';

/** The card stands this share of the way from the camera to its target */
const CARD = 0.35;
/** How far a ray that misses the floor is drawn, in world units */
const MISS_LENGTH = 30;
/** Half the distance arc's sweep, either side of the ray, in radians */
const ARC_HALF = (25 * Math.PI) / 180;
/** Line widths and the dots' radius, in screen px at the inset's scale */
const PX = { line: 1.5, ray: 2.5, dot: 4 };

const _end = new Vector3();
const _top = new Vector3();
const _edge = new Vector3();
const _across = new Vector3();
const _turn = new Vector3();
const _start = new Vector3();

export function createSideView(options) {
  const { app, view3d, stage, orbit, pointer, aim, pyramid, params } = options;
  const inset = new InsetView({
    app,
    view3d,
    stage,
    title: 'side view',
    corner: 'bottom-right',
    width: PICTURE.width,
    height: PICTURE.height,
    narrow: { width: 'full', height: PICTURE.narrowHeight },
  });
  // The pass the inset draws its own helpers in, so they show there and not in the main view.
  const pass = inset.pass;
  const parent = view3d.root;
  const frustum = new FrustumHelper({
    camera: view3d.camera,
    view: view3d,
    pass,
    parent,
  });
  const ray = new ArrowHelper({ color: 'accent', pass, parent });
  const pointerDot = new DotHelper({ color: 'accent', pass, parent });
  const line = new ArrowHelper({ color: 'ink', head: false, pass, parent });
  const pixelDot = new DotHelper({ color: 'ink', pass, parent });
  const arc = new AngleHelper({
    color: 'ink',
    head: false,
    wedge: false,
    pass,
    parent,
  });
  const sideCamera = createSideCamera({
    app,
    view3d,
    stage,
    orbit,
    inset,
    top: _top,
    params,
  });
  const eyeTag = inset.labels.add({ text: 'camera', offset: { x: 0, y: -16 } });
  // Right of the middle of the card's top edge, growing away from the camera's tag, so the two part as the view zooms
  // out and the card comes in towards the camera.
  const screenTag = inset.labels.add({
    text: 'screen',
    anchor: { x: 0, y: 1 },
    offset: { x: 4, y: -6 },
  });

  /** Puts `dot` where the screen point `screen` lies on the card, which is the screen stretched over the view volume */
  function placeOnCard(dot, screen) {
    const { corners } = frustum;
    const topLeft = corners[0];

    dot.position
      .copyFrom(topLeft)
      .addScaledVector(
        _edge.copyFrom(corners[1]).subtract(topLeft),
        screen.x / app.screen.width,
      )
      .addScaledVector(
        _edge.copyFrom(corners[3]).subtract(topLeft),
        screen.y / app.screen.height,
      );
  }

  /** The arc of points `distance` from the camera, across the ray: equal distances lie on a sphere round the eye */
  function placeArc() {
    const direction = aim.ray.direction;

    arc.visible = params.dropOn === 'distance';
    if (!arc.visible) return;
    _across.set(direction.z, 0, -direction.x).normalize();
    // The ray turned back half the sweep about the axis across it, so the arc centres on the ray.
    _start.copyFrom(direction).multiplyScalar(Math.cos(ARC_HALF));
    _start.addScaledVector(
      _across.cross(direction, _turn),
      -Math.sin(ARC_HALF),
    );
    arc.position.copyFrom(frustum.eye);
    arc.radius = params.distance;
    arc.setAxis(_across, _start);
    arc.radians = ARC_HALF * 2;
  }

  return {
    inset,
    update(dt) {
      // ray.at knows nothing of the floor, so at a distance the point can lie under it.
      const sunk = params.dropOn === 'distance' && aim.point.y < 0;

      pyramid.root.toGlobal(pyramid.top, _top);
      sideCamera.update();

      const px = inset.unitsPerPixel;

      frustum.length = CARD * orbit.distance;
      frustum.thickness = px * PX.line;
      frustum.size = px * GLYPH_PX;
      frustum.update();
      ray.thickness = px * PX.ray;
      // Drawn through the floor while the point lies under it, so the ray shows all the way there.
      ray.xray = arc.xray = sunk;
      ray.set(frustum.eye, aim.hit ? aim.point : aim.ray.at(MISS_LENGTH, _end));
      pointerDot.radius = pixelDot.radius = px * PX.dot;
      placeOnCard(pointerDot, pointer);
      placeOnCard(pixelDot, pyramid.tag.position);
      line.thickness = px * PX.line;
      line.set(_top, frustum.eye);
      arc.thickness = px * PX.line;
      placeArc();

      eyeTag.at.copyFrom(frustum.eye);
      screenTag.at
        .copyFrom(frustum.corners[0])
        .add(frustum.corners[1])
        .multiplyScalar(0.5);
      inset.update(dt);
    },
  };
}
