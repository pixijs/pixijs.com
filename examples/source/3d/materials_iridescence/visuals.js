/**
 * What the frame draws to explain the film: the names of the strip's two ends, so a reader can tell which end is
 * `thicknessMinimum` and which is `thicknessMaximum`
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Matrix4, Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { LabelLayer } from './theme/LabelLayer';

import { STRIP_HEIGHT, STRIP_WIDTH } from './scene';

/** Px between the strip's edge and a tag */
const TAG_GAP = 6;

export function createVisuals({ app, view3d, stage, strip }) {
  const labels = new LabelLayer({ view3d, stage });
  const left = -STRIP_WIDTH / 2;
  const right = STRIP_WIDTH / 2;
  const top = STRIP_HEIGHT / 2;
  const bottom = -STRIP_HEIGHT / 2;
  // Each tag lines up with its end, one above the strip and one below, so the two never meet however narrow it shows.
  const minimum = labels.add({
    text: 'thicknessMinimum',
    node: strip,
    at: { x: left, y: top, z: 0 },
    anchor: { x: 0, y: 1 },
    offset: { x: 0, y: -TAG_GAP },
  });
  const maximum = labels.add({
    text: 'thicknessMaximum',
    node: strip,
    at: { x: right, y: bottom, z: 0 },
    anchor: { x: 1, y: 0 },
    offset: { x: 0, y: TAG_GAP },
  });
  const transform = new Matrix4();
  const corner = new Vector3();
  const leftEnd = new Point();
  const rightEnd = new Point();

  app.stage.addChild(labels);

  /** How steeply the strip's edge at its own `y` runs on screen, in px down per px right */
  function edgeSlope(y) {
    const l = view3d.worldToScreen(
      corner.set(left, y, 0).applyAffineMatrix4(transform),
      leftEnd,
    );
    const r = view3d.worldToScreen(
      corner.set(right, y, 0).applyAffineMatrix4(transform),
      rightEnd,
    );

    return l && r ? (r.y - l.y) / (r.x - l.x) : 0;
  }

  return {
    update() {
      // Seen at a slant the strip's edges slope on screen, so a tag that runs inward from a corner would dip into the
      // strip by the slope times its width; each moves off by that much.
      strip.getGlobalTransform(transform);
      minimum.offset.y =
        -TAG_GAP - Math.max(0, -edgeSlope(top) * minimum.width);
      maximum.offset.y =
        TAG_GAP + Math.max(0, -edgeSlope(bottom) * maximum.width);
      labels.update();
    },
  };
}
