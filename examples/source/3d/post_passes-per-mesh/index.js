/**
 * Passes per mesh: one mesh joins or leaves a render pass on its own, whatever its material says
 *
 * `mesh.enablePass('outline')` puts one shape in the `OutlinePass` while the five that share its clay stay out, where
 * `material.enablePass('outline')` takes every shape that wears it. `disablePass('opaque')` hides the sky capsule but
 * keeps it in the shadow pass, so only its shadow walks the lane. `castShadow` is that 'shadow' pass by another name.
 *
 * Controls: drag to orbit; hover or tap a shape to outline it; hover the air over the moving shadow to outline the
 * capsule, and tap to show or hide it; the pane sets the join and the capsule's passes. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';

import { OrbitCamera, OutlinePass } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import {
  brightenKey,
  createField,
  createHiddenCapsule,
  OUTLINED_AT_START,
  placeKey,
  wander,
} from './scene';
import { createVisuals } from './visuals';

const TITLE = 'Passes per mesh';
/** The narrowest view, width over height, that shows the field whole from the landscape distance */
const FIT_ASPECT = 1.4;
/** In each mesh's own units: about 6 px round a shape from the start view */
const OUTLINE_WIDTH = 0.07;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: TITLE });
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

// Named 'outline', it draws each member again as a slightly larger shell turned inside out, so a rim shows round it.
const view3d = new View3D({
  autoResize: true,
  passes: [new OutlinePass({ width: OUTLINE_WIDTH, color: BRAND.hotPink })],
});
// The dark theme's form light lights the floor without casting, which would wash the shadows out there.
const stage = new ThemeStage(view3d, { theme, form: false });

app.stage.addChild(view3d);
placeKey(stage);

/** How the field joins the outline: each mesh on its own, or each material with every mesh that wears it */
let joinBy = 'mesh';

function join(shape) {
  if (joinBy === 'mesh') shape.enablePass('outline');
  else shape.material.enablePass('outline');
}

function leave(shape) {
  if (joinBy === 'mesh') shape.disablePass('outline');
  else shape.material.disablePass('outline');
}

/** The twelve shapes, each picked against its triangles, so the torus's hole hovers nothing */
function buildField() {
  const shapes = createField(view3d.root, {
    eventMode: 'static',
    hitVolume: 'geometry',
    cursor: 'pointer',
  });

  // A held button is an orbit drag crossing shapes, so only a free pointer or a tap moves the outline.
  for (const shape of shapes) {
    shape.on('pointerenter', (e) => {
      if (e.buttons === 0) moveOutline(shape);
    });
    shape.on('pointertap', () => moveOutline(shape));
  }

  return shapes;
}

let field = buildField();
let outlined = field[OUTLINED_AT_START];

function moveOutline(shape) {
  leave(outlined);
  outlined = shape;
  join(outlined);
}

// The outline's shader compiles when the first mesh joins, a stall that would land on the first hover, so one joins
// now, under the loading screen. `disablePass` does nothing for a pass name nothing has joined yet.
join(outlined);

/** Material mode needs fresh shapes: a mesh's own `enablePass` or `disablePass` outranks its material's for good */
function setJoinBy(next) {
  const slot = field.indexOf(outlined);

  leave(outlined);
  joinBy = next;
  if (joinBy === 'material') {
    for (const shape of field) shape.destroy();
    field = buildField();
  }
  outlined = field[slot];
  join(outlined);
}

// 'dynamic', since it moves: the view picks again under a still pointer, so it hears enter and leave as it walks.
const hidden = createHiddenCapsule(view3d.root, {
  eventMode: 'dynamic',
  hitVolume: 'geometry',
  cursor: 'pointer',
});
const hiddenState = { opaque: false, wander: true };

// Out of 'opaque' nothing of it draws, yet it still casts, picks and joins 'outline', by mesh as its clay is its own.
hidden.disablePass('opaque');
hidden.on('pointerenter', () => hidden.enablePass('outline'));
hidden.on('pointerleave', () => hidden.disablePass('outline'));

function setOpaque(opaque) {
  hiddenState.opaque = opaque;
  if (opaque) hidden.enablePass('opaque');
  else hidden.disablePass('opaque');
}

const visuals = createVisuals({ app, view3d, stage, hidden, hiddenState });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 5.6, 9);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.2, z: 0.3 },
  enableDamping: true,
  enablePan: false,
  minDistance: 7,
  maxDistance: 18,
  // High enough to see down the lane between the rows.
  minPolarAngle: Math.PI * 0.1,
  maxPolarAngle: Math.PI * 0.38,
});

// A portrait screen is narrower than the field, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: TITLE, stage });

// Bound to a copy: the pane writes its object before `change` runs, and `leave` needs the mode being left.
pane
  .addBinding({ joinBy }, 'joinBy', {
    label: 'Join by',
    options: { 'mesh.enablePass': 'mesh', 'material.enablePass': 'material' },
  })
  .on('change', ({ value }) => setJoinBy(value));

const hiddenFolder = pane.addFolder({ title: 'hidden capsule' });
const opaqueRow = hiddenFolder
  .addBinding(hiddenState, 'opaque')
  .on('change', ({ value }) => setOpaque(value));

// Its place in the 'shadow' pass.
hiddenFolder.addBinding(hidden, 'castShadow');
hiddenFolder.addBinding(hiddenState, 'wander', { label: 'Wander' });

hidden.on('pointertap', () => {
  setOpaque(!hiddenState.opaque);
  opaqueRow.refresh();
  pane.flash(opaqueRow);
});

let wanderTime = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  brightenKey(stage);
  // It stands still while it's drawn, so a caught capsule stays caught.
  if (hiddenState.wander && !hiddenState.opaque) {
    wanderTime += dt;
    wander(hidden, wanderTime);
  }
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
