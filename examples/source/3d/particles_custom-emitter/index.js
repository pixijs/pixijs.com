/**
 * A custom emitter shape: sparks that start on the logo's surface, at the edge of a burn eating across it
 *
 * `ParticleSystem3D` asks its `shape` where each new particle starts and which way it heads, through the one method
 * an `EmitterShape` has, `sample(rng, outPos, outDir)`. `SurfaceShape` answers with points baked on the logo's
 * triangles and their outward normals, taken only from the strip past its `front`. A shape is a plain object, so
 * moving `front` on a running system moves where the sparks start, while a shader bit cuts the logo at the same x.
 *
 * Controls: drag to orbit; the pane sets `emitRate`, moves `front` across the logo, and shows the strip's baked
 * points, every baked point, or points picked by vertex. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { seededRandom, View3D } from '@pixi/3d';
import { OrbitCamera, ParticleSystem3D } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { sparkTexture } from './theme/particles';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { BURN_WIDTH, createBurnMaterial } from './scene';
import { SurfaceShape } from './SurfaceShape';
import { createVisuals, POINTS_OPTIONS } from './visuals';

const TITLE = 'Custom emitter';
/** The narrowest view, width over height, that shows the whole logo about the orbit's target below */
const FIT_ASPECT = 1.55;
/** The longest spark life: the system runs this long before the first frame, so the plume is full */
const PREWARM_SECONDS = 1.6;
/** Where the burn opens: through the X, where the strip crosses big faces turned every way */
const START_FRONT = -0.3;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: TITLE });
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

// The shadow pass skips the material's extra bits, so a burning logo would cast a whole shadow: nothing casts one.
stage.key.castShadow = false;
app.stage.addChild(view3d);

// The model's own material, since the burn replaces it at once.
const logo = await loading.load(() =>
  loadPixiLogo({ material: 'source', castShadow: false }),
);
const { material, burn } = createBurnMaterial();

logo.setMaterial(material);
// At x = 0 and never turned, so the burn's world x and the shape's logo x are one number.
logo.root.position.y = 1.6;
view3d.root.addChild(logo.root);

// It bakes its points once, here, in the logo's space; its strip is the burn's glowing band.
const shape = new SurfaceShape({
  meshes: logo.meshes,
  space: logo.root,
  strip: BURN_WIDTH,
});

const sparks = new ParticleSystem3D({
  shape,
  texture: sparkTexture(),
  // The pane's top rate times the longest life, so a full plume never recycles a live spark.
  capacity: 640,
  emitRate: 220,
  life: [0.8, 1.6],
  // Each spark leaves outPos along outDir at this speed, fast enough to shoot off its face before drag spends it.
  speed: [1.2, 2.4],
  drag: 3,
  // Then this pull takes over, so they rise like embers and drift back over the burnt part, away from the pane.
  gravity: { x: -0.5, y: 2.1, z: 0 },
  size: [0.08, 0.16],
  sizeEnd: 0,
  alphaEnd: 0,
  // They leave the edge in the burn's colour and cool to the logo's pink.
  color: BRAND.orange,
  colorEnd: BRAND.pink,
  // The rng `sample` receives comes from here: seeded, so every run throws the same sparks.
  createRandom: () => seededRandom('sparks'),
  // Stepped from app.ticker, which renders, so each frame's new sparks draw in that frame.
  autoUpdate: false,
  // At the logo's origin, so the logo's space, where the shape baked its points, is the emitter's own.
  parent: logo.root,
});

/** Cuts the logo where the shape emits, and emits only while its strip holds points */
function followFront() {
  // The shape only picks where sparks start; the material's shader bit cuts the logo, at the same x.
  burn.burnFront = shape.front;
  // The shape always answers with a point, so the system stops while the strip holds none; live sparks finish.
  if (shape.stripCount > 0) sparks.play();
  else sparks.stop();
}

// The shape's own field, not the system's: its setter finds the strip, and the system asks from the next spark on.
shape.front = START_FRONT;
followFront();

const visuals = createVisuals({ logo, shape });

view3d.camera.fov = 40;
// From the left and above, so the reader looks into the cut and onto the strokes' tops.
view3d.camera.position.set(-1.05, 2.95, 4.5);

const orbit = new OrbitCamera({
  view: view3d,
  // Right of the logo's middle, so the badge clears the pane.
  target: { x: 0.1, y: 1.55, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 4.5,
  maxDistance: 12,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A screen narrower than the logo backs the camera and the fog off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: TITLE, stage });
// From a strip's width left of the logo, where the strip holds nothing, to as far past it, where nothing is left.
const reach = logo.half.x + BURN_WIDTH;

pane.addBinding(sparks, 'emitRate', { min: 0, max: 400, step: 1 });
pane
  .addBinding(shape, 'front', { min: -reach, max: reach, step: 0.01 })
  .on('change', followFront);
pane.addBinding(visuals, 'points', {
  label: 'Points',
  options: POINTS_OPTIONS,
});

// A plume's worth of sparks before the first frame, so the burn never starts bare. With no ticker, a step is 1/60 s.
for (let i = 0; i < PREWARM_SECONDS * 60; i++) sparks.update();

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  // Asks the shape where each spark born this step starts, then uploads them.
  sparks.update(ticker);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
