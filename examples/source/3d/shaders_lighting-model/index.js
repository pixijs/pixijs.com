/**
 * A lighting model of your own: `createLightingBit` turns a few lines of shading maths into the bit that decides how
 * a material responds to light
 *
 * The factory writes the loop over the scene's lights, and you write three snippets round it: `preLighting` once
 * before the loop, `perLight` once for each light that reaches the pixel, and `postLighting` once after it. A material
 * takes the bit after a surface bit in its `descriptor`, so swapping that one bit changes how the same surface takes
 * the same light: here Lambert, and a soft-edged model with a shade colour of its own. The third sphere wears
 * `ToonMaterial` from `@pixi/3d/extras`, whose `toonLightingBit` is the engine's own model built the same way.
 *
 * Controls: drag to orbit; the pane sets the soft model's `softness` and `shadeColor`, and moves the probe round the
 * hero, showing `nDotL` where it sits. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import {
  BaseMaterial3D,
  DirectionalLight,
  linearToSrgb,
  Mesh3D,
  SphereGeometry,
  srgbToLinear,
  View3D,
} from '@pixi/3d';
import { OrbitCamera, ToonMaterial } from '@pixi/3d/extras';
import { Application, Color } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, CLAY, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import {
  lambertLightingBit,
  softShadeLightingBit,
  surfaceBit,
} from './lighting';

import { createVisuals } from './visuals';

const TITLE = 'Custom lighting model';
/** The narrowest view, width over height, that shows the three spheres, their tags and shadows whole */
const FIT_ASPECT = 1.3;
/** A mid tint, so both the light and the shade colour show on it */
const SPHERE_COLOR = CLAY.palePink;
/** Upper right and a little in front: the edge of the light crosses each sphere's face, and shadows fall left */
const LIGHT_POSITION = { x: 8, y: 8.4, z: 2.8 };
/** The stage key's light-theme strength; `lighting.ts`'s models divide by π as the PBR floor does, so all match */
const LIGHT_INTENSITY = 2.2;
/** Every sphere's radius in its own space; the Lambert and toon spheres are scaled down from it */
const SPHERE_RADIUS = 1;
/** The fade starts where `nDotL` drops under 0.6, 53° from head-on, so the soft band shows plainly at rest */
const SOFTNESS = 0.6;
/** A cool shade, apart from the pink lit side, so the edge of the light still reads */
const SHADE_COLOR = BRAND.purple;

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

// At the screen's size from the start, so the first frame's labels are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// A lighting model is a function of the lights that reach it, so the lesson brings one known light of its own, the
// same on both themes. The stage keeps its floor, fog and backdrop.
const stage = new ThemeStage(view3d, { theme, lights: false });

app.stage.addChild(view3d);

// The stage key's warm white, which lights the floor in every other example.
const sun = new DirectionalLight({
  color: stage.key.color,
  intensity: LIGHT_INTENSITY,
  castShadow: true,
  position: LIGHT_POSITION,
  parent: view3d.root,
});

sun.lookAt({ x: 0, y: 0, z: 0 });

// One surface bit under two lighting bits: the surface is the same, only its response to light differs.
const lambert = new BaseMaterial3D({
  baseColor: SPHERE_COLOR,
  descriptor: {
    bitsGpu: [surfaceBit, lambertLightingBit],
    bitsGl: [surfaceBit, lambertLightingBit],
  },
});
const softShade = new BaseMaterial3D({
  baseColor: SPHERE_COLOR,
  descriptor: {
    bitsGpu: [surfaceBit, softShadeLightingBit],
    bitsGl: [surfaceBit, softShadeLightingBit],
  },
});

// The engine's own model: `ToonMaterial` is a surface bit and `toonLightingBit`, which rounds `nDotL` to one of `bands`
// steps. That bit adds each light at full strength where the two above divide by π, so under the same sun this pink
// would clip to white; taking the π off it in linear light lights the bands as brightly as the other spheres. Its rim,
// which lights the outline whatever the light does, is off, and its highlight is at its smallest, so the bands show.
const toon = new ToonMaterial({
  baseColor: new Color(SPHERE_COLOR)
    .toRgbArray()
    .map((channel) => linearToSrgb(srgbToLinear(channel) / Math.PI)),
  specularSize: 0,
  rimIntensity: 0,
});

/**
 * The shader works in linear light. The `baseColor` setter decodes a colour for you; a field of your own doesn't, so
 * decode the pane's colour before it goes in. Assigning the field copies the three numbers and queues the upload.
 */
function setShadeColor(color) {
  const { red, green, blue } = Color.shared.setValue(color);

  softShade.data.shadeColor = [
    srgbToLinear(red),
    srgbToLinear(green),
    srgbToLinear(blue),
  ];
}

// The lighting bit declared these fields in its `bindings`, so the material's `data` has them. A write uploads on the
// next render, with no recompile.
softShade.data.softness = SOFTNESS;
setShadeColor(SHADE_COLOR);

// A sphere faces every way at once, so it shows the whole response to light, from head-on to edge-on and past it.
const sphere = new SphereGeometry({
  radius: SPHERE_RADIUS,
  widthSegments: 64,
  heightSegments: 32,
});
const hero = new Mesh3D({
  geometry: sphere,
  material: softShade,
  position: { x: -1.4, y: 1.3, z: 0.3 },
  parent: view3d.root,
});
const lambertSphere = new Mesh3D({
  geometry: sphere,
  material: lambert,
  position: { x: 0.8, y: 1.05, z: -1 },
  scale: 0.72,
  parent: view3d.root,
});
const toonSphere = new Mesh3D({
  geometry: sphere,
  material: toon,
  position: { x: 2.7, y: 1.05, z: -1 },
  scale: 0.72,
  parent: view3d.root,
});

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3, 9);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.25, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 14,
  // Far enough round and over to watch the shading turn. Any further round towards -x, and the Lambert sphere would
  // slip behind the hero. The probe is placed once, from the starting camera, and at 0.4 towards +x it already sits
  // on the hero's outline; any further, and it would turn out of sight.
  minPolarAngle: Math.PI * 0.36,
  maxPolarAngle: Math.PI * 0.45,
  minAzimuthAngle: -0.1,
  maxAzimuthAngle: 0.4,
});

// A portrait screen is narrower than the three spheres, so the camera and the fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const visuals = createVisuals({
  app,
  view3d,
  stage,
  hero,
  lambertSphere,
  toonSphere,
  radius: SPHERE_RADIUS,
  sun,
});

const pane = new ThemePane({ title: TITLE, stage });
const shade = { shadeColor: SHADE_COLOR };

// A `data` field is a plain property to the pane: a drag writes `softShade.data.softness`, which queues the upload.
// It stops short of 0, since smoothstep needs its two edges apart.
pane.addBinding(softShade.data, 'softness', { min: 0.02, max: 1, step: 0.01 });
pane
  .addBinding(shade, 'shadeColor', { view: 'color' })
  .on('change', ({ value }) => setShadeColor(value));
// The probe is the visuals' own. From 40° to the edge at 90°, `nDotL` falls through `softness`, where the fade starts.
pane.addBinding(visuals.probe, 'degrees', {
  label: 'probe angle',
  min: 40,
  max: 90,
  step: 1,
});
pane.addBinding(visuals.probe, 'nDotL', {
  readonly: true,
  format: (value) => value.toFixed(2),
});

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
