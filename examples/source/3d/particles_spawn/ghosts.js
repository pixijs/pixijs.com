/**
 * The proof of the seed: ink paths where some of the show's sparks flew on its first run, a ring on each path where
 * the seed puts that spark now, and an arrow from a ring to its spark when the spark flies elsewhere
 *
 * The paths and rings are worked out from the first run's birth records with the shader's own formula, so on a seeded
 * replay every ring holds its pink spark. Once a `spawn` draws from the stream between a seek and the show's pops,
 * those pops take other draws: each ring runs along its path empty, with an arrow to where its spark really is. The
 * rings follow the first show after a seek only: a repeat carries the stream on, so its sparks fly new paths.
 */

import { Vector3 } from '@pixi/3d';

import { PathHelper } from './theme/PathHelper';
import { PointsHelper } from './theme/PointsHelper';
import { sparkAt, TRACE_FLOATS, TRACE_LIFE } from './records';

/** Every 12th spark of a pop is traced: enough paths to show the cone's shape without hiding the sparks */
const TRACE_EVERY = 12;
/** Points along each path, from birth to the end of its life, and the pen lift after them */
const PATH_POINTS = 32;
const PATH_STRIDE = (PATH_POINTS + 1) * 3;
/** The share of its life a ring follows its spark: past it the spark has faded and shrunk too far to see inside it */
const RING_LIFE = 0.8;
/**
 * The paths' and arrows' widths and the rings' radius, in world units, at weight 1. The arrows are ink and heavier than
 * the paths, so they read over the pink sparks.
 */
const LINE = { path: 0.012, arrow: 0.03, radius: 0.1 };
/** The paths' opacity by theme: light ink on the night floor reads brighter than the sparks, so it drops there */
const PATH_OPACITY = { light: 0.45, dark: 0.25 };
/** How far a spark sits from its ring, in world units, before a line joins them: a seeded spark sits exactly on it */
const STRAY = 0.02;

const _seeded = new Vector3();
const _actual = new Vector3();

export function createGhosts({ sparks, records, bursts, stage, parent }) {
  // Bursts due at the same moment are stamped with one birth, so they fire as one pop.
  const pops = new Set(bursts.map((burst) => burst.time)).size;
  const maxTraced = bursts.reduce(
    (sum, burst) => sum + Math.ceil(burst.count / TRACE_EVERY),
    0,
  );
  // The first seeded run's record of each traced spark, and this run's record of the spark in its place.
  const seed = new Float32Array(maxTraced * TRACE_FLOATS);
  const actual = new Float32Array(maxTraced * TRACE_FLOATS);
  // Which pop each traced spark belongs to, and its place in that pop's batch.
  const popOf = new Uint8Array(maxTraced);
  const indexInPop = new Uint16Array(maxTraced);
  const births = new Float64Array(pops);
  const pathPoints = new Float32Array(maxTraced * PATH_STRIDE);
  const ringPoints = new Float32Array(maxTraced * 3);
  const strayPoints = new Float32Array(maxTraced * 6);
  const paths = new PathHelper({
    thickness: LINE.path,
    capacity: maxTraced * (PATH_POINTS + 1),
    parent,
  });
  const rings = new PointsHelper({
    positions: ringPoints,
    radius: LINE.radius,
    hollow: true,
    parent,
  });
  const strays = new PathHelper({
    thickness: LINE.arrow,
    head: true,
    capacity: maxTraced * 3,
    parent,
  });
  let traced = 0;
  let tracedPops = 0;
  let popsThisRun = 0;
  let clearedPops = 0;
  let streamMoved = false;
  let shown = 0;
  let strayed = 0;
  let dark = -1;

  // Nothing is traced yet, so no rings.
  rings.count = 0;
  rings.update();

  /** Traces every TRACE_EVERY-th spark of a pop and draws its path from birth to death */
  function tracePop(batch) {
    for (let j = 0; j < batch.count && traced < maxTraced; j += TRACE_EVERY) {
      const offset = traced * TRACE_FLOATS;

      records.trace((batch.first + j) % sparks.capacity, seed, offset);
      popOf[traced] = tracedPops;
      indexInPop[traced] = j;
      for (let i = 0; i < PATH_POINTS; i++) {
        sparkAt(
          seed,
          offset,
          (i / (PATH_POINTS - 1)) * seed[offset + TRACE_LIFE],
          sparks,
          _seeded,
        );
        _seeded.toArray(pathPoints, traced * PATH_STRIDE + i * 3);
      }
      pathPoints[traced * PATH_STRIDE + PATH_POINTS * 3] = NaN;
      traced++;
    }
    tracedPops++;
    paths.setPoints(pathPoints, traced * (PATH_POINTS + 1));
  }

  /** Reads this run's record of each traced spark of pop `pop`, from the same place in its batch */
  function readActual(pop, batch) {
    for (let i = 0; i < traced; i++) {
      const offset = i * TRACE_FLOATS;

      if (popOf[i] !== pop) continue;
      if (indexInPop[i] < batch.count)
        records.trace(
          (batch.first + indexInPop[i]) % sparks.capacity,
          actual,
          offset,
        );
      // A smaller batch than the seed's has no spark in that place.
      else actual[offset + TRACE_LIFE] = 0;
    }
  }

  return {
    addPop(batch) {
      // A repeat's pops draw on from the stream, so only the first show after a seek has rings.
      if (popsThisRun === pops) return;

      const pop = popsThisRun++;

      births[pop] = batch.birth;
      // Paths come from a run whose stream nothing has moved yet, so every seeded replay retraces them.
      if (pop === tracedPops && !streamMoved) tracePop(batch);
      readActual(pop, batch);
    },
    addSpawn() {
      if (popsThisRun < pops) streamMoved = true;
    },
    newRun() {
      popsThisRun = 0;
      clearedPops = 0;
      streamMoved = false;
    },
    clear() {
      clearedPops = popsThisRun;
    },
    setWeight(weight) {
      paths.thickness = LINE.path * weight;
      strays.thickness = LINE.arrow * weight;
      rings.radius = LINE.radius * weight;
      rings.update();
    },
    update(time) {
      const wasShown = shown;
      const wasStrayed = strayed;
      const darkTheme = stage.darkness > 0.5 ? 1 : 0;

      if (darkTheme !== dark) {
        dark = darkTheme;
        paths.opacity = dark ? PATH_OPACITY.dark : PATH_OPACITY.light;
      }
      shown = 0;
      strayed = 0;
      for (let i = 0; i < traced; i++) {
        const pop = popOf[i];
        const offset = i * TRACE_FLOATS;
        const age = time - births[pop];
        const life = actual[offset + TRACE_LIFE];

        if (pop >= popsThisRun || pop < clearedPops || age < 0) continue;
        // Where this run's spark is: born with its pop, alive until its own life runs out.
        if (age <= life) sparkAt(actual, offset, age, sparks, _actual);
        if (age > seed[offset + TRACE_LIFE] * RING_LIFE) continue;
        // Where the seed puts it: its first run's record at the same age.
        sparkAt(seed, offset, age, sparks, _seeded);
        _seeded.toArray(ringPoints, shown++ * 3);
        if (age <= life && _seeded.distanceTo(_actual) > STRAY) {
          _seeded.toArray(strayPoints, strayed * 6);
          _actual.toArray(strayPoints, strayed * 6 + 3);
          strayed++;
        }
      }
      if (strayed > 0 || wasStrayed > 0)
        strays.setSegments(strayPoints, strayed);
      if (shown === 0 && wasShown === 0) return;
      rings.count = shown;
      rings.update();
    },
  };
}
