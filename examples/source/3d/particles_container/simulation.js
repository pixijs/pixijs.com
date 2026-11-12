/**
 * The simulation the container draws: each point springs toward its home on the logo while a smooth flow, and now
 * and then a gust, pushes it off
 *
 * It knows nothing about particles; it moves numbers in plain arrays, one per axis, so the write loop reads
 * `x[i], y[i], z[i]`.
 */

/** Seconds a point can go unmoved before it counts as having sat out: longer than any clamped tick */
const RETURN_GAP = 0.25;
/** Where the gust's band starts and ends along x, past both ends of a 4-unit logo so the wrap never shows */
const GUST_FROM = -3.2;
const GUST_TO = 3.2;
/** Seconds the gust takes to cross: time for the logo to re-form behind it before the next one comes */
const GUST_PERIOD = 7;
/** The gust band's width, as the spread of a bell curve along x: about a letter, so it passes one letter at a time */
const GUST_WIDTH = 0.22;
/**
 * How hard the flow pushes everywhere, a drift of about 3 px that keeps the cloud live, and how much harder inside the
 * gust, enough to fling a dot about 0.2 units (30 px) off, so the wave reads from the starting distance
 */
const CALM = 1.8;
const GUST = 26;
/** The spring home and the drag on it: a little under critical, so a flung dot overshoots a touch and settles fast */
const SPRING = 60;
const DAMPING = 11;

/** A simulation of the points in `points`, x, y, z triples, each starting at rest on its home */
export function createCloudSimulation(points) {
  const count = points.length / 3;
  const homeX = new Float32Array(count);
  const homeY = new Float32Array(count);
  const homeZ = new Float32Array(count);
  const vx = new Float32Array(count);
  const vy = new Float32Array(count);
  const vz = new Float32Array(count);
  // -Infinity, so a point's first move starts it at home.
  const lastMoved = new Float64Array(count).fill(-Infinity);

  for (let i = 0; i < count; i++) {
    homeX[i] = points[i * 3];
    homeY[i] = points[i * 3 + 1];
    homeZ[i] = points[i * 3 + 2];
  }

  const x = homeX.slice();
  const y = homeY.slice();
  const z = homeZ.slice();

  function move(i, dt, time, noise) {
    // A point that sat out while `count` was lower starts again at home and at rest, so a raised count fills in
    // calmly instead of snapping old positions home.
    if (time - lastMoved[i] > RETURN_GAP) {
      x[i] = homeX[i];
      y[i] = homeY[i];
      z[i] = homeZ[i];
      vx[i] = vy[i] = vz[i] = 0;
    }
    lastMoved[i] = time;

    const gustX =
      GUST_FROM + ((time % GUST_PERIOD) / GUST_PERIOD) * (GUST_TO - GUST_FROM);
    const d = homeX[i] - gustX;
    const push =
      noise *
      (CALM + GUST * Math.exp(-(d * d) / (2 * GUST_WIDTH * GUST_WIDTH)));
    const px = x[i];
    const py = y[i];
    const pz = z[i];
    // Each axis is built from the other two, so the flow swirls rather than bunching the points, and its waves are
    // short beside the logo, so neighbouring points part instead of the letters bending as one.
    const fx =
      Math.sin(py * 7.3 + time * 1.7) + Math.sin(pz * 9.1 - time * 1.3);
    const fy =
      Math.sin(pz * 8.3 + time * 1.5) + Math.sin(px * 6.7 + time * 1.9);
    const fz =
      Math.sin(px * 7.9 - time * 1.6) + Math.sin(py * 8.9 + time * 1.2);

    // Semi-implicit Euler: the new velocity moves the point, which keeps a stiff spring stable.
    vx[i] += (SPRING * (homeX[i] - px) + push * fx - DAMPING * vx[i]) * dt;
    vy[i] += (SPRING * (homeY[i] - py) + push * fy - DAMPING * vy[i]) * dt;
    vz[i] += (SPRING * (homeZ[i] - pz) + push * fz - DAMPING * vz[i]) * dt;
    x[i] = px + vx[i] * dt;
    y[i] = py + vy[i] * dt;
    z[i] = pz + vz[i] * dt;
  }

  return { x, y, z, move };
}
