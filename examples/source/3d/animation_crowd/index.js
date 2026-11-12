/**
 * A crowd of animated characters from one file, each with its own pose, player and place in its clip
 *
 * Every `Model3D` built from one `Scene3DSource` draws with the source's geometry, material and texture, so the whole
 * herd is one draw call, plus one in the shadow pass, however many foxes it holds. Each model's `skeletons[0]` shares
 * the file's joints and bind pose and holds a pose of its own, and `model.player` keeps one `AnimationState` per clip,
 * so each fox plays its own clip from its own `time` at its own `animationSpeed`. With `autoUpdate: false`, one loop
 * on the app's ticker advances every player, so the crowd runs on the app's clock.
 *
 * Controls: drag to orbit; the pane changes the crowd's size, its start times and the shared fur colour, the front
 * fox's clip and speed, and which skeletons show, and reads out the herd's draw calls. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, Model3D, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { model } from './manifest';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';

import { crowdSlot } from './scene';
import { createVisuals } from './visuals';

/** Fox.glb is modelled about 79 units tall; this stands a fox 1 tall */
const FOX_SCALE = 1 / 79;
/** Each fox's first clip, by index: mostly standing about, with walkers and a runner in every six */
const CLIPS = ['Walk', 'Survey', 'Survey', 'Walk', 'Survey', 'Run'];
/** Stepping by the golden ratio's fraction spreads the start times evenly for any count */
const SPREAD = 0.618034;
/** The narrowest view, width over height, that shows the herd whole from the landscape distance */
const FIT_ASPECT = 1.3;

/** One fox of the herd: its model, and the skeleton, player and playing clip's state the model owns */

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Crowd' });
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
// The fog starts past the third row, so the largest crowd fades at its far rows rather than its middle.
const stage = new ThemeStage(view3d, { theme, fog: { near: 14, far: 36 } });

app.stage.addChild(view3d);

// The file loads once; every fox is built from this one source.
const source = await loading.load(() => Assets.load(model('gltf.Fox')));
const fur = source.material.fox_material;

// Unlit materials load as FlatMaterial and the rest as Material3D, which is where roughness lives.
if (!(fur instanceof Material3D))
  throw new Error("Fox.glb's fox_material isn't a Material3D");
// Every fox draws with this one material, so one write reaches the whole herd. Fox.glb carries no normals, which the
// engine shades with one fixed normal, so fully rough fur can't flash pale as the camera turns.
fur.roughness = 1;

const foxes = [];
const settings = {
  crowdSize: 12,
  startTimes: 'scattered',
  clip: CLIPS[0],
  speed: 1,
  bones: 'every fox',
};

/** Where fox `i` starts in a clip `duration` long; the `+ 1` keeps fox 0 off 0, so the two modes differ for it too */
function startTime(i, duration) {
  return settings.startTimes === 'scattered'
    ? (((i + 1) * SPREAD) % 1) * duration
    : 0;
}

function addFox() {
  const i = foxes.length;
  // A model shares the source's geometry, material, texture and clips. What it owns is its pose, its player and a
  // state per clip. autoUpdate: false leaves the player to the frame loop below.
  const fox = new Model3D({
    source,
    autoUpdate: false,
    scale: FOX_SCALE,
    ...crowdSlot(i),
    parent: view3d.root,
  });
  // Every fox's skeleton shares the source's `parent`, `joints` and `inverseBindMatrices`; the pose is its own.
  const skeleton = fox.skeletons[0];

  if (!fox.player) throw new Error('Fox.glb has no clips');

  const state = fox.player.play(CLIPS[i % CLIPS.length]);

  state.time = startTime(i, state.animation.duration);
  foxes.push({ model: fox, skeleton, player: fox.player, state });
}

function setCrowdSize(count) {
  while (foxes.length < count) addFox();
  // The model destroys its own player and skeleton; the source the others draw with stays.
  while (foxes.length > count) foxes.pop()?.model.destroy({ children: true });
}

/** Puts every fox at its start time in the clip it's playing now */
function restartClips() {
  foxes.forEach(
    (fox, i) => (fox.state.time = startTime(i, fox.state.animation.duration)),
  );
}

/** Switches the front fox's clip. play() resumes from that state's held time, so it keeps its own place in each clip */
function playClip(label) {
  const front = foxes[0];

  front.player.stop();
  front.state = front.player.play(label);
  front.state.animationSpeed = settings.speed;
}

function setFrontSpeed(speed) {
  foxes[0].state.animationSpeed = speed;
}

setCrowdSize(settings.crowdSize);

view3d.camera.fov = 40;
view3d.camera.position.set(0, 4.6, 8.6);

// The target sits a fox's height above the middle of the first three rows, the 12 foxes the example opens with.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1, z: -1.9 },
  enableDamping: true,
  enablePan: false,
  minDistance: 5,
  maxDistance: 22,
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the herd, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const visuals = createVisuals({ app, view3d, stage, foxes, settings });
const pane = new ThemePane({ title: 'Crowd', stage });
const controls = createControls({
  pane,
  view3d,
  source,
  settings,
  fur,
  setCrowdSize,
  restartClips,
  playClip,
  setFrontSpeed,
});

app.ticker.add((ticker) => {
  stage.update(Math.min(ticker.deltaMS / 1000, 1 / 15));
  // One loop on the app's clock advances every player, each sampling its own clip at its own time into its skeleton.
  for (const fox of foxes) fox.player.update(ticker);
  controls.update();
  visuals.update();
});

// The players only move in the loop, so this poses the herd once; the first frame would show the file's rest pose.
for (const fox of foxes) fox.player.update();
orbit.update();
visuals.update();
app.render();
// The pane's draw counts read the frame drawn last, so this counts the first.
controls.update();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
