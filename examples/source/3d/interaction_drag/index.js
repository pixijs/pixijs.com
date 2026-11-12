/**
 * Drag clay shapes across a plane with `globalpointermove` and `pointerupoutside`
 *
 * A press on a shape lays a flat `Plane` through the point it was grabbed at, and every move after that becomes a
 * point on the plane through `view3d.screenToWorld(e.global, plane)`: a point on the screen is a line into the scene,
 * and the plane picks one point on it. While a shape is held, the frame draws that plane as a pink sheet over the
 * board, cutting every shape at the grabbed height, with a dot where the pointer's line meets it. A held shape
 * listens for `globalpointermove`, which arrives wherever the pointer is, and for `pointerup` and `pointerupoutside`,
 * so the drag ends wherever the button is let go. `e.stopPropagation()` on the press keeps the `OrbitCamera` still,
 * and snapping to a grid is rounding the point.
 *
 * Controls: drag a shape to slide it over the board, drag the board to orbit. The pane swaps the move event, drops
 * the `pointerupoutside` listener or the `stopPropagation()` call, and snaps to the grid. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Mesh3D, Plane, Vector3, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { clayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { clayGeometry } from './theme/shapes';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { BOARD, createBoard, PIECES } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the board whole from the landscape distance, edge to edge */
const FIT_ASPECT = 0.96;
const UP = { x: 0, y: 1, z: 0 };
/** A shape's centre stays half a unit in from the board's edge, so it never hangs off */
const EDGE_GAP = 0.5;
const REACH = {
  min: {
    x: EDGE_GAP - BOARD.width / 2,
    y: -Infinity,
    z: EDGE_GAP - BOARD.depth / 2,
  },
  max: {
    x: BOARD.width / 2 - EDGE_GAP,
    y: Infinity,
    z: BOARD.depth / 2 - EDGE_GAP,
  },
};

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Dragging objects' });
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
// From this high camera the kit's fog, 12 out, would start on the board; from 18 only the floor past it fades.
const stage = new ThemeStage(view3d, { theme, fog: { near: 18, far: 49 } });

app.stage.addChild(view3d);
createBoard(view3d.root);

// Each shape takes pointer events and shows an open hand. It's picked by its triangles, so a press lands on the
// clay rather than the box round it; interaction_hit-volumes compares the choices.
const shapes = PIECES.map(
  ({ shape, color, spot }) =>
    new Mesh3D({
      geometry: clayGeometry(shape),
      material: clayMaterial(color),
      position: spot,
      eventMode: 'static',
      cursor: 'grab',
      hitVolume: 'geometry',
      parent: view3d.root,
    }),
);

/**
 * What the pane changes. A press reads the listener rows, so a change to one shows from the next drag; each move reads
 * snap and step, so those apply mid-drag.
 */
const params = {
  moveEvent: 'globalpointermove',
  upOutside: true,
  stopPropagation: true,
  snap: false,
  step: 1,
};
/**
 * One drag at a time. `shape` is the shape held and `pointerId` the pointer holding it. `moveEvent` is the move
 * listener grab added, kept so endDrag takes that one off even if the pane changed during the drag. `plane` is the
 * flat plane the shape slides on, `point` the pointer's latest spot on it, and `offset` the grabbed point less the
 * shape's centre.
 */
const drag = {
  shape: null,
  pointerId: -1,
  moveEvent: params.moveEvent,
  plane: new Plane(),
  point: new Vector3(),
  offset: new Vector3(),
};
const next = new Vector3();

function grab(shape, e) {
  // The view hears a press after the shape does, and its OrbitCamera would turn with the drag. Stopped before the
  // guard, so a press while a drag is live (a second finger) doesn't orbit either.
  if (params.stopPropagation) e.stopPropagation();
  if (drag.shape || !e.hit3D || e.button !== 0) return;
  // The pointer only moves across the screen, and a point on the screen is a whole line of points in the scene, so a
  // drag in 3D needs a surface to pick one of them: the drag plane. Level like the board and through the grabbed
  // point, so the shape slides at the height it was grabbed and that point stays under the pointer.
  drag.plane.setFromNormalAndCoplanarPoint(UP, e.hit3D.point);
  drag.point.copyFrom(e.hit3D.point);
  drag.offset.copyFrom(e.hit3D.point).subtract(shape.position);
  drag.shape = shape;
  drag.pointerId = e.pointerId;
  drag.moveEvent = params.moveEvent;
  // The view shows a shape's cursor only while the pointer is over it, and its own everywhere else, so setting both
  // keeps the hand closed when the pointer outruns the shape.
  shape.cursor = 'grabbing';
  view3d.cursor = 'grabbing';
  // globalpointermove arrives on every move over the canvas, so the drag goes on once the pointer leaves the shape.
  // pointermove arrives only while the pointer is over the shape, so a quick drag leaves the shape behind.
  shape.on(drag.moveEvent, dragTo);
  // The held shape hears pointerup when it's let go over it and pointerupoutside anywhere else, another shape too.
  // Without pointerupoutside a release off the shape goes unheard, and the shape follows the pointer until a click
  // on it sends the pointerup it does hear.
  shape.on('pointerup', drop);
  if (params.upOutside) shape.on('pointerupoutside', drop);
}

function dragTo(e) {
  if (!drag.shape || e.pointerId !== drag.pointerId) return;
  // null when the pointer is above the horizon, where its ray never meets the plane.
  if (!view3d.screenToWorld(e.global, drag.plane, drag.point)) return;
  // Less the offset, so the spot it was grabbed by stays under the pointer rather than its centre.
  next.copyFrom(drag.point).subtract(drag.offset);
  if (params.snap) next.set(snapToGrid(next.x), next.y, snapToGrid(next.z));
  drag.shape.position.copyFrom(next.clamp(REACH.min, REACH.max));
}

function drop(e) {
  if (e.pointerId === drag.pointerId) endDrag();
}

function endDrag() {
  const shape = drag.shape;

  if (!shape) return;
  shape.off(drag.moveEvent, dragTo);
  shape.off('pointerup', drop);
  shape.off('pointerupoutside', drop);
  shape.cursor = 'grab';
  view3d.cursor = 'default';
  drag.shape = null;
}

function snapToGrid(value) {
  return Math.round(value / params.step) * params.step;
}

// Only the press goes on every shape. The move and release listeners go on the held shape alone, in grab.
for (const shape of shapes) shape.on('pointerdown', (e) => grab(shape, e));

const visuals = createVisuals({
  app,
  view3d,
  stage,
  shapes,
  drag,
  params,
  reach: REACH,
});

// High over the board, 50° above it, so a drag reads as a move across a surface.
view3d.camera.fov = 40;
view3d.camera.position.set(0, 8.85, 7.75);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.1, z: 0.4 },
  // Updated first in the tick, so the drag plane's label is placed with this frame's camera.
  autoUpdate: false,
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  // Stops 22° above the board, where the drag plane would start to run off toward the horizon.
  maxPolarAngle: Math.PI * 0.38,
});

// A portrait screen is narrower than the board, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Dragging objects', stage });

// Tweakpane wraps a label wider than its column, so the names take 30 px from the values and each keeps to one line.
pane.element.style.setProperty('--tp-blade-value-width', '130px');
pane.addBinding(params, 'moveEvent', {
  label: 'Move event',
  options: {
    globalpointermove: 'globalpointermove',
    pointermove: 'pointermove',
  },
});
pane.addBinding(params, 'upOutside', { label: 'Release outside' });
// Off, the press reaches the view as well, and the camera turns with the drag.
pane.addBinding(params, 'stopPropagation', { label: 'Stop propagation' });
pane.addBinding(params, 'snap', { label: 'Snap to grid' });
pane.addBinding(params, 'step', {
  label: 'Grid step',
  options: { 1: 1, 0.5: 0.5, 0.25: 0.25 },
});

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  orbit.update(ticker);
  stage.update(dt);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
