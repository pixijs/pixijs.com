/**
 * Picking from your own loop: `view3d.raycast` once a frame, filling one reused hit
 *
 * `view3d.raycast(pointer, hover)` casts a ray from the camera through a 2D point, finds the closest node that takes
 * part in picking, and fills `hover` with what it struck: `target`, `point`, `localPoint`, `distance`, `normal`, `uv`
 * and `triangleIndex`. It picks whatever point you hand it, whenever you call it, and fires no events. Pointer events
 * pick a 'static' node only when the pointer moves or presses; `eventMode: 'dynamic'` picks again under a still
 * pointer, but only for the real pointer and only through listeners. Here the ticker casts every frame, so the pick
 * follows the shapes a turntable carries under a still pointer. One hit from `createRaycastHit3D()`, passed as `out`,
 * is filled again and again, so the loop allocates nothing; on a miss `raycast` returns `null` and leaves it as it was.
 *
 * Controls: point at a shape (tap one on a phone) and hold still while the turntable carries others under it; drag
 * to orbit. The pane shows what the last hit carries, turns the reused hit off and counts the hits made without it,
 * sets the turntable's speed, and switches every shape's hitVolume between 'geometry' and 'box'. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { createRaycastHit3D, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';

import { createField } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the field whole from the landscape distance */
const FIT_ASPECT = 0.8;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Raycast' });
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
// The raised camera sits about 15.5 units out and the field's back ring about 19, so the fog starts past it: the kit's
// 12 to 40 would haze the back of the field.
const stage = new ThemeStage(view3d, { theme, fog: { near: 19, far: 47 } });

app.stage.addChild(view3d);

const settings = { reuseHover: true, turntable: 0.25, hitVolume: 'geometry' };
const field = createField(view3d.root);

// raycast sees only the nodes that take part in picking. Every shape is 'static'; the stage's floor keeps the
// default, 'passive', and has no interactive parent, so a ray that reaches it hits nothing.
for (const shape of field.shapes) shape.eventMode = 'static';

/**
 * 'geometry' is the opt-in: it tests every triangle, so a hit carries the face's normal, uv and index. 'box' is what a
 * Mesh3D gets with hitVolume left null: it tests the bounds alone, so the normal and uv stay zero and the index -1.
 */
function setHitVolume(volume) {
  for (const shape of field.shapes) shape.hitVolume = volume;
}

setHitVolume(settings.hitVolume);

// The hit every raycast fills, made once.
const hover = createRaycastHit3D();

view3d.camera.fov = 40;
// Far enough out, and aimed far enough above the field's middle, that it sits a little low: on a 4:3 screen the shapes
// the turntable carries round the field's right edge pass under the pane and clear of the ray inset below it.
view3d.camera.position.set(0, 8.4, 13.55);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.8, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 8,
  maxDistance: 20,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the field, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

// The 2D point the pick casts through, in global px: the reader's pointer, as pixi's event system last saw it. It
// stays where the pointer last was, so after a tap on a phone the pick holds there. Until the pointer first comes over
// the canvas there's no point to cast through, and the loop picks nothing.
let pointer = null;

app.canvas.addEventListener(
  'pointerover',
  () => {
    pointer = app.renderer.events.pointer.global;
  },
  { once: true },
);

const pane = new ThemePane({ title: 'Raycast', stage });
const controls = createControls({ pane, settings, hover, setHitVolume });
const visuals = createVisuals({
  app,
  view3d,
  stage,
  orbit,
  pane,
  field,
  settings,
});

function step(dt) {
  stage.update(dt);

  // Every frame, whether the pointer moved or not. It picks with the transforms the last frame was drawn with, so it
  // picks what the reader sees. Handed hover, it fills and returns it; without, each hit is a new object. On a miss
  // it returns null and leaves hover as it was, so read the hit through what it returns.
  let hit = null;

  if (pointer)
    hit = settings.reuseHover
      ? view3d.raycast(pointer, hover)
      : view3d.raycast(pointer);
  field.light(hit ? hit.target : null);
  field.root.rotation.y += settings.turntable * dt;
  controls.update(hit);
  visuals.update(hit, pointer, dt);
}

app.ticker.add((ticker) => step(Math.min(ticker.deltaMS / 1000, 1 / 15)));

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
step(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
