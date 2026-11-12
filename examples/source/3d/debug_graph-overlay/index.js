/**
 * Seeing the frame: `GraphDebugOverlay` records and reviews a view's frames, and `RenderGraphDebugger` captures one
 * as data
 *
 * A frame is a list of render passes run in order, and each scene pass keeps its draw calls from frame to frame.
 * Moving or hiding a mesh reuses them. Adding or removing one, swapping its material or making it see-through repacks
 * them: the draws stay and only their ranges move. A mesh of a kind no draw has gets a draw of its own at the end,
 * and about a second later the pass rebuilds to sort it in. Each capture says which, and why. On WebGL, meshes that
 * share a geometry and a shader share one draw, as the twin shares the sphere's; WebGPU gives each material its own
 * draw until a run of them would pass 16.
 *
 * Controls: drag to orbit; on the overlay, press Record, change the scene, press Stop, then drag the frame slider
 * through the recorded frames. `‹ Change` and `Change ›` jump only between frames that rebuilt draws or recorded a
 * bundle, so they skip a repack. The pane's Change the scene rows make the changes and its Last capture rows show
 * what the debugger read; turn live capture off to make several changes, then press Capture for one answer to them
 * all; Capture also logs the whole snapshot to the console. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Mesh3D, View3D } from '@pixi/3d';
import {
  GraphDebugOverlay,
  OrbitCamera,
  RenderGraphDebugger,
} from '@pixi/3d/extras';

import { Application, UPDATE_PRIORITY } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { clayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { THEMES, themeFromUrl } from './theme/palette';

import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';

import { createMotion, createShapes, SHAPE_COLORS } from './scene';

/** A capture walks every mesh and builds a new snapshot, so the pane reads one four times a second */
const CAPTURE_EVERY = 0.25;
/** Each recorded frame keeps a whole snapshot; ten seconds is plenty and stays light on a phone */
const RECORD_FRAMES = 600;
/** The narrowest view, width over height, that shows the whole scene from the landscape distance */
const FIT_ASPECT = 1;
/** The same with the pane open beside the scene, which takes 272 px of the right */
const BESIDE_PANE_ASPECT = 2;
/** The share of the landscape view's height the scene needs: twice its reach below the orbit target, with a margin */
const SCENE_HEIGHT = 0.55;
/** The scene's middle: the twin floats left of the logo, so it sits left of the origin */
const CENTRE_X = -0.5;
/** The overlay's idle panel ends 79 px down the page's top-right corner, so the pane starts under it */
const PANE_TOP = 88;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Seeing the frame' });
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

const view3d = new View3D({ autoResize: true });
const stage = new ThemeStage(view3d, {
  theme,
  spotlight: true,
  fog: { near: 10, far: 30 },
});
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();
const logo = await loading.load(() => loadPixiLogo({ width: 4 }));

app.stage.addChild(view3d);
logo.root.position.y = 1.7;
view3d.root.addChild(logo.root);

const shapes = createShapes(view3d);
const { sphere, puck, octahedron } = shapes;
// Meshes can share a draw when they share a geometry and their materials share a shader. Two clay colours do; a
// see-through clay or another material class doesn't. So the twin, a pink sphere on the sphere's geometry, draws in
// the sphere's draw in the shadow pass, which binds no material, and on WebGL in the opaque pass too. WebGPU gives it
// a draw of its own there, as it does each material until a run of them would pass 16.
const twin = new Mesh3D({
  geometry: sphere.geometry,
  material: clayMaterial('pink'),
  label: 'twin',
  position: { x: -2.8, y: 2, z: 1.4 },
  parent: view3d.root,
});
// Blending moves a mesh out of the opaque and shadow passes into the transparent one, which sorts back to front every
// frame and rebuilds its draws only when that order changes.
const seeThrough = clayMaterial(SHAPE_COLORS.octahedron, {
  alphaMode: 'blend',
  alpha: 0.45,
});
const state = {
  overlay: true,
  live: true,
  twin: true,
  twinVisible: true,
  puckColor: SHAPE_COLORS.puck,
  seeThrough: false,
};

// The frame as data. The debugger counts every mesh in the view, so the scene draws nothing but the lesson: a helper
// would add its own meshes and draws to the numbers it explains.
const debug = new RenderGraphDebugger({ view: view3d });
const readout = {
  captureId: 0,
  passes: '',
  meshes: 0,
  draws: 0,
  drawn: 0,
  status: '',
  causes: '',
};
/** Whether the scene changed since the last capture; true at the start, so the first capture answers for the motion */
let changed = true;

/** Reads a capture into the pane's Last capture rows */
function read(frame) {
  // Every Mesh3D in a view draws in its first batch, 'scene'; a BatchedMesh3D brings its own.
  const scene = frame.batches[0];
  const opaque = scene.passes.find((pass) => pass.name === 'opaque');

  readout.captureId = frame.captureId;
  readout.passes = frame.graph.passes
    .filter((pass) => pass.active)
    // Only a pass the graph culled has no passIdx.
    .sort((a, b) => (a.passIdx ?? 0) - (b.passIdx ?? 0))
    .map((pass) => pass.name)
    .join('\n');
  readout.meshes = opaque?.renderableCount ?? 0;
  readout.draws = opaque?.drawCallCount ?? 0;
  // A hidden mesh stays in its draw, which skips it: the count drawn drops, and the draws are reused.
  readout.drawn = opaque?.drawnInstanceCount ?? Number.NaN;
  // A capture compares with the one before it, so the first after a change answers it, and two changes between
  // captures come back as one answer; two that undo each other still repack, with no cause. A pass also rebuilds by
  // itself to sort in a draw it added for a new kind, so a capture that finds draws changed answers too, change or not.
  const touched = scene.passes.filter(
    (pass) =>
      pass.drawBuild.status === 'rebuilt' ||
      pass.drawBuild.status === 'repacked',
  );

  if (!changed && touched.length === 0) return;
  changed = false;

  if (touched.some((pass) => pass.drawBuild.status === 'rebuilt'))
    readout.status = 'rebuilt';
  else readout.status = touched.length > 0 ? 'repacked' : 'reused';
  readout.causes =
    [
      ...new Set(
        touched.flatMap((pass) =>
          pass.drawBuild.causes.map((cause) => cause.code),
        ),
      ),
    ].join('\n') || '-';
}

/** Takes a capture for the pane; the pane's Capture button also logs it whole */
function capture(log = false) {
  const frame = debug.capture();

  if (!frame) return;
  read(frame);
  if (log) console.log(frame);
}

// The overlay pins itself to the page's top-right corner above everything, the loading screen too, so it's built once
// that has gone, and the pane sits under it. Without `renderer`, Record captures nothing unless you call
// `overlay.refresh()` after each render yourself.
let overlay = null;

function setOverlay(on) {
  overlay?.destroy();
  overlay = on
    ? new GraphDebugOverlay({
        view: view3d,
        renderer: app.renderer,
        maxRecordedFrames: RECORD_FRAMES,
      })
    : null;
}

// The changes. Which of these rebuild the draws and which reuse them is the lesson.
function setTwin(on) {
  if (on) view3d.root.addChild(twin);
  else twin.removeFromParent();
  changed = true;
}

function setTwinVisible(visible) {
  twin.visible = visible;
  changed = true;
}

function setPuckColor(color) {
  puck.material = clayMaterial(color);
  changed = true;
}

function setSeeThrough(on) {
  // The kit shares one clay material per colour, so this is the octahedron's own, not a new one.
  octahedron.material = on ? seeThrough : clayMaterial(SHAPE_COLORS.octahedron);
  changed = true;
}

const motion = createMotion({ shapes, twin, logo });

view3d.camera.fov = 40;
view3d.camera.position.set(CENTRE_X, 3.2, 10);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: CENTRE_X, y: 1.2, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

const pane = new ThemePane({ title: 'Seeing the frame', stage, top: PANE_TOP });
const changes = {
  setOverlay,
  setTwin,
  setTwinVisible,
  setPuckColor,
  setSeeThrough,
};

createControls({
  pane,
  state,
  readout,
  changes,
  captureNow: () => capture(true),
});

// On a landscape screen the pane opens beside the scene, so the camera and the fog back off until the scene fits left
// of it. On a portrait one the scene sits under the pane, open on a tablet and folded to its title bar on a phone, and
// backs off until it fits the width.
const besidePane = pane.expanded && window.innerWidth > window.innerHeight;

fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: besidePane ? BESIDE_PANE_ASPECT : FIT_ASPECT,
  clearTop: besidePane ? 0 : pane.element.getBoundingClientRect().bottom,
  minHeight: SCENE_HEIGHT,
});

let time = 0;
let sinceCapture = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  // Every shape moves every frame, and the draws are still reused.
  motion.update(time);
});

// After the app's render, which runs at LOW, so each capture is the frame just drawn. A change between two captures
// folds into the next one.
app.ticker.add(
  (ticker) => {
    sinceCapture += ticker.deltaMS / 1000;
    if (!state.live || sinceCapture < CAPTURE_EVERY) return;
    sinceCapture = 0;
    capture();
  },
  undefined,
  UPDATE_PRIORITY.UTILITY,
);

// The first capture is the baseline the next compares with; the second reads what a running frame costs.
orbit.update();
app.render();
debug.capture();
app.render();
capture();
document.body.appendChild(app.canvas);
await loading.finish();
setOverlay(true);
app.start();
