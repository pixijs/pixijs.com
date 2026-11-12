/**
 * The props a press travels through: a clay coffee table, a tray on it, and a cube and a ball on the tray
 *
 * The nodes nest the way the press goes in and out: table, then tray, then the cube and the ball. No eventMode is set
 * here; which nodes take part is the lesson, in `index.ts`.
 */

import { Container3D, Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { clayGeometry, roundedBox, roundedCylinder } from './theme/shapes';

/**
 * The table top's size and height: its surface is at y = 0.7. Narrow enough that its box clears the pane on a 4:3
 * screen, which leaves the same 0.5 border round the tray on every side.
 */
const TOP = { width: 4, height: 0.2, depth: 3.2, y: 0.6 };
/** The legs' radius and height, and their x and z from the table's centre, just inside the top's corners */
const LEG = { radius: 0.11, height: 0.5, x: 1.65, z: 1.2 };
/** The tray's size, resting on the table top */
const TRAY = { width: 3, height: 0.14, depth: 2.2, y: 0.77 };

export function createTable(parent) {
  const lilac = clayMaterial('lilac');
  const table = new Container3D({ label: 'table', parent });
  const top = new Mesh3D({
    label: 'top',
    geometry: roundedBox(TOP.width, TOP.height, TOP.depth, 0.08),
    material: lilac,
    position: { x: 0, y: TOP.y, z: 0 },
    parent: table,
  });
  const leg = roundedCylinder(LEG.radius, LEG.height, 0.03);

  for (const x of [-LEG.x, LEG.x]) {
    for (const z of [-LEG.z, LEG.z]) {
      new Mesh3D({
        label: 'leg',
        geometry: leg,
        material: lilac,
        position: { x, y: LEG.height / 2, z },
        parent: table,
      });
    }
  }

  const tray = new Mesh3D({
    label: 'tray',
    geometry: roundedBox(TRAY.width, TRAY.height, TRAY.depth, 0.06),
    material: clayMaterial('sky'),
    position: { x: 0, y: TRAY.y, z: 0 },
    parent: table,
  });
  // Forward of the tray's middle, so with the tray's children out of picking a press anywhere on either one goes
  // past it and still lands on the tray's plate behind it.
  const cube = new Mesh3D({
    label: 'cube',
    geometry: clayGeometry('cube'),
    material: clayMaterial('purple'),
    position: { x: -0.65, y: 0.47, z: 0.55 },
    parent: tray,
  });
  const ball = new Mesh3D({
    label: 'ball',
    geometry: clayGeometry('sphere'),
    material: clayMaterial('orange'),
    position: { x: 0.7, y: 0.52, z: 0.55 },
    parent: tray,
  });

  return { table, top, tray, cube, ball };
}
