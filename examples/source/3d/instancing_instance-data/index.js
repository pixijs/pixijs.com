/**
 * Per-instance data: every slot of a `BatchedMesh3D` carries numbers of its own that a shader bit reads, so 18,840
 * cubes ripple while the CPU writes one number a frame
 *
 * The batch declares its fields once with `instanceData`, a `vec4` each. Writing a new pattern or colours fills one
 * field in every row of `field.instanceData` and uploads it with one `update()`. `waveBit` names the same fields under
 * `bindings.instance` and reads them on the GPU as `instance.wave` and `instance.tint`. Every slot's matrix is set
 * once with `setMatrixAt`; the motion is one material value the ticker advances, which the bit meets on the GPU with
 * each slot's row. On the front row, a ghost marks where one slot's matrix holds it and an arrow its lift.
 *
 * Controls: drag to orbit; the pane sets the wave's speed and rewrites every row with a new pattern or colours.
 * URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import {
  BatchedMesh3D,
  Matrix4,
  RenderPassBit,
  Vector3,
  View3D,
} from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { clayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { clayGeometry } from './theme/shapes';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import {
  CUBE_SCALE,
  RAMP_LINEAR,
  RAMP_SIZE,
  rampOffset,
  SLOT_COUNT,
  slotPosition,
  WAVE_PATTERNS,
  waveHeight,
} from './scene';

import { createVisuals } from './visuals';
import { waveBit } from './waveBit';

const TITLE = 'Per-instance data';
/**
 * The narrowest view, width over height, that shows enough of the front rows round the probe to read as a field. A
 * narrower view backs off, which raises the probe and bares floor under it, so this is as low as still reads
 */
const FIT_ASPECT = 0.5;
/** Where the wave starts: the probe on a crest, so the first frame shows its whole lift */
const START_PHASE = 1.81;

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

// At the screen's size from the start, so the first frame's labels are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// The fog closes well before the field's back row, so the field never shows an edge, and before the far rows shrink
// to a speckle that shimmers as the wave runs.
const stage = new ThemeStage(view3d, { theme, fog: { near: 14, far: 28 } });

// The shadow pass doesn't run material bits, so a cast shadow would stay at the rest pose under the moving wave: the
// key casts none, and the field draws in the opaque pass only.
stage.key.castShadow = false;
app.stage.addChild(view3d);

// What the pane sets, and the phase the ticker advances.
const motion = {
  phase: START_PHASE,
  speed: 2.4,
  pattern: 'ripple',
};
const colors = { count: 4 };

// White clay, so each slot's tint is its colour. `extraBits` is an option every engine material takes
// (`new Material3D({ extraBits })`): the bit joins the material's shader and adds `wavePhase` to its data.
const waveMaterial = clayMaterial('white', { extraBits: [waveBit] });

// Every field is a `vec4` with the value each slot starts with: `wave` uses two lanes, `tint` three. The GPU culls
// each slot by where its matrix puts it, not where the bit lifts it; the lift is vertical and small, so a cube at the
// frame's edge loses a sliver at most, and on a phone, which sees a narrow strip of the field, the cull cuts the
// frame's GPU time by a third or more.
const field = new BatchedMesh3D({
  size: SLOT_COUNT,
  cull: 'gpu',
  instanceData: {
    wave: { value: [0, 0, 0, 0], type: 'vec4<f32>' },
    tint: { value: [1, 1, 1, 1], type: 'vec4<f32>' },
  },
  parent: view3d.root,
});
const cube = clayGeometry('cube', 'low');
const matrix = new Matrix4().makeScale(CUBE_SCALE, CUBE_SCALE, CUBE_SCALE);
const position = new Vector3();

// The only matrix writes: each slot stays where these put it, and the bit lifts it on the GPU.
for (let i = 0; i < SLOT_COUNT; i++) {
  field.setGeometryAt(i, cube);
  field.setMaterialAt(i, waveMaterial);
  field.setMatrixAt(i, matrix.setPosition(slotPosition(i, position)));
  field.setPassesAt(i, RenderPassBit.OPAQUE);
}

/**
 * Rewrites `wave` in every row, its phase offset and height, then uploads the rows once
 *
 * The rows sit in the batch's own store from `offset` on; the rows before it are unused. For a few scattered slots,
 * `field.setInstanceDataAt(i, 'wave', x, y, z, w)` writes one row.
 */
function writeWave(pattern) {
  const { data, stride, offset, fields } = field.instanceData;
  const phaseOffset = WAVE_PATTERNS[pattern];

  for (let i = 0; i < SLOT_COUNT; i++) {
    const { x, z } = slotPosition(i, position);
    const at = offset + i * stride + fields.wave;

    data[at] = phaseOffset(x, z);
    data[at + 1] = waveHeight(x, z);
  }
  field.instanceData.update();
}

/** Rewrites `tint` in every row with the slot's colour, in linear light; the fourth lane keeps its 1 */
function writeTints(count) {
  const { data, stride, offset, fields } = field.instanceData;

  for (let i = 0; i < SLOT_COUNT; i++) {
    const at = offset + i * stride + fields.tint;
    const rampStart = rampOffset(i, count);

    data[at] = RAMP_LINEAR[rampStart];
    data[at + 1] = RAMP_LINEAR[rampStart + 1];
    data[at + 2] = RAMP_LINEAR[rampStart + 2];
  }
  field.instanceData.update();
}

writeWave(motion.pattern);
writeTints(colors.count);

const visuals = createVisuals({ app, view3d, stage, field, motion });

view3d.camera.fov = 40;
// Close enough that the probe's cube, about 45 px across, shows its ghost and its lift.
view3d.camera.position.set(0, 4.5, 9.5);

// The fog hides the field's sides and back from every view these limits allow; closer or further round, they'd show.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.3, z: 0.1 },
  enableDamping: true,
  enablePan: false,
  minDistance: 10,
  maxDistance: 18,
  maxPolarAngle: Math.PI * 0.44,
  minAzimuthAngle: -Math.PI / 9,
  maxAzimuthAngle: Math.PI / 9,
});

// A portrait screen shows a narrow strip of the field, so the camera and the fog back off until it reads as one.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: TITLE, stage });

pane.addBinding(motion, 'speed', {
  label: 'Wave speed',
  min: 0,
  max: 8,
  step: 0.1,
});
// A new pattern or colour count rewrites one field in every row; the speed only changes the number the ticker adds.
pane
  .addBinding(motion, 'pattern', {
    label: 'Pattern',
    options: { ripple: 'ripple', diagonal: 'diagonal', spiral: 'spiral' },
  })
  .on('change', ({ value }) => writeWave(value));
pane
  .addBinding(colors, 'count', {
    label: 'Colours',
    min: 1,
    max: RAMP_SIZE,
    step: 1,
  })
  .on('change', ({ value }) => writeTints(value));

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  motion.phase = (motion.phase + motion.speed * dt) % (Math.PI * 2);
  // The one write a frame: every slot's lift comes from this number and its own row.
  waveMaterial.data.wavePhase = motion.phase;
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
waveMaterial.data.wavePhase = motion.phase;
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
