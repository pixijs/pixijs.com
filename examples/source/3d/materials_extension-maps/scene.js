/** The spheres' shared geometry, and a striped backdrop so transmission has an opaque image to bend */

import { Mesh3D, SphereGeometry } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { clayGeometry } from './theme/shapes';

/** Anisotropy stretches along the tangent, so each vertex gets one running round its line of latitude. */
export function createSampleGeometry() {
  const width = 64;
  const height = 32;
  const tangents = new Float32Array((width + 1) * (height + 1) * 4);

  for (let row = 0; row <= height; row++) {
    for (let column = 0; column <= width; column++) {
      const angle = (column / width) * Math.PI * 2;
      const at = (row * (width + 1) + column) * 4;

      tangents[at] = -Math.sin(angle);
      tangents[at + 2] = Math.cos(angle);
      tangents[at + 3] = -1;
    }
  }

  return new SphereGeometry({
    radius: 1,
    widthSegments: width,
    heightSegments: height,
    tangents,
  });
}

export function createBackdrop(parent) {
  for (let i = 0; i < 9; i++) {
    new Mesh3D({
      geometry: clayGeometry('cube'),
      material: clayMaterial(i % 2 === 0 ? 'palePink' : 'white'),
      position: { x: (i - 4) * 0.62, y: 1.2, z: -1.5 },
      scale: { x: 0.6, y: 2.2, z: 0.15 },
      parent,
    });
  }
}
