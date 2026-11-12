/**
 * The lesson's shader bits: the surface the soft and Lambert spheres share, and the two lighting bits
 * `createLightingBit` builds
 *
 * A material runs its bits in order: a surface bit says what the surface is, here its colour, and a lighting bit how
 * it responds to light. Every snippet comes twice, in WGSL for WebGPU and GLSL for WebGL, and reads the names the
 * factory's loop declares for each light: `light`, `lightDir`, `nDotL`, `attenuation` and `shadow`. `toonLightingBit`
 * in `@pixi/3d/extras`, the lighting of the third sphere's `ToonMaterial`, is the engine's own model built this way, and
 * the one to read next.
 */

import { createLightingBit, mathConstantsBit } from '@pixi/3d';

/**
 * The surface the soft and Lambert spheres share: it tints `albedo` by the material's `baseColor`
 *
 * Declaring `baseColor` in `bindings` is what lets the material's `baseColor` option fill it, decoded to linear light.
 */
export const surfaceBit = {
  name: 'surface',
  bindings: { material: { baseColor: 'vec4<f32>' } },
  gpu: { fragment: { material: 'albedo *= material.baseColor.rgb;' } },
  gl: { fragment: { material: 'albedo *= material.baseColor.rgb;' } },
};

/**
 * Lambert: each light adds in proportion to `nDotL`, and nothing lights the side that faces away
 *
 * Dividing by π (`INV_PI`, from `mathConstantsBit`) is what the engine's PBR does, so a sphere and the stage's PBR
 * floor show one light at the same brightness.
 */
export const lambertLightingBit = createLightingBit({
  name: 'lambertLighting',
  requires: [mathConstantsBit],
  preLighting: {
    gpu: 'var directLight = vec3<f32>(0.0);',
    gl: 'vec3 directLight = vec3(0.0);',
  },
  perLight: {
    gpu: 'directLight += light.color * (nDotL * attenuation * shadow);',
    gl: 'directLight += light.color * (nDotL * attenuation * shadow);',
  },
  postLighting: {
    gpu: 'finalColor = albedo * directLight * INV_PI;',
    gl: 'finalColor = albedo * directLight * INV_PI;',
  },
});

/**
 * The material fields {@link softShadeLightingBit} declares, as `material.data` holds them
 *
 * Written by hand to match the bit's `bindings`, and nothing checks that the two agree. `MaterialData` takes any
 * field name, so a misspelt write such as `data.sofness = 0.5` compiles and changes nothing: add a field to both.
 */

/**
 * A soft-edged model: each light holds near full strength, then fades out over the last `softness` of `nDotL`
 *
 * It differs from Lambert by one line in `perLight` and one term in `postLighting`. `perLight` never runs for a light
 * the surface faces away from, so whatever the shade side shows has to come from `postLighting`: it adds `shadeColor`
 * everywhere, and the lit side outshines it.
 */
export const softShadeLightingBit = createLightingBit({
  name: 'softShadeLighting',
  requires: [mathConstantsBit],
  bindings: { material: { softness: 'f32', shadeColor: 'vec3<f32>' } },
  preLighting: {
    gpu: 'var directLight = vec3<f32>(0.0);',
    gl: 'vec3 directLight = vec3(0.0);',
  },
  perLight: {
    gpu: /* wgsl */ `
    let lit = smoothstep(0.0, material.softness, nDotL);
    directLight += light.color * (lit * attenuation * shadow);
`,
    gl: /* glsl */ `
    float lit = smoothstep(0.0, material.softness, nDotL);
    directLight += light.color * (lit * attenuation * shadow);
`,
  },
  postLighting: {
    gpu: 'finalColor = albedo * (directLight * INV_PI + material.shadeColor);',
    gl: 'finalColor = albedo * (directLight * INV_PI + material.shadeColor);',
  },
});
