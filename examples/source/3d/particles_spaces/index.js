/**
 * A particle system's `space` decides whether its particles ride with the node or stay where they were born
 *
 * Two cubes go round, each carrying a `ParticleSystem3D` built from the same options, one with `space: 'local'` and
 * one with `space: 'world'`. Local sparks travel with their emitter like a candle flame on a moving tray; world sparks
 * keep the place they were born, so a moving emitter leaves a trail. Standing still, the two plumes take one shape.
 *
 * Controls: drag to orbit; the pane sets how fast the cubes turn (0 stands them still) and each cube's space. URL
 * flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { seededRandom, View3D } from '@pixi/3d';

import { ConeShape, OrbitCamera, ParticleSystem3D } from '@pixi/3d/extras';

import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { sparkTexture } from './theme/particles';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createRing, createRingMotion, CUBE_NAMES, layoutRings } from './scene';

import { createVisuals } from './visuals';

/** In rad/s: a turn in about 8 s, slow enough to read the trail, and a multiple of its pane row's step */
const TURN_SPEED = 0.8;
/** At TURN_SPEED a cube travels about 1.2 a second, so the 3 s trail lies along over a third of its ring */
const RING_RADIUS = 1.45;
/** Where the sparks leave, just above the cube's top face, so none starts inside it */
const NOZZLE_Y = 0.45;
/** Seconds run before the first frame: longer than the longest life, so the trail is whole when the page shows */
const WARM_UP = 3.5;
/** The rings' angle on the first frame: front-right, where the trail and both of the pink axes' heads show */
const FIRST_FRAME_ANGLE = -0.7;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Local and world space' });
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

// layoutRings sizes it and follows the screen, growing it past an edge to keep the rings under the pane.
const view3d = new View3D();
const stage = new ThemeStage(view3d, { theme });
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();

app.stage.addChild(view3d);

// One options object for both systems, so the only difference between them is `space`.
const sparkOptions = {
  texture: sparkTexture(),
  // 60 a second for the longest life, 3 s.
  capacity: 180,
  emitRate: 60,
  shape: new ConeShape({ angle: 20, radius: 0.15 }),
  life: [2.4, 3],
  speed: [0.6, 1],
  size: [0.1, 0.16],
  sizeEnd: 0.05,
  alpha: 0.9,
  alphaEnd: 0,
  // Up, so the sparks rise like embers. It's in the system's own space, like their velocity.
  gravity: { x: 0, y: 0.55, z: 0 },
  drag: 1.5,
  // One seed: built and stepped together on load, the two systems draw the same sparks. One that setSpace builds
  // later starts the sequence over, so from then on the two plumes take the same shape but not the same sparks.
  createRandom: () => seededRandom('sparks'),
  // Stepped from app.ticker, so each frame's new sparks are in that frame's render and the warm-up can run them.
  autoUpdate: false,
};

const rings = {
  pink: createRing({ color: 'pink', radius: RING_RADIUS, parent: view3d.root }),
  sky: createRing({ color: 'sky', radius: RING_RADIUS, parent: view3d.root }),
};

/** One cube's sparks: the shared options in the given space and the cube's colour */
function createSparks(ring, space) {
  const sparks = new ParticleSystem3D({
    ...sparkOptions,
    space,
    color: ring.color,
    position: { x: 0, y: NOZZLE_Y, z: 0 },
  });

  // A child of the cube, so the emitter goes where the cube goes; `space` decides whether its sparks do.
  ring.cube.addChild(sparks);

  return sparks;
}

// 'world' is the default, written out for the contrast.
const sparks = {
  pink: createSparks(rings.pink, 'local'),
  sky: createSparks(rings.sky, 'world'),
};

/** `space` is read-only on a live system, so a new space means a new system in the old one's place */
function setSpace(name, space) {
  // A plain destroy() leaves the shared spark texture alive.
  sparks[name].destroy();
  sparks[name] = createSparks(rings[name], space);
}

const motion = createRingMotion(rings, {
  speed: TURN_SPEED,
  firstFrameAngle: FIRST_FRAME_ANGLE,
  warmUp: WARM_UP,
});

view3d.camera.fov = 40;

// The distance limits are the side-by-side view's; layoutRings scales them with the camera.
const orbit = new OrbitCamera({
  view: view3d,
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

const pane = new ThemePane({ title: 'Local and world space', stage });

// At 0 the cubes stand still, and once the sparks born on the move have died the two plumes take the same shape.
// Tweakpane counts the step from the row's first value; TURN_SPEED is a multiple of it, so 0 reads 0.00, not -0.00.
pane.addBinding(motion, 'speed', {
  label: 'Turn speed',
  min: -1.2,
  max: 1.2,
  step: 0.05,
});

const spaceRows = pane.addFolder({ title: 'space' });
const spaces = { pink: sparks.pink.space, sky: sparks.sky.space };
const spaceList = { local: 'local', world: 'world' };

for (const name of CUBE_NAMES) {
  spaceRows
    .addBinding(spaces, name, { options: spaceList })
    .on('change', ({ value }) => setSpace(name, value));
}

// Side by side on a wide screen, stacked on a tall one, and under the pane: its title bar on a phone, or all its rows.
const clearTop = pane.element.getBoundingClientRect().bottom;
const layout = layoutRings({
  renderer: app.renderer,
  view3d,
  orbit,
  stage,
  rings,
  clearTop,
});
const visuals = createVisuals({ app, view3d, stage, rings, sparks, layout });

// The rings run WARM_UP seconds before the first frame, so the trail is already drawn when the canvas appears. The
// world system reads where its cube is at each birth, so the trail lies where the cube really went.
for (let step = 0; step < WARM_UP * 60; step++) {
  motion.step(1 / 60);
  sparks.pink.update();
  sparks.sky.update();
}

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  motion.step(dt);
  sparks.pink.update(ticker);
  sparks.sky.update(ticker);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
