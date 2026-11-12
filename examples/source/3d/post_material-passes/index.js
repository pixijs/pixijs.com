/**
 * Outlines and wireframes: passes a material joins by name
 *
 * A pass on the view draws again only the meshes whose material joined it, by the pass's name. `OutlinePass`, named
 * `'outline'`, redraws each one as a slightly larger shell turned inside out, so only a rim shows round it, and
 * `material.enablePass('outline')` and `disablePass` move the outline from shape to shape as the pointer enters each.
 * Its width and colour are compiled into its shader, so a new value means a new pass assigned to `view3d.passes`.
 * `WireframePass`, named `'wireframe'`, is a debug view that every shape joins, switched on and off with `enabled`.
 *
 * Controls: drag to orbit; hover or tap a shape to move the outline onto it (the sphere starts outlined); the pane
 * sets the outline's width and colour and turns the wireframe on. URL flags: `?theme=light|dark`,
 * `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';

import { OrbitCamera, OutlinePass, WireframePass } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createShapes, turnShapes } from './scene';

const TITLE = 'Outlines and wireframes';
/** The narrowest view, width over height, that shows the row of three shapes whole from the landscape distance */
const FIT_ASPECT = 1.1;
/**
 * A list rather than a colour picker: each colour compiles a shader of its own, and a dragged picker would compile
 * dozens. Each reads against both themes' floors, where ink or white would vanish on one; sky and orange show least
 * round the shape of their own colour.
 */
const OUTLINE_COLORS = {
  'hot pink': BRAND.hotPink,
  sky: BRAND.sky,
  orange: BRAND.orange,
};
/** Ink reads over every clay colour on both themes; like the outline's colour, it's fixed when the pass is built */
const WIREFRAME_COLOR = BRAND.ink;

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

// Named 'wireframe', and off until asked for: a debug view.
const wireframe = new WireframePass({ color: WIREFRAME_COLOR, enabled: false });
// OutlinePass is named 'outline', the name a material joins it by. Width is in each mesh's own units: 0.05 is about
// 7 px round the sphere from the start view. Hot pink is the kit's accent, which no shape wears, so the rim never
// melts into its own shape. Clay's rounded edges share their normals, so the pushed-out shell stays closed where an
// engine cube's would split at the corners.
const outlineOptions = { width: 0.05, color: BRAND.hotPink };
let outline = new OutlinePass(outlineOptions);
// A pass on the view draws only the meshes whose material joins it by the pass's name.
const view3d = new View3D({ autoResize: true, passes: [outline, wireframe] });
const stage = new ThemeStage(view3d, { theme });

app.stage.addChild(view3d);

const shapes = createShapes(view3d.root);

// Every shape joins the wireframe now, so flipping `wireframe.enabled` shows them all; a material built here could
// pass `passes: { wireframe: true }` instead. The floor stays out, so its lines don't cross the shapes. The pass
// draws without depth testing, so the far side's edges show through too. It pairs the triangle indices two at a time,
// enough to inspect a mesh but not an exact wireframe, though lathed shapes like these come out as a grid.
for (const shape of shapes.all) {
  shape.material.enablePass('wireframe');
}

// The sphere starts in the outline pass, so the first frame shows a rim.
let outlined = shapes.sphere;

outlined.material.enablePass('outline');

/**
 * Moves the outline to `shape`. The outline shader is built the first time a material joins and kept, so joining and
 * leaving again is cheap enough for every hover. It's the material that joins, so every mesh wearing it outlines too:
 * each shape here has its own clay colour, so its own material.
 */
function outlineShape(shape) {
  if (shape === outlined) return;
  outlined.material.disablePass('outline');
  outlined = shape;
  outlined.material.enablePass('outline');
}

// The shapes hear the pointer through `eventMode: 'static'` in scene.ts, picked against their triangles
// (`hitVolume: 'geometry'`), so the torus's hole hovers nothing. The outline stays on the last shape the pointer
// entered, so it's still in view while the reader works the pane, and a tap picks a shape on a phone.
for (const shape of shapes.all) {
  shape.on('pointerenter', () => outlineShape(shape));
}

/**
 * Width and colour are constants in the outline's shader, so a new value builds a new pass. Assigning `passes`
 * rebuilds the view's render graph on the next render, and every outlined mesh draws with the new pass from then on.
 * The view never destroys a pass it drops, since a pass can be shared between views, so the old one is released here.
 */
function rebuildOutline() {
  const retired = outline;

  outline = new OutlinePass(outlineOptions);
  view3d.passes = [outline, wireframe];
  retired.destroy();
}

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.3, 6.2);

const orbit = new OrbitCamera({
  view: view3d,
  // The row's middle.
  target: { x: 0, y: shapes.sphere.position.y, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 4,
  maxDistance: 11,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the row, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: TITLE, stage });
const outlineFolder = pane.addFolder({ title: 'OutlinePass' });

outlineFolder
  .addBinding(outlineOptions, 'width', { min: 0.01, max: 0.12, step: 0.01 })
  .on('change', rebuildOutline);
outlineFolder
  .addBinding(outlineOptions, 'color', { options: OUTLINE_COLORS })
  .on('change', rebuildOutline);
// Flipping `enabled` rebuilds the view's render graph: fine for a switch, never every frame.
pane.addFolder({ title: 'WireframePass' }).addBinding(wireframe, 'enabled');

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  turnShapes(shapes, time);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
