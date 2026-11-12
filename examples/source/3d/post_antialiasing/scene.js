/**
 * The prop the lesson looks along: a clay ranch fence that runs from the near left into the haze
 *
 * Nothing here is the lesson. Its round posts, its rail and its hair-thin wire start several pixels wide and end under
 * one, so one fence shows every width an edge can alias at.
 */

import { Container3D, Mesh3D, Vector3 } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { roundedCylinder } from './theme/shapes';

/** Enough posts that the far end runs into the haze from the camera's distance */
const POSTS = 18;
/** Units between posts: wide enough that the loupe's patch, midway between two, shows open rail between them */
const SPACING = 2;
/** Thin round posts, so even the near ones read as a fence rather than a wall of bars */
const POST = { height: 1.2, radius: 0.06 };
/** About 2.7 canvas px at the loupe on a 1× screen, so its patch holds the rail and the wire */
const RAIL = { height: 1.05, radius: 0.03 };
/** Under a pixel wide at the loupe on every screen; 0.1 under the rail, close enough to share its patch */
const WIRE = { height: 0.95, radius: 0.004 };
/** The first post, near the camera on its left */
const START = new Vector3(-5.5, 0, 4.5);
/** The way the fence runs: right and away, so the far end meets the haze */
const DIRECTION = new Vector3(1, 0, -1.6).normalize();
const UP = { x: 0, y: 1, z: 0 };

/** A rod along the fence */

/** Builds the fence: posts in one row, then a rail along their tops and a wire under it */
export function createFence() {
  const root = new Container3D({ label: 'fence' });
  const length = (POSTS - 1) * SPACING;
  const post = roundedCylinder(POST.radius, POST.height, 0.03, 24);
  const at = new Vector3();

  function pointAt(along, height, out) {
    out.copyFrom(START).addScaledVector(DIRECTION, along);
    out.y = height;

    return out;
  }

  for (let i = 0; i < POSTS; i++) {
    new Mesh3D({
      geometry: post,
      material: clayMaterial('purple'),
      position: pointAt(i * SPACING, POST.height / 2, at),
      parent: root,
    });
  }

  /** A rod the fence's length at its height, turned from the cylinder's +y onto the fence */
  function addRod({ height, radius }, edge, segments, color) {
    // Thin rods cast shadows too fine for the shadow map, which step on the floor: an artefact neither fix is about.
    const rod = new Mesh3D({
      geometry: roundedCylinder(radius, length, edge, segments),
      material: clayMaterial(color),
      position: pointAt(length / 2, height, at),
      castShadow: false,
      parent: root,
    });

    rod.quaternion.setFromUnitVectors(UP, DIRECTION);
  }

  addRod(RAIL, 0.015, 24, 'purple');
  addRod(WIRE, WIRE.radius, 12, 'pink');

  return { root, direction: DIRECTION, wire: WIRE, spacing: SPACING, pointAt };
}
