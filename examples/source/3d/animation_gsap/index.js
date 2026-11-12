/**
 * GSAP tweens a node's position, rotation and scale, and a material's colour
 *
 * A Container3D's `position`, `rotation` and `scale` are objects with `x`, `y` and `z`, so GSAP animates them with no
 * plugin, and one timeline lines the tweens up. `from()` plays from the values it's given to where each piece already
 * sits, which is how the logo assembles itself; a ghost of the assembled logo marks where every tween ends while the
 * entrance plays. A colour goes through a stand-in: GSAP blends a CSS colour string channel by channel, and the frame
 * hands the result to the material. The entrance plays once when the page opens, then the logo holds still.
 *
 * Controls: drag to orbit; `ease` replays the entrance with another curve, `timeScale` replays it slower or faster,
 * and Replay plays it from the start. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Box, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { gsap } from 'gsap';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { EnamelMaterial } from './theme/EnamelMaterial';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, cssColor, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createVisuals } from './visuals';

// GSAP moves its tweens from its own requestAnimationFrame loop. Taken off that loop, updateRoot runs from the app's
// ticker instead, so every tween moves once a frame just before the frame draws, and holds still until the app starts.
gsap.ticker.remove(gsap.updateRoot);

/** The eases the pane offers, written as GSAP parses them */
const EASES = [
  'bounce.out',
  'back.out(1.7)',
  'elastic.out(1, 0.4)',
  'power3.out',
  'none',
];
/** Each tween's seconds: long enough to watch a bounce */
const DURATION = 0.9;
/** How far above its place a falling piece starts */
const DROP = 2.4;
/** The assembled logo's width: as wide as the frame holds with the raised pieces above it */
const LOGO_WIDTH = 4.6;
/** The logo's centre height, its lowest point a unit clear of the floor, so an elastic overshoot never sinks a piece */
const LOGO_HEIGHT = 1.9;
/** The narrowest view, width over height, that shows the raised pieces and the ghosts whole */
const FIT_ASPECT = 0.8;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Tweening with GSAP' });
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

// The screen's size from the start, so the first frame's label lands where its first render puts the logo.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });

// The shadow box fitted to the casters would stretch every frame as the pieces fall; one box over their whole path
// keeps the shadows still. It also takes in the floor behind and right of the logo, where the key throws the shadows:
// floor past the box's far side reads as lit.
stage.key.shadow.bounds = Box.fromCenterSize(
  { x: 1, y: 2.8, z: -1.6 },
  { x: 7, y: 5.4, z: 4.4 },
);

const logo = await loading.load(() =>
  loadPixiLogo({ width: LOGO_WIDTH, material: 'source' }),
);
// One material on every piece, so one colour write repaints the whole logo.
const enamel = new EnamelMaterial();

logo.setMaterial(enamel);
logo.root.position.y = LOGO_HEIGHT;
view3d.root.addChild(logo.root);
app.stage.addChild(view3d);

// Each piece hangs on a pivot at its own centre, so position, rotation and scale act about its middle.
const p = logo.pieces.p.pivot;
const ixi = logo.pieces.ixi.pivot;
const dotL = logo.pieces.dotL.pivot;
const dotR = logo.pieces.dotR.pivot;
const js = logo.pieces.js.pivot;

// baseColor reads back as one hex number, and tweening that number runs through unrelated colours. GSAP blends colour
// strings channel by channel, so it tweens this plain object, and each frame hands the result on.
const paint = { color: cssColor(BRAND.logoFace) };
let painted = '';

// Every frame rather than in an onUpdate, since revert() and the start values from() writes fire no callbacks.
function applyPaint() {
  if (paint.color === painted) return;
  painted = paint.color;
  enamel.baseColor = painted;
}

// from() plays from the values it's given to where each piece sits now: the assembled logo. A position parameter
// like '<0.3' starts a tween 0.3 s after the one before it starts.
function buildEntrance(ease, timeScale) {
  return gsap
    .timeline({ defaults: { duration: DURATION, ease } })
    .from(p.position, { y: `+=${DROP}` })
    .from(ixi.position, { y: `+=${DROP}` }, '<0.3')
    .from([dotL.scale, dotR.scale], { x: 0, y: 0, z: 0 }, '<0.6')
    .from(js.rotation, { z: -Math.PI }, '<0.4')
    .from(paint, { color: cssColor(BRAND.sky) }, '<0.5')
    .timeScale(timeScale);
}

let entrance = buildEntrance(EASES[0], 1);

// A new ease means a new timeline. revert() first puts every piece back where from() found it, so the new from()
// tweens end on the assembled logo again rather than wherever the old ones had got to.
function playEntrance(ease, timeScale) {
  entrance.revert();
  entrance = buildEntrance(ease, timeScale);
}

// from() holds its start values until GSAP's next update, so the logo is still assembled here: the pose the ghosts
// copy, and where every entrance ends.
const visuals = createVisuals({ app, view3d, stage, logo });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.3, 10.2);

const orbit = new OrbitCamera({
  view: view3d,
  // Nearly level and a little high, so a fall reads as straight down and the raised pieces stay in view.
  target: { x: 0, y: 2.55, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 18,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the logo, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Tweening with GSAP', stage });
const settings = { ease: EASES[0], timeScale: 1 };

pane
  .addBinding(settings, 'ease', {
    options: Object.fromEntries(EASES.map((ease) => [ease, ease])),
  })
  .on('change', ({ value }) => playEntrance(value, settings.timeScale));
pane
  .addBinding(settings, 'timeScale', { min: 0.1, max: 2 })
  .on('change', ({ value }) => {
    entrance.timeScale(value);
    // A finished entrance shows no speed, so a new timeScale plays it again; one still playing changes pace mid-flight.
    if (entrance.progress() === 1) entrance.restart();
  });
pane.addButton({ title: 'Replay' }).on('click', () => entrance.restart());

let elapsed = 0;

function step(dt) {
  // updateRoot takes GSAP's own time in seconds, which starts at 0 as this does.
  elapsed += dt;
  gsap.updateRoot(elapsed);
  applyPaint();
  stage.update(dt);
  visuals.update(entrance.progress());
}

app.ticker.add((ticker) => step(Math.min(ticker.deltaMS / 1000, 1 / 15)));

// from() writes its start values on GSAP's next update, so the first frame runs one, with no time passed, before it
// draws. The canvas joins with that frame drawn, and the bounce starts once the loading screen is gone.
orbit.update();
step(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
