/**
 * Take a castle out of the scene three ways, `removeChild`, `unload()` and `destroy(options)`, see what each one
 * keeps, and bring it back
 *
 * Taking a castle out with `removeChild` frees nothing, so it comes back at once. `unload()` frees its GPU copy and
 * keeps the CPU copy, so the next render after it's back uploads it again, and it looks the same. `destroy()` ends it
 * for good, so it has to be built again, and `Destroy3DOptions` decides what goes with it: every flag is off by
 * default, and one left off leaks what it guards.
 *
 * Controls: drag to orbit; the pane takes the castles out and brings them back, sets the destroy flags, reads out
 * the GPU and CPU memory the castles hold, and frees what leaked. URL flags: `?theme=light|dark`,
 * `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';

import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import { createMemory } from './memory';
import { CALLS, createBays, createCastle, frameBays } from './scene';

import { createVisuals } from './visuals';

/** How far the bays sway each way, in radians, and how fast: about a 14 s period */
const SWAY = 0.15;
const SWAY_SPEED = 0.45;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Unload and rebuild' });
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

const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });

app.stage.addChild(view3d);

// One castle in each bay, each built from scratch with its own geometry, clay and painted map.
const bays = createBays(view3d.root);
const destroyBay = bays[CALLS.indexOf('destroy')];
const leaked = [];

// Every flag is false by default, since children, geometry, materials and textures are often shared. A castle owns
// everything it built, so it passes them all.
const destroyOptions = {
  children: true,
  geometry: true,
  material: true,
  texture: true,
  textureSource: true,
};
const state = { inScene: true };

/** Takes a bay's castle out of the scene, and frees what the bay's call frees */
function takeOut(bay, castle) {
  // Every way out starts here. On its own it frees nothing: the castle stays on the GPU, ready to show again at once.
  bay.slot.removeChild(castle.root);
  if (bay.call === 'unload') {
    // Each mesh frees its geometry's GPU copy and keeps the vertex arrays for the next upload.
    castle.root.unload();
    // A container's unload leaves materials alone, since they're often shared, so the castle frees its own maps. A
    // glTF Model3D's own unload() does this for you.
    for (const material of castle.materials) material.unload();
  } else if (bay.call === 'destroy') {
    castle.root.destroy(destroyOptions);
    // The bay lets go of it too, so bringing it back builds a new one.
    bay.castle = null;
    // A flag left off leaves that part alive with nothing using it, and only the castle's own lists still reach it.
    if (!Object.values(destroyOptions).every(Boolean)) leaked.push(castle);
  }
}

/** Puts a bay's castle back in the scene, built again if it was destroyed */
function bringBack(bay) {
  bay.castle ??= createCastle();
  // Its next render uploads whatever isn't on the GPU.
  bay.slot.addChild(bay.castle.root);

  return bay.castle;
}

/** Takes every castle out, or brings every one back, as the pane's `in scene` row says */
function moveCastles() {
  for (const bay of bays) {
    if (state.inScene) bringBack(bay);
    else if (bay.castle) takeOut(bay, bay.castle);
  }
}

/** Frees what a destroy with a flag off left behind, through the castle's own lists */
function freeLeaked() {
  for (const castle of leaked) {
    // Meshes, geometry and materials ignore a second destroy.
    for (const mesh of castle.meshes) mesh.destroy();
    for (const geometry of castle.geometries) geometry.destroy(true);
    for (const material of castle.materials) material.destroy();
    // pixi's sources and textures don't, and a destroyed texture still holds the source its destroy spared.
    for (const { source } of castle.textures)
      if (!source.destroyed) source.destroy();
    for (const texture of castle.textures)
      if (!texture.destroyed) texture.destroy();
  }
  leaked.length = 0;
}

// The engine has no memory readout, so this counts what the castles hold for the pane and the visuals.
const memory = createMemory(bays);
const visuals = createVisuals({ app, view3d, stage, bays, leaked, memory });

frameBays(app, view3d, stage);

/** Draws a frame now, outside the ticker, with the memory count and the visuals brought up to date first */
function drawNow() {
  memory.update();
  visuals.update();
  app.render();
}

/** Destroys the destroy bay's castle again with the flags as they are now, while the castles are out */
function destroyAgain() {
  // What earlier destroys leaked goes first, so the bay shows what these flags leave.
  freeLeaked();
  const castle = bringBack(destroyBay);

  // A destroy only frees GPU copies that exist, so the new castle is drawn once first, as the boot does, then the
  // frame is drawn again without it, so the canvas never holds the one with it in.
  drawNow();
  takeOut(destroyBay, castle);
  drawNow();
}

// Drawn once with every castle in, which puts each one on the GPU, then taken out: the scene opens on what each way
// out keeps.
drawNow();
state.inScene = false;
moveCastles();

const pane = new ThemePane({ title: 'Unload and rebuild', stage });

createControls({
  pane,
  state,
  destroyOptions,
  readout: memory.readout,
  leaked,
  moveCastles,
  destroyAgain,
  freeLeaked,
});

let elapsed = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  elapsed += dt;
  stage.update(dt);
  for (const bay of bays)
    bay.slot.rotation.y = SWAY * Math.sin(SWAY_SPEED * elapsed);
  memory.update();
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
drawNow();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
