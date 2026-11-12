/**
 * Scene outputs: the scene draw can write more than its colour, each extra texture in the same draw that shades it
 *
 * A `SceneOutput` names an extra texture the scene draw writes beside its colour. `normalOutput` comes ready-made in
 * the extras, and `outputs.ts` defines two more, each surface's base colour and its distance from the camera, through
 * a `ShaderBit` every opaque surface runs. An `ExtractPass` lists its output in `requiredOutputs`, which is what makes
 * the view write it, and copies it each frame into a texture you keep, since the output lasts only for the frame. The
 * cards show the three copies. Blended surfaces, such as the see-through sphere, write none of them.
 *
 * Cost: nothing draws twice, but each output is one more colour attachment on the scene draw: WebGPU allows 8, and 32
 * bytes a pixel across them, WebGL at least 4. The colour and these three `rgba8unorm` outputs, 8 bytes each, fill
 * WebGPU's 32 bytes exactly, so a fifth like them throws there. On WebGL an `rgba8unorm` output also makes the scene
 * draw one sample a pixel, so FXAA smooths the edges there.
 *
 * Controls: drag to orbit; the pane turns each copy off and on, makes the middle sphere see-through, and counts the
 * scene draw's attachments. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';
import {
  ExtractPass,
  FxaaEffect,
  normalOutput,
  OrbitCamera,
} from '@pixi/3d/extras';
import { Application, RendererType } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { clayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { albedoOutput, depthOutput } from './outputs';
import { createShapeArc } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the shapes' arc whole from the landscape distance */
const FIT_ASPECT = 1.1;
/** The logo's idle sway: the most it turns either way, in radians, and how fast */
const SWAY = 0.3;
const SWAY_SPEED = 0.4;
/**
 * The see-through sphere's alpha: clear enough to show the checker and the logo's shadow through it. Much higher, and
 * on the dark floor it reads as a dull navy ball rather than glass.
 */
const SEE_THROUGH_ALPHA = 0.35;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Scene outputs' });
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

// One copy per output. Each pass names its output in `requiredOutputs`, so the view writes the output only while the
// pass is enabled, and copies it once the scene has drawn into `texture`, which is the view's size and lives as long
// as the pass. The view never destroys a pass it holds: `extract.destroy()` frees the texture once you're done.
// Where no surface drew, above the horizon, each copy holds its output's `clearValue`: the normal and albedo cards
// show their own panel through the default transparent clear, and the depth card shows black.
const extracts = {
  normal: new ExtractPass({ output: normalOutput }),
  albedo: new ExtractPass({ output: albedoOutput }),
  depth: new ExtractPass({ output: depthOutput }),
};
// On WebGL a scene draw with an `rgba8unorm` output can't take the canvas's four samples, so it draws one sample a
// pixel and its edges step. FXAA, last in `passes`, smooths them again; post_antialiasing compares the two. WebGPU
// keeps its samples, so FXAA stays off there.
const fxaa = new FxaaEffect({ enabled: false });
const view3d = new View3D({
  autoResize: true,
  passes: [extracts.normal, extracts.albedo, extracts.depth, fxaa],
});
const stage = new ThemeStage(view3d, { theme });
const logo = await loading.load(() => loadPixiLogo({ width: 4 }));

app.stage.addChild(view3d);
logo.root.position.y = 2.1;
view3d.root.addChild(logo.root);

const shapes = createShapeArc({ parent: view3d.root });

// `seeThrough` is the pane's. `attachments` is worked out for its read-only row: the scene draw's colour attachments,
// the colour plus each output written.
const look = { seeThrough: true };
const cost = { attachments: 0 };

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.6, 11.4);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.1, z: 0.6 },
  enableDamping: true,
  enablePan: false,
  minDistance: 8,
  maxDistance: 18,
  // Stays above the floor and in front of the logo, which reads as a thin slab from the side.
  minPolarAngle: Math.PI * 0.2,
  maxPolarAngle: Math.PI * 0.45,
  minAzimuthAngle: -Math.PI / 4,
  maxAzimuthAngle: Math.PI / 4,
});

// A portrait screen is narrower than the shapes' arc, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Scene outputs', stage });
const folder = pane.addFolder({ title: 'ExtractPass' });

// Each row is one pass's `enabled`: off, the view stops writing that output, and its card has nothing to show.
for (const [name, extract] of Object.entries(extracts)) {
  folder
    .addBinding(extract, 'enabled', { label: name })
    .on('change', applyOutputs);
}
pane
  .addBinding(look, 'seeThrough', { label: 'see-through' })
  .on('change', applySeeThrough);
const attachmentsRow = pane.addBinding(cost, 'attachments', {
  readonly: true,
  format: (count) => count.toFixed(0),
});

/** Follows the passes' `enabled`: FXAA on where the outputs cost the scene draw its samples, and the count */
function applyOutputs() {
  const written = Object.values(extracts).filter(
    (extract) => extract.enabled,
  ).length;

  // Flipping `enabled` rebuilds the render graph on the next render, once however many passes flipped.
  fxaa.enabled = app.renderer.type === RendererType.WEBGL && written > 0;
  cost.attachments = 1 + written;
  // A read-only row polls its value a few times a second; refreshing shows the count in the click's frame.
  attachmentsRow.refresh();
}

/** Blended clay draws after the opaque scene and writes only the colour, so the cards show what's behind it */
function applySeeThrough() {
  shapes.sphere.material = look.seeThrough
    ? clayMaterial(shapes.sphereColor, {
        alphaMode: 'blend',
        alpha: SEE_THROUGH_ALPHA,
      })
    : clayMaterial(shapes.sphereColor);
}

applyOutputs();
applySeeThrough();

const visuals = createVisuals({ app, view3d, stage, pane, extracts });

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  logo.root.rotation.y = Math.sin(time * SWAY_SPEED) * SWAY;
  shapes.update(time);
  stage.update(dt);
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it. Each copy is 1 x 1
// until the view first renders and sizes it, so a first render sizes them, then the cards fit their crops and the
// frame draws again.
orbit.update();
shapes.update(0);
app.render();
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
