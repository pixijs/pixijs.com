/**
 * Between pixi's 2D screen and the 3D world, in both directions
 *
 * The screen is pixels, with (0, 0) at the top-left and y running down: the space of `e.global`. The world is units
 * with y running up: the space of `view3d.root`. To pin a plain pixi `Text` to a 3D object, `node.toGlobal(point)`
 * takes a point in the object's own space into the world, and `view3d.worldToScreen(point, out)` projects it onto the
 * screen, every frame, since the answer moves with the camera. The other way, a screen point is a line through the
 * scene: `view3d.screenToRay(e.global, ray)` is the ray from the camera through that pixel,
 * `view3d.screenToWorld(e.global, floor)` is where it meets a `Plane` (or `null`), and
 * `view3d.screenToWorld(e.global, distance)` is the point that far along it. The side view shows the main camera, the
 * screen as a card in front of it, the pointer's ray going out through the card and the pyramid's line coming back.
 *
 * Controls: move the pointer over the floor to aim, tap to drop a shape there, drag to orbit. The pane lifts the name
 * tags, picks what a tap drops onto and how far along the ray, clears the shapes, and reads out the pyramid tag's
 * pixel, the pointer's pixel and the point it aims at. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Box, Plane, Ray, Vector3, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Container, Point, Text } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';

import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import {
  BASE_PIECES,
  PYRAMID_AT,
  SPOTS,
  TAG_STYLE,
  createClay,
  createPieceMotion,
  createPlacer,
  onTap,
} from './scene';

import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the pieces and the two spots in front of them whole */
const FIT_ASPECT = 0.8;
/** The distance a tap starts at, as a share of the camera's distance to the near spot, where the pointer starts */
const DISTANCE_START = 0.85;
/** How far the orbit turns either side of the front, in radians (10°): farther, the puck leaves an upright tablet */
const ORBIT_TURN = (10 * Math.PI) / 180;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Screen and world' });
const app = new Application();

await app.init({
  preference: rendererPreference,
  resizeTo: window,
  background: THEMES[theme].haze,
  antialias: true,
  autoStart: false,
  resolution: Math.min(window.devicePixelRatio, 2),
  autoDensity: true,
});
loading.progress(0.2);

// Built at the screen's size, so the tags and the side view are placed right on the very first frame.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme, fog: { near: 14, far: 44 } });

// A tap can drop a piece far down the floor, and a shadow box fitted to every caster would stretch to reach it.
stage.key.shadow.bounds = Box.fromCenterSize(
  { x: 0, y: 2.5, z: 1 },
  { x: 12, y: 5.4, z: 11 },
);

// The floor as maths: the plane y = 0, where the stage's floor lies.
const floor = new Plane(new Vector3(0, 1, 0), 0);
// What the pane sets: the tags' lift in px, and where on the pointer's ray a tap lands. The distance starts from where
// the camera stands, so it's set once the camera is placed.
const params = { labelOffset: 14, dropOn: 'floor', distance: 0 };
// The pointer in global px, the space of e.global, and what it aims at this frame.
const pointer = new Point();
const aim = { ray: new Ray(), point: new Vector3(), hit: false };
const dropSpot = new Vector3();
const tagPoint = new Vector3();

// The name tags are plain 2D, over the view. Their container stays at the stage's origin, unmoved, so its own px are
// global px, the space worldToScreen answers in.
const tagLayer = new Container({ eventMode: 'none' });
const pieces = [];
const motion = createPieceMotion();

app.stage.addChild(view3d, tagLayer);

/** A clay piece standing at `at`, and its name tag */
function addPiece(shape, color, at) {
  const { root, top } = createClay(shape, color, at);
  // Its position is the projected point the ticker writes; its pivot lifts the text that many px above it.
  const tag = new Text({
    text: shape,
    style: TAG_STYLE,
    anchor: { x: 0.5, y: 1 },
    pivot: { x: 0, y: params.labelOffset },
    roundPixels: true,
  });
  const piece = { root, top, tag };

  view3d.root.addChild(root);
  tagLayer.addChild(tag);
  pieces.push(piece);

  return piece;
}

// Each turns slowly from its own angle, about the upright line its tag's point sits on, so the tags hold still.
BASE_PIECES.forEach(({ shape, color, at }, i) =>
  motion.turn(addPiece(shape, color, at).root, i),
);
// It stays where it stands, so when the pixel its tag sits on changes, the camera moved.
const pyramid = addPiece('pyramid', 'sky', PYRAMID_AT);

motion.turn(pyramid.root, BASE_PIECES.length);

// The pieces taps place, three at most. One stands already, so the first frame shows what a tap leaves.
const placer = createPlacer({ pieces, motion, add: addPiece });

placer.place(SPOTS.left);

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.9, 9.8);

// Updated first in the tick, not on pixi's shared ticker, so the tags project through the camera this frame draws.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.5, z: 0.4 },
  autoUpdate: false,
  enableDamping: true,
  enablePan: false,
  // Nearer, the pieces spread out over the corner where the side view sits, even at its smallest.
  minDistance: 8,
  maxDistance: 16,
  // No higher than 18° above level, so the horizon, where rays start to miss the floor, stays in frame; no lower than 9°.
  minPolarAngle: 1.25,
  maxPolarAngle: Math.PI * 0.45,
  minAzimuthAngle: -ORBIT_TURN,
  maxAzimuthAngle: ORBIT_TURN,
});

// A portrait screen is narrower than the pieces, so the camera and the fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });
orbit.update();

// A little short of the near spot, to the row's 0.1 step, so a point that far along its ray stands just above the floor
// there, about the size of a piece dropped on the floor. Nearer, a piece in the air looms over the row behind it.
params.distance =
  Math.round(
    view3d.camera.position.distanceTo(SPOTS.near) * DISTANCE_START * 10,
  ) / 10;
// A still pointer sends no move, so until the reader's pointer arrives the aim starts on the near spot's pixel.
view3d.worldToScreen(SPOTS.near, pointer);

/** Drops the next piece where the ray through `screen` meets the floor, or `distance` along it */
function dropAt(screen) {
  // screenToWorld is the ticker's two ray steps in one call: screenToRay, then intersectPlane or at.
  if (params.dropOn === 'floor') {
    const spot = view3d.screenToWorld(screen, floor, dropSpot);

    // null: the ray runs above the horizon and never meets the floor.
    if (spot) motion.arrive(placer.place(spot).root, true);
  } else {
    const spot = view3d.screenToWorld(screen, params.distance, dropSpot);

    // Never null, but it knows nothing of the floor: past it, the point lies under it, where the floor hides a piece.
    if (spot.y >= 0) motion.arrive(placer.place(spot).root, false);
  }
}

view3d.on('pointermove', (e) => pointer.copyFrom(e.global));
// A touch has no move before its press, so the press aims too.
view3d.on('pointerdown', (e) => pointer.copyFrom(e.global));
onTap(view3d, (e) => dropAt(e.global));

const pane = new ThemePane({ title: 'Screen and world', stage });

// A row for each of params, and read-only rows for the pixels and the point the lesson crosses between.
createControls({ pane, params, pieces, placer, pointer, aim, pyramid });

const visuals = createVisuals({
  app,
  view3d,
  stage,
  orbit,
  pointer,
  aim,
  pieces,
  pyramid,
  params,
  tagLayer,
});

/** One frame: the camera first, so everything after it projects through the camera this frame draws with */
function update(dt) {
  orbit.update();
  stage.update(dt);
  motion.update(dt);

  // Screen to world: the ray from the camera through the pointer, then the one point on it the pane picks. The
  // hover keeps the ray, which the side view draws, so it takes the two steps that screenToWorld takes in one.
  view3d.screenToRay(pointer, aim.ray);
  if (params.dropOn === 'floor') {
    aim.hit = aim.ray.intersectPlane(floor, aim.point) !== null;
  } else {
    aim.ray.at(params.distance, aim.point);
    aim.hit = true;
  }

  // World to screen, every frame, since the answer moves with the camera. A piece's top is in its own space, and
  // worldToScreen takes a point in view3d.root's, so toGlobal converts it first. The answer is in global px, which
  // are tagLayer's own, so it goes straight into the tag's position; under a moved container, it would need that
  // container's toLocal. worldToScreen returns null only for a point behind the camera, never for one off the edge of
  // the screen; an orbit camera keeps them in front, a free one doesn't.
  for (const piece of pieces) {
    piece.root.toGlobal(piece.top, tagPoint);
    piece.tag.visible =
      view3d.worldToScreen(tagPoint, piece.tag.position) !== null;
  }

  visuals.update(dt);
}

app.ticker.add((ticker) => update(Math.min(ticker.deltaMS / 1000, 1 / 15)));

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
