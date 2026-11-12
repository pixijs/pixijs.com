/**
 * Every teaching visual in the theme kit, each on a clay subject and named by its class
 *
 * Fourteen stations hold the 3D helpers: axes, an angle, a box frame, a ghost, a dot, an arrow, a ring, a path, a
 * span, a grid, points, a wireframe, normals, a struck triangle, a bounding sphere, a light, a camera's frustum and a
 * skeleton. The fifteenth holds the 2D overlays: a screen-space ring round a ball, and the label layer that draws
 * every name tag. An inset view under the pane films the lens station. `examples/shared/theme/README.md` documents
 * each.
 *
 * Controls: drag to orbit; the pane switches themes and shows or hides each visual. URL flags: `?theme=light|dark`,
 * `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets, Rectangle } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { model } from './manifest';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import {
  clearOfPanels,
  frameStations,
  LAYOUTS,
  placeStations,
} from './layouts';

import { createGallery, moveGallery } from './scene';
import { createVisuals } from './visuals';

const TITLE = 'Theme kit visuals';

/** A phone's lines are drawn thicker, since it frames the gallery from further back */
const WIDEN = { wide: 1, compact: 1.5, tall: 1.6 };
/**
 * The smallest landscape screen whose five columns keep their tags apart beside the pane's column, in px. Its height
 * leaves room in that column for the open pane's longest folder, about 330 px, above the inset; a shorter screen
 * gets the compact grid, under the collapsed pane.
 */
const WIDE_MIN = { width: 1000, height: 540 };

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

// At the screen's size from the start, so the first frame's tags and frustum are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });
const foxSource = await loading.load(() => Assets.load(model('gltf.Fox')));

app.stage.addChild(view3d);

/** The screen's shape: upright, landscape with room for five columns beside the pane's column, or landscape without */
function shapeOf() {
  const { width, height } = app.screen;

  if (width < height) return 'tall';

  return width >= WIDE_MIN.width && height >= WIDE_MIN.height
    ? 'wide'
    : 'compact';
}

let shape = shapeOf();
const scene = createGallery(view3d.root, foxSource);
const visuals = createVisuals({
  app,
  view3d,
  stage,
  scene,
  widen: WIDEN[shape],
});

view3d.camera.fov = 40;

const orbit = new OrbitCamera({
  view: view3d,
  enableDamping: true,
  enablePan: false,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

const clear = new Rectangle();

/**
 * Lays the stations out for the screen's shape, sizes the inset, and frames the camera and the fog on the part of the
 * screen the pane and the inset leave clear. A phone has its own layouts rather than fitPortrait's backed-off camera:
 * five columns would shrink every name tag into its neighbours.
 */
function fitLayout() {
  const layout = LAYOUTS[shape];
  const inset = visuals.arrange(shape);
  const paneLeft = pane.element.getBoundingClientRect().left;

  placeStations(scene, layout);
  frameStations(
    orbit,
    stage,
    layout,
    app.screen,
    clearOfPanels(shape, app.screen, inset, paneLeft, clear),
  );
}

// Collapsed to a bar on a phone or a small window, so the stations fit under it.
const pane = createControls({
  title: TITLE,
  stage,
  visuals: visuals.visuals,
  expanded: shape === 'wide',
});

// A phone turned after load gets its other layout, and every resize refits the inset and the camera. The pane closes
// when the screen turns into a phone's shape and opens again when it turns wide.
app.renderer.on('resize', () => {
  if (shapeOf() !== shape) {
    shape = shapeOf();
    pane.expanded = shape === 'wide';
  }
  fitLayout();
});

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  moveGallery(scene, time);
  scene.fox.player?.update(ticker);
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
fitLayout();
moveGallery(scene, 0);
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
