/**
 * Sheen: the soft glow velvet and other cloth get at grazing angles
 *
 * Passing a `sheen` group to `new Material3D()` builds the sheen into the shader, and `material.sheen` then holds its
 * `color` and `roughness`, plain values you can write at any time. A face turned towards you shows the base colour;
 * the edges, tops and walls you look across show the sheen, and its roughness spreads that glow from a thin rim to a
 * soft haze. The two spheres in front wear the same velvet side by side, one with the sheen and one built without it.
 *
 * Controls: drag to orbit; round to the logo's side or up over it, and its faces turn to sheen. The pane sets the sheen
 * colour and roughness. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, Mesh3D, SphereGeometry, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, mixColor, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { loadReflections, ThemeStage } from './theme/ThemeStage';
import { createVisuals } from './visuals';

const TITLE = 'Sheen';
/** The narrowest view, width over height, that shows the rocking logo whole */
const FIT_ASPECT = 0.9;
/** The pile under the sheen: the brand pink in shade, and matte, so a pale sheen reads against it */
const VELVET = {
  baseColor: mixColor(BRAND.pink, BRAND.night, 0.3),
  roughness: 0.9,
};
/** A pale lilac a hue away from the pink pile, so the glow reads as its own colour, as shot velvet's second thread */
const SHEEN_COLOR = mixColor(BRAND.purple, BRAND.white, 0.7);
/** Soft enough that the glow spreads in from the rims over the logo's tops and walls, as velvet's does */
const SHEEN_ROUGHNESS = 0.6;
/** The logo rocks ±20°, wider than the kit's sway, so the side walls turn into view and glow */
const ROCK = { angle: 0.35, period: 16 };
/** The twin spheres, on the floor in front of the logo */
const SPHERE_RADIUS = 0.42;
const SHEEN_AT = { x: -1, y: SPHERE_RADIUS, z: 1.7 };
const PLAIN_AT = { x: 1, y: SPHERE_RADIUS, z: 1.7 };

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

// Sheen mirrors the surroundings at grazing angles, so the stage lights the scene with the kit's cube map. The logo
// keeps its model's material, since the lesson replaces it at once.
const [logo, reflections] = await loading.load(() =>
  Promise.all([loadPixiLogo({ material: 'source' }), loadReflections()]),
);
// At the screen's size from the start, so the first frame's labels are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme, reflections });
// The shadow box takes in the floor the shadows fall on as well as their casters, so no shadow is cut off where it
// reaches past them.
stage.shadowOverFloor();

app.stage.addChild(view3d);

// Passing the group builds the sheen into the shader; a material without it has none and pays nothing for it.
const velvet = new Material3D({
  ...VELVET,
  sheen: { color: SHEEN_COLOR, roughness: SHEEN_ROUGHNESS },
});
// There because the constructor got the group. Writing to it updates the material's values, never its shader.
const sheen = velvet.sheen;

logo.setMaterial(velvet);
logo.root.position.y = 1.75;
view3d.root.addChild(logo.root);

// A sphere faces every way at once, so its rim is always seen grazing. The left one wears the logo's velvet, so the
// pane changes it too; the right one wears the same pile built without the group, so `plain.sheen` is undefined.
const plain = new Material3D(VELVET);
// The sheen lives on the silhouette, so the outline has to read round.
const sphere = new SphereGeometry({
  radius: SPHERE_RADIUS,
  widthSegments: 48,
  heightSegments: 32,
});
const sheenSphere = new Mesh3D({
  geometry: sphere,
  material: velvet,
  castShadow: true,
  position: SHEEN_AT,
});
const plainSphere = new Mesh3D({
  geometry: sphere,
  material: plain,
  castShadow: true,
  position: PLAIN_AT,
});

view3d.root.addChild(sheenSphere, plainSphere);

const visuals = createVisuals({ app, view3d, stage, sheenSphere, plainSphere });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 3.1, 7.8);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.15, z: 0.9 },
  enableDamping: true,
  enablePan: false,
  minDistance: 5,
  maxDistance: 14,
  // Stays above the floor and short of straight down, and turns far enough round for the faces to flood with sheen
  // but never behind the logo, where it would read backwards.
  minPolarAngle: 0.4,
  maxPolarAngle: Math.PI * 0.45,
  minAzimuthAngle: -1.3,
  maxAzimuthAngle: 1.3,
});

// A portrait screen is narrower than the logo, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({ title: TITLE, stage });
// A folder for the group, as the options write it: `sheen: { color, roughness }`. Both are plain values, so dragging a
// row never rebuilds the shader.
const sheenRows = pane.addFolder({ title: 'sheen' });

// Black turns the glow off, so the left sphere matches its twin, but the shader still runs the sheen.
sheenRows.addBinding(sheen, 'color', { view: 'color' });
// Near 0 the glow narrows to a thin rim, and near 1 it spreads into a haze over the faces too. The sheen also mirrors
// the stage's sky map, so a rim facing down picks up the dark sea below the horizon, which the floor hides, and reads
// grey.
sheenRows.addBinding(sheen, 'roughness', { min: 0, max: 1, step: 0.01 });

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  logo.root.rotation.y =
    ROCK.angle * Math.sin((time / ROCK.period) * Math.PI * 2);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
