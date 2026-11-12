/** The props: the clay stand the glass lies on */

import { Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { roundedBox } from './theme/shapes';

/** How far the stand reaches past the glass on every side, so it frames it */
const RIM = 0.15;

/** A low lilac clay slab under the glass */
export function createStand({ parent, glass, height }) {
  const top = height - 0.004;

  return new Mesh3D({
    geometry: roundedBox(
      glass.width + RIM * 2,
      top,
      glass.depth + RIM * 2,
      0.12,
    ),
    material: clayMaterial('lilac'),
    position: { x: 0, y: top / 2, z: glass.z },
    parent,
  });
}
