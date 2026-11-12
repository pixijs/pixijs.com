/**
 * What the frame draws to explain driving bones: the rig over the fur with the head's and the tail's bones lit, the
 * gaze the clip gave the head and the one the code wrote, the aim point, and the tail's lift arc
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Matrix4, Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { AngleHelper } from './theme/AngleHelper';
import { ArrowHelper } from './theme/ArrowHelper';
import { DotHelper } from './theme/DotHelper';
import { LabelLayer } from './theme/LabelLayer';
import { NARROW_BELOW } from './theme/overlay';
import { BRAND } from './theme/palette';
import { SkeletonHelper } from './theme/SkeletonHelper';

import { ALONG_BONE, TAIL_LIFT_AXIS, getBoneTransform } from './bones';

/** The bones', the gazes' and the lift arc's widths: thin enough that the fox stays the subject */
const BONE_THICKNESS = 0.035;
const GAZE_THICKNESS = 0.02;
const ARC_THICKNESS = 0.025;
/** A leaf bone's stub: a nub inside each paw, not a claw along the floor */
const LEAF_LENGTH = 0.06;
/** A phone's view backs the camera off, so every line widens this much to keep its pixels */
const NARROW_WIDEN = 1.6;
/** The clip's gaze: it leaves the head and stops beside the front leg when Survey puts the nose to the floor */
const CLIP_LENGTH = 0.9;
/** How far the code's gaze runs past the clip's tip at follow 0, so both show when they agree */
const LEAD = 0.16;
/** The aim dot's radius, and how far short of its centre the code's gaze stops, so its head meets the dot's edge */
const DOT_RADIUS = 0.045;
const DOT_GAP = 0.07;
/** How far the snout runs along the head's +x; the code's gaze never ends inside it */
const SNOUT_TIP = 0.48;
/** The head bone's stub, down the snout to just short of its tip, where the code's gaze comes out */
const HEAD_LENGTH = 0.44;
/** How much wider the head bone draws than the rest, as a highlighted bone does */
const HEAD_WIDEN = 1.6;
/** The lift arc's radius: out near the tail's tip, so a small lift still draws a curve longer than its head */
const ARC_RADIUS = 0.75;
/** The gap in px between the clip's tag and its arrowhead */
const TAG_GAP = 10;
/**
 * How far, in radians, the clip's tag turns from straight past its arrowhead. It turns clockwise when the code's gaze
 * is far off: from the opening camera, that keeps it off the front leg when Survey points the nose at the floor.
 */
const TAG_TURN = 0.6;
/** The angle on screen between the gazes within which the tag turns away from the code's: they can meet on a phone */
const AWAY_ANGLE = Math.PI / 4;
/** The angle within which the code's gaze runs through a tag past the clip's tip, on a phone's short arrows */
const BESIDE_ANGLE = 0.2;
/** How far above the dot's centre the `aim` tag sits, in px: clear of the dot's edge */
const AIM_GAP = 20;

const _foxWorld = new Matrix4();
const _bone = new Matrix4();
const _parent = new Matrix4();
const _rest = new Matrix4();
const _joint = new Vector3();
const _toAim = new Vector3();
const _lookDir = new Vector3();
const _lookEnd = new Vector3();
const _clipDir = new Vector3();
const _clipEnd = new Vector3();
const _tailJoint = new Vector3();
const _liftAxis = new Vector3();
const _restDir = new Vector3();
const _joint2D = new Point();
const _clip2D = new Point();
const _look2D = new Point();

export function createVisuals(options) {
  const {
    app,
    view3d,
    stage,
    fox,
    head,
    tailBone,
    tail,
    tailRest,
    clipHead,
    aim,
    settings,
  } = options;
  const { root } = view3d;
  const skeleton = fox.skeletons[0];

  // From the hip: the file's nodes above it sit at the fox's feet, and their bones would spike into the floor.
  const rig = new SkeletonHelper({
    skeleton,
    space: fox,
    root: skeleton.indexOf('b_Hip_01'),
    leafAxis: ALONG_BONE,
    leafLength: LEAF_LENGTH,
    thickness: BONE_THICKNESS,
    parent: root,
  });

  rig.highlight(head, 'accent');
  rig.highlight(tailBone, BRAND.purple);

  // The rig gives every leaf one stub length, and the paws need a short one. So the head, a leaf too, is drawn again
  // on its own with a stub down the snout: the bone the code turns, and where the code's gaze leaves.
  const headBone = new SkeletonHelper({
    skeleton,
    space: fox,
    root: head,
    color: 'accent',
    leafAxis: ALONG_BONE,
    leafLength: HEAD_LENGTH,
    thickness: BONE_THICKNESS * HEAD_WIDEN,
    parent: root,
  });

  // The clip's gaze starts inside the head, so it draws through the fur; the code's comes out of the snout.
  const clipArrow = new ArrowHelper({
    color: 'ink',
    thickness: GAZE_THICKNESS,
    xray: true,
    parent: root,
  });
  const lookArrow = new ArrowHelper({
    color: 'accent',
    thickness: GAZE_THICKNESS,
    parent: root,
  });
  const aimDot = new DotHelper({
    color: 'accent',
    radius: DOT_RADIUS,
    parent: root,
  });
  // The lift runs along the tail, inside the fur, so it draws through it too: a bare arc, which reads over the fur.
  const liftArc = new AngleHelper({
    radius: ARC_RADIUS,
    color: BRAND.purple,
    wedge: false,
    xray: true,
    parent: root,
  });

  // The two gazes look alike, so the clip's is named; the code's ends at the named dot.
  const labels = new LabelLayer({ view3d, stage });
  const aimTag = labels.add({
    text: 'aim',
    anchor: { x: 0.5, y: 1 },
    offset: { x: 0, y: -AIM_GAP },
  });
  const clipTag = labels.add({ text: 'clip' });

  app.stage.addChild(labels);

  let narrow = null;

  /** Widens the lines on a phone's backed-off view */
  function layout(isNarrow) {
    const widen = isNarrow ? NARROW_WIDEN : 1;

    narrow = isNarrow;
    rig.thickness = BONE_THICKNESS * widen;
    headBone.thickness = BONE_THICKNESS * HEAD_WIDEN * widen;
    clipArrow.thickness = lookArrow.thickness = GAZE_THICKNESS * widen;
    liftArc.thickness = ARC_THICKNESS * widen;
  }

  /** A bone's current pose in world space: its pose in the skeleton's space, then the fox's */
  function boneWorld(node, out) {
    return getBoneTransform(skeleton, node, out).premultiply(_foxWorld);
  }

  /** Hangs the clip's tag off its arrowhead's tip at `angle` on screen, its nearest corner TAG_GAP from the tip */
  function hangClipTag(angle) {
    const awayX = Math.cos(angle);
    const awayY = Math.sin(angle);
    const away =
      TAG_GAP +
      (Math.abs(awayX) * clipTag.width + Math.abs(awayY) * clipTag.height) / 2;

    clipTag.offset.set(awayX * away, awayY * away);
  }

  /**
   * Sets the clip's tag past its arrowhead, turned TAG_TURN off the gaze's line: clockwise, or the other way when the
   * code's gaze lies within AWAY_ANGLE on that side, so the tag never lands on it or by the aim dot at its end, where
   * it would read as the dot's second tag. Where the code's gaze lies along the clip's, at a low follow or when the
   * clip looks at the aim, it runs on past the tip, so the tag turns a full quarter and hangs beside the arrowhead.
   */
  function placeClipTag() {
    if (
      !view3d.worldToScreen(_joint, _joint2D) ||
      !view3d.worldToScreen(_clipEnd, _clip2D)
    )
      return;
    if (!view3d.worldToScreen(_lookEnd, _look2D)) return;

    const clipX = _clip2D.x - _joint2D.x;
    const clipY = _clip2D.y - _joint2D.y;
    const lookX = _look2D.x - _joint2D.x;
    const lookY = _look2D.y - _joint2D.y;
    // The code's gaze's angle from the clip's on screen. Screen y runs down, so a positive angle is clockwise.
    const apart = Math.atan2(
      clipX * lookY - clipY * lookX,
      clipX * lookX + clipY * lookY,
    );
    let turn = TAG_TURN;

    if (Math.abs(apart) < BESIDE_ANGLE) turn = -Math.PI / 2;
    else if (apart > 0 && apart < AWAY_ANGLE) turn = -TAG_TURN;

    clipTag.at.copyFrom(_clipEnd);
    hangClipTag(Math.atan2(clipY, clipX) + turn);
  }

  return {
    update() {
      const isNarrow = app.screen.width < NARROW_BELOW;

      if (isNarrow !== narrow) layout(isNarrow);

      // It runs skeleton.updateWorld(), which is when the tail bone takes the container's value.
      rig.update();
      headBone.update();
      fox.getGlobalTransform(_foxWorld);

      // The clip's gaze: the head's +x turned by the rotation the clip wrote, which is in the neck's space.
      boneWorld(head, _bone).extractPosition(_joint);
      boneWorld(skeleton.parent[head], _parent);
      _clipDir
        .copyFrom(ALONG_BONE)
        .applyQuaternion(clipHead)
        .transformDirection(_parent);
      clipArrow.set(
        _joint,
        _clipEnd.copyFrom(_joint).addScaledVector(_clipDir, CLIP_LENGTH),
      );

      // The code's gaze: the head's +x as it is now. At follow 1 the head points at the aim and the gaze runs to the
      // dot; at follow 0 it lies along the clip's and runs on past its tip.
      _lookDir.copyFrom(ALONG_BONE).transformDirection(_bone);

      const nearAim = Math.max(
        _toAim.copyFrom(aim).subtract(_joint).dot(_lookDir) - DOT_GAP,
        SNOUT_TIP + LEAD,
      );
      const reach =
        CLIP_LENGTH + LEAD + (nearAim - CLIP_LENGTH - LEAD) * settings.follow;

      lookArrow.set(
        _joint,
        _lookEnd.copyFrom(_joint).addScaledVector(_lookDir, reach),
      );
      aimDot.position.copyFrom(aim);

      // The lift: from the tail's rest direction, about the lift axis, both in the world space of the bone the tail
      // hangs from.
      boneWorld(tailBone, _bone).extractPosition(_tailJoint);
      _rest
        .compose(tail.position, tailRest, tail.scale)
        .premultiply(boneWorld(skeleton.parent[tailBone], _parent));
      _liftAxis.copyFrom(TAIL_LIFT_AXIS).transformDirection(_rest);
      _restDir.copyFrom(ALONG_BONE).transformDirection(_rest);
      liftArc.position.copyFrom(_tailJoint);
      liftArc.setAxis(_liftAxis, _restDir);
      liftArc.radians = settings.lift;

      aimTag.at.copyFrom(aim);
      placeClipTag();
      labels.update();
    },
  };
}
