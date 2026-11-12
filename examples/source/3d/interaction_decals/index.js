/**
 * Stamp marks where the pointer hits a surface, from a pool of six planes that fade and get reused
 *
 * A `pointerdown` on the tablet carries `hit3D.point`, the world-space spot under the pointer. A plane with a
 * transparent texture (`alphaMode: 'blend'`) goes there, lifted a hair above the tablet. The six meshes and materials
 * are made once: each stamp takes the next slot in turn, and every mark's material `alpha` steps down as newer marks
 * land, so the faintest mark is the one the next stamp moves. These are flat stamps, not decals projected onto
 * curved meshes.
 *
 * Controls: click or tap the tablet to stamp, drag off it to orbit; the pane sets the next stamp's size, shows the
 * slot it takes, and clears the tablet. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, Mesh3D, PlaneGeometry, Vector3, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { addTabletFrame, createPaperTexture, SURFACE } from './scene';
import { createStampTexture } from './stampTexture';
import { createVisuals } from './visuals';

/** Six slots stay large enough to read together on a phone */
const CAPACITY = 6;
/** A small lift avoids coplanar flicker without drawing through other objects */
const SURFACE_LIFT = 0.008;
/**
 * Where the opening marks sit, oldest and faintest first, going round the tablet from the left. They leave the centre
 * clear, so a first click there lands on bare paper.
 */
const SEEDS = [
  { x: -2.7, y: SURFACE.y, z: 0 },
  { x: -1.4, y: SURFACE.y, z: -1.2 },
  { x: 1.4, y: SURFACE.y, z: -1.2 },
  { x: 2.7, y: SURFACE.y, z: 0 },
  { x: 1.4, y: SURFACE.y, z: 1.2 },
  { x: -1.4, y: SURFACE.y, z: 1.2 },
];
/** The narrowest view, width over height, that shows the tablet whole from the landscape distance */
const FIT_ASPECT = 1.2;

const theme = themeFromUrl();
const loading = new LoadingScreen({ theme, label: 'Stamp, fade, reuse' });
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

const view3d = new View3D({ autoResize: true });
// From this high camera the kit's fog, 12 out, would start on the tablet; from 18 only the floor past it fades.
const stage = new ThemeStage(view3d, { theme, fog: { near: 18, far: 40 } });
app.stage.addChild(view3d);

addTabletFrame(view3d.root);

// The tablet's face is the one surface that takes pointer events. Picked by its triangles, a hit lands on the plane.
const board = new Mesh3D({
  geometry: new PlaneGeometry({
    width: SURFACE.width,
    height: SURFACE.depth,
    flipV: true,
  }),
  material: new Material3D({ baseColorTexture: createPaperTexture() }),
  rotation: { x: -Math.PI / 2, y: 0, z: 0 },
  position: { x: 0, y: SURFACE.y, z: 0 },
  castShadow: false,
  eventMode: 'static',
  hitVolume: 'geometry',
  cursor: 'crosshair',
  parent: view3d.root,
});

// The pool: one texture and one geometry shared by six meshes, each with its own material so it fades alone. The
// marks are lit like the paper under them, so the ink dims with it on the dark theme.
const texture = createStampTexture();
const geometry = new PlaneGeometry({ width: 1, height: 1, flipV: true });
const colors = [
  BRAND.pink,
  BRAND.purple,
  BRAND.sky,
  BRAND.orange,
  BRAND.purple,
  BRAND.pink,
];
const materials = colors.map(
  (baseColor) =>
    new Material3D({
      baseColor,
      baseColorTexture: texture,
      alphaMode: 'blend',
    }),
);
// The marks take no events, so a click on one still reaches the tablet under it. Blended meshes draw back to front by
// their distance from the camera, so where two marks overlap, the nearer one shows on top, even when it's older.
const stamps = materials.map(
  (material) =>
    new Mesh3D({
      geometry,
      material,
      visible: false,
      castShadow: false,
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
      eventMode: 'none',
      parent: view3d.root,
    }),
);
const settings = { size: 1.6 };
const pool = { next: 0 };
/** The pointer's last hit on the tablet, held in from the edges, starting on the newest opening mark */
const aim = new Vector3();

/** Moves `aim` to a point on the tablet, held in so a mark of the next size, and its ring, stay on the paper */
function aimAt(point) {
  const maxX = (SURFACE.width - settings.size) / 2;
  const maxZ = (SURFACE.depth - settings.size) / 2;

  aim.set(
    Math.min(Math.max(point.x, -maxX), maxX),
    point.y,
    Math.min(Math.max(point.z, -maxZ), maxZ),
  );
}

/** Moves the next slot's mark to `aim` at full strength, and dims every other mark one step */
function stamp() {
  const slot = pool.next;
  const mesh = stamps[slot];

  mesh.position.set(aim.x, aim.y + SURFACE_LIFT, aim.z);
  mesh.scale.set(settings.size);
  mesh.visible = true;
  pool.next = (slot + 1) % CAPACITY;
  // A mark's age is how many stamps have landed since it, so the oldest, faintest one is the next slot to reuse.
  for (let i = 0; i < CAPACITY; i++) {
    const age = (slot - i + CAPACITY) % CAPACITY;

    materials[i].alpha = 1 - age / CAPACITY;
  }
}

board.on('pointermove', (e) => {
  if (e.hit3D) aimAt(e.hit3D.point);
});
board.on('pointerdown', (e) => {
  if (!e.hit3D || e.button !== 0) return;
  // Stopping the press here keeps the OrbitCamera still, so a stamp doesn't also start an orbit.
  e.stopPropagation();
  aimAt(e.hit3D.point);
  stamp();
});

// A full pool opens the scene, so six marks at six opacities show the fade before the first click.
for (const seed of SEEDS) {
  aimAt(seed);
  stamp();
}

const visuals = createVisuals({ view3d, aim, settings });

view3d.camera.fov = 40;
view3d.camera.position.set(2, 8.7, 9);
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.5, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 9,
  maxDistance: 18,
  minPolarAngle: 0.35,
  maxPolarAngle: Math.PI * 0.34,
  minAzimuthAngle: -0.5,
  maxAzimuthAngle: 0.5,
});

fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Stamp, fade, reuse', stage });

// A bigger next mark needs more room, so the ring steps in from an edge as it grows.
pane
  .addBinding(settings, 'size', { label: 'Next size', min: 0.8, max: 2 })
  .on('change', () => aimAt(aim));
pane.addBinding(pool, 'next', {
  label: 'Next slot',
  readonly: true,
  format: (slot) => slot.toFixed(0),
});
pane.addButton({ title: 'Clear board' }).on('click', () => {
  for (const mesh of stamps) mesh.visible = false;
});

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  visuals.update();
});

orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
