/**
 * The props and the motion the lesson doesn't teach: a clay cube carried round a ring by a turning container, both
 * rings' turn at the pane's speed, and the layout that lays the rings out for the screen
 */

import { Container3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { CLAY } from './theme/palette';

import { clayGeometry } from './theme/shapes';

/** The two cubes, by their clay colour */
export const CUBE_NAMES = ['pink', 'sky'];

/** How high the cubes ride, so the ring and the plume's base read clear of the floor and the shadow lies apart */
const RIDE_HEIGHT = 0.9;

/**
 * How far a cube reaches below its ring and past the ring's front as it goes round: its half-width of 0.4 down, and
 * ahead a little more, for a corner turning past the front
 */
export const CUBE_REACH = { below: 0.4, ahead: 0.45 };

/**
 * Where each ring's centre lies on the floor. Side by side, far enough apart that the cubes pass clear of the world
 * axes. Stacked, the pink ring behind the world axes, which the camera sees from lower, so its plume stands clear of
 * the cube, and the sky ring in front, seen from higher, so its trail lies open along the ring. The sky ring is as
 * near the axes as lets its sparks, at the back of the ring, stay under them; the pink ring is far enough back that
 * on screen its placard lies nearly twice as far from the axes below as from the ring above, so it reads as the ring's.
 */
const RING_PLACES = {
  side: { pink: { x: -2.5, z: 0 }, sky: { x: 2.5, z: 0 } },
  stacked: { pink: { x: 0, z: -4.5 }, sky: { x: 0, z: 4.9 } },
};
/**
 * Each layout's view: the point the camera turns about and how far it looks down at it, and how far the rings reach
 * from that point, in world units at its depth: `across` to either side, out to an x arrow's tip, `above` to the
 * plume tops and `below` to the lowest a cube reaches, which the placards hang under.
 *
 * Side by side, the camera looks about 25° down, so the rings read as ellipses and the trail lies across the near
 * side. Stacked, it looks 45° down, so the rings part on screen by more than the plumes rise.
 */
const VIEWS = {
  side: {
    target: { x: 0, y: 1.45, z: 0 },
    pitch: 0.435,
    across: 5.5,
    above: 1.7,
    below: 1.95,
  },
  stacked: {
    target: { x: 0, y: 1, z: 0.75 },
    pitch: Math.PI / 4,
    across: 3.2,
    above: 5.05,
    below: 5.9,
  },
};
/** The px the placards take under the lowest a cube reaches: visuals.ts's 8 px gap, a 19 px tag and a 16 px margin */
const TAG_ROOM = 43;
/** The side-by-side view's distance on a 16:9 screen: the framing the example is designed at, and the closest */
const SIDE_DISTANCE = 9.5;

/** A ring and the cube that goes round it: turn `centre.rotation.y` and the cube goes round */

/** A clay cube on a ring at `RIDE_HEIGHT`; {@link layoutRings} puts the ring's centre in its place */
export function createRing({ color, radius, parent }) {
  const centre = new Container3D({
    label: 'ring',
    position: { x: 0, y: RIDE_HEIGHT, z: 0 },
    parent,
  });
  // Kept at scale 1: a scaled parent scales a local system's offsets, speed and gravity but not its sparks' size, and
  // the two systems must differ only in space.
  const cube = new Mesh3D({
    label: 'cube',
    geometry: clayGeometry('cube'),
    material: clayMaterial(color),
    position: { x: radius, y: 0, z: 0 },
    parent: centre,
  });

  return { centre, cube, radius, color: CLAY[color] };
}

/** How the rings lie right now; {@link layoutRings} writes it */

/**
 * Lays the rings side by side on a wide screen and one behind the other on a tall one, frames them, and follows resizes
 *
 * Side by side on a tall screen, both rings would fit only from far off, so stacked they show about twice as large.
 * The camera comes as close as lets the rings fit across the screen and down the band under `clearTop`, and the view
 * grows past the screen's edge so its middle, where the target lands, moves down when the rings would otherwise reach
 * the pane, as `fitPortrait` does. The orbit's limits and the fog scale with the camera's distance. A change of
 * layout puts the camera back on that layout's view; a resize within one keeps the reader's orbit.
 */
export function layoutRings({
  renderer,
  view3d,
  orbit,
  stage,
  rings,
  clearTop,
}) {
  const { minDistance, maxDistance } = orbit;
  const { near, far } = stage.fog;
  // Half the view's height, in world units, one unit in front of the camera.
  const halfHeight = Math.tan((view3d.camera.fov * Math.PI) / 360);
  const layout = { stacked: false };
  let distance = 0;

  /** Puts each ring in its place, and the camera on the layout's view at `next` from its target */
  const place = (stacked, next) => {
    const places = stacked ? RING_PLACES.stacked : RING_PLACES.side;
    const { target, pitch } = stacked ? VIEWS.stacked : VIEWS.side;

    for (const name of CUBE_NAMES) {
      rings[name].centre.position.x = places[name].x;
      rings[name].centre.position.z = places[name].z;
    }
    orbit.target.set(target.x, target.y, target.z);
    view3d.camera.position.set(
      target.x,
      target.y + next * Math.sin(pitch),
      target.z + next * Math.cos(pitch),
    );
    orbit.update();
  };

  const refit = () => {
    const { width, height } = renderer.screen;
    const stacked = height > width;
    const view = stacked ? VIEWS.stacked : VIEWS.side;
    // Px per world unit at the target: as many as fit across and down the band, and never more than the designed view.
    const pxPerUnit = Math.min(
      stacked ? Infinity : height / (2 * SIDE_DISTANCE * halfHeight),
      width / 2 / view.across,
      (height - clearTop - TAG_ROOM) / (view.above + view.below),
    );
    // The target stays at the screen's middle unless the rings would reach the pane or the placards the bottom edge.
    const targetY = Math.min(
      Math.max(height / 2, clearTop + pxPerUnit * view.above),
      height - TAG_ROOM - pxPerUnit * view.below,
    );
    const viewHeight = 2 * Math.max(targetY, height - targetY);
    const next = viewHeight / (2 * pxPerUnit * halfHeight);
    const scale = next / SIDE_DISTANCE;

    // The limits first, so backing off isn't clamped to the old ones.
    orbit.minDistance = minDistance * scale;
    orbit.maxDistance = maxDistance * scale;
    if (distance === 0 || stacked !== layout.stacked) place(stacked, next);
    // `zoom` takes a factor towards the target, so one under 1 moves the camera out.
    else if (next !== distance) orbit.zoom(distance / next);
    layout.stacked = stacked;
    distance = next;
    stage.fog.near = near * scale;
    stage.fog.far = far * scale;
    view3d.setSize(width, viewHeight);
    view3d.position.y = targetY - viewHeight / 2;
  };

  refit();
  renderer.on('resize', refit);

  return layout;
}

/** Both rings' turn: the pane binds `speed`, and `step(dt)` moves the rings on */

/** Turns the rings together, from `warmUp` seconds back, so they reach `firstFrameAngle` on the first frame */
export function createRingMotion(rings, { speed, firstFrameAngle, warmUp }) {
  let angle = firstFrameAngle - speed * warmUp;
  const motion = {
    speed,
    step(dt) {
      angle += motion.speed * dt;
      for (const name of CUBE_NAMES) rings[name].centre.rotation.y = angle;
    },
  };

  return motion;
}
