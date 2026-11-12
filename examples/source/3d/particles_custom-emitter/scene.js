/**
 * The prop: the burn that eats the logo
 *
 * It isn't the lesson. `shaders_extra-bits` teaches shader bits; this one only has to cut the logo where the shape
 * emits, so the sparks read as the logo coming apart.
 */

import { Material3D, srgbToLinear } from '@pixi/3d';

import { Color } from 'pixi.js';

import { BRAND } from './theme/palette';

/** The glowing band's width past the cut, in logo units, about 40 px wide; the shape's strip matches */
export const BURN_WIDTH = 0.2;
/** The band's brightness over its colour, enough to glow on the light theme's white */
const BURN_GLOW = 1.5;

/** The `material` fields the burn bit declares, which `material.data` holds once the bit is in `extraBits` */

const WIDTH = BURN_WIDTH.toFixed(2);
const GLOW = BURN_GLOW.toFixed(1);

/**
 * Throws away every pixel left of `burnFront`, and lights a band `BURN_WIDTH` wide past it
 *
 * Under the band `albedo` fades out as the glow fades in, so the rim shows the burn's colour rather than pink with it
 * added. The logo is a closed shell, so through the cut a reader would see into hollow letters: back faces only show
 * there, and the bit paints them the burn's colour, so the cut reads as a solid glowing edge. It compares world x,
 * which is the logo's own x while the logo sits at x = 0 and never turns.
 */
const burnBit = {
  name: 'burn',
  bindings: { material: { burnFront: 'f32', burnColor: 'vec3<f32>' } },
  gpu: {
    fragment: {
      material: /* wgsl */ `
let burn = input.vPosition.x - material.burnFront;
if (burn < 0.0) { discard; }
let edge = 1.0 - smoothstep(0.0, ${WIDTH}, burn);
albedo *= 1.0 - edge;
emissive += material.burnColor * edge * ${GLOW};
if (!input.frontFacing) {
  albedo = vec3<f32>(0.0);
  emissive = material.burnColor * ${GLOW};
}
`,
    },
  },
  gl: {
    fragment: {
      material: /* glsl */ `
float burn = vPosition.x - material.burnFront;
if (burn < 0.0) discard;
float edge = 1.0 - smoothstep(0.0, ${WIDTH}, burn);
albedo *= 1.0 - edge;
emissive += material.burnColor * edge * ${GLOW};
if (!gl_FrontFacing) {
  albedo = vec3(0.0);
  emissive = material.burnColor * ${GLOW};
}
`,
    },
  },
};

/** The logo's lacquer with the burn in it, and the burn's fields to write */
export function createBurnMaterial() {
  // The enamel's own settings, so the logo looks as it does in every other example. `doubleSided` draws the back
  // faces the bit fills; everywhere but the cut they stay hidden behind the front faces.
  const material = new Material3D({
    baseColor: BRAND.logoFace,
    roughness: 0.32,
    specular: { factor: 0.2 },
    clearcoat: { factor: 0.2, roughness: 0.06 },
    fog: false,
    doubleSided: true,
    extraBits: [burnBit],
  });
  // `Material3DData` lists the material's own fields; the bit adds its two to the same struct, hence the cast.
  const burn = material.data;
  const color = new Float32Array(3);

  // Material data holds linear light, so the colour is decoded on its way in.
  Color.shared.setValue(BRAND.orange).toRgbArray(color);
  for (let i = 0; i < 3; i++) color[i] = srgbToLinear(color[i]);
  burn.burnColor = color;

  return { material, burn };
}
