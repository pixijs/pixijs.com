/**
 * Where the ray inset's camera stands, what it frames and where it cuts
 *
 * It looks back across the main camera's view from its right, swung round toward the ray's far end, so the hit and
 * the shapes round it draw large and the main camera small in the distance. It draws only a slab round the ray's end:
 * its near plane cuts away the shapes in front, so none hides the hit, and falls between shapes rather than through
 * one. It's part of the ray inset `rayInset.ts` builds, in a file of its own to keep both short.
 */

import { Matrix4, Vector3 } from '@pixi/3d';

/** The side camera's field of view, in degrees: wide, so it stands close to the ray's end and the shapes there read */
const SIDE_FOV = 60;
/**
 * How far the side camera swings from square-on toward the ray's far end, so it sees the ray at a slant: the hit end
 * is nearer it and draws larger, and the main camera's end smaller
 */
const SWING = (60 * Math.PI) / 180;
/**
 * The swing in the wide, short picture docked along a phone's bottom: nearer square-on, so the ray lies across the
 * picture and the view volume reads, rather than drawing a few px wide under the pointer's dot
 */
const NARROW_SWING = (35 * Math.PI) / 180;
/** The side camera's tilt below level, so the floor reads as a band the shapes stand on */
const TILT = (10 * Math.PI) / 180;
/**
 * How far the picture's bottom edge drops per unit of depth in front of the camera, so it meets the floor at a depth
 * of the camera's height over this
 */
const BOTTOM_DROP =
  Math.sin(TILT) + Math.tan((SIDE_FOV * Math.PI) / 360) * Math.cos(TILT);
/** How far in front of the ray's end the near plane cuts, in world units: about a shape's width */
const CUT_DEPTH = 1;
/**
 * The nearest the cut comes to the ray's end, in world units, when it moves to fall between shapes: any nearer and it
 * would open the shapes the faint line runs into
 */
const CUT_CLOSEST = 0.5;
/**
 * How far behind the ray's end the side camera still draws, in world units: past the field, so the floor is a band,
 * and short of the main camera's eye
 */
const BEHIND_END = 5;
/** The near plane at its nearest, in world units, so a cut never reaches the camera itself */
const MIN_NEAR = 0.05;
/** Seconds the framing takes to close half the gap to the ray's end, so it zooms smoothly as the end jumps */
const FRAME_HALF_LIFE = 0.3;
/** Room round what the picture frames, in px: over the eye for its tag, and round the line's end for the field */
const MARGIN = { top: 40, right: 36, bottom: 20, left: 30 };

/** The ray the side camera frames, in world space */

const _level = new Vector3();
const _look = new Vector3();
const _aim = new Vector3();
const _step = new Vector3();
const _offset = new Vector3();
const _middle = new Vector3();
const _matrix = new Matrix4();
const _axisX = new Vector3();
const _axisY = new Vector3();
const _axisZ = new Vector3();

export function createSideCamera({ inset, shapes, ray }) {
  // A same-scene inset always has a camera.
  const camera = inset.camera;
  const framedFar = new Vector3();
  const farFloor = new Vector3();
  // The view volume's eye and end face, the point the framing eases toward the line's far end, and the floor under it.
  const framed = [ray.eye, ...ray.face, framedFar, farFloor];
  // Each shape's depth in front of the camera and how far it reaches either side of that, measured every frame.
  const depths = new Float64Array(shapes.length);
  const reaches = new Float64Array(shapes.length);
  let placed = false;

  camera.fov = SIDE_FOV;

  /** How far in front of the camera a world point lies, along the way it looks */
  function depthOf(point) {
    return _offset.copyFrom(point).subtract(camera.position).dot(_look);
  }

  /** Measures `shape`'s box along the way the camera looks into slot `i`: how deep its middle is, and how far it reaches */
  function measure(shape, i) {
    const { min, max } = shape.geometry.bounds3D;

    shape.getGlobalTransform(_matrix).extractBasis(_axisX, _axisY, _axisZ);
    depths[i] = depthOf(
      _middle
        .copyFrom(min)
        .add(max)
        .multiplyScalar(0.5)
        .applyAffineMatrix4(_matrix),
    );
    // A box reaches along a direction by its half sizes, each weighted by how far its own axis points that way.
    reaches[i] =
      (Math.abs(_axisX.dot(_look)) * (max.x - min.x) +
        Math.abs(_axisY.dot(_look)) * (max.y - min.y) +
        Math.abs(_axisZ.dot(_look)) * (max.z - min.z)) /
      2;
  }

  /** The shape `target` is, from the field's own list, so it reads as a Mesh3D */
  function shapeOf(target) {
    for (const shape of shapes) if (shape === target) return shape;

    return null;
  }

  /**
   * The cut nearest `want`, and no deeper than `limit`, that slices the fewest shapes, so it drops or keeps each shape
   * whole: single-sided clay cut open shows a hollow rim that reads like a ring helper. The candidates are `want` and
   * each shape's front and back.
   */
  function cutBetweenShapes(want, limit, struck) {
    let count = 0;

    for (const shape of shapes) if (shape !== struck) measure(shape, count++);

    let best = want;
    let bestSliced = sliced(want, count);
    let bestGap = 0;

    for (let k = 0; k < count * 2; k++) {
      const i = k >> 1;
      const cut = depths[i] + (k & 1 ? -reaches[i] : reaches[i]);
      const gap = Math.abs(cut - want);

      if (cut > limit || cut < MIN_NEAR) continue;

      const through = sliced(cut, count);

      if (through > bestSliced || (through === bestSliced && gap >= bestGap))
        continue;
      best = cut;
      bestSliced = through;
      bestGap = gap;
    }

    return Math.max(MIN_NEAR, best);
  }

  /** How many of the first `count` shapes measured a cut at `depth` passes through */
  function sliced(depth, count) {
    let through = 0;

    for (let i = 0; i < count; i++)
      if (depth > depths[i] - reaches[i] && depth < depths[i] + reaches[i])
        through++;

    return through;
  }

  return {
    place(target, dt) {
      const swing = inset.narrow ? NARROW_SWING : SWING;

      _level.set(ray.forward.x, 0, ray.forward.z).normalize();
      _look
        .copyFrom(ray.right)
        .multiplyScalar(-Math.cos(swing))
        .addScaledVector(_level, -Math.sin(swing))
        .multiplyScalar(Math.cos(TILT));
      _look.y = -Math.sin(TILT);
      camera.lookAt(_aim.copyFrom(camera.position).add(_look));
      // Eased, so the picture zooms smoothly when the line's end jumps between a shape and the far floor.
      const ease = placed ? 1 - 0.5 ** (dt / FRAME_HALF_LIFE) : 1;

      framedFar.addScaledVector(
        _step.copyFrom(ray.far).subtract(framedFar),
        ease,
      );
      placed = true;
      farFloor.set(framedFar.x, 0, framedFar.z);
      inset.frame(framed, MARGIN);

      // The cut keeps the struck shape and the faint line past it whole, whichever of the two is nearer. On a miss
      // there's no shape to keep clear, so it stops where the picture's bottom edge meets the floor, and the floor
      // runs to the bottom rather than ending in mid-air.
      const struck = shapeOf(target);
      const nearest = Math.min(depthOf(ray.end), depthOf(ray.far));
      let deepest = camera.position.y / BOTTOM_DROP;

      if (struck) {
        measure(struck, 0);
        deepest = depths[0] - reaches[0];
      }

      camera.near = cutBetweenShapes(
        Math.min(nearest - CUT_DEPTH, deepest),
        Math.min(nearest - CUT_CLOSEST, deepest),
        struck,
      );
      camera.far = depthOf(ray.end) + BEHIND_END;
    },
  };
}
