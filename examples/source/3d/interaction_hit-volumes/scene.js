/**
 * The props the hit volumes go on: four clay shapes, stood four abreast on a wide screen or in two rows of two on a
 * narrower one
 *
 * Nothing here sets a hit volume or picks; `index.ts` makes every call the lesson is about.
 */

import { Mesh3D, Vector3 } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { clayGeometry } from './theme/shapes';

export const SHAPE_NAMES = ['octahedron', 'sphere', 'torus', 'puck'];

const COLORS = {
  octahedron: 'orange',
  sphere: 'purple',
  torus: 'sky',
  puck: 'lilac',
};
/** Big enough that the torus's hole and the box's empty corners read on a phone */
const SCALE = 1.4;

/** Four abreast, raised so every outline clears the floor; the orbit's own target sits at the row's middle */
const ROW = [
  { x: -3.9, y: 1, z: 0 },
  { x: -1.3, y: 1, z: 0 },
  { x: 1.3, y: 1, z: 0 },
  { x: 3.9, y: 1, z: 0 },
];
/** Two rows of two, the top row raised clear of the bottom row's outlines */
const GRID = [
  { x: -1.45, y: 3.4, z: 0 },
  { x: 1.45, y: 3.4, z: 0 },
  { x: -1.45, y: 1, z: 0 },
  { x: 1.45, y: 1, z: 0 },
];
/**
 * Where the orbit aims at the grid: well over its middle, so the grid stands low on screen and the top row's right
 * shape sits below the open pane's foot rather than beside it
 */
const GRID_TARGET_Y = 2.9;
/** The narrowest screen, width over height, that shows the row whole from the camera's distance */
const ROW_ASPECT = 1.5;
/** The narrowest screen that shows the grid whole; `fitPortrait` backs the camera off on a narrower one */
export const GRID_ASPECT = 0.75;
/** A shape higher than this casts no shadow: the grid's top row would throw its shadows between the shapes below */
const SHADOW_BELOW = 2;

const _offset = new Vector3();

/** The four clay shapes; {@link followLayout} stands them */
export function createShapes(view3d) {
  const shape = (name, rotation) =>
    new Mesh3D({
      // What `picked.target.label` reads.
      label: name,
      geometry: clayGeometry(name),
      material: clayMaterial(COLORS[name]),
      scale: SCALE,
      rotation,
      parent: view3d.root,
    });

  return {
    octahedron: shape('octahedron'),
    sphere: shape('sphere'),
    // On its rim, its hole to the camera.
    torus: shape('torus', { x: Math.PI / 2, y: 0, z: 0 }),
    // Turned so its bounding box's corners stick out past the round wall on screen, where only a box catches the
    // pointer. At 30° its right corner points nearly square to the camera's line of sight, so it sticks out farthest.
    puck: shape('puck', { x: 0, y: Math.PI / 6, z: 0 }),
  };
}

/** The radius of the smallest sphere round the origin that holds every vertex, for a `Sphere` hit volume */
export function enclosingRadius(geometry) {
  const positions = geometry.positions;
  let farthest = 0;

  for (let i = 0; i < positions.length; i += 3) {
    farthest = Math.max(
      farthest,
      positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2,
    );
  }

  return Math.sqrt(farthest);
}

/**
 * Stands the shapes in a row on a screen wide enough for it, or in the grid, where they show bigger, and moves the
 * orbit's target to the middle of whichever it is, keeping the camera's angle and distance
 *
 * It follows the renderer's resizes, so a phone turned after load stands them again.
 */
export function followLayout({ renderer, orbit, shapes }) {
  const { camera } = orbit.view;
  const rowTarget = orbit.target.clone();

  const stand = () => {
    const grid = renderer.screen.width / renderer.screen.height < ROW_ASPECT;
    const places = grid ? GRID : ROW;

    SHAPE_NAMES.forEach((name, i) => {
      shapes[name].position.copyFrom(places[i]);
      shapes[name].castShadow = places[i].y < SHADOW_BELOW;
    });
    _offset.copyFrom(camera.position).subtract(orbit.target);
    if (grid) orbit.target.set(rowTarget.x, GRID_TARGET_Y, rowTarget.z);
    else orbit.target.copyFrom(rowTarget);
    camera.position.copyFrom(orbit.target).add(_offset);
    orbit.update();
  };

  stand();
  renderer.on('resize', stand);
}
