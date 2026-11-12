/**
 * Shadows over a large world: cascades, a fixed box, and redrawing less often
 *
 * A shadow map is a picture of the scene drawn from the light, and its texels spread over the ground it covers, so the
 * same 1024 × 1024 texels over more ground give coarser shadows. A `DirectionalLight` places that picture one of two
 * ways: `shadow.cascades` cuts the camera's view into slices by distance, each with its own map, so a texel stays
 * about the same size on screen near and far; `shadow.bounds` draws one map over a fixed box, cheaper and as sharp as
 * the box is small, with no shadows past it. `shadow.update` redraws the maps every Nth frame, per cascade, or only
 * when `refreshShadows()` asks, which a still world never shows and the ball's moving shadow does. On the road, each
 * map's texels show as a grid in its cascade's colour, with a line where each cascade ends.
 *
 * Controls: drag to orbit; the pane picks cascades or a fixed box, the cascade count and maxDistance or the box's
 * length, and the update rate; under 'manual', Refresh shadows calls `refreshShadows()`. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Box, DirectionalLight, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';

import { createAvenue, createBall, lightAvenue, moveBall } from './scene';
import { createVisuals } from './visuals';

/** A phone's view backs off only this far, 1.3 times at 390 × 844: further, cascade 0 would end in the air */
const FIT_ASPECT = 0.6;
/**
 * Low on the right, 32° up, and straight across the road: the long shadows lie across it, and the light's own x axis
 * runs exactly along it, so a fixed box's map ends just 5% past the box
 */
const SUN_AT = { x: 12, y: 7.5, z: 0 };
/**
 * The fixed box: from where the left-hand shadows end to the right-hand shapes' outer edge, just above the posts. Its
 * near face is just behind the camera and under a phone's view; it runs `boxLength` down the road from there.
 */
const STREET = { left: -7, right: 4.5, top: 2, near: 7 };
/**
 * Each update choice the pane offers, written the way the code writes it, and the value it sets. An array entry left
 * out redraws every frame, so the per-cascade rates name all four cascades.
 */
const UPDATES = {
  1: 1,
  4: 4,
  8: 8,
  '[1, 2, 4, 8]': [1, 2, 4, 8],
  "'manual'": 'manual',
};

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Large scenes' });
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

// At the screen's size from the start, so the first frame's cascades are measured for its aspect.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// The stage's floor, fog and fill stay, reaching past the 60 m the shadows do; the sun below takes its lights' place.
const stage = new ThemeStage(view3d, {
  theme,
  lights: false,
  size: 240,
  check: 2,
  fog: { near: 20, far: 85 },
});

app.stage.addChild(view3d);
// The filter a phone would use: four reads a pixel, where the stage picks nine.
view3d.shadowFilter = 'pcf';

// The settings the lesson starts from, which the pane changes.
const settings = {
  shadow: 'cascades',
  cascades: 3,
  maxDistance: 60,
  boxLength: 28,
  update: '1',
};

// Cascades at construction; `shadow: { bounds }` with a world-space `Box` would draw one fixed box instead.
const sun = new DirectionalLight({
  color: stage.key.color,
  castShadow: true,
  shadow: { cascades: settings.cascades, maxDistance: settings.maxDistance },
  position: SUN_AT,
  parent: view3d.root,
});

// A sun's shadow depends only on which way it points.
sun.lookAt({ x: 0, y: 0, z: 0 });
createAvenue(view3d.root);

const ball = createBall(view3d.root);
// The fixed box holds the casters and the ground their shadows fall on.
const street = new Box();

/** Puts the pane's settings on the sun */
function applyShadow() {
  const { shadow } = sun;

  // One placement at a time: with both set, cascades win and the engine warns.
  if (settings.shadow === 'cascades') {
    shadow.bounds = undefined;
    shadow.cascades = settings.cascades;
    shadow.maxDistance = settings.maxDistance;
  } else {
    shadow.cascades = undefined;
    street.min.set(STREET.left, 0, STREET.near - settings.boxLength);
    street.max.set(STREET.right, STREET.top, STREET.near);
    shadow.bounds = street;
  }
  shadow.update = UPDATES[settings.update];
  // A shadow that isn't redrawn every frame keeps what it last drew, and reads a moved box only when it redraws, so
  // redraw it after a change; at 1 the next frame redraws it anyway.
  if (shadow.update !== 1) sun.refreshShadows();
}

// A 100 m world: near as far out as it can go, which keeps depth precise 60 m out, and far past the floor's edge and
// the pane's longest maxDistance, since cascades stop at the far plane.
view3d.camera.fov = 40;
view3d.camera.near = 0.5;
view3d.camera.far = 150;
view3d.camera.position.set(0, 4, 6);

// Updated first in the app's ticker, so the camera, the visuals' measures and the shadow pass agree each frame; by
// default the orbit updates from `Ticker.shared`, after the app's ticker.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.8, z: -7.1 },
  autoUpdate: false,
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 30,
  maxPolarAngle: Math.PI * 0.47,
});

// Cascades are fitted to the camera, so a manual one is redrawn when the camera moves; a box is fitted to the world.
orbit.on('change', () => {
  if (sun.shadow.cascades !== undefined && sun.shadow.update === 'manual')
    sun.refreshShadows();
});

// A portrait screen is narrower, so the camera and the fog back off, as far as FIT_ASPECT lets them.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Large scenes', stage });
const visuals = createVisuals({ app, view3d, stage, sun, street, pane });

createControls({
  pane,
  settings,
  apply: applyShadow,
  refresh: () => sun.refreshShadows(),
});
applyShadow();

let time = 0;

function tick(dt) {
  stage.update(dt);
  lightAvenue(view3d, stage, sun);
  time += dt;
  moveBall(ball, time);
  visuals.update();
}

app.ticker.add((ticker) => {
  orbit.update(ticker);
  tick(Math.min(ticker.deltaMS / 1000, 1 / 15));
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
tick(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
