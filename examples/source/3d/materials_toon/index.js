/**
 * Cel shading with `ToonMaterial` and the ink line of `OutlinePass`
 *
 * The toon look has two halves. The material rounds the light a surface gets into `bands` flat tones, with a
 * soft-edged highlight disc (`specularSize`) and a rim glow (`rimIntensity`, `rimPower`) on top. The pass, on the
 * view, draws the ink: it redraws every mesh whose material opts in a little larger and inside out, so only a rim of
 * it shows round the silhouette; the torus opts out with `outline: false`. At runtime the material's values change
 * through `material.data` and the pass's `enabled` flips in place; a new width or colour takes a new pass in
 * `view3d.passes`.
 *
 * Controls: drag to orbit; the pane sets the toon values and the ink's width, colour and on or off. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { AmbientLight, DirectionalLight, View3D } from '@pixi/3d';
import { OrbitCamera, OutlinePass, ToonMaterial } from '@pixi/3d/extras';

import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, CLAY, mixColor, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import { createProps } from './scene';
import { createVisuals } from './visuals';

const TITLE = 'Toon shading';
/** Toon light isn't divided by π as PBR light is, so a key well under the stage's 2.2 keeps the top bands apart */
const KEY_INTENSITY = 0.85;
/** Lifts the unlit tone to about a fifth of full light: dark enough that four tones stay distinct */
const AMBIENT_INTENSITY = 0.45;
/** From the upper left and front, so the sphere's rings circle its upper left and the logo's face sits clear of a step */
const KEY_POSITION = { x: -4.5, y: 6, z: 6.6 };
/** A band rounds a sliver of shadow up to a whole step, so this keeps self-shadow speckle from hatching the cube */
const SHADOW_NORMAL_BIAS = 0.04;
/** The floor is PBR and lost the stage's brighter key; toon materials ignore the environment, so this lifts the floor */
const FLOOR_FILL = 1.3;
/** Under the kit's 4, so the sphere below stays the focal point */
const LOGO_WIDTH = 3.2;
/** The narrowest view, width over height, that shows the torus and the cube whole from the landscape distance */
const FIT_ASPECT = 1.12;

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

// The ink half lives on the view, built from these options. `width` is in each mesh's own units, about 5 px round
// the sphere from the start view; the logo's meshes are scaled down to 0.44, so its line is 0.44 as thick. The dark
// purple reads on both themes.
const outlineOptions = {
  width: 0.04,
  color: mixColor(BRAND.purple, BRAND.ink, 0.35),
  enabled: true,
};
let outline = new OutlinePass(outlineOptions);
// Built at the screen's size: `autoResize` adopts it only at the view's first render, and the tags are placed before.
const view3d = new View3D({
  width: app.screen.width,
  height: app.screen.height,
  autoResize: true,
  passes: [outline],
});
// The lesson brings its own lights, below; the stage keeps its floor, fog, backdrop and sky fill.
const stage = new ThemeStage(view3d, { theme, lights: false });
// A copy of the stage's fill at `FLOOR_FILL` of its strength, lighting the view in its place. The ticker copies the
// stage's colours and intensity across every frame, so it follows the theme's fades.
const fill = { ...stage.fill, intensity: stage.fill.intensity * FLOOR_FILL };

view3d.environment = fill;

app.stage.addChild(view3d);

// `ToonMaterial` reads only direct lights and `AmbientLight`, not the stage's sky fill, so without the ambient light
// its unlit tone would be black. Each band steps one light, so a single key keeps one set of rings.
const keyLight = new DirectionalLight({
  intensity: KEY_INTENSITY,
  castShadow: true,
  shadow: { normalBias: SHADOW_NORMAL_BIAS },
  position: KEY_POSITION,
  parent: view3d.root,
});
new AmbientLight({ intensity: AMBIENT_INTENSITY, parent: view3d.root });

keyLight.lookAt({ x: 0, y: 0, z: 0 });

// 'source' skips the five enamel materials, since the lesson replaces them at once.
const logo = await loading.load(() =>
  loadPixiLogo({ material: 'source', width: LOGO_WIDTH }),
);

// The material half, every toon material built from these values. `specularSize` is under the default 0.15, so the
// logo's flat face stays clear of the highlight at rest. The shader softens the highlight's edge over a fixed 0.02
// past it, so even 0 leaves a faint glow. `rimPower` 4 over 3 keeps the rim off the camera-facing part of the darkest
// ring, and `rimIntensity` 0.5 over 0.4 keeps that thinner rim in view.
const toonOptions = {
  bands: 3,
  specularSize: 0.03,
  rimIntensity: 0.5,
  rimPower: 4,
};
// Every toon material joins the outline pass unless it's built with `outline: false`, as the torus is.
const logoToon = new ToonMaterial({
  baseColor: BRAND.logoFace,
  ...toonOptions,
});
const sphereToon = new ToonMaterial({ baseColor: CLAY.sky, ...toonOptions });
const torusToon = new ToonMaterial({
  baseColor: CLAY.orange,
  ...toonOptions,
  outline: false,
});
const cubeToon = new ToonMaterial({ baseColor: CLAY.lilac, ...toonOptions });
const toonMaterials = [logoToon, sphereToon, torusToon, cubeToon];

logo.setMaterial(logoToon);

const props = createProps({
  parent: view3d.root,
  logo,
  sphere: sphereToon,
  torus: torusToon,
  cube: cubeToon,
});

/** A toon material keeps its values in `data`, which its shader reads: a write uploads on the next render, no recompile */
function applyToonOptions() {
  for (const material of toonMaterials) {
    material.data.bands = toonOptions.bands;
    material.data.specularSize = toonOptions.specularSize;
    material.data.rimIntensity = toonOptions.rimIntensity;
    material.data.rimPower = toonOptions.rimPower;
  }
}

/** `enabled` is a live field: a flip rebuilds the view's render graph on the next render, with no new shader */
function applyOutlineEnabled() {
  outline.enabled = outlineOptions.enabled;
}

/**
 * Width and colour are constants in the pass's shader, so changing either takes a new pass in the old one's place.
 * Each pair compiles a shader of its own: a settings change, not an animation.
 */
function rebuildOutline() {
  const retired = outline;

  outline = new OutlinePass(outlineOptions);
  view3d.passes = [outline];
  // The view never destroys a pass it drops, since one pass can serve several views.
  retired.destroy();
}

const visuals = createVisuals({
  app,
  view3d,
  stage,
  sphere: props.sphere,
  torus: props.torus,
  keyLight,
});

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.8, 9);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.7, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 14,
  // Above the start view's 0.46π, so the first update doesn't lift it; the azimuth keeps the lit side in view.
  maxPolarAngle: Math.PI * 0.47,
  minAzimuthAngle: -0.7,
  maxAzimuthAngle: 0.7,
});

// A portrait screen is narrower than the row of shapes, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: TITLE, stage });

createControls({
  pane,
  toon: toonOptions,
  outline: outlineOptions,
  onToon: applyToonOptions,
  onOutline: rebuildOutline,
  onEnabled: applyOutlineEnabled,
});

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  Object.assign(fill, stage.fill).intensity *= FLOOR_FILL;
  props.move(time);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
props.move(time);
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
