/**
 * Every kind of compressed glTF `@pixi/3d` reads, one model each, all loaded with the same `Assets.load` call
 *
 * A glTF file can compress its geometry, as quantized integers, meshopt or Draco, and its textures, as KTX2, WebP or
 * AVIF. The loader reads which extensions a file uses and decodes what it must, so a compressed file loads like any
 * other. KTX2 is the one that needs a line of its own: pixi's KTX2 loader isn't in its default set. No sample model
 * comes in every encoding, so each model here is a different Khronos sample, tagged with the one it uses.
 *
 * Controls: drag to orbit. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 *
 * Models, from the Khronos glTF sample assets: Duck by Sony (SCEA Shared Source License), BrainStem by Keith Hunter
 * (Smith Micro's Poser EULA), Cesium Man by Cesium (CC BY 4.0), and Anisotropy Barn Lamp and Sunglasses Khronos by Eric
 * Chadwick (CC BY 4.0). Their logos follow their owners' trademark terms.
 */

import { Model3D, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets, extensions, loadKTX2 } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { model } from './manifest';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { loadReflections, ThemeStage } from './theme/ThemeStage';
import { standModel } from './scene';

import { createVisuals } from './visuals';

// KTX2 textures need pixi's KTX2 loader, which isn't in its default set; no other encoding needs a line of its own.
// In an app, write `import 'pixi.js/ktx2'`, which adds it. The playground can't resolve that subpath, so this adds
// the one parser the glTF loader looks for.
extensions.add(loadKTX2);

/** One file per encoding, with the tag the frame shows under it and where it stands */
const FILES = [
  // KHR_mesh_quantization: positions, normals and UVs stored as 8- or 16-bit integers, which stay that size on the
  // GPU. The loader reads them as the vertex formats they are.
  {
    tag: 'quantized',
    url: model('gltf.DuckQuantized'),
    slot: { x: -2.4, z: -1.7, radius: 0.85, yaw: -1.1 },
  },
  // KHR_meshopt_compression on quantized geometry and animation: packed for the download, unpacked by meshopt's
  // decoder, which ships inside @pixi/3d. Files from before the extension was ratified say EXT_meshopt_compression,
  // which loads the same way.
  {
    tag: 'meshopt',
    url: model('gltf.BrainStemMeshopt'),
    slot: { x: 0, z: -1.7, radius: 1, yaw: 0 },
  },
  // KHR_draco_mesh_compression: the smallest geometry download, unpacked to floats by Google's Draco decoder, which
  // the loader fetches from a CDN the first time a file needs it, unless setDracoDecoderPath points at a copy you host.
  {
    tag: 'Draco',
    url: model('gltf.CesiumManDraco'),
    slot: { x: 2.4, z: -1.7, radius: 1, yaw: 0 },
  },
  // KHR_texture_basisu: KTX2 images that stay compressed on the GPU, transcoded on load to a format the device reads.
  // Pixi fetches the transcoder from a CDN unless setKTXTranscoderPath points at a copy you host.
  {
    tag: 'KTX2',
    url: model('gltf.AnisotropyBarnLampKtx2'),
    slot: { x: -1.25, z: 1.4, radius: 0.75, yaw: 0.4 },
  },
  // EXT_texture_webp: smaller images than PNG or JPEG, which the browser decodes to full-size pixels. This file's
  // geometry is Draco too, since it's the one Khronos sample with WebP images and nothing the engine skips.
  // EXT_texture_avif loads the same way, in a browser that decodes AVIF (pixi's detectAvif tells); no Khronos sample
  // uses it.
  {
    tag: 'WebP',
    url: model('gltf.SunglassesKhronosDraco'),
    slot: { x: 1.25, z: 1.4, radius: 0.75, yaw: -0.4 },
  },
];
/** Each model sways 0.25 rad either way about its own middle, out of step with the others, to show it's solid */
const SWAY = 0.25;
const SWAY_SPEED = 0.4;
/** The narrowest view, width over height, that shows the whole grid from the landscape distance */
const FIT_ASPECT = 1.15;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Compression' });
const app = new Application();

await app.init({
  preference: rendererPreference,
  resizeTo: window,
  background: THEMES[theme].haze,
  antialias: true,
  autoStart: false,
  resolution: Math.min(window.devicePixelRatio, 2),
  autoDensity: true,
  // The lamp's bulb and the sunglasses' lenses are glass, which shows a copy of the opaque picture, and WebGL can only
  // copy it from a back buffer: without one the copy fails and the glass renders black. WebGPU copies the canvas as
  // it is.
  webgl: { useBackBuffer: true },
});
loading.progress(0.2);

const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});

// Every file loads with the same call: the loader picks the decoders from the extensions the file lists.
const [sources, reflections] = await loading.load(() =>
  Promise.all([
    Promise.all(FILES.map(({ url }) => Assets.load(url))),
    loadReflections(),
  ]),
);
// The lamp's shade and the sunglasses' frame are metal, so the stage lights them with a cube map to mirror.
const stage = new ThemeStage(view3d, { theme, reflections });

app.stage.addChild(view3d);

// `autoPlay: true` loops a file's first clip, so the figures walk rather than stand in their bind pose. Meshopt packs
// BrainStem's clip as well as its mesh.
const stands = FILES.map(({ slot }, i) =>
  standModel(
    new Model3D({ source: sources[i], autoPlay: true }),
    slot,
    view3d.root,
  ),
);

const visuals = createVisuals({ app, view3d, stage, files: FILES });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.6, 6.8);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.4, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 4,
  maxDistance: 14,
  // Stays above the floor.
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the grid, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

new ThemePane({ title: 'Compression', stage });

let elapsed = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  elapsed += dt;
  stage.update(dt);
  for (let i = 0; i < stands.length; i++) {
    stands[i].rotation.y =
      FILES[i].slot.yaw + Math.sin(elapsed * SWAY_SPEED + i * 1.3) * SWAY;
  }
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
