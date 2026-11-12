/**
 * Motion blur: `MotionBlurEffect` streaks each pixel along the way its surface moved on screen as the camera moved
 *
 * A `MotionBlurEffect` in `view3d.passes` makes the view write each pixel's velocity: how far the surface under it
 * moved on screen since this camera's previous render, from the camera's motion alone. The effect blurs each pixel
 * along that line. As the camera circles the logo, the posts nearest its path sweep across the screen fastest and
 * streak most, the far posts and the far floor drift the other way, and the logo at the orbit's centre barely moves on
 * screen, so it stays nearly sharp. Objects count as still, so the top spinning beside the logo never smears round,
 * however fast it turns, and the view's background has no velocity, so the sky never streaks. The inset draws the scene
 * through a `VelocityViewer`, which shows what the blur follows: hue is the way a surface moves on screen, brightness
 * how fast.
 *
 * Controls: drag to orbit by hand; the pane pauses the orbit and sets its speed, switches the effect, sets its
 * intensity, samples and longest streak, and brightens the inset. URL flags: `?theme=light|dark`,
 * `?renderer=webgl|webgpu`.
 */

import { Spherical, View3D } from '@pixi/3d';
import { MotionBlurEffect, OrbitCamera, VelocityViewer } from '@pixi/3d/extras';
import { Application, DEG_TO_RAD } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createScene, LOGO } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that keeps the logo and the near posts from the landscape distance */
const FIT_ASPECT = 0.8;
/** The orbit's centre: the logo */
const TARGET = { x: 0, y: LOGO.y, z: 0 };
/**
 * The camera's start: above the ring, so the far posts show over the logo rather than behind it, back far enough that
 * the ring passes clear of the pane and the inset, and turned so the top stands clear of the posts as the orbit starts
 */
const CAMERA = { distance: 18, degreesDown: 24, degreesRound: 37 };
/** Turns a minute: a near post crosses the screen in about a second */
const ORBIT_RPM = 10;
/** Orbit steps before the first frame: the damped orbit at about 80% of its speed, as after half a second's turning */
const WARM_UP_FRAMES = 30;
/** The closest the reader can zoom, just outside the ring */
const MIN_DISTANCE = 9;
/** The farthest, a little past the start: farther out the posts shrink, and their streaks with them */
const MAX_DISTANCE = 20;
/**
 * `intensity` 0.5 is a film camera's shutter, open for half of each frame. At this orbit that streaks the near posts a
 * few px, too little to see in a still, so the shutter opens ten times wider; wider still and the logo at the orbit's
 * centre softens too.
 */
const INTENSITY = 5;
/** Taps along each streak: enough that the longest streak reads as a smear, not as grain */
const SAMPLES = 32;
/** The longest streak, and the most the pane allows, in CSS px; `maxLength` counts physical pixels */
const MAX_LENGTH = 120;
const MAX_LENGTH_RANGE = 240;
/**
 * The inset's brightness per CSS px of motion in its small picture: full from 2.5 px a frame, so brightness climbs
 * from black at the logo through the near posts to the far floor rather than flooding the panel
 */
const VELOCITY_SCALE = 0.4;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Motion blur' });
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

const { resolution } = app.renderer;
// A streak covers `intensity` of one rendered frame's motion, so it shortens as the frame rate rises: on a 120 Hz
// screen it's half as long as on a 60 Hz one. Each pixel blurs along its own motion, so where moving floor meets the
// still logo, the floor's streak picks up the logo's pink: a faint halo, clearest on the dark theme.
const motionBlur = new MotionBlurEffect({
  intensity: INTENSITY,
  samples: SAMPLES,
  maxLength: MAX_LENGTH * resolution,
});
// While the effect is enabled the view writes the velocity it reads. Clay and the logo's enamel extend `Material3D`,
// so they write it; a blended or glass surface writes none and streaks with whatever is behind it.
const view3d = new View3D({ autoResize: true, passes: [motionBlur] });
// The far floor sweeps past as fast as the camera turns and would smear in wide arcs behind the ring, so the fog takes
// it soon after the far posts.
const stage = new ThemeStage(view3d, { theme, fog: { near: 15, far: 38 } });

app.stage.addChild(view3d);

const scene = await loading.load(() => createScene(view3d.root));

// Spherical's phi is measured down from straight up, and its theta round from +z.
const start = new Spherical(
  CAMERA.distance,
  (90 - CAMERA.degreesDown) * DEG_TO_RAD,
  CAMERA.degreesRound * DEG_TO_RAD,
);

view3d.camera.fov = 40;
view3d.camera.position.setFromSpherical(start).add(TARGET);

// The camera's motion is the lesson, so it orbits by itself, at `autoRotateSpeed` turns a minute; a drag streaks too.
// The app's ticker drives it, so the camera moves once before each render, by the same steps every run.
const orbit = new OrbitCamera({
  view: view3d,
  target: TARGET,
  enableDamping: true,
  enablePan: false,
  autoRotate: true,
  autoRotateSpeed: ORBIT_RPM,
  autoUpdate: false,
  minDistance: MIN_DISTANCE,
  maxDistance: MAX_DISTANCE,
  // High enough that the ring reads as a ring and the far posts stay clear of the logo.
  minPolarAngle: Math.PI * 0.28,
  maxPolarAngle: Math.PI * 0.42,
});

// On a portrait screen the camera and the fog back off until the logo and the near posts fit.
const fit = fitPortrait({
  renderer: app.renderer,
  orbit,
  stage,
  minAspect: FIT_ASPECT,
});

// The inset draws its own copy of the scene through the viewer, from a camera that copies this one each tick, and on a
// phone has the fit keep its band free. `scale` counts device pixels, so it's divided to look the same on a 2× screen.
const velocityViewer = new VelocityViewer({
  scale: VELOCITY_SCALE / resolution,
});
const visuals = await createVisuals({
  app,
  view3d,
  stage,
  orbit,
  minDistance: MIN_DISTANCE,
  fit,
  velocityViewer,
});

// A resize refits the camera for the new screen and the inset's band in one jump, and can change its aspect: a cut.
// `resetHistory()` makes the next frame read no motion instead of smearing the whole picture along the jump. Call it
// after a teleport or a change of shot too.
app.renderer.on('resize', () => view3d.camera.resetHistory());

const pane = new ThemePane({ title: 'Motion blur', stage });

// A narrower value column leaves the names room for `autoRotateSpeed`.
pane.element.style.setProperty('--tp-blade-value-width', '120px');
pane.addBinding(orbit, 'autoRotate');
// Turning the other way swaps every hue in the inset for its opposite.
pane.addBinding(orbit, 'autoRotateSpeed', { min: -20, max: 20, step: 0.5 });

const blurFolder = pane.addFolder({ title: 'MotionBlurEffect' });

// Flipping `enabled` rebuilds the render graph, and the view stops writing velocity; the rows under it are uniform
// writes, free every frame.
blurFolder.addBinding(motionBlur, 'enabled');
blurFolder.addBinding(motionBlur, 'intensity', { min: 0, max: 12, step: 0.05 });
blurFolder.addBinding(motionBlur, 'samples', { min: 1, max: 64, step: 1 });
blurFolder.addBinding(motionBlur, 'maxLength', {
  min: 0,
  max: MAX_LENGTH_RANGE * resolution,
  step: 1,
});
pane
  .addFolder({ title: 'VelocityViewer' })
  .addBinding(velocityViewer, 'scale', {
    min: 0.05 / resolution,
    max: 2 / resolution,
    step: 0.01,
  });

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  scene.spin(time);
  orbit.update(ticker);
  visuals.update(dt, time);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it. That frame should
// already streak, so the damped orbit runs up to speed first. Velocity is motion since a camera's previous render, and
// a first render has none, so the frame renders twice: the first gives the main camera and the inset's one a frame to
// measure from, and the second, the one on show, streaks, with the inset in colour rather than black.
for (let frame = 0; frame < WARM_UP_FRAMES; frame++) orbit.update();
for (let render = 0; render < 2; render++) {
  orbit.update();
  scene.spin(0);
  visuals.update(0, 0);
  app.render();
}
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
