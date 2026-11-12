/**
 * Bloom: a post effect that makes light brighter than white glow out past its edges
 *
 * A `BloomEffect` in `view3d.passes` reads the scene as linear light, before the tone curve, from a float texture, so a
 * pixel can pass 1. It keeps the pixels brighter than its `threshold`, blurs them through a pyramid of `levels`
 * textures and adds them back, so the glow spills onto the floor and sky where no material draws. It sees only how
 * bright a pixel is, not why: an `emissive` strength past 1 is how you make a surface brighter than white on purpose.
 * A row of balls, after a lit white cube with no emissive, shows where the threshold cuts: one under it, one just past
 * it and one far past it. `threshold`, `intensity` and `radius` can change every frame; `levels` and `resolution` size
 * the effect's textures, so changing them takes a new effect.
 *
 * Controls: drag to orbit; the pane sets the bloom's settings, the view's tone mapping and the logo's emissive
 * strength. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, View3D } from '@pixi/3d';
import { BloomEffect, OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';

import { createGlowRow } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the logo and the glow row whole from the landscape distance */
const FIT_ASPECT = 1.45;
/** The palette's colour for light rather than paint */
const GLOW_COLOR = BRAND.hotPink;
/** One ball under the threshold, one just past it and one far past it */
const GLOW_STRENGTHS = [0.5, 2, 6];
/** The logo's idle sway: `angle` radians either way (about 11°), one full sway every 2π / `rate` s (about 16 s) */
const SWAY = { angle: 0.2, rate: 0.4 };

// Bloom adds light, so it shows against the dark: the light stage is already near white, with no room left above it.
const theme = themeFromUrl('dark');
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Bloom' });
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

// The default threshold, 1, is white in linear light: the dark stage lights no surface past it, so only emissive
// glows. A knee fades bloom in from half the threshold to one and a half times it, then a pixel blooms the share of its
// light that passes the threshold. Hot pink's red is 1 in linear light, so its emissive strength sets the brightest
// channel: the 0.5 ball stays at the foot of the knee, the 2 ball blooms half its light and the 6 ball five sixths.
// Twice the default intensity lets a ball's small halo show across the frame.
const settings = {
  enabled: true,
  threshold: 1,
  intensity: 2,
  radius: 0.8,
  levels: 5,
  resolution: 0.5,
};
let bloom = new BloomEffect(settings);
// autoResize adopts the screen's size as the view renders; given it now too, the labels placed before the first
// render land where that render draws them.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
  passes: [bloom],
});
// The stage sets `toneMapping` to 'none', the curve the kit's colours are picked for, which clips each channel at 1:
// the 6 ball's core clips toward white while its halo keeps the pink. A filmic curve such as 'aces' rolls bright light
// off toward white rather than clipping it, the usual pick once light passes 1, but it reshades the kit's colours too.
// The pane switches between the two.
const stage = new ThemeStage(view3d, { theme });
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();

app.stage.addChild(view3d);

// Emissive light is added after lighting, so it shows in the dark, and a near-black body leaves the glow nearly all
// the light the surface gives. At 1.5 the logo passes the threshold by half, enough to glow and keep its pink. Fog is
// off, as on the kit's enamel, so the glow doesn't fade as the camera backs off.
const neon = new Material3D({
  baseColor: BRAND.night,
  roughness: 0.35,
  emissive: { color: GLOW_COLOR, strength: 1.5 },
  fog: false,
});
// The model's own materials, not the kit's enamel: `setMaterial` swaps them for the neon straight away.
const logo = await loading.load(() => loadPixiLogo({ material: 'source' }));

logo.setMaterial(neon);
logo.root.position.y = 2.2;
view3d.root.addChild(logo.root);

// The same glow at three strengths, in a row in front of the logo, after a white cube that only the lights make bright.
const glowMaterials = GLOW_STRENGTHS.map(
  (strength) =>
    new Material3D({
      baseColor: BRAND.night,
      roughness: 0.58,
      emissive: { color: GLOW_COLOR, strength },
      fog: false,
    }),
);
const glowRow = createGlowRow({
  parent: view3d.root,
  materials: glowMaterials,
});

/** Applies the pane's settings: the one place the effect changes */
function applyBloom() {
  // Uniform writes, free every frame.
  bloom.threshold = settings.threshold;
  bloom.intensity = settings.intensity;
  bloom.radius = settings.radius;
  // Flipping it rebuilds the render graph and recompiles the materials, since the tone curve moves between them and the
  // output pass: fine for a toggle. Writing the value it already has costs nothing, since the view compares the passes'
  // enabled flags each frame, so a threshold drag rebuilds nothing.
  bloom.enabled = settings.enabled;
  if (
    settings.levels !== bloom.levels ||
    settings.resolution !== bloom.resolution
  ) {
    // Both size the effect's textures, so they're fixed at construction: a new effect takes the old one's place.
    const old = bloom;

    bloom = new BloomEffect(settings);
    // A new array rebuilds the view's render graph on the next render; the view never destroys a pass it drops.
    view3d.passes = [bloom];
    old.destroy();
  }
}

const visuals = createVisuals({
  app,
  view3d,
  stage,
  glowRow,
  glowStrengths: GLOW_STRENGTHS,
});

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.3, 9);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.15, z: 0.8 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the logo and the row, so the camera and the fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Bloom', stage });

// Built with an emissive group, so it has one: `neon.emissive` is the group the pane's strength row sets.
createControls({
  pane,
  settings,
  view3d,
  neonEmissive: neon.emissive,
  onBloomChange: applyBloom,
});

// Seconds since the first tick, so the sway starts facing front and runs the same every time.
let swayTime = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  // A slow sway, so the glow's spill moves across the floor as the letters turn.
  swayTime += dt;
  logo.root.rotation.y = Math.sin(swayTime * SWAY.rate) * SWAY.angle;
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
