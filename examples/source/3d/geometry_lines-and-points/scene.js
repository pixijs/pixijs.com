/** The props: the figure-eight the path's vertices lie on */

/** The two list topologies the path draws as; strips are left out, since they black out the WebGPU frame */

/**
 * The narrowest screen, width over height, that shows the figure-eight whole from the landscape camera; on a narrower
 * one it spans the screen
 */
export const FIT_ASPECT = 1.35;

/** Half the figure-eight's width, and how much deeper it is than a plain lemniscate, in scene units */
const HALF_WIDTH = 3.6;
const DEPTH_SCALE = 1.25;
/** Where its crossing sits: a little toward the camera, so the floor behind it holds the torus */
const CENTRE_Z = 0.7;
/** Its height: just off the floor, so the floor never fights the 1 px line */
const HEIGHT = 0.02;
/** Samples taken along the curve to measure it, before it's cut into even steps */
const SAMPLES = 4000;

/**
 * `count` points on a figure-eight lying on the floor, evenly spaced along it, so a point list's dots sit evenly and
 * each step of `indexCount` adds the same length of line
 *
 * Vertex 0 is the left end, and the path heads away from the camera first, so the first half ends on the right
 * lobe's front edge, near the viewer.
 */
export function figureEightPositions(count) {
  const xz = new Float32Array((SAMPLES + 1) * 2);
  const along = new Float32Array(SAMPLES + 1);

  // A lemniscate of Bernoulli, from its left end.
  for (let i = 0; i <= SAMPLES; i++) {
    const t = Math.PI + (i / SAMPLES) * Math.PI * 2;
    const sin = Math.sin(t);
    const cos = Math.cos(t);
    const d = 1 + sin * sin;

    xz[i * 2] = (HALF_WIDTH * cos) / d;
    xz[i * 2 + 1] = CENTRE_Z - (DEPTH_SCALE * HALF_WIDTH * sin * cos) / d;
    if (i > 0)
      along[i] =
        along[i - 1] +
        Math.hypot(xz[i * 2] - xz[i * 2 - 2], xz[i * 2 + 1] - xz[i * 2 - 1]);
  }

  const positions = new Float32Array(count * 3);
  const step = along[SAMPLES] / count;

  for (let v = 0, i = 0; v < count; v++) {
    const target = v * step;

    while (along[i + 1] < target) i++;

    const f = (target - along[i]) / (along[i + 1] - along[i]);

    positions[v * 3] = xz[i * 2] + (xz[i * 2 + 2] - xz[i * 2]) * f;
    positions[v * 3 + 1] = HEIGHT;
    positions[v * 3 + 2] = xz[i * 2 + 1] + (xz[i * 2 + 3] - xz[i * 2 + 1]) * f;
  }

  return positions;
}
