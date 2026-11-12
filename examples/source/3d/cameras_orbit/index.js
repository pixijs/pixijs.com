/**
 * Orbit camera: drag, zoom and pan a camera round a target, inside limits, and draw a frame only when it moves
 *
 * `OrbitCamera` keeps `view3d.camera` on a sphere round `target`: a drag changes its `azimuthAngle` and `polarAngle`,
 * a zoom its `distance`, and a pan moves the target. Damping lets it glide after you let go, the limits keep it inside
 * a band, `autoRotate` circles on its own, `saveState()` and `reset()` save and restore a pose, and its `'change'`
 * event says when a new frame is worth drawing. The inset shows the camera from outside: the band, the two angles,
 * the distance and the saved pose.
 *
 * Controls: drag to orbit, right-drag or two fingers to pan, wheel or pinch to zoom toward the pointer; the pane sets
 * damping, auto-rotate, zoom to the cursor, the limits and render on demand, shows the camera's angles and distance,
 * and saves and resets the pose. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Spherical, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Ticker } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import { createVisuals } from './visuals';

/** The logo's centre, so the logo stays centred on screen while the camera circles it */
const TARGET = { x: 0, y: 1.7, z: 0 };
/** Where the camera starts: 10 units out, 21° above level and 34° round to the logo's left, a three-quarter view */
const START = new Spherical(10, 1.2, -0.6);
/** The narrowest view, width over height, that shows the logo whole from 10 units out and clear of the inset below */
const FIT_ASPECT = 0.8;
/** A turn every 20 s, slow enough to follow the camera round the inset */
const AUTO_ROTATE_RPM = 3;
/** 45° either side of the front */
const AZIMUTH_LIMIT = Math.PI / 4;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Orbit camera' });
const app = new Application();

// The app's own ticker never starts: the frame loop at the end draws only when something moved.
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

// Sized by hand rather than `autoResize`, which takes the screen's size as a render starts: after the labels are
// placed, and with frames drawn on demand no second frame comes to fix them.
const view3d = new View3D({
  width: app.screen.width,
  height: app.screen.height,
  cursor: 'grab',
});
const stage = new ThemeStage(view3d, { theme });
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();
const logo = await loading.load(() => loadPixiLogo());

logo.root.position.copyFrom(TARGET);
view3d.root.addChild(logo.root);
app.stage.addChild(view3d);

view3d.camera.fov = 40;
view3d.camera.position.setFromSpherical(START).add(TARGET);

const orbit = new OrbitCamera({
  view: view3d,
  target: TARGET,
  // Each update applies 5% of the turn still to come and keeps the rest, so a lower factor glides longer. It counts
  // updates, not seconds.
  enableDamping: true,
  dampingFactor: 0.05,
  // The logo stays whole and clear of the inset and the pane; fitPortrait scales both on a phone.
  minDistance: 7.5,
  maxDistance: 13,
  // Clear of the pole, where the view would spin, and above the floor.
  minPolarAngle: 0.35,
  maxPolarAngle: 1.4,
  autoRotateSpeed: AUTO_ROTATE_RPM,
  zoomToCursor: true,
  // The defaults, written out to show where touch is set.
  mouseButtons: { left: 'rotate', middle: 'zoom', right: 'pan' }, // ctrl, meta or shift swaps rotate and pan
  touches: { one: 'rotate', two: 'zoom-pan' },
});

// The azimuth limits apply only while both are finite, so the infinities switch them off.
function limitAzimuth(on) {
  orbit.minAzimuthAngle = on ? -AZIMUTH_LIMIT : -Infinity;
  orbit.maxAzimuthAngle = on ? AZIMUTH_LIMIT : Infinity;
}

// Render on demand: a frame is drawn on a tick only when something asked for one.
const settings = { renderOnDemand: true };
let frameRequested = true;

function requestFrame() {
  frameRequested = true;
}

// A resize clears the canvas, so it draws again at the new size. This listens before fitPortrait does, so the fit
// measures the view at its new size.
app.renderer.on('resize', (width, height) => {
  view3d.setSize(width, height);
  requestFrame();
});
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });
// The orbit saved its pose when it was built, before the fit backed it off on a phone, so reset() returns here.
orbit.saveState();

const pane = new ThemePane({ title: 'Orbit camera', stage });
const visuals = await createVisuals({
  app,
  view3d,
  stage,
  orbit,
  logo,
  pane,
  requestFrame,
});

// The saved pose is private and fires no event, so the inset's ghost is told about it here, and a frame drawn to show
// it: unlike reset(), saveState() moves nothing, so it fires no 'change'.
function saveView() {
  orbit.saveState();
  visuals.showSaved();
  requestFrame();
}

const controls = createControls({
  pane,
  orbit,
  settings,
  limitAzimuth,
  saveView,
  resetView: () => orbit.reset(),
});

// A pane edit can change what the frame shows, so it asks for one. The read-only rows are left out: each fires 'change'
// every time it reads, moved or not, so they would keep the canvas drawing.
pane.on('change', ({ target }) => {
  if (!controls.readouts.includes(target)) requestFrame();
});

// 'start' and 'end' bracket a drag, a pinch or a wheel turn. On touch 'start' comes again for each finger that lands
// and when one of two lifts, so a pinch has two or three before its one 'end'. 'change' fires on every update that
// moves the camera, its glides and auto-rotate included, so it's the one event render on demand needs.
orbit.on('start', () => (view3d.cursor = 'grabbing'));
orbit.on('end', () => (view3d.cursor = 'grab'));
orbit.on('change', requestFrame);

// The frame loop decides when to draw. It runs on `Ticker.shared` after the orbit's own, higher-priority update there,
// so a frame shows the camera where this tick left it.
function frame(ticker) {
  const darkness = stage.darkness;

  stage.update(Math.min(ticker.deltaMS / 1000, 1 / 15));
  // A theme fade changes the picture with the camera still.
  if (stage.darkness !== darkness) requestFrame();
  if (settings.renderOnDemand && !frameRequested) return;
  frameRequested = false;
  visuals.update();
  app.render();
  controls.countFrame();
}

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
Ticker.shared.add(frame);
