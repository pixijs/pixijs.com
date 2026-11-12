/**
 * Writing post effects of your own: a vignette from one fragment, and an edge blur built from three passes
 *
 * A `PostEffect` runs over the finished frame, once per pixel. `VignetteEffect` declares one `fragment`, a WGSL and a
 * GLSL string that each define `effect(uv)`, and a `UniformGroup` its properties write into. `EdgeBlurEffect`
 * overrides `build()` to add its own passes: two blurs into low-resolution textures, then a mix toward the edges.
 * `view3d.passes` runs them in order, and the last enabled one draws to the screen.
 *
 * Controls: drag to orbit; the pane turns each effect off and on, changes its uniforms, and sets the blur's
 * resolution. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import { EdgeBlurEffect } from './EdgeBlurEffect';

import { createShapeArc } from './scene';
import { VignetteEffect } from './VignetteEffect';

/** The narrowest view, width over height, that shows the shapes' arc whole from the landscape distance */
const FIT_ASPECT = 1.6;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Custom effect' });
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

// The theme kit's own scene, so the effects change a picture the reader already knows.
const view3d = new View3D({ autoResize: true });
const stage = new ThemeStage(view3d, {
  theme,
  spotlight: true,
  fog: { near: 10, far: 30 },
});
const logo = await loading.load(() => loadPixiLogo({ width: 4 }));

app.stage.addChild(view3d);
logo.root.position.y = 1.7;
view3d.root.addChild(logo.root);

const shapes = createShapeArc({ parent: view3d.root });

// One fragment, a WGSL and a GLSL string, and three uniforms in one vec4.
const vignette = new VignetteEffect({
  strength: 0.55,
  radius: 0.25,
  softness: 0.35,
});

// Its own build(): two blur passes into small textures, then a pass that mixes the blur in toward the edges.
const blur = {
  enabled: true,
  radius: 0.2,
  softness: 0.25,
  size: 12,
  resolution: 0.25,
};
let edgeBlur = new EdgeBlurEffect(blur);

// Post effects run in array order, each reading what the one before wrote, and the last enabled one draws to the
// screen. With any effect on, the scene draws into a texture first, multisampled like the canvas, so edges stay
// smooth.
view3d.passes = [edgeBlur, vignette];

/** Hands the pane's blur settings to the effect */
function applyBlur() {
  // build() sized its textures from `resolution`, so a new one takes a new effect and a graph rebuild.
  if (blur.resolution !== edgeBlur.resolution) {
    const retired = edgeBlur;

    edgeBlur = new EdgeBlurEffect(blur);
    view3d.passes = [edgeBlur, vignette];
    // The view never destroys a pass it drops, so the old one is ours to free.
    retired.destroy();
  }
  // Flipping `enabled` rebuilds the graph, fine for a toggle; writing the value it already has costs nothing.
  edgeBlur.enabled = blur.enabled;
  // Uniform writes, cheap every frame.
  edgeBlur.radius = blur.radius;
  edgeBlur.softness = blur.softness;
  edgeBlur.size = blur.size;
}

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.2, 10);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.2, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the shapes' arc, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Custom effect', stage });

createControls({ pane, vignette, blur, applyBlur });

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  shapes.update(time);
  logo.root.rotation.y = Math.sin(time * 0.4) * 0.25;
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
shapes.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
