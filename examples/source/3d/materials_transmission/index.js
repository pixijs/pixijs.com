/**
 * Glass and coloured liquids with `Material3D`'s `transmission` group
 *
 * Passing `transmission` makes a surface see-through: the mesh draws after the opaque scene and shows it, bent by the
 * material's `ior` where light enters, and `factor` sets how much light gets through. `thickness`,
 * `attenuationColor` and `attenuationDistance` describe the volume inside: `thickness` is how deep you say the mesh is,
 * and light turns `attenuationColor` after crossing `attenuationDistance`, so the more `thickness` light crosses, the
 * deeper the colour.
 *
 * Controls: drag to orbit; the pane sets the glass's transmission factor and ior and the liquid's thickness and
 * attenuation.
 * URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { CLAY, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { BOTTLE_WIDTH, createBars, createBottle } from './scene';
import { createVisuals } from './visuals';

const TITLE = 'Glass and liquids';
/** The narrowest view, width over height, that shows the bars and both subjects whole */
const FIT_ASPECT = 1.15;
/** Wide enough that each letter crosses a bar or two, so every one shows the bend */
const LOGO_WIDTH = 3.6;
/** Left of the bottle, and high enough that the bars run straight above and below it */
const LOGO_AT = { x: -1.15, y: 1.75, z: 0 };
/**
 * About three times the logo's real depth, so the bend reads at a glance. For true glass, give the depth through the
 * mesh, in its own units, as the bottle does.
 */
const GLASS_THICKNESS = 1.6;
/** A pink apart from the bars' white and sky, so the tint reads over both */
const LIQUID_COLOR = CLAY.palePink;
/** The bottle's own width: light that crosses it comes out about `attenuationColor` */
const LIQUID_DISTANCE = BOTTLE_WIDTH;
/** The logo's sway in radians and seconds, starting turned away, where the bend is near its largest */
const SWAY = { angle: 0.5, period: 12, phase: 4.26 };
/** Where the camera looks: a little right of midway between the logo and the bottle, so the bars end clear of the pane */
const FOCUS = { x: 0.9, y: 1.3, z: 0 };

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
  // Glass shows a copy of the opaque picture, and WebGL can only copy it from a back buffer: without one the copy
  // fails and the glass renders black. WebGPU copies the canvas as it is.
  webgl: { useBackBuffer: true },
});
loading.progress(0.2);

// The logo keeps its model's material, since the lesson replaces it at once.
const logo = await loading.load(() =>
  loadPixiLogo({ width: LOGO_WIDTH, material: 'source' }),
);
// At the screen's size from the start, so the first frame's labels are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });

app.stage.addChild(view3d);

// Clear glass. Roughness defaults to 1, which blurs everything seen through it; near 0 keeps it sharp.
const glass = new Material3D({
  roughness: 0.05,
  // Glass's ior. It also sets how strongly the surface reflects: at 1 nothing bends, and head-on reflection is 0.
  ior: 1.5,
  transmission: { factor: 1, thickness: GLASS_THICKNESS },
});

// The logo's meshes keep `castShadow`, but glass casts no shadow: the engine leaves it out of the shadow pass.
logo.setMaterial(glass);
logo.root.position.copyFrom(LOGO_AT);
view3d.root.addChild(logo.root);

// A pink liquid, the same group with attenuation. The engine doesn't measure the mesh: `thickness` is the depth you
// tell it, in the mesh's own units, so it's the square bottle's width, which is also its depth.
// `attenuationDistance` is in world units, so the bottle keeps scale 1 and the two numbers mean the same length.
const liquid = new Material3D({
  // Like water: a still, smooth surface, and water's ior.
  roughness: 0.02,
  ior: 1.33,
  transmission: {
    thickness: BOTTLE_WIDTH,
    attenuationColor: LIQUID_COLOR,
    attenuationDistance: LIQUID_DISTANCE,
  },
});
const bottle = createBottle({ material: liquid, parent: view3d.root });

// Glass shows only the opaque meshes drawn before it, never other glass. So the bars stand behind for both to bend,
// the logo and the bottle stay apart on screen, and the bottle has no glass wall, which would hide the liquid.
createBars({ parent: view3d.root });

const visuals = createVisuals({ app, view3d, stage, logo, bottle });

view3d.camera.fov = 40;
// Lower than the kit's usual camera, so the bars, not the floor, fill the glass's background.
view3d.camera.position.set(FOCUS.x, 2.45, 10.4);

const orbit = new OrbitCamera({
  view: view3d,
  target: FOCUS,
  enableDamping: true,
  enablePan: false,
  minDistance: 7,
  maxDistance: 14,
  // Near level, and turned no further than this: past it the logo and the bottle overlap on screen, where each would
  // show the floor instead of the other.
  minPolarAngle: Math.PI * 0.36,
  maxPolarAngle: Math.PI * 0.48,
  minAzimuthAngle: -0.5,
  maxAzimuthAngle: 0.5,
});

// A portrait screen is narrower than the bars, so the camera and the fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

// Built with the group, so it's there. Every value is a plain property: a change shows the next frame, with no
// shader rebuild.
const glassTransmission = glass.transmission;
const liquidTransmission = liquid.transmission;
const pane = new ThemePane({ title: TITLE, stage });

// The glass's surface: how much light gets through, and how far it bends. Its thickness stays fixed, so it has no row.
const glassFolder = pane.addFolder({ title: 'glass' });

glassFolder.addBinding(glassTransmission, 'factor', {
  label: 'transmission\nfactor',
  min: 0,
  max: 1,
  step: 0.01,
});
// From no bend at all, through water (1.33) and glass (1.5), to diamond (2.42).
glassFolder.addBinding(glass, 'ior', { min: 1, max: 2.42, step: 0.01 });

// The liquid's volume: how far light crosses it, and the colour it turns over what distance. At thickness 0 it's a
// thin wall with no tint; at twice `attenuationDistance` the colour is applied twice over.
const liquidFolder = pane.addFolder({ title: 'liquid' });

liquidFolder.addBinding(liquidTransmission, 'thickness', {
  min: 0,
  max: 2.4,
  step: 0.01,
});
// Long names break onto two lines, since the pane's label column cuts them off on one.
liquidFolder.addBinding(liquidTransmission, 'attenuationColor', {
  label: 'attenuation\nColor',
  view: 'color',
});
liquidFolder.addBinding(liquidTransmission, 'attenuationDistance', {
  label: 'attenuation\nDistance',
  min: 0.2,
  max: 2.4,
  step: 0.01,
});

let time = 0;

/** Turns the logo to and fro, so the angle the camera's rays meet the glass at, and so the bend, keeps changing */
function sway() {
  logo.root.rotation.y =
    SWAY.angle * Math.sin((time / SWAY.period) * Math.PI * 2 + SWAY.phase);
}

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  sway();
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
sway();
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
