/** The props, all clay: the yard the security camera films, the walker that laps it, and the camera's head and post */

import { Container3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { clayGeometry, roundedBox, roundedCylinder } from './theme/shapes';

/** The middle of the walker's lap, on the floor: the torus sculpture stands here */
const LAP_CENTER = { x: 1.65, z: -0.35 };
/** Wide enough to clear the puck and the cube by 0.25 and the pyramid by 0.4 */
const LAP_RADIUS = { x: 0.95, z: 0.9 };
/** Seconds a lap */
const LAP_SECONDS = 24;
/** Where the lap starts, in radians round its middle: the back left, whole on the monitor */
const LAP_START = Math.PI * 1.15;
/** The walker's body, scaled from the clay capsule, and the height that stands its foot on the floor */
const BODY_SCALE = 1.1;
const BODY_Y = 0.53;
/** The camera head's body: width, height and length along the view */
const HEAD = { width: 0.36, height: 0.3, length: 0.6 };

/** A clay mesh in `color`, placed by `pose`: its position, rotation, scale and parent, as `Mesh3D` takes them */
function clay(geometry, color, pose) {
  return new Mesh3D({ geometry, material: clayMaterial(color), ...pose });
}

/** The yard the security camera films: a torus on a puck, a cube and a pyramid */
export function createYard(parent) {
  const { x, z } = LAP_CENTER;

  // Stood on edge and turned 45°, so it reads as a ring from the main view and from the security camera.
  clay(clayGeometry('torus'), 'orange', {
    position: { x, y: 0.78, z },
    rotation: { x: Math.PI / 2, y: 0, z: Math.PI / 4 },
    parent,
  });
  clay(clayGeometry('puck'), 'white', {
    position: { x, y: 0.15, z },
    scale: { x: 1, y: 0.5, z: 1 },
    parent,
  });
  clay(clayGeometry('cube'), 'sky', {
    position: { x: 0.4, y: 0.4, z: -1.9 },
    parent,
  });
  // The pyramid's base face is 0.19 below its middle. It stands just past the footprint's front edge, the side facing
  // the viewer, so the monitor leaves it out.
  clay(clayGeometry('pyramid'), 'paleSky', {
    position: { x: 1.6, y: 0.19, z: 1.75 },
    parent,
  });
}

/** A pink capsule with a white visor that walks a loop round the torus */
export function createWalker(parent) {
  const root = new Container3D({ parent });

  clay(clayGeometry('capsule'), 'pink', {
    position: { x: 0, y: BODY_Y, z: 0 },
    scale: BODY_SCALE,
    parent: root,
  });
  // A rounded bar across the front, +z, the way the walker walks.
  clay(roundedBox(0.4, 0.23, 0.16, 0.1), 'white', {
    position: { x: 0, y: 0.78, z: 0.18 },
    parent: root,
  });

  return {
    root,
    walk(time) {
      const angle = LAP_START + (time / LAP_SECONDS) * Math.PI * 2;
      const { x: rx, z: rz } = LAP_RADIUS;

      root.position.set(
        LAP_CENTER.x + rx * Math.cos(angle),
        0,
        LAP_CENTER.z + rz * Math.sin(angle),
      );
      // The lap's direction at this angle, as a turn about y from +z.
      root.rotation.y = Math.atan2(-rx * Math.sin(angle), rz * Math.cos(angle));
    },
  };
}

/**
 * The CCTV head, centred on a camera at its origin: a white body round the eye and a purple lens ring on its front.
 * Cameras face -z, so the lens is at -z, and as the camera's child the head turns with it, so it points where the
 * camera looks.
 */
export function createCameraHead() {
  const head = new Container3D();
  const { width, height, length } = HEAD;

  clay(roundedBox(width, height, length, 0.06), 'white', { parent: head });
  clay(roundedCylinder(0.12, 0.1, 0.03), 'purple', {
    position: { x: 0, y: 0, z: -length / 2 },
    rotation: { x: Math.PI / 2, y: 0, z: 0 },
    parent: head,
  });

  return head;
}

/** A white pole on a lilac foot, holding the security camera up */
export function createCameraPost(parent) {
  const root = new Container3D({ parent });
  // The pole is a unit tall about its middle, so its y scale is its height.
  const pole = clay(roundedCylinder(0.07, 1, 0.03), 'white', { parent: root });

  clay(roundedCylinder(0.2, 0.08, 0.03), 'lilac', {
    position: { x: 0, y: 0.04, z: 0 },
    parent: root,
  });

  return {
    standUnder(point) {
      root.position.set(point.x, 0, point.z);
      pole.position.y = point.y / 2;
      pole.scale.y = point.y;
    },
  };
}
