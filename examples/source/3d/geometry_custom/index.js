/**
 * A mesh's shape from your own arrays: positions, indices, normals and uvs in a `Geometry3D`
 *
 * A heightmap fills four typed arrays: three floats a vertex for `positions` and `normals`, two for `uvs`, and three
 * vertex numbers a triangle for `indices`. Built with `dynamic: true`, the geometry draws from those arrays, so
 * rewriting them and calling `buffer.update()` rolls waves across the terrain every frame. Without `dynamic` it's
 * copied on its first draw, so a new shape needs a new geometry: turn `dynamic` off and the marks, which read the
 * arrays, keep riding the waves while the clay holds the shape it was copied with.
 *
 * Controls: drag to orbit; the pane's Show row marks one array on the terrain, the Heightmap rows set its height,
 * wave speed and normals, and `dynamic` turns off and on. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Box, Geometry3D, Mesh3D, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { createClayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import {
  CELLS,
  pointNormalsUp,
  SIDE,
  SIZE,
  writeHeights,
  writeNormals,
} from './heightmap';
import { createTerrainTexture } from './scene';
import { createVisuals, SHOW_OPTIONS } from './visuals';

/** The narrowest view, width over height, that shows the whole patch from the landscape distance */
const FIT_ASPECT = 1.1;
/** How high the patch floats: clear of the floor at Height 2, with its shadow showing its shape below */
const TERRAIN_HEIGHT = 1.2;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Geometry from arrays' });
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
// Fog starts past the patch's far edge, so its colours hold.
const stage = new ThemeStage(view3d, { theme, fog: { near: 16, far: 44 } });

app.stage.addChild(view3d);

const params = { height: 1, waveSpeed: 1, slopeNormals: true, dynamic: true };
let waveTime = 0;

// Three floats a vertex: vertex n's x, y and z sit at n * 3, n * 3 + 1 and n * 3 + 2.
const positions = new Float32Array(SIDE * SIDE * 3);
// Three floats a vertex too: the way the surface faces there, which is what the lights read.
const normals = new Float32Array(SIDE * SIDE * 3);
// Two floats a vertex: where on the texture it samples, u across the image and v down it.
const uvs = new Float32Array(SIDE * SIDE * 2);
// Three vertex numbers a triangle, two triangles a cell. Uint16 counts to 65 535, so past 255 cells a side the
// vertex numbers would wrap: use a Uint32Array there.
const indices = new Uint16Array(CELLS * CELLS * 6);

// Each vertex's x and z, and its uv, come from where it sits in the grid; writeHeights fills in its y.
for (let row = 0; row < SIDE; row++) {
  for (let column = 0; column < SIDE; column++) {
    const vertex = row * SIDE + column;

    positions[vertex * 3] = (column / CELLS - 0.5) * SIZE;
    positions[vertex * 3 + 2] = (row / CELLS - 0.5) * SIZE;
    uvs[vertex * 2] = column / CELLS;
    uvs[vertex * 2 + 1] = row / CELLS;
  }
}

for (let row = 0; row < CELLS; row++) {
  for (let column = 0; column < CELLS; column++) {
    // The cell's far-left corner, and the corner a row nearer the camera.
    const a = row * SIDE + column;
    const b = a + SIDE;
    const i = (row * CELLS + column) * 6;

    // Counter-clockwise seen from above, so each triangle's front faces up; the clay doesn't draw back faces.
    indices[i] = a;
    indices[i + 1] = b;
    indices[i + 2] = a + 1;
    indices[i + 3] = a + 1;
    indices[i + 4] = b;
    indices[i + 5] = b + 1;
  }
}

/** Writes the heights for this moment of the waves, and the normals the pane asks for */
function writeArrays() {
  writeHeights(positions, waveTime, params.height);
  if (params.slopeNormals) writeNormals(positions, normals);
  else pointNormalsUp(normals);
}

/** A geometry over the arrays as they are, with or without `dynamic` */
function buildTerrain() {
  // With `dynamic` it draws from its own buffers, which hold these very arrays, so a rewrite reaches the screen.
  // Quantizing would copy the normals into an Int16Array the rewrites never touch, so they stay our floats.
  return new Geometry3D({
    positions,
    indices,
    normals,
    uvs,
    dynamic: params.dynamic,
    quantizeNormals: false,
  });
}

/**
 * A static geometry is copied on its first draw and never again, so a new shape takes a new geometry. `dynamic` is
 * fixed at construction too, so switching it builds a new geometry the same way.
 */
function rebuildTerrain() {
  const old = terrain.geometry;

  terrain.geometry = buildTerrain();
  // `true` frees its buffers too. Our arrays stay: a buffer only lets go of them.
  old.destroy(true);
}

/** A static geometry never sees a rewrite, so a pane change to what the arrays hold builds a new one */
function onArraysChanged() {
  if (params.dynamic) return;
  // New shape first, then the build: the geometry measures its bounds from the arrays now, and copies them on its
  // first draw. Here the next frame would rewrite them before that draw anyway; code with no frame loop needs this.
  writeArrays();
  rebuildTerrain();
}

writeArrays();

const texture = await createTerrainTexture();
const terrain = new Mesh3D({
  geometry: buildTerrain(),
  material: createClayMaterial({ baseColorTexture: texture }),
  position: { x: 0, y: TERRAIN_HEIGHT, z: 0 },
  parent: view3d.root,
});

loading.progress(0.8);
// The key light fits its shadow to the casters' bounds, and a dynamic geometry has none, so the box is pinned round
// the patch, its highest waves and the floor under it.
stage.key.shadow.bounds = Box.fromCenterSize(
  { x: 0, y: TERRAIN_HEIGHT, z: 0 },
  { x: 9, y: 3.2, z: 9 },
);

view3d.camera.fov = 40;
// Looking down about 35°, so the grid reads as a sheet of points and no hill hides another. A little right of the
// middle, so the column of vertices under the camera doesn't line up into one stroke.
view3d.camera.position.set(0.44, 7.2, 8.35);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: TERRAIN_HEIGHT, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 7,
  maxDistance: 18,
  // The clay draws front faces only, so the orbit stays above the sheet.
  maxPolarAngle: Math.PI * 0.4,
});

// A phone is narrower than the patch, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const visuals = createVisuals({
  app,
  view3d,
  stage,
  terrain,
  positions,
  indices,
  normals,
});

const pane = new ThemePane({ title: 'Geometry from arrays', stage });

pane.addBinding(visuals, 'show', { label: 'Show', options: SHOW_OPTIONS });

const heightmap = pane.addFolder({ title: 'Heightmap' });

heightmap
  .addBinding(params, 'height', { label: 'Height', min: 0, max: 2, step: 0.01 })
  .on('change', onArraysChanged);
heightmap.addBinding(params, 'waveSpeed', {
  label: 'Wave speed',
  min: 0,
  max: 3,
});
heightmap
  .addBinding(params, 'slopeNormals', {
    label: 'Normals',
    options: { 'From slope': true, 'All up': false },
  })
  .on('change', onArraysChanged);
pane.addBinding(params, 'dynamic').on('change', rebuildTerrain);

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  waveTime += dt * params.waveSpeed;
  writeArrays();

  // update() queues each buffer's upload. A dynamic geometry draws from these buffers; a static one draws from the
  // copy made on its first draw, so on it these change nothing on screen.
  const { attributes } = terrain.geometry;

  attributes.aPosition.buffer.update();
  attributes.aNormal.buffer.update();
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
