/**
 * The props: a clay maze on the floor, built from a map of strings, with the walls the walker can't pass
 *
 * `createMaze` builds the clay walls and returns the start pose, the area the walker can reach, and `collide`, which
 * pushes a point out of the walls and holds it in that area.
 * `buildMazeWalls` lays out the same walls in any material, so the plan inset draws a flat copy of them.
 */

import { Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { roundedBox } from './theme/shapes';

/**
 * The maze from above, north (-z) at the top. Odd rows and columns are cells, `#` is a wall between two cells or a
 * post where walls meet, and the gap in the bottom row is the entrance. The centre cell, the logo's room, opens south.
 */
const MAZE = [
  '###########',
  '#         #',
  '# # # ### #',
  '# # #   # #',
  '# ##### # #',
  '# # # # # #',
  '# # # ### #',
  '# #   # # #',
  '# # ### # #',
  '#     #   #',
  '##### #####',
];
/** A cell's side: three floor checks, wide enough to walk and turn in */
const CELL = 3;
/** Where the maze's edge lies on x and z, either side of the centre */
export const MAZE_EDGE = ((MAZE.length - 1) * CELL) / 4;
/** Eye height, above the walls, so the maze reads as a maze from inside it and the logo stays in sight */
const EYE_HEIGHT = 1.6;
/**
 * How close the eye gets to a wall. The eye looks over the walls' tops, so a wall it stands against shows at the
 * bottom of the view only from this far back; any closer and the wall leaves the frame while it holds the walker.
 */
export const WALKER_RADIUS = 0.8;
/** Where the walk starts, outside the entrance, far enough out to see the maze laid out ahead */
const START_OUTSIDE = 3.5;
/** How far the walker can back away from the start, so S does something there before the walker stops */
const BACK_ROOM = 1.5;
/** The pitch the walk looks at: a little down, so the floor and the wall tops both show */
const WALK_PITCH = -0.12;
/** Post and panel sizes: waist-high panels between slightly taller posts */
const POST = { side: 0.36, height: 1.25 };
const PANEL = { length: CELL - POST.side, height: 1.1, thickness: 0.24 };

const panelGeometry = roundedBox(
  PANEL.length,
  PANEL.height,
  PANEL.thickness,
  0.08,
);
const postGeometry = roundedBox(POST.side, POST.height, POST.side, 0.1);

/** One piece of wall: its centre on the floor, half its size along x and z, and whether it's a post */

/** Every piece the map draws; odd rows hold the north-south panels, even rows the east-west ones and the posts */
const WALLS = MAZE.flatMap((row, r) =>
  row.split('').flatMap((mark, c) => {
    if (mark !== '#') return [];

    const post = r % 2 === 0 && c % 2 === 0;
    const across = r % 2 === 0;
    const half = post ? POST.side / 2 : PANEL.length / 2;
    const side = post ? POST.side / 2 : PANEL.thickness / 2;

    return [
      {
        x: c * (CELL / 2) - MAZE_EDGE,
        z: r * (CELL / 2) - MAZE_EDGE,
        halfX: across ? half : side,
        halfZ: across ? side : half,
        post,
      },
    ];
  }),
);

/** A pose for the walker: where it stands, and the yaw and pitch it faces */

/** The floor the walker can reach: the maze, and the ground in front of it, as wide as the maze */

/** Adds one mesh per wall piece under `parent`: two shared geometries, so the walls draw in a couple of batches */
export function buildMazeWalls(parent, materials, castShadow) {
  for (const wall of WALLS) {
    const height = wall.post ? POST.height : PANEL.height;

    new Mesh3D({
      geometry: wall.post ? postGeometry : panelGeometry,
      material: wall.post ? materials.post : materials.panel,
      position: { x: wall.x, y: height / 2, z: wall.z },
      // A panel is built along x; the north-south ones turn a quarter.
      rotation: { x: 0, y: wall.halfZ > wall.halfX ? Math.PI / 2 : 0, z: 0 },
      castShadow,
      parent,
    });
  }
}

export function createMaze(parent) {
  buildMazeWalls(
    parent,
    { panel: clayMaterial('lilac'), post: clayMaterial('purple') },
    true,
  );

  const area = {
    halfWidth: MAZE_EDGE,
    back: MAZE_EDGE + START_OUTSIDE + BACK_ROOM,
  };

  return {
    start: {
      position: { x: 0, y: EYE_HEIGHT, z: MAZE_EDGE + START_OUTSIDE },
      yaw: 0,
      pitch: WALK_PITCH,
    },
    area,
    collide(position) {
      // Two passes, so a walker pushed out of one wall into another at a corner settles.
      for (let pass = 0; pass < 2; pass++) {
        for (const wall of WALLS) pushOut(position, wall);
      }
      position.x = Math.max(
        -area.halfWidth,
        Math.min(position.x, area.halfWidth),
      );
      position.z = Math.min(position.z, area.back);
      // Walking follows the full view direction, so looking down would sink the walker, and Space and Shift lift it.
      position.y = EYE_HEIGHT;
    },
  };
}

/** The floor offset from a wall piece's nearest point to the last point `distanceFrom` measured */
const away = { x: 0, z: 0 };

/** How far `position` is from a wall piece's rectangle on the floor, 0 inside it; `away` holds the offset */
function distanceFrom(wall, position) {
  away.x =
    position.x -
    Math.max(wall.x - wall.halfX, Math.min(position.x, wall.x + wall.halfX));
  away.z =
    position.z -
    Math.max(wall.z - wall.halfZ, Math.min(position.z, wall.z + wall.halfZ));

  return Math.hypot(away.x, away.z);
}

/** Moves a walker's circle on the floor out of one wall piece's rectangle, along the line to its nearest point */
function pushOut(position, wall) {
  const distance = distanceFrom(wall, position);

  if (distance >= WALKER_RADIUS) return;
  if (distance > 1e-6) {
    position.x += (away.x / distance) * (WALKER_RADIUS - distance);
    position.z += (away.z / distance) * (WALKER_RADIUS - distance);

    return;
  }

  // The centre is inside the wall after a long step: out through the nearest side.
  const outX = wall.halfX - Math.abs(position.x - wall.x);
  const outZ = wall.halfZ - Math.abs(position.z - wall.z);

  if (outX < outZ)
    position.x =
      wall.x +
      Math.sign(position.x - wall.x || 1) * (wall.halfX + WALKER_RADIUS);
  else
    position.z =
      wall.z +
      Math.sign(position.z - wall.z || 1) * (wall.halfZ + WALKER_RADIUS);
}
