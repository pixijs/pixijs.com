/**
 * Giving one model built from a glTF file materials of its own, while the others built from it keep sharing the
 * source's
 *
 * Every `Model3D` built from one `Scene3DSource` draws the source's materials, so a value written to one of them shows
 * on every model. Assigning `model.materials` gives one model others to draw: here, `clone()` copies of the helmet's
 * material with `dissolveBit` added, so that helmet dissolves while the other two stay whole. When its dissolve goes
 * back to 0, the helmet draws the shared material again and its copies are destroyed, so it carries the bit, and the
 * `discard` in it, only while the effect runs.
 *
 * Controls: drag to orbit; the `dissolve` rows dissolve each helmet. URL flags: `?theme=light|dark`,
 * `?renderer=webgl|webgpu`.
 */

import { Model3D, View3D } from '@pixi/3d';

import { dissolveBit, OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { model } from './manifest';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { loadReflections, ThemeStage } from './theme/ThemeStage';
import { createVisuals } from './visuals';

const TITLE = 'Materials per model';
/** The helmets from left to right, as the pane names them */
const HELMET_NAMES = ['left', 'middle', 'right'];
/** Each helmet's dissolve when the page opens: the middle one deep enough to show holes, rims and what's left */
const OPENING_DISSOLVE = { left: 0, middle: 0.45, right: 0 };
/** The glow along the cut, in linear light: past 1, so it reads as light given off rather than paint */
const EDGE_COLOR = [6, 2, 0.4];
/** Centre to centre, a little over the helmet's width, so neighbours never touch as they sway */
const SPACING = 2.4;
/** How high the helmets float: clear of the floor, whose checks show through the holes */
const HELMET_HEIGHT = 1.3;
/** Each helmet sways 0.3 rad either way every 18 s, so the key light slides across the chrome */
const SWAY = 0.3;
const SWAY_SPEED = 0.35;
/** The narrowest view, width over height, that shows the three helmets whole from the landscape distance */
const FIT_ASPECT = 1.4;

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

// At the screen's size from the start, so the first frame's tags are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const [source, reflections] = await loading.load(() =>
  Promise.all([Assets.load(model('gltf.DamagedHelmet')), loadReflections()]),
);
// The chrome and the visor mirror their surroundings, so the stage lights the helmets with a cube map.
const stage = new ThemeStage(view3d, { theme, reflections });

// The shadow pass draws casters with a shader of its own, which a material's extra bits never reach, so a dissolving
// helmet would cast a whole shadow. None cast, and the key renders no shadow map.
stage.key.castShadow = false;
app.stage.addChild(view3d);

// Three models from one source. Built plain, all three draw the source's materials: the helmet has one, and the
// three share it.
const helmets = HELMET_NAMES.map(
  (_, i) =>
    new Model3D({
      source,
      x: (i - 1) * SPACING,
      y: HELMET_HEIGHT,
      parent: view3d.root,
    }),
);

/**
 * Dissolves one helmet, which draws copies of its own with the bit while `amount` is above 0
 * @param helmet - One of the three models.
 * @param amount - 0 draws the helmet whole, 1 cuts all of it away.
 */
function setDissolve(helmet, amount) {
  const ownMaterials = helmet.materials !== source.materials;

  if (amount > 0 && !ownMaterials) {
    // The effect starts. The function runs once per source material, and `clone` keeps everything the loader set
    // (textures, factors, emissive, alpha mode), so the copy draws as the shared material does until the bit acts.
    helmet.materials = (material) =>
      material.clone({ extraBits: [dissolveBit] });
    // The fields the bit adds start at 0, and a black edge draws none, so each copy gets its glow here.
    for (const copy of helmet.materials)
      copy.data.dissolveEdgeColor = EDGE_COLOR;
  } else if (amount === 0 && ownMaterials) {
    // The effect ends. Assigning never destroys what it replaces, and the copies a function made are listed only in
    // `materials`, so take them from there before handing the helmet the shared ones back.
    const copies = helmet.materials.filter(
      (material) => !source.materials.includes(material),
    );

    helmet.materials = undefined;
    for (const copy of copies) copy.destroy();
  }

  // `materials` lists this helmet's copies, so the value shows on this helmet alone.
  for (const material of helmet.materials) {
    if (material.extraBits.includes(dissolveBit))
      material.data.dissolve = amount;
  }
}

const dissolve = { ...OPENING_DISSOLVE };

HELMET_NAMES.forEach((name, i) => setDissolve(helmets[i], dissolve[name]));

const visuals = createVisuals({ app, view3d, stage, source, helmets });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3, 7.4);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: HELMET_HEIGHT, z: 0 },
  enableDamping: true,
  enablePan: false,
  // Close enough to watch the rims, and never under the floor.
  minDistance: 4,
  maxDistance: 16,
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the row of helmets, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: TITLE, stage });
const dissolveRows = pane.addFolder({ title: 'dissolve' });

// No `step`: Tweakpane snaps to steps counted from a row's opening value, which would leave the middle row a hair off
// 0, still on its copy. Unstepped, the slider's left end is exactly 0.
for (const [i, name] of HELMET_NAMES.entries()) {
  dissolveRows
    .addBinding(dissolve, name, { min: 0, max: 1 })
    .on('change', ({ value }) => setDissolve(helmets[i], value));
}

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  // The three sway as one, so they read as copies of one file.
  for (const helmet of helmets)
    helmet.rotation.y = Math.sin(time * SWAY_SPEED) * SWAY;
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
