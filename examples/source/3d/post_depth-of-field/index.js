/**
 * Depth of field: a post effect of your own keeps one camera depth sharp and blurs what's nearer or farther
 *
 * `DepthOfFieldEffect` is a `PostEffect` that reads each pixel's view-space depth with `viewPos(uv)` and blurs by
 * sampling a coarser level of its mipmapped input (`inputMips`). The sharp band is a plane `focusDistance` in front
 * of the camera, so the floor at the same depth as the shape in focus stays sharp too. Each pixel picks its blur from
 * its own depth, which is cheap but wrong at silhouettes: the blur round a sharp shape smears its colour outwards,
 * and a blurred shape in front of the sharp band stops dead at it, since a sharp pixel never reads its neighbours.
 * `TiltShiftEffect` in `@pixi/3d/extras` weighs its taps by depth, so sharp edges don't smear and a blurred
 * foreground still spreads over what's behind it.
 *
 * Controls: tap a shape to focus on it; drag to orbit; the pane picks the focus, sets a manual distance, widens the
 * band, sets the blur and shows the focus mask. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Mesh3D, Vector3, View3D } from '@pixi/3d';
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
import { DepthOfFieldEffect } from './DepthOfFieldEffect';

/** Fits the three shapes across a portrait screen without changing their relative depths */
const FIT_ASPECT = 0.9;
/** The blur at full strength, in CSS pixels: enough to soften a shape without losing it */
const BLUR_RADIUS = 20;
/** The most blur the pane allows, in CSS pixels */
const BLUR_RANGE = 32;
/** The focus list's value for focusing at the manual distance instead of on a shape */
const MANUAL = -1;

const theme = themeFromUrl();
const loading = new LoadingScreen({ theme, label: 'Depth of field' });
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

// blurRadius counts device pixels, so it's scaled to look the same on a 2× screen.
const depthOfField = new DepthOfFieldEffect({
  blurRadius: BLUR_RADIUS * app.renderer.resolution,
});
const view3d = new View3D({ autoResize: true, passes: [depthOfField] });
const stage = new ThemeStage(view3d, { theme, fog: { near: 22, far: 48 } });

// A shadow pass would cost a draw per shape and teach nothing here.
stage.key.castShadow = false;
app.stage.addChild(view3d);

// Three shapes at three depths, so whichever one is in focus, the other two blur.
const shapes = [
  new Mesh3D({
    geometry: clayGeometry('cube'),
    material: clayMaterial('pink'),
    position: { x: -2, y: 1, z: 3 },
  }),
  new Mesh3D({
    geometry: clayGeometry('torus'),
    material: clayMaterial('sky'),
    position: { x: 0, y: 1, z: 0 },
  }),
  new Mesh3D({
    geometry: clayGeometry('octahedron'),
    material: clayMaterial('orange'),
    position: { x: 2.4, y: 1, z: -3 },
  }),
];

for (const shape of shapes) {
  shape.scale.set(1.6, 1.6, 1.6);
  shape.eventMode = 'static';
  shape.cursor = 'pointer';
  view3d.root.addChild(shape);
}

view3d.camera.fov = 40;
view3d.camera.position.set(0, 4, 13);

// Kept above the floor, whose checker shows the sharp band.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1, z: 0 },
  enableDamping: true,
  enablePan: false,
  maxPolarAngle: Math.PI * 0.45,
});

fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const settings = { focusOn: 1, manualDistance: 13 };
const pane = new ThemePane({ title: 'Depth of field', stage });
const focusRow = pane.addBinding(settings, 'focusOn', {
  label: 'Focus on',
  options: {
    'Near cube': 0,
    'Middle torus': 1,
    'Far crystal': 2,
    'Manual distance': MANUAL,
  },
});
const manualRow = pane.addBinding(settings, 'manualDistance', {
  label: 'Manual distance',
  min: 1,
  max: 40,
  step: 0.1,
});

// Picking 'Manual distance' keeps the plane where it is, so the slider starts from the depth in focus.
focusRow.on('change', () => {
  if (settings.focusOn !== MANUAL) return;
  settings.manualDistance = depthOfField.focusDistance;
  manualRow.refresh();
});
manualRow.on('change', () => {
  settings.focusOn = MANUAL;
  focusRow.refresh();
});

const folder = pane.addFolder({ title: 'DepthOfFieldEffect' });

folder.addBinding(depthOfField, 'enabled');
folder.addBinding(depthOfField, 'focusDistance', {
  readonly: true,
  interval: 300,
  format: (v) => v.toFixed(1),
});
folder.addBinding(depthOfField, 'focusRange', { min: 0.1, max: 3, step: 0.05 });
folder.addBinding(depthOfField, 'blurRadius', {
  min: 0,
  max: BLUR_RANGE * app.renderer.resolution,
  step: 1,
});
folder.addBinding(depthOfField, 'showFocus');

shapes.forEach((shape, i) =>
  shape.on('pointertap', () => {
    settings.focusOn = i;
    focusRow.refresh();
  }),
);

const worldPoint = new Vector3();
const cameraPoint = new Vector3();

/** Puts the focus plane at the manual distance, or at the picked shape's depth in front of the camera */
function updateFocus() {
  if (settings.focusOn === MANUAL) {
    depthOfField.focusDistance = settings.manualDistance;

    return;
  }

  shapes[settings.focusOn].getGlobalPosition(worldPoint);
  // The camera looks down its -z, so depth is -z in camera space. The straight-line distance from the camera would
  // focus on a sphere round it rather than a plane.
  view3d.camera.toLocal(worldPoint, undefined, cameraPoint);
  depthOfField.focusDistance = -cameraPoint.z;
}

let elapsed = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  elapsed += dt;
  stage.update(dt);
  // A slow sway keeps the scene live. It turns each shape in place, so no shape's depth changes.
  for (let i = 0; i < shapes.length; i++)
    shapes[i].rotation.y = Math.sin(elapsed * 0.35 + i) * 0.3;
  // Orbiting changes every shape's depth, so the plane follows the picked shape each frame.
  updateFocus();
});

orbit.update();
updateFocus();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
