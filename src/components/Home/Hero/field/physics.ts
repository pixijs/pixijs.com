import { FORMS, reachOnScreen, screenAxes } from './kinds';

import type { ShapeBody } from './kinds';

/** Where the pointer is and how fast it is moving, in CSS pixels relative to the hero. */
export interface PointerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Two sines per shape, so nothing in the field ever fully settles. */
const IDLE_FORCE = 26;

/**
 * The pull back to a shape's place in the composition, per pixel away from it. With {@link DRAG} it's a
 * spring a little under critical damping: a shape thrown across the hero comes home in a couple of
 * seconds, overshooting once, rather than sloshing about its place.
 */
const HOME_PULL = 1.8;

/** One block of the copy (the headline, the lede, the buttons), in CSS pixels: its centre and half extents */
export interface GuardRect {
  x: number;
  y: number;
  hx: number;
  hy: number;
}

/**
 * What the field keeps clear: the copy's blocks, each with a soft margin that pushes shapes away before
 * they reach it, `top`, the height of the bar floating over the field's top edge, as the top wall, and
 * `bottom`, the wave rising into the field from its bottom edge. One box per block rather than one round
 * the whole copy, so shapes can sit beside a short line.
 */
export interface Guard {
  rects: GuardRect[];
  top: number;
  bottom: number;
}

/**
 * How hard a block pushes at its edge, and how far past a shape's radius the push reaches. Short, so a shape the
 * poster stands a little way off the copy stays where the poster has it.
 */
const GUARD_FORCE = 430;
const GUARD_REACH = 20;

/**
 * The hard edge: each block's own box, kept this far from a shape's surface. The soft margin shapes
 * the flow and lets a hard shove through; this is the line nothing crosses.
 */
const GUARD_GAP = 8;

/** Reach past a shape's own radius, the share of pointer velocity it inherits, and the shove. */
const POINTER_REACH = 110;
const POINTER_VELOCITY_GAIN = 4.5;
const POINTER_PUSH = 120;

const DRAG = 1.6;
const RESTITUTION = 0.6;
const SPEED_LIMIT = 2400;

/**
 * How far past its place a shape that stands across an edge may be carried. The walls hold a shape inside the hero
 * unless the composition has it bleeding off a side or sunk into the wave; then the wall stands this far past its
 * place instead, out of reach of its idle wander.
 */
const BLEED_SLACK = 40;

/** Shapes further apart in depth than this pass in front of each other; closer ones collide */
const LAYER_GAP = 0.55;

/**
 * Roll: the idle drive, the pull back to the pose the shape is composed in, how long a hit's spin survives, and
 * the ceiling on it. A hit sends a shape round, a full turn if it's hard enough, and the spring then walks it
 * back to rest by the nearest way, so a pyramid knocked about never settles on its head. The spring is stiffer
 * than the idle drive is fast, which keeps the drive a sway of a few degrees rather than a wander.
 */
const SPIN_FORCE = 0.16;
const SPIN_SPRING = 2.2;
const SPIN_DRAG = 0.5;
const SPIN_LIMIT = 1.8;

/**
 * Pitch and yaw: the idle drive, the pull back to {@link ShapeBody.restPitch}, the damping on it,
 * the ceiling on how fast an axis turns, and how far from rest it may ever get. The spring is well
 * under-damped, so a hit sets a shape wobbling for a couple of swings before it settles.
 */
const TUMBLE_FORCE = 0.5;
const TUMBLE_SPRING = 5;
const TUMBLE_DRAG = 1;
const TUMBLE_LIMIT = 2.4;
const TUMBLE_RANGE = 0.7;

/** Contacts resolve a touch inside the two surfaces, which keeps shapes visually touching. */
const CONTACT = 0.98;
const IMPULSE = 1.55;
const SPIN_FROM_TANGENT = 0.0018;
const TUMBLE_FROM_IMPACT = 0.008;

const SQUASH_DECAY = 7;
const SQUASH_THRESHOLD = 150;
const SQUASH_SCALE = 2800;
const SQUASH_MAX = 0.3;

const clampSpin = (rate: number, limit: number): number => Math.min(limit, Math.max(-limit, rate));

/**
 * Rewrites screen right and screen up in a shape's own axes from the pose it is drawn in. The roll sits on the
 * shape's holder and the tumble on the mesh inside it (see `createField`), which is the order {@link screenAxes}
 * takes them in.
 */
function faceScreen(body: ShapeBody): void {
  screenAxes(body.pitch, body.yaw, body.angle, body.right, body.up);
}

/**
 * How far `body`'s surface reaches from its centre along the screen direction `(nx, ny)`, in
 * pixels. This is the whole of what one shape brings to a contact: see {@link Hull}.
 */
function reachAlong(body: ShapeBody, nx: number, ny: number): number {
  return body.radius * reachOnScreen(body.kind, body.right, body.up, nx, ny);
}

/**
 * Applies a hit: the flinch, the roll it puts on, and the tumble.
 *
 * `nx, ny` is the contact normal and `tangential` the speed the surfaces slide past each other at.
 * Roll is the only spin a hit that lands square in the screen plane can actually produce; the
 * tumble is what that hit would do arriving slightly in front of or behind the shape's centre,
 * which is a torque about the two axes across the screen rather than the one through it.
 */
function impact(body: ShapeBody, magnitude: number, nx: number, ny: number, tangential: number): void {
  if (magnitude > SQUASH_THRESHOLD) {
    body.squash = Math.max(body.squash, Math.min(SQUASH_MAX, magnitude / SQUASH_SCALE));
  }

  const tumble = magnitude * TUMBLE_FROM_IMPACT;

  body.spin = clampSpin(body.spin + tangential * SPIN_FROM_TANGENT, SPIN_LIMIT);
  body.pitchSpin = clampSpin(body.pitchSpin - ny * tumble, TUMBLE_LIMIT);
  body.yawSpin = clampSpin(body.yawSpin + nx * tumble, TUMBLE_LIMIT);
}

/** Pushes a shape out of each block's soft margin, harder the closer it is */
function pushOffCopy(body: ShapeBody, guard: Guard, dt: number): void {
  for (const rect of guard.rects) {
    const dx = body.x - Math.min(rect.x + rect.hx, Math.max(rect.x - rect.hx, body.x));
    const dy = body.y - Math.min(rect.y + rect.hy, Math.max(rect.y - rect.hy, body.y));
    const distance = Math.hypot(dx, dy);
    const zone = body.radius + GUARD_REACH;

    if (distance >= zone) continue;

    const force = (1 - distance / zone) * GUARD_FORCE * dt;
    // From inside the block, out the way its centre points
    const nx = distance > 0.001 ? dx / distance : Math.sign(body.x - rect.x) || 1;
    const ny = distance > 0.001 ? dy / distance : 0;

    body.vx += nx * force;
    body.vy += ny * force;
  }
}

/**
 * Advances the field one frame: four forces per shape, walls, then a pairwise elastic solve.
 *
 * The forces are the design's own — an idle wander, a push out of the margin round each block of
 * the copy, the pointer (which both shoves shapes away and lends them its velocity), and drag.
 * Contacts are found on the shapes themselves rather than on circles drawn around them: each pair
 * asks both hulls how far they reach along the line between their centres, so a cube's corner
 * claims the room a corner needs and its face claims no more than a face does (see {@link Hull}).
 * Collisions use inverse-area masses, so a small shape bounces off a large one rather than moving
 * it, and whatever each impulse does not spend on separating the two goes into turning them: the
 * part sliding along the contact into roll, the rest into a tumble the shape springs back out of.
 */
export function stepField(
  bodies: ShapeBody[],
  dt: number,
  elapsed: number,
  width: number,
  height: number,
  guard: Guard,
  pointer: PointerState,
): void {
  // Constant across the frame: hoisted out of the loop rather than recomputed per body.
  const drag = Math.exp(-dt * DRAG);
  const spinDrag = Math.exp(-dt * SPIN_DRAG);
  const tumbleDrag = Math.exp(-dt * TUMBLE_DRAG);
  const squashDecay = Math.exp(-dt * SQUASH_DECAY);

  for (const body of bodies) {
    body.vx += (Math.sin(elapsed * body.f1 + body.p1) * IDLE_FORCE + (body.homeX - body.x) * HOME_PULL) * dt;
    body.vy += (Math.cos(elapsed * body.f2 + body.p2) * IDLE_FORCE + (body.homeY - body.y) * HOME_PULL) * dt;

    pushOffCopy(body, guard, dt);

    const toShapeX = body.x - pointer.x;
    const toShapeY = body.y - pointer.y;
    const reach = body.radius + POINTER_REACH;
    const distance = Math.sqrt(toShapeX * toShapeX + toShapeY * toShapeY);

    if (distance < reach && distance > 0.001) {
      const falloff = 1 - distance / reach;

      body.vx += (pointer.vx * POINTER_VELOCITY_GAIN * falloff + (toShapeX / distance) * POINTER_PUSH * falloff) * dt;
      body.vy += (pointer.vy * POINTER_VELOCITY_GAIN * falloff + (toShapeY / distance) * POINTER_PUSH * falloff) * dt;
    }

    body.vx *= drag;
    body.vy *= drag;
    body.x += body.vx * dt;
    body.y += body.vy * dt;

    body.angle += body.spin * dt;
    body.spin *= spinDrag;
    body.spin +=
      (Math.sin(body.restAngle - body.angle) * SPIN_SPRING + Math.sin(elapsed * body.f1 + body.p2) * SPIN_FORCE) * dt;

    body.pitch += body.pitchSpin * dt;
    body.yaw += body.yawSpin * dt;
    body.pitchSpin *= tumbleDrag;
    body.yawSpin *= tumbleDrag;
    body.pitchSpin +=
      ((body.restPitch - body.pitch) * TUMBLE_SPRING + Math.sin(elapsed * body.f2 + body.p1) * TUMBLE_FORCE) * dt;
    body.yawSpin +=
      ((body.restYaw - body.yaw) * TUMBLE_SPRING + Math.cos(elapsed * body.f1 + body.p2) * TUMBLE_FORCE) * dt;

    // Each hit caps the rate it adds, but a shape hit again on the way out gains on every one, so
    // that ceiling does not bound the swing — a pointer dragged fast through a crowd pumps a shape
    // right past side-on. This is the bound that holds.
    const pitchOff = body.pitch - body.restPitch;
    const yawOff = body.yaw - body.restYaw;

    if (Math.abs(pitchOff) > TUMBLE_RANGE) {
      body.pitch = body.restPitch + Math.sign(pitchOff) * TUMBLE_RANGE;
      body.pitchSpin = 0;
    }
    if (Math.abs(yawOff) > TUMBLE_RANGE) {
      body.yaw = body.restYaw + Math.sign(yawOff) * TUMBLE_RANGE;
      body.yawSpin = 0;
    }

    faceScreen(body);

    // A wall is a body of infinite mass at rest, so the normal points out of the field and the
    // slide along it is whatever the shape had going the other way. How close the centre may come
    // is whatever the shape reaches that way, which is a corner on some frames and a face on others
    // — worth asking only once the shape is near enough an edge for the answer to change anything.
    const span = body.radius * FORMS[body.kind].reach;
    const floor = height - guard.bottom;

    if (body.x < span || body.x > width - span || body.y < guard.top + span || body.y > floor - span) {
      const left = Math.min(reachAlong(body, -1, 0), body.homeX - BLEED_SLACK);
      const right = Math.max(width - reachAlong(body, 1, 0), body.homeX + BLEED_SLACK);
      const top = Math.min(guard.top + reachAlong(body, 0, -1), body.homeY - BLEED_SLACK);
      const bottom = Math.max(floor - reachAlong(body, 0, 1), body.homeY + BLEED_SLACK);

      if (body.x < left) {
        body.x = left;
        if (body.vx < 0) {
          impact(body, -body.vx, -1, 0, body.vy);
          body.vx = -body.vx * RESTITUTION;
        }
      }
      if (body.x > right) {
        body.x = right;
        if (body.vx > 0) {
          impact(body, body.vx, 1, 0, -body.vy);
          body.vx = -body.vx * RESTITUTION;
        }
      }
      if (body.y < top) {
        body.y = top;
        if (body.vy < 0) {
          impact(body, -body.vy, 0, -1, -body.vx);
          body.vy = -body.vy * RESTITUTION;
        }
      }
      if (body.y > bottom) {
        body.y = bottom;
        if (body.vy > 0) {
          impact(body, body.vy, 0, 1, body.vx);
          body.vy = -body.vy * RESTITUTION;
        }
      }
    }

    const speed = Math.sqrt(body.vx * body.vx + body.vy * body.vy);

    if (speed > SPEED_LIMIT) {
      body.vx *= SPEED_LIMIT / speed;
      body.vy *= SPEED_LIMIT / speed;
    }
    body.squash *= squashDecay;
  }

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];

      if (Math.abs(a.depth - b.depth) > LAYER_GAP) continue;

      const span = a.radius * FORMS[a.kind].reach + b.radius * FORMS[b.kind].reach;

      let dx = b.x - a.x;
      let dy = b.y - a.y;
      const squared = dx * dx + dy * dy;

      // Compared squared first, against the most the two could ever reach: the pairs that are
      // nowhere near each other, which is nearly all of them, cost this and nothing more.
      if (squared >= span * span) continue;

      let distance = Math.sqrt(squared);

      if (distance < 0.001) {
        distance = 0.001;
        dx = 1;
        dy = 0;
      }

      const nx = dx / distance;
      const ny = dy / distance;
      // What each shape's own surface leaves between the two centres, rather than a circle's worth.
      const minimum = (reachAlong(a, nx, ny) + reachAlong(b, -nx, -ny)) * CONTACT;

      if (distance >= minimum) continue;

      const overlap = minimum - distance;
      // Inverse-area masses: a marble bounces off a boulder rather than shifting it.
      const inverseA = 1 / (a.radius * a.radius);
      const inverseB = 1 / (b.radius * b.radius);
      const total = inverseA + inverseB;

      a.x -= nx * overlap * (inverseA / total);
      a.y -= ny * overlap * (inverseA / total);
      b.x += nx * overlap * (inverseB / total);
      b.y += ny * overlap * (inverseB / total);

      const closing = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;

      if (closing >= 0) continue;

      const magnitude = (-IMPULSE * closing) / total;

      a.vx -= magnitude * inverseA * nx;
      a.vy -= magnitude * inverseA * ny;
      b.vx += magnitude * inverseB * nx;
      b.vy += magnitude * inverseB * ny;

      const tangential = (b.vx - a.vx) * -ny + (b.vy - a.vy) * nx;

      impact(a, -closing, nx, ny, tangential);
      impact(b, -closing, -nx, -ny, -tangential);
    }
  }

  for (const body of bodies) for (const rect of guard.rects) holdOffCopy(body, rect);
}

/**
 * Puts a shape that has reached the copy back on the guard's hard edge and takes away the speed it
 * had going in. Runs after the contacts, so neither a shove from the pointer nor a pile-up behind a
 * shape can push it over the text.
 */
function holdOffCopy(body: ShapeBody, rect: GuardRect): void {
  const left = rect.x - rect.hx;
  const right = rect.x + rect.hx;
  const top = rect.y - rect.hy;
  const bottom = rect.y + rect.hy;
  let dx = body.x - Math.min(right, Math.max(left, body.x));
  let dy = body.y - Math.min(bottom, Math.max(top, body.y));
  let distance = Math.hypot(dx, dy);

  // A centre inside the box leaves by the nearest side
  if (distance < 0.001) {
    const exits = [body.x - left, right - body.x, body.y - top, bottom - body.y];
    const side = exits.indexOf(Math.min(...exits));

    distance = -exits[side];
    dx = side === 0 ? -1 : side === 1 ? 1 : 0;
    dy = side === 2 ? -1 : side === 3 ? 1 : 0;
  } else {
    dx /= distance;
    dy /= distance;
  }

  const clearance = reachAlong(body, -dx, -dy) + GUARD_GAP;

  if (distance >= clearance) return;

  body.x += dx * (clearance - distance);
  body.y += dy * (clearance - distance);

  const inward = body.vx * dx + body.vy * dy;

  if (inward < 0) {
    body.vx -= inward * dx;
    body.vy -= inward * dy;
  }
}
