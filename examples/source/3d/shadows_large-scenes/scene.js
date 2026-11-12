/**
 * The props: an avenue of white clay shapes and posts beside a long road, the pink ball that weaves down it, the one
 * shadow caster that moves, and the light for a low sun
 */

import { Container3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { mixColor, THEMES } from './theme/palette';
import {
  CLAY_SHAPES,
  clayGeometry,
  roundedBox,
  roundedCylinder,
} from './theme/shapes';

/** Seconds the ball takes to weave down the road and back */
const BALL_TRIP = 10;
/** Where the loop starts: two seconds in, the ball is in the middle cascade */
const BALL_START = 2;
/** The ball's radius, in metres */
const BALL_RADIUS = 0.6;
/** The road's half-width and its near and far ends along z, which the texel grid is drawn inside */
export const ROAD = { halfWidth: 2.5, near: 29, far: -97, top: 0.01 };

/** The floor's colour turned toward the text's: on white clay a shadow barely shows under the light theme's sky */
const ROAD_COLOR = mixColor(THEMES.light.floor, THEMES.light.inkSoft, 0.3);
/** A shape every 4 m on each side, the right row from z = −2 and the left from z = −6, out to z = −94 */
const SHAPE_STEP = 4;
const SHAPE_X = 3.6;
const RIGHT_FROM = -2;
const LEFT_FROM = -6;
const ROW_END = -94;
const SHAPE_SCALE = 1.4;
/** A post every 8 m at each road edge, halfway between two shapes, so none stands in front of the nearest shape */
const POST_STEP = 8;
const POST_X = 2.7;
const POST_FROM = -4;
const POST_END = -92;
/** A little taller than the shapes, and under the fixed box's top, so the box holds every caster */
const POST_HEIGHT = 1.8;
/** Turned this far toward the camera, a ring standing on its rim reads as a ring and its shadow keeps its hole */
const RING_TURN = (40 * Math.PI) / 180;
/** The ball's weave: how far down the road it goes, and how far it swings to each side, in metres */
const BALL_NEAR = -1;
const BALL_RUN = 25;
const BALL_SWING = 1.5;
/** It swings across four times a trip; a metre across shows on screen far more than a metre down the road */
const SWINGS_PER_TRIP = 4;
/**
 * The sun against the stage's key light, and the sky's fill: a sun 32° up lights the ground at half strength, so the
 * fill comes down and the sun goes up, enough for shadows on the ground to read
 */
const SUN_BOOST = 1.6;
const FILL_INTENSITY = 0.7;
/** The stage's fill at `FILL_INTENSITY` of its strength; `lightAvenue` keeps it in step and lights the view with it */
const fill = { skyColor: 0, groundColor: 0, intensity: 0 };

/**
 * Builds the avenue: two rows of shapes, the posts and the road
 *
 * The left row starts 4 m later, so the near left corner of the frame stays clear for the cascade tags while the
 * right row's shadows still reach the nearest cascade.
 */
export function createAvenue(parent) {
  const avenue = new Container3D({ label: 'avenue', parent });

  for (let z = RIGHT_FROM, i = 0; z >= ROW_END; z -= SHAPE_STEP, i++)
    addShape(avenue, SHAPE_X, z, i);
  // Three shapes out of step with the right row, so facing shapes differ.
  for (let z = LEFT_FROM, i = 3; z >= ROW_END; z -= SHAPE_STEP, i++)
    addShape(avenue, -SHAPE_X, z, i);

  const post = roundedCylinder(0.09, POST_HEIGHT, 0.04);

  for (let z = POST_FROM; z >= POST_END; z -= POST_STEP) {
    for (const x of [-POST_X, POST_X]) {
      new Mesh3D({
        geometry: post,
        material: clayMaterial('white'),
        position: { x, y: POST_HEIGHT / 2, z },
        parent: avenue,
      });
    }
  }

  // The road only receives: its shadow would land under itself.
  new Mesh3D({
    geometry: roundedBox(
      ROAD.halfWidth * 2,
      ROAD.top * 2,
      ROAD.near - ROAD.far,
      ROAD.top,
    ),
    material: clayMaterial(ROAD_COLOR),
    castShadow: false,
    position: { x: 0, y: 0, z: (ROAD.near + ROAD.far) / 2 },
    parent: avenue,
  });

  return avenue;
}

/** The ball, the only pink thing in the scene */
export function createBall(parent) {
  const geometry = clayGeometry('sphere');

  return new Mesh3D({
    geometry,
    material: clayMaterial('pink'),
    scale: BALL_RADIUS / geometry.bounds3D.max.y,
    parent,
  });
}

/** Places the ball `time` seconds after the first frame: down the road and back each trip, swinging side to side */
export function moveBall(ball, time) {
  const trip = ((BALL_START + time) / BALL_TRIP) * Math.PI * 2;

  ball.position.set(
    -BALL_SWING * Math.sin(trip * SWINGS_PER_TRIP),
    ROAD.top + BALL_RADIUS,
    BALL_NEAR - (BALL_RUN * (1 - Math.cos(trip))) / 2,
  );
}

/** Balances `sun` against the sky's fill; the stage fades its key and fill with the theme, so call it every frame */
export function lightAvenue(view3d, stage, sun) {
  sun.intensity = stage.key.intensity * SUN_BOOST;
  Object.assign(fill, stage.fill).intensity *= FILL_INTENSITY;
  view3d.environment = fill;
}

/** One white clay shape at (x, z), standing on the floor; the ring stands on its rim */
function addShape(parent, x, z, index) {
  const shape = CLAY_SHAPES[index % CLAY_SHAPES.length];
  const geometry = clayGeometry(shape);
  const mesh = new Mesh3D({
    geometry,
    material: clayMaterial('white'),
    scale: SHAPE_SCALE,
    parent,
  });

  if (shape === 'torus') {
    // A quarter turn about z stands it up facing the sun; the turn about y then angles it toward the camera.
    mesh.rotation.set(0, Math.sign(x) * RING_TURN, Math.PI / 2);
    mesh.position.set(x, geometry.bounds3D.max.x * SHAPE_SCALE, z);
  } else {
    mesh.position.set(x, -geometry.bounds3D.min.y * SHAPE_SCALE, z);
  }
}
