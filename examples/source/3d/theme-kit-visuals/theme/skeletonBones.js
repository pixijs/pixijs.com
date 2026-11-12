/**
 * Where a SkeletonHelper's bones run, worked out once from a skeleton's rest pose, the octahedron each bone is, and
 * how a bone is laid between two points
 */

import { Geometry3D, Matrix4, Mesh3D, Vector3 } from '@pixi/3d';

import { sharedHelperResource, upNormals } from './helpers';

/** How far along a bone its widest point sits, from the joint it leaves */
const BONE_WAIST = 0.12;

const _matrix = new Matrix4();
const [_x, _y, _z] = [new Vector3(), new Vector3(), new Vector3()];

/** A skeleton's bones by joint index, at rest in the skin's space */

/**
 * The bones in `root`'s subtree (every node's, with `root` -1): one from each joint to each joint below it, walking
 * through nodes that aren't joints, then a stub at every joint with none below it, pointing along `leafAxis`
 */
export function layBones(skeleton, root, leafAxis) {
  const { parent, joints, nodeCount } = skeleton;
  const jointOf = new Int16Array(nodeCount).fill(-1);
  const bindPoints = new Float32Array(joints.length * 3);
  const inside = new Uint8Array(nodeCount);
  const ends = [];

  joints.forEach((node, joint) => {
    jointOf[node] = joint;
    bindPoints.set(
      inverseBind(skeleton, joint).elements.subarray(12, 15),
      joint * 3,
    );
  });
  // Parents come before children, so one pass marks the subtree and finds each joint's nearest joint above it there.
  for (let node = 0; node < nodeCount; node++) {
    let above = parent[node];

    inside[node] =
      root < 0 || node === root || (above >= 0 && inside[above] === 1) ? 1 : 0;
    while (above >= 0 && inside[above] && jointOf[above] < 0)
      above = parent[above];
    if (inside[node] && jointOf[node] >= 0 && above >= 0 && inside[above])
      ends.push(jointOf[above], jointOf[node]);
  }
  // Every leaf gets a stub, hidden while `leafLength` is 0, so a later `leafLength` has one to show.
  for (let joint = 0; joint < joints.length; joint++) {
    if (
      inside[joints[joint]] &&
      !ends.some((end, i) => i % 2 === 0 && end === joint)
    )
      ends.push(joint, -1);
  }

  const axes = new Float32Array(ends.length * 3);

  for (let i = 0; i < ends.length / 2; i++) {
    const from = ends[i * 2];
    const to = ends[i * 2 + 1];
    const bind = inverseBind(skeleton, from);

    if (to < 0) _y.copyFrom(leafAxis).transformDirection(bind);
    else
      _y.fromArray(bindPoints, to * 3).subtract(
        _z.fromArray(bindPoints, from * 3),
      );
    // A bone rolls with the joint it leaves, about that joint's z, or its x when z runs along the bone.
    _x.setFromMatrixColumn(bind, 2);
    if (Math.abs(_x.dot(_y)) > 0.7 * _x.magnitude() * _y.magnitude())
      _x.setFromMatrixColumn(bind, 0);
    axes.set([_x.x, _x.y, _x.z, _y.x, _y.y, _y.z], i * 6);
  }

  return { jointOf, bindPoints, ends: Int16Array.from(ends), axes };
}

/**
 * The octahedron every bone draws: a point at the joint (y = 0), a square waist at `BONE_WAIST` and a point at y = 1;
 * the waist runs +x, -z, -x, +z, counter-clockwise seen from the far point, so every face winds outward
 */
export function boneGeometry() {
  const w = BONE_WAIST;

  return sharedHelperResource(
    'skeleton:bone',
    () =>
      new Geometry3D({
        positions: new Float32Array([
          0,
          0,
          0,
          0,
          1,
          0,
          0.5,
          w,
          0,
          0,
          w,
          -0.5,
          -0.5,
          w,
          0,
          0,
          w,
          0.5,
        ]),
        normals: upNormals(6),
        indices: new Uint16Array([
          2, 3, 1, 3, 2, 0, 3, 4, 1, 4, 3, 0, 4, 5, 1, 5, 4, 0, 5, 2, 1, 2, 5,
          0,
        ]),
      }),
  );
}

/** The first `Mesh3D` under `node`, or `node` itself, that `skeleton` deforms */
export function findSkin(node, skeleton) {
  if (node instanceof Mesh3D && node.skeleton === skeleton) return node;

  return node.children.reduce(
    (skin, child) => skin ?? findSkin(child, skeleton),
    null,
  );
}

/** Lays a bone from `start` to `end`, rolled so its x lies toward `roll`, `width` wide at its widest */
export function placeBone(bone, start, end, roll, width) {
  const length = _y.copyFrom(end).subtract(start).magnitude();

  bone.position.copyFrom(start);
  // Two joints in one place, such as a file's root joints, draw a bone with no width.
  bone.scale.set(length < 1e-6 ? 0 : width, length, width);
  if (length < 1e-6) return;
  _y.multiplyScalar(1 / length);
  _x.copyFrom(roll).addScaledVector(_y, -_y.dot(roll)).normalize();
  bone.quaternion.setFromRotationMatrix(
    _matrix.makeBasis(_x, _y, _z.copyFrom(_x).cross(_y)),
  );
}

/** A joint's rest pose in the skin's space, the inverse of its inverse bind, in a scratch matrix */
function inverseBind(skeleton, joint) {
  return _matrix.getInverse(
    _matrix.fromArray(skeleton.inverseBindMatrices, joint * 16),
  );
}
