/**
 * An on-screen stick for touch: a thumb pushes the knob, and `value` reads the push, each axis -1 to 1
 *
 * It's plain pixi: a container with a round hit area that follows one pointer from its press to its release. Only that
 * pointer counts, so a second finger can drag on the view to look while the thumb walks. `index.ts` copies `value`
 * into `fpsCamera.move` each frame.
 */

import { Circle, Container, Graphics, Point } from 'pixi.js';

import { helperColorAt } from './theme/overlay';

import { BRAND, mixColor } from './theme/palette';

/** The knob's colour while a finger holds it */
const HELD_COLOR = BRAND.orange;
/** The base's and the knob's radii, and how far inside the base's edge the knob stops at a full push, in px */
const RADIUS = 56;
const KNOB_RADIUS = 22;
const KNOB_INSET = 20;
/** The stick's centre, in px in from the screen's right edge and up from its bottom edge: where a right thumb rests */
const FROM_EDGES = 96;
/** How far the stick reaches in from the screen's right and bottom edges, in px, for the plan to keep clear of it */
export const STICK_REACH = FROM_EDGES + RADIUS;
/** How far out a press still grabs the stick, in radii: a thumb lands roughly */
const GRAB = 1.5;
/** The base shows the floor through it, so it reads as part of the screen rather than the scene */
const BASE_ALPHA = 0.55;

export function createJoystick({ app, stage }) {
  const value = new Point();
  const travel = RADIUS - KNOB_INSET;
  const container = new Container({
    eventMode: 'static',
    cursor: 'pointer',
    hitArea: new Circle(0, 0, RADIUS * GRAB),
  });
  // Each part is drawn once in white and tinted, so a theme fade or a push repaints nothing.
  const base = new Graphics({ alpha: BASE_ALPHA })
    .circle(0, 0, RADIUS)
    .fill(0xffffff);
  const rim = new Graphics()
    .circle(0, 0, RADIUS)
    .stroke({ color: 0xffffff, width: 1.5 });
  const knob = new Graphics().circle(0, 0, KNOB_RADIUS).fill(0xffffff);
  const knobRing = new Graphics()
    .circle(0, 0, KNOB_RADIUS)
    .stroke({ color: 0xffffff, width: 2 });
  const painted = { darkness: -1, held: false };
  let pointerId = null;

  container.addChild(base, rim, knob, knobRing);
  app.stage.addChild(container);

  // Bottom right, with the pane and the plan, placed again on every resize.
  function place() {
    container.position.set(
      app.screen.width - FROM_EDGES,
      app.screen.height - FROM_EDGES,
    );
  }

  place();
  app.renderer.on('resize', place);

  function follow(event) {
    container.toLocal(event.global, undefined, value);
    // Screen y runs down, and a push up the screen walks forward.
    value.set(value.x / RADIUS, -value.y / RADIUS);

    const length = Math.hypot(value.x, value.y);

    if (length > 1) value.set(value.x / length, value.y / length);
  }

  function release(event) {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    value.set(0, 0);
  }

  container.on('pointerdown', (event) => {
    if (pointerId !== null) return;
    pointerId = event.pointerId;
    follow(event);
  });
  container.on('globalpointermove', (event) => {
    if (event.pointerId === pointerId) follow(event);
  });
  container
    .on('pointerup', release)
    .on('pointerupoutside', release)
    .on('pointercancel', release);

  container.onRender = () => {
    const held = pointerId !== null;
    const { darkness } = stage;

    knob.position.set(value.x * travel, -value.y * travel);
    knobRing.position.copyFrom(knob.position);
    if (darkness === painted.darkness && held === painted.held) return;
    painted.darkness = darkness;
    painted.held = held;
    base.tint = mixColor(BRAND.white, BRAND.night, darkness);
    rim.tint = helperColorAt('ink', darkness);
    // White at rest, solid orange while a finger holds it.
    knob.tint = held ? HELD_COLOR : BRAND.white;
    knobRing.tint = held ? HELD_COLOR : helperColorAt('ink', darkness);
  };

  return { value };
}
