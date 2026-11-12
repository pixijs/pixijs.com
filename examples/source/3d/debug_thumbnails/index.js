/**
 * Small pictures of geometry for an asset browser, with `GeometryThumbnailGenerator`
 *
 * `getThumbnail(geometry)` draws a geometry on the CPU into a `size` × `size` canvas, from one fixed angle in one
 * steel blue, whatever the mesh's material, transform or the camera. It caches the result by `geometry.uid`, so meshes
 * that share a geometry share a thumbnail, and asking again costs a map lookup. A result is `'ready'` with a `canvas`,
 * or `'unsupported'` with a `reason`, and the cache keeps either until `prune()` drops it. `size` is fixed per
 * generator, so a new size is a new generator. `clear()` empties a generator you keep, after a scene unload say;
 * replacing one doesn't need it. `GraphDebugOverlay` draws its geometry cards with this generator.
 *
 * Controls: drag to orbit; the pane sets the thumbnail size, and the knot's detail, which past the generator's
 * triangle limit leaves its tile a reason instead of a picture. URL flags: `?theme=light|dark`,
 * `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';
import { GeometryThumbnailGenerator, OrbitCamera } from '@pixi/3d/extras';
import { Application, CanvasSource, Texture } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { AssetShelf } from './AssetShelf';
import { createLineup, knotGeometry } from './scene';

/** Fine enough to pass the generator's triangle limit, so the knot's tile shows the `'unsupported'` result */
const KNOT_SEGMENTS = 512;
/** The sizes the pane offers, from blocky to twice a wide screen's tile */
const SIZES = [16, 32, 64, 128, 256];
/** The arc spans 77% of a 16:9 view, so this narrow it still fits */
const FIT_ASPECT = 1.6;
/** The px a narrow screen keeps free at the top for the pane, which the arc centres below */
const PANE_CLEAR = 60;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Geometry thumbnails' });
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
const stage = new ThemeStage(view3d, { theme, fog: { near: 14, far: 36 } });
const lineup = createLineup(view3d.root, KNOT_SEGMENTS, app.screen);
// The browser lists geometries, not meshes. clayGeometry returns one cached geometry per shape, so the two cubes
// share one, and one tile.
const geometries = [...new Set(lineup.meshes.map((mesh) => mesh.geometry))];
const knotTile = geometries.indexOf(lineup.knot.geometry);
const shelf = new AssetShelf({
  stage,
  screen: app.screen,
  meshes: lineup.meshes,
  geometries,
});

app.stage.addChild(view3d, shelf);

const settings = {
  // The smallest power of two with a canvas pixel for each screen pixel of a tile: sharp, without wasting memory.
  size: 2 ** Math.ceil(Math.log2(shelf.slot * app.renderer.resolution)),
  tubularSegments: KNOT_SEGMENTS,
};
let thumbnails = new GeometryThumbnailGenerator({ size: settings.size });
/** The uids of the geometry on the shelf, the entries a prune keeps */
const onShelf = new Set(geometries.map((geometry) => geometry.uid));
/** Each tile's texture: made with its first picture, then pointed at each one after */
const textures = [];
// Each draw is CPU work, a few ms for a dense mesh, so the tick draws one waiting tile a frame.
const pending = [];

/** Asks for tile `index`'s thumbnail and shows it: the one place that calls getThumbnail */
function showThumbnail(index) {
  const result = thumbnails.getThumbnail(geometries[index]);

  if (result.status === 'ready')
    shelf.setTexture(index, textureFor(index, result.canvas));
  else shelf.setReason(index, result.reason);
}

/** Tile `index`'s texture, pointed at `canvas`; the tile's first picture makes it */
function textureFor(index, canvas) {
  // Nearest shows a small canvas's own pixels, where linear would blur them; linear averages a big one down.
  const scaleMode =
    canvas.width < shelf.slot * app.renderer.resolution ? 'nearest' : 'linear';
  const texture = textures[index];

  if (!texture) {
    const source = new CanvasSource({ resource: canvas, scaleMode });

    // Its own CanvasSource, not Texture.from(canvas), which would keep it in pixi's Cache. `dynamic`, since its size
    // follows the canvas, and a sprite re-reads only a dynamic texture's frame.
    return (textures[index] = new Texture({ source, dynamic: true }));
  }
  // A later picture swaps the canvas under the same texture: update() reads its size and uploads it. The old canvas
  // stays in the cache that drew it until a prune drops it or that generator goes. A style's settings take effect on
  // its own update().
  texture.source.resource = canvas;
  texture.source.update();
  texture.source.style.scaleMode = scaleMode;
  texture.source.style.update();

  return texture;
}

/** Swaps in a generator at `size` and queues every tile to redraw */
function setThumbnailSize(size) {
  // A generator draws at one size, so a new size needs a new one. Dropping the old one frees its canvases, once the
  // tiles have swapped theirs.
  thumbnails = new GeometryThumbnailGenerator({ size });
  pending.length = 0;
  for (let i = 0; i < geometries.length; i++) pending.push(i);
}

/** Rebuilds the knot with `tubularSegments`, which gives it a new geometry and a new uid */
function setKnotDetail(tubularSegments) {
  const old = lineup.knot.geometry;

  lineup.knot.geometry = geometries[knotTile] = knotGeometry(tubularSegments);
  onShelf.delete(old.uid);
  onShelf.add(lineup.knot.geometry.uid);
  shelf.setGeometry(knotTile, lineup.knot.geometry);
  if (!pending.includes(knotTile)) pending.push(knotTile);
  // The cache never forgets a geometry on its own, and the old knot's uid never comes back, so its entry goes now.
  thumbnails.prune(onShelf);
  // `true` frees its buffers too, which no other geometry shares.
  old.destroy(true);
}

// Every tile drawn before the first frame.
for (let i = 0; i < geometries.length; i++) showThumbnail(i);

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3, 10);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 14,
  maxPolarAngle: Math.PI * 0.45,
});

// A phone is narrower than the arc, so the camera and the fog back off, and the arc centres between the pane and the
// shelf.
const fit = fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: FIT_ASPECT,
  clearTop: PANE_CLEAR,
});

/** Keeps the shelf's band free on a narrow screen, as the shelf grows a second row on a phone */
function clearShelf() {
  shelf.update();
  fit.clearBottom = app.screen.height - shelf.rect.y;
  fit.refit();
}

clearShelf();
app.renderer.on('resize', clearShelf);

const pane = new ThemePane({ title: 'Geometry thumbnails', stage });

pane
  .addBinding(settings, 'size', {
    options: Object.fromEntries(SIZES.map((size) => [size, size])),
  })
  .on('change', ({ value }) => setThumbnailSize(value));
pane
  .addBinding(settings, 'tubularSegments', {
    label: 'Knot detail',
    min: 64,
    max: 640,
    step: 32,
  })
  .on('change', ({ value, last }) => {
    // A rebuild and its thumbnail are heavy CPU work, so a drag pays for them once, on release.
    if (last) setKnotDetail(value);
  });

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);

  const next = pending.shift();

  if (next !== undefined) showThumbnail(next);
  lineup.update();
  shelf.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
