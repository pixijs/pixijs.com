/**
 * What the frame draws to explain anti-aliasing: a loupe of the canvas's real pixels, its patch marked on the view, and
 * a tag naming the wire. It also measures the wire's width on screen at the loupe, for the pane to read out
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { LabelLayer } from './theme/LabelLayer';
import { ScreenLines } from './theme/ScreenLines';

import { PixelLoupe } from './PixelLoupe';

/** The loupe looks between posts 9 and 10, where the rail is about 2.7 canvas px and the wire under half of one */
const LOUPE_POST = 9.5;
/** Midway between the rail and the wire, so the patch holds both */
const LOUPE_HEIGHT = 1;
/** The wire's tag: between posts 2 and 3, over open floor, where the wire is widest */
const TAG_POST = 2.5;
/** Seconds after a drag ends before the patch moves back onto the fence, once the orbit's damping has settled */
const RECENTRE_DELAY = 1;
/** The marker sits this far outside the patch, in px, so the copy never holds it */
const MARKER_GAP = 2;

const _eye = new Vector3();
const _axis = new Vector3();
const _side = new Vector3();
const _a = new Point();
const _b = new Point();

export function createVisuals({ app, view3d, stage, orbit, fence, onLayout }) {
  // The screen rather than the view, which grows past it on a phone to frame the fence above the loupe.
  const labels = new LabelLayer({ view3d, stage, bounds: app.screen });
  const marker = new ScreenLines({ stage, width: 1, alpha: 0.6 });
  const loupe = new PixelLoupe({
    app,
    stage,
    corner: 'bottom-right',
    title: '1 square = 1 pixel',
    zoom: 8,
    columns: 46,
    rows: 30,
    narrowRows: 26,
  });
  const loupeAlong = LOUPE_POST * fence.spacing;
  let loupeTop = Number.NaN;
  let clock = 0;
  /** When the patch next moves back onto the fence, on the visuals' clock; -1 for not until the view moves again */
  let recentreAt = 0;
  /** The view's size when the patch was last put on the fence, so a resize puts it back */
  const aimedSize = { width: 0, height: 0 };

  labels.add({
    text: 'wire',
    at: fence.pointAt(
      TAG_POST * fence.spacing,
      fence.wire.height,
      new Vector3(),
    ),
    offset: { x: 0, y: 34 },
    leader: true,
  });
  // The patch holds still while a drag slides the fence through it, and moves back onto it once the view settles.
  orbit.on('end', () => (recentreAt = clock + RECENTRE_DELAY));
  app.stage.addChild(marker, labels, loupe);

  /** The screen point, in CSS px, on the wire's outline `along` units down the fence, on one `side` (1 or -1) */
  function wireEdge(along, side, out) {
    fence.pointAt(along, fence.wire.height, _axis);
    // Square to the fence and to the line of sight, so the axis moved out by the radius lands on the outline.
    _side.copyFrom(_axis).subtract(_eye).cross(fence.direction).normalize();

    return view3d.worldToScreen(
      _side.multiplyScalar(fence.wire.radius * side).add(_axis),
      out,
    );
  }

  /** The wire's width on screen at the loupe, in canvas pixels; NaN when it's off screen */
  function measureWire() {
    view3d.camera.getGlobalPosition(_eye);

    const a = wireEdge(loupeAlong, 1, _a);
    const b = wireEdge(loupeAlong, -1, _b);

    return a && b
      ? Math.hypot(a.x - b.x, a.y - b.y) * app.renderer.resolution
      : Number.NaN;
  }

  /** Puts the patch back on the loupe's stretch of fence, unless that's off screen */
  function recentre() {
    const at = view3d.worldToScreen(
      fence.pointAt(loupeAlong, LOUPE_HEIGHT, _axis),
      _a,
    );

    if (at) loupe.aimAt(at.x, at.y);
    aimedSize.width = view3d.width;
    aimedSize.height = view3d.height;
  }

  /** The patch's outline on the view, and a leader from it to the nearest point of the loupe */
  function drawMarker() {
    const { patch, rect } = loupe;
    const left = patch.left - MARKER_GAP;
    const top = patch.top - MARKER_GAP;
    const right = patch.right + MARKER_GAP;
    const bottom = patch.bottom + MARKER_GAP;
    const toX = Math.min(rect.right, Math.max(rect.left, patch.x));
    const toY = Math.min(rect.bottom, Math.max(rect.top, patch.y));

    marker
      .clear()
      .rect(left, top, right - left, bottom - top)
      .line(
        Math.min(right, Math.max(left, toX)),
        Math.min(bottom, Math.max(top, toY)),
        toX,
        toY,
      );
  }

  const visuals = {
    wireWidth: 0,
    update(dt) {
      clock += dt;
      loupe.update(dt);

      // On a phone the loupe docks along the bottom, and `index.ts` reframes the fence above it.
      const top = loupe.narrow ? loupe.rect.top : app.screen.height;

      if (top !== loupeTop) {
        loupeTop = top;
        onLayout(top);
        recentreAt = clock;
      }
      if (
        view3d.width !== aimedSize.width ||
        view3d.height !== aimedSize.height
      )
        recentreAt = clock;
      if (recentreAt >= 0 && clock >= recentreAt) {
        recentre();
        recentreAt = -1;
      }
      visuals.wireWidth = measureWire();
      drawMarker();
      marker.update();
      labels.update();
    },
  };

  return visuals;
}
