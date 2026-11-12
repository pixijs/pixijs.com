/**
 * What the frame draws to explain a drag: the drag plane, a sheet over the board at the height the held shape was
 * grabbed, with the point where the pointer's ray meets it; the grid on the board; and, while snapping, a ghost of the
 * held shape where the unrounded point would put it
 *
 * It reads the drag and the pane each frame and never changes them, so `index.ts` runs the same without it.
 */

import { Box, Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { BoxHelper } from './theme/BoxHelper';
import { DotHelper } from './theme/DotHelper';
import { GhostHelper } from './theme/GhostHelper';
import { GridHelper } from './theme/GridHelper';
import { LabelLayer } from './theme/LabelLayer';
import { THEMES } from './theme/palette';

import { BOARD } from './scene';

/**
 * The sheet: the drag plane drawn over the board and half a unit past each edge, so it reads as a plane of its own
 * rather than the board lifted. It's a box `lift` thick; BoxHelper fills the top and bottom faces over each other, so
 * a fill of 0.07 shows at about 0.14.
 */
const SHEET = { margin: 0.5, lift: 0.004, fill: 0.07 };
/** The middles of the sheet's four edges, as x and z in half-sides from its middle */
const EDGES = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];
/** The board stays pale on both themes, so its grid keeps the light theme's soft ink */
const GRID_INK = THEMES.light.inkSoft;
/** The grid's opacity, quiet and while snapping */
const GRID = { quiet: 0.35, snapping: 0.7 };
/**
 * The ghost's opacity, and the gap to the snapped shape, in world units, where it starts to show and where it shows
 * whole. Nearer, the two would overlap into one muddy shape.
 */
const GHOST = { opacity: 0.22, from: 0.15, whole: 0.55 };

export function createVisuals({
  app,
  view3d,
  stage,
  shapes,
  drag,
  params,
  reach,
}) {
  const labels = new LabelLayer({ view3d, stage });
  const half = {
    x: BOARD.width / 2 + SHEET.margin,
    z: BOARD.depth / 2 + SHEET.margin,
  };
  // Built round its own origin, level like the plane, so following a drag is only a move up or down.
  const sheet = new BoxHelper({
    color: 'accent',
    thickness: 0.015,
    fill: SHEET.fill,
    visible: false,
    parent: view3d.root,
  }).setBox(
    Box.fromCenterSize(
      { x: 0, y: 0, z: 0 },
      { x: half.x * 2, y: SHEET.lift, z: half.z * 2 },
    ),
  );
  // Where the pointer's ray meets the plane: the point `screenToWorld` returns.
  const hit = new DotHelper({
    color: 'accent',
    outline: true,
    radius: 0.07,
    parent: sheet,
  });
  const grid = new GridHelper({
    size: { width: BOARD.width, depth: BOARD.depth },
    step: params.step,
    color: GRID_INK,
    lines: 1,
    outline: false,
    opacity: GRID.quiet,
    position: { x: 0, y: BOARD.top, z: 0 },
    parent: view3d.root,
  });
  const ghosts = shapes.map(
    (source) =>
      new GhostHelper({
        source,
        opacity: GHOST.opacity,
        visible: false,
        parent: view3d.root,
      }),
  );
  const sheetTag = labels.add({
    text: 'drag plane',
    color: 'accent',
    node: sheet,
    anchor: { x: 0.5, y: 0 },
    offset: { x: 0, y: 6 },
  });
  const edge = new Vector3();
  const onScreen = new Point();

  app.stage.addChild(labels);

  /** The sheet at the plane's height while a shape is held, and the pointer's point on it */
  function placeSheet() {
    sheet.visible = drag.shape !== null;
    if (!drag.shape) return;
    // The plane is level through the grabbed point, and every point the drag reads lies on it, so it's at their height.
    sheet.position.set(0, drag.point.y, 0);
    hit.position.set(drag.point.x, 0, drag.point.z);
    placeTag();
  }

  /**
   * The tag under the middle of the sheet's edge lowest on screen, the one nearest the camera wherever it's turned:
   * nothing of the sheet or the board is below it, and it's far from the pane. With no edge's middle on screen, the
   * sheet fills the view and goes unnamed.
   */
  function placeTag() {
    let lowest = -Infinity;

    for (const [u, v] of EDGES) {
      edge.set(u * half.x, drag.point.y, v * half.z);
      if (
        !view3d.worldToScreen(edge, onScreen) ||
        !app.screen.contains(onScreen.x, onScreen.y)
      )
        continue;
      if (onScreen.y > lowest) {
        lowest = onScreen.y;
        sheetTag.at.set(u * half.x, 0, v * half.z);
      }
    }
    sheetTag.hidden = lowest === -Infinity;
  }

  /** The ghost of the held shape while snapping, at the clamped but unrounded spot */
  function placeGhosts() {
    const snapped = params.snap ? drag.shape : null;

    for (let i = 0; i < shapes.length; i++) {
      const ghost = ghosts[i];

      ghost.visible = shapes[i] === snapped;
      if (!ghost.visible) continue;
      ghost.position
        .copyFrom(drag.point)
        .subtract(drag.offset)
        .clamp(reach.min, reach.max);
      // Fades out as the gap closes, so it shows only where the rounding moved the shape.
      const gap = ghost.position.distanceTo(shapes[i].position);

      ghost.opacity =
        GHOST.opacity *
        Math.min(
          Math.max((gap - GHOST.from) / (GHOST.whole - GHOST.from), 0),
          1,
        );
    }
  }

  return {
    update() {
      placeSheet();
      placeGhosts();
      grid.step = params.step;
      grid.opacity = params.snap ? GRID.snapping : GRID.quiet;
      labels.update();
    },
  };
}
