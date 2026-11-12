/**
 * Texture maps vary a PBR extension across the surface, where its plain values set it for the whole material
 *
 * Both spheres share their geometry and the same `Material3D` options. The right one also passes the extension's
 * textures, read texel by texel: most channels scale the plain value they belong to, anisotropy's red and green set a
 * direction, and the coat's normal map bends the coat. That gives glass in stripes that thickens toward the bottom, a
 * dimpled coat in stripes with glossy and hazy bands, brushed highlights that change direction, and sheen and specular
 * from one packed image. Alpha in these maps is data for the extension, not surface transparency.
 *
 * Controls: drag to orbit; Extension picks the extension, Maps off gives the right sphere the left one's material,
 * Turn spheres pauses their slow turn. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, Mesh3D, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { loadReflections, ThemeStage } from './theme/ThemeStage';
import { createDataMaps } from './maps';
import { createBackdrop, createSampleGeometry } from './scene';
import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows both spheres and the backdrop whole */
const FIT_ASPECT = 0.95;
/** The spheres' idle turn in radians a second: once round in about 40 s, slow enough to follow one stripe */
const TURN_SPEED = 0.16;

const theme = themeFromUrl();
const loading = new LoadingScreen({ theme, label: 'PBR extension maps' });
const app = new Application();

await app.init({
  preference: rendererPreference,
  resizeTo: window,
  background: THEMES[theme].haze,
  antialias: true,
  autoStart: false,
  resolution: Math.min(window.devicePixelRatio, 2),
  autoDensity: true,
  // Transmission copies opaque colour. WebGL needs a sampleable back buffer for that copy.
  webgl: { useBackBuffer: true },
});
loading.progress(0.2);
const reflections = await loading.load(() => loadReflections());
// At the screen's size from the start, so the first frame's labels are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// No form light: on the dark theme it would put a second highlight on every sphere.
const stage = new ThemeStage(view3d, { theme, reflections, form: false });

app.stage.addChild(view3d);
const maps = createDataMaps();

/** The mapped material copies the plain options and adds only the extension's textures. */
function pair(plain, mapped) {
  return [new Material3D(plain), new Material3D({ ...plain, ...mapped })];
}

const coat = { factor: 1, roughness: 0.3, normalScale: 1 };
const anisotropy = { strength: 1, rotation: 0 };
const sheen = { color: BRAND.white, roughness: 1 };
const specular = { factor: 1, color: BRAND.white };
const transmission = {
  factor: 1,
  thickness: 1.4,
  attenuationColor: BRAND.pink,
  attenuationDistance: 1.5,
};
const pairs = {
  // texture's red scales factor; thicknessTexture's green scales thickness, and a thicker wall turns the light pinker.
  Transmission: pair(
    { baseColor: BRAND.white, roughness: 0.08, ior: 1.45, transmission },
    {
      transmission: {
        ...transmission,
        texture: maps.mask,
        thicknessTexture: maps.thickness,
      },
    },
  ),
  // texture's red scales factor and roughnessTexture's green scales roughness; normalTexture bends the coat alone.
  // The base is matte, so all the gloss is the coat's: a stripe without it goes dull, and a soft coat at 0.3 leaves
  // the map's glossy bands room to sharpen it into a mirror.
  Clearcoat: pair(
    { baseColor: BRAND.pink, roughness: 0.9, clearcoat: coat },
    {
      clearcoat: {
        ...coat,
        texture: maps.mask,
        roughnessTexture: maps.roughness,
        normalTexture: maps.normal,
      },
    },
  ),
  // texture's red and green set the stretch direction in tangent space, texel by texel; its blue scales strength.
  Anisotropy: pair(
    { baseColor: BRAND.white, metallic: 1, roughness: 0.3, anisotropy },
    { anisotropy: { ...anisotropy, texture: maps.direction } },
  ),
  // One packed image: its RGB tints color and its alpha scales roughness.
  Sheen: pair(
    { baseColor: BRAND.night, roughness: 0.9, sheen },
    { sheen: { ...sheen, texture: maps.packed } },
  ),
  // The same packing: colorTexture's RGB tints color and its alpha scales factor.
  Specular: pair(
    { baseColor: BRAND.night, roughness: 0.16, specular },
    { specular: { ...specular, colorTexture: maps.packed } },
  ),
};
// Transmission opens: its glass and opaque stripes show a map at work most plainly.
const settings = { extension: 'Transmission', maps: true, turn: true };
const geometry = createSampleGeometry();
const plainSphere = new Mesh3D({
  geometry,
  material: pairs[settings.extension][0],
  position: { x: -1.5, y: 1.35, z: 0 },
  parent: view3d.root,
});
const mappedSphere = new Mesh3D({
  geometry,
  material: pairs[settings.extension][1],
  position: { x: 1.5, y: 1.35, z: 0 },
  parent: view3d.root,
});

createBackdrop(view3d.root);

function showExtension() {
  const [plain, mapped] = pairs[settings.extension];

  plainSphere.material = plain;
  mappedSphere.material = settings.maps ? mapped : plain;
}

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.7, 10);
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.3, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 7,
  maxDistance: 16,
  minAzimuthAngle: -0.45,
  maxAzimuthAngle: 0.45,
  maxPolarAngle: Math.PI * 0.48,
});

fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });
const pane = new ThemePane({ title: 'PBR extension maps', stage });

pane
  .addBinding(settings, 'extension', {
    label: 'Extension',
    options: {
      Transmission: 'Transmission',
      Clearcoat: 'Clearcoat',
      Anisotropy: 'Anisotropy',
      Sheen: 'Sheen',
      Specular: 'Specular',
    },
  })
  .on('change', showExtension);
pane
  .addBinding(settings, 'maps', { label: 'Maps' })
  .on('change', showExtension);
pane.addBinding(settings, 'turn', { label: 'Turn spheres' });
const visuals = createVisuals({
  app,
  view3d,
  stage,
  plainSphere,
  mappedSphere,
});
let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  if (settings.turn) time += dt;
  plainSphere.rotation.y = time * TURN_SPEED;
  mappedSphere.rotation.y = time * TURN_SPEED;
  stage.update(dt);
  visuals.update();
});
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
