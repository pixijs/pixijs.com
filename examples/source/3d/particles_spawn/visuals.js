/**
 * What the frame draws to explain the seed: ink paths where some of the show's sparks flew on its first run, a ring on
 * each where the seed puts that spark now, an arrow from a ring to its spark when a spawn has moved the stream, and a
 * label naming the paths
 *
 * It reads the system's records each frame and never changes the system, so `index.ts` runs the same without it.
 */

import { LabelLayer } from './theme/LabelLayer';

import { createGhosts } from './ghosts';
import { createSparkRecords } from './records';

/** How near the emitter's height a batch starts for it to be one of the show's pops, in world units */
const ON_LAUNCHER = 0.01;
/** The most the lines widen as fitPortrait backs the camera off, so the rings still hug their sparks on a phone */
const MAX_WEIGHT = 2;

export function createVisuals({
  app,
  view3d,
  stage,
  sparks,
  bursts,
  fitAspect,
}) {
  const records = createSparkRecords(sparks);
  const ghosts = createGhosts({
    sparks,
    records,
    bursts,
    stage,
    parent: view3d.root,
  });
  // fitPortrait grows the view past the screen on a phone, so the labels keep to the screen.
  const labels = new LabelLayer({ view3d, stage, bounds: app.screen });
  let weight = 1;

  labels.add({ text: 'seeded paths', at: { x: 0, y: 2.9, z: 0 } });
  app.stage.addChild(labels);

  function onBatch(batch) {
    // A pop starts on the cone's spawn disc, level with the emitter on the launcher; a tap starts on the floor.
    if (Math.abs(batch.y - sparks.position.y) < ON_LAUNCHER)
      ghosts.addPop(batch);
    // A spawn draws from the stream, so the pops still to come this run take other draws than the first run's.
    else ghosts.addSpawn();
  }

  /** Widens the lines by as much as fitPortrait backs the camera off, up to MAX_WEIGHT */
  function fitWeight() {
    const next = Math.min(
      MAX_WEIGHT,
      Math.max(1, fitAspect / (app.screen.width / app.screen.height)),
    );

    if (next === weight) return;
    weight = next;
    ghosts.setWeight(weight);
  }

  return {
    newRun: () => ghosts.newRun(),
    cleared: () => ghosts.clear(),
    update() {
      records.readNew(onBatch);
      ghosts.update(sparks.time);
      fitWeight();
      labels.update();
    },
  };
}
