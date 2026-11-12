/**
 * One scene on either GPU backend: pixi picks WebGPU or WebGL at `app.init`, and `@pixi/3d` draws the same frame on
 * both
 *
 * `preference` lists the backends pixi may try, in order, and `app.renderer.name` says which one it picked. By
 * default `app.init` fetches the backend it picks; a static backend import puts it in the page's bundle instead.
 *
 * Controls: drag to orbit; the pane's `preference` reloads the page with another order, and `renderer.name` shows the
 * backend that runs. URL flags: `?theme=light|dark`, `?renderer=webgpu|webgl`.
 */

// Bundles the WebGL backend with the page, so `app.init` has nothing of `@pixi/3d`'s to fetch when it picks WebGL.
// WebGPU stays a separate chunk that `app.init` fetches only if it picks WebGPU. A real page takes one way: no import,
// and `app.init` fetches whichever backend it picks; or this import with `preference: ['webgl']`, and the page ships
// WebGL alone (`@pixi/3d/webgpu` with `['webgpu']` ships WebGPU alone, with no fallback). This page mixes the two so
// the pane can switch between them. The saving shows in a built bundle; a dev server serves every module as its own
// file. Don't add `skipExtensionImports`: a static import doesn't need it, and it turns off that fetch during
// `app.init` and pixi's own browser extensions, pointer events among them.
import '@pixi/3d/webgl';
import { View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createLogoAndClay } from './scene';

/**
 * The backend orders the pane offers, by their `?renderer=` value, with the words the pane shows for each
 *
 * An array lists the only backends pixi may use, in the order it tries them. A string would only name the first
 * choice and let pixi fall back to its canvas renderer, which `@pixi/3d` can't draw with.
 */
const PREFERENCES = {
  webgpu: { order: ['webgpu', 'webgl'], text: 'WebGPU, then WebGL' },
  webgl: { order: ['webgl', 'webgpu'], text: 'WebGL, then WebGPU' },
};
/** The narrowest view, width over height, that shows the shapes' arc whole from the landscape distance */
const FIT_ASPECT = 1.6;

function isPreferenceKey(value) {
  return value !== null && Object.hasOwn(PREFERENCES, value);
}

// Read once, so the order `app.init` gets and the pane's row can't disagree; anything unknown runs WebGPU first.
const param = new URLSearchParams(location.search).get('renderer');
const choice = isPreferenceKey(param) ? param : 'webgpu';

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'WebGL and WebGPU' });
const app = new Application();

// pixi tries each backend in turn and keeps the first this browser has. The choice is fixed for the renderer's life.
await app.init({
  preference: PREFERENCES[choice].order,
  resizeTo: window,
  background: THEMES[theme].haze,
  antialias: true,
  autoStart: false,
  resolution: Math.min(window.devicePixelRatio, 2),
  autoDensity: true,
});
loading.progress(0.2);

// The scene code names no backend: these lines build the same scene on both.
const view3d = new View3D({ autoResize: true });
const stage = new ThemeStage(view3d, { theme, fog: { near: 10, far: 30 } });
const logo = await loading.load(() => loadPixiLogo());
const scene = createLogoAndClay({ view3d, logo });

app.stage.addChild(view3d);

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.2, 10);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.2, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the shapes' arc, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'WebGL and WebGPU', stage });

pane
  .addBinding({ preference: choice }, 'preference', {
    options: Object.entries(PREFERENCES).map(([value, { text }]) => ({
      text,
      value,
    })),
  })
  .on('change', ({ value }) => reloadWith(value));
// 'webgpu' or 'webgl', the backend pixi picked. Code that branches on the backend compares `app.renderer.type` with
// `RendererType.WEBGPU`, as the engine does.
pane.addBinding(app.renderer, 'name', {
  label: 'renderer.name',
  readonly: true,
});

/** A backend can't change under a running renderer, so another order reloads the page with it */
function reloadWith(key) {
  const url = new URL(location.href);

  url.searchParams.set('renderer', key);
  url.searchParams.set('theme', stage.theme);
  // `replace` keeps the playground's history clean.
  location.replace(url);
}

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  scene.update(time);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
