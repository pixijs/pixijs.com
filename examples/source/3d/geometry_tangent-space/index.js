/**
 * Tangent space turns a normal map's RGB directions into directions on a flat mesh.
 *
 * Both tiles share one material, one normal map and the same UVs; only their `tangents` differ. Each tangent is four
 * floats: T, the way u grows across the surface, then w, which picks the bitangent B = cross(N, T) * w. The map's
 * red channel bends the normal along T, green along B and blue out along N. Mirroring u reverses T, so w must
 * reverse too, or green points down the surface and the pads light on their bottom edges instead of their top.
 *
 * Controls: drag to orbit; Right tile gives the right tile wrong w, correct w or no tangents; Mirror u flips both
 * tiles' u; left w and right w show each tile's w; normalScale sets how far the map bends the normals. URL flags:
 * ?theme=light|dark, ?renderer=webgl|webgpu.
 */

import { Geometry3D, Material3D, Mesh3D, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { CLAY, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createNormalMap } from './normalMap';
import { createBackings, createGrazingLight } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows both tiles whole from the landscape distance */
const FIT_ASPECT = 0.9;

const theme = themeFromUrl();
const loading = new LoadingScreen({ theme, label: 'Tangent space' });
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
loading.progress(0.3);

const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme, lights: false });

stage.floor.visible = false;
// A dim fill, so the one grazing light in scene.ts does the shading and a flipped green channel shows.
view3d.environment = {
  skyColor: CLAY.white,
  groundColor: CLAY.lilac,
  intensity: 0.12,
};
app.stage.addChild(view3d);

// One flat quad of two triangles facing +z. The bumps are all in the normal map.
const positions = new Float32Array([
  -1.2, -1.2, 0, 1.2, -1.2, 0, 1.2, 1.2, 0, -1.2, 1.2, 0,
]);
const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
// Image v starts at the top row, so the map's green, which points up the image, points toward decreasing v.
const plainUvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]);
const mirroredUvs = new Float32Array([1, 1, 0, 1, 0, 0, 1, 0]);

/**
 * The quad three ways for one set of UVs: correct tangents, tangents with w reversed, and none
 *
 * T points the way u grows, `tx` along x. B must point up the quad, toward decreasing v, and cross(N, T) points up
 * only for T = +x, so mirrored UVs (T = -x) need w = -1.
 */
function buildQuads(uvs, tx) {
  const tangents = (w) =>
    new Float32Array([tx, 0, 0, w, tx, 0, 0, w, tx, 0, 0, w, tx, 0, 0, w]);

  return {
    correct: new Geometry3D({
      positions,
      normals,
      indices,
      uvs,
      tangents: tangents(tx),
    }),
    wrong: new Geometry3D({
      positions,
      normals,
      indices,
      uvs,
      tangents: tangents(-tx),
    }),
    // With no tangents the shader derives the frame per pixel from the UVs, and gets w right on its own.
    derived: new Geometry3D({ positions, normals, indices, uvs }),
  };
}

const quads = {
  plain: buildQuads(plainUvs, 1),
  mirrored: buildQuads(mirroredUvs, -1),
};
const normalTexture = createNormalMap();
const material = new Material3D({
  baseColor: CLAY.paleSky,
  roughness: 0.42,
  normalTexture,
  normalScale: 1,
});

// Opens on the case that goes wrong in practice: mirrored UVs whose w wasn't reversed.
const settings = { mode: 'wrong', mirror: true };
const left = new Mesh3D({
  geometry: quads.mirrored.correct,
  material,
  position: { x: -1.55, y: 1.6, z: 0 },
  parent: view3d.root,
});
const right = new Mesh3D({
  geometry: quads.mirrored.wrong,
  material,
  position: { x: 1.55, y: 1.6, z: 0 },
  parent: view3d.root,
});

/** A geometry's w, read back from its tangents; with none, the shader works B out from the UVs and there's no w */
function readW(geometry) {
  const tangents = geometry.tangents;

  if (!tangents) return 'none';

  // Stored as 16-bit integers by default (32767 for 1), so read the sign.
  return tangents[3] > 0 ? '+1' : '-1';
}

// What the pane's w rows show.
const readout = { leftW: readW(left.geometry), rightW: readW(right.geometry) };

/** The left tile always has correct tangents; the right one shows the pane's choice. */
function applyTangents() {
  const set = settings.mirror ? quads.mirrored : quads.plain;

  left.geometry = set.correct;
  right.geometry = set[settings.mode];
  readout.leftW = readW(left.geometry);
  readout.rightW = readW(right.geometry);
}

createBackings([left, right]);
const light = createGrazingLight(view3d);
const visuals = createVisuals({
  app,
  view3d,
  stage,
  left,
  right,
  light,
  settings,
});

view3d.camera.fov = 40;
view3d.camera.position.set(0, 1.95, 9.8);

// A normal map only fakes depth, so the orbit stays near face-on, where the fake holds.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.4, z: 0 },
  enableDamping: true,
  enablePan: false,
  enableZoom: false,
  minAzimuthAngle: -0.6,
  maxAzimuthAngle: 0.6,
  minPolarAngle: Math.PI * 0.34,
  maxPolarAngle: Math.PI * 0.53,
});

// A portrait screen is narrower than the two tiles side by side, so the camera backs off until both fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Tangent space', stage });

pane
  .addBinding(settings, 'mode', {
    label: 'Right tile',
    options: {
      'Wrong w': 'wrong',
      'Correct w': 'correct',
      'No tangents': 'derived',
    },
  })
  .on('change', applyTangents);
pane
  .addBinding(settings, 'mirror', { label: 'Mirror u' })
  .on('change', applyTangents);
// Mirror u reverses T on both tiles and w with it, so the left stays correct and a wrong w stays wrong.
pane.addBinding(readout, 'leftW', { label: 'left w', readonly: true });
pane.addBinding(readout, 'rightW', { label: 'right w', readonly: true });
pane.addBinding(material, 'normalScale', { min: 0, max: 1.5 });

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
