/**
 * A material's render state: how its colour blends with what's behind, whether nearer surfaces hide it, and which
 * faces it skips
 *
 * `material.state` is pixi's `State`; its `blendMode`, `depthTest` and `cullMode` apply to every draw with the
 * material. Blending needs `alphaMode: 'blend'`, and a field changed after the first render needs `invalidate()` on
 * each mesh that wears the material.
 *
 * Controls: drag to orbit; the pane sets the balls' blendMode, the pin's depthTest and the tube's cullMode, pauses the
 * pin's slide and places the pin. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { CylinderGeometry, Material3D, Mesh3D, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { createClayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { clayGeometry } from './theme/shapes';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import {
  createWall,
  ORB_COLORS,
  ORB_POSITIONS,
  ORB_SCALE,
  PIN,
  pinSlideX,
  TUBE,
} from './scene';
import { createVisuals } from './visuals';

const TITLE = 'Render state';
/** The narrowest view, width over height, that shows the wall, the pin's slide and the tube's arrows whole */
const FIT_ASPECT = 1.25;
/** Bright enough that the overlaps reach white on the night half, dim enough that one ball keeps its colour */
const GLOW_STRENGTH = 0.8;
/** Lifts the pin's purple off the night half of the wall, so it reads as a marker */
const PIN_GLOW = 0.6;

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
const stage = new ThemeStage(view3d, { theme });

app.stage.addChild(view3d);
view3d.root.addChild(createWall());

// Blending. `alphaMode: 'blend'` puts a material in the transparent pass, which draws after every opaque mesh and
// writes no depth, so its `blendMode` always meets the finished wall. A black base with no specular takes nothing from
// the lights, so each ball adds or multiplies one flat colour. Fog is off, since added haze would brighten a far ball.
function createGlow(color) {
  const glow = new Material3D({
    baseColor: 0x000000,
    emissive: { color, strength: GLOW_STRENGTH },
    specular: { factor: 0 },
    roughness: 1,
    alphaMode: 'blend',
    fog: false,
  });

  glow.state.blendMode = 'add';

  return glow;
}

const glows = ORB_COLORS.map(createGlow);
// A Venn on each half of the wall. The two balls of a colour share one material, so one write changes both.
const orbs = ORB_POSITIONS.map(
  (position, i) =>
    new Mesh3D({
      geometry: clayGeometry('sphere'),
      material: glows[i % glows.length],
      position,
      scale: ORB_SCALE,
      parent: view3d.root,
    }),
);

// Depth. The pin slides out from behind the wall's night half and back. It's in the transparent pass too, so the wall
// is drawn before the pin, and with the test off the pin draws over it. It's convex, so with culling on its own faces
// never overlap, even with no depth test.
const pinMaterial = new Material3D({
  baseColor: BRAND.purple,
  emissive: { color: BRAND.purple, strength: PIN_GLOW },
  roughness: 0.5,
  alphaMode: 'blend',
  fog: false,
});

pinMaterial.state.depthTest = false;

const pin = new Mesh3D({
  geometry: clayGeometry('octahedron'),
  material: pinMaterial,
  position: PIN.position,
  scale: PIN.scale,
  parent: view3d.root,
});

// Culling. A closed mesh never shows a face turned away from the camera, which is why `'back'` is the default, so the
// tube is open at both ends, where those faces show. `cullMode` only picks which faces are skipped, so the tube's
// inside lights like its outside; a surface meant to be seen from both sides wants `doubleSided: true`, which also
// lights the back with its normal flipped. The shadow pass keeps its own state, so the tube's shadow stays whole. The
// tube wears clay of its own, since a change to a shared material reaches every mesh that wears it.
const tubeMaterial = createClayMaterial({ color: 'sky' });

// The default, written out to show the field.
tubeMaterial.state.cullMode = 'back';

const tube = new Mesh3D({
  geometry: new CylinderGeometry({
    radiusTop: TUBE.radius,
    radiusBottom: TUBE.radius,
    height: TUBE.height,
    openEnded: true,
  }),
  material: tubeMaterial,
  position: TUBE.position,
  rotation: { x: TUBE.tilt, y: 0, z: 0 },
  parent: view3d.root,
});

// WebGL and WebGPU both keep drawing with the old state until a mesh rebuilds, and `invalidate()` makes it rebuild
// on the next frame. It's per mesh, so every mesh that wears a changed material needs it.
function setBlendMode(mode) {
  for (const glow of glows) glow.state.blendMode = mode;
  for (const orb of orbs) orb.invalidate();
}

function setDepthTest(on) {
  pinMaterial.state.depthTest = on;
  pin.invalidate();
}

function setCullMode(mode) {
  tubeMaterial.state.cullMode = mode;
  tube.invalidate();
}

const visuals = createVisuals({
  app,
  view3d,
  stage,
  pin,
  tube,
  tubeRadius: TUBE.radius,
});

view3d.camera.fov = 40;
view3d.camera.position.set(0.5, 3.4, 9.5);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0.5, y: 1.2, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 15,
  maxPolarAngle: Math.PI * 0.45,
  // Far enough to watch the tube's culled half follow the view, and no further: the balls stand out from the wall, so
  // a wider turn slides them off their halves, and turning right moves the white half's Venn, far left, the most.
  minAzimuthAngle: -0.6,
  maxAzimuthAngle: 0.22,
});

// A portrait screen is narrower than the wall and the tube, so the camera and the fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

// Each state row binds a material's state and hands the new value to its setter. The first glow stands for all three.
const pane = new ThemePane({ title: TITLE, stage });
const settings = { slide: true };

pane
  .addBinding(glows[0].state, 'blendMode', {
    options: { normal: 'normal', add: 'add', multiply: 'multiply' },
  })
  .on('change', ({ value }) => setBlendMode(value));
pane
  .addBinding(pinMaterial.state, 'depthTest')
  .on('change', ({ value }) => setDepthTest(value));

// The slide carries the pin behind the wall and out, so depthTest shows as it passes. Moving the pin's row pauses it,
// so the pin stays where the reader put it. No `step`: a stepped row writes its rounded value back when it refreshes.
const slideRow = pane.addBinding(settings, 'slide', { label: 'Slide' });
const pinRow = pane.addBinding(pin.position, 'x', {
  label: 'pin.position.x',
  min: PIN.position.x,
  max: PIN.out,
});

// 'back', the default, first.
pane
  .addBinding(tubeMaterial.state, 'cullMode', {
    options: { back: 'back', front: 'front', none: 'none' },
  })
  .on('change', ({ value }) => setCullMode(value));

// A refresh fires the row's change handler too, so the handler ignores the slide's own writes.
let syncing = false;
let slideTime = 0;

function pauseSlide() {
  if (syncing || !settings.slide) return;
  settings.slide = false;
  slideRow.refresh();
}

pinRow.on('change', pauseSlide);
// A refresh rewrites the number box, so focus pauses it too, before a half-typed value is lost.
pinRow.element.addEventListener('focusin', pauseSlide);

function slidePin(dt) {
  slideTime += dt;
  pin.position.x = pinSlideX(slideTime);
  syncing = true;
  pinRow.refresh();
  syncing = false;
}

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  if (settings.slide) slidePin(dt);
  pin.rotation.y += PIN.spin * dt;
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
