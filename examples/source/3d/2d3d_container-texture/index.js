/**
 * A live 2D pixi scene on a 3D surface: `ContainerTexture` captures a `Container` into a texture any material samples
 *
 * The texture holds whatever `render()` last captured, so you choose when it runs: every frame for animation, or only
 * when your own dirty flag says the picture changed. Here only the clock sets the flag, so in that mode the clock
 * keeps time while the screen's PixiJS wordmark falls behind the container's, outlined where it is now. `resolution`
 * sets how many texels hold the same layout.
 *
 * Controls: drag to orbit; the pane picks when `render()` runs and the texture's resolution, and reads back its texels
 * and captures a second. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { ContainerTexture, FlatMaterial, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { createMonitor } from './theme/monitor';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createScreenUi } from './scene';
import { createVisuals } from './visuals';

/** The UI's own pixels; the screen takes the same aspect, so nothing stretches */
const UI_SIZE = { width: 512, height: 320 };
/** The screen's width in world units, and its centre's height, floating the bezel's lower edge 0.8 over the floor */
const SCREEN_WIDTH = 3.2;
const MONITOR_Y = 1.95;
/** The monitor swivels this far either way, in radians, once every 12 s, so the picture visibly rides the 3D surface */
const SWIVEL = 0.2;
const SWIVEL_PERIOD = 12;
/** The narrowest view, width over height, that shows the swivelling bezel whole from the landscape distance */
const FIT_ASPECT = 0.85;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Container texture' });
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

app.stage.addChild(view3d);

/** The pane's two choices: when `render()` runs, and the texture's texels per UI pixel */
const settings = { render: 'every frame', resolution: 1 };
let uiDirty = false;

// The 2D side: plain pixi, drawn in its own pixels from (0, 0).
const ui = createScreenUi(UI_SIZE);

// The texture captures the window from (0, 0) to (width, height) in the container's pixels, at `resolution` texels a
// pixel. The container leaves its parent to live in the texture. With the renderer kept, it captures once now, and
// `render()` needs no argument.
const uiTexture = new ContainerTexture({
  container: ui.root,
  renderer: app.renderer,
  width: UI_SIZE.width,
  height: UI_SIZE.height,
  resolution: settings.resolution,
});

// The texture is stored upright for a plane's default UVs, so the screen needs no flip. FlatMaterial shows it as pixi
// drew it, untouched by lights, tone mapping and, with `fog: false`, the haze: a powered screen.
const monitor = createMonitor({
  material: new FlatMaterial({ baseColorTexture: uiTexture, fog: false }),
  width: SCREEN_WIDTH,
  aspect: UI_SIZE.width / UI_SIZE.height,
});

monitor.root.position.y = MONITOR_Y;
view3d.root.addChild(monitor.root);

/** What the pane reads back: the texture's size in texels, and the captures in the last whole second */
const readout = {
  texels: `${uiTexture.source.pixelWidth} × ${uiTexture.source.pixelHeight}`,
  captures: 0,
};

/** The same layout in more or fewer texels; the resize drops the old picture, so the next tick captures again */
function setResolution(resolution) {
  uiTexture.source.resize(UI_SIZE.width, UI_SIZE.height, resolution);
  readout.texels = `${uiTexture.source.pixelWidth} × ${uiTexture.source.pixelHeight}`;
  uiDirty = true;
}

const visuals = createVisuals({ monitor, ui, uiSize: UI_SIZE });

view3d.camera.fov = 40;
view3d.camera.position.set(1.8, 3.6, 6.7);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: MONITOR_Y, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 4,
  maxDistance: 14,
  // Above the floor, and round the front, where the screen faces.
  maxPolarAngle: Math.PI * 0.45,
  minAzimuthAngle: -1.2,
  maxAzimuthAngle: 1.2,
});

// A portrait screen is narrower than the bezel, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Container texture', stage });

pane.addBinding(settings, 'render', {
  label: 'Render',
  options: { 'Every frame': 'every frame', 'On change': 'on change' },
});
// More texels than the screen covers on the canvas can't sharpen it: 2 beats 1 only up close or on a dense display.
pane
  .addBinding(settings, 'resolution', {
    options: { 0.25: 0.25, 0.5: 0.5, 1: 1, 2: 2 },
  })
  .on('change', ({ value }) => setResolution(value));
pane.addBinding(readout, 'texels', { label: 'Texels', readonly: true });
pane.addBinding(readout, 'captures', {
  label: 'Captures / s',
  readonly: true,
  format: (n) => n.toFixed(0),
});

let time = 0;
let captures = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  monitor.root.rotation.y =
    SWIVEL * Math.sin((time * Math.PI * 2) / SWIVEL_PERIOD);

  // `ui.update` moves the wordmark and the clock but reports only the clock's text changing, so the clock is the one
  // change the flag hears of. The wordmark moves every tick and never sets it.
  const clockChanged = ui.update(time);

  if (clockChanged) uiDirty = true;

  // Before the scene draws, so the screen shows this tick's picture. `autoUpdate: true` would capture from
  // `Ticker.shared`, which this app doesn't render from, so it would show the tick before.
  if (settings.render === 'every frame' || uiDirty) {
    uiTexture.render();
    captures++;
  }
  uiDirty = false;

  // The clock turns over once a second, which closes the second the pane counts captures over.
  if (clockChanged) {
    readout.captures = captures;
    captures = 0;
  }
  visuals.update(settings.render === 'on change');
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it. The constructor's
// own capture is the picture that frame shows.
orbit.update();
visuals.update(settings.render === 'on change');
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
