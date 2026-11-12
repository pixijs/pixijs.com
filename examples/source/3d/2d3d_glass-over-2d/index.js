/**
 * 3D glass bends the 2D pixi content drawn behind its view
 *
 * A `Material3D` built with a `transmission` group draws after everything opaque and samples a copy of what's on
 * screen so far, 2D included, bent by its `ior` and `thickness`. Three things let it see the 2D: the 2D is added to
 * the stage before the view, the view has no background of its own, and on WebGL the renderer keeps a back buffer to
 * copy. A face square to the camera shifts nothing; turned any way, it shifts the 2D behind it off the triangle's
 * dashed outline, which is 2D drawn after the view and so sits sharp on top.
 *
 * Controls: drag inside the view's dashed outline to turn the logo any way round, with no stop, and flick it to set it
 * spinning until it slows to rest or you grab it; the pane shows how far its front is turned from the camera, turns it
 * back to face the camera, sets the glass's ior, roughness, transmission factor and thickness, and puts the view's
 * background back. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, View3D } from '@pixi/3d';
import { Application, DEG_TO_RAD } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, mixColor, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createPoster, fitsBesidePane, placeView } from './scene';
import { turnByDrag, turnedAway } from './trackball';
import { createVisuals } from './visuals';

const TITLE = 'Glass over 2D';
/** The narrowest view, width over height, that shows the logo whole; it fills about 80% of the width there */
const FIT_ASPECT = 1.15;
/**
 * Narrower than the kit's 40: at 40 the camera would sit so close that the logo's ends are seen 20° off-axis and bend
 * even when it faces the camera
 */
const CAMERA_FOV = 26;
/** Wide enough that the bend reads in pixels */
const LOGO_WIDTH = 4.6;
/** Pale pink, so the logo reads as the brand's glass and tints what it shows */
const GLASS_TINT = mixColor(BRAND.white, BRAND.pink, 0.2);
/** The logo is about 0.6 of its own units deep; 1.5 exaggerates the bend so it reads at a glance */
const GLASS_THICKNESS = 1.5;
/** The logo opens turned 32° about y, so the bend shows; head-on, its flat faces shift nothing */
const OPEN_TURN = 32;
/** The point the camera looks at and the logo turns about */
const CENTRE = { x: 0, y: 0, z: 0 };
const UP = { x: 0, y: 1, z: 0 };

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: TITLE });
const app = new Application();

// Glass samples a copy of what's on screen. WebGPU can copy the canvas; WebGL can only copy a back buffer.
await app.init({
  preference: rendererPreference,
  resizeTo: window,
  background: THEMES[theme].haze,
  antialias: true,
  autoStart: false,
  resolution: Math.min(window.devicePixelRatio, 2),
  autoDensity: true,
  webgl: { useBackBuffer: true },
});
loading.progress(0.2);

const view3d = new View3D({ anchor: 0.5 });
const stage = new ThemeStage(view3d, { theme });

// A View3D draws no background unless it's given one. The stage gave this one its sky, which would cover the 2D.
view3d.background = null;
// The stage's fog would haze the glass, its floor would hide the poster's lower half, and nothing here casts or takes
// a shadow, so the key light skips its shadow pass.
view3d.fog = null;
stage.floor.visible = false;
stage.key.castShadow = false;
// No post effects or filters on this view: they draw it into a texture of its own, and the glass loses the 2D.

placeView(view3d, app.screen);
app.renderer.on('resize', () => placeView(view3d, app.screen));

const { poster, triangle, aboveLogo } = createPoster({
  stage,
  view3d,
  screen: app.screen,
  fitAspect: FIT_ASPECT,
});

// 2D first: the glass bends what's drawn before the view, and 2D added after it sits sharp on top.
app.stage.addChild(poster, view3d);

// The model's own material, since the glass replaces it at once.
const logo = await loading.load(() =>
  loadPixiLogo({ width: LOGO_WIDTH, material: 'source', castShadow: false }),
);
const glass = new Material3D({
  baseColor: GLASS_TINT,
  ior: 1.5,
  roughness: 0.05,
  transmission: { factor: 1, thickness: GLASS_THICKNESS },
});
// Built with the group, so it's there.
const transmission = glass.transmission;

logo.setMaterial(glass);
// Set as a quaternion, which the drag turns from here.
logo.root.quaternion.setFromAxisAngle(UP, OPEN_TURN * DEG_TO_RAD);
view3d.root.addChild(logo.root);

const visuals = createVisuals({ app, view3d, stage, triangle, aboveLogo });

// The camera stays put, level and straight on the z axis, so "behind" on screen is always behind the glass, a face
// turned square to it shifts nothing, and a drag turns the logo about the screen's own axes. It's far enough back that
// the logo, stood on end, fits the view's height.
view3d.camera.fov = CAMERA_FOV;
view3d.camera.position.set(0, 0, 11.25);
view3d.camera.lookAt(CENTRE);

// A portrait view is narrower than the logo, so the camera backs off until it fits.
fitPortrait({
  renderer: app.renderer,
  orbit: { view: view3d, target: CENTRE },
  minAspect: FIT_ASPECT,
});

// Open beside the view where it fits, folded over it where it doesn't, and folded or opened to match when a resize
// crosses that width.
let besidePane = fitsBesidePane(app.screen);
const pane = new ThemePane({ title: TITLE, stage, expanded: besidePane });

app.renderer.on('resize', () => {
  if (fitsBesidePane(app.screen) === besidePane) return;
  besidePane = !besidePane;
  pane.expanded = besidePane;
});

const copy = {
  from:
    app.renderer.name === 'webgl' ? 'webgl · back buffer' : 'webgpu · canvas',
};
const sky = { background: false };
const facing = { turnedAway: turnedAway(logo.root.quaternion) };

pane.addBinding(copy, 'from', { label: 'Glass copies', readonly: true });
pane.addBinding(sky, 'background').on('change', ({ value }) => {
  // The stage's sky draws before the copy is taken, so the glass then bends the sky instead of the 2D.
  view3d.background = value ? stage.backdrop : null;
});
// The further a face turns from the camera, the further it shifts the 2D behind it. Read from the quaternion the drag
// and its coast turn, after each turn, so it needs no polling (`interval: 0`).
const turnedRow = pane.addBinding(facing, 'turnedAway', {
  label: 'Turned away',
  readonly: true,
  interval: 0,
  format: (degrees) => `${degrees.toFixed(0)}°`,
});

function showTurn() {
  facing.turnedAway = turnedAway(logo.root.quaternion);
  turnedRow.refresh();
}

const drag = turnByDrag({
  view3d,
  node: logo.root,
  ticker: app.ticker,
  onTurn: showTurn,
});
// Head-on, the flat faces shift nothing: the orange sits on its outline, and only the rounded rims bend. A coast left
// running would carry it straight off again.
pane.addButton({ title: 'Face the camera' }).on('click', () => {
  drag.stopCoast();
  logo.root.quaternion.set(0, 0, 0, 1);
  showTurn();
});

pane.addBinding(glass, 'ior', { min: 1, max: 2.4, step: 0.01 });
pane.addBinding(glass, 'roughness', { min: 0, max: 1, step: 0.01 });

const transmissionFolder = pane.addFolder({ title: 'transmission' });

transmissionFolder.addBinding(transmission, 'factor', {
  min: 0,
  max: 1,
  step: 0.01,
});
transmissionFolder.addBinding(transmission, 'thickness', {
  min: 0,
  max: 3,
  step: 0.01,
});

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
