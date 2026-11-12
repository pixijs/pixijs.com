/**
 * How an InsetView's camera meets its picture: a world point projected into it, a fit of the camera to points, and
 * the world size of a px
 *
 * Each reads the camera's pose with `getGlobalTransform` and its projection with `computeProjection` at the picture's
 * aspect, the way FrustumHelper reads its camera. None reads `camera.viewProjection`, which the view rebuilds only at
 * render, so marks on a camera moved this tick don't trail a frame.
 */

import { Matrix4, Vector3 } from '@pixi/3d';

import { DEG_TO_RAD } from 'pixi.js';

/** The margins, in px, that a fit leaves round the points: one for every side, or each side's own */

const _matrix = new Matrix4();
const _right = new Vector3();
const _up = new Vector3();
const _back = new Vector3();
const _eye = new Vector3();
const _point = new Vector3();
const _margin = { top: 0, right: 0, bottom: 0, left: 0 };

/** A world point through `camera` into global px on `picture`; `null` behind a perspective camera */
export function projectToPicture(camera, picture, point, out) {
  _point
    .copyFrom(point)
    .applyAffineMatrix4(camera.getGlobalTransform(_matrix).getInverse(_matrix));
  if (camera.mode === 'perspective' && _point.z >= 0) return null;
  _point.applyMatrix4(
    camera.computeProjection(picture.width / picture.height, _matrix),
  );

  return out.set(
    picture.x + (_point.x + 1) * 0.5 * picture.width,
    picture.y + (1 - _point.y) * 0.5 * picture.height,
  );
}

/** World units per screen px on `picture`, at `depth` in front of a perspective camera */
export function unitsPerPixel(camera, picture, depth) {
  if (camera.mode === 'orthographic')
    return (2 * camera.orthographicSize) / camera.zoom / picture.width;

  return (
    (2 * depth * Math.tan((camera.fov * DEG_TO_RAD) / 2)) /
    camera.zoom /
    picture.height
  );
}

/**
 * Moves `camera` along its current direction so `points` fill `picture` less `margin` px, and sets its near and far
 * to span them generously; an orthographic camera fits with `orthographicSize`, a perspective one with distance. It
 * returns the depth in front of the camera of the points' middle, for {@link unitsPerPixel}.
 */
export function fitCamera(camera, picture, points, margin) {
  const { width, height } = picture;
  const sides = typeof margin === 'number' ? evenMargin(margin) : margin;
  // The inner rect's edges in clip space; on a perspective camera each one moves out with depth by tan(half fov).
  const x0 = (2 * sides.left) / width - 1;
  const x1 = Math.max(x0 + 1e-3, 1 - (2 * sides.right) / width);
  const y0 = (2 * sides.bottom) / height - 1;
  const y1 = Math.max(y0 + 1e-3, 1 - (2 * sides.top) / height);
  const perspective = camera.mode === 'perspective';
  const tanY = perspective
    ? Math.tan((camera.fov * DEG_TO_RAD) / 2) / camera.zoom
    : 0;
  const tanX = (tanY * width) / height;
  let left = 0,
    right = 0,
    bottom = 0,
    top = 0,
    near = 0,
    far = 0;

  camera.getGlobalTransform(_matrix).extractBasis(_right, _up, _back);
  camera.getGlobalPosition(_eye);
  _right.normalize();
  _up.normalize();
  _back.normalize();
  // A point lands on the left edge when x - cx = x0 tanX (cz - z), so each edge bounds cx + slope × cz.
  for (let i = 0; i < points.length; i++) {
    const x = _right.dot(_point.copyFrom(points[i]).subtract(_eye));
    const y = _up.dot(_point);
    const z = _back.dot(_point);

    left = i ? Math.min(left, x + x0 * tanX * z) : x + x0 * tanX * z;
    right = i ? Math.max(right, x + x1 * tanX * z) : x + x1 * tanX * z;
    bottom = i ? Math.min(bottom, y + y0 * tanY * z) : y + y0 * tanY * z;
    top = i ? Math.max(top, y + y1 * tanY * z) : y + y1 * tanY * z;
    near = i ? Math.max(near, z) : z;
    far = i ? Math.min(far, z) : z;
  }

  const extent = Math.max(right - left, top - bottom, near - far, 1e-3);
  const half = Math.max(
    (right - left) / (x1 - x0),
    ((top - bottom) / (y1 - y0)) * (width / height),
    1e-4,
  );
  const cz = perspective
    ? Math.max(
        (right - left) / ((x1 - x0) * tanX),
        (top - bottom) / ((y1 - y0) * tanY),
        near + extent / 4,
      )
    : near + extent;

  _eye.addScaledVector(
    _right,
    (left + right - (x0 + x1) * (perspective ? tanX * cz : half)) / 2,
  );
  _eye.addScaledVector(
    _up,
    (bottom +
      top -
      (y0 + y1) * (perspective ? tanY * cz : (half * height) / width)) /
      2,
  );
  _eye.addScaledVector(_back, cz);
  if (camera.parent) camera.parent.toLocal(_eye, undefined, camera.position);
  else camera.position.copyFrom(_eye);
  if (!perspective) camera.orthographicSize = half * camera.zoom;
  camera.near = (cz - near) / 2;
  camera.far = (cz - far) * 2 + extent;

  return cz - (near + far) / 2;
}

/** The same margin on every side, in a reused object */
function evenMargin(margin) {
  _margin.top = _margin.right = _margin.bottom = _margin.left = margin;

  return _margin;
}
