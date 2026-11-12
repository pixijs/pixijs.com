/**
 * A glTF model's clips played with AnimationPlayer: one at a time or blended, looped or once, at any speed, or
 * frozen at a time
 *
 * A model loaded with animations comes with `model.player`, which keeps one `AnimationState` per clip: whether it
 * plays, and its `time`, `animationSpeed`, `loop` and `weight`. Two states playing at once blend by their weights,
 * which is how the walk fades into the run and how every clip switch crossfades. Each state's `onLoop` runs when it
 * wraps round, and `onComplete` when a clip played once reaches its end. The fox opens trotting, half walk and half
 * run, with a see-through fox either side (`visuals.ts`) playing the walk and the run alone, as solid as its weight.
 *
 * Controls: drag to orbit; the pane picks the clip, the walk-run blend, whether blended cycles keep in step, the
 * speed (below 0 plays backwards), looping and a time to stop at, stops, plays or replays, and counts each `onLoop`
 * and `onComplete` call. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Model3D, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { model } from './manifest';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { CLIP_LABELS } from './clips';

import { createControls } from './controls';
import { createVisuals } from './visuals';

/** Fox.glb is 155 units nose to tail; this makes the fox 2.8 m long */
const FOX_SCALE = 0.018;
/** Side-on to the camera, head to the right, where a gait reads */
const FOX_YAW = Math.PI / 3;
/** Seconds a clip switch crossfades over */
const FADE = 0.3;
/** The narrowest view, width over height, that shows the fox whole from the landscape distance */
const FIT_ASPECT = 0.73;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Playing clips' });
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
const stage = new ThemeStage(view3d, { theme, spotlight: true });
const source = await loading.load(() => Assets.load(model('gltf.Fox')));

app.stage.addChild(view3d);

// A file with animations builds a player; autoUpdate: false leaves it to the frame loop below to advance it.
const fox = new Model3D({
  source,
  autoUpdate: false,
  scale: FOX_SCALE,
  rotation: { x: 0, y: FOX_YAW, z: 0 },
  parent: view3d.root,
});

if (!fox.player) throw new Error('Fox.glb has no clips');

const player = fox.player;
// Each clip has one AnimationState per player, made on first ask and kept: whether it plays, and its time, speed,
// loop and weight. The walk and the run are one stride each, 0.71 s and 1.16 s.
const walk = player.getState('Walk');
const run = player.getState('Run');
const survey = player.getState('Survey');
const mix = { clip: 'Walk + Run', blend: 0.5, speed: 1, inStep: true };
const calls = { onLoop: 0, onComplete: 0 };

/** The picked clip's first state, whose loop, time and callbacks the pane shows */
const lead = () => player.getState(CLIP_LABELS[mix.clip][0]);
/** Where a clip starts: its first pose, or its last when a negative animationSpeed plays it backwards */
const startOf = (state) => (mix.speed < 0 ? state.animation.duration : 0);

/** Plays the clip's states; updateWeights then eases them into the mix, which is the crossfade */
function crossfadeTo(clip) {
  mix.clip = clip;
  calls.onLoop = calls.onComplete = 0;
  for (const label of CLIP_LABELS[clip]) {
    const state = player.getState(label);
    const partner = state === walk ? run : walk;
    const joining = clip === 'Walk + Run' && partner.playing;

    if (state.playing) continue;
    // A state joining its playing partner starts at the same place in its own cycle.
    state.time = joining
      ? (partner.time / partner.animation.duration) * state.animation.duration
      : startOf(state);
    // play() resumes from the state's time, and the states already playing carry on and blend with it.
    player.play(label);
  }
}

/**
 * Eases every weight towards its share of the clip over FADE seconds. Weights are relative, so 0.5 and 0.5 mix the
 * same as 1 and 1, and a state at 0 still advances and fires its callbacks but writes nothing to the pose.
 */
function updateWeights(dt) {
  const step = dt / FADE;

  // While stopped, the weights hold too, like each state's time and pose.
  if (!player.playing) return;
  for (const label of player.animationLabels) {
    const state = player.getState(label);
    const inClip = CLIP_LABELS[mix.clip].includes(label);
    const blend = label === 'Run' ? mix.blend : 1 - mix.blend;
    const share = inClip ? (mix.clip === 'Walk + Run' ? blend : 1) : 0;

    state.weight = Math.min(
      Math.max(share, state.weight - step),
      state.weight + step,
    );
    // A state that faded out of the clip stops rather than run on unseen.
    if (state.weight === 0 && !inClip) state.stop();
  }
}

/** Blended cycles must take the same time or the legs land out of step, so the walk slows and the run speeds up */
function keepInStep() {
  const total = walk.weight + run.weight;
  const blending = mix.clip === 'Walk + Run' || (walk.playing && run.playing);

  // The Speed row reaches every state here; a negative animationSpeed plays a clip backwards.
  walk.animationSpeed = run.animationSpeed = survey.animationSpeed = mix.speed;
  if (!mix.inStep || !blending || total === 0) return;

  const cycle =
    (walk.weight * walk.animation.duration +
      run.weight * run.animation.duration) /
    total;

  walk.animationSpeed = (mix.speed * walk.animation.duration) / cycle;
  run.animationSpeed = (mix.speed * run.animation.duration) / cycle;
}

function setLoop(on) {
  walk.loop = run.loop = survey.loop = on;
}

function setInStep(on) {
  mix.inStep = on;
  // Equal cycle lengths hold two clips in step but can't bring them back, so the run rejoins the walk's place.
  if (on && walk.playing && run.playing)
    run.time = (walk.time / walk.animation.duration) * run.animation.duration;
}

/** Stops everything and shows `state` at `time`: gotoAndStop poses with that state alone, unblended */
function scrubTo(state, time) {
  // The pose is the clip's alone, so a crossfade still under way ends first, for weights that say so.
  updateWeights(FADE);
  player.stop();
  state.gotoAndStop(time);
}

/** Plays the picked clip's states from where they stopped, or from their start when `replay` */
function playClip(replay) {
  for (const label of CLIP_LABELS[mix.clip]) {
    const state = player.getState(label);

    // play() on a one-shot that ran out completes again at once, so a replay goes back to its start first.
    if (replay) state.gotoAndPlay(startOf(state));
    else state.play();
  }
}

const visuals = createVisuals({ app, view3d, stage, fox, player, mix });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.5, 7.7);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.7, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 4.5,
  maxDistance: 14,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the fox, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Playing clips', stage });
const actions = {
  crossfadeTo,
  setLoop,
  setInStep,
  scrubTo,
  playClip,
  stop: () => player.stop(),
};
const controls = createControls({ pane, mix, calls, player, lead, actions });

for (const state of [walk, run, survey]) {
  // onLoop runs each time a looping state wraps round its end.
  state.onLoop = () => {
    if (state === lead()) calls.onLoop += 1;
  };
  // With loop off a clip plays once and stops on its last pose, then runs onComplete: the moment to offer a replay.
  state.onComplete = () => {
    if (state !== lead()) return;
    calls.onComplete += 1;
    controls.offerReplay();
  };
}

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  updateWeights(dt);
  keepInStep();
  // Advances every playing state by the ticker's time, blends their poses, then runs any onLoop and onComplete.
  player.update(ticker);
  controls.update();
  visuals.update();
});

// The fox opens halfway through a stride of the blend, and one whole fade step puts the weights there at once.
crossfadeTo('Walk + Run');
walk.time = walk.animation.duration / 2;
run.time = run.animation.duration / 2;
updateWeights(FADE);
keepInStep();
player.update();

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
controls.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
