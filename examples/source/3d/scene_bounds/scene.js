/** The props: the logo's enamel, the swarm and its flocking, and the layout that lines the three boxes up for the screen */

import { Container3D, Mesh3D, Vector3 } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { EnamelMaterial } from './theme/EnamelMaterial';
import { NARROW_BELOW } from './theme/overlay';
import { clayGeometry } from './theme/shapes';

/** Gives every mesh under `node` one kit enamel, so the raw logo file looks like the collection's logo */
export function wearEnamel(node, enamel = new EnamelMaterial()) {
  if (node instanceof Mesh3D) node.material = enamel;
  for (const child of node.children) wearEnamel(child, enamel);
}

const SWARM_SHAPES = ['sphere', 'cube', 'octahedron', 'pyramid'];
/** Each shape's scale; a clay shape is about a unit across, so a turned one reaches 0.1 from its middle */
const SHAPE_SCALE = 0.13;
/** How far the flock's centre wanders on each axis, and how fast, in radians a second */
const WANDER = { x: 0.25, y: 0.12, z: 0.1 };
const WANDER_RATE = { x: 0.23, y: 0.31, z: 0.19 };
/** The flock's radius gathers to the first and spreads to the second, once every 14 s */
const SPREAD = [0.45, 0.75];
const SPREAD_RATE = 0.45;
/** The flock is flatter than it is wide */
const FLATTEN = 0.6;
/** The slowest and fastest a shape circles the flock's centre, in radians a second */
const CIRCLE_RATE = { min: 0.3, max: 0.7 };
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
/**
 * Steps of two sequences that never repeat: the golden ratio's fractional part, and one over the plastic number (the
 * real root of x³ = x + 1). Stepping by each in turn spreads a shape's reach and its circling rate evenly, and neither
 * follows its height on the sphere or the other.
 */
const REACH_STEP = (Math.sqrt(5) - 1) / 2;
const RATE_STEP = 1 / 1.324718;

/**
 * The box the flock never leaves. On each axis it reaches at most the centre's wander, plus the widest spread
 * (flattened in y), plus a turned shape; over two minutes it reaches 1.07 of 1.1 in x, 0.65 of 0.7 in y and 0.93 of
 * 1.0 in z.
 */
export const SWARM_EXTENT = { x: 2.2, y: 1.4, z: 2 };

/** A flock of small lilac clay shapes under one container, which is the model the lesson measures */
export function createSwarm(count) {
  const swarm = new Container3D({ label: 'swarm' });

  for (let i = 0; i < count; i++) {
    swarm.addChild(
      new Mesh3D({
        geometry: clayGeometry(SWARM_SHAPES[i % SWARM_SHAPES.length], 'low'),
        material: clayMaterial('lilac'),
        scale: SHAPE_SCALE,
        rotation: { x: i * 0.7, y: i * 1.3, z: 0 },
        // The batcher draws the 160 into the shadow map in four draws, one per SWARM_SHAPES entry. They don't receive,
        // so the flock doesn't speckle itself.
        receiveShadow: false,
      }),
    );
  }

  return swarm;
}

/**
 * Moves the flock: its centre wanders, it spreads and gathers, and each shape circles the centre at its own rate
 *
 * Each shape's direction comes from its index on a Fibonacci sphere, so the function keeps no state.
 */
export function moveSwarm(swarm, time) {
  const { children } = swarm;
  const count = children.length;
  const cx = WANDER.x * Math.sin(WANDER_RATE.x * time);
  const cy = WANDER.y * Math.sin(WANDER_RATE.y * time);
  const cz = WANDER.z * Math.sin(WANDER_RATE.z * time);
  const spread =
    SPREAD[0] +
    ((SPREAD[1] - SPREAD[0]) * (1 - Math.cos(SPREAD_RATE * time))) / 2;

  for (let i = 0; i < count; i++) {
    const up = 1 - (2 * (i + 0.5)) / count;
    const across = Math.sqrt(1 - up * up);
    // A cube root fills the ball evenly.
    const reach = spread * Math.cbrt(((i + 0.5) * REACH_STEP) % 1);
    const rate =
      CIRCLE_RATE.min +
      (CIRCLE_RATE.max - CIRCLE_RATE.min) * ((i * RATE_STEP) % 1);
    const angle = i * GOLDEN_ANGLE + time * rate;

    children[i].position.set(
      cx + reach * across * Math.cos(angle),
      cy + reach * up * FLATTEN,
      cz + reach * across * Math.sin(angle),
    );
  }
}

/** The camera's turn round y from +z toward +x, and its tilt down, so each cube shows its front, right and top */
const YAW = (28 * Math.PI) / 180;
const PITCH = (23 * Math.PI) / 180;
/**
 * The camera's distance from the target. The camera is orthographic, so the distance changes nothing on screen, but
 * from far back the view's bottom edge stays above the floor down to a low tilt.
 */
const DISTANCE = 60;
/** How deep the fog runs, as in the kit's 12 to 40; it starts at the target, so the cubes stay clear */
const FOG_DEPTH = 28;
/** How far above the floor the view's bottom edge stays at the lowest tilt and the widest zoom-out */
const FLOOR_CLEARANCE = 0.5;
/** How high the boxes stand, so the fit cubes' bottom bars clear the floor */
const LIFT = 0.06;
/** The largest box the layout leaves room for, the Box size row's 2.2, plus its bars */
const PEAK = 2.3;
/** A peak cube's width and height on screen, in world units, seen from this camera */
const ACROSS = PEAK * (Math.cos(YAW) + Math.sin(YAW));
const TALL =
  PEAK * (Math.cos(PITCH) + Math.sin(PITCH) * (Math.cos(YAW) + Math.sin(YAW)));
/**
 * Px a row leaves free at each end and between its cubes, and a column either side and between; the gaps and the
 * bottom hold the tag under a cube
 */
const ROW = { side: 40, gap: 60, bottom: 64 };
const COLUMN = { side: 16, gap: 48, bottom: 56 };
/** Under this height the pane folds to its title bar, as under NARROW_BELOW wide */
const SHORT_BELOW = 500;
/** Px a layout leaves free at the top for the pane: open, it reaches 260 px down; folded, its title bar 36 */
const PANE_CLEAR = { open: 272, folded: 60 };

const _right = new Vector3(Math.cos(YAW), 0, -Math.sin(YAW));
const _target = new Vector3();

/**
 * Lines the boxes up in a row across a wide screen, or stacks them in a column on a tall one, and frames the
 * orthographic camera on them, again on each of the renderer's resizes
 *
 * The pane and the tags are fixed in pixels, so each layout keeps px room for them and scales the cubes into what's
 * left. The row runs along the camera's right, so it lies straight across the screen. Each layout also sets how low the
 * orbit may tilt, and whether the stage's key casts shadows.
 */
export function followLayout({ renderer, orbit, stage, slots }) {
  const { camera } = orbit;
  const count = slots.length;
  const last = count - 1;

  stage.fog.near = DISTANCE;
  stage.fog.far = DISTANCE + FOG_DEPTH;

  const layout = () => {
    const { width, height } = renderer.screen;
    const row = width >= height;
    const top =
      width < NARROW_BELOW || height < SHORT_BELOW
        ? PANE_CLEAR.folded
        : PANE_CLEAR.open;
    const { side, gap, bottom } = row ? ROW : COLUMN;
    let pxPerUnit;
    /** The height on screen, in world units, from the lowest box's floor to the middle of the boxes */
    let middle;

    // A column stands its boxes in the air, where their shadows would land far off to the side.
    stage.key.castShadow = row;
    if (row) {
      pxPerUnit = Math.min(
        (width - 2 * side - last * gap) / (count * ACROSS),
        (height - top - bottom) / TALL,
      );

      const spacing = ACROSS + gap / pxPerUnit;

      // The middle box stands on the origin, so the row centres on it.
      for (let i = 0; i < count; i++) {
        const along = (i - last / 2) * spacing;

        slots[i].position.set(_right.x * along, LIFT, _right.z * along);
      }
      middle = (PEAK * Math.cos(PITCH)) / 2;
    } else {
      pxPerUnit = Math.min(
        (width - 2 * side) / ACROSS,
        (height - top - bottom - last * gap) / (count * TALL),
      );

      // A step straight up the y axis rises on screen by its length times the tilt's cosine.
      const step = (TALL + gap / pxPerUnit) / Math.cos(PITCH);

      // The first box on top, the last on the floor.
      for (let i = 0; i < count; i++)
        slots[i].position.set(0, LIFT + (last - i) * step, 0);
      middle = ((last * step + PEAK) / 2) * Math.cos(PITCH);
    }

    // Up by the boxes' middle, then by however far the room's middle sits below the screen's.
    _target.set(
      0,
      LIFT + (middle + (top - bottom) / 2 / pxPerUnit) / Math.cos(PITCH),
      0,
    );
    camera.orthographicSize = width / (2 * pxPerUnit);

    // An orthographic view is a box, not a cone, so tilted low its bottom edge starts under the floor and the floor
    // stops in a hard line. That edge stands at target.y + DISTANCE · sin(pitch) − halfHeight · cos(pitch); solving
    // for FLOOR_CLEARANCE at the widest zoom-out gives the lowest pitch.
    const halfHeight =
      (camera.orthographicSize * height) / width / orbit.minZoom;
    const lowest =
      Math.atan2(halfHeight, DISTANCE) +
      Math.asin(
        (FLOOR_CLEARANCE - _target.y) / Math.hypot(DISTANCE, halfHeight),
      );

    orbit.maxPolarAngle = Math.PI / 2 - lowest;
    orbit.target.copyFrom(_target);
    camera.position.set(
      _target.x + DISTANCE * Math.cos(PITCH) * Math.sin(YAW),
      _target.y + DISTANCE * Math.sin(PITCH),
      _target.z + DISTANCE * Math.cos(PITCH) * Math.cos(YAW),
    );
    orbit.update();
  };

  layout();
  renderer.on('resize', layout);
}
