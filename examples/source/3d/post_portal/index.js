/**
 * A texture portal: a second camera draws the far side into a render texture, and the opening shows it
 *
 * `PortalPass` stands its own camera, `portal.camera`, behind `exit` exactly as the view's camera stands before
 * `entry`, and draws the scene from there into `feed`, a `RenderTexture` the size of the view. `PortalMaterial` shows
 * the feed on the entry at each pixel's own screen position, so the far side lines up with the frame and slides past
 * it as you move: an opening, not a picture. The far side is ordinary geometry in the same scene, 30 under the floor.
 * The card at the bottom right shows the whole feed, so the opening reads as the part of it behind the doorway.
 *
 * Controls: drag to orbit and watch the far side slide past the frame, or walk behind the door; scroll to zoom. The
 * pane swaps the opening's material for a plain picture of the feed, changes its shape and turns the exit. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { FlatMaterial, Mesh3D, View3D } from '@pixi/3d';
import { OrbitCamera, PortalMaterial, PortalPass } from '@pixi/3d/extras';
import { Application, RenderTexture } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createFarWorld } from './farWorld';
import { createDoorway } from './scene';

import { createVisuals } from './visuals';

const TITLE = 'Portals';
/** The narrowest view, width over height, that shows the doorway whole and clear of the feed card in its corner */
const FIT_ASPECT = 1;
/** Far enough under the floor that the far world's dome, 22 in radius, stays below it */
const FAR_Y = -30;

/** How the entry shows the feed: as an opening, or as a plain picture for the contrast */

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

const view3d = new View3D({ autoResize: true });
const stage = new ThemeStage(view3d, { theme });
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();
const doorway = createDoorway();
const farWorld = await loading.load(() =>
  createFarWorld({ at: FAR_Y, darkness: 1 - stage.darkness }),
);

app.stage.addChild(view3d);

// 1. The feed. The material maps a pixel's screen position straight onto it, so it has the view's size: another
// aspect would stretch the far side, and fewer pixels would blur it.
const feed = RenderTexture.create({
  width: app.screen.width,
  height: app.screen.height,
  resolution: app.renderer.resolution,
});

// The renderer's resize event fires before the view adopts the new size, so the feed sizes from the screen.
app.renderer.on('resize', () =>
  feed.resize(app.screen.width, app.screen.height, app.renderer.resolution),
);

// 2. Two ways to show the feed on the opening. The portal's reads it at each pixel's screen position. The poster's is
// a plain picture on the opening's own UVs, for the contrast: the whole frame squeezed in, riding on the door.
const portalMaterial = new PortalMaterial({ texture: feed });
const posterMaterial = new FlatMaterial({ baseColorTexture: feed });

// 3. The entry faces its local +z, the plane's own front, so it needs no turn. No shadow: the opening is a hole.
const entry = new Mesh3D({
  geometry: doorway.openings.door,
  material: portalMaterial,
  castShadow: false,
});

// 4. Only the exit's pose counts: the portal camera cuts the exit itself away, and the floor hides it from the view.
// Its +z faces the room it shows, so turned round, the far room lies the same way through the door as the floor here.
const exit = new Mesh3D({
  geometry: doorway.openings.door,
  material: new FlatMaterial(),
  castShadow: false,
  y: FAR_Y,
  angle: { x: 0, y: 180, z: 0 },
});

view3d.root.addChild(doorway.root, entry, farWorld.root, exit);

// 5. Each frame the entry is in view, the pass poses its camera and draws the far side into the feed, before the
// scene draws the entry. From behind the door it skips, and the feed keeps its last picture. Its camera clips away
// everything on its own side of the exit's plane and draws no sky, so as you orbit, part of the feed comes out empty,
// black in the card. The opening never shows that part: every ray through the doorway crosses the plane.
const portal = new PortalPass({ entry, exit, texture: feed });

view3d.passes = [portal];

/** The opening is only the entry's geometry: the pass, its camera and the feed don't change */
function setShape(shape) {
  entry.geometry = doorway.openings[shape];
  doorway.showFrame(shape);
}

/** The same feed either way; only how the entry maps it changes */
function setSurface(surface) {
  entry.material = surface === 'portal' ? portalMaterial : posterMaterial;
}

view3d.camera.fov = 40;
// farWorld.ts puts the logo on the line from this pose through the doorway's middle, so it shows centred at rest.
view3d.camera.position.set(1.1, 3.1, 9.2);

// Pan stays off, so the orbit keeps the doorway in the middle; the azimuth is free, so a reader can walk behind it.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.7, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6.5,
  maxDistance: 16,
  minPolarAngle: Math.PI * 0.3,
  maxPolarAngle: Math.PI * 0.47,
});

// A portrait screen is narrower than the doorway and its card, so the camera and the fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const visuals = createVisuals({ app, stage, feed });

const pane = new ThemePane({ title: TITLE, stage });
const params = { surface: 'portal', shape: 'door' };

pane
  .addBinding(params, 'surface', {
    label: 'entry.material',
    options: { PortalMaterial: 'portal', FlatMaterial: 'poster' },
  })
  .on('change', ({ value }) => setSurface(value));
pane
  .addBinding(params, 'shape', {
    options: { door: 'door', arch: 'arch', round: 'round' },
  })
  .on('change', ({ value }) => setShape(value));
pane.addBinding(exit.angle, 'y', {
  label: 'exit.angle.y',
  min: 135,
  max: 225,
  step: 1,
});

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  farWorld.update(time);
  // The far world is always the other theme, so the opening reads on both.
  farWorld.setDarkness(1 - stage.darkness);
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, the feed with it, then the loading screen dissolves onto it.
orbit.update();
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
