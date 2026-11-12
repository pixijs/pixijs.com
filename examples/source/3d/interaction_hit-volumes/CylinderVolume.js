/**
 * A hit shape of your own: an upright cylinder round the node's local y axis, as an `IHitVolume3D`
 *
 * The picker moves the ray into the node's space before it calls `raycast`, so the maths never sees the node's
 * position, turn or scale. One analytic test fits a round mesh exactly, where `'geometry'` would test every triangle.
 */

/** Below this a ray counts as parallel to the wall or the caps, which it then can't cross */
const PARALLEL = 1e-9;

/**
 * A capped cylinder centred on the node's origin, standing along its local y axis
 * @example
 * ```ts
 * puck.eventMode = 'static';
 * puck.hitVolume = new CylinderVolume({ radius: 0.4, halfHeight: 0.3 });
 * ```
 */
export class CylinderVolume {
  radius;
  halfHeight;

  constructor({ radius, halfHeight }) {
    this.radius = radius;
    this.halfHeight = halfHeight;
  }

  /** The farthest point from the origin is a rim, so the picker's broadphase sphere reaches it and no farther */
  get boundingRadiusSq() {
    return this.radius * this.radius + this.halfHeight * this.halfHeight;
  }

  /** The nearest crossing of the wall or a cap ahead of the ray's origin, filled in as the engine's own shapes do */
  raycast(localRay, out) {
    const t = Math.min(
      this._wall(localRay),
      this._cap(localRay, this.halfHeight),
      this._cap(localRay, -this.halfHeight),
    );

    if (t === Infinity) return -1;
    localRay.at(t, out.point);
    out.distance = t;
    // No triangles, so no surface data: the picker reads -1 as "none".
    out.normal.set(0, 0, 0);
    out.uv.set(0, 0);
    out.triangleIndex = -1;

    return t;
  }

  /** Only read when this volume clips the node's children, as every hitVolume you set does; it picks without it */
  containsPoint(localPoint) {
    const { x, y, z } = localPoint;

    return (
      x * x + z * z <= this.radius * this.radius &&
      Math.abs(y) <= this.halfHeight
    );
  }

  /** Where the ray crosses `x² + z² = r²` between the caps, solved as a quadratic in t; Infinity for neither root */
  _wall({ origin, direction }) {
    const a = direction.x * direction.x + direction.z * direction.z;

    if (a < PARALLEL) return Infinity;

    const b = origin.x * direction.x + origin.z * direction.z;
    const c =
      origin.x * origin.x + origin.z * origin.z - this.radius * this.radius;
    const discriminant = b * b - a * c;

    if (discriminant < 0) return Infinity;

    const root = Math.sqrt(discriminant);

    // The far root is the way out, which counts when the ray starts inside, as for the engine's Box and Sphere.
    return Math.min(
      this._between(origin, direction, (-b - root) / a),
      this._between(origin, direction, (-b + root) / a),
    );
  }

  /** `t` when it's ahead of the origin and its point lies between the caps, else Infinity */
  _between(origin, direction, t) {
    return t >= 0 && Math.abs(origin.y + t * direction.y) <= this.halfHeight
      ? t
      : Infinity;
  }

  /** Where the ray crosses the cap plane at height `y`, when that point lies inside the radius; else Infinity */
  _cap({ origin, direction }, y) {
    if (Math.abs(direction.y) < PARALLEL) return Infinity;

    const t = (y - origin.y) / direction.y;
    const x = origin.x + t * direction.x;
    const z = origin.z + t * direction.z;

    return t >= 0 && x * x + z * z <= this.radius * this.radius ? t : Infinity;
  }
}
