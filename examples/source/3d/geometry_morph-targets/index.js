/**
 * Morph targets: a geometry stores extra shapes as offsets for every vertex, and a mesh's weights blend them in
 *
 * `morphTargets` on a `Geometry3D` holds each target as an offset per vertex, in the order of `positions`, with offsets
 * for the normals beside them. `weights` on a `Mesh3D`, one number per target, adds each target's offsets scaled by
 * its weight: `positions + weights[0] × morphTargets[0] + weights[1] × morphTargets[1]`. The weights belong to the
 * mesh, so meshes that share one geometry each hold their own blend.
 *
 * Controls: drag to orbit; the pane sets each of the big blob's weights, and swaps in targets without normal offsets.
 * URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Geometry3D, Mesh3D, SphereGeometry, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { clayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { cubeShape, starShape } from './scene';

import { createVisuals } from './visuals';

const TITLE = 'Morph targets';
/** The narrowest view, width over height, that shows the blob and the preview row whole from the landscape distance */
const FIT_ASPECT = 0.9;
/** The blob's opening weights, one per target: both at work, so it opens as a blend neither preview shows */
const OPENING_WEIGHTS = [0.4, 0.6];
/** The previews' weights: the sphere, then each target alone */
const POSES = [
  [0, 0],
  [1, 0],
  [0, 1],
];
/** The meshes' sway about y, in radians and radians a second: enough to show the cube's side and the star's depth */
const SWAY = 0.35;
const SWAY_SPEED = 0.5;
/** Where the sway starts along its wave: turned about 0.26 rad, so the first frame shows the cube's side face */
const SWAY_PHASE = 2.31;

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
const stage = new ThemeStage(view3d, { theme });

app.stage.addChild(view3d);

// The base shape: a unit sphere's vertices. This geometry is only where the arrays come from and is never drawn.
// `quantizeNormals: false` keeps its normals as floats, three a vertex, the layout the normal offsets share.
const sphere = new SphereGeometry({
  radius: 1,
  widthSegments: 96,
  heightSegments: 60,
  quantizeNormals: false,
});
// The sphere builds both as floats; the getters are typed for any vertex format.
const positions = sphere.positions;
const normals = sphere.normals;

/**
 * A morph target stores offsets, not a shape: where each vertex goes minus where it starts on the sphere (`positions`),
 * in the same order, and the same for its normal (`normals`)
 */
function toOffsets(shape) {
  const offsets = {
    positions: new Float32Array(positions.length),
    normals: new Float32Array(normals.length),
  };

  for (let i = 0; i < positions.length; i++) {
    offsets.positions[i] = shape.positions[i] - positions[i];
    offsets.normals[i] = shape.normals[i] - normals[i];
  }

  return offsets;
}

const toCube = toOffsets(cubeShape(positions));
const toStar = toOffsets(starShape(positions));
const geometry = new Geometry3D({
  positions,
  normals,
  indices: sphere.indices,
  morphTargets: [toCube, toStar],
});
// The pane's comparison: the same position offsets with no normal offsets, so every shape keeps the sphere's lighting.
const positionsOnly = new Geometry3D({
  positions,
  normals,
  indices: sphere.indices,
  morphTargets: [
    { positions: toCube.positions },
    { positions: toStar.positions },
  ],
});

// One weight per target. The mesh keeps this very array, so writing into it moves the blob.
const weights = new Float32Array(OPENING_WEIGHTS);
const blob = new Mesh3D({
  geometry,
  material: clayMaterial('pink'),
  weights,
  position: { x: 0, y: 2.2, z: -1.2 },
  parent: view3d.root,
});
// Weights belong to the mesh, so three more meshes draw the same geometry, each held at a pose of its own.
const previews = POSES.map(
  (pose, i) =>
    new Mesh3D({
      geometry,
      material: clayMaterial('palePink'),
      weights: new Float32Array(pose),
      position: { x: (i - 1) * 1.8, y: 0.5, z: 3.3 },
      scale: 0.38,
      parent: view3d.root,
    }),
);
const meshes = [blob, ...previews];

const visuals = createVisuals({ app, view3d, stage, previews });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.1, 10.2);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.3, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  maxPolarAngle: Math.PI * 0.45,
});

// A phone is narrower than the preview row, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

/** Puts every mesh on the geometry with normal offsets, or on the one without */
function useNormalOffsets(on) {
  for (const mesh of meshes) mesh.geometry = on ? geometry : positionsOnly;
}

const pane = new ThemePane({ title: TITLE, stage });

// Each row writes straight into the blob's weights array.
for (let i = 0; i < weights.length; i++) {
  pane.addBinding(weights, i, {
    label: `weights[${i}]`,
    min: 0,
    max: 1,
    step: 0.01,
  });
}
pane
  .addBinding({ normalOffsets: true }, 'normalOffsets', {
    label: 'Normal offsets',
  })
  .on('change', ({ value }) => useNormalOffsets(value));

let swayAngle = SWAY_PHASE;

/** Turns all four meshes together, so they read as one object held at four poses */
function sway(dt) {
  swayAngle += dt * SWAY_SPEED;
  for (const mesh of meshes) mesh.rotation.y = SWAY * Math.sin(swayAngle);
}

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  sway(dt);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
sway(0);
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
