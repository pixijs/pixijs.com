/**
 * Many View3Ds side by side on one pixi stage, each with its own scene and camera
 *
 * A `View3D` is a pixi display object: `position` places it and `setSize` sizes it, like a sprite, and with no
 * `background` the 2D drawn before it shows round its meshes. Each card's view has its own `root`, its own `camera`
 * and its own `OrbitCamera`, so turning one card's shape or camera changes nothing in the others. The overview is one
 * more view, showing the focus card's world from outside with its camera drawn in it. A view that goes runs
 * `orbit.destroy()`, then `view.destroy({ children: true })`. Every view renders on its own each frame, so each stays
 * cheap: one light, no shadows, and `cull: 'off'` for content that always fits.
 *
 * Controls: drag a card to orbit its camera, and the overview turns to that card, whose panel lights in accent; the
 * pane sets the card count, which card's shape spins, the focus card and its `camera.fov`, and puts every camera back.
 * URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { DirectionalLight, View3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Container } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { LoadingScreen } from './theme/LoadingScreen';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls, NO_CARD } from './controls';
import { createProduct, layoutPage, pageColor } from './scene';

import { ViewPanel } from './ViewPanel';
import { createVisuals } from './visuals';

const MAX_CARDS = 12;
/** The fill every view shares, since a view only reads it: the kit stage's light-theme sky */
const CARD_FILL = {
  skyColor: 0xf1edff,
  groundColor: 0x63529f,
  intensity: 0.95,
};
/** Each card's light, up and to the left of its camera, where the kit stage's key light sits */
const LIGHT_AT = { x: -4, y: 12, z: 7 };
const ORIGIN = { x: 0, y: 0, z: 0 };
/** Where each card's camera starts, in front of its shape and a little above, and its fov, the kit's */
const CARD_CAMERA = { x: 0, y: 0.9, z: 3.1 };
const CARD_FOV = 40;
/** A drag a card's height long turns its camera a quarter turn, so a drag across the card spans the orbit's limits */
const ROTATE_SPEED = 0.25;
/** The spinning shape's turn, in radians a second: a quarter turn */
const SPIN_SPEED = Math.PI / 2;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Many views' });
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

// A view ends pixi's 2D batch, so every panel goes in before every view and the page's 2D draws as one batch. A view
// has no background and covers only its own panel, so the order between cards doesn't matter.
const panels = new Container();
const views = new Container();

app.stage.addChild(panels, views);

// The overview is one more view, showing the focus card's world from outside, on a panel like the cards'. It keeps
// the kit stage for the theme the pane switches, but not the floor, fog or backdrop: a card's world has none, and with
// no background the panel's 2D picture shows round what it draws.
const overview = new View3D({ cull: 'off' });
const stage = new ThemeStage(overview, { theme, lights: false });
const overviewPanel = new ViewPanel({ stage, title: 'overview' });

overview.root.removeChild(stage.floor);
overview.environment = CARD_FILL;
overview.fog = null;
overview.background = null;
panels.addChild(overviewPanel);
views.addChild(overview);

const state = { cards: 6, spinning: 0, focus: 0, fov: CARD_FOV };
const pane = new ThemePane({ title: 'Many views', stage });
const cards = [];

/** Adds a card at the end of the grid: a 2D panel, and a view with its own shape, light and camera */
function addCard() {
  const { shape, name, color } = createProduct(cards.length);
  const panel = new ViewPanel({ stage, title: name, tint: color });
  // No stage here, so the view sets the kit's tone mapping itself. One shape always fits, so there's nothing to cull.
  const view = new View3D({
    toneMapping: 'none',
    environment: CARD_FILL,
    cull: 'off',
    cursor: 'grab',
  });
  const light = new DirectionalLight({
    color: 0xfff6f2,
    intensity: 2.2,
    position: LIGHT_AT,
  });

  view.root.addChild(shape, light);
  light.lookAt(ORIGIN);
  view.camera.fov = CARD_FOV;
  view.camera.position.copyFrom(CARD_CAMERA);

  // The azimuth limits keep the camera in front of its product, and the polar ones between looking down on it and a
  // little up at it, so the overview can frame every pose. Damping stays off: a damped turn keeps easing after
  // `orbit.reset()`.
  const orbit = new OrbitCamera({
    view,
    enableZoom: false,
    enablePan: false,
    rotateSpeed: ROTATE_SPEED,
    minPolarAngle: Math.PI * 0.3,
    maxPolarAngle: Math.PI * 0.58,
    minAzimuthAngle: -Math.PI / 3,
    maxAzimuthAngle: Math.PI / 3,
  });
  const card = { panel, view, shape, light, orbit, name };

  // A drag orbits this card's camera and nothing else, and the overview turns to it.
  orbit.on('start', () => {
    setFocus(cards.indexOf(card));
    controls.refresh();
  });
  panels.addChild(panel);
  views.addChild(view);
  cards.push(card);
}

/** Takes a card away with everything it made */
function removeCard(card) {
  // The orbit listens on the view, so it goes first. `children` takes the shape, light and camera with the view, but
  // not the kit's shared geometry and material, which other cards still draw; `true` would destroy those too.
  card.orbit.destroy();
  card.view.destroy({ children: true });
  card.panel.destroy();
}

/** Adds cards at the end, or takes the last ones away, until there are `count`, then lays the page out again */
function setCardCount(count) {
  while (cards.length < count) addCard();
  for (const card of cards.splice(count)) removeCard(card);
  // A card that's gone can't spin or stay in focus.
  if (state.spinning >= count) state.spinning = NO_CARD;
  setFocus(Math.min(state.focus, count - 1));
  layout();
}

/** Lays every panel out on the page, and its view on the panel's picture */
function layout() {
  const page = layoutPage(cards.length, app.screen, paneCorner);

  cards.forEach((card, i) => placeView(card.view, card.panel, page.cards[i]));
  placeView(overview, overviewPanel, page.overview);
}

/** A view is a rectangle like any pixi object: `position` puts it where it goes and `setSize` sizes it */
function placeView(view, panel, cell) {
  const picture = panel.place(cell);

  view.position.set(picture.x, picture.y);
  view.setSize(picture.width, picture.height);
}

/** Moves the focus to card `index`; each camera keeps its own fov, so the row shows that card's */
function setFocus(index) {
  state.focus = index;
  state.fov = cards[index].view.camera.fov;
}

/** Zooms the focus card's camera and no other */
function setFocusFov(fov) {
  cards[state.focus].view.camera.fov = fov;
}

/** Puts every camera back where it started */
function resetCameras() {
  for (const { view, orbit } of cards) {
    orbit.reset();
    // `reset()` puts back the position and zoom the orbit saved, but not the fov.
    view.camera.fov = CARD_FOV;
  }
  state.fov = CARD_FOV;
}

while (cards.length < state.cards) addCard();

const visuals = createVisuals({ app, overview, stage, first: cards[0] });
const controls = createControls({
  pane,
  state,
  cards,
  maxCards: MAX_CARDS,
  onCards: setCardCount,
  onFocus: setFocus,
  onFov: setFocusFov,
  onReset: resetCameras,
});

// The page keeps clear of the pane as it opens: open on a desktop or tablet, folded on a phone or a low screen, where a
// reader opens it over the cards for a moment. So it's measured once, with all its rows, and by its width in from the
// right edge, where it stays pinned as the screen resizes.
const paneBox = pane.element.getBoundingClientRect();
const paneCorner = {
  width: app.screen.width - paneBox.left,
  bottom: paneBox.bottom,
};

layout();
app.renderer.on('resize', layout);

let painted = -1;

function frame(dt) {
  stage.update(dt);
  // The page is 2D, so it follows the theme here: the background, and each panel in its own update.
  if (stage.darkness !== painted) {
    painted = stage.darkness;
    app.renderer.background.color = pageColor(painted);
  }
  // The focus card's panel lights in accent, the colour its camera takes in the overview.
  for (let i = 0; i < cards.length; i++)
    cards[i].panel.focus(i === state.focus).update(dt);
  overviewPanel.update(dt);
  // One card's shape turns, and no other: each view's scene is its own.
  if (state.spinning !== NO_CARD)
    cards[state.spinning].shape.rotation.y += SPIN_SPEED * dt;
  visuals.update(cards[state.focus]);
}

app.ticker.add((ticker) => frame(Math.min(ticker.deltaMS / 1000, 1 / 15)));

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
frame(0);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
