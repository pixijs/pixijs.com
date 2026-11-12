/**
 * The props: a clay brick wall, and three clay critters that march behind it where the main camera never sees them
 *
 * None of it is the pass; `index.ts` decides which critters join it.
 */

import { Container3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { clayGeometry, roundedBox } from './theme/shapes';

/**
 * A brick's size. Two staggered rows of four make a wall 6 wide and 1.8 tall: higher than any sight line over it from
 * the fenced orbit, which crosses the critters' depth at about 1.5, while their tops reach 1.02.
 */
const BRICK = { width: 1.5, height: 0.9, depth: 0.5, radius: 0.08 };
const BRICKS_PER_ROW = 4;
/** Half the wall's length */
const WALL_HALF_WIDTH = (BRICK.width * BRICKS_PER_ROW) / 2;

export const CRITTER_NAMES = ['sphere', 'cube', 'capsule'];

/**
 * Each critter's clay and its centre's height resting on the floor: the sphere's radius, half the cube's 0.8, and the
 * radius of the capsule lying on its side. On its side the capsule is a pill from the front and from above, so the
 * inset matches its silhouette.
 */
const CRITTERS = {
  sphere: { color: 'pink', y: 0.45 },
  cube: { color: 'purple', y: 0.4 },
  capsule: {
    color: 'orange',
    y: 0.23,
    rotation: { x: 0, y: 0, z: Math.PI / 2 },
  },
};
/** Close behind the wall's back face, so a silhouette stays inside the wall's outline across the orbit's fence */
export const CRITTER_Z = -0.95;
/** With the march, keeps the outer critters' far edges at 2.43, inside the wall's ends at 3 */
const CRITTER_SPACING = 1.5;
const MARCH = 0.45;
/** Radians a second of the march's 14 s sweep, and of the hops, each critter a beat after the last */
const MARCH_SPEED = 0.45;
const HOP_SPEED = 2.2;
const HOP_HEIGHT = 0.12;
const HOP_LAG = 1.3;
/** The cube turns, in radians a second: a turning sphere looks the same, and a capsule would swing end-on */
const CUBE_SPIN = 0.5;

/** The wall: four bricks along the bottom, then half, three, half along the top, centred on x 0 and z 0 */
export function createWall(parent) {
  const { width, height, depth, radius } = BRICK;
  const brick = roundedBox(width, height, depth, radius);
  const half = roundedBox(width / 2, height, depth, radius);
  const material = clayMaterial('white');
  const wall = new Container3D({ label: 'wall', parent });
  const add = (geometry, x, y) =>
    new Mesh3D({ geometry, material, position: { x, y, z: 0 }, parent: wall });

  for (let i = 0; i < BRICKS_PER_ROW; i++) {
    add(brick, -WALL_HALF_WIDTH + width * (i + 0.5), height / 2);
  }
  // The top row starts and ends on a half brick, so its joints sit over the middle of the bricks below.
  add(half, -WALL_HALF_WIDTH + width / 4, height * 1.5);
  for (let i = 1; i < BRICKS_PER_ROW; i++)
    add(brick, -WALL_HALF_WIDTH + width * i, height * 1.5);
  add(half, WALL_HALF_WIDTH - width / 4, height * 1.5);

  return wall;
}

/** The three critters, left to right, each in its own clay colour so each has its own material */
export function createCritters(parent) {
  const create = (name, i) =>
    new Mesh3D({
      label: name,
      geometry: clayGeometry(name),
      material: clayMaterial(CRITTERS[name].color),
      position: {
        x: (i - 1) * CRITTER_SPACING,
        y: CRITTERS[name].y,
        z: CRITTER_Z,
      },
      rotation: CRITTERS[name].rotation,
      parent,
    });

  return {
    sphere: create('sphere', 0),
    cube: create('cube', 1),
    capsule: create('capsule', 2),
  };
}

/** All three slide together, so they never collide, and each hops on its own beat */
export function moveCritters(critters, time) {
  const sweep = Math.sin(time * MARCH_SPEED) * MARCH;

  for (let i = 0; i < CRITTER_NAMES.length; i++) {
    const name = CRITTER_NAMES[i];
    const { position } = critters[name];

    position.x = (i - 1) * CRITTER_SPACING + sweep;
    position.y =
      CRITTERS[name].y +
      Math.abs(Math.sin(time * HOP_SPEED + i * HOP_LAG)) * HOP_HEIGHT;
  }
  critters.cube.rotation.y = time * CUBE_SPIN;
}
