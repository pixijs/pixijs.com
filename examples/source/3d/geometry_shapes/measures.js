/**
 * What each class's size options measure, and where their marks sit on the hero
 *
 * Every shape is centred on its origin, so a full length (`width`, `height`, `depth`) runs half each way, and a
 * `radius` or `tube` runs out from a centre. Every `height` bar sits on the side the camera sees as the shape's left,
 * where nothing else is drawn, so it reads in the same place on every class. Every radius arrow lies square to the
 * view, so it isn't foreshortened: right, or up and to the right, beside a `height` bar, and up and to the left on a
 * sphere or an icosahedron, the side its axes leave empty. These directions are worked out from the camera whenever the
 * marks are placed.
 */

import { Vector3 } from '@pixi/3d';

/** How far the torus's `arc` runs outside the ring, and the tube's own sweep outside the tube */
const ARC_GAP = 0.15;
const THETA_GAP = 0.1;
/** Where the arc's tag sits, in radians from +x: the front of the ring, or halfway along a shorter arc */
const ARC_TAG_ANGLE = 0.75;
/** How far above and below the ring's arc the torus's `radius` and `tube` tags are pinned */
const STACK = 0.09;
/** A slanted radius arrow points this far up from the screen's right or left, so it lies along no axis arrow */
const RADIUS_ANGLE = Math.PI / 4;
const SCREEN_RIGHT = { x: 1, y: 0, z: 0 };
const SCREEN_UP_RIGHT = {
  x: Math.cos(RADIUS_ANGLE),
  y: Math.sin(RADIUS_ANGLE),
  z: 0,
};
const SCREEN_UP_LEFT = {
  x: -Math.cos(RADIUS_ANGLE),
  y: Math.sin(RADIUS_ANGLE),
  z: 0,
};
const ORIGIN = { x: 0, y: 0, z: 0 };
const DOWN = { x: 0, y: -1, z: 0 };

const _origin = new Vector3();
const _right = new Vector3();
const _left = new Vector3();
const _upRight = new Vector3();
const _upLeft = new Vector3();
const _tip = new Vector3();
const _ticks = [];

/** The point `distance` out from the y axis along `direction`, at height `y` */
function offAxis(direction, distance, y, out) {
  return out
    .copyFrom(direction)
    .multiplyScalar(distance)
    .add({ x: 0, y, z: 0 });
}

/** The hero's vertex furthest along `direction`: on a sphere or an icosahedron, one `radius` from the centre */
function furthest(hero, direction, out) {
  const p = hero.geometry.positions;
  let best = -Infinity;

  for (let i = 0; i < p.length; i += 3) {
    const along =
      p[i] * direction.x + p[i + 1] * direction.y + p[i + 2] * direction.z;

    if (along > best) {
      best = along;
      out.set(p[i], p[i + 1], p[i + 2]);
    }
  }

  return out;
}

/** Lays out the marks for the hero's class from its options */
export function placeMeasures({ marks, hero, camera, shape, values: v }) {
  const x = Number(v.width) / 2;
  const y = Number(v.height) / 2;
  const z = Number(v.depth) / 2;
  const radius = Number(v.radius);
  /** A `height` bar on the shape's left, from a rim `rim` out from its axis */
  const heightBar = (rim, height, ticks) => {
    const top = { x: _left.x * rim, y: height / 2, z: _left.z * rim };

    marks.bar('height', { ...top, y: -height / 2 }, top, _left, ticks);
  };

  marks.clear(v);
  // Screen directions in the hero's own space: up and to either side, and right flattened into its x-z plane.
  hero.toLocal(ORIGIN, camera, _origin);
  hero.toLocal(SCREEN_UP_RIGHT, camera, _upRight).subtract(_origin).normalize();
  hero.toLocal(SCREEN_UP_LEFT, camera, _upLeft).subtract(_origin).normalize();
  hero.toLocal(SCREEN_RIGHT, camera, _right).subtract(_origin);
  _right.y = 0;
  _left.copyFrom(_right.normalize()).multiplyScalar(-1);

  switch (shape) {
    case 'PlaneGeometry':
      marks.bar('width', { x: -x, y: -y, z: 0 }, { x, y: -y, z: 0 }, DOWN);
      marks.bar(
        'height',
        { x: -x, y: -y, z: 0 },
        { x: -x, y, z: 0 },
        { x: -1, y: 0, z: 0 },
      );
      break;
    case 'CubeGeometry':
      // Under the two faces turned to the camera, and up the back left edge, the left of the outline.
      marks.bar('width', { x: -x, y: -y, z }, { x, y: -y, z }, DOWN);
      marks.bar('depth', { x: -x, y: -y, z: -z }, { x: -x, y: -y, z }, DOWN);
      marks.bar(
        'height',
        { x: -x, y: -y, z: -z },
        { x: -x, y, z: -z },
        { x: -Math.SQRT1_2, y: 0, z: -Math.SQRT1_2 },
      );
      break;
    case 'SphereGeometry':
    case 'IcosahedronGeometry':
      // The icosahedron's `radius` is the sphere through its corners, so the arrow ends on a corner, not a face. The x
      // and z arrows both point right, so a radius there would read as another axis.
      marks.arrow('radius', ORIGIN, furthest(hero, _upLeft, _tip));
      break;
    case 'CapsuleGeometry': {
      // `height` counts both caps, so at 2 × radius or under there's no straight part and the capsule is a sphere. The
      // bar spans the shape as built, so it then measures that sphere, not the `height` asked for.
      const straight = Math.max(0, y * 2 - 2 * radius);
      const segments = Number(v.heightSegments);

      _ticks.length = 0;
      // `heightSegments` divides only the straight part, so its ticks run between the caps.
      for (let i = 0; straight > 0 && i <= segments; i++) {
        _ticks.push(
          (radius + (straight * i) / segments) / (straight + 2 * radius),
        );
      }
      heightBar(radius, straight + 2 * radius, _ticks);
      marks.arrow(
        'radius',
        { x: 0, y: straight / 2, z: 0 },
        offAxis(_upRight, radius, straight / 2, _tip),
      );
      break;
    }
    case 'CylinderGeometry':
    case 'ConeGeometry': {
      const cone = shape === 'ConeGeometry';
      const top = cone ? 0 : Number(v.radiusTop);
      const bottom = cone ? radius : Number(v.radiusBottom);

      heightBar(Math.max(top, bottom), y * 2);
      if (!cone)
        marks.arrow(
          'radiusTop',
          { x: 0, y, z: 0 },
          offAxis(_right, top, y, _tip),
        );
      marks.arrow(
        cone ? 'radius' : 'radiusBottom',
        { x: 0, y: -y, z: 0 },
        offAxis(_right, bottom, -y, _tip),
      );
      break;
    }
    case 'TorusGeometry': {
      const tube = Number(v.tube);
      const arc = Number(v.arc);
      const outside = radius + tube + ARC_GAP;
      const angle = Math.min(ARC_TAG_ANGLE, arc / 2);
      const start = Number(v.thetaStart);
      const rim = { x: -radius, y: 0, z: 0 };
      // Both tags sit just past the tube's sweep, stacked either side of the ring's arc.
      const pin = -radius - tube - THETA_GAP;

      // The ring sweeps from +x towards +z, a turn about −y.
      marks.sweep('ring', 'arc', {
        centre: ORIGIN,
        axis: DOWN,
        from: { x: 1, y: 0, z: 0 },
        radius: outside,
        pin: {
          x: Math.cos(angle) * outside,
          y: 0,
          z: Math.sin(angle) * outside,
        },
      });
      // The tube is measured on its cross-section at −x, the one place it faces the camera clear of the x axis. A
      // ring under half a turn doesn't reach there, so only its arc is marked.
      if (arc < Math.PI) break;
      marks.arrow('radius', ORIGIN, rim, { x: pin, y: STACK, z: 0 });
      marks.arrow(
        'tube',
        rim,
        { x: -radius - tube, y: 0, z: 0 },
        { x: pin, y: -STACK, z: 0 },
        ORIGIN,
      );
      // The tube's own sweep, round that cross-section: it starts `thetaStart` from the outer edge and runs
      // `thetaLength` up over the top, a turn about −z.
      marks.sweep('tube', 'thetaLength', {
        centre: rim,
        axis: { x: 0, y: 0, z: -1 },
        from: { x: -Math.cos(start), y: Math.sin(start), z: 0 },
        radius: tube + THETA_GAP,
        pin: { x: -radius, y: tube + THETA_GAP, z: 0 },
      });
      break;
    }
    case 'TorusKnotGeometry':
      // `radius` is the circle the knot winds round; its path swings half a radius either side of it.
      marks.circle(radius);
      marks.arrow('radius', ORIGIN, { x: -radius, y: 0, z: 0 });
      break;
  }
}
