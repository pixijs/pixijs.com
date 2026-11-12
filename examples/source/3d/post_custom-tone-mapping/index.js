/**
 * Own the whole output transform: shade into a floating-point target, then tone map and encode in your own effect.
 *
 * `toneMapping: 'custom'` leaves out the engine's curve and display encode, so materials write raw linear light. A
 * `RenderGraph` with an `rgba16float` scene colour keeps values above 1 until `DisplayEffect` rolls them off with
 * Reinhard and encodes them for the screen. The effect runs inside the view's graph, so pixi 2D drawn on `app.stage`
 * beside the view, like the labels naming each half, keeps its authored colours.
 *
 * The left half (the top one on a portrait screen) runs the effect with the curve off, so light past 1 clips; the
 * right half runs it whole. Both share one encode and one exposure, so the curve is the only difference.
 *
 * Controls: drag to orbit; the pane turns the encode on and off and sets the exposure, for both halves. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import {
  BackgroundPass,
  ForwardRenderPass,
  Material3D,
  RenderGraph,
  View3D,
} from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';

import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { DisplayEffect } from './DisplayEffect';
import { createSplitView } from './split';
import { createVisuals } from './visuals';

/** Twice the light pushes the glowing faces well past 1, where the curve has something to roll off */
const EXPOSURE = 2;

/** The narrowest half, width over height, that shows the logo whole from the landscape distance */
const FIT_ASPECT = 0.85;

/** How far the logo sways either side, in radians: enough to carry the highlights across it, never turning it away */
const SWAY = 0.3;

/** The sway's pace in radians of phase a second, one sway every 18 s, slow enough to read as idle */
const SWAY_SPEED = 0.35;

/** A view's graph: the background and the opaque meshes into a float target, then `effect` out to the screen */
function createDisplayGraph(effect, renderer, options) {
  // An 8-bit target would clip everything above 1 before the curve could roll it off.
  const graph = new RenderGraph({
    globalTextureBindings: options.globalTextureBindings,
    defaultColor: (s) => s.defaultTarget.colorTexture,
    defaultDepth: (s) => s.defaultTarget.depthStencilTexture,
    sceneColor: { format: 'rgba16float', label: 'linear HDR' },
    sceneDepth: { label: 'HDR depth' },
  });

  graph.addPass(new BackgroundPass({ renderer }));
  graph.addPass(
    new ForwardRenderPass({ renderer, name: 'opaque', sort: 'key' }),
  );
  effect.build(graph, {
    renderer,
    input: graph.sceneColor,
    output: null,
    opaqueColor: graph.sceneColor,
    opaqueDepth: graph.sceneDepth,
  });
  graph.compile();

  return graph;
}

const theme = themeFromUrl();
const loading = new LoadingScreen({ theme, label: 'Custom tone mapping' });
const app = new Application();

await app.init({
  preference: rendererPreference,
  resizeTo: window,
  background: THEMES[theme].haze,
  antialias: true,
  autoStart: false,
  resolution: Math.min(devicePixelRatio, 2),
  autoDensity: true,
});

// The glow puts the faces above 1 in linear light: the range the float target keeps and the curve rolls off. Both
// halves share it, since a material can draw in two views.
const material = new Material3D({
  baseColor: BRAND.pink,
  metallic: 0.15,
  roughness: 0.22,
  emissive: { color: BRAND.pink, strength: 0.8 },
});

/** One half of the split: a view whose graph ends in `effect`, its stage, and the glowing logo */
async function createHalf(effect) {
  const view3d = new View3D({
    graph: (renderer, options) => createDisplayGraph(effect, renderer, options),
  });
  const stage = new ThemeStage(view3d, { theme });

  // The stage sets 'none', so switch to 'custom' after it: the effect then owns both output steps.
  view3d.toneMapping = 'custom';
  view3d.exposure = EXPOSURE;

  // The graph has no shadow pass, so nothing casts or takes shadows.
  stage.key.castShadow = false;
  stage.form.castShadow = false;
  stage.floor.receiveShadow = false;

  const logo = await loadPixiLogo({
    width: 4,
    castShadow: false,
    receiveShadow: false,
  });

  logo.setMaterial(material);
  logo.root.position.y = 1.7;
  view3d.root.addChild(logo.root);

  return { view3d, stage, logo };
}

// A graph belongs to one view, so the comparison is two views, each with its own effect. A mesh belongs to one view
// too, so each half builds its own copy of the scene.
const clipEffect = new DisplayEffect({ reinhard: false });
const curveEffect = new DisplayEffect();
const [clip, curve] = await loading.load(() =>
  Promise.all([createHalf(clipEffect), createHalf(curveEffect)]),
);

clip.view3d.camera.fov = 40;
clip.view3d.camera.position.set(0, 3.2, 10);

// The tick moves the orbit, then the split copies its camera to the right view, so the halves never draw apart.
const orbit = new OrbitCamera({
  view: clip.view3d,
  target: { x: 0, y: 1.3, z: 0 },
  enableDamping: true,
  enablePan: false,
  autoUpdate: false,
  minDistance: 6,
  maxDistance: 16,
  maxPolarAngle: Math.PI * 0.45,
});
// A half narrower than the logo backs the camera and the fog off until it fits.
const split = createSplitView({
  app,
  views: [clip.view3d, curve.view3d],
  stages: [clip.stage, curve.stage],
  orbit,
  minAspect: FIT_ASPECT,
});

app.stage.addChild(clip.view3d, curve.view3d, split.divider);

const visuals = createVisuals({
  app,
  views: [clip.view3d, curve.view3d],
  logos: [clip.logo, curve.logo],
  stage: clip.stage,
});

const pane = new ThemePane({ title: 'Custom tone mapping', stage: clip.stage });

// The pane binds the right half, and the left copies each change, so the curve stays the only difference.
pane.addBinding(curveEffect, 'encode').on('change', ({ value }) => {
  clipEffect.encode = value;
});
pane
  .addBinding(curve.view3d, 'exposure', { min: 0.25, max: 5, step: 0.05 })
  .on('change', ({ value }) => {
    clip.view3d.exposure = value;
  });

let elapsed = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  elapsed += dt;
  clip.stage.update(dt);
  clip.logo.root.rotation.y = Math.sin(elapsed * SWAY_SPEED) * SWAY;
  curve.logo.root.rotation.y = clip.logo.root.rotation.y;
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
