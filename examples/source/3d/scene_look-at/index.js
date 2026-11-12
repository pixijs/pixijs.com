/**
 * Pointing at things: `lookAt` turns a node to face a point, and `toLocal` and `toGlobal` carry points between spaces
 *
 * Three turrets track a target. `lookAt` turns a node at once so its +z faces a world point, so each turret aims an
 * empty twin of its head that way and the head follows at a set rate with `quaternion.slerp`, while `angleTo`
 * measures the turn between them. `head.toLocal` gives the target as the head sees it, where x and y near 0 mean dead
 * ahead and the turret fires; `head.toGlobal` turns the barrel's end into the world point its beam starts from.
 *
 * Controls: drag to orbit; the target flies a loop on its own until Fly is unticked or the pane's x, y or z moves it,
 * and the heads turn to it at the turn rate and fire once it's dead ahead; Head picks the turret whose axes, muzzle
 * and toLocal reading show. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Container3D, Vector3, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, DEG_TO_RAD } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import {
  MUZZLE,
  ORIGIN,
  createTarget,
  createTurrets,
  flyTarget,
  spinTarget,
} from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows all three turrets from the landscape distance */
const FIT_ASPECT = 1.05;
/** How far off the barrel's line the target can be, in world units, and still count as dead ahead */
const LOCK_RADIUS = 0.15;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Look at' });
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

// At the screen's size from the start, so the first frame's tags are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// The camera stands farther back than the kit's, so the fog starts farther out.
const stage = new ThemeStage(view3d, { theme, fog: { near: 14, far: 40 } });

app.stage.addChild(view3d);

const turrets = createTurrets(view3d.root);
// A child of the root, so its position is in world space.
const target = createTarget(view3d.root);
const settings = { fly: true, turnRate: 45, head: 0 };

// What each turret knows about the target, refilled every frame.
const trackers = turrets.map((turret) => ({
  turret,
  // lookAt turns a node at once, so it turns this empty twin of the head, and the head follows it at the turn rate.
  // The twin shares the head's parent and position, so their quaternions compare.
  aim: new Container3D({ position: turret.head.position, parent: turret.root }),
  // The head's pivot in world space: the turrets stand still, so once is enough.
  pivot: turret.head.getGlobalPosition(),
  targetLocal: new Vector3(), // the target in the head's space
  muzzle: new Vector3(), // the barrel's open end in world space
  locked: false, // dead ahead, so the beam fires
}));

// The plain call turns a node at once: each head starts on the target.
for (const { head } of turrets) head.lookAt(target.position);

const visuals = createVisuals({
  app,
  view3d,
  stage,
  trackers,
  target,
  settings,
});

// High behind the turrets, as a tower-defence game looks: each barrel shows its length whichever way it turns.
view3d.camera.fov = 40;
view3d.camera.position.set(0, 6.2, 6.3);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.6, z: -4.1 },
  enableDamping: true,
  enablePan: false,
  minDistance: 7,
  maxDistance: 18,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the three turrets, so the camera and the fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const controls = createControls({
  stage,
  target,
  readings: trackers.map(({ targetLocal }) => targetLocal),
  settings,
});
// The flight keeps its own clock, so a pause holds the target where it is on its loop.
let flightTime = 0;

/** Turns each head toward the target at the turn rate, reads the target in its space, and fires when dead ahead */
function trackTarget(dt) {
  const step = settings.turnRate * DEG_TO_RAD * dt;

  for (const tracker of trackers) {
    const { turret, aim, targetLocal, muzzle } = tracker;
    const { head, beam } = turret;

    aim.lookAt(target.position);
    const turnLeft = head.quaternion.angleTo(aim.quaternion);
    // Turning one step of what's left each frame keeps the rate steady. The guard keeps 0 / 0 out of a finished turn.
    if (turnLeft > 0)
      head.quaternion.slerp(aim.quaternion, Math.min(1, step / turnLeft));

    // The target's origin carried into the head's space, measured from the pivot inside the pod along the head's own
    // axes: x and y near 0 mean dead ahead, and z is how far.
    head.toLocal(ORIGIN, target, targetLocal);
    tracker.locked =
      targetLocal.z > 0 &&
      Math.hypot(targetLocal.x, targetLocal.y) < LOCK_RADIUS;

    // The barrel's open end in world space, where the world-space beam starts.
    head.toGlobal(MUZZLE, muzzle);
    beam.visible = tracker.locked;
    if (!tracker.locked) continue;
    beam.position.copyFrom(muzzle);
    beam.lookAt(target.position);
    // To the target's centre: both are opaque, so the target hides the part inside it.
    beam.scale.z = muzzle.distanceTo(target.position);
  }
}

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  // The flight is the lesson's motion: the heads lag a moving target, catch it and fire.
  if (settings.fly) {
    flightTime += dt;
    flyTarget(target, flightTime);
    controls.showPosition();
  }
  spinTarget(target, dt);
  trackTarget(dt);
  visuals.update();
});

// At dt 0 nothing turns, and the records fill for the first frame.
trackTarget(0);
// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
