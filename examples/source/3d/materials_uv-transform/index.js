/**
 * Moving a texture across a surface with a material's UV transform: scrolling, tiling and atlas frames
 *
 * `material.uvTransform` is a pixi `Matrix` that remaps the mesh's UVs before any texture is read, like a window onto
 * the texture: `scale(4, 1)` makes the window four pictures wide, and a `translate` written each tick slides it. A
 * spritesheet frame given as the base colour texture sets the transform by itself, so swapping frames plays a
 * flipbook.
 *
 * Controls: drag to orbit; the pane sets the belt's scroll speed and tiling, the screen's frame rate, and swaps the
 * frame for the whole atlas. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import {
  FlatMaterial,
  Material3D,
  Mesh3D,
  PlaneGeometry,
  View3D,
} from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Matrix, Spritesheet, Texture } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import {
  createBelt,
  createMonitor,
  drawBounceAtlas,
  drawStripeTile,
} from './scene';
import { createVisuals } from './visuals';

/** The belt's face, as wide as four squares side by side */
const BELT_SIZE = { width: 4.8, height: 1.2 };
/** The screen, 4:3 like the atlas's frames */
const SCREEN_SIZE = { width: 2, height: 1.5 };
/** Copies of the square stripe tile across the belt at the start: four, so each one shows square */
const TILING = 4;
/**
 * The narrowest view, width over height, that shows the belt and its `u 0` and `u 1` tags whole: any narrower and the
 * tags, held inside the screen's edge, slide in against the rollers
 */
const FIT_ASPECT = 1.15;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'UV transform' });
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

// Tiling reads the texture past u = 1, so it has to repeat there; the default clamps.
const stripes = Texture.from({
  resource: drawStripeTile(),
  addressMode: 'repeat',
  autoGenerateMipmaps: true,
});
const beltMaterial = new Material3D({
  baseColorTexture: stripes,
  roughness: 0.8,
  uvTransform: new Matrix().scale(TILING, 1),
});
// Images store their rows top-down, so `flipV` puts v = 0 on the top edge and the pictures stand upright.
const beltFace = new Mesh3D({
  geometry: new PlaneGeometry({ ...BELT_SIZE, flipV: true }),
  material: beltMaterial,
  castShadow: false,
});

const bounce = drawBounceAtlas();
const atlas = Texture.from({
  resource: bounce.canvas,
  autoGenerateMipmaps: true,
});
// A real atlas comes the same way from a TexturePacker file: `await Assets.load('bounce.json')`.
const sheet = new Spritesheet({ texture: atlas, data: bounce.data });

sheet.parseSync();

const frames = sheet.animations.bounce;
// No uvTransform: a framed base colour texture sets it from the frame, and one you set would win over the frame.
const screenMaterial = new FlatMaterial({
  baseColorTexture: frames[0],
  fog: false,
});
const screenFace = new Mesh3D({
  geometry: new PlaneGeometry({ ...SCREEN_SIZE, flipV: true }),
  material: screenMaterial,
  castShadow: false,
});

view3d.root.addChild(
  createBelt({ face: beltFace, ...BELT_SIZE }),
  createMonitor({ face: screenFace, ...SCREEN_SIZE }),
);

const visuals = createVisuals({
  app,
  view3d,
  stage,
  beltFace,
  beltWidth: BELT_SIZE.width,
});

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3, 9.6);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.9, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 14,
  // The band and the screen are one-sided, so the camera stays in front of them and above the target.
  maxPolarAngle: Math.PI / 2,
  minAzimuthAngle: -1,
  maxAzimuthAngle: 1,
});

// A portrait screen is narrower than the belt, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

/** What the pane sets; none of it is an engine property, so the tick turns it into one */
const settings = {
  /** Copies of the texture the belt's picture moves a second */
  scrollSpeed: 0.4,
  /** Copies of the texture across the belt */
  tiling: TILING,
  /** Atlas frames the screen shows a second */
  frameRate: 8,
  /** Whether the screen shows the whole atlas instead of one frame */
  wholeAtlas: false,
};
const pane = new ThemePane({ title: 'UV transform', stage });

pane.addBinding(settings, 'scrollSpeed', {
  label: 'Scroll speed',
  min: -1,
  max: 1,
  step: 0.05,
});
pane.addBinding(settings, 'tiling', {
  label: 'Tiling',
  min: 0.5,
  max: 6,
  step: 0.01,
});
const frameRateRow = pane.addBinding(settings, 'frameRate', {
  label: 'Frame rate',
  min: 0,
  max: 24,
  step: 1,
});

// The whole atlas has no frames to step through, so Frame rate greys out while it shows.
pane
  .addBinding(settings, 'wholeAtlas', { label: 'Whole atlas' })
  .on('change', ({ value }) => {
    frameRateRow.disabled = value;
  });

// The material copies the matrix it's given, so one scratch matrix serves every tick.
const uv = new Matrix();
let scroll = 0;
let frameClock = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  // The translate comes after the scale, so it isn't scaled: it counts copies of the texture, and 1 is one tile at any
  // tiling. A growing offset reads further along the texture, so the picture slides the other way. Every 1 shows the
  // same picture on a repeating texture, so wrapping changes nothing on screen and keeps the offset small, where the
  // shader's floats stay precise.
  scroll += settings.scrollSpeed * dt;
  scroll -= Math.floor(scroll);
  beltMaterial.uvTransform = uv
    .identity()
    .scale(settings.tiling, 1)
    .translate(scroll, 0);
  // Every frame shares the atlas's source, so a swap only rewrites the transform the frame sets; the same frame again
  // does nothing. The unframed atlas sets the identity, so the whole sheet fills the screen.
  if (!settings.wholeAtlas) frameClock += settings.frameRate * dt;
  screenMaterial.textures.baseColor = settings.wholeAtlas
    ? atlas
    : frames[Math.floor(frameClock) % frames.length];
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it. The view takes the
// screen's size only as it renders, so it renders once before the tags are placed against it.
orbit.update();
app.render();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
