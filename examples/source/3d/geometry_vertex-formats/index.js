/**
 * The same sphere as floats and as packed integers: an attribute's format says how its bytes become shader values
 *
 * `snorm16x4` reads signed 16-bit integers as -1 to 1 and `unorm16x2` reads unsigned ones as 0 to 1, so the packed
 * sphere draws the same as the float one from half the bytes. Integer positions need an explicit `bounds3D`.
 * `interleave` changes the layout, one buffer or one per attribute, but not the bytes. Both geometries are `dynamic`
 * only so they draw from their own buffers, which is what lets `interleave` reach the GPU. A static mesh doesn't need
 * it for the savings: it is copied into the engine's shared interleaved buffers, which keep each attribute's format.
 * Leaving `dynamic` off also keeps frustum culling and the shadow auto-fit, which a dynamic geometry loses.
 *
 * Controls: drag to orbit; `interleave` stores the packed sphere in one buffer or four, and the Float32 and Packed
 * integers rows show each sphere's vertex bytes and buffers; Turn stops the spin.
 * URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import {
  Box,
  Geometry3D,
  Material3D,
  Mesh3D,
  SphereGeometry,
  Vector3,
  View3D,
} from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Buffer, BufferUsage } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createVisuals } from './visuals';

/** Radians per second: slow enough to compare the two spheres' shading as they turn */
const TURN_SPEED = 0.2;

const theme = themeFromUrl();
const loading = new LoadingScreen({ theme, label: 'Vertex formats' });
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
const stage = new ThemeStage(view3d, { theme });
app.stage.addChild(view3d);

// A unit sphere fits snorm's -1 to 1 domain without another scale in the shader. Geometry3D stores Float32 normals
// as snorm16 unless `quantizeNormals` is off, so it is off wherever this file wants them as floats.
const shape = new SphereGeometry({
  widthSegments: 24,
  heightSegments: 12,
  quantizeNormals: false,
});
if (!shape.normals || !shape.uvs)
  throw new Error('The sphere must provide normals and UVs.');
const positions = new Float32Array(shape.positions);
const normals = new Float32Array(shape.normals);
const uvs = new Float32Array(shape.uvs);
const indices = new Uint16Array(shape.indices);
const count = shape.vertexCount;
shape.destroy(true);

// WebGPU has no three-component 16-bit format, so packed xyz takes four shorts with the fourth left at 0.
const colors = new Float32Array(count * 4);
const packedPositions = new Int16Array(count * 4);
const packedNormals = new Int16Array(count * 4);
const packedUvs = new Uint16Array(count * 2);
const packedColors = new Uint8Array(count * 4);

for (let i = 0; i < count; i++) {
  for (let component = 0; component < 3; component++) {
    packedPositions[i * 4 + component] = Math.round(
      positions[i * 3 + component] * 32767,
    );
    packedNormals[i * 4 + component] = Math.round(
      normals[i * 3 + component] * 32767,
    );
  }
  packedUvs[i * 2] = Math.round(uvs[i * 2] * 65535);
  packedUvs[i * 2 + 1] = Math.round(uvs[i * 2 + 1] * 65535);
  // Linear-light pink to blue, quantized in the second copy only.
  const mix = (positions[i * 3] + 1) / 2;
  colors.set(
    [0.85 - mix * 0.75, 0.08 + mix * 0.25, 0.3 + mix * 0.55, 1],
    i * 4,
  );
  for (let component = 0; component < 4; component++)
    packedColors[i * 4 + component] = Math.round(
      colors[i * 4 + component] * 255,
    );
}

const floatGeometry = new Geometry3D({
  positions,
  normals,
  uvs,
  colors,
  indices,
  dynamic: true,
  // Left on, it would pack these normals too, and the float baseline would no longer be all floats.
  quantizeNormals: false,
  interleave: false,
});
// An integer array is only read the right way through an attribute that names its format. The Uint8Array of colours
// needs none: Geometry3D reads integer colours as unorm.
const positionInput = new Buffer({
  data: packedPositions,
  usage: BufferUsage.VERTEX,
});
const normalInput = new Buffer({
  data: packedNormals,
  usage: BufferUsage.VERTEX,
});
const uvInput = new Buffer({ data: packedUvs, usage: BufferUsage.VERTEX });
// Only float positions are scanned for the box, so packed ones bring their own, in the -1 to 1 that snorm reads.
const bounds = new Box(new Vector3(-1, -1, -1), new Vector3(1, 1, 1));
const settings = { interleave: true, turn: true };

function packedGeometry() {
  return new Geometry3D({
    positions: { buffer: positionInput, format: 'snorm16x4' },
    normals: { buffer: normalInput, format: 'snorm16x4' },
    uvs: { buffer: uvInput, format: 'unorm16x2' },
    colors: packedColors,
    indices,
    bounds3D: bounds,
    dynamic: true,
    interleave: settings.interleave,
  });
}

const material = new Material3D({ roughness: 0.7 });
material.vertexColors = true;
const floatSphere = new Mesh3D({
  geometry: floatGeometry,
  material,
  position: { x: -1.45, y: 1.3, z: 0 },
  parent: view3d.root,
});
const packedSphere = new Mesh3D({
  geometry: packedGeometry(),
  material,
  position: { x: 1.45, y: 1.3, z: 0 },
  parent: view3d.root,
});

/**
 * What a geometry's vertex buffers hold, counting a buffer that several attributes read once. It leaves out the
 * renderer's own overhead, and says nothing about frame rate.
 */
function describeBuffers(geometry) {
  const buffers = new Set(
    Object.values(geometry.attributes).map((attribute) => attribute.buffer),
  );
  let bytes = 0;
  for (const buffer of buffers) bytes += buffer.data.byteLength;
  return `${bytes} bytes, ${buffers.size} ${buffers.size === 1 ? 'buffer' : 'buffers'}`;
}

const readout = {
  float: describeBuffers(floatGeometry),
  packed: describeBuffers(packedSphere.geometry),
};

// Interleaving is fixed when a geometry is built, so a change builds a new one and frees the old one's buffers.
function rebuildPacked() {
  const old = packedSphere.geometry;
  packedSphere.geometry = packedGeometry();
  old.destroy(true);
  readout.packed = describeBuffers(packedSphere.geometry);
}

// The key's shadow box fits only casters with bounds, and dynamic geometry has none, so the stage is handed a box round
// the spheres. It adds the floor their shadows fall on, so no shadow is cut off where it reaches past them.
stage.shadowOverFloor(
  Box.fromCenterSize({ x: 0, y: 1.3, z: 0 }, { x: 5.2, y: 2.2, z: 2.2 }),
);

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.2, 9);
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.2, z: 0 },
  enableDamping: true,
  enablePan: false,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});
fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: 0.9,
  clearTop: 60,
});

const pane = new ThemePane({ title: 'Vertex formats', stage });
pane.addBinding(settings, 'interleave').on('change', rebuildPacked);
pane.addBinding(settings, 'turn', { label: 'Turn' });
pane.addBinding(readout, 'float', { label: 'Float32', readonly: true });
pane.addBinding(readout, 'packed', {
  label: 'Packed integers',
  readonly: true,
});

const visuals = createVisuals({
  app,
  view3d,
  stage,
  floatSphere,
  packedSphere,
});

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);
  stage.update(dt);
  if (settings.turn) {
    packedSphere.rotation.y += dt * TURN_SPEED;
    floatSphere.rotation.y = packedSphere.rotation.y;
  }
  visuals.update();
});
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
