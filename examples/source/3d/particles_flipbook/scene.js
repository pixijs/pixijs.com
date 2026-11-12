/**
 * The props the lesson needs on stage but doesn't teach: a clay campfire of an ash bed, four logs and a ring of stones
 */

import { Mesh3D } from '@pixi/3d';

import { DEG_TO_RAD } from 'pixi.js';

import { clayMaterial } from './theme/clay';
import { BRAND, CLAY, mixColor } from './theme/palette';
import { clayGeometry, roundedCylinder } from './theme/shapes';

/** A dark plum bed, so the base of a glowing fire has something dark to glow over on the light theme too */
const ASH_COLOR = mixColor(BRAND.night, CLAY.purple, 0.3);

/** Each log's centre, out from the middle, and its tilt: the outer end rests on the floor, the inner ends meet raised */
const LOG = { radius: 0.09, length: 0.85, reach: 0.55, tilt: 15 * DEG_TO_RAD };
/** The ring of stones round the logs: one between every two logs */
const STONES = {
  count: 8,
  reach: 1.15,
  size: { x: 0.4, y: 0.26, z: 0.34 },
  turn: 0.7,
};

/** Lays an ash bed, four logs and a ring of stones at the origin of `parent` */
export function createCampfire(parent) {
  new Mesh3D({
    geometry: roundedCylinder(0.85, 0.05, 0.02),
    material: clayMaterial(ASH_COLOR),
    position: { x: 0, y: 0.025, z: 0 },
    castShadow: false,
    receiveShadow: true,
    parent,
  });

  // One geometry and one shared clay material for all four, so they draw as one instanced draw.
  const log = roundedCylinder(LOG.radius, LOG.length, 0.04);
  // The log's centre height that rests its outer end on the floor once tipped.
  const height = (LOG.length / 2) * Math.sin(LOG.tilt) + LOG.radius;

  for (let i = 0; i < 4; i++) {
    const turn = (45 + 90 * i) * DEG_TO_RAD;

    new Mesh3D({
      geometry: log,
      material: clayMaterial('orange'),
      position: {
        x: LOG.reach * Math.cos(turn),
        y: height,
        z: -LOG.reach * Math.sin(turn),
      },
      // Tipped from upright toward the middle, then turned into place; its raised +y end is the inner one.
      rotation: { x: 0, y: turn, z: Math.PI / 2 - LOG.tilt },
      castShadow: true,
      parent,
    });
  }

  for (let i = 0; i < STONES.count; i++) {
    const turn = (22.5 + 45 * i) * DEG_TO_RAD;

    new Mesh3D({
      geometry: clayGeometry('sphere'),
      material: clayMaterial(i % 2 ? 'white' : 'lilac'),
      position: {
        x: STONES.reach * Math.cos(turn),
        y: STONES.size.y / 2 + 0.015,
        z: -STONES.reach * Math.sin(turn),
      },
      rotation: { x: 0, y: i * STONES.turn, z: 0 },
      scale: STONES.size,
      castShadow: true,
      parent,
    });
  }
}
