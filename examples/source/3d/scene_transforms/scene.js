/** The props round the door: a lilac frame and two white hinge knuckles, which the lesson needs but doesn't teach */

import { Container3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { roundedBox, roundedCylinder } from './theme/shapes';

/** The gap between the door's edges and the posts, wide enough for its hinge-side corners to swing past */
const GAP = 0.06;
const POST = { width: 0.14, depth: 0.22 };
/** How much taller the posts stand than the door: its gap off the floor and under the lintel */
const CLEARANCE = 0.06;
/** The knuckles' heights, about a fifth and four fifths of the way up the door */
const KNUCKLE_HEIGHTS = [0.45, 1.7];

/**
 * Builds two posts and a lintel round a shut door, and the hinge knuckles on its hinge edge
 *
 * The knuckles belong to the frame, not the door, so they stay put while the door turns inside them. They cast no
 * shadow, since theirs would hide under the door's.
 */
export function createDoorFrame({ parent, at, size, hingeX }) {
  const frame = new Container3D({ label: 'doorFrame', position: at, parent });
  const lilac = clayMaterial('lilac');
  const postHeight = size.height + POST.width + CLEARANCE;
  const postX = size.width / 2 + GAP + POST.width / 2;
  const post = roundedBox(POST.width, postHeight, POST.depth, 0.04);
  const floor = -at.y;

  for (const side of [-1, 1]) {
    new Mesh3D({
      geometry: post,
      material: lilac,
      position: { x: side * postX, y: floor + postHeight / 2, z: 0 },
      parent: frame,
    });
  }
  new Mesh3D({
    geometry: roundedBox(postX * 2 + POST.width, POST.width, POST.depth, 0.04),
    material: lilac,
    position: { x: 0, y: floor + postHeight - POST.width / 2, z: 0 },
    parent: frame,
  });

  // As wide as the gap, so a knuckle centred on the door's edge reaches the post.
  const knuckle = roundedCylinder(GAP, 0.2, 0.015);

  for (const height of KNUCKLE_HEIGHTS) {
    new Mesh3D({
      geometry: knuckle,
      material: clayMaterial('white'),
      position: { x: hingeX, y: floor + height, z: 0 },
      castShadow: false,
      parent: frame,
    });
  }

  return frame;
}
