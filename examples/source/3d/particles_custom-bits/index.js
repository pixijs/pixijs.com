/**
 * A particle shader bit: motion of your own for a `ParticleSystem3D`, worked out in the vertex shader
 *
 * `swirlBit` is a plain `ShaderBit` object, plugged in with `extraBits`. Its `attributes` give every spark a value of
 * its own, written once by `spawn()`, and its `bindings.material` fields become `sparks.uniforms`, which the whole
 * system shares. The CPU writes a spark once, when it's born; every frame after that the vertex shader works out
 * where it is from that record and the clock. So the swirl costs the CPU nothing, and one uniform write moves every
 * live spark at once, the ones already in the air included.
 *
 * Controls: drag to orbit; the pane sets the bit's two uniforms. `uSwirlSpeed` winds the three arms, and at 0 they
 * stand as straight rays; `uSwirlRadius` sets how far out they swing, and at 0 the sparks rise straight up, as they
 * would without the bit. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { seededRandom, View3D } from '@pixi/3d';
import { ConeShape, OrbitCamera, ParticleSystem3D } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { sparkTexture } from './theme/particles';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createLaunchPad, PAD_TOP } from './scene';
import { swirlBit } from './swirlBit';

const TITLE = 'Custom particle behaviour';
/** Sparks born a second: with a 6 s life, about 450 in the air at once */
const SPARKS_PER_SECOND = 75;
/** A spark's life in seconds; at `SWIRL_SPEED` it winds 8.4 rad, about one and a third turns */
const LIFE = 6;
/** How fast a spark climbs on average, in units a second: 3 units over a life */
const RISE = 0.5;
/** The pool's slots: at 75 a second they come round every 6.4 s, just past a life, so no live spark is overwritten */
const CAPACITY = 480;
/** The bit's uniforms at the start: radians a second about the axis, and how far out a spark has swung when it dies */
const SWIRL_SPEED = 1.4;
const SWIRL_RADIUS = 1.3;
/** The narrowest view, width over height, that shows the swirl whole from the landscape distance */
const FIT_ASPECT = 0.56;
/** The band a phone's folded pane covers along the top of the screen, in px */
const PANE_BAR = 48;

// Each arm is one set of spawn values: its own aSwirlPhase, a third of a turn apart, and its own colour.
const ARMS = [BRAND.sky, BRAND.pink, BRAND.purple].map((color, i, colors) => ({
  aSwirlPhase: (i / colors.length) * Math.PI * 2,
  color,
}));

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

app.stage.addChild(view3d);
createLaunchPad(view3d.root);

// What onUpdate carries from one step to the next: the part of a spark owed so far, and the arm the next one joins.
let sparksOwed = 0;
let nextArm = 0;

const sparks = new ParticleSystem3D({
  texture: sparkTexture(),
  capacity: CAPACITY,
  // Local space, so the bit's `position` is relative to the emitter and the swirl turns about its own y axis.
  space: 'local',
  // A 2° cone from a 0.03 disc: the launch spread stays small, so each arm stays a thin line.
  shape: new ConeShape({ angle: 2, radius: 0.03 }),
  life: LIFE,
  // Each spark a touch faster or slower than the next, so an arm has some width.
  speed: [RISE * 0.98, RISE * 1.02],
  size: [0.1, 0.14],
  // Still half opaque when a spark dies, so the arms read to the top on the light theme.
  alphaEnd: 0.5,
  // A seeded stream, so every run launches the same sparks.
  createRandom: () => seededRandom('swirl'),
  extraBits: [swirlBit],
  // Steady emission writes 0 into a bit's own attribute, so the sparks are born here, through spawn(), which takes a
  // value for it. onUpdate runs inside the step, so a spark uploads in the frame it's born.
  emitRate: 0,
  onUpdate: (dt, system) => {
    sparksOwed += SPARKS_PER_SECOND * dt;
    while (sparksOwed >= 1) {
      system.spawn(1, ARMS[nextArm]);
      nextArm = (nextArm + 1) % ARMS.length;
      sparksOwed--;
    }
  },
  // Stepped from app.ticker below, so a spark born this frame draws this frame.
  autoUpdate: false,
  position: { x: 0, y: PAD_TOP, z: 0 },
  parent: view3d.root,
});

sparks.uniforms.uSwirlSpeed = SWIRL_SPEED;
sparks.uniforms.uSwirlRadius = SWIRL_RADIUS;

// A life of sparks before the first frame, so the swirl is whole when the page opens. With no ticker, update() steps
// 1/60 s.
for (let i = 0; i < LIFE * 60; i++) sparks.update();

view3d.camera.fov = 40;
// 15° round from straight in front, where two arms would line up on screen as one ray when uSwirlSpeed is 0.
view3d.camera.position.set(1.97, 1.97, 7.34);

const orbit = new OrbitCamera({
  view: view3d,
  // Halfway up the swirl, from the pad to where the sparks die.
  target: { x: 0, y: 1.6, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 4.5,
  maxDistance: 14,
  // Low enough to look down into the spiral, never under the floor.
  maxPolarAngle: Math.PI * 0.49,
});

// A portrait screen is narrower than the swirl, so the camera and the fog back off until it fits under the pane.
fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: FIT_ASPECT,
  clearTop: PANE_BAR,
});

const pane = new ThemePane({ title: TITLE, stage });

// Assigning a uniform queues its upload, so the pane binds straight to it, and every live spark re-winds in the same
// frame. Rounding before formatting keeps a typed 0 from showing as -0.00.
pane.addBinding(sparks.uniforms, 'uSwirlSpeed', {
  min: -3,
  max: 3,
  step: 0.01,
  format: (speed) => (Math.round(speed * 100) / 100).toFixed(2),
});
pane.addBinding(sparks.uniforms, 'uSwirlRadius', {
  min: 0,
  max: 1.8,
  step: 0.01,
});

app.ticker.add((ticker) => {
  stage.update(Math.min(ticker.deltaMS / 1000, 1 / 15));
  sparks.update(ticker);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
