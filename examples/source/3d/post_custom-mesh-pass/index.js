/**
 * A `MeshPass` of your own: an x-ray that draws chosen meshes again, in one flat colour, through the wall in front
 *
 * A `MeshPass` on the view's `passes` draws every mesh whose material joined it by name (`enablePass('xray')`) a
 * second time, with its own shader and render state, at the stage of the frame it names. Its stage and colour are fixed
 * when it's built, so changing either swaps in a new pass. With the depth test off it draws a member's whole shape,
 * hidden or not, since pixi's `State` has no "only where hidden" test, so the critters here stay wholly behind the
 * wall.
 *
 * Controls: drag to orbit; the pane picks the pass's colour, flips its depthTest, moves its stage, and puts each
 * critter in or out of it. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { MeshPass, View3D } from '@pixi/3d';
import { OrbitCamera, solidMeshDescriptor } from '@pixi/3d/extras';
import { Application, State } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import {
  createCritters,
  createWall,
  CRITTER_NAMES,
  moveCritters,
} from './scene';

import { createVisuals } from './visuals';

const TITLE = 'Custom mesh pass';
/** The narrowest view, width over height, that shows the wall whole at every corner of the orbit's fence */
const FIT_ASPECT = 1.0;

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

// The pass's render state is pixi's `State`, built once and shared by every pass built from it.
const xrayState = new State();

// Off, the second draw ignores the depth buffer, so it shows even where the wall is nearer. On, it fails the test
// there like the first draw, and the silhouettes go.
xrayState.depthTest = false;
// WebGL writes no depth with the test off, but WebGPU still does; with writes off too, both keep the scene's depth.
xrayState.depthMask = false;

/**
 * The stage and colour the pass is built with, which it can't change once built. At `'afterOpaque'` it draws once the
 * wall is down, so the silhouettes land on its face; at `'beforeOpaque'` the sky and the opaque meshes draw after it
 * and paint over them. The colour is one no critter wears, so a silhouette reads as the pass's draw, not a mesh's.
 */
const xrayBuild = { stage: 'afterOpaque', color: BRAND.sky };

function createXRayPass({ stage, color }) {
  return new MeshPass({
    name: 'xray',
    stage,
    description:
      'Draws its members in one flat colour, through whatever is in front.',
    // The colour is baked into the shader, so a new colour means a new pass.
    descriptor: {
      state: xrayState,
      shaderDescriptor: solidMeshDescriptor({ color }),
    },
  });
}

let xray = createXRayPass(xrayBuild);
const view3d = new View3D({ autoResize: true, passes: [xray] });
const stage = new ThemeStage(view3d, { theme });

app.stage.addChild(view3d);

createWall(view3d.root);

const critters = createCritters(view3d.root);
/** Which critters are in the pass; the pane's checkboxes show it */
const members = { sphere: true, cube: false, capsule: true };

/**
 * A pass's members are materials, so every mesh that wears one joins with it. Each critter wears its own clay colour,
 * so its own material, and joins or leaves alone.
 */
function setMember(name, joined) {
  members[name] = joined;
  if (joined) critters[name].material.enablePass('xray');
  else critters[name].material.disablePass('xray');
}

for (const name of CRITTER_NAMES) setMember(name, members[name]);

/** The pass reads `xrayState` by reference, so a flipped field needs no new pass */
function setDepthTest(on) {
  xrayState.depthTest = on;
  // Both backends keep drawing each member with the old state until it's invalidated, so each records its draw again.
  // A critter that joins later records its draw then.
  for (const name of CRITTER_NAMES)
    if (members[name]) critters[name].invalidate();
}

/** Builds the pass again with `change` applied to `xrayBuild`, and swaps it in for the old one */
function rebuildXRay(change) {
  const old = xray;

  Object.assign(xrayBuild, change);
  xray = createXRayPass(xrayBuild);
  // Assigning `passes` rebuilds the render graph on the next render. The map swaps only `xray` and keeps whatever
  // else the view runs, here the inset's passes.
  view3d.passes = view3d.passes.map((pass) => (pass === old ? xray : pass));
  // The view never destroys a pass it drops.
  old.destroy();
}

// The inset: a second camera looking down over the wall at the critters as they are, with no x-ray.
const visuals = createVisuals({ app, view3d, stage });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.35, 10.4);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.4, z: 0 },
  enableDamping: true,
  enablePan: false,
  // In front of the wall and below its top, since a critter seen directly would turn flat colour, and far enough
  // that the wall stays clear of the inset at every corner of the fence.
  minAzimuthAngle: -0.3,
  maxAzimuthAngle: 0.3,
  minPolarAngle: 1.3,
  maxPolarAngle: 1.5,
  minDistance: 10.5,
  maxDistance: 12,
});

// A portrait screen is narrower than the wall, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: TITLE, stage });
createControls({
  pane,
  xrayState,
  xrayBuild,
  members,
  rebuildXRay,
  setDepthTest,
  setMember,
});

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  moveCritters(critters, time);
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
moveCritters(critters, 0);
orbit.update();
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
