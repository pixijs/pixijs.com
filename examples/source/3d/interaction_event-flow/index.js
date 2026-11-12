/**
 * A press travels through the scene graph: in through each container to the node it's for, then back out to the View
 *
 * A pointerdown on a 3D node runs `on('pointerdowncapture')` on each ancestor from the outside in (capture,
 * `eventPhase` 1), then the node's own listeners (target, 2), then `on('pointerdown')` on each ancestor from the inside
 * out (bubble, 3), and last the View's own listeners, where `OrbitCamera` listens. `e.target3D` names the node the
 * press is for the whole way, while `e.currentTarget3D` names the node whose listener is running. A listener that
 * calls `e.stopPropagation()` ends the trip there, so nothing after it hears the press, the camera included.
 * `eventMode` decides who takes part: `'static'` and `'dynamic'` nodes run listeners, a `'passive'` or `'auto'` one
 * hands its hit to its nearest interactive ancestor, `'none'` takes a node and everything under it out of picking,
 * and `interactiveChildren = false` takes only what's under it out.
 *
 * Controls: press the cube, the ball, the tray or the table. A box frames each node whose listener ran, accent round
 * the target and filled round the one that called stopPropagation(), and the pane's log lists them in the order they
 * ran. Drag from the cube and the stopped press leaves the camera still; drag the floor to orbit. The pane sets which
 * listener calls stopPropagation() and the tray's eventMode and interactiveChildren. URL flags: `?theme=light|dark`,
 * `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import { createTable } from './scene';
import { createTrip, recordHop, recordView, startTrip } from './trip';

import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the table whole from the landscape distance */
const FIT_ASPECT = 0.82;
/**
 * Px kept clear at the top of a portrait view. The table sits below the orbit target on screen, so a band about half
 * the open pane's height keeps it under the pane's log.
 */
const TOP_CLEAR = 200;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Event propagation' });
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
const { table, top, tray, cube, ball } = createTable(view3d.root);

app.stage.addChild(view3d);

// Only these three hear the pointer. Every other node keeps the default, 'passive', and runs no listeners: the
// table's top and legs answer for the table, the ball for the tray, and view3d.root for nobody.
for (const node of [table, tray, cube]) {
  node.eventMode = 'static';
  node.cursor = 'pointer';
}

// The tray's listener stops the press on its way back out; the pane moves the stop.
const stop = { at: 'tray', phase: 'bubble' };
// What the listeners heard on the latest press on a node, which the visuals frame and the pane prints.
const trip = createTrip();
// Every press the View has heard, so the first listener of a new one knows to start the record over.
let presses = 0;

/**
 * One listener for every node. currentTarget3D is the node it runs on; target3D is the node the press is for, the
 * one hit or its nearest interactive ancestor, and it stays the same for the whole trip.
 */
function hear(e) {
  const node = e.currentTarget3D;

  // currentTarget3D is null only in the View's own listeners, and hear never runs there; the check is for the type.
  if (!node) return;

  const atTarget = e.eventPhase === e.AT_TARGET;
  const stopPhase =
    stop.phase === 'capture' ? e.CAPTURING_PHASE : e.BUBBLING_PHASE;
  // At the target, capture and plain listeners both run, so a stop set for either phase ends the trip there.
  const stopped =
    node.label === stop.at && (atTarget || e.eventPhase === stopPhase);

  if (stopped) e.stopPropagation();
  if (trip.press !== presses) startTrip(trip, presses, e.target3D?.label ?? '');
  recordHop(trip, { node, phase: e.eventPhase, atTarget, stopped });
}

// The ball listens too, but it's 'passive', so its listeners never run.
for (const node of [table, tray, cube, ball]) {
  // A capture listener also runs at the target itself, where the plain one hears the press.
  node.on('pointerdowncapture', (e) => {
    if (e.eventPhase === e.CAPTURING_PHASE) hear(e);
  });
  node.on('pointerdown', hear);
}

// The View's capture listeners run before the press goes into the scene, so every press is counted here.
view3d.on('pointerdowncapture', () => presses++);
// The View's own listeners run after the 3D trip. To pixi the View is the 2D target, so eventPhase reads AT_TARGET
// and currentTarget3D null. OrbitCamera listens here too, so a stopped press never turns the camera. A press on the
// floor, which turns it, reaches only the View, so it leaves the latest press on a node in the log.
view3d.on('pointerdown', (e) => {
  if (trip.press === presses)
    recordView(trip, e.eventPhase, e.currentTarget3D?.label ?? 'null');
});

// The table is a group with no shape of its own, so its top stands for it.
const visuals = createVisuals({
  trip,
  framed: [
    { node: table, shape: top },
    { node: tray, shape: tray },
    { node: cube, shape: cube },
  ],
});

view3d.camera.fov = 40;
// Higher than the kit's camera, 36° down, so the tray reads as a rectangle inside the table's and the boxes nest.
view3d.camera.position.set(0, 6.45, 7.4);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.15, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 18,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the table, so the camera and the fog back off until it fits, and the table
// drops below the open pane, so a phone shows the log and the boxes it lists together.
fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: FIT_ASPECT,
  clearTop: TOP_CLEAR,
});

const pane = new ThemePane({ title: 'Event propagation', stage });

createControls({ pane, stop, tray, trip });

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

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
