/**
 * Driving a character's bones from code: the fox's head turns to a target over its clip, and its tail follows a
 * container
 *
 * A loaded model's bones aren't scene nodes. `fox.skeletons[0]` keeps them as numbered slots in flat arrays, found by
 * name with `skeleton.indexOf`. The clip rewrites every bone it drives on each `player.update`, so the code turns the
 * head after it, blends that with the clip's pose by a follow strength, and sets `skeleton.dirty` so the view rebuilds
 * the pose. `skeleton.bindContainerBone` hands the tail's first bone to a plain `Container3D`, which it copies when the
 * view draws, while the clip still moves the bones below it.
 *
 * Controls: the target the fox looks at follows the mouse over the scene, so it slides to a corner of its box as the
 * mouse heads for the pane; on a phone, tap to place it. Drag to orbit. The pane sets the follow strength and turns
 * the tail's container. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 *
 * Fox by PixelMannen (CC0), rigging and animation by tomkranis (CC BY 4.0), glTF conversion by AsoboStudio and scurest
 * (CC BY 4.0).
 */

import { Container3D, Model3D, Quaternion, Vector3, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { model } from './manifest';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { ALONG_BONE, TAIL_LIFT_AXIS, aimRotation } from './bones';
import { createTarget, matteFur } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the fox and its target whole from the landscape distance */
const FIT_ASPECT = 1.35;
/** Fox.glb is modelled in centimetres; this makes the fox 2.5 long */
const FOX_SCALE = 0.016;
/** Three quarters on to the camera, facing screen left */
const FOX_YAW = -0.65;
/** How fast, per second, the aim catches up with the target, so the head glides rather than snaps */
const CATCH_UP_RATE = 8;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Driving bones' });
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

// At the screen's size from the start, so the first frame's labels are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });
const source = await loading.load(() => Assets.load(model('gltf.Fox')));

app.stage.addChild(view3d);
matteFur(source);

// The player runs from this file's ticker, so the head can be turned after the clip has posed it. scene.ts's
// LOOK_CENTRE sits in front of the face this placement gives: move the fox and move it too.
const fox = new Model3D({
  source,
  autoUpdate: false,
  autoPlay: 'Survey',
  scale: FOX_SCALE,
  position: { x: 0.3, y: 0, z: 0 },
  rotation: { x: 0, y: FOX_YAW, z: 0 },
  parent: view3d.root,
});

if (!fox.player) throw new Error('Fox.glb has no clips');

const player = fox.player;
const skeleton = fox.skeletons[0];
// The skeleton numbers its own nodes, not in the file's order, so ask by name.
const head = skeleton.indexOf('b_Head_05');
const tailBone = skeleton.indexOf('b_Tail01_012');
// What the pane sets: how far the head turns from the clip's pose onto the aim (0 to 1), and how far the tail's
// container turns up from its rest pose (radians).
const settings = { follow: 1, lift: 0.6 };

// The bone copies the container's whole local transform, so it starts at the bone's rest pose. The container isn't in
// the scene: only its numbers count.
const tail = new Container3D({ label: 'tail' });

tail.position.fromArray(skeleton.localPosition, tailBone * 3);
tail.quaternion.fromArray(skeleton.localRotation, tailBone * 4);
skeleton.bindContainerBone(tailBone, tail);

// A plain copy: a node's quaternion cloned keeps the node as its observer.
const tailRest = new Quaternion().copyFrom(tail.quaternion);
const liftTurn = new Quaternion();

/** Turns the tail's container up from its rest pose; the bone copies it when the view next draws */
function liftTail() {
  liftTurn.setFromAxisAngle(TAIL_LIFT_AXIS, settings.lift);
  tail.quaternion.copyFrom(tailRest).multiply(liftTurn);
}

liftTail();

// The point the pointer moves (scene.ts), and the one the head aims at, which eases after it so the head glides.
const target = createTarget({ app, view3d });
const aim = target.clone();

// Working values the frame loop writes, made once.
const aimInFox = new Vector3();
const clipHead = new Quaternion(); // the head as the clip posed it
const aimedHead = new Quaternion(); // the head turned fully onto the aim
const headRotation = new Quaternion(); // the blend of the two, which is written
const toTarget = new Vector3();

const visuals = createVisuals({
  app,
  view3d,
  stage,
  fox,
  head,
  tailBone,
  tail,
  tailRest,
  clipHead,
  aim,
  settings,
});

// Lower and closer than the kit's camera, three quarters on: the face, the legs and the lifted tail all show.
view3d.camera.fov = 40;
view3d.camera.position.set(0.8, 1.35, 3.9);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: -0.35, y: 0.72, z: 0.1 },
  enableDamping: true,
  enablePan: false,
  minDistance: 2.8,
  maxDistance: 8,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the fox and its target, so the camera and the fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Driving bones', stage });

pane.addBinding(settings, 'follow', {
  label: 'Follow',
  min: 0,
  max: 1,
  step: 0.01,
});
pane
  .addBinding(settings, 'lift', {
    label: 'Tail lift',
    min: 0,
    max: 1,
    step: 0.01,
  })
  .on('change', liftTail);

function update(ticker) {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  aim.addScaledVector(
    target.subtract(aim, toTarget),
    1 - Math.exp(-CATCH_UP_RATE * dt),
  );

  // The clip poses every bone it drives, the head included, so the head turns after it. The player reads the ticker's
  // own frame time, as autoUpdate would, so only the order of the writes changes. aimRotation works in the skeleton's
  // space, the space of the skinned mesh's parent, which for the fox is the model.
  player.update(ticker);
  clipHead.fromArray(skeleton.localRotation, head * 4);
  fox.toLocal(aim, undefined, aimInFox);
  aimRotation(skeleton, head, clipHead, ALONG_BONE, aimInFox, aimedHead);
  clipHead.slerp(aimedHead, settings.follow, headRotation);
  headRotation.toArray(skeleton.localRotation, head * 4);
  skeleton.dirty = true;

  visuals.update();
}

app.ticker.add(update);

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it. The ticker waits for
// app.start(), so one step by hand poses that frame; without it the fox would show its file's rest pose, then snap.
orbit.update();
update(app.ticker);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
