/**
 * First-person camera: walk a clay maze with FPSCamera, looking with the mouse and walking with the keys or a stick
 *
 * `FPSCamera` drives `view3d.camera` from a position, a `yaw` about world y (0 faces -z, positive turns left, and it
 * never wraps) and a `pitch` clamped to `±maxPitch`. With `pointerLock` on, a click locks the mouse to look around; a
 * drag looks on touch, or with `pointerLock` unticked. WASD walks where the camera faces, and `move` takes any other
 * input, here an on-screen stick. The example steps the camera from its own ticker so the maze's walls can push back,
 * and keeps it at eye height, so Space and Shift, which fly, have nothing to do. Nobody can see the camera they look
 * through, so a plan in the corner shows it from above.
 *
 * Controls: click the view to lock the mouse and look (Esc releases), or drag to look on touch or with pointerLock
 * unticked; WASD, the arrow keys or the stick bottom right walk; the pane sets moveSpeed, lookSpeed and pointerLock
 * and reads out yaw and pitch. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';
import { FPSCamera } from '@pixi/3d/extras';
import { Application, DEG_TO_RAD, RAD_TO_DEG } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createJoystick } from './joystick';
import { createMaze } from './scene';
import { createVisuals } from './visuals';

/** The vertical fov, wider than the collection's 40 as a walking view needs in corridors */
const FOV = 60;
/** The fov a narrow screen keeps across its width */
const FOV_ACROSS = 60;
/** How far the logo sways either side, in radians, and how fast */
const SWAY = { angle: 0.3, speed: 0.4 };

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'First-person camera' });
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
// A long frame steps FPSCamera's update(ticker) by 1/15 s at most, a step short enough for the walls to catch.
app.ticker.minFPS = 15;
loading.progress(0.2);

// Built at the screen's size, so the plan's view volume has the screen's shape on the first frame.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// The spot pool lights the logo's room on the dark theme, so the goal still reads as the place to head for.
const stage = new ThemeStage(view3d, { theme, spotlight: true });
const logo = await loading.load(() => loadPixiLogo({ width: 3 }));

// Over the centre room: the goal, high enough to see over the walls from anywhere in the maze.
logo.root.position.set(0, 2.6, 0);
view3d.root.addChild(logo.root);
app.stage.addChild(view3d);

const maze = createMaze(view3d.root);

const fpsCamera = new FPSCamera({
  view: view3d,
  position: maze.start.position,
  yaw: maze.start.yaw, // 0 faces -z, into the maze
  pitch: maze.start.pitch,
  maxPitch: 1.2, // about 69°, so looking up or down stops well short of straight up
  pointerLock: true, // a mouse click captures the mouse; Esc gives it back
  moveSpeed: 5,
  lookSpeed: 0.002,
  // Stepped from app.ticker below, so the walls push back before the frame draws.
  autoUpdate: false,
});

// A phone held upright is narrow, so the view widens until 60° fits across it.
function fitFov(width, height) {
  const across =
    2 *
    Math.atan((Math.tan((FOV_ACROSS * DEG_TO_RAD) / 2) * height) / width) *
    RAD_TO_DEG;

  fpsCamera.camera.fov = Math.max(FOV, across);
}

fitFov(app.screen.width, app.screen.height);
app.renderer.on('resize', fitFov);

const joystick = createJoystick({ app, stage });

// FPSCamera only locks a mouse, so a touch screen has no use for the pointerLock row.
const touchScreen = matchMedia('(pointer: coarse)').matches;
const pane = new ThemePane({ title: 'First-person camera', stage });
const ANGLE = { readonly: true, format: (radians) => radians.toFixed(2) };

pane.addBinding(fpsCamera, 'moveSpeed', { min: 1, max: 12, step: 0.5 });
pane.addBinding(fpsCamera, 'lookSpeed', {
  min: 0.0005,
  max: 0.006,
  step: 0.0001,
  format: (v) => v.toFixed(4),
});
pane.addBinding(fpsCamera, 'pointerLock', { hidden: touchScreen });
// Read back from the camera: a look right lowers yaw, a look up raises pitch until it stops at maxPitch.
pane.addBinding(fpsCamera, 'yaw', ANGLE);
pane.addBinding(fpsCamera, 'pitch', ANGLE);

// After the rows, so the plan sizes itself under the whole pane.
const visuals = createVisuals({ app, view3d, stage, maze, pane });

// FPSCamera reads keys from the whole page, so typing in a pane text field would walk: the field keeps its keys. A
// slider or a checkbox keeps focus after a click too, and W still walks then.
pane.element.addEventListener('focusin', ({ target }) => {
  fpsCamera.keyboard = !(
    target instanceof HTMLInputElement && target.type === 'text'
  );
});
pane.element.addEventListener('focusout', () => (fpsCamera.keyboard = true));

// The pane can't be clicked while the mouse is locked, so it folds away until Esc gives the mouse back.
let paneOpen = pane.expanded;

fpsCamera.on('lock', () => {
  paneOpen = pane.expanded;
  pane.expanded = false;
});
fpsCamera.on('unlock', () => (pane.expanded = paneOpen));

let time = 0;

app.ticker.add((ticker) => {
  const dt = ticker.deltaMS / 1000;

  time += dt;
  stage.update(dt);
  // The stick's up is the camera's forward, so its y feeds move.z.
  fpsCamera.move.set(joystick.value.x, 0, joystick.value.y);
  // update() walks by this frame's keys and move, and returns true when the camera moved.
  if (fpsCamera.update(ticker)) maze.collide(fpsCamera.camera.position);
  logo.root.rotation.y = Math.sin(time * SWAY.speed) * SWAY.angle;
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
