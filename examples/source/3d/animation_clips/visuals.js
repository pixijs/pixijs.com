/**
 * What the frame draws to explain the blend: while the Clip row picks Walk + Run, a see-through ghost fox for the walk
 * and one for the run, each posed at its own clip's time, as solid as its weight, and tagged with the clip's name
 *
 * It reads the player's states each frame and never changes them, so `index.ts` runs the same without it.
 */

import { Mesh3D, Model3D } from '@pixi/3d';

import { createHelperMaterial } from './theme/HelperMaterial';

import { LabelLayer } from './theme/LabelLayer';

import { CLIP_COLORS } from './clips';

/** A ghost's opacity at weight 0, and what weight 1 adds: faint but there, never as solid as the fox */
const GHOST_FAINT = 0.1;
const GHOST_WEIGHT = 0.3;
/** Below this aspect the ghosts can't stand beside the fox, so they stand behind it */
const SIDE_BY_SIDE = 1.5;
/** Below this height the open pane, about 300 px tall, reaches down over the run's ghost beside the fox */
const SHORT = 640;
/**
 * A tag's point in the ghost's own units (the file's, nose along +z): at shoulder height past the tail for the walk
 * on the left, past the nose for the run on the right, so each tag sits on the outer side, clear of the fox
 */
const TAG_Y = 45;
const TAG_Z = 95;

/** Where the ghosts go: their distance either side of the fox, how far behind it, and their size against its */

const WIDE = { x: 3.3, z: 0.4, scale: 0.58 };
/** Far enough behind the fox to clear its back, near enough that the run's ghost stays clear of the open pane */
const TALL = { x: 1.3, z: -5, scale: 0.6 };

/** A ghost: its own model and player, posed at one state's time to show that clip alone */

export function createVisuals({ app, view3d, stage, fox, player, mix }) {
  const labels = new LabelLayer({ view3d, stage });
  // The walk on the left and the run on the right, like the pane's Blend slider.
  const ghosts = [createGhost('Walk', -1), createGhost('Run', 1)];
  let layout = null;

  app.stage.addChild(labels);

  function createGhost(label, side) {
    const color = CLIP_COLORS[label];
    // The fox's quaternion isn't built from its rotation until it renders, so the ghost copies the angles.
    const model = new Model3D({
      source: fox.source,
      castShadow: false,
      receiveShadow: false,
      rotation: fox.rotation,
      parent: view3d.root,
    });
    const skin = model.getChildByLabel('fox', true);
    const material = createHelperMaterial({ color, opacity: GHOST_FAINT });

    if (!(skin instanceof Mesh3D) || !model.player)
      throw new Error('Fox.glb has no skinned fox or no clips');
    // The kit's helper material draws both sides, which shows a closed fox's far legs through its near side.
    material.state.culling = true;
    // The models share the fox's geometry and textures, so a ghost adds a draw and a skeleton, not a second fox's
    // buffers.
    skin.material = material;
    // The tag's end that touches its point: its right end on the left, its left end on the right.
    labels.add({
      text: label,
      node: model,
      at: { x: 0, y: TAG_Y, z: side * TAG_Z },
      anchor: { x: side < 0 ? 1 : 0, y: 0.5 },
      color,
    });

    return {
      model,
      side,
      material,
      pose: model.player.getState(label),
      state: player.getState(label),
    };
  }

  /** Moves the ghosts for the screen's shape, only when it changes */
  function place() {
    const { width, height } = app.screen;
    const next = width / height < SIDE_BY_SIDE || height < SHORT ? TALL : WIDE;

    if (next === layout) return;
    layout = next;
    for (const { model, side } of ghosts) {
      model.position.set(side * next.x, 0, next.z);
      model.scale.set(next.scale * fox.scale.x);
    }
  }

  return {
    update() {
      place();
      // Each ghost has a player of its own, used only to pose it at one clip's time: gotoAndStop applies that clip
      // alone, unblended, which is what a ghost shows. The lesson's own gotoAndStop is scrubTo in index.ts.
      const blending = mix.clip === 'Walk + Run';

      for (const { model, material, pose, state } of ghosts) {
        model.visible = blending;
        if (!blending) continue;
        pose.gotoAndStop(state.time);
        material.alpha = GHOST_FAINT + GHOST_WEIGHT * state.weight;
      }
      labels.update();
    },
  };
}
