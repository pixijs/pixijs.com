/**
 * The props: a clay town block for the camera to look at
 *
 * Two identical sky-blue houses stand at the block's nearest and farthest corners, so the frame can compare one
 * house at two distances. The rest is a ring of houses, shops and towers round a courtyard.
 */

import { Container3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { clayGeometry, roundedBox, roundedCylinder } from './theme/shapes';

/** The gap between lots: five of them span 7.5 inside the 8 × 8 slab, whose edges land on the floor's check lines */
const LOT = 1.5;
/** The slab's height, which every building stands on */
const PAVEMENT = 0.16;
/** A building's footprint, square */
const WIDTH = 1.05;
const HEIGHT = { house: 0.8, shop: 1.15, tower: 1.9 };
/** How far a gable's ridge stands above the walls: half the turned roof's diagonal, less its rounding */
const GABLE = 0.49;

/** The orbit's target, at about the buildings' middle height */
export const TOWN_CENTER = { x: 0, y: 0.6, z: 0 };
/** The town's bounding sphere, with room for the tags over its corners; the camera frames this */
export const TOWN_RADIUS = 6.3;
/** The tallest roof's height, the towers' */
export const TOWN_HEIGHT = PAVEMENT + HEIGHT.tower;

/** A building on lot (i, j); a house's roof ridge runs along x or z */

const LOTS = [
  {
    i: 2,
    j: 2,
    kind: 'house',
    body: 'sky',
    roof: 'white',
    ridge: 'x',
    twin: true,
  },
  {
    i: -2,
    j: -2,
    kind: 'house',
    body: 'sky',
    roof: 'white',
    ridge: 'x',
    twin: true,
  },
  { i: -2, j: 2, kind: 'tower', body: 'purple', axes: true },
  { i: 2, j: -2, kind: 'tower', body: 'lilac' },
  { i: 0, j: -2, kind: 'house', body: 'palePink', roof: 'pink', ridge: 'x' },
  { i: 1, j: -2, kind: 'shop', body: 'white' },
  { i: -2, j: 0, kind: 'house', body: 'white', roof: 'purple', ridge: 'z' },
  { i: -2, j: 1, kind: 'shop', body: 'palePink' },
  { i: 2, j: -1, kind: 'house', body: 'pink', roof: 'white', ridge: 'z' },
  { i: 2, j: 0, kind: 'shop', body: 'lilac' },
  { i: 2, j: 1, kind: 'house', body: 'white', roof: 'pink', ridge: 'z' },
  { i: -1, j: 2, kind: 'house', body: 'pink', roof: 'white', ridge: 'x' },
  { i: 0, j: 2, kind: 'shop', body: 'white' },
  { i: 1, j: 2, kind: 'house', body: 'lilac', roof: 'purple', ridge: 'x' },
];

/** Trees as x, z and size: two small ones on the far corner's lots, which keep the far twin's sides in view */
const TREES = [
  [-1.5, -3, 0.75],
  [-3, -1.5, 0.75],
  [-1.4, -1.4, 1],
  [1.4, -1.4, 0.85],
  [-1.4, 1.4, 0.9],
  [1.4, 1.4, 1],
];

export function createTown(parent) {
  const root = new Container3D({ label: 'town', parent });
  const bodies = {
    house: roundedBox(WIDTH, HEIGHT.house, WIDTH, 0.08),
    shop: roundedBox(WIDTH, HEIGHT.shop, WIDTH, 0.08),
    tower: roundedBox(WIDTH, HEIGHT.tower, WIDTH, 0.08),
  };
  // Two roofs, a square bar turned 45° about its long axis, so its upper half shows as a gable.
  const roof = {
    x: roundedBox(1.12, 0.74, 0.74, 0.08),
    z: roundedBox(0.74, 0.74, 1.12, 0.08),
  };
  const trunk = roundedCylinder(0.06, 0.3, 0.03, 12, 2);
  const twinRidges = [];
  let towerTop = { x: 0, y: 0, z: 0 };

  const place = (geometry, color, x, y, z) =>
    new Mesh3D({
      geometry,
      material: clayMaterial(color),
      position: { x, y, z },
      parent: root,
    });

  place(roundedBox(8, PAVEMENT, 8, 0.06), 'white', 0, PAVEMENT / 2, 0);

  for (const {
    i,
    j,
    kind,
    body,
    roof: roofColor,
    ridge,
    twin = false,
    axes = false,
  } of LOTS) {
    const x = i * LOT;
    const z = j * LOT;
    const height = HEIGHT[kind];

    place(bodies[kind], body, x, PAVEMENT + height / 2, z);
    if (roofColor && ridge) {
      const gable = place(roof[ridge], roofColor, x, PAVEMENT + height, z);

      if (ridge === 'x') gable.rotation.x = Math.PI / 4;
      else gable.rotation.z = Math.PI / 4;
    }
    if (twin) twinRidges.push({ x, y: PAVEMENT + height + GABLE, z });
    if (axes) towerTop = { x, y: PAVEMENT + height, z };
  }

  for (const [x, z, size] of TREES) {
    place(trunk, 'purple', x, PAVEMENT + 0.15, z);
    place(
      clayGeometry('sphere'),
      'palePink',
      x,
      PAVEMENT + 0.3 + 0.38 * size,
      z,
    ).scale.set(0.8 * size);
  }

  place(clayGeometry('puck'), 'paleSky', 0, PAVEMENT + 0.03, 0).scale.set(
    1.6,
    0.12,
    1.6,
  );

  return { root, twinRidges, towerTop };
}
