/**
 * Loading a glTF file's own scenes, cameras and lights, and switching between them
 *
 * One file can name several scenes: `Object.keys(source.scene)` lists them and `new Model3D({ source, scene })` builds
 * one. The file's cameras come in as `Camera3D` nodes in `model.cameras`, with the file's `fov` and projection, and
 * `view3d.camera = model.cameras[i]` looks through one. Its `KHR_lights_punctual` lights come in as light nodes that
 * light the view as soon as the model joins it, and cast no shadows until you say so. The inset shows the scene from
 * outside, with each camera and light where the file put it. `diorama.gltf` was made for this example.
 *
 * Controls: the pane picks the scene and the camera, and turns the file's shadows on and off. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Light, Model3D, View3D } from '@pixi/3d';

import { Application, Assets } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { model } from './manifest';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createVisuals } from './visuals';

/** The stage's hemisphere fill, dimmed so the file's lights carry the picture */
const FILL = 0.4;
/** The fog starts past the inset's camera, about 20 m from the stand, so the stand stays clear in the inset too */
const FOG = { near: 20, far: 40 };
const DIORAMA_URL = model('pixijs.Diorama');

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'glTF scenes' });
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

// At the screen's size from the start, so the first frame's camera stubs have the screen's shape.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// The file brings its own lights, so the stage keeps only its floor, backdrop, fog and fill.
const stage = new ThemeStage(view3d, { theme, lights: false, fog: FOG });
// A copy of the stage's fill at `FILL` of its strength, lighting the view in its place. The ticker copies the stage's
// colours and intensity across every frame, so it follows the theme's fades.
const fill = { ...stage.fill, intensity: stage.fill.intensity * FILL };

view3d.environment = fill;

app.stage.addChild(view3d);

const source = await loading.load(() => Assets.load(DIORAMA_URL));

// The names the file gives its scenes, in file order: ['Sunlit', 'Lamplit'].
const sceneNames = Object.keys(source.scene);
const models = {};
const castingLights = [];

for (const name of sceneNames) {
  // One model per scene. They share the source's geometry and materials, so each costs only its nodes.
  const model = new Model3D({ source, scene: name });

  // glTF has no shadow setting, so a loaded light casts none until you turn it on, and a point light can't cast.
  // This file keeps its lights at the top of each scene.
  for (const node of model.children) {
    if (node instanceof Light && node.type !== 'point')
      castingLights.push(node);
  }
  models[name] = model;
}

const shadows = { castShadow: true };

/** Turns shadows on or off for every light of the file that can cast them */
function setShadows() {
  for (const light of castingLights) light.castShadow = shadows.castShadow;
}

setShadows();

// What's on screen: a scene by its name, and a camera by its index in `model.cameras`. Both scenes list the same
// cameras in the same order, so an index means the same shot in either.
const shot = { scene: sceneNames[0], camera: 0 };
let shown = null;

/** Puts the shot's scene in the view and looks through the shot's camera */
function showShot() {
  const next = models[shot.scene];

  // A camera has to be in the view's scene before the view can look through it, so the new model goes in first.
  // Its lights join view3d.lights with it, and the old model's leave with the old model.
  if (next !== shown) view3d.root.addChild(next);
  view3d.camera = next.cameras[shot.camera];
  if (shown && next !== shown) view3d.root.removeChild(shown);
  shown = next;
}

/**
 * The loader drops a camera's `aspectRatio`, so the view's shape sets it. A perspective camera's `fov` spans the
 * view's height and an orthographic camera's `orthographicSize` is half its width, which fits a wide view. A view
 * taller than wide gets that frame turned on its side: the perspective cameras zoom out until `fov` spans the width,
 * and the orthographic one zooms in until `orthographicSize` is half the height.
 */
function fitFileCameras(width, height) {
  const aspect = width / height;

  for (const name of sceneNames) {
    for (const camera of models[name].cameras) {
      camera.zoom =
        camera.mode === 'perspective'
          ? Math.min(1, aspect)
          : Math.max(1, 1 / aspect);
    }
  }
}

showShot();
fitFileCameras(app.screen.width, app.screen.height);
app.renderer.on('resize', fitFileCameras);

const visuals = createVisuals({
  app,
  view3d,
  stage,
  models: Object.values(models),
});

// The rows offer the names the file gives its scenes and cameras.
const pane = new ThemePane({ title: 'glTF scenes', stage });
const sceneOptions = Object.fromEntries(sceneNames.map((name) => [name, name]));
const cameraOptions = Object.fromEntries(
  models[shot.scene].cameras.map(({ label }, index) => [label ?? '', index]),
);

pane
  .addBinding(shot, 'scene', { options: sceneOptions })
  .on('change', showShot);
pane
  .addBinding(shot, 'camera', { options: cameraOptions })
  .on('change', showShot);
pane.addBinding(shadows, 'castShadow').on('change', setShadows);

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  Object.assign(fill, stage.fill).intensity *= FILL;
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
