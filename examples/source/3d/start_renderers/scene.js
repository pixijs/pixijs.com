/**
 * The props: the kit's reference scene, the logo over an arc of clay shapes, which stays the same on either backend
 *
 * Nothing here names WebGL or WebGPU, and that's the point: scene code doesn't change with the backend.
 */

import { Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';

import { CLAY_COLORS } from './theme/palette';
import { CLAY_SHAPES, clayGeometry } from './theme/shapes';

/** Floats the logo centre stage and sets one of each clay shape in a shallow arc in front of it */
export function createLogoAndClay({ view3d, logo }) {
  const shapes = CLAY_SHAPES.map((shape, i) => {
    const offset = i - (CLAY_SHAPES.length - 1) / 2;

    return new Mesh3D({
      geometry: clayGeometry(shape),
      material: clayMaterial(CLAY_COLORS[i]),
      position: { x: offset * 1.5, y: 0.7, z: 1.8 - offset * offset * 0.12 },
      parent: view3d.root,
    });
  });

  // A little above the reference scene's 1.7, so the sphere's bob clears the P's stem.
  logo.root.position.y = 1.9;
  view3d.root.addChild(logo.root);

  return {
    // Driven by elapsed time, so both backends replay the same motion from a reload.
    update(time) {
      for (let i = 0; i < shapes.length; i++) {
        shapes[i].position.y = 0.7 + Math.sin(time * 1.6 + i) * 0.15;
        shapes[i].rotation.y = time * 0.5 + i;
      }
      logo.root.rotation.y = Math.sin(time * 0.4) * 0.25;
    },
  };
}
