/**
 * What the frame draws to explain the emitter shape: the baked points in the strip that emits, and for contrast
 * every baked point, or as many picked by vertex
 *
 * It reads the shape each frame and never changes it, so the sparks and the burn run the same without it.
 */

import { seededRandom } from '@pixi/3d';

import { PointsHelper } from './theme/PointsHelper';
import { collectTriangles } from './SurfaceShape';

/** The baked points the frame draws: the strip's alone, every one, or random triangle corners for contrast */

/** The pane's names for each view */
export const POINTS_OPTIONS = {
  Strip: 'strip',
  'All baked (by area)': 'baked',
  'Picked by vertex': 'vertex',
};

/** Small enough that the strip's few hundred dots read one by one on its band */
const RUN_RADIUS = 0.009;
/** A shade under the strip's dots, so the accent run, drawn after, covers the ink dots it sits on */
const CONTRAST_RADIUS = 0.008;

export function createVisuals({ logo, shape }) {
  // Sized to the fullest strip anywhere on the logo, so every run fits.
  const run = new PointsHelper({
    positions: shape.positions,
    capacity: largestRun(shape.positions, shape.strip),
    radius: RUN_RADIUS,
    color: 'accent',
    parent: logo.root,
  });
  const contrast = {};
  let shownFront = Number.NaN;
  let shownPoints = 'strip';

  /** The contrast's points, built the first time the pane asks for them */
  function showPoints(view) {
    if (view !== 'strip' && !contrast[view]) {
      contrast[view] = new PointsHelper({
        positions:
          view === 'baked'
            ? shape.positions
            : vertexSample(logo, shape.positions.length / 3),
        radius: CONTRAST_RADIUS,
        parent: logo.root,
      });
      // Blended draws at one spot keep the order they joined the scene in, so the strip's run joins again, after.
      logo.root.removeChild(run);
      logo.root.addChild(run);
    }
    for (const key of ['baked', 'vertex']) {
      if (contrast[key]) contrast[key].visible = key === view;
    }
    shownPoints = view;
  }

  const visuals = {
    points: 'strip',
    update() {
      if (shape.front !== shownFront) {
        shownFront = shape.front;
        run.first = shape.stripFirst;
        run.count = shape.stripCount;
        run.update();
      }
      if (visuals.points !== shownPoints) showPoints(visuals.points);
    },
  };

  return visuals;
}

/** The most points any strip of `width` holds, a two-pointer walk over the sorted x's */
function largestRun(positions, width) {
  const total = positions.length / 3;
  let most = 0;

  for (let first = 0, end = 0; first < total; first++) {
    while (end < total && positions[end * 3] <= positions[first * 3] + width)
      end++;
    most = Math.max(most, end - first);
  }

  return most;
}

/** `count` random triangle corners: where a shape that picked vertices would start its sparks */
function vertexSample(logo, count) {
  const corners = collectTriangles(logo.meshes, logo.root);
  const random = seededRandom('vertices');
  const points = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const corner = Math.floor(random() * (corners.length / 3)) * 3;

    for (let k = 0; k < 3; k++) points[i * 3 + k] = corners[corner + k];
  }

  return points;
}
