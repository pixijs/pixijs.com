/**
 * Where a bone is and how to aim one, read from the skeleton's flat arrays, and the fox rig's own facts
 *
 * A skeleton stores each bone's position, rotation and scale relative to its parent bone. So a bone's pose is the
 * walk up `skeleton.parent` composing them, and a rotation written to a bone turns it in its parent's space: to point
 * the head at something, the target goes into the neck's space first.
 */

import { Matrix4, Quaternion, Vector3 } from '@pixi/3d';

/** This rig's bones run along their own +x, so the head's +x points down the snout; a Blender export would use +y */
export const ALONG_BONE = { x: 1, y: 0, z: 0 };
/** Turning the first tail bone about its own −z lifts the tail */
export const TAIL_LIFT_AXIS = { x: 0, y: 0, z: -1 };

const _local = new Matrix4();
const _parent = new Matrix4();
const _position = new Vector3();
const _scale = new Vector3();
const _toTarget = new Vector3();
const _facing = new Vector3();
const _rotation = new Quaternion();
const _turn = new Quaternion();

/** A node's current pose in the skeleton's space, which is the space of the skinned mesh's parent */
export function getBoneTransform(skeleton, node, out) {
  out.identity();
  // Parents come before children, so walking up `parent` ends at a root (-1).
  for (let i = node; i !== -1; i = skeleton.parent[i]) {
    _local.compose(
      _position.fromArray(skeleton.localPosition, i * 3),
      _rotation.fromArray(skeleton.localRotation, i * 4),
      _scale.fromArray(skeleton.localScale, i * 3),
    );
    out.premultiply(_local);
  }

  return out;
}

/**
 * The local rotation that turns `bone` from its pose `from` until its `axis` points at `target`, a point in the
 * skeleton's space
 */
export function aimRotation(skeleton, bone, from, axis, target, out) {
  // A bone turns in its parent's space, so the target goes into that space, measured from the bone's joint.
  getBoneTransform(skeleton, skeleton.parent[bone], _parent).getInverse(
    _parent,
  );
  _toTarget
    .copyFrom(target)
    .applyAffineMatrix4(_parent)
    .subtract(_position.fromArray(skeleton.localPosition, bone * 3))
    .normalize();

  // Where `axis` points now, with the bone at `from`, and the shortest turn from there onto the target.
  _turn.setFromUnitVectors(
    _facing.copyFrom(axis).applyQuaternion(from),
    _toTarget,
  );

  // The turn comes after `from`, about the parent's axes.
  return out.copyFrom(_turn).multiply(from);
}
