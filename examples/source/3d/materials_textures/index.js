/**
 * A PBR material from five images: base colour, metal-roughness, normal, occlusion and emissive maps, and what each
 * one adds
 *
 * `Material3D` takes each map as an option, and each map scales a plain value the material also has.
 * `material.textures.<slot>` swaps one at run time, with no new shader. A slot always holds a texture, so switching a
 * map off puts a neutral one back: white, black, or a flat normal map. The cards along the bottom show the texture
 * each slot holds now.
 *
 * Controls: drag to orbit; the pane switches each map on and off. The paint and the chrome hide most of what normal
 * and occlusion do, so switch baseColor and metallicRoughness off to see them on a bare white helmet. URL flags:
 * `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Assets, Texture } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { model } from './manifest';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { loadReflections, ThemeStage } from './theme/ThemeStage';
import {
  BLACK,
  createHelmet,
  FLAT_NORMAL,
  helmetMaps,
  MAP_SLOTS,
  swayHelmet,
} from './scene';

import { createVisuals } from './visuals';

/** The narrowest view, width over height, that shows the helmet whole from the landscape distance */
const FIT_ASPECT = 0.8;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'PBR texture set' });
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
const [source, reflections] = await loading.load(() =>
  Promise.all([Assets.load(model('gltf.DamagedHelmet')), loadReflections()]),
);
// The chrome and the visor mirror their surroundings, so the stage lights the helmet with a cube map.
const stage = new ThemeStage(view3d, {
  theme,
  fog: { near: 10, far: 30 },
  reflections,
});

app.stage.addChild(view3d);

// The file ships five images, and the loader put them on the material it built.
const maps = helmetMaps(source);
// The loader built this same material; written out, it's the one you'd build from five images of your own.
const material = new Material3D({
  baseColorTexture: maps.baseColor,
  // Each map scales a plain value: blue scales `metallic` and green `roughness`, so 1 lets the map decide. The
  // default `metallic` of 0 would zero the map's metal.
  metallic: 1,
  roughness: 1,
  metallicRoughnessTexture: maps.metallicRoughness,
  // `normalScale` scales the tilt it reads, for softer or deeper bumps.
  normalTexture: maps.normal,
  // `occlusionStrength` multiplies what it reads. It darkens ambient and environment light only; the key light's
  // direct light ignores it.
  occlusionTexture: maps.occlusion,
  // The group is what gives the material an emissive slot at all. Its `color` and `strength` scale the map.
  emissive: { texture: maps.emissive },
});
const helmet = createHelmet(source);

helmet.mesh.material = material;
view3d.root.addChild(helmet.root);

/**
 * What each slot holds with its map off, since a slot always holds a texture. White leaves the plain value as it is,
 * and black adds no glow, where white would light the whole helmet. The flat normal points straight out of the
 * surface, so the mesh's own normals show. It's made in scene.ts because the engine's isn't public, and as a real
 * texture in the slot it keeps normal mapping compiled in, so switching never rebuilds the shader.
 */
const OFF = {
  baseColor: Texture.WHITE,
  metallicRoughness: Texture.WHITE,
  normal: FLAT_NORMAL,
  occlusion: Texture.WHITE,
  emissive: BLACK,
};

/** Puts a slot's map back, or the neutral texture that stands in for it; a swap needs no new shader */
function setMap(slot, on) {
  material.textures[slot] = on ? maps[slot] : OFF[slot];
}

const visuals = createVisuals({ app, stage, material });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.3, 7.4);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.25, z: 0 },
  enableDamping: true,
  enablePan: false,
  // Close enough to see the seams and creases, and never under the floor.
  minDistance: 3.5,
  maxDistance: 12,
  maxPolarAngle: Math.PI * 0.45,
});

// A portrait screen is narrower than the helmet, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: 'PBR texture set', stage });
// Every map starts in its slot, as the material was built.
const mapsOn = {
  baseColor: true,
  metallicRoughness: true,
  normal: true,
  occlusion: true,
  emissive: true,
};
const textureRows = pane.addFolder({ title: 'material.textures' });

// A narrower value column leaves the names room for `metallicRoughness`.
pane.element.style.setProperty('--tp-blade-value-width', '96px');
for (const slot of MAP_SLOTS) {
  textureRows
    .addBinding(mapsOn, slot)
    .on('change', ({ value }) => setMap(slot, value));
}

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  swayHelmet(helmet, time);
  visuals.update(dt);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
