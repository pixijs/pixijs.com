/**
 * The standard PBR material's three numbers: `baseColor`, `metallic` and `roughness`
 *
 * A `Material3D` is built from an options object and given to a mesh, here every mesh of the logo. `metallic` picks
 * between a non-metal, whose colour scatters out as diffuse light under a faint white reflection, and a metal, which
 * scatters none and tints its reflection with `baseColor`; `roughness` blurs that reflection from a mirror at 0 to a
 * broad sheen at 1. Each is a plain property you can write at any time, with no shader recompile. Under the logo, ten
 * spheres wear the same colour at each step of the two: metal on the top row, non-metal on the bottom, and smooth to
 * rough from left to right.
 *
 * Controls: drag to orbit; the pane sets the logo's `baseColor`, `metallic` and `roughness`, and `baseColor` repaints
 * the spheres too. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, Mesh3D, SphereGeometry, Vector3, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { loadReflections, ThemeStage } from './theme/ThemeStage';
import { fitBesidePane } from './framing';
import {
  SPHERE_METALLIC,
  SPHERE_RADIUS,
  SPHERE_ROUGHNESS,
  spherePosition,
} from './scene';
import { createVisuals } from './visuals';

const TITLE = 'Metal and roughness';
/** High enough over the spheres that the logo's lower edge stays clear of the `metallic` name as it sways */
const LOGO_HEIGHT = 4;
/**
 * The logo's sway, in radians and radians a second, round a pose turned right and leaning in. A flat face mirrors one
 * direction, so the pose aims the faces at the bright half of the reflections, where the smooth metal logo shines like
 * the smooth metal spheres, and the sway slides the reflections across them.
 */
const SWAY = {
  face: 0.22,
  turn: 0.1,
  turnRate: 0.4,
  tilt: 0.05,
  tiltRate: 0.27,
  lean: 0.14,
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

// A metal shows only what it reflects, so the stage lights the scene with the kit's cube map instead of its plain sky.
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

// No shadows: the floating logo's would land far behind it. A light that casts nothing leaves out the shadow pass.
stage.key.castShadow = false;

app.stage.addChild(view3d);

// The lesson's material, opening as polished metal: its colour tints the world it mirrors, as on the top row's
// smoothest spheres. Setting `mesh.material` re-skins a mesh that already exists, here each of the logo's; a new mesh
// takes its material in its options, as the spheres do below.
const material = new Material3D({
  baseColor: BRAND.orange,
  metallic: 1,
  roughness: 0.1,
});

for (const mesh of logo.meshes) mesh.material = material;
logo.root.position.y = LOGO_HEIGHT;
view3d.root.addChild(logo.root);

// A sphere for every step of metallic and roughness, each wearing a Material3D of its own in the logo's colour. They
// share one geometry and one shader, so they draw back to back: one draw on WebGL, one a sphere on WebGPU.
const sphere = new SphereGeometry({
  radius: SPHERE_RADIUS,
  widthSegments: 48,
  heightSegments: 24,
});
const sphereMaterials = [];

for (const metallic of SPHERE_METALLIC) {
  for (const roughness of SPHERE_ROUGHNESS) {
    const sphereMaterial = new Material3D({
      baseColor: material.baseColor,
      metallic,
      roughness,
    });

    sphereMaterials.push(sphereMaterial);
    new Mesh3D({
      geometry: sphere,
      material: sphereMaterial,
      position: spherePosition(roughness, metallic, new Vector3()),
      parent: view3d.root,
    });
  }
}

/** Repaints the spheres in a new base colour, for the pane's colour row */
function paintSpheres(color) {
  for (const sphereMaterial of sphereMaterials)
    sphereMaterial.baseColor = color;
}

const visuals = createVisuals({ app, view3d, stage });

view3d.camera.fov = 40;
// 9.6 from the target and about 9° over it, inside the orbit's limits, so the first frame is taken from here.
view3d.camera.position.set(0, 3.79, 9.47);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 2.25, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 14,
  // Stays above the floor and near face-on to the spheres, yet turns far enough to watch the reflections slide.
  minPolarAngle: Math.PI * 0.37,
  maxPolarAngle: Math.PI * 0.45,
  minAzimuthAngle: -0.45,
  maxAzimuthAngle: 0.45,
});

const pane = new ThemePane({ title: TITLE, stage });

pane
  .addBinding(material, 'baseColor', { view: 'color' })
  .on('change', ({ value }) => paintSpheres(value));
pane.addBinding(material, 'metallic', { min: 0, max: 1, step: 0.01 });
pane.addBinding(material, 'roughness', { min: 0, max: 1, step: 0.01 });

// On a small or narrow window the camera and the fog back off until the spheres fit and the logo clears the pane.
fitBesidePane({ renderer: app.renderer, orbit, stage, pane });

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  logo.root.rotation.y = SWAY.face + Math.sin(time * SWAY.turnRate) * SWAY.turn;
  logo.root.rotation.x = SWAY.lean + Math.sin(time * SWAY.tiltRate) * SWAY.tilt;
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
