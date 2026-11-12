/**
 * A camera draws only what lies between its near and far clipping planes
 *
 * `camera.near` and `camera.far` are distances down the camera's view direction. Four spheres sit at known distances
 * along it, and both planes sweep back and forth, so a reader watches each plane cut a sphere, and the floor, at its
 * distance. A cut leaves no cap, and a material that isn't `doubleSided` skips the faces turned away from the camera,
 * as the inside of the sphere's far half is, so a sphere the near plane opens shows as a ring you see straight through.
 * Far keeps only a sphere's front, so the 18 unit sphere shrinks to nothing as far passes it. The planes cut only what
 * this camera draws: the light draws shadows from its own view, so a cut sphere still casts a whole shadow.
 *
 * Keep `near` as large and `far` as small as the scene allows: perspective depth spends most of its precision just past
 * `near`, so with a tiny `near`, distant surfaces close together flicker through each other. These spheres lie too far
 * apart to show it.
 *
 * Controls: moving near or far, or unticking Sweep, stops the sweep; ticking it again glides the planes back. The
 * camera stays put, so the labelled distances hold. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, Mesh3D, SphereGeometry, View3D } from '@pixi/3d';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createVisuals } from './visuals';

/** Each sphere's distance down the camera's view direction, the axis near and far measure along */
const DISTANCES = [7, 10, 14, 18];
const COLORS = [BRAND.pink, BRAND.sky, BRAND.orange, BRAND.purple];
/** Half the landscape lens's vertical field of view, 20°, for the usual fov of 40 */
const HALF_FOV = Math.PI / 9;
/** The narrowest view, width over height, that shows all four spheres through the landscape lens */
const FIT_ASPECT = 1.1;
/**
 * Each plane opens at `from`, swings to `to` and back at `rate` radians per second, and slows as it turns. Near turns
 * with the 7 and 10 unit spheres cut into rings, so each ring holds; far turns either side of the 18 unit sphere.
 */
const SWEEPS = [
  { plane: 'near', from: 6.5, to: 9.6, rate: 0.5 },
  { plane: 'far', from: 17, to: 19.5, rate: 0.4 },
];
/** A plane's top speed, in units per second. Both sweeps are slower, so it only limits a moved plane gliding back */
const GLIDE_SPEED = 4;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Clipping planes' });
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

// Built at the screen's size, so the first frame's labels land where the spheres are.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// The fog starts well past the far plane's range, so only clipping hides anything.
const stage = new ThemeStage(view3d, { theme, fog: { near: 100, far: 200 } });

app.stage.addChild(view3d);

const geometry = new SphereGeometry({ radius: 0.7 });
const spheres = DISTANCES.map(
  (distance, i) =>
    new Mesh3D({
      geometry,
      material: new Material3D({ baseColor: COLORS[i], roughness: 0.55 }),
      // Spread in proportion to distance, so the spheres sit evenly across the screen.
      position: {
        x: ((i - 1.5) * 1.6 * distance) / 10,
        y: 1.1,
        z: 10 - distance,
      },
      parent: view3d.root,
    }),
);

const camera = view3d.camera;

camera.position.set(0, 1.1, 10);
camera.lookAt({ x: 0, y: 1.1, z: 0 });
for (const { plane, from } of SWEEPS) camera[plane] = from;

// A portrait screen widens the lens instead of moving the camera, which would change every labelled distance.
function fitLens() {
  const narrowing = Math.min(
    1,
    app.screen.width / app.screen.height / FIT_ASPECT,
  );

  camera.fov = (2 * Math.atan(Math.tan(HALF_FOV) / narrowing) * 180) / Math.PI;
}

fitLens();
app.renderer.on('resize', fitLens);

const pane = new ThemePane({ title: 'Clipping planes', stage });
const settings = { sweep: true };

// The ranges don't meet, so far stays beyond near, as a valid projection needs. Near's row starts at the engine's
// default, 0.1, though nothing in view lies nearer than the floor at the screen's foot, about 3 units away. No
// `step`: a stepped row writes its rounded value back on refresh, and the sweep refreshes these rows every frame.
const planeRows = [
  pane.addBinding(camera, 'near', {
    min: 0.1,
    max: 11,
    format: (value) => value.toFixed(1),
  }),
  pane.addBinding(camera, 'far', {
    min: 12,
    max: 30,
    format: (value) => value.toFixed(1),
  }),
];
const sweepRow = pane.addBinding(settings, 'sweep', { label: 'Sweep' });
// A refresh fires the row's change handler too, so the handler ignores the sweep's own writes.
let syncing = false;
let sweepTime = 0;

/** Stops the sweep, so a plane the reader moves stays where they put it */
function stopSweep() {
  if (syncing) return;
  settings.sweep = false;
  sweepRow.refresh();
}

for (const row of planeRows) {
  row.on('change', stopSweep);
  // A typed number changes nothing until it's entered, and the sweep's refresh would overwrite it, so focus stops it.
  row.element.addEventListener('focusin', stopSweep);
}

/** Moves both planes along their sweeps, never faster than `GLIDE_SPEED`, and shows the new distances in their rows */
function sweepPlanes(dt) {
  sweepTime += dt;
  for (const { plane, from, to, rate } of SWEEPS) {
    const target = from + ((to - from) * (1 - Math.cos(sweepTime * rate))) / 2;

    camera[plane] += Math.min(
      GLIDE_SPEED * dt,
      Math.max(-GLIDE_SPEED * dt, target - camera[plane]),
    );
  }
  syncing = true;
  for (const row of planeRows) row.refresh();
  syncing = false;
}

const visuals = createVisuals({
  app,
  view3d,
  stage,
  spheres,
  distances: DISTANCES,
});

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  if (settings.sweep) sweepPlanes(dt);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
