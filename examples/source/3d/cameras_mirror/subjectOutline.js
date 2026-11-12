/**
 * Where the logo and the stand land on the screen, so the layout can keep the panels clear of them
 *
 * It projects the logo's front face, at rest, and the stand's top and foot, from the top and the bottom of the orbit
 * on the side the camera opens on, never from the camera's pose of the moment, so a screen gets the same outline
 * whenever it reaches its size.
 */

import { Matrix4, Spherical, Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

const UP = { x: 0, y: 1, z: 0 };

const _corner = new Vector3();
const _world = new Matrix4();
const _view = new Matrix4();
const _lens = new Matrix4();

export function createSubjectOutline({ orbit, logo, stand }) {
  const { camera, target } = orbit;
  const opening = new Spherical().setFromPoint3D(
    _corner.copyFrom(camera.position).subtract(target),
  );
  const eyes = [orbit.minPolarAngle, orbit.maxPolarAngle].map((phi) =>
    new Vector3()
      .setFromSpherical(new Spherical(opening.radius, phi, opening.theta))
      .add(target),
  );
  const { half } = logo;
  const { min, max } = stand.geometry.bounds3D;
  // The logo's front face, and the stand's top and foot, corner by corner round each.
  const logoFace = inWorld(logo.root, [
    { x: -half.x, y: half.y, z: half.z },
    { x: half.x, y: half.y, z: half.z },
    { x: half.x, y: -half.y, z: half.z },
    { x: -half.x, y: -half.y, z: half.z },
  ]);
  const standTop = inWorld(stand, [
    { x: min.x, y: max.y, z: min.z },
    { x: max.x, y: max.y, z: min.z },
    { x: max.x, y: max.y, z: max.z },
    { x: min.x, y: max.y, z: max.z },
  ]);
  const standFoot = inWorld(stand, [
    { x: min.x, y: min.y, z: min.z },
    { x: max.x, y: min.y, z: min.z },
    { x: max.x, y: min.y, z: max.z },
    { x: min.x, y: min.y, z: max.z },
  ]);
  const props = [logoFace, standTop, standFoot];
  // Where each prop lands on the screen from each eye.
  const shapes = eyes.flatMap(() =>
    props.map((corners) => corners.map(() => new Point())),
  );
  const onScreen = { left: 0, right: 0, top: 0, bottom: 0, foot: 0 };

  return {
    stand: onScreen,
    measure(width, height) {
      let next = 0;

      onScreen.left = onScreen.top = Infinity;
      onScreen.right = onScreen.bottom = onScreen.foot = -Infinity;
      camera.computeProjection(width / height, _lens);
      for (const eye of eyes) {
        _view.getInverse(
          _world.identity().lookAt(eye, target, UP).setPosition(eye),
        );
        for (const corners of props) {
          const shape = shapes[next++];

          for (let i = 0; i < corners.length; i++) {
            _corner
              .copyFrom(corners[i])
              .applyAffineMatrix4(_view)
              .applyMatrix4(_lens);
            shape[i].set(
              (_corner.x * 0.5 + 0.5) * width,
              (0.5 - _corner.y * 0.5) * height,
            );
          }
          for (const { x, y } of shape) {
            if (corners === standFoot)
              onScreen.foot = Math.max(onScreen.foot, y);
            if (corners !== standTop) continue;
            onScreen.left = Math.min(onScreen.left, x);
            onScreen.right = Math.max(onScreen.right, x);
            onScreen.top = Math.min(onScreen.top, y);
            onScreen.bottom = Math.max(onScreen.bottom, y);
          }
        }
      }
    },
    rightmost(top, bottom) {
      let right = -Infinity;

      for (const shape of shapes)
        right = Math.max(right, rightmostWithin(shape, top, bottom));

      return right;
    },
  };
}

/** Points in a node's space, taken to world space as the node stands now */
function inWorld(node, corners) {
  return corners.map((corner) => node.toGlobal(corner));
}

/** The most x a closed outline through `points` reaches between the heights `top` and `bottom` */
function rightmostWithin(points, top, bottom) {
  let right = -Infinity;

  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];

    if (a.y >= top && a.y <= bottom) right = Math.max(right, a.x);
    // An edge that runs across the top or the bottom meets it at a point between its corners.
    right = Math.max(right, crossing(a, b, top), crossing(a, b, bottom));
  }

  return right;
}

/** Where the edge from `a` to `b` crosses the height `y`, as an x: -Infinity when it doesn't */
function crossing(a, b, y) {
  return (a.y - y) * (b.y - y) < 0
    ? a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y)
    : -Infinity;
}
