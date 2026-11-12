/**
 * Stacking effects: a view's post effects are one list, `view3d.passes`, and the frame runs through it in order
 *
 * The scene draws into a texture, each enabled effect reads the image the one before it wrote, and the last one draws
 * to the screen, so order matters only where two effects don't commute: greyscale then tint is sepia, tint then
 * greyscale is grey, while the blur runs at an earlier stage wherever it sits. `enabled = false` skips an effect but
 * keeps it in the list, and with every effect off the view draws straight to the screen. A flip or a new array
 * rebuilds the render graph once, fine for a toggle but not every frame, while an effect's own settings, such as
 * `tint.tint` and `tiltShift.focalDepth`, are uniform writes cheap enough for every frame.
 *
 * Controls: drag to orbit; the pane picks the order of `view3d.passes`, switches each effect on and off, and sets the
 * tint's colour. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';
import { OrbitCamera, TiltShiftEffect, TintEffect } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, mixColor, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { GreyscaleEffect } from './GreyscaleEffect';

/** The narrowest view, width over height, that shows the logo whole with a margin from the landscape distance */
const FIT_ASPECT = 0.7;
/** The tint's colour, light enough that the sepia frame stays easy to read */
const SEPIA = mixColor(BRAND.orange, BRAND.white, 0.4);

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Stacking effects' });
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
const stage = new ThemeStage(view3d, {
  theme,
  spotlight: true,
  fog: { near: 10, far: 30 },
});
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();
const logo = await loading.load(() => loadPixiLogo());

app.stage.addChild(view3d);
logo.root.position.y = 1.7;
view3d.root.addChild(logo.root);

// Blurs by depth, so it reads the scene's depth as well as its image. A sharp band 1 unit either side of the focal
// plane keeps the whole logo in focus through its sway.
const tiltShift = new TiltShiftEffect({ focalNear: 1, focalFar: 4 });
// Ours, from ./GreyscaleEffect: every pixel's luma in all three channels.
const greyscale = new GreyscaleEffect();
// The simplest built-in effect: every pixel times `tint`.
const tint = new TintEffect({ tint: SEPIA });

// They run in this order, each reading the image the one before it wrote; the last enabled one draws to the screen.
view3d.passes = [tiltShift, greyscale, tint];

// The orders the pane offers, each named by the array it assigns. The first is the one above: sepia. Swapping the
// last two runs greyscale after the tint, which throws the tint away. Moving the blur last changes nothing: it runs at
// the default 'beforeToneMapping' stage, before the other two, wherever it sits in the list.
const ORDERS = {
  '[tiltShift, greyscale, tint]': [tiltShift, greyscale, tint],
  '[tiltShift, tint, greyscale]': [tiltShift, tint, greyscale],
  '[greyscale, tint, tiltShift]': [greyscale, tint, tiltShift],
};

const stack = { order: '[tiltShift, greyscale, tint]' };

// Level with the logo, so it stands over the haze: once greyscale takes the hue away, the dark floor's lit checks are
// as light as the logo's face.
view3d.camera.fov = 40;
view3d.camera.position.set(0, 1.9, 10);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.7, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  maxPolarAngle: Math.PI / 2,
});

// A portrait screen is narrower than the logo, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Stacking effects', stage });
const orderRow = pane
  .addFolder({ title: 'view3d.passes' })
  .addBinding(stack, 'order', {
    options: Object.keys(ORDERS).map((text) => ({ text, value: text })),
  });

// The options are too long to share the row with a label, so the folder's title names the property.
orderRow.label = null;
// Only a new array reorders the stack: the view copies the one it's given, so editing it in place does nothing.
orderRow.on('change', () => {
  view3d.passes = ORDERS[stack.order];
});
// A folder per effect, so each row is labelled with the property it sets and the label fits.
pane.addFolder({ title: 'tiltShift' }).addBinding(tiltShift, 'enabled');
pane.addFolder({ title: 'greyscale' }).addBinding(greyscale, 'enabled');

const tintFolder = pane.addFolder({ title: 'tint' });

tintFolder.addBinding(tint, 'enabled');
// The getter reads back a hex number and the setter takes any colour, so the row binds the effect straight.
tintFolder.addBinding(tint, 'tint', { view: 'color' });

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  logo.root.rotation.y = Math.sin(time * 0.4) * 0.25;
  // The focal plane is a distance from the camera, so it follows the orbit's zoom and the portrait back-off; a uniform
  // write, fine every frame.
  tiltShift.focalDepth = orbit.distance;
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
tiltShift.focalDepth = orbit.distance;
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
