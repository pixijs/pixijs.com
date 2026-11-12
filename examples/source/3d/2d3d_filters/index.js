/**
 * Pixi filters on a 3D view: a View3D is a pixi Container, so pixi filters, masks and fades it like a sprite
 *
 * The 3D scene draws into the view's rectangle, and pixi then works on that rectangle's finished pixels.
 * `view3d.filters` runs stock pixi filters over it (`BlurFilter`, `ColorMatrixFilter`, `AlphaFilter`), each filter's
 * `enabled` skips it, and `view3d.mask` clips the result to a `Graphics` shape. pixi masks after it filters, so the
 * cut stays sharp under the blur. The striped 2D panel round and behind the view is never touched.
 *
 * Controls: drag the card to orbit; the pane turns each filter and the mask on and off and sets how strong each is.
 * It opens with the blur and the mask on. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import {
  AlphaFilter,
  Application,
  BlurFilter,
  ColorMatrixFilter,
  Container,
  Graphics,
} from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import { createPage, fitCard } from './scene';

/** The mask's corner radius, in px: round enough to read as a cut at a glance */
const MASK_RADIUS = 48;
/**
 * The narrowest view, width over height, whose width the swaying logo spans about 72% of from the landscape distance.
 * A narrower view backs the camera off to keep it there, so a phone's card still shows floor either side of the logo.
 */
const FIT_ASPECT = 1.15;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Filters' });
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

// The view is a card in a 2D page, not the whole screen, so each effect has 2D round it and behind it to show
// against. `anchor: 0.5` centres it on its position, as a sprite's would; `layout()` sizes it to the room the pane
// leaves.
const card = new Container();
const view3d = new View3D({ anchor: 0.5 });
const stage = new ThemeStage(view3d, { theme, fog: { near: 14, far: 40 } });
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();
const page = createPage({ app, stage });
const logo = await loading.load(() => loadPixiLogo());

logo.root.position.y = 1.3;
view3d.root.addChild(logo.root);

// A filter draws the view into a texture first. It keeps the canvas's antialiasing and pixel density only while every
// enabled filter inherits them; pixi's defaults, `antialias: 'off'` and `resolution: 1`, leave it jagged and soft.
const matchCanvas = { antialias: 'inherit', resolution: 'inherit' };
// pixi's default `quality` is 4; 3 saves a pass each way on a phone and looks the same at this strength.
const blur = new BlurFilter({ strength: 2, quality: 3, ...matchCanvas });
const colorMatrix = new ColorMatrixFilter(matchCanvas);
// A View3D ignores its own `alpha` today, so an AlphaFilter is what fades it over the 2D behind.
const fade = new AlphaFilter({ alpha: 0.35, ...matchCanvas });

// The matrix turns every colour grey; the filter's `alpha`, 1 by default, is how much of that mixes in.
colorMatrix.desaturate();
// Each filter runs on the one before's output, and one that's not `enabled` is skipped: the view opens with only the
// blur running. With all three off, pixi skips the filter pass and the view draws straight to the canvas. A filter
// left on at strength 0 still costs its passes, so on a phone switch it off rather than turning it down.
colorMatrix.enabled = false;
fade.enabled = false;
view3d.filters = [blur, colorMatrix, fade];

const roundedMask = new Graphics();
const maskSettings = { enabled: true, radius: MASK_RADIUS };

/** Draws the mask over the view's rectangle, for a new size or radius */
function drawMask() {
  const { width, height } = view3d;

  roundedMask
    .clear()
    .roundRect(-width / 2, -height / 2, width, height, maskSettings.radius)
    .fill(0xffffff);
}

/** Puts the mask on the view or takes it off */
function applyMask() {
  view3d.mask = maskSettings.enabled ? roundedMask : null;
  // A Graphics that stops being a mask draws again, so it hides while it's off.
  roundedMask.visible = maskSettings.enabled;
}

// The mask sits beside the view in the card, so it moves with it.
card.addChild(page.panel, view3d, roundedMask);
app.stage.addChild(card);
applyMask();

view3d.camera.fov = 40;
// Looking down about 33°, so the checker fills the card to its top edge. From 6.8 units the logo spans under 60% of a
// landscape card, leaving floor all round it for each filter to show on.
view3d.camera.position.set(0, 4.9, 5.75);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.2, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 4.5,
  maxDistance: 9,
  minPolarAngle: 0.5,
  // Short of the horizon, which would melt into the page on the light theme and lose the view's top edge.
  maxPolarAngle: 1,
});

const pane = new ThemePane({ title: 'Filters', stage });

createControls({
  pane,
  blur,
  colorMatrix,
  fade,
  maskSettings,
  drawMask,
  applyMask,
});

/**
 * Fits the card beside or under the pane. `setSize` resizes the viewport, like a TilingSprite's, rather than scaling
 * the view as a plain Container's would, so the 3D keeps its proportions at any size.
 */
function layout() {
  const fit = fitCard(
    app.screen,
    pane.element.getBoundingClientRect(),
    FIT_ASPECT,
  );

  card.position.set(fit.x, fit.y);
  view3d.setSize(fit.width, fit.height);
  page.frameView(fit);
  drawMask();
}

layout();
app.renderer.on('resize', layout);
// A card narrower than `FIT_ASPECT` backs the camera and the fog off. Its resize handler runs after `layout`'s, so it
// measures the view at its new size.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  page.update();
  // A slow sway keeps the scene live while the reader works the pane.
  logo.root.rotation.y = Math.sin(time * 0.4) * 0.25;
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
