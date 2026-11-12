/**
 * A particle system: one options object that sets how many sparks are born each second, where, how they fly and how
 * they look
 *
 * `ParticleSystem3D` writes each particle once, when it's born, and the vertex shader works out where it is every
 * frame from that and the clock, so a whole spray is one draw call. `emitRate` (sparks a second), `bursts` and
 * `shape` decide the births, `speed`, `gravity` and `drag` the flight, and `size`, `alpha` and `color` with their
 * `…End` partners the look from birth to death. `emitRate`, `shape`, `gravity` and `drag` change on a running system,
 * and so do each burst's `count` and `repeatEvery`; the rest, the burst list among them, are fixed when it's built.
 * Over the spray the frame draws the emitter's shape, one spark's path with and without drag, and an arrow for gravity.
 *
 * Controls: drag to orbit; the pane sets emitRate, the emitter shape, gravity and drag. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { seededRandom, View3D } from '@pixi/3d';
import {
  BoxShape,
  ConeShape,
  OrbitCamera,
  ParticleSystem3D,
  PointShape,
  SphereShape,
} from '@pixi/3d/extras';

import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { sparkTexture } from './theme/particles';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createFireworkTube } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the fountain and its paths whole from the landscape distance */
const FIT_ASPECT = 0.82;
/** Steps of 1/60 s the system runs before the first frame, so the fountain is already going when the page shows */
const PREWARM_STEPS = 120;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Particle system' });
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

// At the screen's size from the start, so the first frame's labels land where the paths are.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });

app.stage.addChild(view3d);

const tube = createFireworkTube(view3d.root);

// Where each spark starts and which way it heads. The system reads its shape at every birth, so swapping it on a
// running system changes the next sparks only.
const shapes = {
  PointShape: new PointShape(),
  ConeShape: new ConeShape({ angle: 28, radius: 0.12 }),
  SphereShape: new SphereShape({ radius: 0.3 }),
  BoxShape: new BoxShape({ width: 1.4, height: 0.2, depth: 1.4 }),
};

const sparkOptions = {
  texture: sparkTexture(),
  // The most alive at once: 800 a second at the pane's top rate, for the longest life, plus a burst.
  capacity: 1250,
  // Sparks born each second, a steady stream under the bursts.
  emitRate: 300,
  // A clump fired at once on top of the stream: 120 sparks 1.6 s in, then again every 4.5 s. The list is copied, but
  // the burst object isn't, so `sparkOptions.bursts[0].count` stays live.
  bursts: [{ time: 1.6, count: 120, repeatEvery: 4.5 }],
  shape: shapes.ConeShape,
  // A pair is a range: each spark draws its own value between the two.
  life: [1, 1.4],
  speed: [6.5, 7.5],
  size: [0.14, 0.2],
  sizeEnd: 0.08,
  // Not the usual fade to 0, which would leave the falling half of every arc too faint to show its colour.
  alpha: 1,
  alphaEnd: 0.45,
  // The palette's warmest and coolest, so the turn from birth to death shows on both themes.
  color: BRAND.orange,
  colorEnd: BRAND.purple,
  gravity: 9.8,
  drag: 0.5,
  // A seeded stream, so every run sprays the same sparks.
  createRandom: () => seededRandom('fountain'),
  // Stepped from app.ticker below, so each frame's new sparks are in that frame's render.
  autoUpdate: false,
  position: tube.nozzle,
  parent: view3d.root,
};

const sparks = new ParticleSystem3D(sparkOptions);

for (let i = 0; i < PREWARM_STEPS; i++) sparks.update();

const visuals = createVisuals({
  app,
  view3d,
  stage,
  sparks,
  tube,
  sparkOptions,
});

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.2, 10.5);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.7, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 20,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

const pane = new ThemePane({ title: 'Particle system', stage });
const emitter = { shape: 'ConeShape' };
// The gravity getter returns a vector, so the pane sets the bare number, a pull straight down.
const pull = { gravity: sparkOptions.gravity };

pane.addBinding(sparks, 'emitRate', { min: 0, max: 800, step: 1 });

pane
  .addBinding(emitter, 'shape', {
    options: {
      PointShape: 'PointShape',
      ConeShape: 'ConeShape',
      SphereShape: 'SphereShape',
      BoxShape: 'BoxShape',
    },
  })
  .on('change', ({ value }) => setShape(value));
pane
  .addBinding(pull, 'gravity', { min: 0, max: 15, step: 0.1 })
  .on('change', ({ value }) => {
    sparks.gravity = value;
  });
pane.addBinding(sparks, 'drag', { min: 0, max: 3, step: 0.05 });

// A portrait screen is narrower than the spray and its paths, so the camera and the fog back off until they fit.
// The fountain then centres in the band under the pane, measured now the pane has its rows.
fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: FIT_ASPECT,
  clearTop: pane.element.getBoundingClientRect().bottom,
});

/**
 * Swaps the emitter's shape. A shape is centred on the system's position, so the sphere rises by its radius to sit on
 * the tube, and the box, wider than the tube, rises by its height to clear the tube's top.
 */
function setShape(name) {
  const shape = shapes[name];

  sparks.shape = shape;
  sparks.position.y = tube.nozzle.y;
  if (shape instanceof SphereShape) sparks.position.y += shape.radius;
  if (shape instanceof BoxShape) sparks.position.y += shape.height;
}

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
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
