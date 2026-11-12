/** A thin backing that makes each flat tile readable, and the one grazing light that shades them. */

import { CubeGeometry, DirectionalLight, Material3D, Mesh3D } from '@pixi/3d';

import { CLAY } from './theme/palette';

/** A little wider than a tile's 2.4 units, so a rim shows round it */
export const BACKING_SIZE = 2.52;
/** Up and to the left of the tiles, so correct pads light on their top-left edges and flipped ones on the bottom */
const LIGHT_POSITION = { x: -3, y: 6, z: 3.2 };
const TILE_CENTRE = { x: 0, y: 1.6, z: 0 };

/** One backing just behind each tile, as its child, so it moves with the tile */
export function createBackings(tiles) {
  const geometry = new CubeGeometry({
    width: BACKING_SIZE,
    height: BACKING_SIZE,
    depth: 0.12,
  });
  const material = new Material3D({ baseColor: CLAY.lilac, roughness: 0.7 });

  for (const parent of tiles) {
    new Mesh3D({
      geometry,
      material,
      position: { x: 0, y: 0, z: -0.075 },
      parent,
    });
  }
}

export function createGrazingLight(view3d) {
  const light = new DirectionalLight({
    color: CLAY.white,
    intensity: 2.8,
    position: LIGHT_POSITION,
    parent: view3d.root,
  });

  // A directional light shines along its local -z wherever it sits, so lookAt only sets its direction.
  light.lookAt(TILE_CENTRE);

  return light;
}
