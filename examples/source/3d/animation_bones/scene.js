/** The props: the fox's fur, and the target it looks at, which the pointer moves in a box in front of its face */

import { Material3D, Plane, Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

/** In front of the fox's face as index.ts places it, level with its snout, and far enough left that the gaze shows */
const LOOK_CENTRE = { x: -1, y: 1, z: 1.55 };
/**
 * The box round LOOK_CENTRE the target stays in, in world space. A neck turns only so far, and a target behind the
 * head or under the floor would fold the snout into the chest. So the box holds it in front of the face, above the
 * floor and far enough left of the snout that the code's gaze shows.
 */
const REACH_MIN = { x: -2.4, y: 0.3, z: 1.25 };
const REACH_MAX = { x: -0.7, y: 1.35, z: 2.2 };
/** How far, in px, a finger can move between touching and lifting and still count as a tap rather than an orbit */
const TAP_SLOP = 10;

/**
 * Fox.glb has no normals, so the engine lights every face with one fixed normal. At the file's roughness the fur
 * flashes pale from some sides; fully rough it keeps its texture's colour from every angle.
 */
export function matteFur(source) {
  const fur = source.material.fox_material;

  if (fur instanceof Material3D) fur.roughness = 1;
}

/**
 * The point the fox looks at, in world space. It starts at LOOK_CENTRE and goes where the pointer's ray meets a plane
 * through LOOK_CENTRE that faces the camera, kept in the box a fox can look into. A mouse moves it by hovering. A
 * finger has no hover and its drag orbits, so a finger moves it with a tap.
 */
export function createTarget({ app, view3d }) {
  const target = new Vector3().copyFrom(LOOK_CENTRE);
  const toCamera = new Vector3();
  const lookPlane = new Plane();
  const pressedAt = new Point();

  function moveTo(e) {
    view3d.camera.getGlobalPosition(toCamera).subtract(LOOK_CENTRE).normalize();
    lookPlane.setFromNormalAndCoplanarPoint(toCamera, LOOK_CENTRE);
    if (!view3d.screenToWorld(e.global, lookPlane, target)) return;
    // The plane runs back past the fox on the right, so a pointer there would put the target behind its head.
    target.clamp(REACH_MIN, REACH_MAX);
  }

  // Pixi hears moves over the whole page, the pane's too, and a mouse moving with a button down is orbiting.
  view3d.on('globalpointermove', (e) => {
    if (
      e.pointerType === 'mouse' &&
      e.buttons === 0 &&
      e.nativeEvent.target === app.canvas
    )
      moveTo(e);
  });
  // Pixi names a release off the canvas `pointerupoutside`, so a `pointerup` here landed on the scene.
  view3d.on('pointerdown', (e) => pressedAt.copyFrom(e.global));
  view3d.on('pointerup', (e) => {
    const isTap =
      Math.hypot(e.global.x - pressedAt.x, e.global.y - pressedAt.y) < TAP_SLOP;

    if (e.pointerType !== 'mouse' && isTap) moveTo(e);
  });

  return target;
}
