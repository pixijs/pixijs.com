/**
 * The nine built-in geometries, and the options that size and subdivide them
 *
 * Each shape class reads its options once, in its constructor, and builds its triangles from them. So a change means a
 * new geometry for the mesh, and `destroy()` on the old one. Every shape is centred on its origin: width, height and
 * depth are full lengths, and radius and tube run from a centre, all in scene units. Segment counts set how many
 * triangles make up the surface, and the geometry's `vertexCount` and `indices` say what that costs to draw.
 *
 * Controls: drag to orbit, a little either side of the front; the pane picks a shape, sets its options, shows or
 * hides the wireframe, counts the vertices and triangles, and resets the shape. URL flags: `?theme=light|dark`,
 * `?renderer=webgl|webgpu`.
 */

import {
  CapsuleGeometry,
  ConeGeometry,
  CubeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  Mesh3D,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  View3D,
} from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import { createCatalogue, HERO_POSITION, poseHero, SHAPES } from './scene';

import { createVisuals } from './visuals';

/**
 * The narrowest view, width over height, framed as on a landscape screen. A tablet held upright is narrower, so there
 * too the scene drops below the open pane rather than under it.
 */
const FIT_ASPECT = 0.8;
/** The share of a landscape view's height from the y axis's tip to the row's tags, with a little to spare */
const FIT_HEIGHT = 0.88;

// Sizes are in scene units, picked to fill the hero's spot. Segment counts are each class's defaults but the capsule's.
// The round shapes are all built round +y.
const options = {
  // Flat in x and y, facing +z.
  PlaneGeometry: {
    width: 1.8,
    height: 1.8,
    widthSegments: 1,
    heightSegments: 1,
  },
  // Full lengths, so each edge spans 1.4 checks of the floor.
  CubeGeometry: {
    width: 1.4,
    height: 1.4,
    depth: 1.4,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1,
  },
  // `widthSegments` slices round +y, and `heightSegments` bands from pole to pole.
  SphereGeometry: { radius: 0.9, widthSegments: 32, heightSegments: 16 },
  // Twenty even triangles, and each `detail` step splits every one into four.
  IcosahedronGeometry: { radius: 0.9, detail: 0 },
  // `height` counts both caps, so a capsule is never shorter than 2 × radius. Each cap takes half `radialSegments` as
  // rings, so the default 32 packs this small capsule's wireframe solid; 16 meshes it as finely as the sphere.
  CapsuleGeometry: {
    radius: 0.5,
    height: 1.9,
    radialSegments: 16,
    heightSegments: 8,
  },
  // A radius of 0 closes that end to a point.
  CylinderGeometry: {
    radiusTop: 0.7,
    radiusBottom: 0.7,
    height: 1.6,
    radialSegments: 32,
    heightSegments: 1,
    openEnded: false,
  },
  // A cylinder whose `radiusTop` is 0.
  ConeGeometry: {
    radius: 0.8,
    height: 1.7,
    radialSegments: 32,
    heightSegments: 1,
    openEnded: false,
  },
  // A ring in x and z round +y: `radius` to the tube's centre line, `tube` from there to its surface.
  TorusGeometry: {
    radius: 0.65,
    tube: 0.27,
    radialSegments: 12,
    tubularSegments: 48,
    arc: Math.PI * 2,
    // The tube's sweep starts on its inner edge rather than its outer one, so the quarter it leaves out is the top of
    // the tube's inside, the side the camera sees. With that gap showing, `thetaStart` visibly turns it.
    thetaStart: Math.PI,
    thetaLength: Math.PI * 1.5,
  },
  // The knot winds `p` times round +y and `q` times through the hole; 2 and 3 make a trefoil.
  TorusKnotGeometry: {
    radius: 0.5,
    tube: 0.16,
    tubularSegments: 64,
    radialSegments: 8,
    p: 2,
    q: 3,
  },
};

/** Builds each class from its options: the one place each constructor is called */
const build = {
  PlaneGeometry: () => new PlaneGeometry(options.PlaneGeometry),
  CubeGeometry: () => new CubeGeometry(options.CubeGeometry),
  SphereGeometry: () => new SphereGeometry(options.SphereGeometry),
  IcosahedronGeometry: () =>
    new IcosahedronGeometry(options.IcosahedronGeometry),
  CapsuleGeometry: () => new CapsuleGeometry(options.CapsuleGeometry),
  CylinderGeometry: () => new CylinderGeometry(options.CylinderGeometry),
  ConeGeometry: () => new ConeGeometry(options.ConeGeometry),
  TorusGeometry: () => new TorusGeometry(options.TorusGeometry),
  TorusKnotGeometry: () => new TorusKnotGeometry(options.TorusKnotGeometry),
};

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Built-in shapes' });
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
// One check of the floor is one scene unit (the default, set here to say so), so a size reads against it.
const stage = new ThemeStage(view3d, { theme, check: 1 });

app.stage.addChild(view3d);

// A swatch of every class in a row, and the hero, which draws the selected swatch's own geometry and clay.
const swatches = createCatalogue({
  parent: view3d.root,
  geometries: SHAPES.map((shape) => build[shape]()),
});
const state = { shape: 'SphereGeometry', wireframe: true };
const counts = { vertices: 0, triangles: 0 };
const hero = new Mesh3D({
  geometry: swatches.meshes[state.shape].geometry,
  material: swatches.meshes[state.shape].material,
  position: HERO_POSITION,
  parent: view3d.root,
});

/** What the hero's shape costs to draw */
function count() {
  counts.vertices = hero.geometry.vertexCount;
  counts.triangles = hero.geometry.indices.length / 3;
}

/** Shows another class: one geometry, drawn by its swatch and the hero */
function select(shape) {
  const swatch = swatches.meshes[shape];

  state.shape = shape;
  hero.geometry = swatch.geometry;
  hero.material = swatch.material;
  poseHero(hero, shape, options);
  swatches.select(shape);
  count();
}

/** A geometry reads its options once, so a changed option means a new geometry */
function rebuild() {
  const old = hero.geometry;
  const swatch = swatches.meshes[state.shape];

  hero.geometry = build[state.shape]();
  // The hero and its swatch draw one geometry, so both move to the new one before the old one is freed.
  swatch.geometry = hero.geometry;
  // `true` destroys the old geometry's own buffers too, which is safe since no other geometry shares them.
  old.destroy(true);
  count();
  // An open cone tips back to show where its base was.
  poseHero(hero, state.shape, options);
}

select(state.shape);

const visuals = createVisuals({
  app,
  view3d,
  stage,
  hero,
  swatches,
  options,
  state,
});

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.1, 7.6);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.1, z: 0.4 },
  enableDamping: true,
  enablePan: false,
  minDistance: 4,
  maxDistance: 14,
  // The marks and the row are laid out for a view from the front, so the orbit stays near it, and above the floor.
  minAzimuthAngle: -Math.PI / 6,
  maxAzimuthAngle: Math.PI / 6,
  minPolarAngle: Math.PI * 0.3,
  maxPolarAngle: Math.PI * 0.45,
});

const pane = new ThemePane({ title: 'Built-in shapes', stage });

createControls({ pane, options, state, counts, select, rebuild });

// An upright screen is narrower than the hero and its marks, so the camera and the fog back off, and the scene centres
// in the band below the pane, backing off further when the band is too short for it. The pane grows as it opens and
// as a class with more rows shows, so the band follows it.
const fit = fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: FIT_ASPECT,
  minHeight: FIT_HEIGHT,
  clearTop: pane.element.getBoundingClientRect().bottom,
});

new ResizeObserver(() => {
  fit.clearTop = pane.element.getBoundingClientRect().bottom;
  fit.refit();
}).observe(pane.element);

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  swatches.update(dt, app.screen);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
swatches.update(0, app.screen);
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
