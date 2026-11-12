/** The props: a clay launcher for the show's pops, and taps on the floor */

import { Mesh3D, Vector3 } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { roundedCylinder } from './theme/shapes';

/** A low puck, so the pops read as fired from a pad on the floor rather than a tube */
const LAUNCHER = { radius: 0.34, height: 0.32, edge: 0.08 };
/** Px a press can move and still count as a tap: pixi fires `pointertap` at the end of an orbit drag too */
const TAP_SLOP = 6;

/** Stands the launcher on the floor at the origin of `parent`, and returns the middle of its top */
export function createLauncher(parent) {
  new Mesh3D({
    geometry: roundedCylinder(LAUNCHER.radius, LAUNCHER.height, LAUNCHER.edge),
    material: clayMaterial('purple'),
    position: { x: 0, y: LAUNCHER.height / 2, z: 0 },
    parent,
  });

  return new Vector3(0, LAUNCHER.height, 0);
}

/** Calls `onTap` with the point a tap on `floor` lands on, and ignores the tap that ends a drag */
export function onFloorTap(floor, onTap) {
  const pressedAt = { x: 0, y: 0 };

  floor.eventMode = 'static';
  floor.cursor = 'pointer';
  floor.on('pointerdown', (e) => {
    pressedAt.x = e.global.x;
    pressedAt.y = e.global.y;
  });
  floor.on('pointertap', (e) => {
    const moved = Math.hypot(
      e.global.x - pressedAt.x,
      e.global.y - pressedAt.y,
    );

    if (e.hit3D && moved < TAP_SLOP) onTap(e.hit3D.point);
  });
}
