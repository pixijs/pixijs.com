/**
 * A clear lacquer over a material's base, with a roughness of its own, like car paint
 *
 * Passing the `clearcoat` group to `Material3D` lays a colourless layer over the surface, with its own highlight and
 * its own reflections. `clearcoat.factor` sets how much coat there is and `clearcoat.roughness` how sharp its shine
 * is, apart from the base's `roughness` underneath, so a satin base can wear a mirror coat. A coat reflects about 4%
 * of the light head-on and far more at a grazing angle, so it shows most on the logo's sides, which the sway turns
 * into view edge-on, and hardly at all on the faces that look straight at the camera. The two spheres in front wear
 * the same base side by side, one with the coat and one built without it.
 *
 * Controls: drag to orbit; the pane sets the base's `roughness` and, in its `clearcoat` folder, the coat's `factor`
 * and `roughness`. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, Mesh3D, SphereGeometry, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { loadReflections, ThemeStage } from './theme/ThemeStage';
import { createVisuals } from './visuals';

const TITLE = 'Clearcoat';
/** The narrowest view, width over height, that shows the swaying logo whole */
const FIT_ASPECT = 0.86;
/** The logo's height over the floor, with the twin spheres in front of it, under its lower edge */
const LOGO_HEIGHT = 1.6;
/**
 * The logo's lean back and its sway, in radians, and the sway's speed in radians a second. Leaned back under lights
 * in front, its faces catch the key. The sway, like a car on a showroom turntable, turns its sides to a grazing angle,
 * where the coat shows most, and it starts at the end of a swing, so the first frame shows them
 */
const LEAN = 0.3;
const SWAY = 0.3;
const SWAY_SPEED = 0.52;
/** Where the stage's lights shine from: in front of the logo and above it, so its leaned faces catch them */
const LIGHT_POSITION = { x: -1.5, y: 6.3, z: 8.9 };
/** The twin spheres, resting on the floor in front of the logo's shadow */
const SPHERE_RADIUS = 0.42;
const COATED_AT = { x: -1, y: SPHERE_RADIUS, z: 1.9 };
const BARE_AT = { x: 1, y: SPHERE_RADIUS, z: 1.9 };

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

// A coat shows only what it reflects, so the stage lights the scene with the kit's cube map instead of its plain sky.
// The logo keeps its model's material, since the lesson replaces it at once.
const [reflections, logo] = await loading.load(() =>
  Promise.all([loadReflections(), loadPixiLogo({ material: 'source' })]),
);
// At the screen's size from the start, so the first frame's labels are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme, reflections });
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();

// The coat draws a highlight for every light, so the form light the dark theme turns on shines from the key's place,
// and the coat shows one set of glints. A directional light shines along its own −z: each is aimed after its move.
for (const light of [stage.key, stage.form]) {
  light.position.copyFrom(LIGHT_POSITION);
  light.lookAt({ x: 0, y: 0, z: 0 });
}
app.stage.addChild(view3d);

// Car paint: a satin base of metal flakes in a purple binder, under a mirror-smooth clear coat. Passing the
// `clearcoat` group builds the coat into the shader; a factor of 0 hides it but keeps its cost.
const paint = new Material3D({
  baseColor: BRAND.purple,
  metallic: 0.6,
  roughness: 0.5,
  clearcoat: { factor: 1, roughness: 0.05 },
});
// Built with the group, so the coat's runtime object is there; writing its values never rebuilds the shader.
const coat = paint.clearcoat;

// The kit's `setMaterial` sets `mesh.material` on each of the logo's meshes, which re-skins a mesh that already
// exists; a new mesh takes its material in its options, as the spheres do below.
logo.setMaterial(paint);
logo.root.position.y = LOGO_HEIGHT;
// Leaned back, and turned to where the sway starts.
logo.root.rotation.set(-LEAN, -SWAY, 0);
view3d.root.addChild(logo.root);

// Two spheres, since a sphere faces every way at once: the coated one always shows the key's pin and a sharp
// reflection that the bare one blurs. The left one wears the paint; the right one the same base built without the
// group, so it has no coat in its shader and `bare.clearcoat` is undefined.
const bare = new Material3D({
  baseColor: paint.baseColor,
  metallic: paint.metallic,
  roughness: paint.roughness,
});
const sphere = new SphereGeometry({
  radius: SPHERE_RADIUS,
  widthSegments: 48,
  heightSegments: 24,
});
const coatedSphere = new Mesh3D({
  geometry: sphere,
  material: paint,
  position: COATED_AT,
  parent: view3d.root,
});
const bareSphere = new Mesh3D({
  geometry: sphere,
  material: bare,
  position: BARE_AT,
  parent: view3d.root,
});

const visuals = createVisuals({ app, view3d, stage, coatedSphere, bareSphere });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.3, 8);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.2, z: 0 },
  enableDamping: true,
  enablePan: false,
  // Near enough to read the coat and far enough to keep both spheres in view, and turned no further either way than
  // the flat logo still reads from the front.
  minDistance: 7.5,
  maxDistance: 14,
  maxPolarAngle: Math.PI * 0.45,
  minAzimuthAngle: -0.8,
  maxAzimuthAngle: 0.8,
});

// A portrait screen is narrower than the logo, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

// The rows mirror the options object: the base's `roughness`, then a `clearcoat` folder with the coat's own two.
// They're plain properties, so dragging one never rebuilds the shader.
const pane = new ThemePane({ title: TITLE, stage });

pane
  .addBinding(paint, 'roughness', { min: 0, max: 1, step: 0.01 })
  .on('change', ({ value }) => {
    // The bare twin follows the base, so the coat stays the only difference between the spheres.
    bare.roughness = value;
  });

const coatRows = pane.addFolder({ title: 'clearcoat' });

coatRows.addBinding(coat, 'factor', { min: 0, max: 1, step: 0.01 });
coatRows.addBinding(coat, 'roughness', { min: 0, max: 1, step: 0.01 });

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  logo.root.rotation.y = -Math.cos(time * SWAY_SPEED) * SWAY;
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
