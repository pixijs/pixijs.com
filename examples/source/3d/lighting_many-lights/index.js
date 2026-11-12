/**
 * Many lights at once: a view shades up to 32, and each light's `range` decides which pixels pay for it
 *
 * A `PointLight` is a node like any other: build it under `view3d.root`, move it by writing its `position`, and switch
 * it off with `visible = false`. The view walks `view3d.lights` in the order the lights joined the scene, skips the
 * hidden ones and shades the first `MAX_LIGHTS` (32); a visible light past that is ignored, with no warning, and an
 * ambient light takes no slot. Point lights cast no shadows, so they add no draw calls. What they cost is shading: the
 * view skips a point light on every pixel outside its `range`, and one with `range = 0` reaches every pixel, so every
 * pixel shades it.
 *
 * Controls: drag to orbit; the pane sets how many lights are on, their range and how fast they fly, and reads back how
 * many the view shades and how many reach the average sphere. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { MAX_LIGHTS, PointLight, Vector3, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createClayField, lightPath, lightsPerSphere } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the whole field from the landscape distance */
const FIT_ASPECT = 1.15;
/**
 * The stage's hemisphere fill, turned down so the point lights carry the scene. With no tone mapping, clay already
 * lit near white has no room left to show a light's colour.
 */
const FILL = 0.7;
/** Eight more lights than the view shades, to show what happens past the limit */
const LIGHT_COUNT = MAX_LIGHTS + 8;
const LIGHT_COLORS = [BRAND.pink, BRAND.sky, BRAND.orange, BRAND.purple];
/** Bright enough to colour white clay 0.6 below the light, under the dimmed fill */
const LIGHT_INTENSITY = 6;
/** Where a light's visible pool just fills the ring where its range meets the clay, so the ring and the pool agree */
const START_RANGE = 1.5;
/** The range row's top: past it the first light's footprint ring outgrows the frame */
const MAX_RANGE = 3;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Many lights' });
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

// Sized to the screen now: an `autoResize` view doesn't take the screen's size until its first render.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// The stage's key and form are directional lights. They'd take the first two places in `view3d.lights`, so
// `lights: false` leaves them out and the point lights below are the only lights counted.
const stage = new ThemeStage(view3d, {
  theme,
  lights: false,
  fog: { near: 14, far: 34 },
});
// A copy of the stage's fill at `FILL` of its strength, lighting the view in its place. The ticker copies the stage's
// colours and intensity across every frame, so it follows the theme's fades.
const fill = { ...stage.fill, intensity: stage.fill.intensity * FILL };

view3d.environment = fill;

app.stage.addChild(view3d);

const spheres = createClayField({ parent: view3d.root });

// The view keeps them in `view3d.lights` in the order they join, so the last ones made are the first left out.
const lights = Array.from(
  { length: LIGHT_COUNT },
  (_, i) =>
    new PointLight({
      color: LIGHT_COLORS[i % LIGHT_COLORS.length],
      intensity: LIGHT_INTENSITY,
      range: START_RANGE,
      parent: view3d.root,
    }),
);

// Opens on every light, so the ones past the limit show as ignored.
const settings = { lights: LIGHT_COUNT, range: START_RANGE, speed: 1 };
/** What the view does with the lights: how many it shades, and how many reach the average sphere */
const shading = { shaded: 0, perSphere: 0 };

/** Switches on the first `count` lights; a hidden light is off, but it keeps its place in `view3d.lights` */
function showLights(count) {
  for (let i = 0; i < LIGHT_COUNT; i++) lights[i].visible = i < count;
}

/** Sets every light's reach; 0 means no limit */
function setRange(range) {
  for (const light of lights) light.range = range;
}

const point = new Vector3();

/** Moves every light along its path; hidden lights fly too, so a light switched on appears on its path */
function flyLights(time) {
  for (let i = 0; i < LIGHT_COUNT; i++)
    lights[i].position.copyFrom(lightPath(i, LIGHT_COUNT, time, point));
}

/** Fills the read-only rows. The lights that are on come first, and the view shades the first `MAX_LIGHTS` of them */
function readShading() {
  shading.shaded = Math.min(settings.lights, MAX_LIGHTS);
  shading.perSphere = lightsPerSphere(spheres, lights, shading.shaded);
}

view3d.camera.fov = 40;
view3d.camera.position.set(0, 8.5, 10.5);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0, z: 0.2 },
  enableDamping: true,
  enablePan: false,
  minDistance: 9,
  maxDistance: 22,
  // Keeps the camera above the field, looking down on the pools.
  maxPolarAngle: Math.PI * 0.42,
});

// A portrait screen is narrower than the field, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

let time = 0;

showLights(settings.lights);
flyLights(time);
readShading();

const visuals = createVisuals({
  app,
  view3d,
  stage,
  lights,
  fitAspect: FIT_ASPECT,
});
const pane = new ThemePane({ title: 'Many lights', stage });

pane
  .addBinding(settings, 'lights', {
    label: 'Lights',
    min: 1,
    max: LIGHT_COUNT,
    step: 1,
  })
  .on('change', ({ value }) => showLights(value));
pane
  .addBinding(settings, 'range', { min: 0, max: MAX_RANGE, step: 0.1 })
  .on('change', ({ value }) => setRange(value));
pane.addBinding(settings, 'speed', {
  label: 'Speed',
  min: 0,
  max: 3,
  step: 0.05,
});
pane.addBinding(shading, 'shaded', {
  label: 'Shaded',
  readonly: true,
  format: (count) => count.toFixed(0),
});
pane.addBinding(shading, 'perSphere', {
  label: 'Per sphere',
  readonly: true,
  format: (count) => `${count.toFixed(1)} lights`,
});

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  Object.assign(fill, stage.fill).intensity *= FILL;
  time += dt * settings.speed;
  flyLights(time);
  readShading();
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
