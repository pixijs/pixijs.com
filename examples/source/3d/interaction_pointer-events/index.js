/**
 * A mesh hears the pointer the way a pixi Sprite does
 *
 * Set `mesh.eventMode = 'static'`, add listeners with `mesh.on(…)`, and the view casts a ray through the pointer to
 * find the mesh under it. `pointerover` and `pointerout` fire as the pointer moves onto and off a mesh, `pointertap`
 * for a tap or a click with any button, `wheel` with its `deltaY`, and `contextmenu` for a right click. Listeners
 * alone do nothing: the pyramid keeps the default `eventMode`, `'passive'`, and never runs its own. `'dynamic'` also
 * hears a mesh that slides under a still pointer, because the view then picks the whole scene again while the pointer
 * rests, which is also its cost. Every event is pixi's own with `target3D` added, and the 2D colour menu over the view
 * answers to the very same calls.
 *
 * Controls: move over a shape to swell it, tap or click it to hop it, wheel over it to resize it (over the floor the
 * wheel zooms the camera), right-click it (long-press on Android; iOS Safari has no context menu) for its colour menu,
 * and drag to orbit. The pane sets the pyramid's `eventMode` (rest the pointer on its track to see `'dynamic'` pick it
 * as it slides under) and the shapes' `cursor`, and logs every event. URL flags: `?theme=light|dark`,
 * `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Circle, FederatedWheelEvent } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createColorMenu } from './menu';
import {
  animateToys,
  arrangeToys,
  createToys,
  lower,
  raise,
  resize,
  startHop,
} from './scene';

/** The narrowest view, width over height, that shows the row of shapes and the pyramid's track whole */
const FIT_ASPECT = 1.45;
/** The camera round its target, at one distance: in front of the one row, and higher over the two rows on a phone */
const CAMERA = {
  wide: { x: 0, y: 3, z: 8 },
  upright: { x: 0, y: 6.14, z: 6.36 },
};
const TARGET = { x: 0, y: 0.8, z: 0 };
/** Size gained per px of wheel: a 100 px notch is 0.15 */
const WHEEL_GROWTH = 0.0015;
/** Px per line, for a wheel that counts in lines (Firefox can), as OrbitCamera takes it */
const LINE_HEIGHT = 16;
/** A finger-sized target round a swatch's 9 px dot */
const SWATCH_HIT_RADIUS = 14;
/** The events the pane's log writes a row for */
const LOGGED_EVENTS = [
  'pointerover',
  'pointerout',
  'pointertap',
  'wheel',
  'contextmenu',
];
/** The pyramid's eventMode choices, the default first */
const EVENT_MODES = {
  passive: 'passive',
  static: 'static',
  dynamic: 'dynamic',
};
/** The cursors the pane offers over a shape; 'grab' stays the view's own, for the contrast */
const CURSORS = {
  pointer: 'pointer',
  crosshair: 'crosshair',
  help: 'help',
  'not-allowed': 'not-allowed',
};

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Pointer events' });
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
const stage = new ThemeStage(view3d, { theme, fog: { near: 10, far: 30 } });
const isUpright = () => app.screen.width < app.screen.height;
let upright = isUpright();
const toys = createToys(view3d, upright);
const { cube, sphere, torus, pyramid } = toys;
const menu = createColorMenu({ stage, screen: app.screen });

app.stage.addChild(view3d, menu.card);

// The view's own cursor, shown wherever no listening mesh is under the pointer: the floor, and the passive pyramid.
view3d.cursor = 'grab';

// eventMode is what makes a mesh hear the pointer. The pyramid keeps the default, 'passive', so the listeners it
// gets below never run until the pane switches it.
for (const toy of [cube, sphere, torus]) toy.mesh.eventMode = 'static';

// The calls a pixi Sprite takes, on every shape, the pyramid included.
for (const toy of toys.all) {
  toy.mesh.cursor = 'pointer';
  toy.mesh.on('pointerover', () => raise(toy));
  toy.mesh.on('pointerout', () => lower(toy));
  toy.mesh.on('pointertap', (e) => hop(toy, e));
  toy.mesh.on('wheel', (e) => grow(toy, e));
  toy.mesh.on('contextmenu', (e) => openMenu(toy, e));
}

// The menu is plain pixi 2D and takes the same calls. Its card is a Panel, which starts 'none', and pixi's hit test
// skips a 'none' container's whole subtree, so the card has to listen before its swatches can hear a tap. Listening,
// it also keeps a press between the swatches off the view, and its prevent keeps the browser's menu shut over it.
menu.card.eventMode = 'static';
menu.card.on('contextmenu', (e) => e.preventDefault());
menu.swatches.forEach((swatch, i) => {
  swatch.eventMode = 'static';
  swatch.cursor = 'pointer';
  swatch.hitArea = new Circle(0, 0, SWATCH_HIT_RADIUS);
  swatch.on('pointertap', () => menu.pick(i));
});
// The view hears every press on the scene, empty space included.
view3d.on('pointerdown', () => menu.close());

/** pointertap fires for every button, so the right click that opens the menu doesn't hop the shape too */
function hop(toy, e) {
  if (e.button !== 2) startHop(toy);
}

/** The orbit camera hears the wheel on the view; stopping the event here keeps it from zooming as well */
function grow(toy, e) {
  e.stopPropagation();
  resize(toy, -e.deltaY * (e.deltaMode === 1 ? LINE_HEIGHT : 1) * WHEEL_GROWTH);
}

/** Keeps the browser's menu shut and opens the shape's own where the pointer is */
function openMenu(toy, e) {
  e.preventDefault();
  menu.open(toy, e.global);
}

view3d.camera.fov = 40;
view3d.camera.position.copyFrom(upright ? CAMERA.upright : CAMERA.wide);

const orbit = new OrbitCamera({
  view: view3d,
  target: TARGET,
  enableDamping: true,
  enablePan: false,
  minDistance: 5,
  maxDistance: 14,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
  // The floor keeps the browser's menu, so a shape's own menu has something to differ from.
  preventContextMenu: false,
  mouseButtons: { right: 'none' },
});

// A view narrower than the row backs the camera and the fog off until it fits. On a phone the shapes stand in two
// bigger rows that span the same width, so they fill the screen.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });
// A phone turned after load stands the shapes the other way and tilts to that start's angle.
app.renderer.on('resize', () => {
  if (upright === isUpright()) return;
  upright = !upright;
  arrangeToys(toys, upright);

  const { y, z } = upright ? CAMERA.upright : CAMERA.wide;

  orbit.rotate(0, orbit.polarAngle - Math.atan2(z, y - TARGET.y));
});

const pane = new ThemePane({ title: 'Pointer events', stage });
const shapeCursor = { cursor: 'pointer' };
const log = { row: '' };

// 'none' isn't offered, since here it looks just like 'passive'. The two differ in two places: a listening ancestor
// still picks a 'passive' node on its own behalf but never a 'none' one, and 'none' takes a node's children out of
// picking too. The pyramid has no listening ancestor and no children; interaction_event-flow shows both.
pane
  .addFolder({ title: 'pyramid' })
  .addBinding(pyramid.mesh, 'eventMode', { options: EVENT_MODES })
  // A pyramid that stops listening while swelled would never hear its pointerout.
  .on('change', () => lower(pyramid));
pane
  .addBinding(shapeCursor, 'cursor', { options: CURSORS })
  .on('change', ({ value }) => setCursor(value));

// `label: undefined` drops Tweakpane's label column, so the log spans the folder.
const logRow = pane
  .addFolder({ title: 'Events' })
  .addBinding(log, 'row', {
    label: undefined,
    readonly: true,
    multiline: true,
    rows: 6,
    bufferSize: 6,
    interval: 0,
  });

function setCursor(cursor) {
  for (const toy of toys.all) toy.mesh.cursor = cursor;
}

// A mesh takes any number of listeners for one event, so the log listens on each mesh beside the reactions. One
// listener on the view would miss the wheel over a shape: grow's stopPropagation silences every listener there.
for (const toy of toys.all)
  for (const type of LOGGED_EVENTS) toy.mesh.on(type, record);

/** Writes the log's row: `e.type`, the label of the shape it reached (`e.target3D`), and the field it's about */
function record(e) {
  let row = `${e.type} → ${e.target3D?.label}`;

  if (e instanceof FederatedWheelEvent) row += `, deltaY ${e.deltaY}`;
  if (e.type === 'pointertap') row += `, button ${e.button}`;
  log.row = row;
  logRow.refresh();
}

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  animateToys(toys, time, dt);
  menu.card.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
animateToys(toys, 0, 0);
orbit.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
