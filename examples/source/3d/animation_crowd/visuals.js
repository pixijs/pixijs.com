/**
 * What the frame draws to explain the crowd: every fox's skeleton, the same rig in a pose of its own, and a tag naming
 * the front fox the pane's Front fox rows change
 *
 * It reads the foxes each frame and never changes them, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';
import { NARROW_BELOW } from './theme/overlay';
import { THEMES } from './theme/palette';
import { SkeletonHelper } from './theme/SkeletonHelper';

/** How a fox's bones look; `thickness` is a bone's width at its widest, in world units on a fox 1 tall */

/**
 * One loud skeleton on the front fox, and quiet ones on the herd that read as the same stick figure under the fur. The
 * herd's are pale on both themes: baseColor multiplies the fur's texture, so a tint only ever darkens it.
 */
const FRONT_BONES = { color: 'accent', opacity: 0.9, thickness: 0.04 };
const HERD_BONES = {
  color: THEMES.dark.inkSoft,
  opacity: 0.4,
  thickness: 0.03,
};
/** How much wider the bones draw on a phone, where the herd draws about half the size */
const NARROW_THICKNESS = 1.75;
/** Where the front fox's tag hangs: the floor just in front of it, toward the camera */
const TAG_AHEAD = 0.4;

export function createVisuals(options) {
  const { app, view3d, stage, foxes, settings } = options;
  const front = foxes[0];
  const labels = new LabelLayer({ view3d, stage });
  const hip = front.skeleton.indexOf('b_Hip_01');
  /** Each fox's SkeletonHelper, by index, and the model it was built for */
  const bones = [];
  const boneOwners = [];
  let narrow = false;

  labels.add({
    text: 'front fox',
    at: {
      x: front.model.position.x,
      y: 0,
      z: front.model.position.z + TAG_AHEAD,
    },
    offset: { x: 0, y: 0 },
  });
  app.stage.addChild(labels);

  function lookOf(index) {
    return index === 0 ? FRONT_BONES : HERD_BONES;
  }

  function thicknessOf(look) {
    return narrow ? look.thickness * NARROW_THICKNESS : look.thickness;
  }

  function createBones(fox, look) {
    // From the hip, since the file's root joint stands at the fox's feet. No stubs past the end joints, so every
    // bone runs between two joints and the paws, snout and tail tip end where the fur does.
    return new SkeletonHelper({
      skeleton: fox.skeleton,
      space: fox.model,
      root: hip,
      leafLength: 0,
      color: look.color,
      opacity: look.opacity,
      thickness: thicknessOf(look),
      parent: view3d.root,
    });
  }

  /** Gives every fox a SkeletonHelper of its own and drops those of foxes that left, before any reads a skeleton */
  function syncBones() {
    while (bones.length > foxes.length) {
      bones.pop()?.destroy();
      boneOwners.pop();
    }
    for (let i = 0; i < foxes.length; i++) {
      if (boneOwners[i] === foxes[i].model) continue;
      bones[i]?.destroy();
      bones[i] = createBones(foxes[i], lookOf(i));
      boneOwners[i] = foxes[i].model;
    }
  }

  function showBones() {
    for (let i = 0; i < bones.length; i++) {
      bones[i].visible =
        settings.bones === 'every fox' ||
        (i === 0 && settings.bones === 'front fox');
      if (bones[i].visible) bones[i].update();
    }
  }

  /** Thicker bones on a phone, where the herd draws smaller */
  function showWidth() {
    const isNarrow = app.screen.width < NARROW_BELOW;

    if (isNarrow === narrow) return;
    narrow = isNarrow;
    for (let i = 0; i < bones.length; i++)
      bones[i].thickness = thicknessOf(lookOf(i));
  }

  return {
    update() {
      showWidth();
      syncBones();
      showBones();
      labels.update();
    },
  };
}
