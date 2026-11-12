/** The props: a low lilac clay pad for the sparks to rise from */

import { Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { roundedCylinder } from './theme/shapes';

/** Wide and low, so it reads as a launch pad under the swirl's narrow base */
const PAD = { radius: 0.42, height: 0.2, rim: 0.07 };
/** Just above the pad's top face, so no spark starts inside it */
export const PAD_TOP = PAD.height + 0.02;

/** Stands the pad at the origin of `parent` */
export function createLaunchPad(parent) {
  return new Mesh3D({
    geometry: roundedCylinder(PAD.radius, PAD.height, PAD.rim),
    material: clayMaterial('lilac'),
    position: { x: 0, y: PAD.height / 2, z: 0 },
    castShadow: true,
    parent,
  });
}
