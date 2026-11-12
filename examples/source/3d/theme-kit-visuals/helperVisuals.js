/**
 * The helpers that mark a node, a point or a span: axes and an angle on the turning cube, a frame and a ghost on the
 * leaning capsule, a dot and an arrow at a point on the ball, a ring at each tap on the puck, a path round the
 * orrery, a span over the stretching block and a grid under it, and points on the gem's vertices
 */

import { Vector3 } from '@pixi/3d';

import { AngleHelper } from './theme/AngleHelper';
import { ArrowHelper } from './theme/ArrowHelper';
import { AxesHelper } from './theme/AxesHelper';
import { BoxHelper } from './theme/BoxHelper';
import { DimensionHelper } from './theme/DimensionHelper';
import { DotHelper } from './theme/DotHelper';
import { GhostHelper } from './theme/GhostHelper';
import { GridHelper } from './theme/GridHelper';
import { PathHelper } from './theme/PathHelper';
import { PointsHelper } from './theme/PointsHelper';
import { RingHelper } from './theme/RingHelper';
import { visual } from './galleryVisual';

import { ORBIT_HEIGHT, ORBIT_RADIUS } from './scene';

const UP = { x: 0, y: 1, z: 0 };
const PLUS_X = { x: 1, y: 0, z: 0 };
/** How far from the ball's centre the dot sits: 0.5 at the ball's scale of 1.15, past its clay sphere's 0.45 */
const BALL_RADIUS = 0.575;
/** Seconds between taps on the puck, and the radius of the circle on its top they land in */
const TAP_EVERY = 1.4;
const TAP_SPREAD = 0.25;
/** The puck's top: its clay is 0.6 tall, standing 0.3 up */
const PUCK_TOP = 0.6;
/** The clay cube's edge, which the block's scale stretches */
const CUBE_EDGE = 0.8;
/**
 * How far over the block's top the span floats. Lifted off the grid and drawn in accent, it reads as a measure of the
 * block rather than one more grid line, and it shows on the white block in either theme.
 */
const SPAN_LIFT = 0.16;
/** Seconds between the frame's flashes, and how long each lasts: how a helper lights up */
const FLASH_EVERY = 6;
const FLASH = 1.2;

export function createHelperVisuals(scene, tags, widen) {
  const { stations } = scene;

  // The cube's own axes, drawn through it, and the turn it has made about y.
  const axes = new AxesHelper({
    length: 0.85,
    thickness: 0.02 * widen,
    xray: true,
    parent: scene.cube,
  });
  const angle = new AngleHelper({
    radius: 0.95,
    thickness: 0.02 * widen,
    position: { x: 0, y: 0.02, z: 0 },
    parent: stations.turn,
  });

  angle.setAxis(UP, PLUS_X);

  // The capsule's box, leaning with it, and a ghost of the upright pose it started in.
  const ghost = new GhostHelper({
    source: scene.capsule,
    parent: stations.lean,
  });
  const frame = new BoxHelper({
    fill: 0.1,
    thickness: 0.015 * widen,
    parent: scene.capsule,
  }).setBox(scene.capsule.geometry.bounds3D);

  // A point wandering over the ball's front, its normal, and a ring at each tap on the puck.
  const dot = new DotHelper({
    color: 'accent',
    outline: true,
    radius: 0.06 * widen,
    parent: stations.hit,
  });
  const normal = new ArrowHelper({
    thickness: 0.025 * widen,
    parent: stations.hit,
  });
  const ring = new RingHelper({
    radius: 0.2,
    thickness: 0.03 * widen,
    parent: stations.tap,
  });

  // The moon's orbit, and the trail it leaves.
  const orbitPath = new PathHelper({
    closed: true,
    thickness: 0.015 * widen,
    position: { x: 0, y: ORBIT_HEIGHT, z: 0 },
    parent: stations.orbit,
  }).setPoints(PathHelper.circle(ORBIT_RADIUS));
  const trail = new PathHelper({
    color: 'accent',
    thickness: 0.045 * widen,
    capacity: 60,
    taper: true,
    parent: stations.orbit,
  });

  // The block's width, in quarters, over it, and a grid of quarter units under it.
  const grid = new GridHelper({
    size: { width: 2.2, depth: 1.8 },
    step: 0.25,
    thickness: 0.01 * widen,
    parent: stations.measure,
  });
  const span = new DimensionHelper({
    color: 'accent',
    divisions: 4,
    thickness: 0.015 * widen,
    parent: stations.measure,
  });

  // Every vertex of the gem, in one draw.
  const points = new PointsHelper({
    positions: scene.gem.geometry.positions,
    radius: 0.025 * widen,
    parent: scene.gem,
  });

  const hitPoint = new Vector3();
  const hitNormal = new Vector3();
  const hitTip = new Vector3();
  const tapPoint = new Vector3();
  const moonPoint = new Vector3();
  const spanFrom = new Vector3();
  const spanTo = new Vector3();
  let time = 0;

  return {
    visuals: [
      visual('AxesHelper', 'Helpers', [axes], tags.add('turn', 'AxesHelper')),
      visual(
        'AngleHelper',
        'Helpers',
        [angle],
        tags.add('turn', 'AngleHelper'),
      ),
      visual('BoxHelper', 'Helpers', [frame], tags.add('lean', 'BoxHelper')),
      visual(
        'GhostHelper',
        'Helpers',
        [ghost],
        tags.add('lean', 'GhostHelper'),
      ),
      visual('DotHelper', 'Helpers', [dot], tags.add('hit', 'DotHelper')),
      visual(
        'ArrowHelper',
        'Helpers',
        [normal],
        tags.add('hit', 'ArrowHelper'),
      ),
      visual(
        'RingHelper',
        'Lines and points',
        [ring],
        tags.add('tap', 'RingHelper'),
      ),
      visual(
        'PathHelper',
        'Lines and points',
        [orbitPath, trail],
        tags.add('orbit', 'PathHelper'),
      ),
      visual(
        'GridHelper',
        'Lines and points',
        [grid],
        tags.add('measure', 'GridHelper'),
      ),
      visual(
        'DimensionHelper',
        'Lines and points',
        [span],
        tags.add('measure', 'DimensionHelper'),
      ),
      visual(
        'PointsHelper',
        'Lines and points',
        [points],
        tags.add('vertices', 'PointsHelper'),
      ),
    ],
    update(dt) {
      time += dt;
      angle.radians = scene.cube.rotation.y;
      frame.color = time % FLASH_EVERY > FLASH_EVERY - FLASH ? 'accent' : 'ink';

      // A point on the ball, along a normal that wanders over its front.
      const lon = 0.8 * Math.sin(time * 0.6);
      const lat = 0.2 + 0.4 * Math.sin(time * 0.43);

      hitNormal.set(
        Math.sin(lon) * Math.cos(lat),
        Math.sin(lat),
        Math.cos(lon) * Math.cos(lat),
      );
      hitPoint
        .copyFrom(scene.ball.position)
        .addScaledVector(hitNormal, BALL_RADIUS);
      hitTip.copyFrom(hitPoint).addScaledVector(hitNormal, 0.55);
      dot.position.copyFrom(hitPoint);
      normal.set(hitPoint, hitTip);

      // Each tap lands somewhere new on the puck's top, and its ring grows from it.
      const tap = Math.floor(time / TAP_EVERY);
      const since = (time % TAP_EVERY) / TAP_EVERY;

      tapPoint.set(
        Math.cos(tap * 2.4) * TAP_SPREAD,
        PUCK_TOP,
        Math.sin(tap * 2.4) * TAP_SPREAD,
      );
      ring.place(tapPoint, UP);
      ring.scale.set(0.5 + since * 0.9);

      // The moon's place in the orrery's space: the pivot turns it about y, from +x.
      const turn = scene.pivot.rotation.y;

      moonPoint.set(
        Math.cos(turn) * ORBIT_RADIUS,
        ORBIT_HEIGHT,
        -Math.sin(turn) * ORBIT_RADIUS,
      );
      trail.push(moonPoint, 0.04);

      // Along the block's front top edge, as wide as the block as it stretches.
      const { position, scale } = scene.block;
      const half = (scale.x * CUBE_EDGE) / 2;
      const top = position.y + (scale.y * CUBE_EDGE) / 2 + SPAN_LIFT;
      const front = (scale.z * CUBE_EDGE) / 2;

      span.set(spanFrom.set(-half, top, front), spanTo.set(half, top, front));
    },
  };
}
