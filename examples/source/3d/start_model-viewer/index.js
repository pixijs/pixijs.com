/**
 * A model viewer: drop a .glb or .gltf file on the page and it shows on the stage, framed and lit
 *
 * A dropped file is a `File`, and `URL.createObjectURL` gives it a URL that `Assets.load` reads like any other, with
 * the parser named, since the URL has no extension to pick one by. `new Model3D(...)` builds the file's scene and
 * plays its first animation. The viewer scales the model to the stage, stands it on the floor and frames the camera
 * on the sphere round its bounds; the model it replaces is destroyed and its file unloaded. The stage's lights and
 * its reflections light every model the same way.
 *
 * Controls: drag to orbit, scroll to zoom; drop a .glb or .gltf anywhere, or press the hint along the bottom to
 * choose one. The pane names the file, turns the camera's auto-rotate on and off, and frames the model again. URL
 * flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Model3D, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets, DEG_TO_RAD, extensions, loadKTX2 } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { LoadingScreen } from './theme/LoadingScreen';
import { LOGO_URL } from './theme/logo';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { loadReflections, ThemeStage } from './theme/ThemeStage';
import { createDropZone, HINT_BAND } from './dropZone';
import { hideLights, placeModel } from './scene';

/** The name the pane shows for the logo, on show until a file is dropped */
const DEFAULT_FILE = 'pixijs-logo.glb';
/** The radius every model is scaled to, in metres: about the size of the kit's logo */
const MODEL_RADIUS = 2;
/** The room a tall view leaves at its sides, as a multiple of the model's sphere */
const FRAME_MARGIN = 1.1;
/** How far above level the framed camera looks down, so the floor and the model's shadow show */
const FRAME_ELEVATION = 12 * DEG_TO_RAD;
/** The closest the camera comes, in model radii: outside the sphere, so a zoom never pushes it into the model */
const MIN_DISTANCE_RADII = 1.25;
/** The furthest the reader can zoom out, in framed distances */
const MAX_DISTANCE_FRAMED = 1.6;
/** The fog's far distance as a multiple of its near one */
const FOG_SPAN = 3;
/** Three turns a minute once auto-rotate is on: a showcase turn, slow enough to follow */
const SPIN_RPM = 3;

// KTX2 textures need pixi's KTX2 loader, which isn't in its default set. In an app, write `import 'pixi.js/ktx2'`,
// which adds it; the playground can't resolve that subpath, so this adds it by hand.
extensions.add(loadKTX2);

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Model viewer' });
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

const [reflections, defaultSource] = await loading.load(() =>
  Promise.all([loadReflections(), Assets.load(LOGO_URL)]),
);

const view3d = new View3D({ autoResize: true });
// Metal and gloss in a file mirror their surroundings, so the stage lights every model with the kit's cube map.
const stage = new ThemeStage(view3d, { theme, reflections });

app.stage.addChild(view3d);
view3d.camera.fov = 40;

// Pan stays off, so the model stays centred, and the camera stays above the floor. The app's ticker updates it, so
// the camera holds still under the loading screen and moves in step with each frame.
const orbit = new OrbitCamera({
  view: view3d,
  autoUpdate: false,
  enableDamping: true,
  enablePan: false,
  autoRotateSpeed: SPIN_RPM,
  minDistance: MODEL_RADIUS * MIN_DISTANCE_RADII,
  maxPolarAngle: Math.PI / 2,
});

/** The model on the stage, its file's name, and the URL it loaded from: the key `Assets.unload` frees it by */
const shown = { model: null, file: '', url: '' };
/** Counts the files dropped or chosen, so a load that a later one overtakes is thrown away */
let loads = 0;
/** The camera's framed distance for the window's shape */
let framedDistance = 0;

/** Loads a dropped or chosen file and shows it; the model on show stays until the new one is ready */
async function loadFile(file) {
  const load = ++loads;
  const url = URL.createObjectURL(file);
  // glb is the binary form, one file with everything in it; gltf is JSON, which can carry its buffers and images
  // inside as data URIs. A .gltf that keeps them in files of their own can't load from a drop: its URL has no folder
  // to find them in.
  const parser = file.name.toLowerCase().endsWith('.gltf') ? 'gltf' : 'glb';

  dropZone.setStatus(`Loading ${file.name}…`);
  try {
    const source = await Assets.load({ src: url, parser });

    // A file dropped after this one owns the stage and the hint now, so this one is freed unseen.
    if (load !== loads) {
      void Assets.unload(url);
      return;
    }
    show(source, url, file.name);
    dropZone.setStatus(null);
  } catch (error) {
    if (load === loads) dropZone.setStatus(`Couldn't load ${file.name}`);
    // The console says why.
    throw error;
  } finally {
    // The file's read; the URL stays the cache key `Assets.unload` frees it by, which needs no live file.
    URL.revokeObjectURL(url);
  }
}

/** Builds a model from the loaded file, frames it, then frees the model it replaces */
function show(source, url, file) {
  // `autoPlay: true` plays the file's first animation, looped; a file without one stands still.
  const next = new Model3D({ source, autoPlay: true });

  // The stage lights every model the same way, so the lights a file brings stay off.
  hideLights(next);
  const centerY = placeModel(next, MODEL_RADIUS);

  orbit.target.set(0, centerY, 0);
  frame();
  view3d.root.addChild(next);
  // Destroying a model leaves its file's geometry, materials and textures on the source; unloading the file frees
  // them, with the images it cached.
  shown.model?.destroy({ children: true });
  if (shown.url) void Assets.unload(shown.url);
  Object.assign(shown, { model: next, file, url });
}

/**
 * Works out the framed distance for the window's shape: the camera backs off until the sphere round the model fits
 * the view's height clear of the hint's band along the bottom (the sphere is centred, so as much room stays free at
 * the top), and on a tall view, its width with FRAME_MARGIN to spare. On a resize, a zoom the reader chose keeps its
 * ratio to the framed distance, and the zoom-out limit and the fog move with it.
 */
function fit() {
  const { width, height } = app.screen;
  const tanHalfFovY = Math.tan((view3d.camera.fov / 2) * DEG_TO_RAD);
  // How much of the view's height the sphere may span.
  const span = Math.min(
    1 - (2 * HINT_BAND) / height,
    width / height / FRAME_MARGIN,
  );
  const next = MODEL_RADIUS / Math.sin(Math.atan(tanHalfFovY * span));

  // Before the zoom, so a zoom out isn't clamped to the old limit.
  orbit.maxDistance = next * MAX_DISTANCE_FRAMED;
  if (framedDistance) orbit.zoom(framedDistance / next);
  stage.fog.near = next + MODEL_RADIUS;
  stage.fog.far = stage.fog.near * FOG_SPAN;
  framedDistance = next;
}

/** Puts the camera in front of the model, the side a glTF faces, a little above it and at the framed distance */
function frame() {
  const { target } = orbit;

  view3d.camera.position.set(
    target.x,
    target.y + Math.sin(FRAME_ELEVATION) * framedDistance,
    target.z + Math.cos(FRAME_ELEVATION) * framedDistance,
  );
  orbit.update();
}

const dropZone = createDropZone({
  stage,
  onFile: (file) => void loadFile(file),
});

fit();
show(defaultSource, LOGO_URL, DEFAULT_FILE);
app.renderer.on('resize', fit);

const pane = new ThemePane({ title: 'Model viewer', stage });

// A narrower value column leaves the names room for `orbit.autoRotate`. `label: undefined` leaves the file's row
// unlabelled, so a long name has the row's full width.
pane.element.style.setProperty('--tp-blade-value-width', '120px');
pane.addBinding(shown, 'file', { readonly: true, label: undefined });
pane.addBinding(orbit, 'autoRotate', { label: 'orbit.autoRotate' });
pane.addButton({ title: 'Frame model' }).on('click', frame);

app.ticker.add((ticker) => {
  stage.update(Math.min(ticker.deltaMS / 1000, 1 / 15));
  orbit.update(ticker);
  dropZone.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
dropZone.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
