/**
 * Environment light: where image-based light comes from
 *
 * `view3d.environment` lights the scene from every direction at once. A cube map gives it six photos, a `Hemisphere`
 * two colours and a `ColorCubeTexture` one; a mirror shows the source itself and a matte surface its soft average.
 * `view3d.background` draws a source behind the scene apart from the light: turn it off and the logo still mirrors
 * the source.
 *
 * Controls: drag to orbit, all the way round to find the sunset the logo mirrors; the pane picks the source and
 * whether it's drawn as the background. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { ColorCubeTexture, Material3D, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, mixColor, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createProbes } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the logo and both balls whole from the landscape distance */
const FIT_ASPECT = 0.85;
/** A sunset over the Venice lagoon, 512 px a face: small enough for a phone, and soft once a screen stretches it */
const CUBE_MAP_URL =
  'https://pixijs.com/assets/3d/venice-sunset/venice-sunset.cubemap';
/** The cube map's average colour, for the flat source */
const FLAT_COLOR = 0x9ea8ba;
/**
 * Pink enough to stand clear of the simpler sources' blue-grey backdrops, pale enough that the logo's reflections keep
 * the environment's own colours; its deep face pink turns every reflection the same dark rose
 */
const LOGO_METAL = mixColor(BRAND.white, BRAND.logoFace, 0.35);
/** Just off a mirror, so the bevels' reflections hold together */
const LOGO_ROUGHNESS = 0.08;
/**
 * How far the logo sways either way, in radians. A reflection turns twice as far as its mirror, so this swings what
 * the logo's front mirrors into the sunset glare behind the camera and out again.
 */
const SWAY_ANGLE = 0.35;
/** Radians a second: one sway every 12 s, slow enough to watch the logo's front brighten and dull with it */
const SWAY_RATE = (2 * Math.PI) / 12;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Environment light' });
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

// At the screen's size from the start, so the first frame's labels are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// The environment is the only light here and the backdrop too, so the stage keeps only its theme: no floor, fog or
// direct lights.
const stage = new ThemeStage(view3d, { theme, lights: false });

stage.floor.visible = false;
view3d.fog = null;
app.stage.addChild(view3d);

// A `.cubemap` file is JSON naming six images: right (+x), left (−x), top (+y), bottom (−y), front (+z) and back
// (−z). The logo keeps its model's material for now, since the lesson replaces it at once.
const [cubeMap, logo] = await loading.load(() =>
  Promise.all([
    Assets.load(CUBE_MAP_URL),
    loadPixiLogo({ material: 'source' }),
  ]),
);

// The same surroundings with less detail. The hemisphere's colours are the light the cube map gives a surface facing
// straight up and straight down; the flat colour is its average.
const hemisphere = { skyColor: 0xb2cdf2, groundColor: 0x69676c };
// One texel a face. It's still a cube map, so swapping it for a real one never rebuilds a material shader.
const flat = ColorCubeTexture.from(FLAT_COLOR);

// What each source lights the scene with, and what it draws behind it. The flat source gives the background its
// colour rather than the cube, so the backdrop skips the texture read.
const sources = {
  cubeMap: { environment: cubeMap, background: cubeMap },
  hemisphere: { environment: hemisphere, background: hemisphere },
  flat: { environment: flat, background: FLAT_COLOR },
};

/** Lights the scene with a source, and draws it behind the scene or doesn't */
function useSource(source, background) {
  view3d.environment = sources[source].environment;
  // With no background the view draws nothing behind the scene and the app's clear colour shows through, while the
  // logo still mirrors the source: the light comes from `environment` alone.
  view3d.background = background ? sources[source].background : null;
}

// A metal has no diffuse colour: baseColor only tints what it reflects, so the logo shows whichever source is on.
logo.setMaterial(
  new Material3D({
    baseColor: LOGO_METAL,
    metallic: 1,
    roughness: LOGO_ROUGHNESS,
  }),
);
logo.root.position.y = 0.7;
// Turned to the sway's peak, where the first tick finds it.
logo.root.rotation.y = SWAY_ANGLE;
view3d.root.addChild(logo.root);

const probes = createProbes({ parent: view3d.root });
const visuals = createVisuals({ app, view3d, stage, probes });

view3d.camera.fov = 40;
// It looks a little up, so the sky sits behind the logo.
view3d.camera.position.set(0, -0.8, 10.5);

// No limit round the turn: the logo's front mirrors what lies behind the camera, so going round shows where its
// light comes from.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: -0.15, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 7,
  maxDistance: 16,
  minPolarAngle: Math.PI * 0.2,
  maxPolarAngle: Math.PI * 0.8,
});

// A portrait screen is narrower than the logo and its two balls, so the camera backs off until they fit.
fitPortrait({ renderer: app.renderer, orbit, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Environment light', stage });
const settings = { source: 'cubeMap', background: true };
const applySettings = () => useSource(settings.source, settings.background);

pane
  .addBinding(settings, 'source', {
    label: 'Source',
    options: {
      'Cube map': 'cubeMap',
      Hemisphere: 'hemisphere',
      'Flat colour': 'flat',
    },
  })
  .on('change', applySettings);
pane.addBinding(settings, 'background').on('change', applySettings);

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  // With the background off the app's clear colour shows, so it follows the theme as the pane does.
  app.renderer.background.color = mixColor(
    THEMES.light.haze,
    THEMES.dark.haze,
    stage.darkness,
  );
  logo.root.rotation.y = Math.cos(time * SWAY_RATE) * SWAY_ANGLE;
  visuals.update();
});

// Each kind of environment builds its own material shaders, the background one shader for a cube map and one for a
// gradient, and each cube map is prefiltered the first time it's used. So every source is drawn once behind the
// loading screen, and the reader's first switch never stalls.
for (const { environment, background } of Object.values(sources)) {
  view3d.environment = environment;
  view3d.background = background;
  app.render();
}
applySettings();

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
