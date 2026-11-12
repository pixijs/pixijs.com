/**
 * Hit volumes: the shape the pointer is tested against, which needn't be the mesh you see
 *
 * A pointer never touches a mesh's surface. The view casts a ray and tests it against each interactive mesh's
 * `hitVolume`: `'box'` (the bounding box, and what `null` falls back to), a `Sphere`, `'geometry'` (every triangle),
 * a low-poly `Geometry3D`, or a class of your own that implements `IHitVolume3D`. Only a mesh that listens
 * (`eventMode = 'static'`) is ever the target. A one-test shape is cheap but answers in the empty space round the clay;
 * triangles are exact, but every one is tested whenever the ray enters their bounding box, hit or miss, unless a
 * nearer hit already lies in front of that box. `view3d.raycast` runs the same pick from your own code; `visuals.ts`
 * outlines each volume, turns the one that answers pink, and darkens a faint triangle net while the ray is in its box.
 *
 * Controls: drag to orbit; point at a shape, or tap it, to see whether its volume answers; the pane sets each
 * shape's hitVolume and shows what the pick returned. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { createRaycastHit3D, Sphere, Vector3, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { clayGeometry } from './theme/shapes';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { CylinderVolume } from './CylinderVolume';
import {
  createShapes,
  enclosingRadius,
  followLayout,
  GRID_ASPECT,
  SHAPE_NAMES,
} from './scene';

import { createVisuals } from './visuals';

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Hit volumes' });
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
const stage = new ThemeStage(view3d, { theme });
const shapes = createShapes(view3d);

app.stage.addChild(view3d);

// Left 'passive', the default, a mesh is never the target; with no interactive ancestor, as here, it isn't even tested.
// The cursor shows wherever the pointer's ray meets the mesh's volume, empty corners included.
for (const name of SHAPE_NAMES) {
  shapes[name].eventMode = 'static';
  shapes[name].cursor = 'pointer';
}

/** The pane's choices for each shape, as shown → the kind `setHitVolume` takes */
const VOLUME_OPTIONS = {
  'null (default)': 'default',
  "'box'": 'box',
  Sphere: 'sphere',
  "'geometry'": 'geometry',
  'Geometry3D (low-poly)': 'stand-in',
  'CylinderVolume (yours)': 'cylinder',
};

// One of each kind, on the shape it suits.
const volumes = {
  octahedron: 'box',
  sphere: 'sphere',
  torus: 'geometry',
  puck: 'cylinder',
};

function setHitVolume(name, kind) {
  const mesh = shapes[name];

  switch (kind) {
    case 'default':
      // No shape of your own: an interactive mesh is then picked by its geometry's bounding box.
      mesh.hitVolume = null;
      break;
    case 'box':
      // The same bounding box, asked for by name. One test, and its empty corners count as the mesh.
      mesh.hitVolume = 'box';
      break;
    case 'sphere':
      // One test, exact for a ball: centred on the origin, through the farthest vertex.
      mesh.hitVolume = new Sphere(
        new Vector3(),
        enclosingRadius(mesh.geometry),
      );
      break;
    case 'geometry':
      // Exact. Once the ray enters the geometry's bounding box, every triangle is tested, hit or miss, unless a nearer
      // hit already lies in front of the box. The torus has 1,024.
      mesh.hitVolume = 'geometry';
      break;
    case 'stand-in':
      // Any Geometry3D, tested per triangle inside its own bounding box: far fewer triangles, and a coarser surface.
      mesh.hitVolume = clayGeometry(name, 'low');
      break;
    case 'cylinder': {
      // A shape of your own, one analytic test. Clay shapes are centred on their origin, so the bounds give its size.
      const { max } = mesh.geometry.bounds3D;

      mesh.hitVolume = new CylinderVolume({
        radius: Math.max(max.x, max.z),
        halfHeight: max.y,
      });
      break;
    }
  }
}

for (const name of SHAPE_NAMES) setHitVolume(name, volumes[name]);

view3d.camera.fov = 40;
// About 10.2 from the target, 12° down: the box frame and the cylinder outline read as solids, the hole stays open.
view3d.camera.position.set(0, 3, 10);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.9, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// Four abreast, or two rows of two on a narrower screen, so the torus's hole stays big enough to point through. On a
// phone held upright even the two rows are too wide, so the camera and the fog back off until they fit.
followLayout({ renderer: app.renderer, orbit, shapes });
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: GRID_ASPECT });

// The pointer's last place in global px, which pixi keeps up to date as the reader moves or taps.
const pointer = app.renderer.events.pointer.global;
// One hit, made once: raycast fills it in and returns it, or returns null on a miss and leaves it as it was.
const hit = createRaycastHit3D();
let picked = null;

const pane = new ThemePane({ title: 'Hit volumes', stage });
const volumeRows = pane.addFolder({ title: 'hitVolume' });

for (const name of SHAPE_NAMES) {
  volumeRows
    .addBinding(volumes, name, { options: VOLUME_OPTIONS })
    .on('change', ({ value }) => setHitVolume(name, value));
}

// What the pick returned. A one-test volume strikes no triangle, so its triangleIndex reads -1.
const pickedValues = {
  get target() {
    return picked ? picked.target.label : 'null';
  },
  get triangleIndex() {
    return picked ? String(picked.triangleIndex) : '';
  },
};
const pickedRows = pane.addFolder({ title: 'picked' });

pickedRows.addBinding(pickedValues, 'target', {
  readonly: true,
  interval: 100,
});
pickedRows.addBinding(pickedValues, 'triangleIndex', {
  readonly: true,
  interval: 100,
});

const visuals = createVisuals({ view3d, shapes, pointer });

function step(dt) {
  stage.update(dt);
  // The same pick pointer events make, at the pointer, on the last render's transforms. `picked` is `hit`, or null.
  picked = view3d.raycast(pointer, hit);
  visuals.update(picked);
}

app.ticker.add((ticker) => step(Math.min(ticker.deltaMS / 1000, 1 / 15)));

// The pick reads the last render's transforms, so the boot draws once, picks, then draws the frame the reader first
// sees. Then the canvas joins and the loading screen dissolves onto it.
app.render();
step(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
