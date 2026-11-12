/**
 * A see-through ink copy of a node's meshes at a pose, for "before" in a before and after
 *
 * At construction it copies every `Mesh3D` under `source` (skipping helpers), sharing each geometry and keeping each
 * copy's transform relative to `source`, with no shadows. Its own `position`, `quaternion`, `scale` and `origin` start
 * as the source's, and are yours to write after: leave them for the pose the source had, or set another. A fade is
 * `ghost.opacity = …` each frame, which writes the ghost's own material in place. It never draws in a pass: it's
 * see-through, and the solid pass shader can't blend.
 */

import { Matrix4, Mesh3D, Quaternion, Vector3 } from '@pixi/3d';

import { Helper } from './Helper';

import { GHOST_OPACITY } from './helpers';

/** Options for {@link GhostHelper} */

const _sourceInverse = new Matrix4();
const _relative = new Matrix4();
const _position = new Vector3();
const _quaternion = new Quaternion();
const _scale = new Vector3();

/** A see-through copy of `source`'s meshes; one draw per mesh copied */
export class GhostHelper extends Helper {
  constructor({ source, opacity = GHOST_OPACITY, ...options }) {
    super({ ...options, opacity, pass: null }, 'ink');

    // Working out the source's world transform first also brings its quaternion up to date with its rotation.
    _sourceInverse.getInverse(source.getGlobalTransform(_relative));
    this.position.copyFrom(source.position);
    this.quaternion.copyFrom(source.quaternion);
    this.scale.copyFrom(source.scale);
    this.origin.copyFrom(source.origin);
    this._copy(source);
  }

  /** Always `null`: a ghost draws in the main view only */
  get pass() {
    return null;
  }
  set pass(_value) {}

  _copy(node) {
    if (node instanceof Helper) return;
    if (node instanceof Mesh3D) {
      const copy = this._addPart(node.geometry);

      // The copy sits where the mesh sits in the source's space.
      _sourceInverse.multiply(node.getGlobalTransform(_relative), _relative);
      _relative.decompose(_position, _quaternion, _scale);
      copy.position.copyFrom(_position);
      copy.quaternion.copyFrom(_quaternion);
      copy.scale.copyFrom(_scale);
    }
    for (const child of node.children) this._copy(child);
  }
}
