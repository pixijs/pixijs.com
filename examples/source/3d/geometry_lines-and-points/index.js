/**
 * Lines and points: `topology` says how a geometry joins its vertices, and `indexCount` draws only the first part of
 * it
 *
 * A `'line-list'` geometry reads its indices in pairs and draws a segment for each, a `'point-list'` one reads them one
 * at a time and draws a dot, and either is one pixel wide at any distance: the close-up of vertex 0 shows the line
 * still 1 px beside a dot with a size in the world. A material's `topology` wins over its geometry's, so the torus
 * behind the path draws as its vertices. On a `dynamic` geometry, `indexCount` draws a prefix of the index list; the
 * rest of the path shows as a ghost.
 *
 * Controls: drag to orbit, scroll to zoom in on the path; the pane sets the path's topology, how much of it is drawn
 * and whether it's dynamic, shows the `indexCount` that gives, and draws the torus with its material's topology or its
 * geometry's. URL flags: `?theme=light|dark` (dark when left out), `?renderer=webgl|webgpu`.
 */

import {
  Geometry3D,
  Material3D,
  Mesh3D,
  TorusGeometry,
  View3D,
} from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { flatOptions } from './theme/helpers';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { FIT_ASPECT, figureEightPositions } from './scene';

import { createVisuals } from './visuals';

/** Enough vertices for a smooth curve, few enough that the dots read one by one */
const VERTEX_COUNT = 200;
/** The torus's turn, in radians a second */
const TORUS_TURN = 0.3;

// Dark unless the URL says otherwise: the 1 px pink line and the dots stand out most against the dark floor.
const theme = themeFromUrl('dark');
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Lines and points' });
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
// Bigger checks, so the 1 px line crosses fewer check edges and reads as one stroke.
const stage = new ThemeStage(view3d, { theme, check: 2 });

// Lines and points have no surface to cast from, so the key light needn't render a shadow map.
stage.key.castShadow = false;
app.stage.addChild(view3d);

const positions = figureEightPositions(VERTEX_COUNT);
// A line list reads its indices in pairs, one segment each: 0 1, 1 2, 2 3 …, and 199 0 closes the loop.
const segmentIndices = new Uint16Array(VERTEX_COUNT * 2);

for (let i = 0; i < VERTEX_COUNT; i++) {
  segmentIndices[i * 2] = i;
  segmentIndices[i * 2 + 1] = (i + 1) % VERTEX_COUNT;
}

/** The path's vertices as a line list or a point list. Only a dynamic geometry draws part of itself */
function buildPath(topology, dynamic) {
  return new Geometry3D({
    positions,
    // Left out, the engine numbers the vertices 0, 1, 2 … and each draws once, in order.
    indices: topology === 'line-list' ? segmentIndices : undefined,
    topology,
    dynamic,
  });
}

// Built up front, so a switch only swaps the mesh's geometry.
const paths = {
  'line-list': {
    dynamic: buildPath('line-list', true),
    fixed: buildPath('line-list', false),
  },
  'point-list': {
    dynamic: buildPath('point-list', true),
    fixed: buildPath('point-list', false),
  },
};
// A line list cut a little short of halfway, so the cut shows before the reader touches anything.
const settings = {
  topology: 'line-list',
  drawn: 0.45,
  dynamic: true,
  torus: 'material',
};
const readout = { indexCount: 0 };
const path = new Mesh3D({
  geometry: paths[settings.topology].dynamic,
  material: new Material3D(flatOptions(BRAND.hotPink)),
  parent: view3d.root,
});

/** Puts the path on the geometry built for its topology and `dynamic`, and draws the first `drawn` share of it */
function showPath() {
  const geometry =
    paths[settings.topology][settings.dynamic ? 'dynamic' : 'fixed'];
  const group = settings.topology === 'line-list' ? 2 : 1;

  path.geometry = geometry;
  // In whole segments or points, and at least one, since 0 means the whole buffer.
  geometry.indexCount =
    Math.max(
      1,
      Math.round((settings.drawn * geometry.indices.length) / group),
    ) * group;
  readout.indexCount = geometry.indexCount;
  // Works round an engine bug: the batcher misses a new indexCount until the mesh re-keys, which rebuilds the batch's
  // draw list, cheap in a scene this small. Drop this once the engine reads the count at draw time.
  path.invalidate();
}

// The torus's own geometry is a triangle list. A material's topology wins, so on the first material it draws as its
// vertices; the second has none, so the geometry's triangles draw.
const torusMaterials = {
  material: new Material3D({
    ...flatOptions(BRAND.purple),
    topology: 'point-list',
  }),
  geometry: new Material3D(flatOptions(BRAND.purple)),
};
const torus = new Mesh3D({
  geometry: new TorusGeometry({
    radius: 0.85,
    tube: 0.34,
    radialSegments: 20,
    tubularSegments: 72,
  }),
  material: torusMaterials[settings.torus],
  position: { x: 0, y: 1.9, z: -1.6 },
  rotation: { x: 0, y: 0, z: 0.45 },
  parent: view3d.root,
});

/** Draws the torus with the material `settings.torus` names */
function showTorus() {
  torus.material = torusMaterials[settings.torus];
}

showPath();

// Higher than the kit's camera, looking down about 28°, so the figure-eight on the floor opens out. A screen taller
// than wide has height to spare, so there it looks down about 55°; the angle is chosen at load and kept on a turn.
const upright = app.screen.height > app.screen.width;

view3d.camera.fov = 40;
view3d.camera.position.set(0, upright ? 8.7 : 5.4, upright ? 5.5 : 8.4);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.9, z: 0 },
  enableDamping: true,
  enablePan: false,
  // Toward the pointer, so zooming in on the path keeps it in view, close enough to see a segment stay 1 px wide as
  // the floor checks grow.
  zoomToCursor: true,
  minDistance: 2.5,
  maxDistance: 18,
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the figure-eight, so the camera and the fog back off until it fits.
const fit = fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: FIT_ASPECT,
});
const pane = new ThemePane({ title: 'Lines and points', stage });

pane
  .addBinding(settings, 'topology', {
    options: { 'line-list': 'line-list', 'point-list': 'point-list' },
  })
  .on('change', showPath);
// Drawn moves in whole segments or points; the path has as many of either as vertices.
pane
  .addBinding(settings, 'drawn', {
    label: 'Drawn',
    min: 1 / VERTEX_COUNT,
    max: 1,
    step: 1 / VERTEX_COUNT,
    format: (share) => `${Math.round(share * 100)}%`,
  })
  .on('change', showPath);
pane.addBinding(settings, 'dynamic').on('change', showPath);
pane.addBinding(readout, 'indexCount', {
  readonly: true,
  format: (count) => count.toFixed(0),
});
pane
  .addBinding(settings, 'torus', {
    label: 'Torus',
    options: {
      "material's topology": 'material',
      "geometry's topology": 'geometry',
    },
  })
  .on('change', showTorus);

// Built once the pane has its rows, since the close-up docks under it.
const visuals = createVisuals({ app, view3d, stage, path, paths, pane, fit });

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  torus.rotation.y += dt * TORUS_TURN;
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
