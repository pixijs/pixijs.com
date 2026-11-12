/**
 * The line work a {@link LightHelper} draws, written into its {@link BarsGeometry} in place: a directional light's
 * rays, a spot's lamp and cone, and a point light's rings
 *
 * Each writer takes the bars, the sizes it last wrote into them (four slots of the helper's `built`, NaN at first)
 * and the sizes to draw, and writes and uploads only when one of them differs. So the helper keeps only placement
 * and colour, and a frame where nothing changed size writes nothing.
 */

import { HEAD_LENGTH, HEAD_WIDTH } from './helpers';

/** Bars round each ring; enough that the widest ring still reads as a circle */
export const RING_SEGMENTS = 48;
/** The spot's lamp (a body and its lip), axis and four edge lines, which come before its rings */
const SPOT_LINES = 7;
/** The bars a spot's cone needs: its lines and both rings */
export const SPOT_BARS = SPOT_LINES + RING_SEGMENTS * 2;
/** The spot's inner ring's width, as a share of the outer's, so the two read apart where they nearly meet */
const INNER_RING = 0.6;
/** The widest cone drawn, in degrees: the rings' radius runs off to infinity at 90 */
const MAX_CONE = 85;
/**
 * The spot's lamp in line widths: a wide body behind the light and a short lip flaring from it along the beam, a can
 * light's shape. Its flat back and square shoulders keep it from reading as an arrowhead aimed at the light. A short
 * cone shrinks the lip to at most `LAMP_SHARE` of its length.
 */
const LAMP = { body: 7, radius: 3.5, lip: 3, mouth: 5 };
const LAMP_SHARE = 0.4;

/**
 * Writes `rays` arrows along local -z, `spread` apart across local y and centred on y = 0, each `length` long with its
 * tip on z = 0 and its head in the same bars
 */
export function setRays(bars, built, rays, spread, length, thickness) {
  if (!changed(built, 0, spread, length, thickness, 0)) return;
  const head = Math.min(thickness * HEAD_LENGTH, length / 2);

  for (let i = 0; i < rays; i++) {
    const y = (i - (rays - 1) / 2) * spread;

    bars.setBar(i * 2, 0, y, length, 0, y, head, thickness / 2);
    bars.setBar(
      i * 2 + 1,
      0,
      y,
      head,
      0,
      y,
      0,
      (thickness * HEAD_WIDTH) / 2,
      0,
    );
  }
  bars.count = rays * 2;
  bars.update();
}

/**
 * Writes a spot's lamp at the light, its axis and four edge lines along local -z to `length`, and its rings there:
 * the outer at `coneAngle` (in degrees) and, with a `penumbra`, a thinner inner one where full strength ends
 */
export function setCone(bars, built, length, thickness, coneAngle, penumbra) {
  if (!changed(built, 0, length, thickness, coneAngle, penumbra)) return;
  const cone = (Math.min(coneAngle, MAX_CONE) * Math.PI) / 180;
  const outer = length * Math.tan(cone);
  const inner = length * Math.tan(cone * (1 - penumbra));
  const unit = Math.min(thickness, (length * LAMP_SHARE) / LAMP.lip);
  const half = thickness / 2;

  bars.count = SPOT_LINES + RING_SEGMENTS * (penumbra > 0 ? 2 : 1);
  bars.setBar(0, 0, 0, 0, 0, 0, unit * LAMP.body, unit * LAMP.radius);
  bars.setBar(
    1,
    0,
    0,
    0,
    0,
    0,
    -unit * LAMP.lip,
    unit * LAMP.radius,
    unit * LAMP.mouth,
  );
  // The edges meet the rim at local ±x and ±y.
  bars.setBar(2, 0, 0, 0, 0, 0, -length, half);
  bars.setBar(3, 0, 0, 0, outer, 0, -length, half);
  bars.setBar(4, 0, 0, 0, -outer, 0, -length, half);
  bars.setBar(5, 0, 0, 0, 0, outer, -length, half);
  bars.setBar(6, 0, 0, 0, 0, -outer, -length, half);
  setRing(bars, SPOT_LINES, outer, -length, false, half);
  if (penumbra > 0)
    setRing(
      bars,
      SPOT_LINES + RING_SEGMENTS,
      inner,
      -length,
      false,
      half * INNER_RING,
    );
  bars.update();
}

/**
 * Writes a point light's ring part from slot `at` of `built`: one ring of `radius` at `offset` (see {@link setRing}),
 * or no bars at 0. Returns whether it has bars to draw.
 */
export function setPointRing(bars, built, at, radius, offset, flat, half) {
  if (changed(built, at, radius, radius > 0 ? offset : 0, half, 0)) {
    bars.count = radius > 0 ? RING_SEGMENTS : 0;
    if (radius > 0) setRing(bars, 0, radius, offset, flat, half);
    bars.update();
  }

  return radius > 0;
}

/** Whether any of the four values from slot `at` of `last` differs from the ones given, which `last` then takes */
function changed(last, at, a, b, c, d) {
  if (
    last[at] === a &&
    last[at + 1] === b &&
    last[at + 2] === c &&
    last[at + 3] === d
  )
    return false;
  last[at] = a;
  last[at + 1] = b;
  last[at + 2] = c;
  last[at + 3] = d;

  return true;
}

/** Writes a ring of bars from bar `first`: round local z at z = `offset`, or with `flat`, round y at y = `offset` */
function setRing(bars, first, radius, offset, flat, half) {
  const step = (Math.PI * 2) / RING_SEGMENTS;

  for (let k = 0; k < RING_SEGMENTS; k++) {
    const ax = Math.cos(k * step) * radius;
    const ay = Math.sin(k * step) * radius;
    const bx = Math.cos((k + 1) * step) * radius;
    const by = Math.sin((k + 1) * step) * radius;

    if (flat) bars.setBar(first + k, ax, offset, ay, bx, offset, by, half);
    else bars.setBar(first + k, ax, ay, offset, bx, by, offset, half);
  }
}
