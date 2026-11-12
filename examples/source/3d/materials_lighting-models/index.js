/**
 * Three lighting models side by side: `Material3D` (PBR), `PhongMaterial` (Blinn-Phong) and `FlatMaterial` (unlit)
 *
 * A material decides how a surface answers light. `Material3D` is physically based: each light adds diffuse shading
 * and a GGX highlight, and the view's environment adds fill and a reflection of the surroundings. `PhongMaterial` adds
 * the same diffuse and a highlight whose size `shininess` sets, but takes only fill from the environment, for fewer
 * texture reads a pixel. `FlatMaterial` draws its colour as it is. All three take the same `baseColor` and go on a mesh
 * the same way, so switching models is a one-line change.
 *
 * Controls: drag to orbit; the pane sets the shared baseColor, Phong's shininess and the key light's angle, which the
 * two lit columns answer and the flat one ignores. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import {
  FlatMaterial,
  Material3D,
  Mesh3D,
  PhongMaterial,
  SphereGeometry,
  Spherical,
  View3D,
} from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, DEG_TO_RAD } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { loadReflections, ThemeStage } from './theme/ThemeStage';
import { BALL_RADIUS, createColumn, LOGO_WIDTH, pickLayout } from './scene';
import { createVisuals } from './visuals';

const TITLE = 'PBR, Phong and flat';
/** Glossy enough that the PBR ball mirrors the sky at its rim */
const ROUGHNESS = 0.35;
/** About roughness 0.35's highlight (shininess ≈ 2 / roughness⁴ − 2), so the lit balls differ only in what PBR adds */
const SHININESS = 128;
/** 4% reflectance head-on, a Material3D non-metal's; Phong's default 0x111111 gives a highlight a seventh as strong */
const PHONG_SPECULAR = 0x383838;
/** The key light's angle down from straight up, 45°: low enough that the highlights land on the balls' faces */
const KEY_PHI = Math.PI / 4;
/** How far the pane turns the key light either side of the camera, in degrees */
const KEY_RANGE = 40;
/** From the left, so each lit ball's highlight sits clear of the PBR ball's reflection at its upper right */
const KEY_START = -40;
const ORIGIN = { x: 0, y: 0, z: 0 };

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

// A wide screen gets a row of columns, a short landscape one side-by-side pairs, a portrait one a stack.
const layout = pickLayout(app.screen.width, app.screen.height);

// PBR reflects its surroundings and Phong doesn't. A reflection needs something to reflect, so the stage lights the
// scene with the kit's cube map, not its plain sky. `'source'` skips the kit's enamel, which the lesson replaces.
const logoOptions = { width: LOGO_WIDTH, material: 'source' };
const [reflections, ...logos] = await loading.load(() =>
  Promise.all([
    loadReflections(),
    loadPixiLogo(logoOptions),
    loadPixiLogo(logoOptions),
    loadPixiLogo(logoOptions),
  ]),
);
// At the screen's size from the start, so the first frame's labels are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// No form light: on the dark theme it adds a second, brighter highlight to each lit ball that the key light's angle
// doesn't move.
const stage = new ThemeStage(view3d, {
  theme,
  reflections,
  fog: layout.fog,
  form: false,
});
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();
stage.key.castShadow = layout.shadows;

app.stage.addChild(view3d);

// The three lighting models, each given the same colour, from the most work a pixel to the least. Here Material3D's
// shader makes six texture reads a pixel: its baseColor, metallicRoughness and occlusion maps (an unset map holds
// white and is still read), the environment twice (fill and reflection) and the BRDF lookup table that scales the
// reflection. Phong makes two, its baseColor map and the environment once; Flat one, its baseColor map.
const baseColor = BRAND.logoFace;
// Physically based: a GGX highlight from each light, and diffuse fill plus a reflection from the environment.
const pbr = new Material3D({ baseColor, roughness: ROUGHNESS });
// Blinn-Phong: a highlight from each light that `shininess` sizes and `specularColor` tints; the environment only fills.
const phong = new PhongMaterial({
  baseColor,
  shininess: SHININESS,
  specularColor: PHONG_SPECULAR,
});
// Unlit: baseColor as it is; neither the lights nor the environment reach it.
const flat = new FlatMaterial({ baseColor });
const materials = [pbr, phong, flat];

// A logo shows each material on a real model, and a ball beside it faces every way at once, so the highlight, the
// reflection and the shading all show in one place. A lit material on a mesh that receives shadows reads the shadow
// map nine more times a pixel, and nothing here throws a shadow onto the balls, so they don't receive one.
const sphere = new SphereGeometry({
  radius: BALL_RADIUS,
  widthSegments: 48,
  heightSegments: 24,
});
const columns = materials.map((material, index) => {
  const ball = new Mesh3D({ geometry: sphere, material, receiveShadow: false });

  logos[index].setMaterial(material);

  return createColumn({
    logo: logos[index],
    ball,
    layout,
    index,
    parent: view3d.root,
  });
});

/** Gives all three materials one colour, for the pane's colour row */
function setBaseColor(color) {
  for (const material of materials) material.baseColor = color;
}

// The stage's key light, turned round the scene by the pane. Theme changes write its intensity, never its position.
const keyAim = new Spherical(1, KEY_PHI, 0);

/** Turns the key light `degrees` round from the camera's side; only the way a directional light faces counts */
function aimKey(degrees) {
  keyAim.theta = degrees * DEG_TO_RAD;
  stage.key.position.setFromSpherical(keyAim);
  stage.key.lookAt(ORIGIN);
}

aimKey(KEY_START);

const visuals = createVisuals({ app, view3d, stage, layout, columns });

view3d.camera.fov = layout.fov;
view3d.camera.position.copyFrom(layout.camera);

const orbit = new OrbitCamera({
  view: view3d,
  target: layout.target,
  enableDamping: true,
  ...layout.orbit,
});

// On a screen too narrow for the layout, the camera and the fog back off until the columns fit.
fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: layout.minAspect,
});

const pane = new ThemePane({ title: TITLE, stage });
const shared = { baseColor };
const keyAngle = { degrees: KEY_START };

pane
  .addBinding(shared, 'baseColor', { view: 'color' })
  .on('change', ({ value }) => setBaseColor(value));
// Below 16 the highlight spreads so thin that it fades away, so the slider starts where its size still shows.
pane.addBinding(phong, 'shininess', { min: 16, max: 256, step: 1 });
pane
  .addBinding(keyAngle, 'degrees', {
    label: 'Light angle',
    min: -KEY_RANGE,
    max: KEY_RANGE,
    step: 1,
  })
  .on('change', ({ value }) => aimKey(value));

app.ticker.add((ticker) => {
  stage.update(Math.min(ticker.deltaMS / 1000, 1 / 15));
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
