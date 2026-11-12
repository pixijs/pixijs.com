/**
 * Adding your own shader code to a built-in material with `extraBits`
 *
 * A `ShaderBit` is a plain object whose code goes into named slots of a material's shader, so the logo keeps its lit,
 * lacquered `Material3D` while two bits of your own act on it: the wobble's code runs once for every vertex and moves
 * it, and the dissolve's runs once for every pixel and throws it away or, near the cut, lights it. A bit's
 * `bindings.material` fields join `material.data`, and a bit carries its code twice, WGSL for WebGPU and GLSL for
 * WebGL.
 *
 * Controls: drag to orbit; the pane sets the dissolve, its edge colour and the wobble. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, srgbToLinear, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Color } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { dissolveBit } from './dissolveBit';

import { wobbleBit } from './wobbleBit';

const TITLE = 'Extra bits';
/** About a third of the logo gone, so it opens on holes with their rims and still reads as the logo */
const START_DISSOLVE = 0.35;
/** The wobble's widest offset, in world units: a gentle sway */
const START_WOBBLE = 0.1;
/** The pane's most wobble: a strong lean in which the ixi's stems tilt as straight lines while the P's edge bends */
const MAX_WOBBLE = 0.3;
/** The narrowest view, width over height, that shows the logo whole through its widest wobble */
const FIT_ASPECT = 1;

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

const view3d = new View3D({ autoResize: true });
const stage = new ThemeStage(view3d, { theme });

// Nothing here casts (the logo can't, see below), so the key needn't render a shadow map and the floor's shader
// leaves shadow sampling out.
stage.key.castShadow = false;
app.stage.addChild(view3d);

// The enamel's own settings, so the logo looks as it does in every other example until the bits act on it. The bits
// are fixed for the material's life; their code joins the shader after the built-in features.
const material = new Material3D({
  baseColor: BRAND.logoFace,
  roughness: 0.32,
  specular: { factor: 0.2 },
  clearcoat: { factor: 0.2, roughness: 0.06 },
  fog: false,
  extraBits: [wobbleBit, dissolveBit],
});
// `Material3DData` lists the material's own fields; the bits add theirs to the same struct, hence the cast.
const data = material.data;
// The pane's edge colour, as it shows on screen.
const edge = { color: BRAND.sky };
const edgeLinear = new Float32Array(3);

/** Material data holds linear light, so the colour is decoded on its way in */
function setEdgeColor(color) {
  Color.shared.setValue(color).toRgbArray(edgeLinear);
  for (let i = 0; i < 3; i++) edgeLinear[i] = srgbToLinear(edgeLinear[i]);
  // Assigned whole: writing one channel of the array in place wouldn't queue an upload.
  data.dissolveEdgeColor = edgeLinear;
}

setEdgeColor(edge.color);
data.dissolve = START_DISSOLVE;
data.wobble = START_WOBBLE;

// The model's own material, since this one replaces it at once. The shadow pass draws casters with a shader of its
// own, which a material's extra bits never reach, so the logo casts nothing rather than a whole, still shadow.
const logo = await loading.load(() =>
  loadPixiLogo({ material: 'source', castShadow: false }),
);

logo.setMaterial(material);
logo.root.position.y = 1.7;
view3d.root.addChild(logo.root);

view3d.camera.fov = 40;
// High enough that the floor's checks, not the horizon's haze, stand behind the holes.
view3d.camera.position.set(0, 4.1, 6.8);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.6, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 5,
  maxDistance: 14,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the logo and its sway, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

// `dissolve` and `wobble` bind `material.data` itself: the slider writes the field the shader reads.
const pane = new ThemePane({ title: TITLE, stage });

pane.addBinding(data, 'dissolve', { min: 0, max: 1, step: 0.01 });
pane
  .addBinding(edge, 'color', { label: 'Edge colour', view: 'color' })
  .on('change', ({ value }) => setEdgeColor(value));
pane.addBinding(data, 'wobble', { min: 0, max: MAX_WOBBLE, step: 0.01 });

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  time += dt;
  // The wave's clock, which the wobble's shader code reads: the sway climbs the logo while `wobble` sets its size.
  data.wobbleTime = time;
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
