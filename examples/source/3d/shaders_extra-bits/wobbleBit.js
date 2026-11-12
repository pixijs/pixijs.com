/** The vertex bit: it slides every vertex sideways along a wave that climbs the logo */

import { floatLiteral } from './floatLiteral';

/** Radians of wave per world unit up: a 2.4 unit wavelength, taller than the logo, so it sways as one lean and a bend */
const WOBBLE_FREQUENCY = 2.6;
/** Radians per second the wave climbs */
const WOBBLE_SPEED = 2.4;

/** The `material` fields the bit declares, which `material.data` holds once the bit is in `extraBits` */

const FREQUENCY = floatLiteral(WOBBLE_FREQUENCY);
const SPEED = floatLiteral(WOBBLE_SPEED);

/**
 * Moves every vertex sideways by `sin(y · frequency − time · speed) · wobble`, in world space
 *
 * It runs in `afterTransform`, where the template has already built `clipPosition` from `worldPosition`, so after
 * moving `worldPosition` it builds `clipPosition` again. It leaves the normals alone, which holds at offsets this
 * small. It moves vertices, not pixels: the triangles between them stay flat, so an edge follows the wave only where
 * its vertices sit close together, such as the P's curved outline, and tilts as a straight line where they're far
 * apart, such as the ixi's stems.
 */
export const wobbleBit = {
  name: 'wobble',
  bindings: { material: { wobble: 'f32', wobbleTime: 'f32' } },
  gpu: {
    vertex: {
      afterTransform: /* wgsl */ `
let wave = sin(worldPosition.y * ${FREQUENCY} - material.wobbleTime * ${SPEED});
worldPosition.x += wave * material.wobble;
clipPosition = camera.uViewProjectionMatrix * worldPosition;
`,
    },
  },
  gl: {
    vertex: {
      afterTransform: /* glsl */ `
float wave = sin(worldPosition.y * ${FREQUENCY} - material.wobbleTime * ${SPEED});
worldPosition.x += wave * material.wobble;
gl_Position = uViewProjectionMatrix * worldPosition;
`,
    },
  },
};
