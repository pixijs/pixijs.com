/**
 * Ambient occlusion: `SsaoEffect` darkens creases and contact points after the scene is drawn
 *
 * Light from the sky reaches a point in the open from every side, and a point tucked under a ball or into a crease
 * from fewer. `SsaoEffect` fakes that from the depth buffer: for each pixel it tests `samples` points in a hemisphere
 * of radius `radius` over the surface there, and the more of them sit behind something near, the darker the pixel. The
 * grey image that makes is blurred and multiplied onto the scene's light, before the view encodes it for the screen:
 * occlusion is a share of the sky's light that never arrives, so it scales light the way the lighting does, the same
 * share off a bright surface and a dim one. `radius` and `samples` are uniform writes, free every frame; `resolution`
 * sizes the effect's buffers, so changing it takes a new effect.
 *
 * Cost: the occlusion pass runs `samples` depth tests a texel of its buffer, which `resolution` sizes. Each texel also
 * reads depth 6 times to rebuild its position and normal, and the blur reads 5 taps across and 5 down; those scale
 * with `resolution` only, so 4 samples cost more than a quarter of 16.
 *
 * Controls: drag to orbit; the pane lifts the ball off the floor, switches the effect, sets its radius, samples and
 * resolution, and counts the sample tests a frame. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';
import { OrbitCamera, SsaoEffect } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { BALL_RADIUS, createCluster } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the cluster whole from the landscape distance */
const FIT_ASPECT = 1.1;
/** The stage's bright sky fill needs more than the 0.9 default for the darkening to show at a glance */
const INTENSITY = 1.8;
/**
 * The effect darkens light, and the screen's encoding then lifts dark values: half the light shows as about 0.73. Twice
 * the 1.5 default deepens the grey enough to read once encoded, out to the soft edge under the ball and the capsule.
 */
const POWER = 3;
/**
 * About a shape's size, so the ball's own depth still counts where it touches the floor. The default,
 * `radius × 0.65`, leaves a light gap right under the ball.
 */
const MAX_DISTANCE = 0.8;
/** The ball's centre at the top of the pane's range: its bottom 0.55 above the floor, past where its darkening ends */
const BALL_TOP = 1;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Ambient occlusion' });
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
const stage = new ThemeStage(view3d, { theme });

// The key's soft shadow would land exactly where the occlusion does. With it off, every dark patch is the effect's.
stage.key.castShadow = false;
app.stage.addChild(view3d);

const cluster = createCluster();

view3d.root.addChild(cluster.root);

// The pane's rows write these, then the effect; `resolution` can only reach it through a new one.
const settings = { enabled: true, radius: 0.6, samples: 16, resolution: 1 };

function createSsao() {
  return new SsaoEffect({
    ...settings,
    intensity: INTENSITY,
    power: POWER,
    maxDistance: MAX_DISTANCE,
  });
}

let ssao = createSsao();

// The scene the effect reads draws multisampled, like the canvas, so edges stay smooth while the effect is on.
view3d.passes = [ssao];

view3d.camera.fov = 40;
view3d.camera.position.set(0.15, 3, 5.55);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0.15, y: 0.45, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 4,
  maxDistance: 10,
  // The cluster is posed for the front and above. Round to the torus's side the ball soon covers the capsule, so that
  // side stops sooner; from straight above each prop hides the contact under it.
  minPolarAngle: Math.PI * 0.3,
  maxPolarAngle: Math.PI * 0.45,
  minAzimuthAngle: -Math.PI / 3,
  maxAzimuthAngle: Math.PI / 5,
});

// A portrait screen is narrower than the cluster, so the camera and the fog back off until it fits.
const fit = fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: FIT_ASPECT,
});

const pane = new ThemePane({ title: 'Ambient occlusion', stage });

// Two panels, on the right under the pane or along the bottom: the props without the effect, and the grey alone that
// the effect multiplies in.
const visuals = createVisuals({
  app,
  view3d,
  stage,
  cluster,
  effect: ssao,
  pane,
  fit,
});

/**
 * `resolution` is fixed at construction, so a new effect takes the old one's place. The occlusion panel draws the same
 * instance, so the old one comes off both views before it's destroyed.
 */
function rebuildSsao() {
  const retired = ssao;

  ssao = createSsao();
  view3d.passes = [ssao];
  visuals.setEffect(ssao);
  retired.destroy();
}

const cost = { sampleTests: 0 };

/**
 * The main view's sample tests a frame: `samples` a texel, at `resolution` texels a px of the screen, and none while
 * it's off. On a phone the view reaches up past the screen's top, but the effect only draws the part on screen.
 */
function countSampleTests() {
  const texelsPerPx =
    settings.resolution === 'inherit'
      ? app.renderer.resolution
      : settings.resolution;
  const { width, height } = app.screen;

  cost.sampleTests = settings.enabled
    ? width * height * texelsPerPx ** 2 * settings.samples
    : 0;
}

pane.addBinding(cluster.ball.position, 'y', {
  label: 'ball height',
  min: BALL_RADIUS,
  max: BALL_TOP,
  step: 0.01,
});

const folder = pane.addFolder({ title: 'SsaoEffect' });

// Flipping `enabled` rebuilds the render graph of every view that draws the effect, which is fine for a setting.
folder
  .addBinding(settings, 'enabled')
  .on('change', () => (ssao.enabled = settings.enabled));
folder
  .addBinding(settings, 'radius', { min: 0.2, max: 1, step: 0.01 })
  .on('change', () => (ssao.radius = settings.radius));
// The shader loops a whole number of times but divides by the value as given, so whole numbers only.
folder
  .addBinding(settings, 'samples', { min: 2, max: 32, step: 1 })
  .on('change', () => (ssao.samples = settings.samples));
folder
  .addBinding(settings, 'resolution', {
    options: { 0.25: 0.25, 0.5: 0.5, 1: 1, inherit: 'inherit' },
  })
  .on('change', rebuildSsao);
folder.addBinding(cost, 'sampleTests', {
  label: 'sample tests',
  readonly: true,
  format: (tests) => `${(tests / 1e6).toFixed(1)} M`,
});

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  countSampleTests();
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
