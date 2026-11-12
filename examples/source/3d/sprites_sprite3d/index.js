/**
 * Sprites in 3D: a `Sprite3D` is a picture on a flat quad, sized from its texture and turned toward the camera
 *
 * One white wordmark texture makes three sprites. `pixelSize` turns texture pixels into world units, `anchor` picks the
 * point of the image that sits on `position`, and `tint` colours the white. `billboardMode` sets how each turns as the
 * camera moves: `'none'` stays as placed, `'cylindrical'` turns about its up axis, and `'spherical'` also tips to face
 * the lens square-on. It's a `Mesh3D` property, so the clay cubes in front turn the same way.
 *
 * Controls: drag to orbit and the wheel to zoom, and watch which sprites turn to follow you; the pane sets the
 * cutout's `pixelSize` and `tint`, shows its `width`, and sets the cubes' `billboardMode`. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Sprite3D, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { animateShapes, createShapes, createWordmarkTexture } from './scene';
import { createVisuals } from './visuals';

/** World units per texture pixel: the 767 px texture is 3.07 wide, about three floor checks */
const PIXEL_SIZE = 0.004;
/** Between the sprites: two billboards facing the camera never touch */
const SPACING = 4;
/** The marker floats, as an icon over a map does, low enough to stay under the pane on a 4:3 screen */
const MARKER_HEIGHT = 1.6;
/** Up to 3.45 wide: any wider and the cutout would meet its neighbours on screen */
const PIXEL_SIZE_RANGE = { min: 0.002, max: 0.0045, step: 0.0005 };
/** Between the sprites and the cubes, nudged right and up so the row sits left of the pane and under it */
const CAMERA_TARGET = { x: 0.6, y: 1.3, z: 1.6 };
/**
 * 45° above the floor and 8° left of straight on, 12.5 from the target: high enough that the cutout looks squat beside
 * the marker, and to the side, so the sign shows it kept its turn
 */
const CAMERA_POSITION = { x: -0.63, y: 10.14, z: 10.35 };
/** The narrowest view, width over height, that shows the row of three whole, the sign clear of a phone's edge */
const FIT_ASPECT = 1.6;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Sprites in 3D' });
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
// The camera stands farther back than the kit's, so the fog starts farther out.
const stage = new ThemeStage(view3d, { theme, fog: { near: 16, far: 44 } });

// Nothing here casts a shadow, so the key skips its shadow pass.
stage.key.castShadow = false;
app.stage.addChild(view3d);

// Any pixi Texture works, such as an Assets.load image. This is the kit's wordmark, white so a tint shows its colour.
const wordmark = createWordmarkTexture(app.renderer);

// Trees and crowd cutouts turn to face you but keep their feet planted. A Sprite3D doesn't cast a shadow by default:
// the shadow pass doesn't turn billboards, so it would cast the shadow of its unturned quad.
const cutout = new Sprite3D({
  texture: wordmark,
  pixelSize: PIXEL_SIZE,
  // y runs down the image, as on a 2D sprite, so 1 is the bottom edge and the cutout stands on its position.
  anchor: { x: 0.5, y: 1 },
  tint: BRAND.pink,
  billboardMode: 'cylindrical',
  parent: view3d.root,
});
// A sign stays as you place it: turned 20° to the right, it shows its edge as the camera swings away. A Sprite3D faces
// the camera unless told not to, so 'none' has to be written out.
const sign = new Sprite3D({
  texture: wordmark,
  pixelSize: PIXEL_SIZE,
  anchor: { x: 0.5, y: 1 },
  tint: BRAND.purple,
  billboardMode: 'none',
  position: { x: -SPACING, y: 0, z: 0 },
  angle: { x: 0, y: 20, z: 0 },
  parent: view3d.root,
});
// Glows and icons face the lens square-on. 'spherical' is Sprite3D's default, written out beside the other two. It
// turns about its middle, so it keeps the centred default anchor: an off-centre one would drift as the camera moves.
const marker = new Sprite3D({
  texture: wordmark,
  pixelSize: PIXEL_SIZE,
  tint: BRAND.sky,
  billboardMode: 'spherical',
  position: { x: SPACING, y: MARKER_HEIGHT, z: 0 },
  parent: view3d.root,
});

// billboardMode is a Mesh3D property, so any mesh turns the same way: 'cylindrical' replaces its turn about its up
// axis and 'spherical' its whole rotation, and both keep its scale. A Mesh3D's default is 'none', so the cubes spin at
// their own angles until this sets it.
const shapes = createShapes(view3d.root);

function setShapeBillboards(mode) {
  for (const shape of shapes) shape.billboardMode = mode;
}

setShapeBillboards('cylindrical');

const visuals = createVisuals({ app, view3d, stage, sign, cutout, marker });

view3d.camera.fov = 40;
view3d.camera.position.copyFrom(CAMERA_POSITION);

const orbit = new OrbitCamera({
  view: view3d,
  target: CAMERA_TARGET,
  enableDamping: true,
  enablePan: false,
  // Near enough to read one sprite, far enough to see the row whole.
  minDistance: 8,
  maxDistance: 20,
  // Short of straight down, and at most 0.47π, which keeps the camera 5° above the floor.
  minPolarAngle: 0.1,
  maxPolarAngle: Math.PI * 0.47,
});

// On a view narrower than the row of three, the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Sprites in 3D', stage });
const cutoutRows = pane.addFolder({ title: 'cutout · Sprite3D' });

cutoutRows.addBinding(cutout, 'pixelSize', {
  ...PIXEL_SIZE_RANGE,
  format: (v) => v.toFixed(4),
});
// Texture pixels × pixelSize, so the neighbours, still at 0.004, are the 3.07 it started at.
cutoutRows.addBinding(cutout, 'width', {
  readonly: true,
  format: (v) => v.toFixed(2),
});
cutoutRows.addBinding(cutout, 'tint', { view: 'color' });
// The cubes share one mode, so the row reads the first and writes all three.
pane
  .addFolder({ title: 'shapes · Mesh3D' })
  .addBinding(shapes[0], 'billboardMode', {
    options: {
      none: 'none',
      cylindrical: 'cylindrical',
      spherical: 'spherical',
    },
  })
  .on('change', ({ value }) => setShapeBillboards(value));

let elapsed = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  elapsed += dt;
  stage.update(dt);
  animateShapes(shapes, elapsed);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
