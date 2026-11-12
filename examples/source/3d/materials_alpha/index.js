/**
 * Transparency: how `alphaMode` treats a pixel's alpha, `'opaque'`, `'mask'` with `alphaCutoff` and `'blend'`, and
 * `doubleSided` for cards seen from behind
 *
 * Each card wears the PixiJS wordmark, whose shape lives only in its texture's alpha, and a pixel's alpha is the
 * texture's times the material's `alpha`. `'opaque'`, the default, ignores alpha and draws the whole card, the wordmark
 * on black. `'mask'` throws away each pixel whose alpha is under `alphaCutoff`: a hard-edged cut-out drawn with the
 * opaque meshes, which writes depth, hides what's behind it and needs no sorting. `'blend'` mixes each pixel over
 * what's behind it, after the opaque meshes and sorted back to front. `alphaMode`, `alphaCutoff` and `alpha` are
 * setters, while `doubleSided` is fixed once a material is built.
 *
 * Controls: drag to orbit, and walk round behind the cards; the pane sets the cards' alphaMode, alphaCutoff, alpha and
 * doubleSided and the glass logo's alpha. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Material3D, View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { fitPortrait } from './theme/fitPortrait';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { BRAND, THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import {
  createCards,
  createWordmarkTexture,
  LOGO_AT,
  LOGO_WIDTH,
  swayProps,
} from './scene';

import { createVisuals } from './visuals';

const TITLE = 'Transparency';
/** The narrowest view, width over height, that shows both cards whole with a margin either side */
const FIT_ASPECT = 1.2;
/** The cards' glow from their own texture, which keeps the letters bright on the dark stage and away from the light */
const CARD_GLOW = 0.35;

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

// At the screen's size from the start, so the first frame's labels are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });
// The model's own material, since the glass replaces it at once.
const logo = await loading.load(() =>
  loadPixiLogo({ material: 'source', width: LOGO_WIDTH }),
);

app.stage.addChild(view3d);

// The cards' shape lives only in this texture's alpha, 1 on the letters and 0 round them (createWordmarkTexture).
const wordmarkTexture = createWordmarkTexture(app.renderer);
// The cards' alpha options, which the pane edits and a rebuilt material starts from. The letters' alpha is 1 times
// 0.6, over the 0.5 cutoff, so 'mask' draws them solid; a cutoff over 0.6 or an alpha under 0.5 drops them all at once.
const cardOptions = {
  alphaMode: 'mask',
  alphaCutoff: 0.5,
  alpha: 0.6,
  doubleSided: true,
};

/** The cards' material. `doubleSided` draws each card's back face too, lit as if it faced the other way */
function createCardMaterial() {
  return new Material3D({
    baseColorTexture: wordmarkTexture,
    // The texture is clear round the letters, so the card there glows nothing and 'opaque' still draws it black.
    emissive: { texture: wordmarkTexture, strength: CARD_GLOW },
    ...cardOptions,
  });
}

let cardMaterial = createCardMaterial();
const cards = createCards(cardMaterial, view3d.root);

/** Writes the options into the cards' material; each is a setter, so the change shows on the next frame */
function updateCardMaterial() {
  cardMaterial.alphaMode = cardOptions.alphaMode;
  cardMaterial.alphaCutoff = cardOptions.alphaCutoff;
  cardMaterial.alpha = cardOptions.alpha;
}

/** `doubleSided` is fixed when a material is built, so changing it takes a new one */
function rebuildCardMaterial() {
  const old = cardMaterial;

  cardMaterial = createCardMaterial();
  cards.front.material = cardMaterial;
  cards.back.material = cardMaterial;
  old.destroy();
}

// Sky-blue glass, glossy so it reads as glass. Blended meshes write no depth, cast no shadow and draw after the opaque
// ones, sorted back to front each frame by the distance from the camera to each mesh's origin, not by child order: the
// logo joins after the cards, yet it draws before them from the front and after them from behind. Each mesh sorts as a
// whole, so a large blended mesh, or two that pass through each other, can draw in the wrong order where they overlap,
// and a mesh's own triangles draw in the order they're stored, so its far walls can cover its near ones.
const glassMaterial = new Material3D({
  baseColor: BRAND.sky,
  roughness: 0.15,
  alphaMode: 'blend',
  alpha: 0.45,
});

logo.setMaterial(glassMaterial);
logo.root.position.copyFrom(LOGO_AT);
view3d.root.addChild(logo.root);

const visuals = createVisuals({ app, view3d, stage, cards });

view3d.camera.fov = 40;
view3d.camera.position.set(0, 2.75, 8.4);

// No azimuth limit, so a reader can walk behind the cards; the polar limits keep the camera above the floor.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: 1.55, z: 0 },
  enableDamping: true,
  enablePan: false,
  minDistance: 6,
  maxDistance: 14,
  minPolarAngle: Math.PI * 0.3,
  maxPolarAngle: Math.PI * 0.47,
});

// A portrait screen is narrower than the two cards side by side, so the camera and the fog back off.
fitPortrait({ renderer: app.renderer, orbit, stage, minAspect: FIT_ASPECT });

// The card rows edit `cardOptions`, since a new `doubleSided` replaces the material and a row can't follow it there.
const pane = new ThemePane({ title: TITLE, stage });
const cardFolder = pane.addFolder({ title: 'cardMaterial' });

cardFolder.addBinding(cardOptions, 'alphaMode', {
  options: { opaque: 'opaque', mask: 'mask', blend: 'blend' },
});
const cutoffRow = cardFolder.addBinding(cardOptions, 'alphaCutoff', {
  min: 0,
  max: 1,
});
const alphaRow = cardFolder.addBinding(cardOptions, 'alpha', {
  min: 0,
  max: 1,
});

cardFolder
  .addBinding(cardOptions, 'doubleSided')
  .on('change', rebuildCardMaterial);
cardFolder.on('change', () => {
  updateCardMaterial();
  greyIdleRows();
});
pane
  .addFolder({ title: 'glassMaterial' })
  .addBinding(glassMaterial, 'alpha', { min: 0, max: 1 });

/** Greys out the rows the mode ignores: `'opaque'` reads no alpha, and only `'mask'` reads the cutoff */
function greyIdleRows() {
  cutoffRow.disabled = cardOptions.alphaMode !== 'mask';
  alphaRow.disabled = cardOptions.alphaMode === 'opaque';
}

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  swayProps(cards, logo, time);
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
greyIdleRows();
orbit.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
