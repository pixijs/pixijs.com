/**
 * HDR environment: why a sky loaded from a Radiance `.hdr` file keeps the sun brighter than white
 *
 * A JPG stops at white, so the sun in a `.cubemap` of six JPGs is no brighter than a white cloud. A Radiance `.hdr`
 * panorama stores the real light: in this sunset the sun is thousands of times brighter than white. `Assets.load`
 * turns the `.hdr` into a float `CubeTexture` that `view3d.environment` and `view3d.background` take like any cube
 * map. Turn `view3d.exposure` down and the difference shows: the `.hdr` sun stays a hot glint on the metal logo and
 * the chrome ball, and a burning disc in the sky, while the JPG sun greys with everything else. A `BloomEffect` at
 * threshold 2 glows only from light twice as bright as white, so only the `.hdr` half has anything to glow from.
 *
 * The left half (the top one on a portrait screen) is lit by the `.hdr`, the right one by the `.cubemap` of the same
 * sky. Both share one exposure and one tone curve, so the source is the only difference between them.
 *
 * Controls: drag to orbit, a little past half way round to find the sun in the sky beside the logo; the pane sets
 * both views' exposure in stops and their bloom. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, View3D } from '@pixi/3d';
import { BloomEffect, OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { environment } from './manifest';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, mixColor, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createSubject, SUN_AZIMUTH, swayAngle } from './scene';
import { createSplitView } from './split';
import { createVisuals } from './visuals';

/** The same Venice sunset as six JPGs, 512 px a face */
const CUBE_MAP_URL =
  'https://pixijs.com/assets/3d/venice-sunset/venice-sunset.cubemap';
/** Two stops down: the `.hdr` sun still burns at a quarter of its light, while the JPG one has gone grey */
const OPENING_STOPS = -2;
/**
 * Twice white. Bloom eases in from half its threshold, so the JPG sky, white at most, can't glow at 0 stops or under,
 * while the `.hdr` sun passes it at every exposure the pane reaches
 */
const BLOOM_THRESHOLD = 2;
/** Under the default 1, so the glow rings the glint without washing over the logo */
const BLOOM_INTENSITY = 0.4;
/** Pale pink, as in lighting_environment: a metal's colour only tints what it reflects, so the sky stays the sky */
const LOGO_METAL = mixColor(BRAND.white, BRAND.logoFace, 0.35);
/** Just off a mirror, so the sun stays a tight glint and the bevels' reflections hold together */
const LOGO_ROUGHNESS = 0.08;
/** Real chrome reflects a little over half the light */
const CHROME = 0xc8c8c8;
/**
 * Polished rather than a perfect mirror: the `.hdr` sun spreads into a hot spot wide enough to see and to bloom,
 * while the ball still reads as chrome
 */
const CHROME_ROUGHNESS = 0.15;
/** How far the camera stands from the logo, and its height: level with the sun's glint, which sits low on the horizon */
const CAMERA = { distance: 11.5, y: 0.1 };
/** The narrowest half, width over height, that shows the logo and the ball whole from the landscape distance */
const FIT_ASPECT = 0.7;
/**
 * How high the orbit's target rises on a portrait screen, so both halves' subjects sit lower and the open pane over
 * the top half clears the logo and the glow round its glint
 */
const STACKED_TARGET_Y = 1;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'HDR environment' });
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

// An environment is a setting of the whole view, so the comparison is two views, each with its own bloom. A mesh
// belongs to one view, so each half builds its own copy of the subject on its own stage.
const hdrBloom = new BloomEffect({
  threshold: BLOOM_THRESHOLD,
  intensity: BLOOM_INTENSITY,
});
const cubeBloom = new BloomEffect({
  threshold: BLOOM_THRESHOLD,
  intensity: BLOOM_INTENSITY,
});
const hdrView = new View3D({ passes: [hdrBloom] });
const cubeView = new View3D({ passes: [cubeBloom] });
// The sky is the only light and the backdrop too, so each stage keeps only its theme: no floor, fog or lights.
const hdrStage = new ThemeStage(hdrView, { theme, lights: false });
const cubeStage = new ThemeStage(cubeView, { theme, lights: false });

for (const [view3d, stage] of [
  [hdrView, hdrStage],
  [cubeView, cubeStage],
]) {
  stage.floor.visible = false;
  view3d.fog = null;
  // The stage sets 'none', so the curve goes on after it. ACES rolls the `.hdr` sun off towards white instead of
  // clipping it flat; lighting_tone-mapping compares the curves.
  view3d.toneMapping = 'aces';
}

// A metal has no diffuse colour; its pale pink only tints the sky it mirrors, so its glints are the sun itself. One
// material serves both halves, since a material can draw in two views, each under its own view's environment.
const logoMetal = new Material3D({
  baseColor: LOGO_METAL,
  metallic: 1,
  roughness: LOGO_ROUGHNESS,
});
const chrome = new Material3D({
  baseColor: CHROME,
  metallic: 1,
  roughness: CHROME_ROUGHNESS,
});

// `Assets.load` hands a `.hdr` file to `loadHdr`, which `@pixi/3d` registers on import: it turns the panorama into a
// float cube that keeps the sun's real brightness. The conversion runs on the main thread while the file loads, about
// 50 ms for this 1k panorama (`loadHdr`'s JSDoc gives the timings), and loading `{ src, data: { faceSize } }` trades
// memory for a sharper sky. The `.cubemap` is JSON naming six JPGs, which stop at white.
const [hdrSky, jpgSky, hdrSubject, cubeSubject] = await loading.load(() =>
  Promise.all([
    Assets.load(environment('hdri.VeniceSunset')),
    Assets.load(CUBE_MAP_URL),
    createSubject({
      parent: hdrView.root,
      logoMaterial: logoMetal,
      ballMaterial: chrome,
    }),
    createSubject({
      parent: cubeView.root,
      logoMaterial: logoMetal,
      ballMaterial: chrome,
    }),
  ]),
);

// Each sky lights its half and draws behind it, so the sky you see is the light on the metal.
hdrView.environment = hdrSky;
hdrView.background = hdrSky;
cubeView.environment = jpgSky;
cubeView.background = jpgSky;

const settings = { stops: OPENING_STOPS };

/** Both views take one exposure, so the source stays the only difference between them */
function applyExposure() {
  // A stop doubles the light, or halves it.
  hdrView.exposure = 2 ** settings.stops;
  cubeView.exposure = hdrView.exposure;
}

/** The `.cubemap` half's bloom takes the pane's settings from the `.hdr` half's */
function matchBloom() {
  cubeBloom.enabled = hdrBloom.enabled;
  cubeBloom.threshold = hdrBloom.threshold;
}

applyExposure();

hdrView.camera.fov = 40;
// The camera stands between the logo and the sun, with the sun at its back, so the metal mirrors the sun at it.
hdrView.camera.position.set(
  Math.sin(SUN_AZIMUTH) * CAMERA.distance,
  CAMERA.y,
  Math.cos(SUN_AZIMUTH) * CAMERA.distance,
);

// The tick moves the orbit, then the split copies its camera to the other view, so the halves never draw apart. No
// limit round the turn: a little past half way round, the sun is in the sky beside the logo.
const orbit = new OrbitCamera({
  view: hdrView,
  target: { x: 0, y: 0, z: 0 },
  enableDamping: true,
  enablePan: false,
  autoUpdate: false,
  minDistance: 7,
  maxDistance: 16,
  minPolarAngle: Math.PI * 0.2,
  maxPolarAngle: Math.PI * 0.8,
});
// A half narrower than the logo backs the camera off until it fits, as fitPortrait does for one view.
const split = createSplitView({
  app,
  views: [hdrView, cubeView],
  stages: [hdrStage, cubeStage],
  orbit,
  minAspect: FIT_ASPECT,
});

// Only the target moves, so the camera just tilts up; the glint, set by where the camera stands, stays put on the
// logo.
function aim() {
  orbit.target.y = split.stacked ? STACKED_TARGET_Y : 0;
}

aim();
app.renderer.on('resize', aim);

app.stage.addChild(hdrView, cubeView, split.divider);

const visuals = createVisuals({
  app,
  split,
  hdrView,
  cubeView,
  stage: hdrStage,
});

const pane = new ThemePane({ title: 'HDR environment', stage: hdrStage });

pane
  .addBinding(settings, 'stops', {
    label: 'Exposure (stops)',
    min: -4,
    max: 2,
    step: 0.1,
  })
  .on('change', applyExposure);

// Closed where the pane opens closed (a phone) and on any portrait screen, so a reader who opens the pane to work the
// exposure still sees both logos under it.
const bloomFolder = pane.addFolder({
  title: 'BloomEffect',
  expanded: pane.expanded && !split.stacked,
});

bloomFolder.addBinding(hdrBloom, 'enabled').on('change', matchBloom);
bloomFolder
  .addBinding(hdrBloom, 'threshold', { min: 0.5, max: 8, step: 0.1 })
  .on('change', matchBloom);

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  hdrStage.update(dt);
  hdrSubject.logo.root.rotation.y = swayAngle(time);
  cubeSubject.logo.root.rotation.y = hdrSubject.logo.root.rotation.y;
  orbit.update(ticker);
  split.update();
  visuals.update();
});

// Each cube map is prefiltered the first time a view draws it, and turning bloom off moves the tone curve into the
// materials, which builds their shaders again. So both states are drawn once behind the loading screen, and neither
// the first frame nor the first switch stalls.
hdrBloom.enabled = false;
matchBloom();
app.render();
hdrBloom.enabled = true;
matchBloom();

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
split.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
