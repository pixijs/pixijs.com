/**
 * `BatchedMesh3D`: one scene node that draws up to 100,000 clay shapes in a few dozen draw calls
 *
 * A batch holds a fixed number of slots, `size`, with no scene node per shape. A slot is a geometry, a material, a
 * matrix and the passes that draw it. Slots that share a geometry and a shader draw as one instanced draw, so on
 * WebGL seven shapes in eight clay colours cost seven draws a pass at any size. WebGPU's opaque pass draws each colour
 * on its own, 56 draws, and its shadow pass seven. `setVisibleAt` hides a slot and keeps the rest of it. To move many slots a frame you write their matrices straight into `matrices.data`, then say which changed: here
 * a band runs round the ring, lifting the slots it passes and setting them back down.
 *
 * Controls: drag to orbit; the pane builds the batch again at another size, hides a share of its slots, sets every
 * slot's shape, colour and passes, and reads the draws they cost. The inset shows a patch of the ring up close. URL
 * flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { BatchedMesh3D, Box, Matrix4, RenderPassBit, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, isMobile } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { clayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { CLAY_COLORS, THEMES, themeFromUrl } from './theme/palette';
import { CLAY_SHAPES, clayGeometry } from './theme/shapes';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';

import { colorIndexOf, createSwarmLayout, restMatrix } from './scene';
import { createVisuals } from './visuals';

/** A phone or tablet starts at a quarter as many: 100,000 shadowed slots is a desktop budget */
const START_SIZE = isMobile.any ? 25_000 : 100_000;
/** The narrowest view, width over height, that shows the ring whole and clear of the pane and the inset */
const FIT_ASPECT = 1;
/** The share of the slots the band rewrites each frame */
const BAND_SHARE = 1 / 6;
/**
 * The share of the band, from its front, that the bump fills; behind it the band writes its slots at rest. The band
 * moves at most a few hundred slots a frame, so every slot it leaves was last written there.
 */
const BUMP_SHARE = 0.8;
/** Seconds for the band to run once round the ring, and where in a lap it starts: the front left */
const WAVE_LAP = 15;
const WAVE_START = 0.29;
/** How high the bump lifts the slots at its top, clear of the rope's own height */
const WAVE_HEIGHT = 1.8;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'BatchedMesh3D' });
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
// The haze starts just past the ring's near side, 20 units from the camera, and softens its far side, at 34.
const stage = new ThemeStage(view3d, { theme, fog: { near: 22, far: 56 } });

// Every slot samples the shadow map, so take the cheaper filter.
view3d.shadowFilter = 'pcf';
// Past 256 casters the engine stops fitting the shadow box to them, so the stage is handed a box round the ring and the
// bump's top. It adds the floor their shadows fall on, so no shadow is cut off where it reaches past them.
stage.shadowOverFloor(
  Box.fromCenterSize({ x: 0, y: 2.1, z: 0 }, { x: 16.4, y: 4.4, z: 16.4 }),
);
app.stage.addChild(view3d);

// Every clay colour is the same material class with different values, so all eight share one shader, and on WebGL a
// slot's colour never splits a draw. WebGPU's opaque pass binds each colour on its own, one draw per shape and colour
// until a shape's colours would pass 16 and merge. A different material class, alpha mode or render state splits a
// draw on both.
const geometries = CLAY_SHAPES.map((shape) => clayGeometry(shape, 'low'));
const materials = CLAY_COLORS.map((color) => clayMaterial(color));
const settings = {
  size: START_SIZE,
  visibleShare: 1,
  shapes: 7,
  colors: 8,
  passes: RenderPassBit.OPAQUE | RenderPassBit.SHADOW,
};
const matrix = new Matrix4();
let time = 0;
/** How many slots show: the first `shown` of the layout's spawn order */
let shown = 0;
let layout = createSwarmLayout(settings.size);
let swarm = buildSwarm();

/** A new batch of `layout.size` slots round the layout's ring, every one given all four parts of a slot */
function buildSwarm() {
  // `size` is fixed for the batch's life: every slot holds a row of its buffers, drawn or not. Its `cull` stays at
  // the default, 'off', since the whole ring is in view and testing every slot would find nothing to skip.
  const batch = new BatchedMesh3D({
    size: layout.size,
    label: 'swarm',
    parent: view3d.root,
  });

  for (let i = 0; i < batch.size; i++) {
    batch.setGeometryAt(i, geometries[i % settings.shapes]);
    batch.setMaterialAt(i, materials[colorIndexOf(layout, i, settings.colors)]);
    // A new slot's matrix is all zeros, so each gets a whole one once.
    batch.setMatrixAt(i, restMatrix(layout, i, matrix));
    // A slot doesn't take its passes from its material the way a Mesh3D does, and with none it draws nowhere.
    batch.setPassesAt(i, settings.passes);
  }
  // Every slot of a new batch starts visible.
  shown = batch.size;

  return batch;
}

// A batch can't change size, so a new size destroys it, between frames, and builds another. `destroy()` leaves the
// shared geometries and materials.
function resize(size) {
  swarm.destroy();
  layout = createSwarmLayout(size);
  swarm = buildSwarm();
  showShare(settings.visibleShare);
  visuals.setSwarm(swarm, layout);
}

function useShapes(count) {
  for (let i = 0; i < swarm.size; i++)
    swarm.setGeometryAt(i, geometries[i % count]);
}

function useColors(count) {
  for (let i = 0; i < swarm.size; i++)
    swarm.setMaterialAt(i, materials[colorIndexOf(layout, i, count)]);
}

// `setPassesAt` moves a slot in or out of each pass's draws and rebuilds its shader when it joins one, so it's for
// set-up and switches like this one, not every frame.
function usePasses(passes) {
  for (let i = 0; i < swarm.size; i++) swarm.setPassesAt(i, passes);
}

// A hidden slot keeps its geometry, material, matrix and place in its draw, so a flip rebuilds nothing. The shuffled
// spawn order thins the ring evenly, and only the slots between the old share and the new one flip.
function showShare(share) {
  const next = Math.round(share * swarm.size);

  for (let k = Math.min(next, shown); k < Math.max(next, shown); k++) {
    swarm.setVisibleAt(layout.spawnOrder[k], k < next);
  }
  shown = next;
}

/** Rewrites only the band's slots; every other slot keeps the matrix it was last given */
function liftWave(seconds) {
  // Read the data each frame rather than holding on to it.
  const { data, stride, offset } = swarm.matrices;
  const { size } = swarm;
  const bandCount = Math.round(size * BAND_SHARE);
  const first = Math.floor(((WAVE_START + seconds / WAVE_LAP) % 1) * size);

  for (let k = 0; k < bandCount; k++) {
    // Past the last slot the band carries on from slot 0.
    const i = (first + k) % size;
    // How far back from the band's front the slot is, against the bump's length: 0 at the front, 1 where it ends.
    const back = (bandCount - k - 0.5) / (bandCount * BUMP_SHARE);
    // sin² rises from 0 to the bump's top and falls back to 0; behind the bump the slot is written at rest.
    const lift = back < 1 ? WAVE_HEIGHT * Math.sin(Math.PI * back) ** 2 : 0;

    // Slot i's 16 floats start at `offset + i * stride`. Float 13 is translation y; the other 15 stay as
    // setMatrixAt wrote them.
    data[offset + i * stride + 13] = layout.rest[i * 3 + 1] + lift;
  }

  // Marks only the band's slots and re-measures only their bounds, as one run or, across slot 0, two. The next upload
  // still runs as one span from the lowest changed slot to the highest, so a band across slot 0 uploads all of it.
  const count = Math.min(bandCount, size - first);

  swarm.matrices.update(first, count);
  if (count < bandCount) swarm.matrices.update(0, bandCount - count);
}

const visuals = createVisuals({ app, view3d, stage, swarm, layout });

// 26 units from the target and 30° down: low enough that a raised stretch of the rope stands off the floor, high
// enough to see over the ring's near side into its middle.
view3d.camera.fov = 40;
view3d.camera.position.set(0, 13.5, 23.5);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.6, z: 0.9 },
  enableDamping: true,
  enablePan: false,
  minDistance: 8,
  maxDistance: 40,
  maxPolarAngle: Math.PI * 0.45,
});

// A narrower screen than the ring backs the camera and the fog off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'BatchedMesh3D', stage });

createControls({
  pane,
  settings,
  webgpu: app.renderer.name === 'webgpu',
  resize,
  showShare,
  useShapes,
  useColors,
  usePasses,
});
showShare(settings.visibleShare);

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  liftWave(time);
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
liftWave(time);
orbit.update();
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
