/**
 * Thousands of meshes in a handful of draw calls, and the culling that skips what the camera can't see
 *
 * Plain `Mesh3D`s that share a geometry and a kind of material batch into instanced draws on their own, so 2,000 clay
 * pieces in seven shapes take seven draws on WebGL, whatever their colour. WebGPU draws each colour of a shape on its
 * own until a shape has more than 16. Each frame the view's `cull` skips the meshes outside the camera's view, on the
 * GPU on WebGPU (mostly on the CPU in Safari and iOS) and on the CPU on WebGL. `cullFrustum` borrows a second camera's
 * view, the scout's, so you can watch the cull from outside: as the scout sweeps round the disc, a piece it can't see
 * leaves only its floor dot. `RenderGraphDebugger` counts the draws and the pieces that survive the cull.
 *
 * Controls: drag to orbit; the pane changes the count, shapes and colours, the cull mode and the frustum culled
 * against, stops the sweep or turns the scout by hand, and reads back the draw calls and the pieces drawn. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Camera3D, Mesh3D, MeshPass, View3D } from '@pixi/3d';
import { OrbitCamera, RenderGraphDebugger } from '@pixi/3d/extras';
import { Application, RenderTexture, UPDATE_PRIORITY } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { clayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { CLAY_SHAPES, clayGeometry } from './theme/shapes';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';

import {
  COLOR_ORDER,
  createSweep,
  fitBesidePanels,
  layoutField,
  PIECE_SCALE,
  pieceColor,
  pieceShape,
} from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the whole disc from the landscape distance */
const FIT_ASPECT = 1.05;
/** The narrowest landscape, width over height, where the disc clears the pane and the inset beside it */
const BESIDE_ASPECT = 1.85;
/** Px an upright screen keeps free at the bottom for the inset and its title */
const INSET_BAND = 200;
/** Px an upright screen keeps free under the pane */
const PANE_GAP = 24;
/** A capture walks every mesh and allocates, so it runs a few times a second rather than every frame */
const CAPTURE_INTERVAL = 0.25;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Batching and culling' });
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

// 'gpu' is the default, written out to show the option. WebGL has no compute pass, so it culls on the CPU there.
const view3d = new View3D({ autoResize: true, cull: 'gpu' });
// The disc's far rim is 37 units from the camera, so the haze starts just past it. The floor is 400 across so its
// edge stays in the haze on a phone too, where `fitPortrait` backs the camera off and stretches the fog to 106 to 238.
const stage = new ThemeStage(view3d, {
  theme,
  size: 400,
  fog: { near: 40, far: 90 },
});

// A shadow pass culls against the light's own volume, not `cullFrustum`, so the pieces the main view skips would
// still cast shadows; it would also draw the whole field a second time.
stage.key.castShadow = false;
app.stage.addChild(view3d);

// The field. Nothing here asks for batching: meshes that share a geometry and a kind of material (the same material
// class and render state, such as `alphaMode` and `doubleSided`, so the same shader) land in one instanced run on
// their own. On WebGL colour doesn't split the run's one draw, since each mesh's material values travel with it per
// instance. WebGPU draws a run a material at a time, binding each one's own group, and merges it only past 16.
const field = [];
const settings = {
  count: 2000,
  shapes: CLAY_SHAPES.length,
  colors: COLOR_ORDER.length,
};

function setCount(count) {
  while (field.length < count) {
    const i = field.length;

    field.push(
      new Mesh3D({
        geometry: clayGeometry(pieceShape(i, settings.shapes), 'low'),
        material: clayMaterial(pieceColor(i, settings.colors)),
        scale: PIECE_SCALE,
        parent: view3d.root,
      }),
    );
  }
  // `destroy()` leaves a mesh's geometry and material alone unless asked, which suits the kit's shared ones.
  while (field.length > count) field.pop()?.destroy();
  layoutField(field);
}

function setShapes(shapes) {
  for (let i = 0; i < field.length; i++)
    field[i].geometry = clayGeometry(pieceShape(i, shapes), 'low');
  // Each shape rests at its own height.
  layoutField(field);
}

function setColors(colors) {
  for (let i = 0; i < field.length; i++)
    field[i].material = clayMaterial(pieceColor(i, colors));
}

// The scout: a second camera that draws into a texture, shown in the inset at its own size, small enough to clear the
// disc on a phone held sideways. Its scale mode is set at creation: one set later misses the WebGPU sampler.
const scoutTexture = RenderTexture.create({
  width: 240,
  height: 150,
  resolution: app.renderer.resolution,
  scaleMode: 'linear',
});
const scout = new Camera3D({
  fov: 50,
  near: 0.5,
  far: 30,
  renderTexture: scoutTexture,
  position: { x: 0, y: 4, z: 0 },
  parent: view3d.root,
});

// `passes` adds to the view's own passes rather than replacing them. A MeshPass named after one of those draws that
// pass's meshes again from its own camera: here the opaque pieces, from the scout. On WebGL the debugger counts what
// the last cull of those meshes kept, so the scout draws first, as a camera with a render texture does by default.
view3d.passes = [new MeshPass({ name: 'opaque', camera: scout })];
// Drawing from a camera is what rebuilds its `frustum`, and the view builds every pass camera before any pass draws,
// so the main view culls against this frame's scout: it draws only the pieces the scout can see.
view3d.camera.cullFrustum = scout.frustum;

// The camera's own `frustum` is what `cullFrustum` starts as.
function setCullFrustum(choice) {
  view3d.camera.cullFrustum =
    choice === 'scout' ? scout.frustum : view3d.camera.frustum;
}

// The scout sweeps round the disc like a radar beam, so the cull changes under it every frame.
const sweep = createSweep(scout);

// The counts. `drawCallCount` counts each draw command once, so the scout's replay of the opaque pass adds nothing.
const debug = new RenderGraphDebugger({ view: view3d });
const counts = { drawCalls: 0, drawn: 0 };
// The field's draws are the ones that bind a clay shape, which leaves out the floor's.
const pieceGeometries = new Set(
  CLAY_SHAPES.map((shape) => clayGeometry(shape, 'low').uid),
);
let nextCapture = 0;
let time = 0;

/** Reads the last rendered frame when a capture is due: every draw in it, and the pieces that survived the cull */
function readFrame() {
  if (time < nextCapture) return;
  nextCapture = time + CAPTURE_INTERVAL;

  const frame = debug.capture();

  if (!frame) return;
  counts.drawCalls = frame.summary.drawCallCount;
  counts.drawn = 0;
  // The first batch is the view's own meshes; each BatchedMesh3D would add one after it.
  for (const pass of frame.batches[0].passes) {
    if (pass.name !== 'opaque') continue;
    for (const draw of pass.draws) {
      // The debugger runs a GPU cull's test again on the CPU for a forward pass, so the count is never null here.
      if (pieceGeometries.has(draw.geometryIds[0]))
        counts.drawn += draw.drawnInstanceCount ?? 0;
    }
  }
}

setCount(settings.count);

const visuals = createVisuals({
  app,
  view3d,
  stage,
  field,
  scout,
  scoutTexture,
});

// 29 units from the target and 50° down: high enough to see the whole disc from outside the scout's view.
view3d.camera.fov = 40;
view3d.camera.position.set(0, 22.22, 20.14);

// The target sits 1.5 units in front of the disc's centre, which lifts the disc clear of the inset. At 16 units the
// camera's own view cuts off the disc's rim, and past 45 the disc fades into the haze. `maxPolarAngle` keeps the
// camera at least 14° above the floor, so the field is always seen from above.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0, z: 1.5 },
  enableDamping: true,
  enablePan: false,
  minDistance: 16,
  maxDistance: 45,
  maxPolarAngle: Math.PI * 0.42,
});

const pane = new ThemePane({ title: 'Batching and culling', stage });
const controls = createControls({
  pane,
  view3d,
  settings,
  counts,
  sweep,
  setCount,
  setShapes,
  setColors,
  setCullFrustum,
});

// A portrait screen is narrower than the disc, so the camera and the fog back off until it fits, and the disc centres
// in the band between the pane, measured once it has its rows, and the inset.
fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: FIT_ASPECT,
  clearTop: pane.element.getBoundingClientRect().bottom + PANE_GAP,
  clearBottom: INSET_BAND,
});

// The pane and the inset take the right of a landscape screen, and on one as narrow as a tablet's the disc would run
// under them, so there the camera and the fog back off further.
fitBesidePanels({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: BESIDE_ASPECT,
  portraitBelow: FIT_ASPECT,
});

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  sweep.update(dt);
  controls.sync();
  visuals.update(dt);
});

// After the render, as the debugger's own example has it, so each capture reads the frame just drawn.
app.ticker.add(readFrame, undefined, UPDATE_PRIORITY.UTILITY);

// The canvas joins with its first frame already drawn and counted, then the loading screen dissolves onto it. The
// view takes the screen's size on its first render, so the scout's tag is placed after it.
orbit.update();
app.render();
readFrame();
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
