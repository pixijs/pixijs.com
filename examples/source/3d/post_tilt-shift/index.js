/**
 * Tilt shift: a blur that keeps one slab of depth sharp, so a full-size scene reads as a miniature
 *
 * A `TiltShiftEffect` in `view3d.passes` blurs the finished frame by depth: how far each pixel is in front of the
 * camera, along the way it looks. The plane in focus sits `focalDepth` away; within `focalNear` of it, in front or
 * behind, a pixel stays sharp, and past that its blur grows until it reaches `maxBlur` device pixels at `focalFar`
 * from the plane. The plane faces the camera, so from a high, angled camera it cuts the town in a band straight
 * across the screen, and the bus on its loop drives in and out of focus. Every focus setting is a uniform write, so the
 * focus can follow the zoom each frame. `debug` paints the zones over a grey copy of the frame to tune them by eye: a
 * white line on the plane, green in the sharp band, orange in front of it and blue behind.
 *
 * Controls: drag to orbit, scroll to zoom; the pane turns the effect off and on, moves the plane in focus, widens the
 * sharp band and the blur ramp, sets the blur's strength, shows the debug view and makes the focus follow the zoom.
 * URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Spherical, View3D } from '@pixi/3d';
import { FxaaEffect, OrbitCamera, TiltShiftEffect } from '@pixi/3d/extras';

import { Application, DEG_TO_RAD } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createBus } from './bus';
import { createTown } from './scene';

/** The narrowest view, width over height, that keeps the logo and the park whole; the houses either side run off it */
const FIT_ASPECT = 0.7;
/** The camera's start round the logo: high and to one side, so the ground runs up the screen */
const TARGET = { x: 0, y: 0.6, z: 0 };
const CAMERA = { distance: 24, degreesDown: 48, degreesRound: 18 };
/** The blur at full strength, in CSS px, and the most the pane's slider allows */
const MAX_BLUR = 12;
const BLUR_RANGE = 20;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Tilt shift' });
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
// The fog starts past the town's far corner, so the far rows show their blur, not the haze.
const stage = new ThemeStage(view3d, { theme, fog: { near: 34, far: 80 } });

app.stage.addChild(view3d);

const logo = await loading.load(() => loadPixiLogo({ width: 3.2 }));
const town = createTown(logo);
const bus = createBus();

view3d.root.addChild(town.root, bus.root);

// Spherical's phi is measured down from straight up, and its theta round from +z.
const start = new Spherical(
  CAMERA.distance,
  (90 - CAMERA.degreesDown) * DEG_TO_RAD,
  CAMERA.degreesRound * DEG_TO_RAD,
);

view3d.camera.fov = 40;
view3d.camera.position.setFromSpherical(start).add(TARGET);

const orbit = new OrbitCamera({
  view: view3d,
  target: TARGET,
  enableDamping: true,
  enablePan: false,
  minDistance: 14,
  maxDistance: 28,
  // Between 33° and 53° down: from lower the band thins to a line through a wall of houses.
  minPolarAngle: 0.65,
  maxPolarAngle: 1.0,
});

// A portrait screen is narrower than the park and its houses, so the camera and the fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

// The orbit's target sits `orbit.distance` in front of the camera, so the plane in focus starts there.
const tiltShift = new TiltShiftEffect({
  focalDepth: orbit.distance,
  focalNear: 1.5,
  focalFar: 7,
  // maxBlur counts device pixels, so it's scaled to look the same on a 2× screen.
  maxBlur: MAX_BLUR * app.renderer.resolution,
});

// The scene keeps the canvas's MSAA through post effects; FXAA, last, smooths what edges it leaves.
view3d.passes = [tiltShift, new FxaaEffect()];

const pane = new ThemePane({ title: 'Tilt shift', stage });
const folder = pane.addFolder({ title: 'TiltShiftEffect' });
const settings = { followTarget: false };

// Flipping `enabled` rebuilds the view's render graph: fine for a toggle, never per frame. The rows under it are
// uniform writes.
folder.addBinding(tiltShift, 'enabled');

/**
 * The focalDepth row, from in front of the nearest roof at the closest zoom to the town's far end at the farthest;
 * Tweakpane can't change a slider's range in place, so a refit that moves the orbit's limits makes the row again
 */
function addFocalDepthRow() {
  const min = Math.round(orbit.minDistance / 2);
  const max = Math.round(orbit.maxDistance + town.radius);

  // A refit can carry the plane past the new range, and a new row doesn't clamp the value it starts from.
  tiltShift.focalDepth = Math.min(Math.max(tiltShift.focalDepth, min), max);

  return folder.addBinding(tiltShift, 'focalDepth', {
    index: 1,
    min,
    max,
    step: 0.1,
    disabled: settings.followTarget,
  });
}

let focalDepthRow = addFocalDepthRow();

// The shader's smoothstep(focalNear, focalFar, …) is undefined unless focalFar is past focalNear, so the ranges part.
folder.addBinding(tiltShift, 'focalNear', { min: 0, max: 4, step: 0.1 });
folder.addBinding(tiltShift, 'focalFar', { min: 4.5, max: 20, step: 0.1 });
// In device pixels, so the slider spans the same 0 to BLUR_RANGE CSS px on any screen.
folder.addBinding(tiltShift, 'maxBlur', {
  min: 0,
  max: BLUR_RANGE * app.renderer.resolution,
  step: 0.5,
});
folder.addBinding(tiltShift, 'debug');

/** Keeps the plane on the orbit's target: a uniform write, so doing it on every camera move costs nothing */
function followTarget() {
  if (!settings.followTarget) return;
  tiltShift.focalDepth = orbit.distance;
  focalDepthRow.refresh();
}

pane
  .addBinding(settings, 'followTarget', { label: 'Follow target' })
  .on('change', () => {
    focalDepthRow.disabled = settings.followTarget;
    followTarget();
  });
orbit.on('change', followTarget);
// fitPortrait refits first. On a screen narrower than FIT_ASPECT, as when a phone turns after load, it moves the camera
// along the line it looks down and scales the orbit's limits; a resize that stays wider moves nothing. Every depth
// changes by the distance the camera moved, so the plane moves as far and stays on what the reader focused. With
// `Follow target` on, the orbit's change has moved it already.
let fitMinDistance = orbit.minDistance;

app.renderer.on('resize', () => {
  if (orbit.minDistance === fitMinDistance) return;
  // The fit scales the distance by the same factor as the limits.
  const before = (orbit.distance * fitMinDistance) / orbit.minDistance;

  if (!settings.followTarget) tiltShift.focalDepth += orbit.distance - before;
  fitMinDistance = orbit.minDistance;
  focalDepthRow.dispose();
  focalDepthRow = addFocalDepthRow();
});

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  time += dt;
  bus.drive(time);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
bus.drive(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
