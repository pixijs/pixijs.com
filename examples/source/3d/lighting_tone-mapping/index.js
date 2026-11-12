/**
 * Tone mapping and exposure: how a view turns the light in its scene into the colours a screen can show
 *
 * A screen shows each colour channel from 0 to 1, but light has no top: a strong spot or an `emissive.strength` of 8
 * lands far past 1. `view3d.toneMapping` is the curve that brings it into the screen's range, one setting for the whole
 * view, background and fog included. `'none'` only encodes for the screen, so light past 1 clips: bright parts go flat,
 * and a saturated colour changes hue as each channel runs out on its own (the hot pink balls turn violet, since their
 * red reaches 1 long before their green and blue). A filmic curve (`'aces'`, `'reinhard'` or `'uncharted2'`) bends
 * instead, so highlights keep their shading and bright colour fades towards white. `'custom'` leaves the light linear,
 * for a post pass of your own. `view3d.exposure` scales all the light before the curve and is free to change every
 * frame, while a new `toneMapping` recompiles the view's materials.
 *
 * The left half (the top one on a portrait screen) is a view with `'none'`, the right one a view with the curve the
 * pane picks; both share one exposure, so the curve is the only difference between them.
 *
 * Controls: drag to orbit; the pane picks the right view's `toneMapping` and sets both views' `exposure`. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { createClayMaterial } from './theme/clay';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createGlowRow, createSpotlitLogo } from './scene';
import { createSplitView } from './split';
import { createVisuals } from './visuals';

/** Doubling, so each ball is one stop brighter than the last: one at 1, the brightest a screen shows, and three past */
const GLOW_STRENGTHS = [0.5, 1, 2, 4, 8];
/** The palette's colour for light: a saturated glow shows the change of hue that a white one would hide */
const GLOW_COLOR = BRAND.hotPink;
/** Bright enough that the logo's `JS` passes 1, the brightest a screen shows, at exposure 1 */
const SPOT_INTENSITY = 600;
/** The narrowest half, width over height, that shows the logo and the balls whole from the landscape distance */
const FIT_ASPECT = 0.85;
/** Fog from just behind the logo, so the floor melts away before the horizon */
const FOG = { near: 10, far: 30 };
/** The logos' sway: radians either way, and radians a second, so the spot's hot patch crawls across the `xi` */
const SWAY = { angle: 0.2, speed: 0.4 };
/** Every curve, named as the code writes it */
const CURVES = {
  aces: 'aces',
  reinhard: 'reinhard',
  uncharted2: 'uncharted2',
  none: 'none',
  custom: 'custom',
};

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Tone mapping' });
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

// A curve is a setting of the whole view, so the comparison is two views. A mesh belongs to one view, so each half
// builds its own copy of the scene on its own stage.
const noneView = new View3D();
const curveView = new View3D();
const noneStage = new ThemeStage(noneView, { theme, fog: FOG });
const curveStage = new ThemeStage(curveView, { theme, fog: FOG });

// The stage sets 'none', the curve the kit's colours are picked for, so a view's own curve goes on after it. The left
// view keeps the stage's 'none', written again here so each half's curve reads in one place: no curve, only the
// encode for the screen, so light past 1 clips.
noneView.toneMapping = 'none';
// A filmic curve that rolls bright light off towards white.
curveView.toneMapping = 'aces';

// Light past 1: glow at five strengths, on a near-black body so the glow is nearly all the light a ball gives off.
// One set serves both rows, since a material can draw in two views, each through its own view's curve.
const glowMaterials = GLOW_STRENGTHS.map((strength) =>
  createClayMaterial({
    color: BRAND.night,
    emissive: { color: GLOW_COLOR, strength },
  }),
);
// And a spot far past 1 on each logo's `JS`.
const [noneLogo, curveLogo] = await loading.load(() =>
  Promise.all([
    createSpotlitLogo(noneView.root, SPOT_INTENSITY),
    createSpotlitLogo(curveView.root, SPOT_INTENSITY),
  ]),
);
const glowRows = [
  createGlowRow(noneView.root, glowMaterials),
  createGlowRow(curveView.root, glowMaterials),
];
// Each shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
noneStage.shadowOverFloor();
curveStage.shadowOverFloor();

noneView.camera.fov = 40;
noneView.camera.position.set(0, 3.3, 9.6);

// The tick moves the orbit, then the split copies its camera to the right view, so the halves never draw apart.
const orbit = new OrbitCamera({
  view: noneView,
  target: { x: 0, y: 1.55, z: 0.6 },
  enableDamping: true,
  enablePan: false,
  autoUpdate: false,
  minDistance: 7,
  maxDistance: 16,
  minAzimuthAngle: -0.5,
  maxAzimuthAngle: 0.5,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});
// A half narrower than the logo backs the camera and the fog off until it fits, as fitPortrait does for one view.
const split = createSplitView({
  app,
  views: [noneView, curveView],
  stages: [noneStage, curveStage],
  orbit,
  minAspect: FIT_ASPECT,
});

app.stage.addChild(noneView, curveView, split.divider);

const visuals = createVisuals({
  app,
  split,
  noneView,
  curveView,
  stage: noneStage,
  glowRows,
  glowStrengths: GLOW_STRENGTHS,
});

const pane = new ThemePane({ title: 'Tone mapping', stage: noneStage });

pane.addBinding(curveView, 'toneMapping', { options: CURVES });
pane.addBinding(curveView, 'exposure', { min: 0.25, max: 4, step: 0.01 });

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  noneStage.update(dt);
  // One exposure for both, so the curve is the only difference between the halves.
  noneView.exposure = curveView.exposure;
  noneLogo.root.rotation.y = Math.sin(time * SWAY.speed) * SWAY.angle;
  curveLogo.root.rotation.y = noneLogo.root.rotation.y;
  orbit.update(ticker);
  split.update();
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
split.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
