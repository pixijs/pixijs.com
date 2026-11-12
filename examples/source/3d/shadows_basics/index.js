/**
 * Shadows: the flags that make one, the shadow map's size and filter, and the two biases that keep it clean
 *
 * A shadow is light a mesh blocks: the light needs `castShadow`, the mesh in the way `castShadow`, and the surface it
 * falls on `receiveShadow`. The light draws the scene's depth into a picture, the shadow map: `view3d.shadowQuality`
 * sets its size, `view3d.shadowFilter` how many reads soften each edge, and `light.shadow.bias` and `normalBias` keep
 * a surface from shadowing itself without lifting the shadow off its caster. The `up close` inset magnifies the
 * shadow's edge on the wall, where the filter, the map's size and the biases show.
 *
 * Controls: drag to orbit; the pane picks the sun or the spot and stops its sway, and sets each light's `castShadow`
 * and biases, the logo's `castShadow`, the wall's `receiveShadow`, and the map's size and filter. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { DirectionalLight, Mesh3D, SpotLight, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { clayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { NARROW_BELOW } from './theme/overlay';
import { THEMES, themeFromUrl } from './theme/palette';
import { roundedBox } from './theme/shapes';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';

import { createProps, swayOffset } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the wall and the plinth whole from the landscape distance */
const FIT_ASPECT = 0.96;
/**
 * The share of the landscape view's height a narrow screen's band keeps: twice the plinth's reach below the orbit
 * target, which is further than the wall's reach above it
 */
const FIT_HEIGHT = 0.57;
/** The space kept between the scene and the pane or the loupe's title tag, in px */
const CLEAR_GAP = 24;
/**
 * Below this height the open pane, about 410 px tall, and the loupe don't both fit down the right side. The loupe then
 * takes the top-right corner and the pane hangs under it, so opening the pane never covers the loupe.
 */
const SHORT_BELOW = 600;
/** The gap between the loupe and the pane under it, as between the kit's stacked panels, in px */
const STACK_GAP = 8;
/** About 7² the sun, since a spot dims with distance squared and the wall is 7 off; kept at night, like a stage lamp */
const SPOT_INTENSITY = 100;
/** The sun stands up, left and in front, aimed at the origin, so shadows fall back and to the right */
const SUN_HOME = { x: -4, y: 9.5, z: 9 };
const SUN_AIM = { x: 0, y: 0, z: 0 };
/** The spot hangs above and in front of the logo, aimed at the middle of the logo's shadow on the wall */
const SPOT_HOME = { x: -0.2, y: 4.9, z: 5.6 };
const SPOT_AIM = { x: 0, y: 1.8, z: -0.8 };

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Shadows' });
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

// At the screen's size from the start, so the first frame's labels and the loupe's outline are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });

app.stage.addChild(view3d);
// This lesson builds its own lights in the stage key's colour, so the key, which casts shadows, steps aside.
stage.key.visible = false;

// The map's side doubles with each step: 'low' 512 texels (1 MB), 'medium' 1024 (4 MB), 'high' 2048 (16 MB), 'ultra'
// 4096 (64 MB). A bigger map makes each texel smaller, and so each stair step along a hard edge. The filter reads the
// map once a pixel ('hard'), 4 times ('pcf') or 9 ('pcf-high'), blending the stair steps into a soft edge; changing it
// recompiles every lit material. Both are the engine's defaults, written out after the stage, which picks 'pcf-high'.
view3d.shadowQuality = 'medium';
view3d.shadowFilter = 'pcf';

// bias moves each depth test back by a share of the map's depth range. At 0 a surface that both casts and receives
// shadows itself in stripes, shadow acne; too much lifts a contact shadow off its caster's foot, peter-panning. The
// sphere's lets go from about 0.02 under the sun; under the spot the props' contact shadows fall behind them, out of
// the camera's sight. The value here is the engine's default, written out so the pane has a number to move.
// normalBias pushes the lookup along the surface's normal, scaled by 1 − N·L, so it clears the wall's stripes without
// moving the shadow but barely moves a face that points at the light. Left unset ('auto' in the pane), the engine
// sizes it: three texels for a sun, so it follows shadowQuality, and 0.15 world units for a spot.
const shadow = { bias: 0.001 };
const sun = new DirectionalLight({
  color: stage.key.color,
  castShadow: true,
  shadow,
  position: SUN_HOME,
  parent: view3d.root,
});

// A sun's shadow depends only on which way it points.
sun.lookAt(SUN_AIM);

// A spot's shadow is one perspective map over its cone, from 1 unit out, so keep coneAngle well under 90°. At 36° with
// penumbra 0.2 it's at full strength out to 28.8°, which covers the logo and its whole shadow on the wall.
const spot = new SpotLight({
  color: stage.key.color,
  intensity: SPOT_INTENSITY,
  coneAngle: 36,
  penumbra: 0.2,
  castShadow: true,
  shadow,
  position: SPOT_HOME,
  visible: false,
  parent: view3d.root,
});

spot.lookAt(SPOT_AIM);

// The logo receives no shadows (the kit's default), so nothing darkens its face.
const logo = await loading.load(() =>
  loadPixiLogo({ width: 3.4, castShadow: true }),
);

logo.root.position.set(-0.2, 3, 1);
view3d.root.addChild(logo.root);

// A mesh casts and receives by default; the wall's flags are written out since they're the lesson. A surface can only
// shadow itself if it's drawn into the shadow map, so shadow acne needs meshes that do both. The stage's floor only
// receives, so it never shows acne.
const wall = new Mesh3D({
  geometry: roundedBox(6.4, 3.6, 0.3, 0.08),
  material: clayMaterial('paleSky'),
  castShadow: true,
  receiveShadow: true,
  position: { x: 0, y: 2.1, z: -0.95 },
  parent: view3d.root,
});
const { plinth, sphere } = createProps(view3d.root);

/** Lights the scene with one of the two; a hidden light lights nothing and casts nothing */
function useLight(name) {
  sun.visible = name === 'sun';
  spot.visible = name === 'spot';
}

function setLogoCastShadow(castShadow) {
  for (const mesh of logo.meshes) mesh.castShadow = castShadow;
}

function setWallReceiveShadow(receiveShadow) {
  wall.receiveShadow = receiveShadow;
  // The wall's shader keeps or drops its shadow lookup, so the mesh has to rebuild.
  wall.invalidate();
}

// Only on a screen 600 px wide or more: a narrower one's loupe spans the bottom, whatever its corner.
const short =
  app.screen.width >= NARROW_BELOW && app.screen.height < SHORT_BELOW;
const visuals = createVisuals({
  app,
  view3d,
  stage,
  sun,
  spot,
  logo,
  wall,
  plinth,
  sphere,
  loupeCorner: short ? 'top-right' : 'bottom-right',
});

view3d.camera.fov = 40;
// Back far enough that on a 4:3 screen the wall clears the pane's column.
view3d.camera.position.set(0, 4.76, 13.8);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 2, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 8,
  maxDistance: 18,
  // Stays above the floor, and in front of the wall, where its shadows are.
  maxPolarAngle: Math.PI * 0.48,
  minAzimuthAngle: -Math.PI / 3,
  maxAzimuthAngle: Math.PI / 3,
});

// A portrait screen is narrower than the wall and plinth, so the camera and the fog back off until they fit, centred
// in the band between the pane and the loupe once both are measured, below.
const fit = fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: FIT_ASPECT,
  minHeight: FIT_HEIGHT,
});

// The loupe docks as it's built, so on a short screen the pane can start under it.
const pane = new ThemePane({
  title: 'Shadows',
  stage,
  top: short ? visuals.loupe.rect.bottom + STACK_GAP : undefined,
});
const motion = { moveLight: true };

createControls({
  pane,
  view3d,
  sun,
  spot,
  logo,
  wall,
  motion,
  useLight,
  setLogoCastShadow,
  setWallReceiveShadow,
});

let time = 0;

function tick(dt) {
  if (motion.moveLight) time += dt;
  // The idle sway: each light slides along x about its home and stays aimed, so its shadows drift.
  sun.position.x = SUN_HOME.x + swayOffset('sun', time);
  sun.lookAt(SUN_AIM);
  spot.position.x = SPOT_HOME.x + swayOffset('spot', time);
  spot.lookAt(SPOT_AIM);
  stage.update(dt);
  // The stage fades its key light with the theme, and the sun takes the key's place.
  sun.intensity = stage.key.intensity;
  visuals.update(dt);
}

app.ticker.add((ticker) => tick(Math.min(ticker.deltaMS / 1000, 1 / 15)));

/** Measures the band between the pane and the loupe, which a narrow screen's scene is centred in */
function fitBand() {
  // Docks the loupe for the screen as it is now: a phone turned upright moves it to the bottom.
  visuals.loupe.update();
  fit.clearTop = pane.element.getBoundingClientRect().bottom + CLEAR_GAP;
  fit.clearBottom = app.screen.height - visuals.loupe.rect.y + CLEAR_GAP;
  fit.refit();
}

fitBand();
app.renderer.on('resize', fitBand);
// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
tick(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
