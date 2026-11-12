/**
 * How a camera flattens 3D onto the screen: perspective with `fov`, and orthographic for an isometric view
 *
 * `Camera3D.mode` picks the projection. A perspective camera sees a pyramid whose vertical angle is `fov`, so farther
 * things look smaller: of the two identical sky-blue houses, the one at the town's far corner comes out smaller than
 * the one at its near corner. An orthographic camera sees a box `orthographicSize` wide each side of the middle, so
 * everything keeps its size at any distance and the two houses match, which is what an isometric game wants. Depth
 * comes from how far back the camera stands: `frameTown()` backs the camera off as `fov` narrows, which flattens the
 * picture, while `zoom` narrows the view in either mode without moving the camera, so it magnifies but never changes
 * depth. The side view in the bottom-right corner shows the camera and its view volume from outside.
 *
 * Controls: drag to orbit; the wheel zooms an orthographic camera and moves a perspective one closer; the pane sets
 * mode, fov and zoom and shows how far back the camera stands; Isometric view switches to orthographic on the isometric
 * diagonal. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Vector3, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, DEG_TO_RAD } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createTown, TOWN_CENTER, TOWN_RADIUS } from './scene';
import { createVisuals } from './visuals';

const TITLE = 'Perspective and orthographic';
/** On the (1, 1, 1) diagonal, x, y and z come out the same length on screen, which is what isometric means */
const ISOMETRIC = new Vector3(1, 1, 1).normalize();
/** How far past the town's middle the fog closes in; it moves with the camera, which stands 9 to 104 units out */
const FOG_FAR = 30;

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

// At the screen's size from the start, so the side view's first frame draws the view volume at the screen's aspect.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });

app.stage.addChild(view3d);

const town = createTown(view3d.root);
// A view's camera starts with Camera3D's defaults: perspective, fov 60, zoom 1.
const camera = view3d.camera;

/** Puts the camera on the ISOMETRIC diagonal, 1 unit from the town; frameTown() then sets how far back it stands */
function faceIsometric() {
  camera.position.copyFrom(ISOMETRIC).add(TOWN_CENTER);
}

faceIsometric();

const orbit = new OrbitCamera({
  view: view3d,
  target: TOWN_CENTER,
  enableDamping: true,
  enablePan: false,
  // Updated in the ticker, so the side view reads this frame's camera.
  autoUpdate: false,
  // The orbit holds the distance inside these in both modes, so they take in every distance frameTown() sets.
  minDistance: 6,
  maxDistance: 110,
  // What the wheel holds an orthographic camera's zoom to: the zoom row's range.
  minZoom: 0.5,
  maxZoom: 1.4,
  // Between 25° and 72° above the floor. Lower, an orthographic camera would have to stand past the floor's edge.
  minPolarAngle: Math.PI * 0.1,
  maxPolarAngle: Math.PI * 0.36,
});
const toCamera = new Vector3();

/** How far back a perspective camera with this fov stands for the town to fit the screen */
function fitDistance(fov) {
  const aspect = app.screen.width / app.screen.height;
  // fov is the vertical angle, so on a portrait screen the narrower horizontal angle decides.
  const halfAngle = Math.atan(
    Math.tan((fov * DEG_TO_RAD) / 2) * Math.min(aspect, 1),
  );

  return TOWN_RADIUS / Math.sin(halfAngle);
}

/** Stands the camera back along its line until the town fits, and fits the orthographic view to the town */
function frameTown() {
  const aspect = app.screen.width / app.screen.height;
  let distance = fitDistance(camera.fov);

  // orthographicSize is half the width, so on a landscape screen the shorter height decides it.
  camera.orthographicSize = TOWN_RADIUS * Math.max(aspect, 1);
  toCamera.copyFrom(camera.position).subtract(orbit.target);
  if (camera.mode === 'orthographic') {
    // An orthographic camera keeps the perspective distance, so a switch back to perspective doesn't jump, and only
    // the floor pushes it farther back. Its picture is the same from any distance, but its box starts at the camera,
    // with the lower edge half the view's height under it: standing back hypot / y = 1 / tan(elevation) times that
    // keeps the edge over the floor, and a tenth more keeps it clear of the ground line in the side view.
    const halfHeight = camera.orthographicSize / camera.zoom / aspect;

    distance = Math.max(
      distance,
      (1.1 * halfHeight * Math.hypot(toCamera.x, toCamera.z)) / toCamera.y,
    );
  }
  camera.position.copyFrom(toCamera.setLength(distance)).add(orbit.target);
}

frameTown();
app.renderer.on('resize', frameTown);

/** Fog is measured from the camera, so a camera that travels needs fog that travels with it */
function fogAroundTown() {
  stage.fog.near = orbit.distance + TOWN_RADIUS;
  stage.fog.far = orbit.distance + FOG_FAR;
}

const visuals = createVisuals({ app, view3d, stage, town, orbit });

const pane = new ThemePane({ title: TITLE, stage });
const folder = pane.addFolder({ title: 'camera' });
const rows = {
  mode: folder.addBinding(camera, 'mode', {
    options: { perspective: 'perspective', orthographic: 'orthographic' },
  }),
  fov: folder.addBinding(camera, 'fov', {
    min: 15,
    max: 90,
    step: 1,
    format: (value) => `${value}°`,
  }),
  // No step: the wheel writes any zoom in orthographic, and a stepped row would round it as it follows.
  zoom: folder.addBinding(camera, 'zoom', {
    min: 0.5,
    max: 1.4,
    format: (value) => value.toFixed(2),
  }),
};

// The orbit measures the camera's distance from its target: frameTown() sets it, and the wheel moves a perspective one.
folder.addBinding(orbit, 'distance', {
  readonly: true,
  format: (value) => value.toFixed(1),
});

/** A new mode or fov stands the camera where the town fits again; fov does nothing to an orthographic camera */
function changeProjection() {
  rows.fov.disabled = camera.mode === 'orthographic';
  frameTown();
}

/** In orthographic, zoom and the orbit's elevation move where the box's lower edge falls; perspective stays put */
function refitOrthographic() {
  if (camera.mode === 'orthographic') frameTown();
}

/** True isometric: an orthographic camera on the ISOMETRIC diagonal */
function isometricView() {
  // camera.useOrthographic(size) switches in one call, but it also resets near and far to their defaults.
  camera.mode = 'orthographic';
  faceIsometric();
  changeProjection();
  rows.mode.refresh();
}

rows.mode.on('change', changeProjection);
rows.fov.on('change', changeProjection);
rows.zoom.on('change', refitOrthographic);
pane.addButton({ title: 'Isometric view' }).on('click', isometricView);
// In orthographic the wheel changes zoom rather than the distance, so the zoom row follows it, and a drag the elevation.
orbit.on('change', () => {
  rows.zoom.refresh();
  refitOrthographic();
});

app.ticker.add((ticker) => {
  stage.update(Math.min(ticker.deltaMS / 1000, 1 / 15));
  orbit.update(ticker);
  fogAroundTown();
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
fogAroundTown();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
