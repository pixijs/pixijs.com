/**
 * Level of detail in application code: swap a mesh's geometry with its distance from the camera, and keep a band
 * between switches
 *
 * Both subjects share three sphere geometries: high, medium and low detail. Each frame measures the camera's distance
 * to each subject and sets Mesh3D.geometry to the level for it. The left switches the moment it crosses a threshold;
 * the right waits until it is a hysteresis band past one, so a small move near a threshold doesn't keep swapping its
 * geometry. The pair travels out to low detail and back, then hovers across the first threshold, where the left
 * flips between high and medium while the right holds its level. This is a policy built from Mesh3D.geometry, not
 * an engine LOD component.
 *
 * Controls: drag to orbit and scroll to zoom, both of which change the distance; the pane pauses the travel, moves
 * the subjects away (which pauses it too), sets the band, and reads each subject's distance, triangles and swaps.
 * URL flags: ?theme=light|dark, ?renderer=webgl|webgpu.
 */

import { Material3D, Mesh3D, SphereGeometry, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import { createVisuals } from './visuals';

/** Centre distances in world units; the two thresholds divide high, medium and low detail. */
const THRESHOLDS = [16, 24];
/** The travel's near end, 15 units out: high detail, but inside the right subject's band past the first threshold */
const NEAR_TRAVEL = 3.7;
/** The travel's far end and the pane's limit: 29 units out, past the second threshold and its band */
const FAR_TRAVEL = 18;
/** How far the hover rises from the near end: across the first threshold, and still inside the band */
const HOVER = 1.4;
/** Seconds for one loop of the travel: half out and back, half hovering */
const LOOP = 24;
/** The subjects' idle turn, in radians per second: slow enough to read the facets, and it never changes a distance */
const SPIN = 0.12;
/** The narrowest view, width over height, that holds both subjects at a zoom of 1 */
const FIT_ASPECT = 0.95;

const theme = themeFromUrl();
const loading = new LoadingScreen({ theme, label: 'Level of detail' });
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
const stage = new ThemeStage(view3d, { theme, fog: { near: 35, far: 65 } });

app.stage.addChild(view3d);

view3d.camera.fov = 40;
view3d.camera.position.set(0, 4, 11);
// Aimed above the subjects, so they sit below the open pane on a phone; the aim leaves every distance as it was.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 2.3, z: -3 },
  enableDamping: true,
  enablePan: false,
});

// A narrow screen zooms the lens out rather than backing the camera off, as `fitPortrait` would: the policy reads the
// camera's distance to each subject, so moving the camera would change every level.
function fitWidth() {
  view3d.camera.zoom = Math.min(
    1,
    app.screen.width / app.screen.height / FIT_ASPECT,
  );
}

fitWidth();
app.renderer.on('resize', fitWidth);

// Built once and shared: changing level never builds or destroys geometry in the frame loop.
const geometries = [
  new SphereGeometry({ radius: 1.25, widthSegments: 32, heightSegments: 20 }),
  new SphereGeometry({ radius: 1.25, widthSegments: 12, heightSegments: 8 }),
  new SphereGeometry({ radius: 1.25, widthSegments: 6, heightSegments: 4 }),
];
const state = { travel: NEAR_TRAVEL, hysteresis: 1.2 };
const motion = { animate: true, time: 0 };

/** The travel at a time into the loop. Both halves start and end at rest at the near end, so the loop never jumps. */
function travelAt(time) {
  const beat = time % LOOP;
  const half = LOOP / 2;

  if (beat < half)
    return (
      NEAR_TRAVEL +
      ((FAR_TRAVEL - NEAR_TRAVEL) / 2) *
        (1 - Math.cos((2 * Math.PI * beat) / half))
    );

  // Six rises across the first threshold, one every two seconds.
  return NEAR_TRAVEL + (HOVER / 2) * (1 - Math.cos(Math.PI * (beat - half)));
}

/** Steps a level up or down past each threshold the distance has cleared by `band` */
function pickLevel(level, distance, band) {
  while (level < THRESHOLDS.length && distance > THRESHOLDS[level] + band)
    level++;
  while (level > 0 && distance < THRESHOLDS[level - 1] - band) level--;

  return level;
}

/** A mesh, the level it draws at, and what the pane reads about it */
function createSubject(name, color, x, banded) {
  const position = { x, y: 1.5, z: -state.travel };
  const distance = view3d.camera.position.distanceTo(position);
  // Built at the level its opening distance picks coming from high detail, so neither swap count starts above 0.
  const level = pickLevel(0, distance, banded ? state.hysteresis : 0);
  const mesh = new Mesh3D({
    geometry: geometries[level],
    material: new Material3D({
      baseColor: color,
      roughness: 0.75,
      flatShading: true,
    }),
    position,
    parent: view3d.root,
  });

  return {
    name,
    mesh,
    banded,
    level,
    distance,
    triangles: geometries[level].indices.length / 3,
    swaps: 0,
  };
}

const subjects = [
  createSubject('No band', BRAND.pink, -1.7, false),
  createSubject('With band', BRAND.sky, 1.7, true),
];

const pane = new ThemePane({ title: 'Level of detail', stage });
const controls = createControls({
  pane,
  state,
  motion,
  maxTravel: FAR_TRAVEL,
  subjects,
});

const visuals = createVisuals({ app, view3d, stage, subjects });
let time = 0;

function frame(dt) {
  time += dt;
  stage.update(dt);
  if (motion.animate) {
    motion.time += dt;
    state.travel = travelAt(motion.time);
    controls.syncTravel();
  }
  for (const subject of subjects) {
    const { mesh } = subject;

    mesh.position.z = -state.travel;
    mesh.rotation.y = time * SPIN;
    subject.distance = view3d.camera.position.distanceTo(mesh.position);
    const level = pickLevel(
      subject.level,
      subject.distance,
      subject.banded ? state.hysteresis : 0,
    );

    // A swap rebuilds the mesh's shader and store row, which is the cost the band saves near a threshold.
    if (level !== subject.level) {
      mesh.geometry = geometries[level];
      subject.level = level;
      subject.triangles = geometries[level].indices.length / 3;
      subject.swaps++;
    }
  }
  visuals.update();
}

app.ticker.add((ticker) => frame(Math.min(ticker.deltaMS / 1000, 1 / 15)));
orbit.update();
frame(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
