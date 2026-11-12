/** A skinned model's current pose as a stick figure over the skin, every rig's bones in one shared geometry */

import { Matrix4, Vector3 } from '@pixi/3d';

import { Helper } from './Helper';

import { HelperMaterial } from './HelperMaterial';
import { helperMaterial } from './helpers';

import { boneGeometry, findSkin, layBones, placeBone } from './skeletonBones';

/** Options for {@link SkeletonHelper} */

/** How much wider a highlighted bone draws */
const HIGHLIGHT_WIDTH = 1.6;
/** Floats per joint in `Skeleton.worldMatrix`: three rows of four */
const SKIN_FLOATS = 12;

const _matrix = new Matrix4();
const [_start, _end, _x, _z] = [
  new Vector3(),
  new Vector3(),
  new Vector3(),
  new Vector3(),
];

/**
 * A skeleton's current pose as a stick figure: a bone from each joint to each joint below it, and a stub past a joint
 * with none below it
 *
 * Each bone is an octahedron, widest just past the joint it leaves and pointed at the next, so the wide end marks the
 * joint and the point shows which way the chain runs. Every index it takes is a node index, as `skeleton.indexOf`
 * returns it; a node `skeleton.joints` doesn't list is only walked through. Call {@link SkeletonHelper#update} each
 * frame once the pose has changed; it reads the skin's current transform, so it's right before the first render.
 *
 * ```ts
 * const rig = new SkeletonHelper({ skeleton, space: fox, root: skeleton.indexOf('b_Hip_01'), parent: view3d.root });
 *
 * rig.highlight(skeleton.indexOf('b_Head_05'), 'accent');
 * app.ticker.add(() => rig.update());
 * ```
 */
export class SkeletonHelper extends Helper {
  _skeleton;
  _skin;
  _thickness = 0.05;
  _leafLength = 0.2;
  // The bones' layout at rest, as BoneLayout describes it.
  _jointOf;
  _bindPoints;
  _ends;
  _axes;
  _bones = [];
  _lit = [];
  /** Highlight materials of its own, one per lit joint, which take a new opacity or colour in place */
  _litMaterials = [];
  /** The `xray` setting the highlight materials were made for */
  _litXray = true;
  /** The skin's space to the helper's, as the last update read it */
  _skinToHelper = new Matrix4();

  constructor({
    skeleton,
    space,
    root = -1,
    leafAxis = { x: 0, y: 1, z: 0 },
    ...options
  }) {
    const {
      thickness = 0.05,
      leafLength = 0.2,
      opacity = 0.9,
      xray = true,
      ...rest
    } = options;

    super({ opacity, xray, ...rest }, 'ink');

    const skin = findSkin(space, skeleton);

    if (!skin)
      throw new Error(
        'SkeletonHelper: no Mesh3D under `space` uses this skeleton',
      );

    const bones = layBones(skeleton, root, leafAxis);

    this._skeleton = skeleton;
    this._skin = skin;
    this._thickness = thickness;
    this._leafLength = leafLength;
    this._jointOf = bones.jointOf;
    this._bindPoints = bones.bindPoints;
    this._ends = bones.ends;
    this._axes = bones.axes;
    for (let i = 0; i < this._ends.length / 2; i++) {
      this._bones.push(this._addPart(boneGeometry()));
      this._lit.push(null);
      if (this._ends[i * 2 + 1] < 0)
        this._showPart(this._bones[i], leafLength > 0);
    }
    this.update();
  }

  /** Each bone's width at its widest, in the helper's units; settable, e.g. wider once a phone backs the camera off */
  get thickness() {
    return this._thickness;
  }
  set thickness(value) {
    this._thickness = value;
    this._place();
  }

  /** How long a leaf joint's stub is, in the helper's units; 0 hides the stubs */
  get leafLength() {
    return this._leafLength;
  }
  set leafLength(value) {
    this._leafLength = value;
    for (let i = 0; i < this._bones.length; i++) {
      if (this._ends[i * 2 + 1] < 0) this._showPart(this._bones[i], value > 0);
    }
    this._place();
  }

  /** Places every bone at the skeleton's current pose; call it each frame once the pose has changed */
  update() {
    // A bone bound with `bindContainerBone` takes its container's values only here.
    this._skeleton.updateWorld();
    this.getGlobalTransform(this._skinToHelper).getInverse(this._skinToHelper);
    this._skinToHelper.multiply(this._skin.getGlobalTransform(_matrix));
    this._place();

    return this;
  }

  /**
   * Draws the bones leaving joint `node`, or its stub, in `color` and 1.6 times as wide; `null` restores them. Throws
   * for a node that isn't a joint or isn't in `root`'s subtree. The rig stays one run, so it's still one draw on WebGL;
   * WebGPU draws a run once per change of colour along the depth order, and as one only past 16.
   */
  highlight(node, color) {
    const joint = this._joint(node);

    // Every joint in the subtree has a bone or a stub leaving it, so a joint no bone touches lies outside it.
    if (!this._ends.includes(joint))
      throw new Error(`SkeletonHelper: node ${node} is outside root's subtree`);
    for (let i = 0; i < this._bones.length; i++)
      if (this._ends[i * 2] === joint) this._lit[i] = color;
    this._paint();

    return this;
  }

  /** Where joint `node` was at the last {@link SkeletonHelper#update}, in the helper's parent's space */
  getJointPosition(node, out) {
    const joint = this._joint(node);

    return this._skinPoint(
      joint,
      this._bindPoints,
      joint * 3,
      1,
      out,
    ).applyAffineMatrix4(this.localTransform);
  }

  /** Destroys its bones and highlight materials, and lets go of the skeleton and skin */
  destroy(options) {
    if (this.destroyed) return;
    super.destroy(options);
    this._releaseLit();
    this._skeleton = null;
    this._skin = null;
    this._bones = null;
  }

  /** Paints the highlights over the base's look and lays the bones again, since a highlight is wider unless muted */
  _paint() {
    super._paint();
    if (this.xray !== this._litXray) this._releaseLit();
    for (let i = 0; i < this._bones.length && !this.muted; i++) {
      const color = this._lit[i];

      if (color !== null) this._bones[i].material = this._litMaterial(i, color);
    }
    this._place();
  }

  /**
   * A lit bone's material, made like the one the base just gave it so the rig keeps one pipeline: in a pass, or while
   * the base is the shared single-sided one at opacity 1, that's the shared one, cached per colour; otherwise it's the
   * joint's own, written in place
   */
  _litMaterial(bone, color) {
    const base = this._bones[bone].material;

    if (this.pass !== null || !base.doubleSided)
      return helperMaterial(color, 1, this.xray, this.pass);

    const material = (this._litMaterials[this._ends[bone * 2]] ??=
      new HelperMaterial({ xray: this.xray }));

    material.color = color;
    material.alpha = base.alpha;

    return material;
  }

  _releaseLit() {
    for (const material of this._litMaterials) material?.destroy();
    this._litMaterials.length = 0;
    this._litXray = this.xray;
  }

  /** Lays every shown bone along the current skinning matrices, through the skin-to-helper transform last read */
  _place() {
    const stubs = this._leafLength > 0;

    for (let i = 0; i < this._bones.length; i++) {
      const from = this._ends[i * 2];
      const to = this._ends[i * 2 + 1];
      const wide = this._lit[i] !== null && !this.muted;

      if (to < 0 && !stubs) continue;
      this._skinPoint(from, this._bindPoints, from * 3, 1, _start);
      if (to >= 0) this._skinPoint(to, this._bindPoints, to * 3, 1, _end);
      else
        _end
          .copyFrom(_start)
          .addScaledVector(
            this._skinPoint(from, this._axes, i * 6 + 3, 0, _z),
            this._leafLength,
          );
      this._skinPoint(from, this._axes, i * 6, 0, _x);
      placeBone(
        this._bones[i],
        _start,
        _end,
        _x,
        this._thickness * (wide ? HIGHLIGHT_WIDTH : 1),
      );
    }
  }

  _joint(node) {
    if (!(this._jointOf[node] >= 0))
      throw new Error(
        `SkeletonHelper: node ${node} isn't one of skeleton.joints`,
      );

    return this._jointOf[node];
  }

  /**
   * Takes a point (`w` 1) at rest in the skin's space through a joint's skinning matrix into the helper's space, or a
   * direction (`w` 0), which comes out a unit long
   */
  _skinPoint(joint, source, at, w, out) {
    const s = this._skeleton.worldMatrix;
    const o = joint * SKIN_FLOATS;
    const x = source[at];
    const y = source[at + 1];
    const z = source[at + 2];

    // A skinning matrix is row-major, three rows of four.
    out.set(
      s[o] * x + s[o + 1] * y + s[o + 2] * z + s[o + 3] * w,
      s[o + 4] * x + s[o + 5] * y + s[o + 6] * z + s[o + 7] * w,
      s[o + 8] * x + s[o + 9] * y + s[o + 10] * z + s[o + 11] * w,
    );

    return w === 1
      ? out.applyAffineMatrix4(this._skinToHelper)
      : out.transformDirection(this._skinToHelper);
  }
}
