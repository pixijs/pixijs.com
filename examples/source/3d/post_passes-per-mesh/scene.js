/**
 * The props: a field of twelve clay shapes in two colours either side of an open lane, the sky clay capsule that walks
 * up and down that lane, and the key light that lays every shadow back and to the right
 *
 * Nothing here touches a pass. `index.ts` makes every pass call, on the meshes and on their materials, and picks how
 * each mesh hears the pointer.
 */

import { Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { clayGeometry } from './theme/shapes';

/** How a mesh hears the pointer, which `index.ts` picks */

/** The clay shapes with no hard edges, the only ones an outline wraps cleanly */

/**
 * Where the four columns stand. The middle two keep a lane open down the field, so from the start view nothing stands
 * in front of the hidden capsule or behind its tag, even on a phone held upright.
 */
const COLUMNS = [-3.6, -1.8, 1.8, 3.6];
/** The gap between rows, wide enough that no shadow reaches the row behind */
const ROW_SPACING = 2.2;
/**
 * The field, back row first, in a lilac and orange checkerboard. Every shape comes in both colours, so joining by
 * material picks out a colour, not a shape. Slim capsules line the lane in the back two rows, where the tag passes
 * between them. Only smooth shapes: the outline pushes each vertex out along its normal, and a hard edge with split
 * normals would tear it.
 */
const FIELD = [
  [
    ['sphere', 'lilac'],
    ['capsule', 'orange'],
    ['capsule', 'lilac'],
    ['torus', 'orange'],
  ],
  [
    ['torus', 'orange'],
    ['capsule', 'lilac'],
    ['capsule', 'orange'],
    ['sphere', 'lilac'],
  ],
  [
    ['puck', 'lilac'],
    ['sphere', 'orange'],
    ['torus', 'lilac'],
    ['puck', 'orange'],
  ],
];
/** Half each shape's height, the torus standing on its rim */
const HALF_HEIGHT = { capsule: 0.48, sphere: 0.45, puck: 0.3, torus: 0.48 };
/**
 * How far every shape floats over the floor, as the kit's subjects do. The outline's shell reaches past a shape by its
 * width, and a shape resting on the floor would sink that part of its rim into it.
 */
const FLOAT = 0.15;
/** The torus stands on its rim with its hole to the front, turned a little so it doesn't read as a flat ring */
const TORUS_TURN = 0.35;
/** The hidden capsule is a size up from the field's, so its shadow is the longest one on the floor */
const HIDDEN_SCALE = 1.3;
/** How far up and down the lane it walks from the middle row: level with the front row and the back one */
const WALK_REACH = 2;
/** Seconds of wandering for one walk there and back, about 0.45 a second at its fastest */
const WALK_PERIOD = 28;
/** Where in the walk it starts, in rad: in the front aisle heading back, its shadow whole across the open floor */
const WALK_START = 1.1;

/**
 * Where the key light hangs: up on the left and a little in front, so every shadow falls back and to the right, and
 * the hidden capsule's stays inside the lane
 */
const KEY_FROM = { x: -6.1, y: 9.5, z: 5.1 };
/** The key's brightness by theme: the kit's dark key, 0.9, is too dim for a shadow to read on the night floor */
const KEY_INTENSITY = { light: 2.2, dark: 3.4 };

/** The front row's orange sphere, beside the lane, which starts outlined */
export const OUTLINED_AT_START = 9;

/** A clay shape floating over the floor */
function createShape(parent, shape, color, x, z, pointer) {
  const mesh = new Mesh3D({
    label: `${color} ${shape}`,
    geometry: clayGeometry(shape),
    material: clayMaterial(color),
    position: { x, y: HALF_HEIGHT[shape] + FLOAT, z },
    ...pointer,
    parent,
  });

  if (shape === 'torus') mesh.rotation.set(Math.PI / 2, TORUS_TURN, 0);

  return mesh;
}

/**
 * The twelve shapes, back row first and left to right in each row. `clayMaterial` hands back one shared material per
 * colour, so the six lilac shapes share one material and the six orange ones another.
 */
export function createField(parent, pointer) {
  const shapes = [];

  FIELD.forEach((row, r) => {
    row.forEach(([shape, color], c) => {
      shapes.push(
        createShape(
          parent,
          shape,
          color,
          COLUMNS[c],
          (r - 1) * ROW_SPACING,
          pointer,
        ),
      );
    });
  });

  return shapes;
}

/** The sky clay capsule, the only mesh in sky clay, so its material is its own */
export function createHiddenCapsule(parent, pointer) {
  const capsule = new Mesh3D({
    label: 'hidden capsule',
    geometry: clayGeometry('capsule'),
    material: clayMaterial('sky'),
    scale: HIDDEN_SCALE,
    ...pointer,
    parent,
  });

  wander(capsule, 0);

  return capsule;
}

/** Places the capsule at `time` seconds of wandering, up and down the open lane, easing to a stop at either end */
export function wander(capsule, time) {
  const angle = WALK_START + (time / WALK_PERIOD) * Math.PI * 2;

  capsule.position.set(
    0,
    HALF_HEIGHT.capsule * HIDDEN_SCALE + FLOAT,
    WALK_REACH * Math.cos(angle),
  );
}

/**
 * Hangs the stage's key up on the left, so every shadow lies back and to the right where the camera sees it whole,
 * and keeps its shadow box over the floor those shadows reach
 */
export function placeKey(stage) {
  stage.key.position.set(KEY_FROM.x, KEY_FROM.y, KEY_FROM.z);
  stage.key.lookAt({ x: 0, y: 0, z: 0 });
  // The shadows reach past their casters, where the key's own fit would cut them off.
  stage.shadowOverFloor();
  brightenKey(stage);
}

/** Sets the key's brightness for the stage's theme, mid-fade too; call it after each `stage.update` */
export function brightenKey(stage) {
  stage.key.intensity =
    KEY_INTENSITY.light +
    (KEY_INTENSITY.dark - KEY_INTENSITY.light) * stage.darkness;
}
