/**
 * Iridescence: a thin film over a surface, whose colour shifts with the angle you see it from
 *
 * Passing the `iridescence` group to a `Material3D` lays a film a few hundred nanometres thick over the surface, like
 * soap on a bubble or oil on a puddle. Light reflects off the film's top and off the surface under it, and the second
 * reflection lags the first by an amount the film's thickness, its `ior` and the view angle set, so some colours
 * strengthen and the rest cancel. `factor` blends the film in, and a `thicknessTexture` spreads its thickness between
 * `thicknessMinimum` and `thicknessMaximum`: the strip under the logo wears one, so it lays out every thickness in the
 * range side by side. Every value changes at run time with no shader recompile.
 *
 * Controls: drag to orbit; the pane sets the film's four values, and Turn stops the logo. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, mixColor, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { loadReflections, ThemeStage } from './theme/ThemeStage';
import {
  createFilmStrip,
  createThicknessRamp,
  placeLogo,
  SWAY_START,
  swayLogo,
} from './scene';
import { createVisuals } from './visuals';

const TITLE = 'Iridescence';
/** The narrowest view, width over height, that shows the strip and its end tags whole from the landscape distance */
const FIT_ASPECT = 0.82;
/** A mid-grey metal: dark enough that the film's colour, not the metal's own shine, fills the reflection */
const METAL = mixColor(BRAND.white, BRAND.night, 0.5);
/** The engine's defaults, written out so you can see what the pane changes */
const FILM = {
  factor: 1,
  ior: 1.3,
  thicknessMinimum: 0,
  thicknessMaximum: 400,
};

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

// The film only tints what the surface reflects, so the stage lights the scene with the kit's greyscale cube map,
// which gives the film's colours nothing to mix with. The logo keeps its model's material, which the lesson replaces.
const [reflections, logo] = await loading.load(() =>
  Promise.all([loadReflections(), loadPixiLogo({ material: 'source' })]),
);
// At the screen's size from the start, so the first frame's labels are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// No form light: on the dark theme its highlight would sit on the logo as a bright point among the film's colours.
const stage = new ThemeStage(view3d, { theme, reflections, form: false });
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();

app.stage.addChild(view3d);

// Passing the group turns the film on. With no thickness map, the logo's film is thicknessMaximum thick all over.
const logoFilm = new Material3D({
  baseColor: METAL,
  metallic: 1,
  roughness: 0.3,
  iridescence: FILM,
});

logo.setMaterial(logoFilm);
placeLogo(logo);
view3d.root.addChild(logo.root);

// The strip's map runs green from 0 at its left end to 1 at its right, so its film runs from thicknessMinimum to
// thicknessMaximum across it: a legend to read the logo's colour against.
const stripFilm = new Material3D({
  baseColor: METAL,
  metallic: 1,
  roughness: 0.3,
  iridescence: {
    ...FILM,
    // Its red stays white: it shares a slot with the packed `texture`, whose red scales factor.
    thicknessTexture: createThicknessRamp(),
  },
});
const strip = createFilmStrip(stripFilm);

view3d.root.addChild(strip);

// Both were built with the group, so both have it.
const logoIridescence = logoFilm.iridescence;
const stripIridescence = stripFilm.iridescence;

/** Copies the logo's film onto the strip's, which keeps its own map */
function matchStrip() {
  stripIridescence.factor = logoIridescence.factor;
  stripIridescence.ior = logoIridescence.ior;
  stripIridescence.thicknessMinimum = logoIridescence.thicknessMinimum;
  stripIridescence.thicknessMaximum = logoIridescence.thicknessMaximum;
}

const visuals = createVisuals({ app, view3d, stage, strip });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.5, 8.6);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.65, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 13,
  // Within about 20° of the strip's face, so it still reads as a straight-on legend, and the strip, a one-sided plane,
  // stays turned to the camera, which stays off the floor.
  minPolarAngle: Math.PI * 0.4,
  maxPolarAngle: Math.PI * 0.48,
  minAzimuthAngle: -0.3,
  maxAzimuthAngle: 0.3,
});

// A portrait screen is narrower than the strip, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: TITLE, stage });

// A narrower value column leaves the names room for `thicknessMaximum`.
pane.element.style.setProperty('--tp-blade-value-width', '136px');

const motion = { turn: true };
/** Two decimals, since the values are stored as 32-bit floats and 1.3 reads back as 1.2999999523 */
const twoPlaces = (value) => value.toFixed(2);
// The film's values, bound straight to the logo's runtime group; the folder hears every row's change.
const filmRows = pane.addFolder({ title: 'iridescence' });

filmRows.addBinding(logoIridescence, 'factor', {
  min: 0,
  max: 1,
  format: twoPlaces,
});
// From the air's 1, where the film vanishes seen straight on, past soap (1.33) and oil (1.5) to titanium dioxide.
filmRows.addBinding(logoIridescence, 'ior', {
  min: 1,
  max: 2.4,
  format: twoPlaces,
});
// Up to the film's starting maximum, since past it the strip's range runs backwards, thick to thin.
filmRows.addBinding(logoIridescence, 'thicknessMinimum', {
  min: 0,
  max: FILM.thicknessMaximum,
  step: 10,
});
filmRows.addBinding(logoIridescence, 'thicknessMaximum', {
  min: 0,
  max: 1200,
  step: 10,
});
filmRows.on('change', matchStrip);
pane.addBinding(motion, 'turn', { label: 'Turn' });

let time = SWAY_START;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  // The lag shrinks with the angle inside the film, so a face seen at a slant shows the colour a thinner film shows
  // straight on: as the logo turns away, its faces walk left along the strip's colours, and back as it turns home.
  if (motion.turn) {
    time += dt;
    swayLogo(logo, time);
  }
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
swayLogo(logo, time);
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
