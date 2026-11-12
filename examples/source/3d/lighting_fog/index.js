/**
 * Distance fog: the linear, exponential and exp2 curves, and a background that matches the fog
 *
 * `view3d.fog` takes a `Fog` object and keeps it, so writing its `near`, `far`, `density` or `color` later is free and
 * shows on the next frame. Its `type` is fixed, so switching curves means assigning another object. Fog is measured
 * from the camera, so it moves with it. Give `view3d.background` the fog's colour and fully fogged surfaces vanish
 * into the sky; give it another and a seam shows at the horizon.
 *
 * Controls: drag to orbit, scroll to zoom, and the field moves through the fog while the floor lines stay with the
 * camera; the pane picks the curve, its distances or density, the fog's colour and the background. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import { createClayField } from './scene';
import { createVisuals } from './visuals';

/**
 * Both exponential curves are half way at this depth, and linear's `near` 15 to `far` 65 is centred on it, so
 * switching curves changes only the shape
 */
const HALF_FOG_DEPTH = 40;
/** Exponential fog never reaches 100%, so the floor runs out to where it's 99.7% fogged at the starting density */
const FLOOR_SIZE = 640;
/** The narrowest view, width over height, that shows the first row whole at the camera's `fov` */
const FIT_ASPECT = 0.9;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Fog' });
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

// At the screen's size from the start, so the first frame's floor lines and their names land where they should.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// The stage sets a fog and a sky of its own; the lesson replaces both below.
const stage = new ThemeStage(view3d, { theme, size: FLOOR_SIZE });

app.stage.addChild(view3d);

const field = createClayField(view3d.root);

// One object per curve: the view keeps the object it's given, and a fog's `type` can't change once it has it.
const haze = THEMES[theme].haze;
const linearFog = { type: 'linear', color: haze, near: 15, far: 65 };
// Half fog falls where density · depth reaches ln 2 (for exp2, its square root), so these densities, 0.0173 and
// 0.0208, put it at HALF_FOG_DEPTH.
const exponentialFog = {
  type: 'exponential',
  color: haze,
  density: Math.LN2 / HALF_FOG_DEPTH,
};
const exp2Fog = {
  type: 'exp2',
  color: haze,
  density: Math.sqrt(Math.LN2) / HALF_FOG_DEPTH,
};
const fogs = { linear: linearFog, exponential: exponentialFog, exp2: exp2Fog };

view3d.fog = linearFog;
// The same colour behind the scene, so a fully fogged row meets the sky with no seam.
view3d.background = linearFog.color;

/** Switches curves by assigning another fog; a curve's first use compiles new shaders, and later ones reuse them */
function setFogType(type) {
  view3d.fog = fogs[type];
}

/** One colour for every curve and for the sky behind them, so they stay matched; it compiles nothing */
function setFogColor(color) {
  linearFog.color = color;
  exponentialFog.color = color;
  exp2Fog.color = color;
  view3d.background = color;
}

view3d.camera.fov = 40;
view3d.camera.position.set(0, 5, 13);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0, z: -14 },
  // The tick moves the camera before the visuals measure depths from it.
  autoUpdate: false,
  enableDamping: true,
  enablePan: false,
  // Tuned to keep the lesson readable: zoom stops just short of the first row and before the field shrinks into the
  // fog, the turn keeps the floor lines running across the field, and the pitch keeps the camera above the floor.
  minDistance: 16,
  maxDistance: 40,
  minAzimuthAngle: -0.5,
  maxAzimuthAngle: 0.5,
  minPolarAngle: 1.2,
  maxPolarAngle: 1.48,
});

// Fog is measured from the camera, so a narrow screen zooms the lens out rather than backing the camera off, as
// `fitPortrait` would. Depth doesn't change with the zoom, so the fog on every row stays as it is.
function fitWidth() {
  view3d.camera.zoom = Math.min(
    1,
    app.screen.width / app.screen.height / FIT_ASPECT,
  );
}

fitWidth();
app.renderer.on('resize', fitWidth);

const visuals = createVisuals({
  app,
  view3d,
  stage,
  fogs,
  floorSize: FLOOR_SIZE,
});
const pane = new ThemePane({ title: 'Fog', stage });
const controls = createControls({
  pane,
  stage,
  view3d,
  fogs,
  setFogType,
  setFogColor,
});

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  controls.followTheme();
  field.spin(time);
  orbit.update(ticker);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
