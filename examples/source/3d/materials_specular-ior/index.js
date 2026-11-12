/**
 * How strongly a non-metal reflects: `ior`, and the `specular` group's `factor` and `color`
 *
 * Plastic, glass or water mirrors a few percent of the light that meets it head-on and nearly all of it edge-on.
 * `ior` sets the head-on share, `((ior - 1) / (ior + 1))²`: 2% for water, 4% for glass, 17% for diamond, and leaves
 * the edges alone. The `specular` group, which only the constructor can turn on, works on top: `factor` scales the
 * whole reflection, edges included, down to none at 0, and `color` tints the head-on reflection while the edges stay
 * white. All three are plain properties, so writing one never rebuilds the shader, and none of them changes a metal.
 * The logo's flat faces meet the view head-on and the walls inside its `JS` letters edge-on. Under it, five spheres
 * wear the same plastic at the `ior` tagged under each; a sphere's centre is seen head-on and its rim edge-on.
 *
 * Controls: drag to orbit; the pane sets the logo's `ior` and, in its `specular` folder, the group's `factor` and
 * `color`, which the row follows. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { loadReflections, ThemeStage } from './theme/ThemeStage';
import { createSampleRow, liftNightSky, swayLogo } from './scene';
import { createVisuals } from './visuals';

const TITLE = 'Specular and IOR';
/** The narrowest view, width over height, that shows the row and its tags whole */
const FIT_ASPECT = 1;
/**
 * High enough over the row that the logo's lower edge stays clear of the spheres as it sways, and low enough that on a
 * 4:3 screen the `JS` badge stays clear of the pane from every turn
 */
const LOGO_HEIGHT = 3;

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

// A glossy surface shows what it mirrors, so the stage lights the scene with the kit's cube map instead of its plain
// sky. The logo keeps its model's material, since the lesson replaces it at once.
const [reflections, logo] = await loading.load(() =>
  Promise.all([loadReflections(), loadPixiLogo({ material: 'source' })]),
);
// At the screen's size from the start, so the first frame's labels are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// No form light: on the dark theme it would put a second highlight on every sphere, which reads as a stronger
// reflection.
const stage = new ThemeStage(view3d, { theme, reflections, form: false });
// The kit's night is as black as the plastic, so a lighter haze keeps the logo's outline when it reflects nothing.
const nightSky = liftNightSky(stage);

// No shadows: the floating row's would fall beside its tags and explain nothing.
stage.key.castShadow = false;
app.stage.addChild(view3d);

// The lesson's material. Near-black, so its diffuse light is all but gone and the reflection is what shows; polished
// enough to show the reflected sunset as a picture.
const material = new Material3D({
  baseColor: BRAND.night,
  metallic: 0,
  roughness: 0.1,
  // The default, as glass and most plastics have, so the logo opens matching the middle sphere.
  ior: 1.5,
  // The group turns on here or never. `{}` takes its defaults, factor 1 and white; `{ factor: 0.5, color: 0xfff4e0 }`
  // would start it at half strength with a warm tint.
  specular: {},
});
// Built with the group, so `material.specular` is there; built without it, the material would have none to change.
const specular = material.specular;

logo.setMaterial(material);
logo.root.position.y = LOGO_HEIGHT;
view3d.root.addChild(logo.root);

// The row of spheres: the logo's plastic at five `ior` values, each set by its constructor's `ior` option.
const row = createSampleRow({ material, specular, parent: view3d.root });
const visuals = createVisuals({ app, view3d, stage });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.75, 9);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 2.1, z: 0 },
  enableDamping: true,
  enablePan: false,
  // Any nearer and a 4:3 screen puts the `JS` badge under the pane, so the camera keeps its distance.
  enableZoom: false,
  // Never so low it skims the floor, nor so high the logo drops onto the spheres; turns far enough to watch the
  // reflections slide but never sees the row edge-on.
  minPolarAngle: Math.PI * 0.3,
  maxPolarAngle: Math.PI * 0.45,
  minAzimuthAngle: -0.45,
  maxAzimuthAngle: 0.45,
});

// A portrait screen is narrower than the row and its tags, so the camera and the fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

// The rows bind straight to the material, the way the options nest: `ior` is a plain field, the others are the group's.
// Each write is a small uniform upload, never a shader build.
const pane = new ThemePane({ title: TITLE, stage });

pane.addBinding(material, 'ior', { min: 1, max: 2.5, step: 0.01 });

const specularRows = pane.addFolder({ title: 'specular' });

// The row follows the logo's group, so the spheres keep differing from it by `ior` alone.
specularRows
  .addBinding(specular, 'factor', { min: 0, max: 1, step: 0.01 })
  .on('change', row.followLogo);
specularRows
  .addBinding(specular, 'color', { view: 'color' })
  .on('change', row.followLogo);

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  nightSky.update();
  swayLogo(logo.root, time);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
nightSky.update();
swayLogo(logo.root, time);
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
