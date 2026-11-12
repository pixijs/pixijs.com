/**
 * What the frame draws to explain the glass: the view's dashed edge and tag, and the triangle's true edges drawn after
 * the view
 *
 * Everything here is 2D added after the view, so the glass never bends it: the triangle's outline sits sharp on top
 * while the orange under the glass slides off it, the side of the draw order the lesson contrasts with the poster. It
 * reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Rectangle } from 'pixi.js';

import { LabelLayer } from './theme/LabelLayer';
import { LABEL_FONT_SIZE, viewRect } from './theme/overlay';
import { ScreenLines } from './theme/ScreenLines';

import { sameRect } from './scene';

/** The view's outline: 8 px dashes, 6 px apart, soft enough to sit behind the logo's edges */
const VIEW_EDGE = { width: 1.5, alpha: 0.7, dash: 8, gap: 6 };
/** The triangle's outline: finer dashes, darker, since it's the measure the bend is read against */
const TRIANGLE_EDGE = { width: 1.5, alpha: 0.85, dash: 6, gap: 4 };
/** How far the `view3d` tag sits inside the view's corner */
const CORNER_INSET = 16;
/**
 * The room the outline's tag needs between the logo's reach and the view's top edge to sit inside the view: its height
 * (the font and 3 px above and below) and a 6 px gap
 */
const TAG_ROOM = LABEL_FONT_SIZE + 12;
/** How far above the view's top edge the outline's tag sits where the view has no room for it */
const TAG_LIFT = 4;

export function createVisuals({ app, view3d, stage, triangle, aboveLogo }) {
  const edges = new ScreenLines({ stage });
  // Bounded by the screen, not the view, so the outline's tag can sit above the view's edge.
  const labels = new LabelLayer({ view3d, stage, bounds: app.screen });
  // In the view's bottom-right corner: clear of the logo and the pane at every screen size.
  const viewTag = labels.add({
    text: 'view3d',
    screen: { x: 0, y: 0 },
    anchor: { x: 1, y: 1 },
    offset: { x: -CORNER_INSET, y: -CORNER_INSET },
  });
  // Pinned to the apex, its tag raised past the logo's reach, so the glass never covers it however it's turned.
  const outlineTag = labels.add({
    text: '2D after view3d',
    screen: { x: 0, y: 0 },
    anchor: { x: 0.5, y: 1 },
    leader: true,
  });
  const frame = new Rectangle();
  const drawnFrame = new Rectangle();
  const corners = new Float64Array(6);

  app.stage.addChild(edges, labels);

  /** The view's edge and the triangle's, redrawn only when one of them moved since the last draw */
  function drawEdges() {
    // The poster moves the triangle in its own render, a frame after the view moves, so both are compared.
    let moved = !sameRect(frame, drawnFrame);

    for (let i = 0; i < triangle.length; i++) {
      moved ||=
        corners[i * 2] !== triangle[i].x ||
        corners[i * 2 + 1] !== triangle[i].y;
      corners[i * 2] = triangle[i].x;
      corners[i * 2 + 1] = triangle[i].y;
    }
    if (!moved) return;
    drawnFrame.copyFrom(frame);
    edges
      .clear()
      .style(
        'ink',
        VIEW_EDGE.width,
        VIEW_EDGE.alpha,
        VIEW_EDGE.dash,
        VIEW_EDGE.gap,
      )
      .rect(frame.x, frame.y, frame.width, frame.height)
      .style(
        'ink',
        TRIANGLE_EDGE.width,
        TRIANGLE_EDGE.alpha,
        TRIANGLE_EDGE.dash,
        TRIANGLE_EDGE.gap,
      )
      .polyline(corners, 3, true);
  }

  return {
    update() {
      viewRect(view3d, frame);
      drawEdges();
      edges.update();

      // The tags were added at screen points, so each has its own `screen` to move.
      viewTag.screen.set(frame.right, frame.bottom);
      outlineTag.screen.copyFrom(triangle[0]);
      // Where the logo's reach comes within a tag of the view's top edge, the tag sits above that edge instead.
      const tagBottom =
        aboveLogo.y - frame.top >= TAG_ROOM
          ? aboveLogo.y
          : frame.top - TAG_LIFT;

      outlineTag.offset.y = tagBottom - triangle[0].y;
      labels.update();
    },
  };
}
