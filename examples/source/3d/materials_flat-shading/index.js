/**
 * Flat shading: one normal per triangle, for the faceted low-poly look
 *
 * `flatShading: true` makes a `Material3D` light each triangle with its own face normal instead of blending its
 * vertex normals. The shader works the face normal out per pixel, so the geometry stays the same and the material
 * alone decides. The option is fixed when a material is built, so `setFlatShading` switches by swapping between two
 * materials. A ring of normals round the ball's outline shows which normals the material lights with.
 *
 * Controls: drag to orbit; the pane switches flatShading on every mesh and sets the ball's detail, from 20 to 1,280
 * triangles. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { IcosahedronGeometry, Material3D, Mesh3D, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { CLAY, THEMES, themeFromUrl } from './theme/palette';

import { clayGeometry } from './theme/shapes';

import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the ball, its ring and the four shapes whole */
const FIT_ASPECT = 0.93;
/** Half a radius off the floor, so the ring's lowest hairs stay above the shapes round it */
const BALL_POSITION = { x: 0, y: 1.5, z: 0 };
/** The key comes more from the side than the stage's, so the faces toward the camera each catch it at its own angle */
const KEY_POSITION = { x: -7, y: 12, z: 4 };
/** Radians a second: slow enough that each facet's change of shade reads */
const SPIN_SPEED = 0.35;
/** Radians between one shape's turn and the next, so no two show the same side */
const SPIN_PHASE = 1.3;
/** The shapes are supporting cast beside the unit ball */
const SHAPE_SCALE = 0.85;
/**
 * Round the ball, close enough in to fit a phone held upright. The tall octahedron stands beside the ball, not behind
 * it, so it never rises into the ring's lower hairs as the camera orbits left, and the puck sits in from it so the two
 * stay apart there.
 */
const SHAPE_SPOTS = [
  { shape: 'torus', color: 'pink', x: -2.0, z: -1.3 },
  { shape: 'capsule', color: 'lilac', x: -0.95, z: 1.1 },
  { shape: 'puck', color: 'purple', x: 0.7, z: 1.35 },
  { shape: 'octahedron', color: 'orange', x: 2.15, z: -0.3 },
];

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Low-poly look' });
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

// A directional light shines the way it faces, so from its new place it looks back at the floor.
stage.key.position.copyFrom(KEY_POSITION);
stage.key.lookAt({ x: 0, y: 0, z: 0 });
app.stage.addChild(view3d);

/** `flatShading` is fixed once a material is built, so each look needs a material of its own */
function createLooks(baseColor) {
  const smooth = new Material3D({ baseColor });
  const faceted = new Material3D({ baseColor, flatShading: true });

  return { smooth, faceted };
}

// A geodesic ball's triangles are all about the same size, so every face reads.
const ballOptions = { detail: 1 };
const ballLooks = createLooks(CLAY.sky);
const ball = new Mesh3D({
  geometry: new IcosahedronGeometry(ballOptions),
  material: ballLooks.faceted,
  position: BALL_POSITION,
  parent: view3d.root,
});

const shapes = SHAPE_SPOTS.map(({ shape, color, x, z }, i) => {
  const geometry = clayGeometry(shape, 'low');
  const looks = createLooks(CLAY[color]);
  // The y stands the shape on the floor.
  const mesh = new Mesh3D({
    geometry,
    material: looks.faceted,
    position: { x, y: -geometry.bounds3D.min.y * SHAPE_SCALE, z },
    rotation: { x: 0, y: i * SPIN_PHASE, z: 0 },
    scale: SHAPE_SCALE,
    parent: view3d.root,
  });

  return { mesh, looks };
});
/** Every mesh with both its looks, so one loop switches them all */
const switchable = [{ mesh: ball, looks: ballLooks }, ...shapes];

/** The whole switch: each mesh draws with its other material, and its geometry stays as it is */
function setFlatShading(on) {
  for (const { mesh, looks } of switchable)
    mesh.material = on ? looks.faceted : looks.smooth;
}

/** A geometry reads its options once, so a new detail means a new geometry */
function setDetail(detail) {
  const previous = ball.geometry;

  ballOptions.detail = detail;
  ball.geometry = new IcosahedronGeometry(ballOptions);
  // `true` frees the old geometry's own buffers too, which nothing else shares.
  previous.destroy(true);
}

const visuals = createVisuals({ app, view3d, stage, ball });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.7, 7.9);

// The scene is laid out for a view from the front, so the orbit stays near it, where no shape rises into the ring.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.1, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 5,
  maxDistance: 12,
  minAzimuthAngle: -0.3,
  maxAzimuthAngle: 0.6,
  minPolarAngle: 1.15,
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the shapes' spread, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Low-poly look', stage });
// The rows bind copies: `flatShading` is readonly on a material, and a geometry reads `detail` only when it's built.
const params = {
  flatShading: ball.material.flatShading,
  detail: ballOptions.detail,
};

pane
  .addBinding(params, 'flatShading')
  .on('change', ({ value }) => setFlatShading(value));
// Past 3 a faceted ball already passes for smooth.
pane
  .addBinding(params, 'detail', { min: 0, max: 3, step: 1 })
  .on('change', ({ value }) => setDetail(value));

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  // The shapes turn slowly, so their facets catch the light.
  for (let i = 0; i < shapes.length; i++)
    shapes[i].mesh.rotation.y += dt * SPIN_SPEED;
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
