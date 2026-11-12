/**
 * What the frame draws to explain a press's trip: a box round each node whose listener ran on the latest press,
 * accent round the target and ink round the ancestors that heard it on the way in or out, and filled round the node
 * whose listener stopped it
 *
 * It reads the trip each frame and never changes it, so `index.ts` runs the same without it.
 */

import { BoxHelper } from './theme/BoxHelper';

/** The stopper's box faces' opacity: enough to tint its shape, little enough to see the shape's colour through it */
const STOPPED_FILL = 0.35;
/** How far a box stands off its shape's bounds, so a filled box's faces don't fight the shape's flat faces for depth */
const STANDOFF = { x: 0.02, y: 0.02, z: 0.02 };

/** A node a listener can run on, and the mesh its box frames */

export function createVisuals({ trip, framed }) {
  // Round the shape alone, not everything under its node, so the boxes nest the way the nodes do without caging the
  // shapes inside them. As the shape's child, a box frames it in its own space.
  const boxes = framed.map(({ shape }) =>
    new BoxHelper({ parent: shape, visible: false }).setBox(standOff(shape)),
  );

  return {
    update() {
      for (let i = 0; i < framed.length; i++) {
        let heard = false;
        let atTarget = false;
        let stopped = false;

        for (let h = 0; h < trip.hops.length; h++) {
          const hop = trip.hops[h];

          if (hop.node !== framed[i].node) continue;
          heard = true;
          atTarget ||= hop.atTarget;
          stopped ||= hop.stopped;
        }
        boxes[i].visible = heard;
        boxes[i].color = atTarget ? 'accent' : 'ink';
        boxes[i].fill = stopped ? STOPPED_FILL : 0;
      }
    },
  };
}

/** The shape's bounds, grown by the standoff on every side */
function standOff(shape) {
  const box = shape.geometry.bounds3D.clone();

  box.min.subtract(STANDOFF);
  box.max.add(STANDOFF);

  return box;
}
