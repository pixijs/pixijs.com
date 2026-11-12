/**
 * Anisotropy: highlights stretched along one direction on the surface, the look of brushed metal
 *
 * A `Material3D` built with the `anisotropy` group stretches its highlights and reflections along a direction.
 * `strength` sets how far they stretch, and `rotation` turns the direction away from the mesh's tangents, which say
 * which way the grain runs. At the highlight an arrow draws the tangent and an arc the rotation from it. A twin built
 * without the group shows the round highlight the streak starts from.
 *
 * Controls: drag to orbit; the pane sets the anisotropy's strength and rotation, and the roughness of both spheres.
 * URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, Mesh3D, SphereGeometry, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { BRAND, CLAY, mixColor, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { loadReflections, ThemeStage } from './theme/ThemeStage';
import { sphereTangents } from './scene';
import { createVisuals } from './visuals';

const TITLE = 'Anisotropy';
/** The narrowest view, width over height, that keeps the sphere and its twin whole from the landscape distance */
const FIT_ASPECT = 1.1;
/** Big enough that the tangent arrow and the arc fit on the sphere's highlight */
const SPHERE_RADIUS = 1.4;
/** The sphere's centre, high enough that it clears the floor */
const SPHERE_HEIGHT = 1.9;
/** With tangents on its vertices the grain runs smooth, so counts that are cheap on a phone are enough */
const SPHERE_WIDTH_SEGMENTS = 64;
/** Half the width count, so each quad is about square; the tangents are laid out on the same grid */
const SPHERE_HEIGHT_SEGMENTS = 32;
/**
 * A light steel: white dimmed a little, so the white highlight reads on it, with a faint lilac cast that sits with
 * the palette. A metal's base colour is its reflectance, and the palette has no metal of its own.
 */
const STEEL = mixColor(
  mixColor(BRAND.white, BRAND.night, 0.15),
  CLAY.lilac,
  0.1,
);
/** Small beside the subject, so it stays the one focal point */
const TWIN_SCALE = 0.28;
/** Low on the subject's left, clear of the sphere from every angle the orbit allows */
const TWIN_POSITION = { x: -2.1, y: 0.75, z: 0.3 };
/** Past this the surface is rough enough across the stretch that the streak melts into an even sheen */
const MAX_ROUGHNESS = 0.4;

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

// A metal shows only what it reflects, so the stage lights it with the kit's cube map; the stretched reflections are
// half of what reads as brushed.
const reflections = await loading.load(() => loadReflections());
// At the screen's size from the start, so the first frame's labels are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
// No form light: on the dark theme it would draw a second streak beside the key's, and the arc measures one.
const stage = new ThemeStage(view3d, { theme, reflections, form: false });

app.stage.addChild(view3d);

// Passing the `anisotropy` group turns the feature on; a material without it pays nothing for it. A `texture` in the
// group would set the direction per texel instead, for a pan's circular brushing, and it can only be passed here.
// The engine squares `roughness` into α and roughens the surface along the stretch to mix(α, 1, strength²), leaving
// it at α across, so the first half of the strength slider does less than the second.
const material = new Material3D({
  baseColor: STEEL,
  metallic: 1,
  roughness: 0.3,
  anisotropy: { strength: 1, rotation: Math.PI / 4 },
});

// `rotation` turns the stretch from the mesh's tangents, so the sphere carries its own, running round it the way u
// grows. Without them the engine builds a frame from the UVs at each pixel, which follows the UV layout rather than a
// direction you choose. u runs right to left across the side facing the camera, so a positive rotation turns
// clockwise on screen. A sphere rather than the logo, whose UVs follow each letter's outline and break its grain up.
const geometry = new SphereGeometry({
  radius: SPHERE_RADIUS,
  widthSegments: SPHERE_WIDTH_SEGMENTS,
  heightSegments: SPHERE_HEIGHT_SEGMENTS,
  tangents: sphereTangents(SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS),
});
const sphere = new Mesh3D({
  geometry,
  material,
  position: { x: 0, y: SPHERE_HEIGHT, z: 0 },
  parent: view3d.root,
});

// The same steel without the group, the round highlight the streak is measured against. It shares the geometry: a
// material without the group never reads the tangents.
const plainSteel = new Material3D({
  baseColor: STEEL,
  metallic: 1,
  roughness: material.roughness,
});
const twin = new Mesh3D({
  geometry,
  material: plainSteel,
  position: TWIN_POSITION,
  scale: TWIN_SCALE,
  parent: view3d.root,
});

// Built with the group, so its runtime controls exist.
const anisotropy = material.anisotropy;

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.5, 7);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: SPHERE_HEIGHT, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 5,
  maxDistance: 11,
  // Low and in front, where the key light lands, so the highlight stays clear of the silhouette and the poles, where
  // every line of u meets and the grain swirls. The turn stops short of either side where the twin would pass behind
  // the sphere or in front of it.
  minPolarAngle: Math.PI / 2 - 0.35,
  maxPolarAngle: Math.PI / 2 + 0.1,
  minAzimuthAngle: -0.6,
  maxAzimuthAngle: 0.3,
});

// A portrait screen is narrower than the sphere and its twin, so the camera and the fog back off until they fit.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });
const visuals = createVisuals({
  app,
  view3d,
  stage,
  sphere,
  twin,
  radius: SPHERE_RADIUS,
  anisotropy,
});

const pane = new ThemePane({ title: TITLE, stage });
/** Two decimals always, since a slider with no step otherwise shows every digit of π / 4 */
const twoPlaces = (value) => value.toFixed(2);
// A folder that mirrors `material.anisotropy`, so its `rotation` reads as the group's, not the mesh's own. Both are
// plain properties: dragging them never recompiles the shader.
const anisotropyRows = pane.addFolder({ title: 'anisotropy' });

anisotropyRows.addBinding(anisotropy, 'strength', {
  min: 0,
  max: 1,
  format: twoPlaces,
});
// 0 to π turns the stretch every way it can run: a stretch has no front or back, so π looks the same as 0.
anisotropyRows.addBinding(anisotropy, 'rotation', {
  min: 0,
  max: Math.PI,
  format: twoPlaces,
});
// The twin follows, so the two spheres differ only by the group.
pane
  .addBinding(material, 'roughness', {
    min: 0,
    max: MAX_ROUGHNESS,
    format: twoPlaces,
  })
  .on('change', (event) => {
    plainSteel.roughness = event.value;
  });

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
