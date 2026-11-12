/** The props: a firework tube for the sparks to spray from, sky clay on a lilac base */

import { Mesh3D, Vector3 } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { roundedCylinder } from './theme/shapes';

/** Wide and low, so the tube reads as a firework standing on the floor */
const BASE = { radius: 0.55, height: 0.22 };
/** Wider than the cone's spawn disc, which sits on its top, and tall enough to lift the nozzle clear of the base */
const TUBE = { radius: 0.28, height: 0.7 };
/** The rolled rim on both pieces, the clay look's soft edge */
const RIM = 0.08;

/** Stands the tube on its base at the origin of `parent` */
export function createFireworkTube(parent) {
  const top = BASE.height + TUBE.height;

  new Mesh3D({
    geometry: roundedCylinder(BASE.radius, BASE.height, RIM),
    material: clayMaterial('lilac'),
    position: { x: 0, y: BASE.height / 2, z: 0 },
    parent,
  });
  new Mesh3D({
    geometry: roundedCylinder(TUBE.radius, TUBE.height, RIM),
    material: clayMaterial('sky'),
    position: { x: 0, y: BASE.height + TUBE.height / 2, z: 0 },
    parent,
  });

  return { nozzle: new Vector3(0, top, 0), base: BASE };
}
