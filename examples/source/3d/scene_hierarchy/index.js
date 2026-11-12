/**
 * A child moves, turns and scales with its parent, and `visible` hides a whole branch
 *
 * `addChild` hangs a node in its parent's space: the planet sits 2.5 along its orbit's x, and the moon 0.75 along the
 * planet's. Turning the orbit, an empty `Container3D` at the sun's centre, carries the planet round the sun while the
 * planet's own numbers never change. `visible = false` hides a node and everything under it, and they keep moving.
 *
 * Controls: drag to orbit; the pane slides the sun, sets the orbit's and the planet's spin, hides the orbit's branch
 * and scales the planet.
 * URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Container3D, Mesh3D, SphereGeometry, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { clayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that keeps the outer ring on screen as the sun slides to either end */
const FIT_ASPECT = 1.5;
/** Fog pushed out past the kit's, so the higher camera keeps the far checks soft without fogging the orrery */
const FOG = { near: 14, far: 36 };
/** Each parent's spin when the page opens, in radians a second; the outer orbit's has no row, so it keeps this pace */
const ORBIT_SPIN = 0.45;
const PLANET_SPIN = 1.6;
const OUTER_SPIN = 0.22;
/** Each parent's turn about y on the first frame: the planet front-right of the sun, the moon in front of the planet */
const START = { orbit: -0.7, planet: -0.86, outerOrbit: 2.4 };
/** Where the camera starts: above eye level, so the orbits read as rings, and steeper on a phone held upright */
const CAMERA = {
  wide: { x: 0, y: 7.3, z: 9.4 },
  upright: { x: 0, y: 10.5, z: 5.5 },
};
const TARGET = { x: 0, y: 1.4, z: 0 };

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Parents and children' });
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

// At the screen's size from the start, so the first frame's tags are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme, fog: FOG });
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();

app.stage.addChild(view3d);

// Each body takes its size from its geometry, not its scale: a parent's scale reaches every child, so scaling the sun
// to size it would push the planets out.
const sphere = (radius) =>
  new SphereGeometry({ radius, widthSegments: 48, heightSegments: 24 });

// The tree, top down. A Mesh3D draws; an empty Container3D draws nothing, but its children live in its space.
const sun = new Mesh3D({
  label: 'sun',
  geometry: sphere(0.6),
  material: clayMaterial('orange'),
  y: 1.5,
});
// At the sun's centre, so turning it swings the planet round the sun.
const orbit = new Container3D({
  label: 'orbit',
  rotation: { x: 0, y: START.orbit, z: 0 },
});
// 2.5 along the orbit's x: a child's position is measured in its parent's space.
const planet = new Mesh3D({
  label: 'planet',
  geometry: sphere(0.32),
  material: clayMaterial('purple'),
  x: 2.5,
  rotation: { x: 0, y: START.planet, z: 0 },
});
const moon = new Mesh3D({
  label: 'moon',
  geometry: sphere(0.13),
  material: clayMaterial('lilac'),
  x: 0.75,
});
// A sibling branch with the same shape, to show that a change to one branch leaves the other alone.
const outerOrbit = new Container3D({
  label: 'outerOrbit',
  rotation: { x: 0, y: START.outerOrbit, z: 0 },
});
const outerPlanet = new Mesh3D({
  label: 'outerPlanet',
  geometry: sphere(0.24),
  material: clayMaterial('sky'),
  x: 4.3,
});

view3d.root.addChild(sun);
sun.addChild(orbit, outerOrbit);
orbit.addChild(planet);
planet.addChild(moon);
outerOrbit.addChild(outerPlanet);

/** What the pane sets that isn't a property of its own: each spin, and the planet's scale as one number */
const params = {
  orbitSpin: ORBIT_SPIN,
  planetSpin: PLANET_SPIN,
  planetScale: 1,
};

// Each parent turns and its children travel: nothing writes the planet's or the moon's position.
function spin(dt) {
  orbit.rotation.y += params.orbitSpin * dt;
  planet.rotation.y += params.planetSpin * dt;
  outerOrbit.rotation.y += OUTER_SPIN * dt;
}

const visuals = createVisuals({
  app,
  view3d,
  stage,
  sun,
  orbit,
  planet,
  moon,
  outerOrbit,
  outerPlanet,
});

const isUpright = () => app.screen.width < app.screen.height;
let upright = isUpright();

view3d.camera.fov = 40;
view3d.camera.position.copyFrom(upright ? CAMERA.upright : CAMERA.wide);

// Named for the camera, so `orbit` means only the scene node.
const orbitCamera = new OrbitCamera({
  view: view3d,
  target: TARGET,
  enableDamping: true,
  enablePan: false,
  minDistance: 7,
  maxDistance: 18,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the outer orbit, so the camera and the fog back off until it fits.
fitPortrait({
  renderer: app.renderer,
  orbit: orbitCamera,
  stage,
  minAspect: FIT_ASPECT,
});
// A phone turned after load tilts to the other start's angle, measured from straight above the target.
app.renderer.on('resize', () => {
  if (upright === isUpright()) return;
  upright = !upright;

  const { y, z } = upright ? CAMERA.upright : CAMERA.wide;

  orbitCamera.rotate(0, orbitCamera.polarAngle - Math.atan2(z, y - TARGET.y));
});

const pane = new ThemePane({ title: 'Parents and children', stage });

pane.addBinding(sun.position, 'x', {
  label: 'sun.position.x',
  min: -1,
  max: 1,
  step: 0.01,
});
pane.addBinding(params, 'orbitSpin', {
  label: 'orbit spin',
  min: -1.5,
  max: 1.5,
});
pane.addBinding(orbit, 'visible', { label: 'orbit.visible' });
pane.addBinding(params, 'planetSpin', {
  label: 'planet spin',
  min: -4,
  max: 4,
});
pane
  .addBinding(params, 'planetScale', {
    label: 'planet.scale',
    min: 0.5,
    max: 1.5,
    step: 0.01,
  })
  .on('change', ({ value }) => (planet.scale = value));

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  spin(dt);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbitCamera.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
