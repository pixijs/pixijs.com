/**
 * What the frame draws to explain size and bounds: each box as an ink cube, each model's measured bounds as a pink
 * frame, and tags naming the measured model's frame and the swarm's `boundsVolume`
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Box, Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { BoxHelper } from './theme/BoxHelper';

import { LabelLayer } from './theme/LabelLayer';

/** How far the fit cube sits outside the box, so it nests just outside the bounds frame even when the two match */
const GROW = 0.035;
const CUBE_THICKNESS = 0.025;
const FRAME_THICKNESS = 0.03;
/** The outer face of the fit cube's bars, where the tags hang from */
const EDGE = GROW + CUBE_THICKNESS;
/** Px from a cube's lowest corner on screen down to the middle of the tag under it */
const BELOW = 20;

/** One model in its slot, as `index.ts` fits it */

/** The pane's values, as the visuals read them */

const _box = new Box();
const _corner = new Vector3();
const _world = new Vector3();
const _screen = new Point();

export function createVisuals({ app, view3d, stage, items, swarm, state }) {
  const frames = items.map((item) => ({
    item,
    // The helpers are the slot's children, beside the model, so measuring the model never counts them.
    cube: new BoxHelper({ thickness: CUBE_THICKNESS, parent: item.slot }),
    bounds: new BoxHelper({
      color: 'accent',
      thickness: FRAME_THICKNESS,
      parent: item.slot,
    }),
    /** The model's bounds as the frame last drew them, in the slot's space */
    drawn: new Box(),
  }));
  const swarmFrame = frames.find((frame) => frame.item.model === swarm);

  if (!swarmFrame) throw new Error('The swarm must be one of the items');

  const labels = new LabelLayer({ view3d, stage });
  const boundsTag = labels.add({
    text: 'bounds',
    color: 'accent',
    leader: true,
  });
  const volumeTag = labels.add({
    text: 'boundsVolume',
    color: 'accent',
    leader: true,
  });
  let cubeSize = -1;

  app.stage.addChild(labels);

  /** Frames each box and each model's bounds, as the model is drawn in its slot */
  function drawFrames() {
    const s = state.boxSize;

    for (const frame of frames) {
      const { position: p, scale: k } = frame.item.model;
      const { bounds } = frame.item;

      if (s !== cubeSize) {
        _box.min.set(-s / 2 - GROW, -GROW, -s / 2 - GROW);
        _box.max.set(s / 2 + GROW, s + GROW, s / 2 + GROW);
        frame.cube.setBox(_box);
      }
      // Nothing turns and every scale is positive, so the bounds as drawn are the position plus the bounds times the
      // scale.
      _box.min.set(
        p.x + bounds.min.x * k.x,
        p.y + bounds.min.y * k.y,
        p.z + bounds.min.z * k.z,
      );
      _box.max.set(
        p.x + bounds.max.x * k.x,
        p.y + bounds.max.y * k.y,
        p.z + bounds.max.z * k.z,
      );
      if (!_box.equals(frame.drawn))
        frame.bounds.setBox(frame.drawn.copyFrom(_box));
      frame.bounds.visible = state.showBounds;
    }
    cubeSize = s;
  }

  /**
   * Hangs `tag` under the cube's bottom corner that sits lowest on screen, with its leader up to the same corner of the
   * frame, so it clears the cube from any side the orbit turns to
   */
  function hangBelow(tag, slot, drawn) {
    const half = state.boxSize / 2 + EDGE;
    let lowestX = 0;
    let lowestY = -Infinity;
    let signX = 1;
    let signZ = 1;

    for (let i = 0; i < 4; i++) {
      const x = i & 1 ? 1 : -1;
      const z = i & 2 ? 1 : -1;

      view3d.worldToScreen(
        slot.toGlobal(_corner.set(x * half, -EDGE, z * half), _world),
        _screen,
      );
      if (_screen.y > lowestY) {
        lowestX = _screen.x;
        lowestY = _screen.y;
        signX = x;
        signZ = z;
      }
    }
    tag.node = slot;
    // A frame that sinks through the floor (Skip centring) hides its bottom, so the leader meets its edge at the floor.
    tag.at.set(
      signX > 0 ? drawn.max.x : drawn.min.x,
      Math.max(drawn.min.y, 0),
      signZ > 0 ? drawn.max.z : drawn.min.z,
    );
    view3d.worldToScreen(slot.toGlobal(tag.at, _world), _screen);
    tag.offset.set(lowestX - _screen.x, lowestY - _screen.y + BELOW);
  }

  return {
    update() {
      drawFrames();

      const { item, drawn } = frames[state.focus];
      const volume = swarm.boundsVolume !== null;
      const swarmMeasured = item.model === swarm;

      // The measured model's frame is named for what measuring read: the swarm's own box, once it has one.
      boundsTag.text = swarmMeasured && volume ? 'boundsVolume' : 'bounds';
      boundsTag.hidden = !state.showBounds;
      hangBelow(boundsTag, item.slot, drawn);
      volumeTag.hidden = !state.showBounds || !volume || swarmMeasured;
      hangBelow(volumeTag, swarmFrame.item.slot, swarmFrame.drawn);
      labels.update();
    },
  };
}
