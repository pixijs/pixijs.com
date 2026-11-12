/**
 * A glTF file's morph targets, played by its clip and set by hand
 *
 * `Model3D` builds the file's morphed mesh as a `Mesh3D` whose `weights` array holds one weight per morph target, and
 * its `player` holds the file's clip, whose one track writes that array on every update. Stop the clip and the array
 * is yours to write. The big cube plays the clip; the row of small copies in front, models of the same source, holds
 * the base shape and each target at full weight.
 *
 * Controls: drag to orbit; the pane plays or stops the clip and sets each weight, which stops the clip. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Mesh3D, Model3D, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { model } from './manifest';
import { clayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createVisuals } from './visuals';

const TITLE = 'Morph targets from glTF';
/** Khronos's AnimatedMorphCube, from the asset mirror */
const CUBE_URL = model('gltf.AnimatedMorphCube');
/** Where the clip starts: both targets are in the mix and target 0 still leads, so the first frame shows a blend */
const START_TIME = 2.2;
/** The cube floats over the copies' row, its shadow falling between them */
const CUBE_Y = 1.75;
/** A three-quarter view, since target 0 thins the cube along its depth, which a front view hides; and a sway about it */
const YAW = -0.75;
const SWAY = 0.2;
const SWAY_SPEED = 0.5;
/** The copies' weights: the file's cube, then each target alone */
const POSES = [
  [0, 0],
  [1, 0],
  [0, 1],
];
/** The copies' row on the floor in front of the cube */
const PREVIEW_SCALE = 0.3;
const PREVIEW_SPACING = 1.7;
const PREVIEW_Z = 2.7;
/** The narrowest view, width over height, that shows the row of copies whole, clear of the screen's edges */
const FIT_ASPECT = 0.9;

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
// The file holds one mesh with two morph targets, and one clip, 'Square', that animates their weights.
const source = await loading.load(() => Assets.load(CUBE_URL));

app.stage.addChild(view3d);

/** The file's morphed mesh, the node it names 'AnimatedMorphCube', and its weights, one per morph target */
function findMorph(model) {
  const mesh = model.getChildByLabel('AnimatedMorphCube', true);

  // Only a mesh whose geometry has morph targets has weights.
  if (!(mesh instanceof Mesh3D) || !mesh.weights)
    throw new Error('AnimatedMorphCube.glb has no morphed mesh');

  return { mesh, weights: mesh.weights };
}

// autoUpdate: false leaves the clip to the frame loop, so the weights it writes are in place before the pane's rows
// read them and the frame renders.
const cube = new Model3D({
  source,
  autoUpdate: false,
  position: { x: 0, y: CUBE_Y, z: 0 },
  rotation: { x: 0, y: YAW, z: 0 },
  parent: view3d.root,
});
const { mesh, weights } = findMorph(cube);

// The file's flat grey, re-skinned in the kit's clay.
mesh.material = clayMaterial('pink');

const { player } = cube;

if (!player) throw new Error('AnimatedMorphCube.glb has no clip');
// The clip holds one track, labelled '0.weights': node 0 in the file and its `weights`, which is how the player finds
// the mesh's array. Each key holds one value per target. gotoAndStop shows the pose 2.2 s in at once, so the first
// frame and the pane already show the blend; play() runs on from there.
const clip = player.getState('Square').gotoAndStop(START_TIME).play();

// Every Model3D built from one source shares its geometry, morph targets included, but holds its own weights. Write
// into the array, never replace it: a clip bound to it would keep writing the old one.
const previews = POSES.map((pose, i) => {
  // The file's cube is 2 units across, so a copy scaled by PREVIEW_SCALE stands on the floor at y = PREVIEW_SCALE.
  const model = new Model3D({
    source,
    position: { x: (i - 1) * PREVIEW_SPACING, y: PREVIEW_SCALE, z: PREVIEW_Z },
    rotation: { x: 0, y: YAW, z: 0 },
    scale: PREVIEW_SCALE,
    parent: view3d.root,
  });
  const copy = findMorph(model);

  copy.weights.set(pose);
  copy.mesh.material = clayMaterial('palePink');

  return { model, weights: copy.weights };
});
const models = [cube, ...previews.map((preview) => preview.model)];

const visuals = createVisuals({ app, view3d, stage, previews });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.2, 10);

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

// A portrait screen is narrower than the row of copies, so the camera and the fog back off.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: TITLE, stage });
// AnimationState.playing is a getter, so the row binds an object whose setter plays or stops the clip.
const playback = {
  get playing() {
    return clip.playing;
  },
  set playing(on) {
    if (on) clip.play();
    else clip.stop();
  },
};
const playRow = pane.addBinding(playback, 'playing', { label: 'Play clip' });
let syncing = false;

/** A playing clip writes every weight on each update, so a weight set by hand stops it first */
function takeOver() {
  clip.stop();
  playRow.refresh();
}

// One row per weight, bound to the mesh's own array. No `step`: a stepped row writes its rounded value back when it
// refreshes, a second writer of the array while the clip plays.
const weightRows = Array.from(weights, (_, i) =>
  pane
    .addBinding(weights, i, {
      label: `weights[${i}]`,
      min: 0,
      max: 1,
      format: (value) => value.toFixed(2),
    })
    .on('change', () => {
      // refresh() fires change too, and the clip's own writes mustn't stop it.
      if (!syncing) takeOver();
    }),
);

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  // While the clip plays, its track writes `weights` here; stopped, it leaves them as they are.
  player.update(ticker);
  // The cube and its copies turn together, so all four read as one object.
  for (const model of models)
    model.rotation.y = YAW + SWAY * Math.sin(time * SWAY_SPEED);
  if (clip.playing) {
    syncing = true;
    for (const row of weightRows) row.refresh();
    syncing = false;
  }
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
