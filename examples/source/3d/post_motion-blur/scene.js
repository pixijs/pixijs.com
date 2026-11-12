/**
 * The props, built once for each view that draws them: the PixiJS logo at the orbit's centre, a ring of clay posts
 * round it, and a spinning top beside it
 *
 * A mesh belongs to one view, so the main view and the inset each build a copy. The geometry and the clay are shared,
 * so a copy costs only its meshes.
 */

import { Container3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { loadPixiLogo } from './theme/logo';

import { clayGeometry, roundedCylinder } from './theme/shapes';

/** The logo's width, and its height over the floor: the orbit's target */
export const LOGO = { width: 3.6, y: 1.2 };
/** Posts round the logo, how far out, and the turn of the first from +z, in radians: a gap faces the camera's start */
const RING = { count: 8, radius: 6.25, start: Math.PI / 8 };
/** A post's radius, height and rolled rim, and the size of the shape on top */
const POST = { radius: 0.32, height: 1.6, rim: 0.12, shapeScale: 0.8 };
/**
 * Each post's shape and its colour, then the post's own paler clay, in order round the ring. The palette has no pale
 * orange, so the orange shapes stand on white.
 */
const POSTS = [
  { shape: 'sphere', color: 'pink', post: 'palePink' },
  { shape: 'cube', color: 'sky', post: 'paleSky' },
  { shape: 'torus', color: 'orange', post: 'white' },
  { shape: 'octahedron', color: 'purple', post: 'lilac' },
  { shape: 'pyramid', color: 'pink', post: 'palePink' },
  { shape: 'capsule', color: 'sky', post: 'paleSky' },
  { shape: 'puck', color: 'orange', post: 'white' },
  { shape: 'sphere', color: 'purple', post: 'lilac' },
];
/**
 * Where the top spins, and its size: out along the logo's length, so it stands beside the logo from front and back and
 * goes behind it only while the camera looks along the logo, and in the gap between two posts
 */
const TOP = { x: 4, z: 0, scale: 1.2 };
/** The top's studs, round its widest point, in four colours so the spin shows */
const STUDS = ['pink', 'white', 'orange', 'purple'];
/** Turns a second: fast enough that a blur that followed it would smear the studs into a ring */
const TOP_SPEED = 2.5;
/** How far its spin axis leans, in radians, and the turns a second the lean goes round, so it reads as a top */
const WOBBLE = { lean: 0.1, speed: 0.5 };

let postGeometry = null;

/** One clay shape under `parent` */
function clay(shape, color, parent, position, scale) {
  return new Mesh3D({
    geometry: clayGeometry(shape),
    material: clayMaterial(color),
    position,
    scale,
    parent,
  });
}

/** The ring of posts round the origin, each with a clay shape on top */
function createRing(parent) {
  const geometry = (postGeometry ??= roundedCylinder(
    POST.radius,
    POST.height,
    POST.rim,
  ));

  POSTS.forEach(({ shape, color, post }, i) => {
    const angle = RING.start + (i / RING.count) * Math.PI * 2;
    const stand = new Container3D({
      position: {
        x: Math.sin(angle) * RING.radius,
        y: 0,
        z: Math.cos(angle) * RING.radius,
      },
      rotation: { x: 0, y: angle, z: 0 },
      parent,
    });

    // Raised by its own lowest point, so each shape sits on its post.
    const shapeY =
      POST.height - clayGeometry(shape).bounds3D.min.y * POST.shapeScale;

    new Mesh3D({
      geometry,
      material: clayMaterial(post),
      y: POST.height / 2,
      parent: stand,
    });
    clay(shape, color, stand, { x: 0, y: shapeY, z: 0 }, POST.shapeScale);
  });
}

/**
 * A spinning top on its point: an octahedron body, a capsule handle and studs round its widest point. The outer node
 * leans and the inner one spins, so it spins about its own leaning axis.
 */
function createTop(parent) {
  const lean = new Container3D({
    label: 'top',
    position: { x: TOP.x, y: 0, z: TOP.z },
    scale: TOP.scale,
    parent,
  });
  const spinner = new Container3D({ parent: lean });

  clay('octahedron', 'sky', spinner, { x: 0, y: 0.45, z: 0 }, 0.9);
  clay('capsule', 'pink', spinner, { x: 0, y: 0.98, z: 0 }, 0.55);
  STUDS.forEach((color, i) => {
    const angle = (i / STUDS.length) * Math.PI * 2;

    clay(
      'sphere',
      color,
      spinner,
      { x: Math.sin(angle) * 0.4, y: 0.45, z: Math.cos(angle) * 0.4 },
      0.26,
    );
  });

  return { lean, spinner };
}

/** Builds the props under `parent`: the logo, the ring and the top */
export async function createScene(parent) {
  const logo = await loadPixiLogo({ width: LOGO.width });

  logo.root.position.y = LOGO.y;
  parent.addChild(logo.root);
  createRing(parent);

  const { lean, spinner } = createTop(parent);

  return {
    spin(time) {
      const wobble = time * WOBBLE.speed * Math.PI * 2;

      lean.rotation.set(
        Math.sin(wobble) * WOBBLE.lean,
        0,
        Math.cos(wobble) * WOBBLE.lean,
      );
      spinner.rotation.y = time * TOP_SPEED * Math.PI * 2;
    },
  };
}
