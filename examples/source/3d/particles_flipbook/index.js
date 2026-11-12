/**
 * Flipbook particles, billboard modes and blend modes, on a clay campfire
 *
 * A `ParticleSystem3D` draws each particle as a flat square card. Cut frames from one sheet and pass them as
 * `texture`, and `frameMode` picks which frame a card shows; `billboard` turns the cards to the camera, upright or
 * flat on the ground; `blendMode` says how their colour meets what's behind. Three systems show the three billboard
 * modes at once: upright flames, puffs of smoke that face the camera fully, and heat rings flat on the floor.
 * `frameMode` and `billboard` are built into the shader, so changing one builds a new system; `frameRate` and
 * `blendMode` change a running one.
 *
 * Controls: drag to orbit, and look down on the fire to see the billboard modes part; the pane sets the flames'
 * frameMode, frameRate, billboard and blendMode, and Theme puts them over a dark floor. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { seededRandom, View3D } from '@pixi/3d';
import { ConeShape, OrbitCamera, ParticleSystem3D } from '@pixi/3d/extras';

import { Application, Rectangle, Texture } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, mixColor, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createCampfire } from './scene';
import {
  drawFlameSheet,
  drawRingTexture,
  drawSmokeSheet,
  FLAME_GRID,
  SMOKE_GRID,
} from './sheets';

/** The narrowest view, width over height, that shows the fire and its rings whole from the landscape distance */
const FIT_ASPECT = 0.8;
/** The smoke's tint over its white puffs: a mid grey on the light floor that still reads pale on the dark one */
const SMOKE_COLOR = mixColor(THEMES.light.inkSoft, BRAND.white, 0.35);

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Fire and smoke' });
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
// The dark theme's spotlight pools on the fire, so the logs and stones don't sink into the night.
const stage = new ThemeStage(view3d, { theme, spotlight: true });

app.stage.addChild(view3d);
createCampfire(view3d.root);

/**
 * Cuts a sheet into `columns` × `rows` frames, left to right then top to bottom, all on the sheet's one source
 *
 * A sheet from a texture packer comes as a `Spritesheet`'s `animations`; this one is drawn on a canvas, so it's cut by
 * hand. A system draws in one call that binds one texture, which is why every frame has to share the source.
 */
function sliceFrames(sheet, columns, rows) {
  const width = sheet.width / columns;
  const height = sheet.height / rows;

  return Array.from({ length: columns * rows }, (_, i) => {
    const frame = new Rectangle(
      (i % columns) * width,
      Math.floor(i / columns) * height,
      width,
      height,
    );

    return new Texture({ source: sheet.source, frame });
  });
}

// 16 frames of one flame's life, from a bright teardrop to a fading wisp, and four puff shapes.
const flameFrames = sliceFrames(
  drawFlameSheet(),
  FLAME_GRID.columns,
  FLAME_GRID.rows,
);
const smokeFrames = sliceFrames(
  drawSmokeSheet(),
  SMOKE_GRID.columns,
  SMOKE_GRID.rows,
);

/** A new system starts empty, so this steps it ahead and the column is already burning on its first frame */
function warm(system, seconds) {
  for (let t = 0; t < seconds; t += 1 / 60) system.update();

  return system;
}

/** What the pane changes: four of the flames' own options */
const flameOptions = {
  // The sheet plays once over each flame's life, so every flame ends on its faded last frame as it dies.
  frameMode: 'overLife',
  // Used by 'animate' only: 16 frames at 24 a second take 0.67 s, so a flame loops back to its first frame mid-air.
  frameRate: 24,
  // Upright cards that turn about the vertical only, so a flame doesn't tip over when the camera looks down.
  billboard: 'cylindrical',
  // The light floor is nearly white and 'add' only brightens, so the fire opens on 'normal'.
  blendMode: 'normal',
};

function buildFlames() {
  return warm(
    new ParticleSystem3D({
      texture: flameFrames,
      frameMode: flameOptions.frameMode,
      frameRate: flameOptions.frameRate,
      billboard: flameOptions.billboard,
      blendMode: flameOptions.blendMode,
      capacity: 24,
      emitRate: 12,
      shape: new ConeShape({ angle: 10, radius: 0.3 }),
      life: [1.1, 1.4],
      speed: [0.7, 0.9],
      // Hot gas rises, so the pull is upward.
      gravity: { x: 0, y: 1, z: 0 },
      size: [0.8, 1.05],
      sizeEnd: [0.32, 0.45],
      createRandom: () => seededRandom('flames'),
      // Stepped from app.ticker below, before each render, so a new flame draws on the frame it's born.
      autoUpdate: false,
      position: { x: 0, y: 0.4, z: 0 },
      parent: view3d.root,
    }),
    1.4,
  );
}

let flames = buildFlames();

const smoke = warm(
  new ParticleSystem3D({
    texture: smokeFrames,
    // Four puff shapes dealt one per puff, so the column looks varied with no animation.
    frameMode: 'random',
    // Each card faces the camera fully, so a puff looks round from anywhere.
    billboard: 'spherical',
    capacity: 24,
    emitRate: 6,
    shape: new ConeShape({ angle: 14, radius: 0.25 }),
    life: [2.2, 2.8],
    speed: [0.5, 0.7],
    drag: 0.4,
    // A light breeze.
    gravity: { x: -0.12, y: 0.2, z: 0 },
    size: [0.4, 0.5],
    sizeEnd: [0.9, 1.2],
    alpha: 0.8,
    alphaEnd: 0,
    color: SMOKE_COLOR,
    createRandom: () => seededRandom('smoke'),
    autoUpdate: false,
    position: { x: 0, y: 2.4, z: 0 },
    parent: view3d.root,
  }),
  2.8,
);

const rings = warm(
  new ParticleSystem3D({
    texture: drawRingTexture(),
    // Flat on the ground, so they spread over the floor whatever the camera does.
    billboard: 'horizontal',
    capacity: 4,
    emitRate: 1.5,
    life: 2.2,
    size: 0.9,
    sizeEnd: 5,
    alphaEnd: 0,
    color: BRAND.orange,
    autoUpdate: false,
    // Under the ash bed's top and the stones' bottoms, so a ring comes out from under the fire and slides under them.
    position: { x: 0, y: 0.01, z: 0 },
    parent: view3d.root,
  }),
  2.2,
);

// 7 units from the middle of the column and 40° above it. Orbit higher and the upright flame cards foreshorten while
// the puffs keep facing the camera.
view3d.camera.fov = 40;
view3d.camera.position.set(0, 6.2, 5.36);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.7, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  minPolarAngle: 0.45,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.47,
});

// A portrait screen is narrower than the rings, so the camera and the fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Fire and smoke', stage });
const frameModeRow = pane.addBinding(flameOptions, 'frameMode', {
  options: { overLife: 'overLife', animate: 'animate', random: 'random' },
});
const frameRateRow = pane.addBinding(flameOptions, 'frameRate', {
  min: 2,
  max: 30,
  step: 1,
  disabled: flameOptions.frameMode !== 'animate',
});
const billboardRow = pane.addBinding(flameOptions, 'billboard', {
  options: {
    spherical: 'spherical',
    cylindrical: 'cylindrical',
    horizontal: 'horizontal',
  },
});
const blendModeRow = pane.addBinding(flameOptions, 'blendMode', {
  options: {
    normal: 'normal',
    add: 'add',
    multiply: 'multiply',
    screen: 'screen',
  },
});

/** Builds the flames again from `flameOptions`; `destroy` frees what the old system built and keeps our frames */
function rebuildFlames() {
  flames.destroy();
  flames = buildFlames();
  frameRateRow.disabled = flameOptions.frameMode !== 'animate';
}

// frameMode and billboard are built into the system's shader, so a change builds a new one; frameRate and blendMode
// are setters on the running system.
frameModeRow.on('change', rebuildFlames);
billboardRow.on('change', rebuildFlames);
frameRateRow.on('change', () => (flames.frameRate = flameOptions.frameRate));
blendModeRow.on('change', () => (flames.blendMode = flameOptions.blendMode));

app.ticker.add((ticker) => {
  stage.update(Math.min(ticker.deltaMS / 1000, 1 / 15));
  flames.update(ticker);
  smoke.update(ticker);
  rings.update(ticker);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
