/**
 * The props: a sphere in front, with a clay torus and a rounded clay cube either side of it, each in the material
 * `index.ts` hands it, the logo above them, and the gentle motion that turns the clay shapes through their bands
 */

import { Mesh3D, SphereGeometry } from '@pixi/3d';

import { clayGeometry } from './theme/shapes';

/**
 * The sphere is engine geometry at its true size, not a scaled clay sphere: the outline's width is in each mesh's own
 * units, so a scaled sphere would get a thicker line than its neighbours
 */
export const SPHERE_RADIUS = 1;
/** The clay shapes stand this far either side of the sphere: room for the sphere's tags between them */
const SIDE = 2.3;
/** The cube turns this many radians a second, so each flat face snaps from tone to tone as it passes a step */
const CUBE_SPIN = 0.35;
/** The torus leans its hole toward the camera and rocks about that lean, so its rings slide round it */
const TORUS_ROCK = { lean: 0.9, swing: 0.25, speed: 0.6 };
/**
 * The logo rides above and behind the sphere, which is the focal point. It bobs without turning, so its flat face keeps
 * one normal and shows one tone at any band count
 */
const LOGO = { y: 3.1, z: -0.6, bob: 0.06, speed: 0.8 };

export function createProps({ parent, logo, ...materials }) {
  logo.root.position.set(0, LOGO.y, LOGO.z);
  parent.addChild(logo.root);

  const sphere = new Mesh3D({
    geometry: new SphereGeometry({
      radius: SPHERE_RADIUS,
      widthSegments: 64,
      heightSegments: 32,
    }),
    material: materials.sphere,
    position: { x: 0, y: 1.2, z: 1 },
    parent,
  });
  const torus = new Mesh3D({
    geometry: clayGeometry('torus'),
    material: materials.torus,
    position: { x: -SIDE, y: 0.75, z: 0.6 },
    parent,
  });
  // The kit's rounded cube: its normals stay smooth round the edges, where an engine cube's split and the outline,
  // pushed out along them, would open gaps at every edge.
  const cube = new Mesh3D({
    geometry: clayGeometry('cube'),
    material: materials.cube,
    position: { x: SIDE, y: 0.7, z: 0.6 },
    rotation: { x: 0.3, y: 0, z: 0 },
    parent,
  });

  return {
    sphere,
    torus,
    move(time) {
      cube.rotation.y = time * CUBE_SPIN;
      torus.rotation.x =
        TORUS_ROCK.lean + Math.sin(time * TORUS_ROCK.speed) * TORUS_ROCK.swing;
      logo.root.position.y = LOGO.y + Math.sin(time * LOGO.speed) * LOGO.bob;
    },
  };
}
