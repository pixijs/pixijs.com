/**
 * The smallest @pixi/3d scene: an app, a view, a cube and a light
 *
 * An `Application` makes the canvas and runs the frame loop. A `View3D` on its stage draws a 3D scene from its
 * camera. A `Mesh3D` is a shape (`CubeGeometry`) and a surface (`Material3D`), a `DirectionalLight` shines on it from
 * one direction, and the view's `environment` lights the faces it misses. Everything 3D goes under `view3d.root`, and
 * the ticker turns the cube.
 *
 * Controls: the pane sets the cube's `baseColor`, shows its triangles, sets the light's `intensity`, turns the
 * `environment` off and on, and sets the spin. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import {
  CubeGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  View3D,
} from '@pixi/3d';

import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, CLAY, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createVisuals } from './visuals';

/** Radians a second: a turn in about 12 s, slow enough to watch each face come round to the light */
const SPIN_SPEED = 0.5;
/** The narrowest view, width over height, that shows the cube and the light's rays whole from the landscape distance */
const FIT_ASPECT = 0.95;
/**
 * Light from all round, the sky colour from above and the ground colour from below: without it a face turned from the
 * light draws black
 */
const FILL = {
  skyColor: BRAND.white,
  groundColor: CLAY.purple,
  intensity: 0.7,
};

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Hello cube' });
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
loading.progress(0.5);

// autoResize keeps the view the canvas's size from its first render on. It starts at the screen's size too, so the
// first frame's tags and side view are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// The examples' stage, here only for its backdrop and the pane's theme switch: this scene brings its own light and
// environment, and needs no floor or fog.
const stage = new ThemeStage(view3d, { theme, lights: false });

stage.floor.visible = false;
view3d.fog = null;
view3d.environment = FILL;
app.stage.addChild(view3d);
view3d.camera.fov = 40;
view3d.camera.position.set(0, 1.8, 5.6);
view3d.camera.lookAt({ x: 0, y: 0, z: 0 });

// The geometry is the shape and the material the surface. Turned a little, so two sides show from the start.
const cube = new Mesh3D({
  geometry: new CubeGeometry(),
  material: new Material3D({ baseColor: CLAY.pink }),
  rotation: { x: 0, y: 0.6, z: 0 },
});
// At screen left, clear of the pane, so one side face is always turned away from it.
const light = new DirectionalLight({
  intensity: 3,
  position: { x: -3.4, y: 3.4, z: 0.4 },
});

// It shines along its own -z wherever it stands, so lookAt only sets its direction.
light.lookAt(cube.position);
// Everything under the root is in the scene the view draws.
view3d.root.addChild(cube, light);

const visuals = createVisuals({ app, view3d, stage, cube, light });

// A portrait screen is narrower than the cube and its light's rays, so the camera backs off until they fit.
fitPortrait({
  renderer: app.renderer,
  orbit: { view: view3d, target: cube.position },
  minAspect: FIT_ASPECT,
});

const pane = new ThemePane({ title: 'Hello cube', stage });
const settings = { environment: true, spin: SPIN_SPEED };

pane.addBinding(cube.material, 'baseColor', { view: 'color' });
pane.addBinding(visuals.wireframe, 'visible', { label: 'Triangles' });
pane.addBinding(light, 'intensity', { min: 0, max: 6 });
// Turned off, the face away from the light gets nothing and draws black. Off and on recompiles the materials.
pane.addBinding(settings, 'environment').on('change', ({ value }) => {
  view3d.environment = value ? FILL : null;
});
pane.addBinding(settings, 'spin', { label: 'Spin', min: 0, max: 2 });

app.ticker.add((ticker) => {
  const dt = ticker.deltaMS / 1000;

  stage.update(dt);
  cube.rotation.y += settings.spin * dt;
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
