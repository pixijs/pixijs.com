/**
 * Load a glTF file once with pixi's `Assets`, build three `Model3D`s from it, find each copy's parts by label, and
 * repaint them all through the source's material
 *
 * `Assets.load` hands back a `Scene3DSource`, a template that holds the file's geometry, materials and textures and
 * never goes into the view. Each `Model3D` builds its own nodes from it but draws with the source's resources, so
 * turning one copy's wheels moves nothing on the others, while one write to `source.material['truck']` repaints all
 * three.
 *
 * Controls: drag to orbit; `baseColor` repaints the shared material on every copy, and `Rolling` picks the copy whose
 * wheels turn. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 *
 * Model: Cesium Milk Truck, donated by Cesium to the Khronos glTF sample models under CC BY 4.0; its logo follows
 * Cesium's trademark terms.
 */

import { Model3D, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { model } from './manifest';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { CLAY, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createVisuals } from './visuals';

/**
 * Where each copy parks. The outer two turn 0.3 rad more towards the camera, so all three show it the same
 * three-quarter view and read as copies.
 */
const TRUCK_BAYS = [
  { x: -6.2, yaw: -0.4 },
  { x: 0, yaw: -0.7 },
  { x: 6.2, yaw: -1.0 },
];
/** The narrowest view, width over height, that shows the three trucks whole from the landscape distance */
const FIT_ASPECT = 1.3;
/**
 * The body's paint. Pale, since `baseColor` multiplies the texture and a strong colour muddies the side logo; not
 * pink, which would swallow the accent tags.
 */
const TRUCK_PAINT = CLAY.paleSky;
/** The file's wheel radius, from its bounds: turning by distance over radius rolls without slipping */
const WHEEL_RADIUS = 0.43;
/** How far the rolling truck goes out of its bay, clear of its neighbours, and how long a roll takes, in seconds */
const ROLL_DISTANCE = 0.8;
const ROLL_PERIOD = 3;
/** How fast a truck eases into its roll when the pane picks it, and home when it doesn't, per second */
const ROLL_EASE = 4;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Loading glTF' });
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
// The camera stands about 20 units out, so the fog starts behind the trucks and never hazes them.
const stage = new ThemeStage(view3d, { theme, fog: { near: 20, far: 52 } });

app.stage.addChild(view3d);

// Importing @pixi/3d registers its GLB loader with Assets, which picks it by the file's extension. The source is a
// template: build models from it, never add it to a view.
const source = await loading.load(() =>
  Assets.load(model('gltf.CesiumMilkTruck')),
);

// Each copy builds its own nodes but draws with the source's geometry, materials and textures, so a copy costs nodes,
// not a download or GPU memory. The file's `Wheels` clip gives each a `player`, which stays stopped.
const trucks = TRUCK_BAYS.map(
  ({ x, yaw }) =>
    new Model3D({
      source,
      x,
      rotation: { x: 0, y: yaw, z: 0 },
      parent: view3d.root,
    }),
);

// Every node takes the file's node name as its label. The axles sit four levels down, so `true` searches the whole
// tree. A search walks the tree, so search once and keep what it finds.
const wheels = trucks.map((truck) => truck.getChildrenByLabel(/^Wheels/, true));

// The file names the body's material `truck`, and every copy's body draws with this one object, so this one write
// repaints all three. `baseColor` multiplies the body's texture, so its dark grille and bumper stay dark; the tyres,
// glass and window trim have materials of their own (`wheels`, `glass`, `window_trim`) and don't change.
const truckMaterial = source.material['truck'];

truckMaterial.baseColor = TRUCK_PAINT;

// The copy whose wheels turn: the pane binds it, and the roll and the visuals read it.
const state = { rolling: 1 };
// How much of the roll each truck takes, easing between 0, parked, and 1 as the pane moves the roll to another copy.
const rollWeights = TRUCK_BAYS.map((_, i) => (i === state.rolling ? 1 : 0));

/**
 * Rolls one truck out of its bay and back, and turns that copy's wheels as far as it rolls. A truck the pane takes
 * the roll from glides home, still rolling true. The axle is each wheel node's local y, which points to the
 * truck's right, so a forward roll is a negative turn about it. Writing `rotation.y` replaces the 10° turn the file
 * gave each wheel rather than adding to it: from then on the node uses its `rotation`, not its `quaternion`.
 */
function rollTrucks(time, dt) {
  const swing = ROLL_DISTANCE * Math.sin((time * Math.PI * 2) / ROLL_PERIOD);

  for (let i = 0; i < trucks.length; i++) {
    const { x, yaw } = TRUCK_BAYS[i];

    rollWeights[i] +=
      ((i === state.rolling ? 1 : 0) - rollWeights[i]) *
      Math.min(1, ROLL_EASE * dt);

    const travel = rollWeights[i] * swing;

    trucks[i].position.set(
      x + Math.sin(yaw) * travel,
      0,
      Math.cos(yaw) * travel,
    );
    for (const wheel of wheels[i]) wheel.rotation.y = -travel / WHEEL_RADIUS;
  }
}

const visuals = createVisuals({ app, view3d, stage, trucks, wheels, state });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 7.6, 19);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 12,
  maxDistance: 30,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the row of trucks, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Loading glTF', stage });

// A repaint reaches every copy at once; a new pick moves the roll, and the wheel turns, to one copy only.
pane.addBinding(truckMaterial, 'baseColor', { view: 'color' });
pane.addBinding(state, 'rolling', {
  label: 'Rolling',
  options: Object.fromEntries(trucks.map((_, i) => [`trucks[${i}]`, i])),
});

let elapsed = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  elapsed += dt;
  stage.update(dt);
  rollTrucks(elapsed, dt);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
rollTrucks(0, 0);
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
