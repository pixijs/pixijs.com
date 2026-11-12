/**
 * The props: the glow row, a lit white cube and three emissive balls in a line in front of the logo
 *
 * It's a measuring strip for the threshold: a surface with no emissive at its head, then the same glow at rising
 * strengths, spaced as wide as the logo so each shape reads at the same size.
 */

import { Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { clayGeometry } from './theme/shapes';

/** Where the row stands, in front of the logo: its depth, the gap between shapes, and the gap under each one */
const ROW = { z: 1.7, spacing: 1.4, lift: 0.09 };
/** The shapes' scale: big enough that the halo round a ball shows at 1280 × 720 */
const BALL_SCALE = 0.7;
/** Smaller than a ball, since a cube's corners make it read larger at the same width */
const CUBE_SCALE = 0.62;
/** Half the height of the kit's clay sphere and cube, before scaling, so each hovers the same gap over the floor */
const HALF_HEIGHT = { sphere: 0.45, cube: 0.4 };

/** Builds the row centred on x 0: the cube first, then a ball per material */
export function createGlowRow({ parent, materials }) {
  const start = (-materials.length / 2) * ROW.spacing;
  const cube = new Mesh3D({
    geometry: clayGeometry('cube'),
    material: clayMaterial('white'),
    position: {
      x: start,
      y: ROW.lift + HALF_HEIGHT.cube * CUBE_SCALE,
      z: ROW.z,
    },
    scale: CUBE_SCALE,
    parent,
  });
  const balls = materials.map(
    (material, i) =>
      new Mesh3D({
        geometry: clayGeometry('sphere'),
        material,
        position: {
          x: start + (i + 1) * ROW.spacing,
          y: ROW.lift + HALF_HEIGHT.sphere * BALL_SCALE,
          z: ROW.z,
        },
        scale: BALL_SCALE,
        parent,
      }),
  );

  return { cube, balls };
}
