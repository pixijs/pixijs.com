/**
 * What the frame draws to explain `lookAt`, `toLocal` and `toGlobal`: each head's +z and, while it turns, the line
 * lookAt aims its twin along; the selected head's own axes and its muzzle; and where world space starts
 *
 * It reads the trackers each frame and never changes the scene, so `index.ts` runs the same without it.
 */

import { Point } from 'pixi.js';

import { ArrowHelper } from './theme/ArrowHelper';
import { DotHelper } from './theme/DotHelper';
import { LabelLayer } from './theme/LabelLayer';

import { MUZZLE, ORIGIN } from './scene';

/** What the visuals read about one turret; `index.ts` refills it every frame */

/** Each +z arrow's tip in its head's space: 0.6 past the muzzle, so it shows beyond the barrel */
const Z_TIP = { x: 0, y: 0, z: MUZZLE.z + 0.6 };
/** The gap in px between the muzzle tag and the barrel's line on screen */
const MUZZLE_GAP = 10;
/** The world origin's arrows, a hair above the floor so they never fight the checks */
const FLOOR_ORIGIN = { x: 0, y: 0.03, z: 0 };

/** The selected pivot and muzzle and the target on screen, for setting the muzzle tag beside the barrel */
const [_pivot, _muzzle, _target] = Array.from({ length: 3 }, () => new Point());

export function createVisuals({
  app,
  view3d,
  stage,
  trackers,
  target,
  settings,
}) {
  const { root } = view3d;
  const labels = new LabelLayer({ view3d, stage });

  // Every turret: the head's +z, its child so it turns with it, and the line lookAt aims the twin along.
  const aimLines = trackers.map(({ turret }) => {
    new ArrowHelper({ color: 'z', thickness: 0.05, parent: turret.head }).set(
      MUZZLE,
      Z_TIP,
    );

    return new ArrowHelper({
      color: 'ink',
      head: false,
      thickness: 0.02,
      parent: root,
    });
  });

  // The selected head's own x and y, with its +z the axes toLocal measures along, drawn through the pod they start in.
  const xArrow = new ArrowHelper({
    color: 'x',
    thickness: 0.04,
    xray: true,
  }).set(ORIGIN, { x: 0.9, y: 0, z: 0 });
  const yArrow = new ArrowHelper({
    color: 'y',
    thickness: 0.04,
    xray: true,
  }).set(ORIGIN, { x: 0, y: 0.7, z: 0 });
  const muzzleDot = new DotHelper({ radius: 0.12, parent: root });
  const muzzleTag = labels.add({ text: 'muzzle', node: muzzleDot });

  // Where world space starts, with its own x and z lying on the floor.
  new ArrowHelper({ color: 'x', parent: root }).set(FLOOR_ORIGIN, {
    x: 0.6,
    y: FLOOR_ORIGIN.y,
    z: 0,
  });
  new ArrowHelper({ color: 'z', parent: root }).set(FLOOR_ORIGIN, {
    x: 0,
    y: FLOOR_ORIGIN.y,
    z: 0.6,
  });
  labels.add({
    text: 'world origin',
    at: FLOOR_ORIGIN,
    anchor: { x: 0, y: 0.5 },
    offset: { x: 14, y: 20 },
  });

  app.stage.addChild(labels);

  // Which side of the barrel the muzzle tag takes: 1 its upper side on screen, -1 its lower.
  let tagSide = 1;

  return {
    update() {
      const { turret, pivot, muzzle, locked } = trackers[settings.head];

      for (let i = 0; i < trackers.length; i++) {
        aimLines[i].set(trackers[i].pivot, target.position);
        // Once locked, the beam runs along the aim line, so the line steps aside.
        aimLines[i].visible = !trackers[i].locked;
      }

      if (xArrow.parent !== turret.head) turret.head.addChild(xArrow, yArrow);
      muzzleDot.position.copyFrom(muzzle);

      // The barrel and the beam lie on one screen line through the muzzle, so the tag sits square to it.
      view3d.worldToScreen(pivot, _pivot);
      view3d.worldToScreen(muzzle, _muzzle);
      const dx = _muzzle.x - _pivot.x;
      const dy = _muzzle.y - _pivot.y;
      const up = (dx < 0 ? -1 : 1) / (Math.hypot(dx, dy) || 1);
      const nx = dy * up;
      const ny = -dx * up;

      // While the head turns, the aim line leaves the barrel on one side, so the tag takes the other. Once locked it
      // keeps its side, so it never flickers across the beam.
      if (!locked) {
        view3d.worldToScreen(target.position, _target);
        tagSide =
          (_target.x - _pivot.x) * nx + (_target.y - _pivot.y) * ny > 0
            ? -1
            : 1;
      }

      const reach =
        (Math.abs(nx) * muzzleTag.width) / 2 +
        (Math.abs(ny) * muzzleTag.height) / 2 +
        MUZZLE_GAP;

      muzzleTag.offset.set(tagSide * nx * reach, tagSide * ny * reach);
      labels.update();
    },
  };
}
