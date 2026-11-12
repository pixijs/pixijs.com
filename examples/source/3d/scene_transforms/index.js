/**
 * Position, rotation and scale: the local transform every node carries, each part measured in its parent's space
 *
 * `position` places the node's origin as an offset from its parent's. `angle` (degrees) and `rotation` (radians) are
 * one Euler turn in two units, and `quaternion.setFromAxisAngle` turns the node about any axis; the node keeps both
 * turns, and the one written last is the one in use. `scale` stretches the node along its own axes, and `origin` is
 * the point in its own space that it turns about, which is how a door swings on its hinge. The letter opens moved off
 * the root and turned away from its unturned ghost, and the door opens on its hinge beside a ghost turning about its
 * middle.
 *
 * Controls: drag to orbit; the pane sets the letter's position, its turn by `angle.y` or by the quaternion's axis and
 * angle, its scale, and the door's `origin.x` and `angle.y`. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Mesh3D, Vector3, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { clayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { THEMES, themeFromUrl } from './theme/palette';
import { roundedBox } from './theme/shapes';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls, twoDecimals } from './controls';

import { createDoorFrame } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the letter's reach and the door's swing whole */
const FIT_ASPECT = 1.25;
/** A unit wide, so `origin.x = -0.5` is its left edge */
const DOOR_SIZE = { width: 1, height: 2.1, depth: 0.1 };
/** Behind and right of the letter, clear of the pane, its foot a hair off the floor */
const DOOR_AT = { x: 2.4, y: 1.07, z: -1.9 };
/** The hinges, on its left edge: a positive `angle.y` swings the door away from the camera, clear of its ghost */
const HINGE_X = -DOOR_SIZE.width / 2;

/**
 * Where the example opens and Reset returns. The letter is moved off the root and turned 45°, where its +z axis and
 * the position arrow part on screen; the quaternion's values wait until a quaternion row or `turn in use` picks it.
 */
const START = {
  position: { x: -1, y: 1.5, z: 1 },
  angle: { x: 0, y: 45, z: 0 },
  axis: { x: 0, y: 1, z: -1 },
  axisAngle: Math.PI / 2,
  turnBy: 'angle',
  scale: { x: 1, y: 1, z: 1 },
  doorOrigin: HINGE_X,
  doorAngle: 70,
};

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Transforms' });
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
const stage = new ThemeStage(view3d, { theme });
const logo = await loading.load(() => loadPixiLogo({ width: 5 }));

app.stage.addChild(view3d);

// The P alone. Its pivot sits at the letter's centre, so that's the point it turns and scales about. Moving it out of
// logo.root, which is never added, leaves the other four pieces undrawn.
const letter = logo.pieces.p.pivot;

view3d.root.addChild(letter);

// The origin puts the point the door turns about on its left edge, where the hinges are.
const door = new Mesh3D({
  geometry: roundedBox(
    DOOR_SIZE.width,
    DOOR_SIZE.height,
    DOOR_SIZE.depth,
    0.04,
  ),
  material: clayMaterial('orange'),
  position: DOOR_AT,
  origin: { x: HINGE_X, y: 0, z: 0 },
  parent: view3d.root,
});

createDoorFrame({
  parent: view3d.root,
  at: DOOR_AT,
  size: DOOR_SIZE,
  hingeX: HINGE_X,
});

const pose = structuredClone(START);
// The quaternion's axis at unit length, reused by every call.
const axis = new Vector3();

/** Writes the pose into the letter and the door: every transform call this example teaches */
function applyPose() {
  letter.position = pose.position;
  // The node keeps the Euler angles and the quaternion apart, and the one written last turns it. Assigning the whole
  // angle makes it the turn in use again, even when those values are already stored.
  if (pose.turnBy === 'angle') {
    letter.angle = pose.angle;
  } else if (pose.axis.x !== 0 || pose.axis.y !== 0 || pose.axis.z !== 0) {
    // The call wants a unit axis. A zero axis has no direction, so the last turn stays.
    letter.quaternion.setFromAxisAngle(
      axis.copyFrom(pose.axis).normalize(),
      pose.axisAngle,
    );
  }
  letter.scale = pose.scale;
  door.origin.x = pose.doorOrigin;
  door.angle.y = pose.doorAngle;
}

const visuals = createVisuals({ app, view3d, stage, letter, door, pose });

view3d.camera.fov = 40;
// Higher and further round than the kit's (0, 3.2, 10), so a turn about y opens into a readable ellipse and +z points
// down-left rather than straight out of the screen.
view3d.camera.position.set(4.95, 6.16, 7.3);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 1.4, y: 1.7, z: -0.3 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the letter's reach and the door, so the camera and fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Transforms', stage });
const letterRows = createControls({
  pane,
  pose,
  start: START,
  apply: applyPose,
});

// `angle` is a degree view of `rotation`, so this row is the same turn in radians.
letterRows.addBinding(letter.rotation, 'y', {
  label: 'rotation.y',
  readonly: true,
  format: twoDecimals,
  index: 2,
});

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
applyPose();
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
