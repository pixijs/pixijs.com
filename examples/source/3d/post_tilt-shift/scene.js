/**
 * The props: a clay town round the logo
 *
 * The town is rows of white houses with coloured roofs either side of a long park, with a church spire in the near
 * left row and the logo on a plinth in the middle of the park. Every house shares a few geometries and the kit's
 * shared clay, so the town's couple of hundred meshes batch into a few dozen draws a pass.
 */

import { Container3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { clayGeometry, roundedBox, roundedCylinder } from './theme/shapes';

/** The house columns' x either side of the park, and the gap between rows down it */
const COLUMNS = [3.95, 5.35, 6.75];
const ROW_STEP = 1.6;
/** Rows -7 to 7 down the park, with gaps at ±3 for the cross streets */
const ROWS = 7;
const CROSS_STREET = 3;
/** The rows across the park's ends, beyond the bus's loop */
const END_ROWS = [9.5, 11.1];
const END_STEP = 1.3;
const HOUSE = { width: 1, height: 0.7, depth: 1.25 };
/** A roof is a square bar turned 45° about its ridge, so its top half is a gable */
const ROOF = { side: 0.74, length: 1.15 };
/** The turn that stands a roof's square bar on its edge, for a ridge along z or along x */
const ROOF_TURN = {
  z: { x: 0, y: 0, z: Math.PI / 4 },
  x: { x: Math.PI / 4, y: 0, z: 0 },
};
const TOWER_HEIGHT = 1.5;
const ROOF_COLORS = [
  'pink',
  'purple',
  'sky',
  'orange',
  'palePink',
  'lilac',
  'paleSky',
];
/**
 * Where the spire stands in place of a house: the near-left row. On screen its tip reaches up among the sharp houses,
 * yet it blurs, since it stands nearer the camera than the plane in focus: the blur goes by depth, not by height on
 * screen. A focalDepth of about 19 brings it into focus.
 */
const SPIRE = { x: -COLUMNS[0], z: 4 * ROW_STEP, height: 3.2 };
/** The spire's point: a clay octahedron stretched tall, square to the walls, its lower half inside the tower */
const SPIRE_POINT = {
  scale: { x: 1.3, y: 2.5, z: 1.3 },
  rotation: { x: 0, y: Math.PI / 4, z: 0 },
};
/** The park's trees: either side of its middle, from the second row to the fourth */
const TREE_X = 1.1;
const TREE_ROWS = [2, 3, 4];
/** A crown is the clay sphere at this scale, on a trunk */
const TREE_CROWN = 0.7;
const PLINTH = { width: 3.6, height: 0.24, depth: 1.2 };
/** The plinth and the logo face the camera's starting side, 18° round from the park's long axis */
const MONUMENT_TURN = 0.314;

/** A mesh's turn and stretch, as its options take them */

/** A shadow-casting clay mesh under `parent`, its turn or stretch passed as Mesh3D takes them */
export function addClay(parent, geometry, color, position, pose = {}) {
  return new Mesh3D({
    geometry,
    material: clayMaterial(color),
    position,
    ...pose,
    castShadow: true,
    parent,
  });
}

/** Builds the town round the logo, which it stands on a plinth in the middle of the park */
export function createTown(logo) {
  const root = new Container3D({ label: 'town' });
  // Every other house turns its length across the row, so each shape comes with its ridge along z and along x.
  const bodies = {
    z: roundedBox(HOUSE.width, HOUSE.height, HOUSE.depth, 0.1),
    x: roundedBox(HOUSE.depth, HOUSE.height, HOUSE.width, 0.1),
  };
  // Shorter than the body along the ridge, so its end doesn't show as a diamond past the wall.
  const roofs = {
    z: roundedBox(ROOF.side, ROOF.side, ROOF.length, 0.08),
    x: roundedBox(ROOF.length, ROOF.side, ROOF.side, 0.08),
  };
  const tower = roundedBox(HOUSE.width, TOWER_HEIGHT, HOUSE.width, 0.1);
  const towerRoof = roundedBox(1.15, 0.16, 1.15, 0.06);
  const place = (geometry, color, position, pose) =>
    addClay(root, geometry, color, position, pose);
  let count = 0;

  function addHouse(x, z, ridge) {
    const roofColor = ROOF_COLORS[(count * 3) % ROOF_COLORS.length];

    // About one in six is a tower, picked by a fixed sum so two runs build the same town.
    if ((count * count + count) % 13 < 2) {
      place(tower, 'white', { x, y: TOWER_HEIGHT / 2, z });
      place(towerRoof, roofColor, { x, y: TOWER_HEIGHT + 0.02, z });
    } else {
      place(
        roofs[ridge],
        roofColor,
        { x, y: HOUSE.height, z },
        { rotation: ROOF_TURN[ridge] },
      );
      place(bodies[ridge], 'white', { x, y: HOUSE.height / 2, z });
    }
    count++;
  }

  for (let row = -ROWS; row <= ROWS; row++) {
    if (Math.abs(row) === CROSS_STREET) continue;
    for (const side of [-1, 1]) {
      for (let column = 0; column < COLUMNS.length; column++) {
        const x = side * COLUMNS[column];
        const z = row * ROW_STEP;

        if (x === SPIRE.x && z === SPIRE.z) continue;
        addHouse(x, z, Math.abs(row + column) % 2 === 1 ? 'x' : 'z');
      }
    }
  }
  for (const z of END_ROWS) {
    for (let i = -2; i <= 2; i++) {
      addHouse(i * END_STEP, -z, 'z');
      addHouse(i * END_STEP, z, 'z');
    }
  }

  const spireTower = roundedBox(HOUSE.width, SPIRE.height, HOUSE.width, 0.1);

  place(spireTower, 'white', { x: SPIRE.x, y: SPIRE.height / 2, z: SPIRE.z });
  place(
    clayGeometry('octahedron'),
    'sky',
    { x: SPIRE.x, y: SPIRE.height, z: SPIRE.z },
    SPIRE_POINT,
  );

  const trunk = roundedCylinder(0.09, 0.4, 0.03);

  for (const row of TREE_ROWS) {
    for (const z of [-row * ROW_STEP, row * ROW_STEP]) {
      for (const x of [-TREE_X, TREE_X]) {
        place(trunk, 'white', { x, y: 0.2, z });
        place(
          clayGeometry('sphere'),
          row % 2 === 0 ? 'palePink' : 'lilac',
          { x, y: 0.66, z },
          { scale: TREE_CROWN },
        );
      }
    }
  }

  const plinth = roundedBox(PLINTH.width, PLINTH.height, PLINTH.depth, 0.1);

  place(
    plinth,
    'white',
    { x: 0, y: PLINTH.height / 2, z: 0 },
    { rotation: { x: 0, y: MONUMENT_TURN, z: 0 } },
  );
  // The logo comes loaded, so it's placed by its properties.
  logo.root.position.set(0, PLINTH.height + logo.half.y, 0);
  logo.root.rotation.y = MONUMENT_TURN;
  root.addChild(logo.root);

  // Across to the outer column's turned houses, and along to the last row, a little past the rows across the ends.
  const halfX = COLUMNS[COLUMNS.length - 1] + HOUSE.depth / 2;
  const halfZ = ROWS * ROW_STEP + HOUSE.depth / 2;

  return { root, radius: Math.hypot(halfX, halfZ) };
}
