/**
 * Particles you drive yourself: a `ParticleContainer3D` is a fixed pool of particles drawn in one call, and your own
 * code says where each one is every frame
 *
 * This one draws a point cloud sampled from the PixiJS logo, moved by a small simulation of springs and noise: each
 * frame writes every particle with `writePacked` and sends them with one `upload()`. The pool's `capacity` is fixed,
 * and the one draw covers every slot, used or not, so `RenderGraphDebugger` counts one draw call at any count.
 * `ParticleSystem3D` from `@pixi/3d/extras` builds on this class and runs a standard simulation for you.
 *
 * Controls: drag to orbit, scroll in to see the dots up close; the pane sets how many slots are written, how hard the
 * noise pushes, and each particle's size, and reads back the particles' draw calls. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { packParticleColor, ParticleContainer3D, View3D } from '@pixi/3d';
import { OrbitCamera, RenderGraphDebugger } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { pointTexture } from './theme/particles';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { loadLogoPoints } from './scene';
import { createCloudSimulation } from './simulation';

/** The pool's size, fixed for the container's life: an empty slot still costs four vertices, so it's the peak count */
const CAPACITY = 8000;
/** Seconds the simulation runs before the first frame, so it opens with the gust crossing the logo's right half */
const WARM_UP = 4.7;
/** The logo's centre: its lowest dots float about a unit over the floor, so the cloud reads as hanging in the air */
const CLOUD_Y = 1.7;
/**
 * How far the cloud sways about y, in radians: enough to show its depth, where any more slides the walls inside the x's
 * cut into view and fills it in. And how fast: a 16 s turn, slow beside the gust's 7 s, so the two read apart.
 */
const SWAY = 0.08;
const SWAY_SPEED = 0.4;
/** The narrowest view, width over height, that shows the logo whole from the landscape distance */
const FIT_ASPECT = 0.9;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Particle container' });
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

// Particles never cast shadows and nothing else here does, so the key light needn't render a shadow map.
stage.key.castShadow = false;
app.stage.addChild(view3d);

// The point cloud: CAPACITY points spread evenly over the logo's surface, in random order, so any first `count` of
// them still covers the whole logo.
const points = await loading.load(() => loadLogoPoints(CAPACITY));

// Your own simulation, in plain arrays: the container never sees it, only the numbers written from it.
const cloud = createCloudSimulation(points);
const { x, y, z } = cloud;

// `'local'` keeps the points in the container's own space, the logo's, so moving or turning it moves them all at no
// cost per particle. The texture makes each quad a round dot; without one every particle is a white square.
const particles = new ParticleContainer3D({
  capacity: CAPACITY,
  texture: pointTexture(),
  space: 'local',
  position: { x: 0, y: CLOUD_Y, z: 0 },
  parent: view3d.root,
});

// One colour for every particle, packed once out here rather than per particle per frame.
const tint = packParticleColor(BRAND.pink, 1);

// What the pane sets: how many slots the loop writes, how hard the flow pushes, and each dot's diameter in world
// units, so dots shrink with distance like the rest of the scene.
const settings = { count: 4000, noise: 0.35, size: 0.04 };
let time = 0;

function animate(dt) {
  time += dt;
  // A slow turn of the whole container, so the cloud's depth shows: one transform moves all the points.
  particles.rotation.y = Math.sin(time * SWAY_SPEED) * SWAY;

  for (let i = 0; i < settings.count; i++) {
    cloud.move(i, dt, time, settings.noise);
    // setParticleAt(i, x, y, z, size, rotation, color, alpha) writes the same, but packs its colour on every call.
    particles.writePacked(i, x[i], y[i], z[i], settings.size, 0, tint);
  }

  // Once a frame, after every write: it sends one range covering them all.
  particles.upload();
}

while (time < WARM_UP) animate(1 / 60);

view3d.camera.fov = 40;
view3d.camera.position.set(0, CLOUD_Y + 0.85, 7.1);

// Close enough to see each dot is a flat round sprite facing the camera, and never below the target, the logo's
// centre, so the camera stays above the floor.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: CLOUD_Y, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 3,
  maxDistance: 14,
  maxPolarAngle: Math.PI / 2,
});

// A portrait screen is narrower than the logo, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Particle container', stage });
const countRow = pane.addBinding(settings, 'count', {
  min: 0,
  max: CAPACITY,
  step: 200,
});

// A slot keeps its last write until something overwrites it, so after a lower count the slots past it would keep
// drawing. clear() sets every slot's size to 0, and the next frame writes the first `count` again, which is right
// for a higher count too.
countRow.on('change', () => particles.clear());
pane.addBinding(settings, 'noise', { min: 0, max: 1, step: 0.05 });
pane.addBinding(settings, 'size', { min: 0.01, max: 0.15, step: 0.01 });

// The draws the last frame made for the particles, read back from the renderer. A capture allocates, so the pane
// polls it twice a second rather than every frame.
const debug = new RenderGraphDebugger({ view: view3d });
const readout = {
  get drawCalls() {
    const passes =
      debug.capture()?.batches.flatMap((batch) => batch.passes) ?? [];

    return passes
      .flatMap((pass) => pass.draws)
      .filter((draw) => draw.sourceMeshIds.includes(particles.uid)).length;
  },
};
const drawCallsRow = pane.addBinding(readout, 'drawCalls', {
  label: 'draw calls',
  readonly: true,
  interval: 500,
  format: (count) => count.toFixed(0),
});

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  animate(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it. A capture needs a
// rendered frame, so the draw count reads that one straight away.
orbit.update();
app.render();
drawCallsRow.refresh();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
