/**
 * How big a node is and how to make it a given size: `getLocalBounds`, `width`, `height` and `depth`, fitting any
 * model to a box, and `boundsVolume`
 *
 * `getLocalBounds()` measures a node and everything under it in the node's own space, so its own scale and position
 * don't count; `width`, `height` and `depth` are that box times the scale. Fitting a model to a box is three steps:
 * measure it, scale it, then move it so its bounds' centre sits on the box's. A `boundsVolume` is a fixed box that
 * measuring reads in place of a large subtree. Ink cubes show the boxes, and pink frames each model's measured bounds.
 *
 * Controls: drag to orbit, scroll to zoom; the pane sets the box size, how the fit scales and whether it centres, the
 * swarm's `boundsVolume` and the bounds frames, and picks the model whose `getLocalBounds()` and `getSize()` it reads
 * out. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Box, Container3D, Mesh3D, Model3D, Vector3, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { clayMaterial } from './theme/clay';
import { LoadingScreen } from './theme/LoadingScreen';
import { LOGO_URL } from './theme/logo';
import { THEMES, themeFromUrl } from './theme/palette';
import { clayGeometry } from './theme/shapes';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';

import {
  createSwarm,
  followLayout,
  moveSwarm,
  SWARM_EXTENT,
  wearEnamel,
} from './scene';
import { createVisuals } from './visuals';

/** The box's side the scene opens at: big in the frame, short of the Box size row's 2.2 so the slider can grow it */
const BOX_SIZE = 2;
const SWARM_COUNT = 160;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Size and bounds' });
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

// At the screen's size from the start, so the first frame's tags are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();

// The raw file, not the kit's loadPixiLogo, which already fits the logo to a width and centres it.
const source = await loading.load(() => Assets.load(LOGO_URL));

app.stage.addChild(view3d);

// Three models of very different sizes: a clay capsule under a unit tall, the logo file over 7 units wide, and a
// swarm of 160 shapes. In a row all three shadow the floor; nothing stands over them, so none receives.
const capsule = new Mesh3D({
  geometry: clayGeometry('capsule'),
  material: clayMaterial('sky'),
  receiveShadow: false,
});
const logo = Model3D.from(source, { receiveShadow: false });
const swarm = createSwarm(SWARM_COUNT);

wearEnamel(logo);

// The flock never leaves SWARM_EXTENT, so measuring reads this box instead of walking all 161 nodes.
const SWARM_VOLUME = Box.fromCenterSize({ x: 0, y: 0, z: 0 }, SWARM_EXTENT);

swarm.boundsVolume = SWARM_VOLUME;

/** What the pane's boundsVolume row calls: without the volume, measuring the swarm walks all 161 nodes */
function useVolume(on) {
  swarm.boundsVolume = on ? SWARM_VOLUME : null;
}

// Each model stands in a slot whose origin is the middle of its box's floor: the box runs from (−s/2, 0, −s/2) to
// (s/2, s, s/2), so the fit works in slot space.
const items = [capsule, logo, swarm].map((model) => ({
  model,
  slot: new Container3D({ children: [model], parent: view3d.root }),
  bounds: new Box(),
}));

const centre = new Vector3();

/** Fits `model` to a cube of side `size` standing on its parent's origin: measure, scale, then centre */
function fitToBox(model, size, fit, bounds) {
  // In the model's own space, so its own scale and position don't count.
  model.getLocalBounds(bounds);
  // setSize scales each axis on its own, so the model fills the cube and changes shape.
  if (fit === 'stretch') model.setSize(size);
  else
    model.scale.set(size / Math.max(bounds.width, bounds.height, bounds.depth));
  if (fit === 'skip-centring') {
    // Where the model started: its own origin on the cube's floor.
    model.position.set(0, 0, 0);

    return;
  }
  // A model's origin is rarely its middle, so move it until the bounds' centre sits on the cube's. The centre is in
  // the model's own units, so its scale takes it into the slot's; that holds while the model doesn't turn.
  bounds.getCenter(centre);
  model.position.set(
    -centre.x * model.scale.x,
    size / 2 - centre.y * model.scale.y,
    -centre.z * model.scale.z,
  );
}

const measured = { width: 0, height: 0, depth: 0 };
const state = {
  boxSize: BOX_SIZE,
  fit: 'keep-shape',
  useVolume: true,
  focus: 1,
  showBounds: true,
};

// Orthographic, so the three cubes look identical wherever they stand in the row.
view3d.camera.mode = 'orthographic';

const orbit = new OrbitCamera({
  view: view3d,
  enableDamping: true,
  enablePan: false,
  minZoom: 0.6,
  maxZoom: 2,
});

// fitPortrait backs a perspective camera off, which an orthographic one ignores, so this lays the boxes out for each
// screen instead: a row on a wide one, a column on a tall one. Only a row casts shadows.
followLayout({
  renderer: app.renderer,
  orbit,
  stage,
  slots: items.map((item) => item.slot),
});

const visuals = createVisuals({ app, view3d, stage, items, swarm, state });

createControls({ stage, state, useVolume, items, measured });

let time = 0;

/** Moves the swarm and fits each model to the box, then reads the measured one's size */
function tick() {
  moveSwarm(swarm, time);
  for (const item of items)
    fitToBox(item.model, state.boxSize, state.fit, item.bounds);
  // width, height and depth are the bounds times the scale: the size the model shows at in its slot. Each property
  // measures the model, so getSize reads all three with one measurement.
  items[state.focus].model.getSize(measured);
}

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  tick();
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
tick();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
