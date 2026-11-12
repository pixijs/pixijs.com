/**
 * The drag that turns the logo like a ball rolled under the hand, the coast that carries a flick on after the release,
 * and the readout of how far the logo's front is turned from the camera
 */

import { Quaternion } from '@pixi/3d';

import { DEG_TO_RAD, Point, RAD_TO_DEG } from 'pixi.js';

/** Radians the logo turns per px of drag, half a degree: a drag across the 1280 × 720 view turns it about once round */
const TURN_PER_PX = 0.5 * DEG_TO_RAD;
/**
 * How long, in s, a move counts in the pointer's average speed: about the last three moves at 60 Hz, enough to smooth
 * one uneven move without lagging behind a flick
 */
const SPEED_MEMORY = 0.05;
/** A release more than this long, in s, after the pointer last moved follows a pause, not a flick, so it won't coast */
const PAUSE = 0.05;
/**
 * The coast's speed halves every 0.2 s, so a hard flick settles in about a second and a half and a gentle one in about
 * one: slow enough to read as heavy glass, quick enough that a flick never runs away from the reader
 */
const COAST_HALF_LIFE = 0.2;
/** The speed, in radians per second, where the coast stops: under a tenth of a px a frame at the logo's tips */
const REST_SPEED = 1 * DEG_TO_RAD;

/**
 * Turns `node` as the pointer drags inside the view, like a ball rolled under the hand: each move turns it about the
 * screen axis square to the move, so the side facing the camera follows the pointer however the node is already
 * turned, with no stop any way
 *
 * Each move pre-multiplies `node.quaternion`, turning the node about its parent's axes, which a level camera on the z
 * axis sees as the screen's. The turn lives in the quaternion, so `node.angle` goes stale. Euler angles can't do
 * this: once a tip about x stands the node's own up towards the camera, a turn about it rolls the node in the screen.
 *
 * A flick keeps it turning: let go while the pointer moves and the node coasts on about the last axis at the pointer's
 * speed, slowing smoothly to rest. A press stops it at once. A drag goes on wherever the pointer moves
 * (`globalpointermove`) and ends wherever it's let go (`pointerupoutside`).
 */
export function turnByDrag({ view3d, node, ticker, onTurn }) {
  const last = new Point();
  // The pointer's average speed over its last few moves, in px per second.
  const velocity = new Point();
  const axis = { x: 0, y: 0, z: 0 };
  const step = new Quaternion();
  let lastTime = 0;
  let pointerId = -1;
  let coastSpeed = 0;

  function turnBy(angle) {
    // Normalized, so the float error of many small turns doesn't build up.
    node.quaternion.premultiply(step.setFromAxisAngle(axis, angle)).normalize();
    onTurn();
  }

  // A move right turns about +y and a move down about +x; both carry the side facing the camera along with it.
  function aimAxis(dx, dy, length) {
    axis.x = dy / length;
    axis.y = dx / length;
  }

  function coast({ deltaMS }) {
    const keep = 0.5 ** (deltaMS / 1000 / COAST_HALF_LIFE);

    // The angle the falling speed sweeps over the frame, not speed × time, so a flick coasts as far at any frame rate.
    turnBy((coastSpeed * (1 - keep) * COAST_HALF_LIFE) / Math.LN2);
    coastSpeed *= keep;
    if (coastSpeed < REST_SPEED) stopCoast();
  }

  function stopCoast() {
    coastSpeed = 0;
    ticker.remove(coast);
  }

  function grab(e) {
    if (pointerId !== -1) return;
    stopCoast();
    pointerId = e.pointerId;
    last.copyFrom(e.global);
    lastTime = e.timeStamp;
    velocity.set(0, 0);
    view3d.cursor = 'grabbing';
  }

  function turn(e) {
    if (e.pointerId !== pointerId) return;
    const dx = e.global.x - last.x;
    const dy = e.global.y - last.y;
    const dt = (e.timeStamp - lastTime) / 1000;
    const distance = Math.hypot(dx, dy);

    last.copyFrom(e.global);
    lastTime = e.timeStamp;
    if (dt > 0) {
      // Weighted by how long the move took, so the average forgets older moves at the same rate however often the
      // pointer reports; the first move after a pause took long, so it all but replaces the speed from before it.
      const weight = 1 - Math.exp(-dt / SPEED_MEMORY);

      velocity.x += (dx / dt - velocity.x) * weight;
      velocity.y += (dy / dt - velocity.y) * weight;
    }
    if (distance === 0) return;
    aimAxis(dx, dy, distance);
    turnBy(distance * TURN_PER_PX);
  }

  function drop(e) {
    if (e.pointerId !== pointerId) return;
    pointerId = -1;
    view3d.cursor = 'grab';
    // Held still before the release: the pointer had stopped, however fast it moved before.
    if ((e.timeStamp - lastTime) / 1000 > PAUSE) return;
    const speed = Math.hypot(velocity.x, velocity.y);

    if (speed * TURN_PER_PX < REST_SPEED) return;
    coastSpeed = speed * TURN_PER_PX;
    aimAxis(velocity.x, velocity.y, speed);
    ticker.add(coast);
  }

  view3d.cursor = 'grab';
  view3d.on('pointerdown', grab);
  view3d.on('globalpointermove', turn);
  view3d.on('pointerup', drop);
  view3d.on('pointerupoutside', drop);
  view3d.on('pointercancel', drop);

  return { stopCoast };
}

/**
 * How far a node's front, its own +z, is turned from a camera straight down the z axis, in degrees: 0 head-on, 90
 * edge-on, 180 its back to the camera
 */
export function turnedAway(rotation) {
  const { x, y } = rotation;
  // The z part of +z turned by the quaternion; clamped, since float error can carry it a hair past ±1.
  const facing = Math.min(1, Math.max(-1, 1 - 2 * (x * x + y * y)));

  return Math.acos(facing) * RAD_TO_DEG;
}
