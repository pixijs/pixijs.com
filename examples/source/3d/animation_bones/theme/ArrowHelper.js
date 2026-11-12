/**
 * An arrow between two points, for a direction, an offset or a vector
 *
 * A shaft and a head on the kit's shared geometry, two draws. `arrow.set(from, to)` runs it between two points in its
 * parent's space, moving and turning the node itself, so it's cheap to call every frame.
 */

import { Vector3 } from '@pixi/3d';

import { Helper } from './Helper';

import { HEAD_LENGTH, HEAD_WIDTH, helperGeometry } from './helpers';

/** Options for {@link ArrowHelper} */

const UP = { x: 0, y: 1, z: 0 };
const _direction = new Vector3();

/** An arrow between two points in its parent's space; see {@link ArrowHelper#set} */
export class ArrowHelper extends Helper {
  _shaft;
  _head;
  _from = new Vector3();
  _to = new Vector3();
  _thickness = 0.04;

  constructor({ thickness = 0.04, head = true, ...options } = {}) {
    super(options, 'accent');

    this._thickness = thickness;
    this._shaft = this._addPart(helperGeometry('shaft'));
    this._head = head ? this._addPart(helperGeometry('head')) : null;
    this._to.copyFrom(this.position).add(UP);
    this.set(this.position, this._to);
  }

  /** The shaft's width; the head scales with it. Setting it redraws the last {@link ArrowHelper#set} */
  get thickness() {
    return this._thickness;
  }
  set thickness(value) {
    if (value === this._thickness) return;
    this._thickness = value;
    this.set(this._from, this._to);
  }

  /** Runs the arrow from `from` to `to`, both in its parent's space; the head's tip lands on `to` */
  set(from, to) {
    this._from.copyFrom(from);
    this._to.copyFrom(to);
    _direction.copyFrom(to).subtract(from);

    const length = _direction.magnitude();
    const shown = length > 1e-6;

    this.position.copyFrom(from);
    this._showPart(this._shaft, shown);
    if (this._head) this._showPart(this._head, shown);
    if (!shown) return this;

    // The shaft and head are built along +y, so turning +y onto the direction aims the whole arrow.
    this.quaternion.setFromUnitVectors(
      UP,
      _direction.multiplyScalar(1 / length),
    );

    const radius = this._thickness / 2;
    const headLength = this._head
      ? Math.min(this._thickness * HEAD_LENGTH, length / 2)
      : 0;
    const shaftLength = length - headLength;

    this._shaft.scale.set(radius, shaftLength, radius);
    this._shaft.position.y = shaftLength / 2;
    if (this._head) {
      this._head.scale.set(
        radius * HEAD_WIDTH,
        headLength,
        radius * HEAD_WIDTH,
      );
      this._head.position.y = shaftLength + headLength / 2;
    }

    return this;
  }
}
