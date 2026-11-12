/**
 * Per-vertex data: colours that tint, a second colour set that carries data, and an attribute of your own
 *
 * A `Geometry3D` holds a record for every vertex. Its `colors` tint the material once `material.vertexColors` is on;
 * `colors1` never tints, so it carries a mask; and `geometry.addAttribute` adds a value with a name and format of your
 * own. A shader bit in `extraBits` reads them by their attribute keys and lifts each vertex on a ripple: the mask pins
 * the rim to the floor, and the phase makes the crest roll down and round the mound.
 *
 * Controls: drag to orbit; the pane turns the vertex colours off, sets how much the bit uses the mask and the phase,
 * and sets how high it lifts. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Geometry3D, Material3D, Mesh3D, srgbToLinear, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Color } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { rippleBit } from './rippleBit';

import { createMoundShape, MOUND_RADIUS, moundColor } from './scene';

/** The narrowest view, width over height, that shows the mound whole from the landscape distance */
const FIT_ASPECT = 0.8;
/**
 * The material's own colour, which the vertex colours multiply: a light grey, since a white facet turned to the light
 * theme's key clips to the floor's white, and with the colours off the mound would lose its facets and its edge
 */
const BASE_COLOR = 0xd6d6d6;
/**
 * How high the ripple lifts the peak, in scene units: enough that the cap visibly leans as the crest circles it,
 * since the mask halves the lift by mid-slope
 */
const LIFT_HEIGHT = 0.5;
/** The tallest ripple the pane offers, about half the mound's height */
const MAX_LIFT_HEIGHT = 0.8;
/** Radians a second: a wave every 3.75 s, slow enough to follow one crest down the slope */
const WAVE_SPEED = (8 * Math.PI) / 15;
/** Radians of delay per unit from the peak: about nine tenths of a wave down the slope, so one crest at a time */
const PHASE_PER_UNIT = 2.6;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({
  theme,
  label: 'Vertex colours and custom attributes',
});
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

app.stage.addChild(view3d);

// Three more values per vertex beside the shape's own: a colour, a mask and a phase.
const shape = createMoundShape();
const { positions, normals, indices, vertexCount } = shape;
const colors = new Uint8Array(vertexCount * 4);
const colors1 = new Uint8Array(vertexCount * 4);
const phases = new Float32Array(vertexCount);

for (let i = 0; i < vertexCount; i++) {
  writeVertexColor(colors, i, moundColor(shape, i));
  // Data, not colour: in red, how far this vertex may move, from 1 at the peak to 0 at the rim. It's stored as a
  // byte, which the shader reads back as 0 to 1.
  colors1[i * 4] = Math.round((1 - shape.distances[i] / MOUND_RADIUS) * 255);
  // When it rises, in radians behind the peak: up to about 12, past what a 0 to 1 colour channel holds. The angle term
  // winds the crest round the mound, and a whole turn adds 2π, which the wave's sine can't see, so no seam shows.
  phases[i] = shape.distances[i] * PHASE_PER_UNIT + shape.angles[i];
}

// The stored format isn't always the array's type: `normals` from a Float32Array are kept as 16-bit integers
// (`snorm16x4`, see `quantizeNormals`), which the shader reads back as floats from −1 to 1.
const geometry = new Geometry3D({
  positions,
  normals,
  indices,
  colors,
  colors1,
});

// The `attributes` option would replace the built ones, so an attribute of your own is added after construction. It
// has to come before the first render, which packs the geometry into the shared buffers by each attribute's `format`.
geometry.addAttribute('aPhase', { buffer: phases, format: 'float32' });

// `extraBits` adds the bit's fields to `material.data`, which its type can't see, hence the cast.
const material = new Material3D({
  baseColor: BASE_COLOR,
  roughness: 0.6,
  flatShading: true,
  extraBits: [rippleBit],
});

// The bit's fields aren't constructor options, so they're set on the built material, beside the flag.
material.vertexColors = true;
material.data.liftHeight = LIFT_HEIGHT;
material.data.maskStrength = 1;
material.data.phaseScale = 1;

const mound = new Mesh3D({ geometry, material, parent: view3d.root });

/** Turns the vertex colours on or off; the mesh reads the flag when it builds its shader, so it builds it again */
function setVertexColors(on) {
  material.vertexColors = on;
  mound.invalidate();
}

// The key comes in low from the left, so the facets step darker round the right shoulder, and the floor, lit at a
// slant, stays a shade under the mound's lit side rather than matching it.
stage.key.position.set(-9, 7, 2);
stage.key.lookAt({ x: 0, y: 0, z: 0 });

view3d.camera.fov = 40;
// From above, so the rings and the white cap read.
view3d.camera.position.set(0, 4.2, 8.2);

const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 0.6, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 14,
  maxPolarAngle: Math.PI * 0.42,
});

// A phone is narrower than the mound, so the camera and the fog back off until it fits.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

const pane = new ThemePane({
  title: 'Vertex colours and custom attributes',
  stage,
});

pane
  .addBinding(material, 'vertexColors')
  .on('change', ({ value }) => setVertexColors(value));
// The bit's fields bind straight to `material.data`, which the shader reads each frame.
pane.addBinding(material.data, 'maskStrength', { min: 0, max: 1, step: 0.01 });
pane.addBinding(material.data, 'phaseScale', { min: 0, max: 1, step: 0.01 });
pane.addBinding(material.data, 'liftHeight', {
  min: 0,
  max: MAX_LIFT_HEIGHT,
  step: 0.01,
});

let waveTime = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  stage.update(dt);
  // The bit reads the wave's clock from the material, so the whole ripple runs on the GPU.
  waveTime = (waveTime + WAVE_SPEED * dt) % (Math.PI * 2);
  material.data.waveTime = waveTime;
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();

/** Stores a palette colour as vertex `i`'s four bytes; vertex colours are linear light, so it's decoded from sRGB */
function writeVertexColor(out, i, hex) {
  const { red, green, blue } = new Color(hex);

  out[i * 4] = Math.round(srgbToLinear(red) * 255);
  out[i * 4 + 1] = Math.round(srgbToLinear(green) * 255);
  out[i * 4 + 2] = Math.round(srgbToLinear(blue) * 255);
  out[i * 4 + 3] = 255;
}
