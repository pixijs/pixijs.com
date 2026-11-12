/**
 * Keyframe animation built in code: the PixiJS logo assembles itself from tracks an `AnimationPlayer` plays
 *
 * A keyframe is a value at a time. A track holds one property's keyframes and names that property by its label,
 * `'<node>.<property>'`: `Vector3Track` drives a position, `QuaternionTrack` a rotation and `NumberTrack` any number,
 * here a light's intensity. An `Animation` gathers tracks, and an `AnimationPlayer` plays it on any `Container3D`,
 * finding each track's node by label in that container's subtree. Each track's `interpolation` decides what happens
 * between its keyframes: `'STEP'` holds, `'LINEAR'` goes straight, and `'CUBICSPLINE'` follows a curve its tangents
 * shape. The frame draws a dot at each position keyframe, the path the interpolation fills in between them, ghosts of
 * the badge at its rotation keys, and the light's bulb.
 *
 * Controls: drag to orbit; the pane picks the interpolation, plays and stops, scrubs the time, and reads the light's
 * intensity. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import {
  Animation,
  AnimationPlayer,
  NumberTrack,
  PointLight,
  QuaternionTrack,
  Vector3Track,
  View3D,
} from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import {
  DURATION,
  FLASH_PEAK,
  HOP_ORDER,
  hopKeys,
  INTERPOLATIONS,
  JS_ROLL,
  layout,
  LOGO_HEIGHT,
} from './keyframes';
import { createVisuals } from './visuals';

/** Above the logo and in front of it, in the logo's space, where the flash lights every piece's face */
const FLASH_AT = { x: 0, y: 2, z: 1.8 };
/** Past the floor under the logo, about 4 away, so the shadow pool turns sky with the flash */
const FLASH_RANGE = 7;
/** Mid-assembly: pieces landed, in flight and waiting, all in the first frame */
const START_TIME = 1.25;
/** Straight runs between the keys, the interpolation a reader writes first */
const START_INTERPOLATION = 'LINEAR';
/** The narrowest view, width over height, that shows the scattered starts whole from the landscape distance */
const FIT_ASPECT = 1.08;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Keyframes' });
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
const stage = new ThemeStage(view3d, { theme });
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();
const logo = await loading.load(() => loadPixiLogo());

app.stage.addChild(view3d);
logo.root.position.y = LOGO_HEIGHT;
view3d.root.addChild(logo.root);

// A track finds its node by label inside the player's target, so the light has a label and lives under the logo.
const flash = new PointLight({
  label: 'flash',
  color: BRAND.sky,
  range: FLASH_RANGE,
  position: FLASH_AT,
});

logo.root.addChild(flash);

/** The whole assembly as one animation, every track filling the gaps between its keyframes the same way */
function assemble(interpolation) {
  // The label names a node in the player's target, then the property this track drives. 'CUBICSPLINE' stores an
  // in-tangent and an out-tangent round every value, so `layout` writes the keyframes the way the track reads them.
  const tracks = HOP_ORDER.map((id) => {
    const keys = layout(hopKeys(logo.pieces[id]), interpolation);

    return new Vector3Track({
      label: `${id}.position`,
      ...keys,
      interpolation,
    });
  });

  tracks.push(
    new QuaternionTrack({
      label: 'js.quaternion',
      ...layout(JS_ROLL, interpolation),
      interpolation,
    }),
    // The keyframes written out: a time and a value per key, each value one number here, where a position's is three
    // and a quaternion's four. The light is off as the badge lands at 2.4 s, peaks at 2.55 s and is off by 3.3 s.
    new NumberTrack({
      label: 'flash.intensity',
      ...layout(
        { times: [2.4, 2.55, 3.3], values: [0, FLASH_PEAK, 0] },
        interpolation,
      ),
      interpolation,
    }),
  );

  // Past the last keyframe, so the assembled logo holds before the loop.
  return new Animation({ label: interpolation, tracks, duration: DURATION });
}

// One animation per interpolation from the same keyframes: 'CUBICSPLINE' lays its values out differently, so a
// track's interpolation can't simply be switched in place.
const animations = INTERPOLATIONS.map(assemble);
// The default advances the player on pixi's shared ticker, not this app's, so the frame loop below advances it
// instead, before the visuals read the pose.
const player = new AnimationPlayer({
  target: logo.root,
  animations,
  autoUpdate: false,
});
// gotoAndStop applies the pose at that time at once, and play carries on from it, looping.
let playback = player
  .getState(START_INTERPOLATION)
  .gotoAndStop(START_TIME)
  .play();

/** Plays the same keyframes with another interpolation, from the same time, playing or stopped as before */
function playInterpolation(mode) {
  const { time, playing } = playback;

  // Two states playing the same labels would blend their values, so the one playing stops first.
  player.stop();
  playback = player.getState(mode).gotoAndStop(time);
  if (playing) playback.play();
}

const visuals = createVisuals({ app, view3d, stage, logo, flash, animations });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.85, 10.8);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.2, z: 0 },
  enableDamping: true,
  enablePan: false,
});

// A portrait screen is narrower than the scattered starts, so the camera and the fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'Keyframes', stage });
const controls = createControls({
  pane,
  interpolation: START_INTERPOLATION,
  duration: DURATION,
  flash,
  onInterpolation: playInterpolation,
  onPlay: (play) => (play ? playback.play() : playback.stop()),
  onScrub: (time) => playback.gotoAndStop(time),
});

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  // Advances the playing state by the ticker's time and writes each track's value to its node.
  player.update(ticker);
  controls.sync(playback);
  visuals.update(playback);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
controls.sync(playback);
visuals.update(playback);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
