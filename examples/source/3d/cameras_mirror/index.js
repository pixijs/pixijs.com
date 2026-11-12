/**
 * A planar mirror: a second camera under the glass, drawing into a render texture that the glass shows
 *
 * `mirrorCamera` stands as far below the mirror as `view3d.camera` stands above it, through the same lens, and draws
 * the scene into `feed`, a `RenderTexture` the size of the screen, through `MeshPass`es that name it. Its
 * `clippingPlane` is the glass, so it skips everything on its own side of the mirror. `MirrorMaterial` puts the feed
 * on the glass, read at each pixel's own place on the screen and flipped top to bottom.
 *
 * Controls: drag to orbit, and the side view shows `mirrorCamera` follow under the glass; the pane sets the feed's
 * `resolution` and reads out its share of the screen's pixels, sets the glass's `baseColor`, and turns `clippingPlane`
 * off. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import {
  Camera3D,
  Matrix4,
  Mesh3D,
  MeshPass,
  Plane,
  PlaneGeometry,
  Spherical,
  Vector3,
  View3D,
} from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, DEG_TO_RAD, RenderTexture } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, mixColor, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createLayout } from './layout';
import { MirrorMaterial } from './MirrorMaterial';
import { createStand } from './scene';
import { SkyPass } from './SkyPass';
import { createVisuals } from './visuals';

const TITLE = 'Planar mirror';
/** The glass's height: the top of the clay stand it lies on */
const MIRROR_Y = 0.36;
/** Where the logo floats, a little over the glass */
const LOGO_Y = MIRROR_Y + 1.15;
/** From just behind the logo toward the camera, deep enough to hold the reflection from the lowest the camera goes */
const GLASS = { width: 4.9, depth: 6.3, z: 1.5 };
/** One feed texel per CSS px: crisp on a desktop, and a quarter of the pixels on a phone, where fill costs most */
const FEED_RESOLUTION = 1;
/** A faint sky tint, so the glass reads as a surface on a white floor */
const MIRROR_TINT = mixColor(BRAND.white, BRAND.sky, 0.12);
/** 12 from the target and 17° above the floor: low, since a floor mirror seen from high up reflects only the sky */
const CAMERA = { distance: 12, polar: 73 * DEG_TO_RAD };
/**
 * How far a drag tilts the view, from straight above: any higher and the glass reflects little but sky, any lower and
 * the reflection runs off the glass's near edge, which GLASS.depth sets
 */
const TILT = { min: Math.PI * 0.38, max: Math.PI * 0.43 };
/** Just under the logo, so the logo sits over the middle of the screen with its reflection under it */
const TARGET = { x: 0, y: 0.6, z: 0 };

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

// At the screen's size from the start, so the side view draws the camera's first frame at the right aspect.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// The fog starts past the stand's far end, so the scene and its reflection stay clear of it.
const stage = new ThemeStage(view3d, { theme, fog: { near: 14, far: 46 } });
const logo = await loading.load(() => loadPixiLogo());
const stand = createStand({
  parent: view3d.root,
  glass: GLASS,
  height: MIRROR_Y,
});

app.stage.addChild(view3d);
logo.root.position.set(0, LOGO_Y, 0);
view3d.root.addChild(logo.root);

// 1. The feed: a render texture the screen's size, since the glass reads it at each pixel's own screen position. It
// resizes in place with the screen, and `dynamic` makes a sprite that shows it follow the new size.
const feed = RenderTexture.create({
  width: app.screen.width,
  height: app.screen.height,
  resolution: FEED_RESOLUTION,
  dynamic: true,
});

// 2. The mirror camera draws into the feed, and its clipping plane, set each frame, cuts its view at the glass.
const clipPlane = new Plane();
const mirrorCamera = new Camera3D({
  renderTexture: feed,
  clippingPlane: clipPlane,
  parent: view3d.root,
});

// A second camera draws only through passes that name it: the sky, the opaque meshes, then the see-through ones
// sorted back to front, as the view's own camera draws them.
view3d.passes = [
  new SkyPass(mirrorCamera),
  new MeshPass({ name: 'opaque', camera: mirrorCamera }),
  new MeshPass({ name: 'transparent', camera: mirrorCamera, sort: 'distance' }),
];

// 3. The glass shows the feed.
const mirrorMaterial = new MirrorMaterial({
  texture: feed,
  baseColor: MIRROR_TINT,
});
const mirror = new Mesh3D({
  geometry: new PlaneGeometry({ width: GLASS.width, height: GLASS.depth }),
  material: mirrorMaterial,
  castShadow: false,
  // A plane faces +z; this lays it face up.
  rotation: { x: -Math.PI / 2, y: 0, z: 0 },
  position: { x: 0, y: MIRROR_Y, z: GLASS.z },
  parent: view3d.root,
});
const mirrorPlane = new Plane().setFromNormalAndCoplanarPoint(
  { x: 0, y: 1, z: 0 },
  mirror.position,
);
const _aim = new Vector3();
const _world = new Matrix4();
const _view = new Matrix4();

/** Stands the mirror camera as far under the glass as the view's camera is over it, and cuts its view at the glass */
function poseMirrorCamera() {
  const eye = view3d.camera.position;
  const h = eye.y - MIRROR_Y;
  const { x, y, width, height } = view3d.camera.viewport;

  mirrorCamera.position.set(eye.x, MIRROR_Y - h, eye.z);
  // Through the same lens: its angle, and its viewport turned over as the glass turns the feed over, so the feed lines
  // up with the screen pixel for pixel.
  mirrorCamera.fov = view3d.camera.fov;
  mirrorCamera.viewport.set(x, 1 - y - height, width, height);
  // Upright and aimed at the target's reflection, it sees the real world from the reflected eye, the right way up.
  // A reflection is that picture upside down, so the glass turns it over. That's exact for a camera that never rolls,
  // as an orbit's never does.
  mirrorCamera.lookAt(_aim.set(TARGET.x, 2 * MIRROR_Y - TARGET.y, TARGET.z));
  // clippingPlane is in the camera's own view space, so the glass's plane moves there as the camera does. It goes
  // through the pose just set rather than `mirrorCamera.view`, which the view rebuilds at render, so right after
  // lookAt it still holds last frame's pose. `portalExitClipPlane` in `@pixi/3d/extras` does both steps for a portal.
  mirrorPlane.applyMatrix4(
    _view.getInverse(mirrorCamera.getGlobalTransform(_world)),
    clipPlane,
  );
}

view3d.camera.position
  .setFromSpherical(new Spherical(CAMERA.distance, CAMERA.polar, 0))
  .add(TARGET);

const orbit = new OrbitCamera({
  view: view3d,
  target: TARGET,
  enableDamping: true,
  enablePan: false,
  // A fixed distance keeps the side view's scale, so the cameras' rise and fall shows as movement.
  enableZoom: false,
  // Updated in the ticker, ahead of the mirror camera, so the reflection never trails the view by a frame.
  autoUpdate: false,
  minPolarAngle: TILT.min,
  maxPolarAngle: TILT.max,
});
const params = { resolution: FEED_RESOLUTION, clippingPlane: true, pixels: '' };

/** The feed follows the screen's size at `params.resolution` texels per CSS px, and `pixels` reads out what it costs */
function resizeFeed() {
  feed.resize(app.screen.width, app.screen.height, params.resolution);
  // The screen draws `renderer.resolution` px per CSS px a side, so the feed's share of its pixels is their ratio
  // squared.
  const share = (params.resolution / app.renderer.resolution) ** 2;

  params.pixels = `${share >= 1 ? 'all' : `1/${Math.round(1 / share)}`} of the screen's`;
}

app.renderer.on('resize', resizeFeed);

const pane = new ThemePane({ title: TITLE, stage });

pane
  .addBinding(params, 'resolution', {
    options: { 1: 1, '1/2': 0.5, '1/4': 0.25, '1/8': 0.125 },
  })
  .on('change', resizeFeed);
pane.addBinding(params, 'pixels', { readonly: true });
pane.addBinding(mirrorMaterial, 'baseColor', { view: 'color' });
pane.addBinding(params, 'clippingPlane').on('change', () => {
  mirrorCamera.clippingPlane = params.clippingPlane ? clipPlane : null;
});

// The lens fits the screen and leaves the panels room on the right, under the pane: wider on a narrow screen, shifted
// left on a short one, and wider still where that isn't enough.
const layout = createLayout({
  orbit,
  renderer: app.renderer,
  pane,
  logo,
  stand,
});
const visuals = createVisuals({
  app,
  view3d,
  stage,
  orbit,
  logo,
  stand,
  layout,
  mirror,
  mirrorCamera,
  feed,
});
let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  orbit.update(ticker);
  logo.root.rotation.y = 0.3 * Math.sin(0.4 * time);
  logo.root.position.y = LOGO_Y + 0.08 * Math.sin(0.9 * time);
  // After the orbit, so the mirror camera follows this frame's view.
  poseMirrorCamera();
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
resizeFeed();
orbit.update();
poseMirrorCamera();
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
