/**
 * What the frame draws to explain finding and moving nodes: a frame round the found node, with its label; an arrow from
 * its parent's origin to it, its `position`; the parent's own axes, or a dot for the root's origin; and a ghost where a
 * move that jumped took a piece from
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Box, Matrix4, Vector3 } from '@pixi/3d';

import { ArrowHelper } from './theme/ArrowHelper';
import { AxesHelper } from './theme/AxesHelper';
import { BoxHelper } from './theme/BoxHelper';
import { DotHelper } from './theme/DotHelper';
import { GhostHelper } from './theme/GhostHelper';
import { LabelLayer } from './theme/LabelLayer';

import { BELOW_ORIGIN } from './scene';

/** Short enough to fit under the logo; lifted off the face so they don't fight it */
const AXES_LENGTH = 0.35;
const AXES_LIFT = { x: 0, y: 0, z: 0.02 };
const ARROW_THICKNESS = 0.025;
const ROOT_DOT = 0.05;
const FRAME_THICKNESS = 0.02;
/** Px between a tag and the point it names; a board's tag names its origin from the panel's edge below it */
const TAG_GAP = 8;
const TAG_AT = { x: 0, y: -BELOW_ORIGIN, z: 0 };
/** A move shorter than this left the piece where it was in the world, as `reparentChild` does */
const STILL = 0.001;

const _world = new Matrix4();
const _bounds = new Box();
const _from = new Vector3();
const _to = new Vector3();
const _top = new Vector3();

export function createVisuals({ app, view3d, stage, boards, pieces }) {
  const { root } = view3d;
  // The screen's bounds rather than the view's, which grows past the screen on a narrow one to keep the pane clear.
  const labels = new LabelLayer({ view3d, stage, bounds: app.screen });
  // In the root rather than in the boards, so they never join a board's bounds or fire its events. The boards never
  // move, so each set of axes takes its board's place once.
  const axes = boards.map((board) => {
    const helper = new AxesHelper({
      length: AXES_LENGTH,
      visible: false,
      parent: root,
    });

    board
      .getGlobalTransform(_world)
      .decompose(helper.position, helper.quaternion, helper.scale);
    board.toGlobal(AXES_LIFT, helper.position);

    return helper;
  });
  // Under the panel's edge below each board's origin, clear of its axes.
  const boardTags = boards.map((board) =>
    labels.add({
      text: board.label ?? '',
      node: board,
      at: TAG_AT,
      anchor: { x: 0.5, y: 0 },
      offset: { x: 0, y: TAG_GAP },
    }),
  );
  const foundTag = labels.add({
    text: '',
    color: 'accent',
    anchor: { x: 0.5, y: 1 },
    offset: { x: 0, y: -TAG_GAP },
  });
  // X-ray, so a board's frame keeps its bottom edges, which sit just under the floor it stands on.
  const frame = new BoxHelper({
    color: 'accent',
    thickness: FRAME_THICKNESS,
    xray: true,
    parent: root,
  });
  // Accent, which reads on the white boards on either theme. Through x-ray, its head shows on the piece's origin,
  // inside the piece.
  const arrow = new ArrowHelper({
    color: 'accent',
    thickness: ARROW_THICKNESS,
    xray: true,
    parent: root,
  });
  // A found board's parent is the root, whose origin is the world's, on the floor between the boards.
  const rootDot = new DotHelper({
    radius: ROOT_DOT,
    outline: true,
    visible: false,
    parent: root,
  });
  const rootTag = labels.add({
    text: 'root',
    node: rootDot,
    anchor: { x: 0.5, y: 0 },
    offset: { x: 0, y: TAG_GAP },
  });
  const views = pieces.map((piece) => ({
    piece,
    // Unlabelled, so a search never finds a ghost.
    ghost: new GhostHelper({ source: piece, visible: false, parent: root }),
    parent: piece.parent,
    world: piece.getGlobalTransform(new Matrix4()),
  }));
  // The found node the frame, arrow, tags and axes were last drawn for; `undefined` has them drawn again.
  let shown;

  app.stage.addChild(labels);

  /** Leaves a ghost where the piece was when the move jumped it, as `addChild` does; `reparentChild` leaves none */
  function showMove(view) {
    const { ghost } = view;

    for (const other of views) other.ghost.visible = false;
    view.world.decompose(ghost.position, ghost.quaternion, ghost.scale);
    ghost.visible =
      view.piece.getGlobalPosition(_to).distanceTo(ghost.position) > STILL;
  }

  /** Frames the found node, draws its position from its parent's origin, and marks that parent's space */
  function showFound(found) {
    const parent = found?.parent ?? null;
    const onBoard = parent !== null && boards.includes(parent);

    frame.visible = found !== null;
    arrow.visible = parent !== null;
    // A board names itself with its own tag.
    foundTag.hidden = !onBoard;
    rootDot.visible = parent === root;
    rootTag.hidden = parent !== root;
    if (found && parent) {
      found
        .getGlobalTransform(_world)
        .decompose(frame.position, frame.quaternion, frame.scale);
      frame.setBox(found.getLocalBounds(_bounds));
      arrow.set(parent.getGlobalPosition(_from), found.getGlobalPosition(_to));
      foundTag.text = found.label ?? '';
      found.toGlobal(_top.set(0, _bounds.max.y, 0), foundTag.at);
    }
    boards.forEach((board, i) => {
      axes[i].visible = board === parent;
      boardTags[i].color = board === found ? 'accent' : null;
    });
  }

  return {
    update(found) {
      let moved = false;

      for (const view of views) {
        const { piece } = view;

        piece.getGlobalTransform(_world);
        if (piece.parent !== view.parent) showMove(view);
        if (piece.parent !== view.parent || !_world.equals(view.world))
          moved = true;
        view.parent = piece.parent;
        view.world.copyFrom(_world);
      }
      if (moved || found !== shown) showFound(found);
      shown = found;
      labels.update();
    },
    forgetMoves() {
      for (const view of views) {
        view.ghost.visible = false;
        view.parent = view.piece.parent;
        view.piece.getGlobalTransform(view.world);
      }
      shown = undefined;
    },
  };
}
