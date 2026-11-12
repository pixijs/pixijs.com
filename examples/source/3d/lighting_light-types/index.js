/**
 * The four kinds of light: what each one lights, and what it costs each frame
 *
 * A `DirectionalLight` shines one way everywhere, like the sun. A `PointLight` shines every way from where it stands
 * and fades out at its `range`. A `SpotLight` is a cone along its local -z, `coneAngle` degrees from its axis to its
 * edge, with a `penumbra` that softens the edge. An `AmbientLight` adds the same light to every surface. All four share
 * `color`, `intensity` and `visible`, and the sun and the spot can cast shadows. Their costs differ: the sun is shaded
 * on every pixel, a point or spot light with a `range` only on the pixels inside that sphere, each shadow map draws the
 * shadow casters again, and ambient light is almost free.
 *
 * Controls: drag to orbit; Show picks all four lights or one alone, each light's folder switches it on and off and
 * sets its colour, intensity, range, cone and shadow, and two read-only rows count the lights and shadow maps in use.
 * URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import {
  AmbientLight,
  DirectionalLight,
  PointLight,
  SpotLight,
  View3D,
} from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, CLAY, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls, INTENSITY } from './controls';
import { createClay } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows both stations and the logo whole from the landscape distance */
const FIT_ASPECT = 1.75;
/**
 * Where the sun is aimed from. A directional light lights the same from anywhere along this line, so only its
 * direction counts; 40° up, it's low enough that every shadow reaches past its caster.
 */
const SUN_FROM = { x: -6, y: 6.5, z: 5 };
/** The spot's lamp hangs at the back left and the bulb floats at the front right, either side of the logo */
const LAMP_AT = { x: -4.6, y: 3.9, z: -2 };
const BULB_AT = { x: 3.4, y: 0.95, z: 2.2 };
/** The bulb circles its station: the circle's radius and radians a second, and a small bob */
const BULB_DRIFT = { radius: 0.35, speed: 0.7, bob: 0.08, bobSpeed: 1.1 };
/** The logo's sway, radians either way and radians a second, as gentle as the kit's so the sun's glint slides */
const SWAY = { angle: 0.15, speed: 0.4 };
/** The dark floor reflects a nineteenth as much, so there the bulb and the spot shine this many times as bright */
const DARK_POOLS = 4;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Light types' });
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
// The stage keeps its floor, backdrop and fog but none of its light: `lights: false` leaves out its key and form
// lights, and a null environment its hemisphere fill. The four lights below are all the light there is, so switching
// one off takes away exactly its share. The fog starts at the spot pool's far edge, so both stations stay clear of it.
const stage = new ThemeStage(view3d, {
  theme,
  lights: false,
  fog: { near: 16, far: 34 },
});

view3d.environment = null;

const logo = await loading.load(() => loadPixiLogo({ reflections: 0.6 }));

app.stage.addChild(view3d);
logo.root.position.y = 1.9;
view3d.root.addChild(logo.root);
createClay({ parent: view3d.root, lamp: LAMP_AT, bulb: BULB_AT });

// One direction everywhere: it shades every pixel, and its shadow map draws the shadow casters again from the light.
const sun = new DirectionalLight({
  color: BRAND.white,
  intensity: 2.4,
  castShadow: true,
  position: SUN_FROM,
  parent: view3d.root,
});

sun.lookAt({ x: 0, y: 0, z: 0 });

// Every way from one point, fading to nothing at `range`. The view shades it only on the pixels inside that sphere,
// and a point light casts no shadow. A `range` of 0 means no limit: then it shades every pixel.
const bulb = new PointLight({
  color: BRAND.sky,
  intensity: 6,
  range: 2,
  position: BULB_AT,
  parent: view3d.root,
});

// A cone down its local -z. Light from a point dims with the square of the distance, so hung 3.9 up the lamp needs 80
// to reach the floor at about 5, near what the bulb's 6 gives from 0.95 up. Its light fades out toward `range`, so 7
// reaches well past the pool's edge, 4.3 from the lamp at this cone and 4.6 at the pane's widest. The view tests every
// pixel inside that sphere against the cone, lit or not, and here the sphere takes in most of the logo, so the spot
// costs more than its pool shows.
const lamp = new SpotLight({
  color: BRAND.orange,
  intensity: 80,
  range: 7,
  coneAngle: 26,
  penumbra: 0.3,
  castShadow: true,
  position: LAMP_AT,
  parent: view3d.root,
});

lamp.lookAt({ x: LAMP_AT.x, y: 0, z: LAMP_AT.z });

// The same light on every surface, whatever way it faces: it lifts the shadows for almost nothing. A `Hemisphere`
// environment does the same with a sky and a ground colour (see lighting_environment).
const fill = new AmbientLight({
  color: CLAY.lilac,
  intensity: 1,
  parent: view3d.root,
});

const lights = { sun, bulb, lamp, fill };

/** Switches every light off but `only`, or all on for `null`; the view skips a hidden light, so it costs nothing */
function showOnly(only) {
  for (const light of Object.values(lights))
    light.visible = only === null || light === only;
}

/** A light's `color` is a pixi `Color`; `setValue` changes it in place, as assigning a colour to it does */
function setLightColor(light, value) {
  light.color.setValue(value);
}

// What the lights cost, counted from `view3d.lights` whenever the pane reads it. A view shades up to `MAX_LIGHTS` (32)
// directional, point and spot lights and holds 16 shadow maps, one per casting spot or uncascaded sun; ambient light
// counts toward neither.
const usage = {
  get lights() {
    let count = 0;

    for (const light of view3d.lights)
      if (light.visible && light.type !== 'ambient') count++;

    return count;
  },
  get shadowMaps() {
    let count = 0;

    for (const light of view3d.lights)
      if (light.visible && light.canCastShadow) count++;

    return count;
  },
};

let poolsDark = false;

/** Brightens the bulb and the spot past halfway to dark, up to their rows' tops, and dims them back; true if it did */
function matchPoolsToTheme() {
  const dark = stage.darkness > 0.5;

  if (dark === poolsDark) return false;
  poolsDark = dark;
  bulb.intensity = dark
    ? Math.min(bulb.intensity * DARK_POOLS, INTENSITY.bulb.max)
    : bulb.intensity / DARK_POOLS;
  lamp.intensity = dark
    ? Math.min(lamp.intensity * DARK_POOLS, INTENSITY.lamp.max)
    : lamp.intensity / DARK_POOLS;

  return true;
}

matchPoolsToTheme();
view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.6, 11.5);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.4, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 7,
  maxDistance: 18,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the two stations, so the camera and the fog back off until both fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });
const visuals = createVisuals({
  app,
  view3d,
  stage,
  ...lights,
  logo: logo.root,
  fitAspect: FIT_ASPECT,
});

const pane = new ThemePane({ title: 'Light types', stage });

createControls({ pane, ...lights, usage, showOnly, setLightColor });

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  if (matchPoolsToTheme()) pane.refresh();
  logo.root.rotation.y = Math.sin(time * SWAY.speed) * SWAY.angle;
  // The bulb circles its station, so its pool slides and the sides it lights turn to follow it.
  bulb.position.set(
    BULB_AT.x + Math.cos(time * BULB_DRIFT.speed) * BULB_DRIFT.radius,
    BULB_AT.y + Math.sin(time * BULB_DRIFT.bobSpeed) * BULB_DRIFT.bob,
    BULB_AT.z + Math.sin(time * BULB_DRIFT.speed) * BULB_DRIFT.radius,
  );
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
