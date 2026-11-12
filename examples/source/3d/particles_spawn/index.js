/**
 * Bursts on demand: `spawn()` at a tap, and a seeded burst timeline that stops, clears, replays and scrubs
 *
 * The show is three pops on the system's burst timeline, repeating. `spawn(count, { position })` emits a batch right
 * now, wherever you say, playing or not, and draws from the same random stream as the pops. `createRandom: () =>
 * seededRandom('stream')` restarts that stream on every seek, so the run after `gotoAndPlay(0)` flies the first run's
 * sparks again: the ink paths trace where some of them flew, and each ring is where the seed puts one of them now. A
 * repeat carries the stream on, so it flies new paths. `stop()` ends the pops and lets the air clear; `clear()`
 * empties the air and the pops carry on. A spark is its birth record plus the clock, so assigning `time` shows any
 * moment exactly.
 *
 * Controls: tap the floor to burst; drag to orbit; the pane sets the burst's size, runs each call, shows `playing`
 * and scrubs the clock up to 3 s back, which stops the show until Play. Replay: the first show flies back into its
 * rings. Rewind, tap, then Play: the tap moves the stream, so the pops leave their rings. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { seededRandom, View3D } from '@pixi/3d';
import { ConeShape, OrbitCamera, ParticleSystem3D } from '@pixi/3d/extras';

import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, CLAY, THEMES, themeFromUrl } from './theme/palette';
import { sparkTexture } from './theme/particles';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';

import { createLauncher, onFloorTap } from './scene';
import { createVisuals } from './visuals';

/** Seconds between shows: the last pop's sparks die just as the next show's first pop fires */
const REPEAT = 2.4;
/** The show: three pops, repeating, so there are always sparks in the air to stop, clear and scrub */
const SHOW = [
  { time: 0.2, count: 48, repeatEvery: REPEAT },
  { time: 0.8, count: 48, repeatEvery: REPEAT },
  { time: 1.4, count: 80, repeatEvery: REPEAT },
];
/** Each tap's sparks take the next of these, so a batch never reads as part of the pink show */
const TAP_COLORS = [CLAY.sky, CLAY.orange, CLAY.purple];
/** The narrowest view, width over height, that shows the show and its paths whole from the landscape distance */
const FIT_ASPECT = 0.8;
/** Px a portrait screen keeps clear at the top, so the pane opened over the show leaves its label in view */
const PANE_CLEAR = 120;
/** Frames of 1/60 s run before the first frame, so the page opens on the first show's last pop at its peak */
const WARM_UP_FRAMES = 117;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Bursts on demand' });
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

// At the screen's size from the start, so the first frame's label lands over the paths.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });

app.stage.addChild(view3d);

const launchPoint = createLauncher(view3d.root);
const sparks = new ParticleSystem3D({
  texture: sparkTexture(),
  // No steady stream: every spark comes from the show's bursts or a spawn.
  emitRate: 0,
  bursts: SHOW,
  shape: new ConeShape({ angle: 20 }),
  speed: [6, 7.5],
  // Short enough that the slowest spark dies just above the floor.
  life: [0.95, 1.1],
  size: [0.11, 0.17],
  sizeEnd: 0.05,
  // Not a fade to 0, which would leave the top of every arc too faint to read over the light floor.
  alphaEnd: 0.2,
  color: BRAND.hotPink,
  gravity: 9.8,
  drag: 0.5,
  // Called again on every seek, so each one starts the same stream and the show flies the same sparks. Any string
  // seeds it: with this one, no traced path flies straight at the opening camera and across the launcher.
  createRandom: () => seededRandom('stream'),
  // Stepped from app.ticker, so new sparks draw that frame and the lesson can hold the clock to scrub it.
  autoUpdate: false,
  position: launchPoint,
  parent: view3d.root,
});

/** The burst a tap makes: the pane sets its count */
const tap = { count: 40 };
let taps = 0;

const calls = {
  // Ends emission and freezes the burst timeline; the sparks in the air finish their arcs.
  stop: () => sparks.stop(),
  // Carries the timeline on from where stop() froze it.
  play: () => sparks.play(),
  // Kills every spark at once; the timeline carries on.
  clear: () => sparks.clear(),
  // A seek moves the burst timeline, not `time`, and restarts the seeded stream: the first show flies its paths again.
  replay: () => sparks.gotoAndPlay(0),
  // The same seek, then waits for play(); `time` runs on, so the sparks in the air finish.
  rewind: () => sparks.gotoAndStop(0),
};

/** The clock's offset from live while scrubbed, in seconds: negative is back in time, 0 is live */
const scrub = { seconds: 0 };
let liveTime = 0;

/**
 * Shows the sparks `seconds` from the live clock, so -1.3 is 1.3 s ago. Each spark is drawn from its birth record and
 * the clock, so this shows that moment exactly, and nothing is resimulated. Holding the clock stops the show, so
 * `playing` reads false until Play.
 */
function scrubTo(seconds) {
  scrub.seconds = seconds;
  if (seconds !== 0) sparks.stop();
  sparks.time = liveTime + seconds;
}

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3, 9);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.3, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the show, so the camera and the fog back off until it fits, below the pane.
fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: FIT_ASPECT,
  clearTop: PANE_CLEAR,
});

const visuals = createVisuals({
  app,
  view3d,
  stage,
  sparks,
  bursts: SHOW,
  fitAspect: FIT_ASPECT,
});

/** Makes a call; a seek or a clear leaves nothing in the scene for the visuals to read, so they're told */
function press(call) {
  calls[call]();
  if (call === 'replay' || call === 'rewind') visuals.newRun();
  if (call === 'clear') visuals.cleared();
}

const pane = new ThemePane({ title: 'Bursts on demand', stage });
const controls = createControls({ pane, sparks, tap, scrub, press, scrubTo });

// A tap spawns a burst where the pick's ray hit the floor, playing or not; `position` stands in for the emitter, so the
// cone still points up. It draws from the system's random stream, so it moves every pop after it.
onFloorTap(stage.floor, (point) => {
  controls.backToLive();
  sparks.spawn(tap.count, {
    position: point,
    color: TAP_COLORS[taps++ % TAP_COLORS.length],
  });
});

/** One frame of the lesson: the sparks, unless the scrub holds the clock */
function advance(ticker) {
  if (scrub.seconds === 0) {
    // With no ticker, update() steps one 60 fps frame, which the warm-up uses.
    sparks.update(ticker);
    liveTime = sparks.time;
  }
  visuals.update();
}

app.ticker.add((ticker) => {
  stage.update(Math.min(ticker.deltaMS / 1000, 1 / 15));
  advance(ticker);
});

for (let i = 0; i < WARM_UP_FRAMES; i++) advance();

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
