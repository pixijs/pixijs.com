/**
 * Second cameras: a `Camera3D` that draws the scene into a texture, for a security monitor, a minimap and split screen
 *
 * Any camera in the view's scene can draw it again, but only while a pass names it: `new MeshPass({ name: 'opaque',
 * camera })` in `view3d.passes` redraws the opaque meshes from that camera every frame. Give the camera a
 * `renderTexture` and its picture lands in that texture instead of on screen, holding what its view volume holds. The
 * texture is an ordinary pixi texture: a material's `baseColorTexture` shows it on a mesh, and a `Sprite` shows it in
 * 2D. `camera.viewport` is the rect of the view a camera fills, which is how split screen narrows the view's own
 * camera to one half.
 *
 * Controls: drag to orbit; the pane turns split screen on, moves the security camera, resizes its feed and turns its
 * pass off. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Camera3D, FlatMaterial, MeshPass, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, RenderTexture, Sprite } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { createMonitor } from './theme/monitor';
import { NARROW_BELOW } from './theme/overlay';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import {
  createCameraHead,
  createCameraPost,
  createWalker,
  createYard,
} from './scene';
import { createVisuals } from './visuals';

const TITLE = 'Second cameras';
/** The narrowest view, width over height, that shows the monitor, the yard and the footprint whole */
const FIT_ASPECT = 1.42;
/** The minimap's size and its gap to the screen's bottom-right corner, in px; smaller on a phone either way up */
const MAP = { margin: 28, width: 192, height: 120 };
const NARROW_MAP = { margin: 16, width: 120, height: 75 };
/** Where the security camera looks: steeply down, so its picture is all floor, and just past the walker's lap */
const CAMERA_AIM = { x: 1.6, y: 0, z: -0.9 };

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

// At the screen's size from the start, so the first frame's frustum and tags are measured for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });

app.stage.addChild(view3d);
createYard(view3d.root);

const walker = createWalker(view3d.root);
const post = createCameraPost(view3d.root);

// The security camera draws into `feed`. Its projection takes the texture's 4:3 aspect, so the screen is 4:3 too.
// `resolution: 1` keeps it 320 × 240 texels on any screen; the map and player two's feed follow the screen's pixels.
const feed = RenderTexture.create({ width: 320, height: 240, resolution: 1 });
// High on its post with a narrow lens, so its footprint covers the yard and ends not far past it. The head is built
// round the camera's eye, so `near` sits just past its lens and the camera never films its own head.
const securityCamera = new Camera3D({
  fov: 34,
  near: 0.5,
  far: 40,
  renderTexture: feed,
  position: { x: -1, y: 3.8, z: -0.4 },
  children: [createCameraHead()],
  parent: view3d.root,
});
// Redraws the opaque meshes from securityCamera. See-through ones need a second pass that sorts them back to front:
// `new MeshPass({ name: 'transparent', camera: securityCamera, sort: 'distance' })`.
const feedPass = new MeshPass({ name: 'opaque', camera: securityCamera });

// Aimed once: the pane moves only its position, so it keeps this heading wherever it stands.
securityCamera.lookAt(CAMERA_AIM);
post.standUnder(securityCamera.position);

// Unlit and unfogged, so the screen shows the picture exactly as the camera drew it. A render texture stores its rows
// top-down, as an image does, so the screen puts v = 0 on its top edge.
const monitor = createMonitor({
  material: new FlatMaterial({ baseColorTexture: feed, fog: false }),
  width: 2.8,
  aspect: feed.width / feed.height,
  flipV: true,
});

// Left of the yard, turned toward the viewer.
monitor.root.position.set(-3.4, 1.9, 0.4);
monitor.root.rotation.y = 0.35;
view3d.root.addChild(monitor.root);

// A texture made without `antialias` draws without multisampling, so the map draws at twice the screen's pixels and
// the Sprite shows it at half, which smooths the edges in it. placeMinimap sizes it. A Sprite follows a resized texture only
// when the texture is dynamic; the monitor needs nothing, since it samples `feed` through its UVs.
const mapTexture = RenderTexture.create({
  width: 1,
  height: 1,
  resolution: app.renderer.resolution * 2,
  dynamic: true,
});
// Straight down, so its up is -z and the map reads the way the main view does.
const mapCamera = new Camera3D({
  mode: 'orthographic',
  orthographicSize: 4.2,
  near: 1,
  far: 20,
  renderTexture: mapTexture,
  position: { x: -1.1, y: 10, z: -0.2 },
  rotation: { x: -Math.PI / 2, y: 0, z: 0 },
  parent: view3d.root,
});
const mapPass = new MeshPass({ name: 'opaque', camera: mapCamera });
// The texture is a pixi texture like any other, so a Sprite shows it. It takes pointer events, so a drag that starts
// on the map doesn't orbit the view.
const minimap = new Sprite({ texture: mapTexture, eventMode: 'static' });

/**
 * Places the minimap in the bottom-right corner, below the pane, and sizes its texture to the px it covers, so it stays
 * twice the screen's pixels on a phone
 */
function placeMinimap() {
  const { width: screenWidth, height: screenHeight } = app.screen;
  const { margin, width, height } =
    Math.min(screenWidth, screenHeight) < NARROW_BELOW ? NARROW_MAP : MAP;

  minimap.position.set(
    screenWidth - width - margin,
    screenHeight - height - margin,
  );
  mapTexture.resize(width, height);
}

view3d.camera.fov = 40;
view3d.camera.position.set(-0.7, 3.4, 11);

// The target is the middle of the row from the monitor to the footprint, so a narrow view backs off along it.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: -0.7, y: 1, z: 0.2 },
  enableDamping: true,
  enablePan: false,
  minDistance: 7,
  maxDistance: 18,
  maxPolarAngle: Math.PI * 0.45,
});
// A phone, or half a split, is narrower than the row, so the camera and the fog back off until it fits.
const fit = fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: FIT_ASPECT,
});

// Player two's picture fills the other half of a split; setSplitScreen sizes it. Like the map it has no multisampling,
// so it draws at least two texels per px to smooth its edges. A phone's screen already has two px or more per CSS px, and
// half a screen at twice that again costs too much there.
const playerTwoFeed = RenderTexture.create({
  width: 1,
  height: 1,
  resolution: Math.max(app.renderer.resolution, 2),
  dynamic: true,
});
// Player two rides high behind the walker, above the security camera's post. As the walker's child it turns with it,
// so one aim holds for the whole lap.
const playerTwo = new Camera3D({
  fov: 40,
  far: 60,
  renderTexture: playerTwoFeed,
  position: { x: 0, y: 6.5, z: -2.2 },
  parent: walker.root,
});
const playerTwoPass = new MeshPass({
  name: 'opaque',
  camera: playerTwo,
  enabled: false,
});
// Over the other half, taking its pointer events, so a drag there doesn't orbit player one's camera.
const playerTwoScreen = new Sprite({
  texture: playerTwoFeed,
  eventMode: 'static',
  visible: false,
});

walker.walk(0);
playerTwo.lookAt(walker.root.toGlobal({ x: 0, y: 0, z: 1.6 }));

/**
 * Narrows the view's own camera to one half and fills the other with player two's picture. Player one, the half the
 * reader orbits, takes the half away from the pane in the top-right corner: the left side by side, the bottom stacked.
 * A pass camera without a texture can only draw inside the view camera's rect, over its picture, so player two draws
 * into a texture of its own.
 */
function setSplitScreen(on) {
  const { width, height } = app.screen;
  const sideBySide = width > height;
  const stacked = on && !sideBySide;

  view3d.camera.viewport.set(
    0,
    stacked ? 0.5 : 0,
    on && sideBySide ? 0.5 : 1,
    stacked ? 0.5 : 1,
  );
  if (on)
    playerTwoFeed.resize(
      sideBySide ? width / 2 : width,
      sideBySide ? height : height / 2,
    );
  playerTwoScreen.position.set(sideBySide ? width / 2 : 0, 0);
  playerTwoScreen.visible = on;
  playerTwoPass.enabled = on;
  // Half the screen has no room for the map too, so it hides and its camera stops drawing.
  minimap.visible = mapPass.enabled = !on;
  // Player one's camera refits to the rect it now fills.
  fit.refit();
}

// A camera draws only while a pass in this list names it.
view3d.passes = [feedPass, mapPass, playerTwoPass];
app.stage.addChild(minimap, playerTwoScreen);

const visuals = createVisuals({ app, view3d, stage, securityCamera, minimap });

createControls({
  pane: new ThemePane({ title: TITLE, stage }),
  securityCamera,
  feed,
  feedPass,
  post,
  setSplitScreen,
  // Fewer texels, so the monitor's picture goes soft; the camera follows on the next frame.
  resizeFeed: (width, height) => feed.resize(width, height),
});

app.renderer.on('resize', () => {
  placeMinimap();
  setSplitScreen(playerTwoPass.enabled);
});

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  walker.walk(time);
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
placeMinimap();
orbit.update();
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
