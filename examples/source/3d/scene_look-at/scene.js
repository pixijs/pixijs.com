/**
 * The props: three clay turrets in a shallow arc, each with a beam, and the target that flies its loop in front of
 * them
 *
 * None of it is the lesson: `index.ts` aims the heads and fires the beams.
 */

import { Container3D, CylinderGeometry, Material3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { EnamelMaterial } from './theme/EnamelMaterial';
import { BRAND, screenColor } from './theme/palette';
import { clayGeometry, roundedBox, roundedCylinder } from './theme/shapes';

/** Where the turrets stand, left to right: on an arc about 6 from (0, 0, -7.3), at -30°, 0° and +30° */
const TURRET_SPOTS = [
  { x: -3, y: 0, z: -2.1 },
  { x: 0, y: 0, z: -1.3 },
  { x: 3, y: 0, z: -2.1 },
];
/** The head's pivot over the turret's foot: the point it turns about */
const PIVOT_HEIGHT = 0.98;
/** The base plate's radius */
const BASE_RADIUS = 0.62;
/** A node's own origin in its own space: the head's pivot, or the target's centre */
export const ORIGIN = { x: 0, y: 0, z: 0 };
/** The barrel's open end in its head's space */
export const MUZZLE = { x: 0, y: 0, z: 1.35 };
/** The target's size: about 0.75 across */
const TARGET_SCALE = 0.75;

/**
 * The target's loop: it hovers at each point, then darts to the next. Each sits in a gap between the turrets'
 * sightlines, so the side changes on every dart and the height on every other one. Every pitch stays under 33°, since
 * `lookAt` with +y up breaks down straight overhead. It starts up and to the left, where every barrel shows its length
 * from the camera.
 */
const WAYPOINTS = [
  { x: -2.0, y: 2.9, z: -5.1 },
  { x: 2.4, y: 1.8, z: -5.7 },
  { x: -2.4, y: 1.9, z: -5.6 },
  { x: 2.1, y: 2.6, z: -5.2 },
];
/** Seconds the target hovers at a waypoint, and the dart to the next: long enough to lock on, quicker than a head */
const HOVER = 1.4;
const DART = 0.8;
const LOOP = (HOVER + DART) * WAYPOINTS.length;
/** The hover's bob, in world units, and its rate in rad/s */
const BOB = 0.06;
const BOB_RATE = 2.1;
/** The target's idle turn about y, in rad/s */
const SPIN = 0.9;

/** Builds the three turrets under `parent`, sharing one set of geometry and materials */
export function createTurrets(parent) {
  const base = roundedCylinder(BASE_RADIUS, 0.16, 0.06);
  const drum = roundedCylinder(0.4, 0.5, 0.1);
  const pod = roundedBox(0.62, 0.44, 0.9, 0.2);
  const barrel = roundedCylinder(0.07, 1.0, 0.03);
  const beamLine = new CylinderGeometry({
    radiusTop: 0.02,
    radiusBottom: 0.02,
    height: 1,
    radialSegments: 8,
  });
  // Flat colour that shows exactly as hot pink, with no shading or fog: a beam is light.
  const beamMaterial = new Material3D({
    baseColor: 0,
    roughness: 1,
    specular: { factor: 0 },
    emissive: { color: screenColor(BRAND.hotPink) },
    fog: false,
  });

  return TURRET_SPOTS.map((position) => {
    const root = new Container3D({ position, parent });
    const head = new Container3D({ y: PIVOT_HEIGHT, parent: root });
    const beam = new Container3D({ visible: false, parent });

    new Mesh3D({
      geometry: base,
      material: clayMaterial('purple'),
      y: 0.08,
      castShadow: false,
      parent: root,
    });
    new Mesh3D({
      geometry: drum,
      material: clayMaterial('lilac'),
      y: 0.4,
      parent: root,
    });
    // Most of the pod lies ahead of the pivot, so its back clears the drum when the head pitches up.
    new Mesh3D({
      geometry: pod,
      material: clayMaterial('white'),
      z: 0.05,
      parent: head,
    });
    // The cylinder stands along y, so a quarter turn about x lays it along the head's +z, ending at the muzzle.
    new Mesh3D({
      geometry: barrel,
      material: clayMaterial('purple'),
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      z: MUZZLE.z - 0.5,
      parent: head,
    });
    new Mesh3D({
      geometry: beamLine,
      material: beamMaterial,
      rotation: { x: Math.PI / 2, y: 0, z: 0 },
      z: 0.5,
      castShadow: false,
      receiveShadow: false,
      parent: beam,
    });

    return { root, head, beam };
  });
}

/** Builds the target, a lacquered octahedron, under `parent` at the start of its loop */
export function createTarget(parent) {
  return new Mesh3D({
    geometry: clayGeometry('octahedron'),
    material: new EnamelMaterial(),
    position: WAYPOINTS[0],
    scale: TARGET_SCALE,
    parent,
  });
}

/** Puts the target where its loop has it at `time`: hovering at a waypoint, or darting to the next on a smooth ease */
export function flyTarget(target, time) {
  const loopTime = time % LOOP;
  const leg = Math.floor(loopTime / (HOVER + DART));
  const into = loopTime - leg * (HOVER + DART);
  const from = WAYPOINTS[leg];
  const to = WAYPOINTS[(leg + 1) % WAYPOINTS.length];
  const dart = into < HOVER ? 0 : (into - HOVER) / DART;
  const ease = dart * dart * (3 - 2 * dart);

  target.position.set(
    from.x + (to.x - from.x) * ease,
    from.y + (to.y - from.y) * ease + BOB * Math.sin(BOB_RATE * time),
    from.z + (to.z - from.z) * ease,
  );
}

/** Turns the target slowly about y: idle motion that leaves its position, the point the turrets aim at, alone */
export function spinTarget(target, dt) {
  target.rotation.y += SPIN * dt;
}
