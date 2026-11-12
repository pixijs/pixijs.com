/**
 * One video texture feeds two meshes, so both displays always show the same frame
 *
 * `Assets.load` turns a clip into a `Texture` whose `VideoSource` uploads each new frame while the video plays. Give
 * that one texture to every material that should share playback: nothing copies pixels per frame, and pausing the
 * video freezes both displays. The unlit `FlatMaterial` shows the clip as authored; the lit `Material3D` shades it
 * with the stage's lights. Release detaches the texture from both materials, then `Assets.unload` destroys it with
 * its video.
 *
 * Controls: drag to orbit; the pane plays, pauses, releases and reloads the clip, and its Playback row shows the
 * state. The Theme row relights the stage, which changes only the lit display. URL flags: `?theme=light|dark`,
 * `?renderer=webgl|webgpu`. Muted playback normally starts on its own; Play is the fallback when the browser blocks it.
 */

import { FlatMaterial, Material3D, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets, Texture } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { video } from './manifest';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';
import { createDisplays } from './scene';
import { createVisuals } from './visuals';

const VIDEO_URL = video('pixijs.SharedVideoMotion');
/** The narrowest view, width over height, that shows both displays whole from the landscape distance */
const FIT_ASPECT = 1.2;

const theme = themeFromUrl();
const loading = new LoadingScreen({ theme, label: 'Video texture' });
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
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });

app.stage.addChild(view3d);

// The loader mutes the clip and plays it inline by default, which lets it start without a tap. It resolves once the
// video can play, so a frame is ready to upload, and builds the VideoSource then, so it never restarts the download.
const loadClip = () =>
  Assets.load({ src: VIDEO_URL, data: { autoPlay: false, loop: true } });
let texture = await loading.load(loadClip);

// Both materials take the one texture, not two loads of the clip.
const materials = [
  new FlatMaterial({ baseColorTexture: texture }),
  new Material3D({ baseColorTexture: texture }),
];
const displays = createDisplays(
  view3d.root,
  materials,
  texture.width / texture.height,
);

/** Starts the clip; false when the browser blocks playback */
async function play() {
  try {
    await texture.source.resource.play();

    return true;
  } catch {
    // A browser may refuse even muted autoplay (iOS in Low Power Mode); a press of Play is the gesture it wants.
    return false;
  }
}

function pause() {
  texture.source.resource.pause();
}

async function release() {
  // No material may keep a texture whose GPU copy is about to be destroyed.
  for (const material of materials) material.textures.baseColor = Texture.WHITE;
  pause();
  // Destroys the texture, its VideoSource and the video element's download.
  await Assets.unload(VIDEO_URL);
}

/** Loads a fresh clip, gives it to both materials, then plays it */
async function reload() {
  texture = await loadClip();
  for (const material of materials) material.textures.baseColor = texture;

  return play();
}

const startedOnItsOwn = await play();

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.7, 9.8);
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.7, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 8,
  maxDistance: 19,
  // Short of edge-on: past these the screens turn too far from the camera to read.
  minAzimuthAngle: -0.6,
  maxAzimuthAngle: 0.6,
  minPolarAngle: Math.PI * 0.3,
  maxPolarAngle: Math.PI * 0.48,
});

fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });
const pane = new ThemePane({ title: 'Video texture', stage });

createControls({
  pane,
  playback: startedOnItsOwn ? 'Playing' : 'Press Play',
  play,
  pause,
  release,
  reload,
});
const visuals = createVisuals({ app, view3d, stage, displays });

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  visuals.update();
});
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
