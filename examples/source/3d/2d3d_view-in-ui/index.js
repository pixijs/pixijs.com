/**
 * A View3D is a pixi container: it sits in a 2D layout, lets the 2D show through, and shares pointer input with the
 * pixi UI around it
 *
 * The view goes into a 2D card with `addChild`. `position` places it in the card's space, `width` and `height` size
 * its viewport in pixels (the picture never stretches), and `anchor` picks which point of its rectangle `position`
 * names. With `background = null` the card shows through wherever the logo isn't; `composite` only changes how the
 * scene reaches the canvas. Inside its rectangle the view takes every pointer event, empty space included, so it hides
 * the swatches under it from taps: `hitArea` limits it to a shape, `eventMode = 'none'` lets everything through (the
 * orbit too), and adding the swatches after the view puts them in front.
 *
 * The frame outlines the view's rectangle, marks the point `position` names with a dot, and hatches the part of the
 * view that takes pointer events (`visuals.ts`).
 *
 * Controls: drag the logo to turn it, tap a colour to repaint it. The pane picks how the view takes pointer events
 * (tap a swatch after each), sets its background, and moves and sizes it. URL flags: `?theme=light|dark`,
 * `?renderer=webgl|webgpu`.
 */

import { View3D } from '@pixi/3d';
import { OrbitCamera } from '@pixi/3d/extras';
import { Application, Ellipse } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { EnamelMaterial } from './theme/EnamelMaterial';
import { LoadingScreen } from './theme/LoadingScreen';
import { loadPixiLogo } from './theme/logo';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';

import { createProductCard, fitStageToCard } from './scene';
import { createVisuals } from './visuals';

/** How far the orbit's target sits under the logo, so the logo frames high and leaves the swatches the lower band */
const LOGO_LIFT = 0.7;
/** The ellipse round the logo, as shares of the view's height, which the logo's size on screen follows */
const LOGO_AREA = { y: -0.12, halfWidth: 0.45, halfHeight: 0.25 };
/** The logo's slow sway about y, so it reads as live with its face to the reader */
const SWAY = 0.35;
const SWAY_SPEED = 0.5;
/** The mode the scene opens in: the hit area on the logo, so both of the card's instructions work */
const OPENING_MODE = 'logoArea';

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'View in UI' });
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

const page = createProductCard();

app.stage.addChild(page.root);

// A pixi container like any other, placed in the card's own px.
const view3d = new View3D({
  // The viewport in px, not a scale. The camera's fov is vertical, so the height sets the logo's size and the width
  // only the room beside it.
  width: 400,
  height: 400,
  // The default, named because it's the point `position` sets: the rectangle's top-left corner.
  anchor: 0,
  position: { x: 20, y: 96 },
  // pixi shows the cursor of whatever its hit test meets: a grab hand where the view takes the pointer, a finger on
  // a swatch it lets through.
  cursor: 'grab',
  // The default: the scene draws straight onto the canvas. `true` draws it into a texture the view's size, then that
  // onto the canvas, which costs a texture and one more draw; post effects turn it on themselves. Fixed once built.
  composite: false,
});
const stage = new ThemeStage(view3d, { theme, spotlight: true });

fitStageToCard(stage, view3d);
// The stage gives the view a sky; without one the card shows through wherever the logo isn't.
view3d.background = null;
// Added after the swatches, so it draws over them and pixi's hit test meets it first.
page.card.addChild(view3d);

// One enamel shared by every piece, so a swatch's single `baseColor` write repaints the whole logo. 'source' skips
// building an enamel per piece only to replace it.
const logo = await loading.load(() =>
  loadPixiLogo({ material: 'source', castShadow: false }),
);
const enamel = new EnamelMaterial();

logo.setMaterial(enamel);
view3d.root.addChild(logo.root);
// Plain pixi UI drives the 3D scene: a swatch's pointertap repaints the logo.
page.onPick((color) => (enamel.baseColor = color));

view3d.camera.fov = 40;
view3d.camera.position.set(0, 0, 7.8);

// It listens for pointer events on the view, so whatever keeps them from the view stops the orbit too. The polar
// limits keep a vertical drag to a tilt, so the logo stays in its frame.
const orbit = new OrbitCamera({
  view: view3d,
  target: { x: 0, y: -LOGO_LIFT, z: 0 },
  enableDamping: true,
  enableZoom: false,
  enablePan: false,
  minPolarAngle: 1.35,
  maxPolarAngle: 1.75,
});

// The shape a hitArea limits the view to: any pixi shape, in the view's own px measured from its anchor point. It
// follows the view's size and anchor, so it stays on the logo.
const logoArea = new Ellipse();

function placeLogoArea() {
  logoArea.x = (0.5 - view3d.anchor.x) * view3d.width;
  logoArea.y = (0.5 - view3d.anchor.y + LOGO_AREA.y) * view3d.height;
  logoArea.halfWidth = LOGO_AREA.halfWidth * view3d.height;
  logoArea.halfHeight = LOGO_AREA.halfHeight * view3d.height;
}

/** The three ways to let a tap through the view's empty space to the swatches under it, or none */
function setPointerMode(mode) {
  // Outside the shape the view isn't hit at all, so a tap reaches what's behind it. Inside, the orbit still works.
  view3d.hitArea = mode === 'logoArea' ? logoArea : null;
  // 'none' takes the view out of pixi's hit test, and with it the orbit's drags and any 3D picking.
  view3d.eventMode = mode === 'none' ? 'none' : 'static';
  // Adding a child again moves it to the end of its parent's list, the front, which pixi's hit test meets first.
  page.card.addChild(mode === 'swatchesAbove' ? page.swatches : view3d);
}

setPointerMode(OPENING_MODE);

// The card scales to fit the screen, and the view scales with it like any child, drawing at its size on screen.
page.layout(app.screen);
app.renderer.on('resize', () => page.layout(app.screen));

const pane = new ThemePane({ title: 'View in UI', stage });
const controls = createControls({
  pane,
  view3d,
  page,
  pointer: OPENING_MODE,
  setPointerMode,
});
const visuals = createVisuals({ app, view3d, stage, page, logoArea });

let time = 0;

app.ticker.add((ticker) => {
  const dt = Math.min(ticker.deltaMS / 1000, 1 / 15);

  time += dt;
  stage.update(dt);
  page.paint(stage.darkness);
  logo.root.rotation.y = Math.sin(time * SWAY_SPEED) * SWAY;
  controls.update();
  placeLogoArea();
  visuals.update();
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
page.paint(stage.darkness);
placeLogoArea();
orbit.update();
controls.update();
visuals.update();
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
