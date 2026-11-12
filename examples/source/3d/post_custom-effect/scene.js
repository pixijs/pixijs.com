/** The props: theme-kit's seven clay shapes in a shallow arc in front of the logo, bobbing and turning */

import { Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { CLAY_COLORS } from './theme/palette';
import { CLAY_SHAPES, clayGeometry } from './theme/shapes';

/** One of each clay shape, each in the next clay colour, curving back at the ends so the arc's ends reach the edges */
export function createShapeArc({ parent }) {
  const shapes = CLAY_SHAPES.map((shape, i) => {
    const offset = i - (CLAY_SHAPES.length - 1) / 2;

    return new Mesh3D({
      geometry: clayGeometry(shape),
      material: clayMaterial(CLAY_COLORS[i]),
      position: { x: offset * 1.5, y: 0.7, z: 1.8 - offset * offset * 0.12 },
      parent,
    });
  });

  return {
    update(time) {
      for (let i = 0; i < shapes.length; i++) {
        shapes[i].position.y = 0.7 + Math.sin(time * 1.6 + i) * 0.15;
        shapes[i].rotation.y = time * 0.5 + i;
      }
    },
  };
}
