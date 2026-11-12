/**
 * The render graph: a view draws each frame by running a list of passes, and you add steps to it in two ways
 *
 * `createDefaultGraph3D` builds the list: the shadow map, the sky and the opaque scene, the see-through scene, then a
 * pass that puts the frame on screen. A `Pass3D` in `passes` adds its own passes at a stage of that list, and the
 * `graph` option hands you the list itself, to append where no stage reaches. The insets are copies of the frame taken
 * at three points in the list, so each shows what the passes before it drew.
 *
 * Controls: drag to orbit; the pane turns the scan on and off, moves and tunes its ring, and counts the times the view
 * has built its graph. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { createDefaultGraph3D, Mesh3D, Vector3, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { clayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { roundedCylinder } from './theme/shapes';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { FrameCapture, FrameCopy } from './FrameCapture';
import { ScanPass } from './ScanPass';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the logo whole with a margin either side */
const FIT_ASPECT = 1.1;
/** The see-through plinth under the logo: wide enough to read in the small copies, clear enough to show the floor */
const PLINTH = { radius: 2, height: 0.3, edge: 0.12, alpha: 0.6 };
/**
 * The floor point the ring opens through: behind the logo, and far enough back to show past the plinth, not through it.
 * The ring reads only the opaque depth, so floor seen through the plinth would light up over it.
 */
const RING_THROUGH = new Vector3(0, 0, -4.5);
/** The ring's thickness in world units: thick enough to show in the small copies too */
const RING_WIDTH = 1;
/** The logo's idle sway: the most it turns either way, in radians, and how fast */
const SWAY = 0.25;
const SWAY_SPEED = 0.4;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Render graph' });
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

// Objects you keep: the view builds each into every graph at its stage, on every rebuild. At one stage, `passes` order
// decides, so the `afterTransparent` copy is taken before the scan lights its ring, and only the last copy has it.
const afterOpaque = new FrameCapture({ stage: 'afterOpaque' });
const afterTransparent = new FrameCapture({ stage: 'afterTransparent' });
const scan = new ScanPass({ color: BRAND.sky, width: RING_WIDTH });
// A bare copy, not a Pass3D: the builder appends its pass after everything, where no stage reaches.
const graphEnd = new FrameCopy();
// How many times the view has called the builder, for the pane to show.
const builds = { count: 0 };

const view3d = new View3D({
  autoResize: true,
  // The scene draws into a texture, `graph.sceneColor`, then onto the screen, so a pass can read the frame so far.
  composite: true,
  passes: [afterOpaque, afterTransparent, scan],
  // The view calls this on its first render and on every rebuild. Forward `options`: they carry the
  // `globalTextureBindings` every graph needs, and `passes` and `composite` reach the graph through them.
  graph: (renderer, options) => {
    const { graph } = createDefaultGraph3D(renderer, options);

    graph.addPass(graphEnd.createPass(graph, renderer));
    builds.count++;

    return graph;
  },
});
const stage = new ThemeStage(view3d, { theme });
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();
const logo = await loading.load(() => loadPixiLogo({ width: 4 }));
// See-through, so it draws in the transparent pass, after both opaque copies are taken.
const plinth = new Mesh3D({
  geometry: roundedCylinder(PLINTH.radius, PLINTH.height, PLINTH.edge),
  material: clayMaterial('purple', { alphaMode: 'blend', alpha: PLINTH.alpha }),
  position: { x: 0, y: PLINTH.height / 2, z: 0 },
});

app.stage.addChild(view3d);
logo.root.position.y = 1.7;
view3d.root.addChild(plinth, logo.root);

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.2, 10);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.9, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 16,
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the logo, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const visuals = createVisuals({
  app,
  stage,
  copies: {
    afterOpaque: afterOpaque.copy,
    afterTransparent: afterTransparent.copy,
    'end of graph': graphEnd,
  },
});

// The fit's zoom lands on the orbit's next update. Run it now, so the ring is measured from the fitted camera.
orbit.update();
scan.radius = RING_THROUGH.distanceTo(view3d.camera.position);

const pane = new ThemePane({ title: 'Render graph', stage });
const scanFolder = pane.addFolder({ title: 'scan · Pass3D' });

// Flipping it rebuilds the graph: the view calls `graph` again, and `build` runs only for enabled passes.
scanFolder.addBinding(scan, 'enabled');
// Uniform writes: the graph stays as it is, so the build count holds. The radius runs from where the ring meets the
// bottom of the screen out to the far floor, on any screen.
scanFolder.addBinding(scan, 'radius', {
  min: scan.radius * 0.55,
  max: scan.radius * 3,
  step: 0.1,
});
scanFolder.addBinding(scan, 'width', { min: 0.1, max: 3, step: 0.05 });
scanFolder.addBinding(scan, 'color', { view: 'color' });
pane.addBinding(builds, 'count', {
  label: 'graph builds',
  readonly: true,
  format: (n) => n.toFixed(0),
});

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  logo.root.rotation.y = Math.sin(time * SWAY_SPEED) * SWAY;
  stage.update(dt);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
