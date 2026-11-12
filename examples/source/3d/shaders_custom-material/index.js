/**
 * A material class of your own: a shader bit that declares a texture and three uniforms, and a class on
 * `BaseMaterial3D` that fills them
 *
 * `RampMaterial` extends `BaseMaterial3D` with one `ShaderBit`, `rampBit`, which every pixel runs with its own
 * `normal`: it picks a colour from the ramp texture by how directly the surface faces the camera, in flat bands, with
 * an edge colour where it turns away. After that, `material.data` changes the uniforms and `material.textures` swaps
 * the texture, and neither rebuilds the shader.
 *
 * Controls: drag to orbit, and the bands follow the camera; the pane swaps the ramp texture and sets the three
 * uniforms. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Mesh3D, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { clayGeometry } from './theme/shapes';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { RampMaterial } from './RampMaterial';
import { createRamps, RAMP_NAMES } from './scene';

const TITLE = 'Your own material';
/** Leans the torus toward the camera, so the hole and the front of the tube both show */
const TILT = 0.35;
/** How far the torus rocks either side of its lean, in radians, and how fast */
const ROCK = { angle: 0.08, rate: 0.6 };
/** The narrowest view, width over height, that shows the torus whole from the landscape distance */
const FIT_ASPECT = 0.8;

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

app.stage.addChild(view3d);

// Strips of colour the shader picks from: edge-on at the left end, facing the camera at the right.
const ramps = createRamps();
const material = new RampMaterial({
  ramp: ramps.candy,
  bands: 5,
  edgeWidth: 0.25,
  edgeColor: BRAND.purple,
});

const torus = new Mesh3D({
  geometry: clayGeometry('torus'),
  material,
  position: { x: 0, y: 1.45, z: 0 },
  scale: 3.3,
  rotation: { x: TILT, y: 0, z: 0 },
  parent: view3d.root,
});

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.8, 7.4);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.2, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the torus, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: TITLE, stage });
// The pane lists names, not textures, so the row picks a ramp by name and its handler swaps the texture into the slot
// `rampBit` declares. The compiled shader stays as it is.
const picked = { ramp: 'candy' };

pane
  .addBinding(picked, 'ramp', {
    options: Object.fromEntries(RAMP_NAMES.map((name) => [name, name])),
  })
  .on('change', ({ value }) => {
    material.textures.ramp = ramps[value];
  });
// Each write to a `data` field queues one upload for the frame. The shader divides by `bands`, so it never goes under 1.
pane.addBinding(material.data, 'bands', { min: 1, max: 8, step: 1 });
pane.addBinding(material.data, 'edgeWidth', { min: 0, max: 0.5 });
// A `vec3`, so it goes through the class's setter, which takes any colour and writes its three floats into the data.
pane.addBinding(material, 'edgeColor', { view: 'color' });

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  // As it tips, the bands slide over the clay: each pixel works its colour out again from how it faces the camera.
  torus.rotation.x = TILT + Math.sin(time * ROCK.rate) * ROCK.angle;
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
