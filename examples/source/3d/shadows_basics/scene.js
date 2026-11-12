/**
 * The props on the set: a white plinth along the wall's foot, an orange sphere and a lilac cube standing on it, and
 * the lights' idle sway
 */

import { Mesh3D } from '@pixi/3d';

import { clayMaterial } from './theme/clay';
import { clayGeometry, roundedBox } from './theme/shapes';

/** How far each light swings along x either way, and the seconds one full swing takes */
const SWAY = {
  sun: { reach: 1, period: 16 },
  spot: { reach: 0.4, period: 12 },
};

/** Builds the plinth and its props; the sphere is the one whose contact shadow shows peter-panning */
export function createProps(parent) {
  // Like the wall, the plinth casts as well as receives, so it can shadow itself: shadow acne shows on it.
  const plinth = new Mesh3D({
    geometry: roundedBox(6.4, 0.3, 3.4, 0.08),
    material: clayMaterial('white'),
    castShadow: true,
    receiveShadow: true,
    position: { x: 0, y: 0.15, z: 0.6 },
    parent,
  });
  const sphere = new Mesh3D({
    geometry: clayGeometry('sphere'),
    material: clayMaterial('orange'),
    position: { x: -2.4, y: 0.8, z: 1.75 },
    parent,
  });

  new Mesh3D({
    geometry: clayGeometry('cube'),
    material: clayMaterial('lilac'),
    position: { x: 1.9, y: 0.8, z: 1.5 },
    parent,
  });

  return { plinth, sphere };
}

/** How far along x a light has swung from its home, `time` seconds into its sway */
export function swayOffset(light, time) {
  const { reach, period } = SWAY[light];

  return Math.sin((time * 2 * Math.PI) / period) * reach;
}
