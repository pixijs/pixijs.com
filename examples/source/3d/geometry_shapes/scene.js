/**
 * The props: the nine class names in row order, their clay colours, the hero's pose for each, and the row of small
 * swatches that shows every shape at once
 */

import { Container3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

/** The built-in geometry classes, in the row's order; here so every file can import them without a cycle */
export const SHAPES = [
  'PlaneGeometry',
  'CubeGeometry',
  'SphereGeometry',
  'IcosahedronGeometry',
  'CapsuleGeometry',
  'CylinderGeometry',
  'ConeGeometry',
  'TorusGeometry',
  'TorusKnotGeometry',
];

/** What the pane sets: the class on show, and whether the wireframe shows */

/** A record with one entry per class, made by `make` */
export function perShape(make) {
  return Object.fromEntries(SHAPES.map((shape, i) => [shape, make(shape, i)]));
}

/** A class's own options, without the vertex-data ones every geometry shares */

/**
 * Every class's options, typed by the engine's own option interfaces. The plane leaves out `flipV`, which changes
 * only its UVs, and nothing here draws them.
 */

/** One class's options as name and value, for the pane and the marks, which treat every class alike */

/** The options of one class by name: the one place the engine's option types widen, since the pane binds by name */
export function optionsOf(options, shape) {
  return options[shape];
}

/**
 * White would vanish on the light floor, and no two neighbours match. The flat plane takes the deeper sky, since it
 * catches the light edge-on as it spins and a pale one reads as slate on the dark floor.
 */
export const SHAPE_COLORS = {
  PlaneGeometry: 'sky',
  CubeGeometry: 'pink',
  SphereGeometry: 'purple',
  IcosahedronGeometry: 'lilac',
  CapsuleGeometry: 'palePink',
  CylinderGeometry: 'paleSky',
  ConeGeometry: 'orange',
  TorusGeometry: 'sky',
  TorusKnotGeometry: 'purple',
};

/** The hero's centre, which holds still, so a size change grows the shape both ways from it */
export const HERO_POSITION = { x: 0, y: 1.6, z: 0 };

/**
 * Each class's pose, as a tilt about x and a yaw about y. A yaw of +0.5 brings the x and z arrows out on the right,
 * which leaves the left for the `height` bars. The cube turns to 45°, so both faces its bars run under show from
 * anywhere the orbit reaches. The torus turns a little the other way, so its marks on its −x side sit on the left and
 * the tube's cross-section there faces the camera. It and the knot tip towards the camera so their rings read as
 * rings; the knot keeps the +0.5 yaw, so its z arrow points off to the right rather than straight down at the row.
 */
const POSES = {
  PlaneGeometry: [0, 0.5],
  CubeGeometry: [0, Math.PI / 4],
  SphereGeometry: [0, 0.5],
  IcosahedronGeometry: [0, 0.5],
  CapsuleGeometry: [0, 0.5],
  CylinderGeometry: [0, 0.5],
  ConeGeometry: [0, 0.5],
  TorusGeometry: [0.55, -0.25],
  TorusKnotGeometry: [0.9, 0.5],
};

/** A quarter of the hero's size, so the row reads as a menu rather than nine more subjects */
const SWATCH_SCALE = 0.22;
/** Each swatch's resting height: the tallest shape the pane allows still clears the floor through the bob */
const SWATCH_HEIGHT = 0.5;
const SWATCH_SPACING = 0.7;
const ROW_Z = 2.3;
/** The narrowest view, width over height, that shows the whole row; a narrower one slides the row instead */
const ROW_ASPECT = 1.45;
/** How far the selected swatch rises, and how fast it and the row's slide ease, per second */
const LIFT = 0.2;
const EASE = 10;
/** The row's motion at rest: a bob of ±`BOB` over `BOB_PERIOD` seconds, and a turn of `SPIN` radians a second */
const BOB = 0.04;
const BOB_PERIOD = 2.4;
const SPIN = 0.35;
/** How far an open cone tips back: its missing base faces the floor, which the orbit never sees from below */
const OPEN_CONE_TILT = -0.6;

/** Turns the hero to its class's pose, tipping an open cone back so the hole where its base was shows */
export function poseHero(hero, shape, options) {
  const [tilt, yaw] = POSES[shape];
  const open = shape === 'ConeGeometry' && options.ConeGeometry.openEnded;

  // Euler rotations apply x last, so the shape turns about its own +y, then tips.
  hero.rotation.set(tilt + (open ? OPEN_CONE_TILT : 0), yaw, 0);
}

/** The row of swatches in front of the hero, one per class, built from `geometries` in {@link SHAPES} order */
export function createCatalogue({ parent, geometries }) {
  const root = new Container3D({ parent });
  const lifts = SHAPES.map(() => 0);
  const meshes = perShape(
    (shape, i) =>
      new Mesh3D({
        geometry: geometries[i],
        // Two-sided, so a plane's back, an open cylinder and an opened torus still draw.
        material: clayMaterial(SHAPE_COLORS[shape], { doubleSided: true }),
        position: {
          x: (i - (SHAPES.length - 1) / 2) * SWATCH_SPACING,
          y: SWATCH_HEIGHT,
          z: ROW_Z,
        },
        scale: SWATCH_SCALE,
        parent: root,
      }),
  );
  let selected = 0;
  let time = 0;

  return {
    root,
    meshes,
    select(shape) {
      selected = SHAPES.indexOf(shape);
    },
    update(dt, screen) {
      const ease = 1 - Math.exp(-EASE * dt);
      const slide =
        screen.width / screen.height < ROW_ASPECT
          ? -meshes[SHAPES[selected]].position.x
          : 0;

      time += dt;
      root.position.x += (slide - root.position.x) * ease;
      for (let i = 0; i < SHAPES.length; i++) {
        const mesh = meshes[SHAPES[i]];

        lifts[i] += ((i === selected ? LIFT : 0) - lifts[i]) * ease;
        mesh.position.y =
          SWATCH_HEIGHT +
          lifts[i] +
          Math.sin((time / BOB_PERIOD) * Math.PI * 2 + i) * BOB;
        mesh.rotation.y = time * SPIN + i;
      }
    },
  };
}
