/**
 * What the frame draws to explain the stamp: a ring on the tablet at the pointer's hit, as wide as the next stamp
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { RingHelper } from './theme/RingHelper';

/** Lifts the ring over the marks, so it draws on top of the one it rings */
const RING_LIFT = 0.014;

export function createVisuals({ view3d, aim, settings }) {
  const ring = new RingHelper({
    parent: view3d.root,
    radius: settings.size / 2,
    thickness: 0.025,
    color: 'accent',
  });

  return {
    update() {
      ring.radius = settings.size / 2;
      ring.position.set(aim.x, aim.y + RING_LIFT, aim.z);
    },
  };
}
