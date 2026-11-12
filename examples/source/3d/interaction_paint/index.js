/**
 * Painting on a mesh, at the point the pointer touches it
 *
 * Picked triangle by triangle (`hitVolume: 'geometry'`), a mesh gives every pointer event a `hit3D` with the `uv` under
 * the pointer, 0 to 1 across and down its texture, and the `normal` of the surface there. Painting is then plain 2D:
 * `uv` times the canvas's size is a pixel, the canvas's 2D context draws there, and `paintSource.update()` sends the
 * canvas to the GPU, at most once a frame, for the material that samples it. `view3d.raycast` gives the same hit
 * without an event; the page opens with one. Picked against its bounding box (`hitVolume: 'box'`), the ball's hits
 * carry neither uv nor normal, so nothing paints.
 *
 * Controls: drag on the ball to paint, drag elsewhere to orbit; the pane sets the brush's radius and colour, switches
 * the ball's hit volume, clears the paint and reads the uv of the last hit. URL flags: `?theme=light|dark`,
 * `?renderer=webgl|webgpu`.
 */

import { createRaycastHit3D, Mesh3D, View3D } from '@pixi/3d';

import { Application, CanvasSource, Texture } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { createClayMaterial } from './theme/clay';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { CLAY_UV_LAYOUT, clayGeometry } from './theme/shapes';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createBrush } from './brush';
import { drawPrimer, frameBall } from './scene';
import { createVisuals } from './visuals';

/** u wraps once round the ball and v runs pole to pole, half as far (`CLAY_UV_ASPECT.sphere` is 2), so a dab is round */
const PAINT_WIDTH = 1024;
const PAINT_HEIGHT = 512;
/** The clay sphere is 0.9 across, so the ball is 2.7: big enough to paint on with a finger */
const BALL_SCALE = 3;
/** World units per canvas pixel round the ball's widest line, so the ring on the ball is the size of a dab */
const WORLD_PER_PIXEL =
  (CLAY_UV_LAYOUT.sphere.uLength * BALL_SCALE) / PAINT_WIDTH;
/** Where the brush rests when the page opens: a point on the ball's front, right of centre and a little above it */
const BRUSH_REST = { x: 0.77, y: 1.94, z: 1.06 };
/** How far round the ball, in u, the opening stroke runs before it ends where the brush rests */
const FIRST_STROKE = 0.2;
/** The uv rows: read-only, to two places, polled often enough to keep up with the pointer */
const UV_ROW = {
  readonly: true,
  interval: 50,
  format: (value) => value.toFixed(2),
};

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Painting on a mesh' });
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

// The paint is a canvas that the ball's material samples. Drawing on it changes nothing on screen until
// `paintSource.update()` sends it to the GPU again.
const paintSource = new CanvasSource({
  width: PAINT_WIDTH,
  height: PAINT_HEIGHT,
});
const paintTexture = new Texture({ source: paintSource });
// Round strokes on the canvas's 2D context (brush.ts), over a primer that shows the ball's uv layout (scene.ts).
const brush = createBrush({
  paint: paintSource.context2D,
  primer: drawPrimer,
  radius: 16,
  color: BRAND.sky,
});

// Picked triangle by triangle, so every hit carries the uv and normal under the pointer. Left to its default, an
// interactive mesh is picked against its bounding box, whose hits have neither.
const ball = new Mesh3D({
  geometry: clayGeometry('sphere'),
  material: createClayMaterial({ baseColorTexture: paintTexture }),
  scale: BALL_SCALE,
  position: { x: 0, y: 1.6, z: 0 },
  // The uvs' seam, where u wraps from 1 back to 0, runs down the sphere's +z side; this turns it to the back.
  rotation: { x: 0, y: Math.PI, z: 0 },
  eventMode: 'static',
  hitVolume: 'geometry',
  cursor: 'crosshair',
  parent: view3d.root,
});

/** The pointer whose press is painting, or -1 while none is */
let painter = -1;
/** The last hit on the ball, kept after the pointer leaves so the brush stays where it was; visuals and pane read it */
const brushHit = createRaycastHit3D();

/** Keeps the pointer's hit on the ball, and paints there while that pointer's press is painting */
function followPointer(e) {
  // While one pointer paints, the others are ignored, so a second finger never joins its dabs to the first's.
  if (!e.hit3D || (painter !== -1 && e.pointerId !== painter)) return;

  const { point, localPoint, normal, uv, triangleIndex } = e.hit3D;

  // `hit3D` belongs to the event, and the next event reuses it, so what the frame reads later is copied out.
  brushHit.point.copyFrom(point);
  brushHit.localPoint.copyFrom(localPoint);
  brushHit.normal.copyFrom(normal);
  brushHit.uv.copyFrom(uv);
  brushHit.triangleIndex = triangleIndex;
  // Only a per-triangle hit has a uv and a normal; a box hit has neither, so there's nothing to paint at.
  if (triangleIndex === -1) brush.lift();
  else if (e.pointerId === painter)
    brush.strokeTo(uv.x * PAINT_WIDTH, uv.y * PAINT_HEIGHT);
}

function endStroke(e) {
  if (e.pointerId === painter) painter = -1;
}

ball.on('pointerdown', (e) => {
  // The OrbitCamera listens on the view, so stopping the press here keeps the camera still while the brush paints.
  e.stopPropagation();
  // Every press starts a stroke of its own: pixi never reports a cancelled touch's release, so one can be left open.
  painter = e.pointerId;
  brush.lift();
  followPointer(e);
});
ball.on('pointermove', followPointer);
ball.on('pointerout', (e) => {
  // The stroke ends, so a pointer that comes back on, its button still down, doesn't draw a line across the gap.
  if (painter === -1 || e.pointerId === painter) brush.lift();
});
ball.on('pointerup', endStroke);
ball.on('pointerupoutside', endStroke);

/** Sends the canvas to the GPU if anything was painted: `update()` sends all of it, so once a frame is enough */
function uploadPaint() {
  if (!brush.dirty) return;
  paintSource.update();
  brush.dirty = false;
}

// Drag off the ball to orbit round it; on a phone the camera backs off until the ball fits (scene.ts).
const orbit = frameBall({ renderer: app.renderer, view3d, stage, ball });
const visuals = createVisuals({
  view3d,
  ball,
  brush,
  brushHit,
  worldPerPixel: WORLD_PER_PIXEL,
});
const pane = new ThemePane({ title: 'Painting on a mesh', stage });

pane
  .addBinding(brush, 'radius', {
    label: 'Brush radius',
    min: 6,
    max: 48,
    step: 1,
    format: (px) => `${px} px`,
  })
  .on('change', () => brush.apply());
pane
  .addBinding(brush, 'color', { label: 'Colour', view: 'color' })
  .on('change', () => brush.apply());
pane.addBinding(ball, 'hitVolume', {
  options: { geometry: 'geometry', box: 'box' },
});
pane.addButton({ title: 'Clear' }).on('click', () => brush.clear());

// The uv of the last hit, 0 to 1 across and down the canvas: a box hit reads 0, 0.
const hitFolder = pane.addFolder({ title: 'hit3D' });

hitFolder.addBinding(brushHit.uv, 'x', { label: 'uv.x', ...UV_ROW });
hitFolder.addBinding(brushHit.uv, 'y', { label: 'uv.y', ...UV_ROW });

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  uploadPaint();
  visuals.update();
});

// `view3d.raycast` picks with the transforms of the last render, so the first render comes before it.
orbit.update();
app.render();

// The page opens with the brush resting on the ball and one stroke painted up to it. The rest is a pick without an
// event, through the point on screen where BRUSH_REST is drawn, and it fills `brushHit` as a pointer's hit would.
const restOnScreen = view3d.worldToScreen(BRUSH_REST);

if (restOnScreen && view3d.raycast(restOnScreen, brushHit)) {
  brush.strokeTo(
    (brushHit.uv.x - FIRST_STROKE) * PAINT_WIDTH,
    brushHit.uv.y * PAINT_HEIGHT,
  );
  brush.strokeTo(brushHit.uv.x * PAINT_WIDTH, brushHit.uv.y * PAINT_HEIGHT);
  brush.lift();
}

// The canvas joins with its first frame already drawn, the first stroke sent up, then the loading screen dissolves.
uploadPaint();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
