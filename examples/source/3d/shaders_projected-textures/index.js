/**
 * Project one cloud texture across several meshes by sampling it in world space
 *
 * An `extraBits` shader reads `vPosition.xz`, so one cloud crosses the board, the sphere, the cube and the torus
 * without restarting at any edge, and a mesh moved through it picks up whatever part of the cloud sits there. Space
 * switches it to `vUV`, where each mesh carries its own copy of the pattern wherever it goes. This changes surface
 * colour, not illumination: it doesn't test occlusion and isn't a shadow map.
 *
 * Controls: drag to orbit; Space switches world xz and mesh UV, Sphere x slides the sphere through the cloud, and
 * World scale, Cloud speed and Strength tune the pattern. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, Mesh3D, PlaneGeometry, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { CLAY, THEMES, themeFromUrl } from './theme/palette';
import { clayGeometry } from './theme/shapes';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { cloudBit } from './cloudBit';

import { createCloudMask } from './pattern';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the board whole from the landscape distance */
const FIT_ASPECT = 0.95;
/** Where the cloud starts, in texture widths: a blob's edge splits the sphere, so the cloud reads as running onto it */
const START_OFFSET = 0.7;

const theme = themeFromUrl();
const loading = new LoadingScreen({ theme, label: 'Projected textures' });
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
loading.progress(0.3);

const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme, fog: { near: 18, far: 45 } });

app.stage.addChild(view3d);
const cloud = createCloudMask();
const settings = {
  space: 'World xz',
  scale: 0.24,
  speed: 0.055,
  strength: 0.75,
};
// The drift, advanced each frame at Cloud speed. It isn't a pane row.
let cloudOffset = START_OFFSET;
// Each material carries the same texture and projection uniforms. Different colours still share one world pattern.
// The board is lilac rather than white, so it stands off the light theme's white floor even at Strength 0.
const materials = [CLAY.lilac, CLAY.palePink, CLAY.paleSky, CLAY.white].map(
  (baseColor) =>
    new Material3D({
      baseColor,
      roughness: 0.75,
      extraBits: [cloudBit],
    }),
);
// The bit's slot is filled once the material exists; the `textures` option would fill it at construction.
for (const material of materials) material.textures.cloud = cloud;
const data = materials.map((material) => material.data);
// The board, flat under the shapes, shows the cloud whole.
new Mesh3D({
  geometry: new PlaneGeometry({ width: 6.4, height: 4.2 }),
  material: materials[0],
  rotation: { x: -Math.PI / 2, y: 0, z: 0 },
  position: { x: 0, y: 0.03, z: 0 },
  parent: view3d.root,
});
const sphere = new Mesh3D({
  geometry: clayGeometry('sphere'),
  material: materials[1],
  scale: 1.5,
  position: { x: -1.6, y: 0.78, z: 0.35 },
  parent: view3d.root,
});
new Mesh3D({
  geometry: clayGeometry('cube'),
  material: materials[2],
  scale: 1.55,
  position: { x: 1.5, y: 0.8, z: -0.45 },
  rotation: { x: 0, y: 0.45, z: 0 },
  parent: view3d.root,
});
new Mesh3D({
  geometry: clayGeometry('torus'),
  material: materials[3],
  scale: 1.3,
  position: { x: 0, y: 0.65, z: -1 },
  parent: view3d.root,
});

function updateProjection() {
  for (const fields of data) {
    fields.cloudScale = settings.scale;
    fields.cloudOffset = cloudOffset;
    fields.cloudStrength = settings.strength;
    fields.worldProjection = settings.space === 'World xz' ? 1 : 0;
  }
}

view3d.camera.fov = 40;
view3d.camera.position.set(0, 7, 10);
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.7, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 8,
  maxDistance: 20,
  maxPolarAngle: Math.PI * 0.43,
});

// A portrait screen is narrower than the board, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });
const pane = new ThemePane({ title: 'Projected textures', stage });

const spaceRow = pane.addBinding(settings, 'space', {
  label: 'Space',
  options: { 'World xz': 'World xz', 'Mesh UV': 'Mesh UV' },
});
const scaleRow = pane.addBinding(settings, 'scale', {
  label: 'World scale',
  min: 0.12,
  max: 0.6,
});

// Mesh UV samples each mesh's own UVs, which World scale never enters, so the row greys out there.
spaceRow.on(
  'change',
  () => (scaleRow.disabled = settings.space !== 'World xz'),
);
pane.addBinding(settings, 'speed', { label: 'Cloud speed', min: 0, max: 0.2 });
pane.addBinding(settings, 'strength', { label: 'Strength', min: 0, max: 0.95 });
// From the opening view the sphere stays clear of the torus across this span.
pane.addBinding(sphere.position, 'x', {
  label: 'Sphere x',
  min: -2.4,
  max: -1.3,
});
const visuals = createVisuals({ app, view3d, stage, settings });

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  cloudOffset += dt * settings.speed;
  updateProjection();
  stage.update(dt);
  visuals.update();
});
updateProjection();
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
