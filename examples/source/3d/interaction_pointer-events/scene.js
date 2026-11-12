/**
 * The props the pointer listeners act on: four clay shapes, in one row or two, and the reactions the listeners call
 *
 * Nothing here listens to the pointer. `index.ts` makes every pointer call on the shapes.
 */

import { Container3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { clayGeometry } from './theme/shapes';

/** Seconds a hover takes to swell a shape, quick enough to read as an answer to the pointer */
const HOVER_TIME = 0.12;
/**
 * A hovered shape swells by this share, about the point where it touches the floor, so its outline only grows and a
 * pointer on it stays on it. Only the torus's hole grows too, by a few px, so keep this small.
 */
const HOVER_SWELL = 0.1;
/** A hop's height and its time in the air, then the squash on landing */
const HOP_HEIGHT = 0.55;
const HOP_TIME = 0.45;
const SQUASH_TIME = 0.16;
const SQUASH = 0.14;
/** How fast a wheel's resize settles, in seconds: most of the way within a notch's 0.15 s */
const SIZE_EASE = 0.05;
/** The wheel's size range: small still reads as the shape, and big still clears its neighbours */
const MIN_SIZE = 0.6;
const MAX_SIZE = 1.6;
/** How far the pyramid slides each way from the middle of its track */
const TRACK_REACH = 0.7;
/** Seconds the pyramid takes to slide there and back, slow enough that a resting pointer sees it pass */
const SLIDE_PERIOD = 4.8;
/** Turns in rad/s: the cube's keeps the scene live while the pointer holds still, the pyramid's shows off its faces */
const CUBE_SPIN = 0.25;
const PYRAMID_SPIN = 0.3;

/**
 * Where each shape stands, x and z: in one row on a wide screen, the pyramid's track a little apart at the right end,
 * and in two rows on an upright one, the torus and the track in front. The two rows stand a little nearer the camera
 * than the orbit target, so the back row sits below the open pane. The middle of a view falls on bare floor, so a
 * pointer resting there at load hovers nothing.
 */
const ROW = {
  cube: [-2.7, 0],
  sphere: [-0.9, 0],
  torus: [0.9, 0],
  pyramid: [3.1, 0],
};
const ROWS = {
  cube: [-0.9, -1],
  sphere: [0.9, -1],
  torus: [-1.2, 2.1],
  pyramid: [0.85, 2.1],
};
/** In two rows the shapes stand this much bigger, so the rows span the screen as the one row does */
const ROWS_SCALE = 1.9;

/** One shape and the state its reactions ease toward */

/** A clay shape on a base on the floor, raised by `height`, its origin's height above its lowest point */
function createToy(view3d, shape, color, height) {
  const home = new Container3D({ parent: view3d.root });
  const base = new Container3D({ parent: home });
  // Picked by its triangles, so the torus's hole and the corners round the sphere don't count;
  // interaction_hit-volumes compares the choices.
  const mesh = new Mesh3D({
    label: shape,
    geometry: clayGeometry(shape),
    material: clayMaterial(color),
    hitVolume: 'geometry',
    position: { x: 0, y: height, z: 0 },
    parent: base,
  });

  return {
    home,
    base,
    mesh,
    color,
    hovered: false,
    hover: 0,
    hopAge: Infinity,
    size: 1,
    shownSize: 1,
  };
}

/** The four shapes, standing as {@link arrangeToys} puts them for the screen */
export function createToys(view3d, upright) {
  const cube = createToy(view3d, 'cube', 'pink', 0.4);
  const sphere = createToy(view3d, 'sphere', 'purple', 0.45);
  const torus = createToy(view3d, 'torus', 'orange', 0.48);
  const pyramid = createToy(view3d, 'pyramid', 'sky', 0.193);
  const toys = {
    cube,
    sphere,
    torus,
    pyramid,
    all: [cube, sphere, torus, pyramid],
  };

  // On its edge, its hole to the camera.
  torus.mesh.rotation.x = Math.PI / 2;
  arrangeToys(toys, upright);

  return toys;
}

/** Stands the shapes in one row for a wide screen, or in two rows, each shape bigger, for an upright one */
export function arrangeToys(toys, upright) {
  const places = upright ? ROWS : ROW;
  const scale = upright ? ROWS_SCALE : 1;

  for (const name of ['cube', 'sphere', 'torus', 'pyramid']) {
    const [x, z] = places[name];

    toys[name].home.position.set(x * scale, 0, z * scale);
    toys[name].home.scale.set(scale, scale, scale);
  }
}

export function raise(toy) {
  toy.hovered = true;
}

export function lower(toy) {
  toy.hovered = false;
}

export function startHop(toy) {
  toy.hopAge = 0;
}

/** Grows the shape by `by` of its size, or shrinks it for a negative `by`, within the wheel's size range */
export function resize(toy, by) {
  toy.size = Math.min(MAX_SIZE, Math.max(MIN_SIZE, toy.size + by));
}

/** Eases each shape toward what its reactions asked for, slides the pyramid and turns the cube */
export function animateToys(toys, time, dt) {
  for (const toy of toys.all) {
    toy.hover = Math.min(
      1,
      Math.max(0, toy.hover + (toy.hovered ? dt : -dt) / HOVER_TIME),
    );
    toy.shownSize +=
      (toy.size - toy.shownSize) * (1 - Math.exp(-dt / SIZE_EASE));
    toy.hopAge += dt;

    const swell = toy.hover * toy.hover * (3 - 2 * toy.hover);
    const air = Math.min(1, toy.hopAge / HOP_TIME);
    const landed = (toy.hopAge - HOP_TIME) / SQUASH_TIME;
    const squash =
      landed > 0 && landed < 1 ? SQUASH * Math.sin(Math.PI * landed) : 0;
    const size = toy.shownSize * (1 + HOVER_SWELL * swell);

    toy.base.scale.set(
      size * (1 + squash / 2),
      size * (1 - squash),
      size * (1 + squash / 2),
    );
    toy.base.position.y = 4 * HOP_HEIGHT * air * (1 - air);
  }
  toys.pyramid.base.position.x =
    TRACK_REACH * Math.sin((2 * Math.PI * time) / SLIDE_PERIOD);
  toys.pyramid.mesh.rotation.y = PYRAMID_SPIN * time;
  toys.cube.mesh.rotation.y = CUBE_SPIN * time;
}
