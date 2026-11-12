/**
 * Anti-aliasing: MSAA from the canvas's `antialias` option, which the scene keeps through post effects, and
 * `FxaaEffect` for a canvas without it
 *
 * A pixel holds one colour, so an edge that crosses part of it comes out as a stair step, and a wire thinner than a
 * pixel breaks into dashes. `antialias: true` gives the canvas four samples of colour and depth a pixel. A view with a
 * post effect on draws its scene into a texture first, and that texture takes four samples too while the canvas has
 * them, so edges stay smooth through every effect. One case still drops them: a scene output the GPU can't average,
 * such as SSAO's scene normals on WebGL. `FxaaEffect`, last in `passes`, is for a canvas without MSAA or a view in that
 * case. It smooths the finished picture in one pass of five to nine reads a pixel, whatever the scene holds, but it
 * can't join up a wire the pixels already lost. The loupe in the corner magnifies the canvas's own pixels at the marked
 * patch of fence.
 *
 * Controls: drag to orbit. In the pane, untick `antialias` to reload with a one-sample canvas and the loupe's edges
 * step, then tick `fxaa.enabled` to smooth them again. Tick `effect.enabled` and the loupe doesn't change, since MSAA
 * survives post effects; tick `ssao.enabled` on WebGL and the edges step. The `fxaa` folder tunes FXAA's edge test,
 * and the pane reads out the anti-aliasing the view gets and the wire's width in the loupe. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`, `?antialias=on|off`, `?effect=on|off`, `?ssao=on|off`,
 * `?fxaa=on|off`.
 */

import { View3D } from '@pixi/3d';
import {
  FxaaEffect,
  OrbitCamera,
  SsaoEffect,
  TintEffect,
} from '@pixi/3d/extras';
import { Application, RendererType } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import { createFence } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the fence from its second post to the haze */
const FIT_ASPECT = 1.3;
/** Px kept free over the fence on a phone, for the collapsed pane */
const PANE_ROOM = 52;

// The pane's `antialias` row reloads the page with these flags, so it lands on the same effects.
const params = new URLSearchParams(location.search);

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Anti-aliasing' });
const app = new Application();

// MSAA belongs to the canvas: pixi asks for it when it creates the context, so it can't change afterwards, and pixi's
// default is `false`.
await app.init({
  preference: rendererPreference,
  resizeTo: window,
  background: THEMES[theme].haze,
  antialias: params.get('antialias') !== 'off',
  autoStart: false,
  resolution: Math.min(window.devicePixelRatio, 2),
  autoDensity: true,
});
loading.progress(0.2);

// Stands in for any post effect, bloom or tilt shift. White changes no pixel, so the loupe shows only what drawing the
// scene into a texture does, and with MSAA that's nothing: the texture takes the canvas's four samples.
const effect = new TintEffect({
  enabled: params.get('effect') === 'on',
  tint: 0xffffff,
});
// A real effect that asks the scene draw for its normals as well as its colour. Every texture a draw writes shares one
// sample count, and pixi can't multisample the normals' `rgba8unorm` on WebGL, so there the scene draws one sample a
// pixel while SSAO is on. WebGPU multisamples the normals with the colour.
const ssao = new SsaoEffect({
  enabled: params.get('ssao') === 'on',
  sceneNormals: true,
});
// The defaults, written out because the pane tunes them.
const fxaa = new FxaaEffect({
  enabled: params.get('fxaa') === 'on',
  edgeThreshold: 0.125,
  edgeThresholdMin: 0.05,
  edgeSharpness: 8,
});
// FXAA goes last, since it smooths the picture it's given. Flipping `enabled` rebuilds the render graph once: fine on
// a click, never every frame.
const view3d = new View3D({ autoResize: true, passes: [effect, ssao, fxaa] });
// Fog from further out than the kit's, so the loupe's stretch of rail keeps its colour and the far end still melts away.
const stage = new ThemeStage(view3d, { theme, fog: { near: 20, far: 50 } });
const fence = createFence();

app.stage.addChild(view3d);
view3d.root.addChild(fence.root);

/** The anti-aliasing the view gets: MSAA while the canvas has it and SSAO doesn't turn it off, plus FXAA while it's on */
function antiAliasing() {
  const { renderer } = app;
  const msaa =
    renderer.view.antialias &&
    !(ssao.enabled && renderer.type === RendererType.WEBGL);

  if (msaa) return fxaa.enabled ? 'MSAA + FXAA' : 'MSAA';

  return fxaa.enabled ? 'FXAA' : 'none';
}

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.2, 10);

// It looks a few posts down the fence, so the near posts and the far haze both show. The limits keep the loupe's
// stretch of fence on screen, clear of the pane and the loupe.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 1, y: 0.4, z: -4 },
  enableDamping: true,
  enablePan: false,
  minDistance: 12,
  maxDistance: 20,
  minPolarAngle: 1.32,
  maxPolarAngle: Math.PI * 0.47,
  minAzimuthAngle: -0.25,
  maxAzimuthAngle: 0.05,
});

// A portrait screen is narrower than the fence, so the camera and the fog back off until it fits the band between
// the pane and the loupe along the bottom.
const fit = fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: FIT_ASPECT,
  clearTop: PANE_ROOM,
});

const visuals = createVisuals({
  app,
  view3d,
  stage,
  orbit,
  fence,
  onLayout(loupeTop) {
    fit.clearBottom = app.screen.height - loupeTop;
    fit.refit();
  },
});
const pane = new ThemePane({ title: 'Anti-aliasing', stage });

createControls({
  pane,
  stage,
  antialias: app.renderer.view.antialias,
  effect,
  ssao,
  fxaa,
  antiAliasing,
  wire: visuals,
});

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it. The view takes the
// screen's size as it first renders, so the loupe aims after that, and shows what it copied a render later.
orbit.update();
app.render();
visuals.update(0);
app.render();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
