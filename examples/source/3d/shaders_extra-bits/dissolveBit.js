/**
 * The fragment bit: it gives every pixel of the logo a noise value, throws away the pixels whose noise is at or under
 * `dissolve`, and lights a rim just above the cut
 */

import { floatLiteral } from './floatLiteral';

/**
 * The rim's width in noise, and the lowest noise any pixel gets
 *
 * Lifting the noise by the rim's width keeps every pixel out of the rim at `dissolve` 0, so the whole logo shows with
 * no glow.
 */
const DISSOLVE_EDGE = 0.12;
/** How bright the rim is against its colour: past 1, so it reads as light given off rather than a painted stripe */
const GLOW = 1.2;

/** The `material` fields the bit declares, which `material.data` holds once the bit is in `extraBits` */

const EDGE = floatLiteral(DISSOLVE_EDGE);

/**
 * Two octaves of value noise over Dave Hoskins' `hash12`, which uses no `sin` and so holds on any GPU's floats
 *
 * Value noise bunches round 0.5, so `smoothstep(0.15, 0.85, n)` spreads it out to nearly even before the lift: the
 * share of pixels under a cut is then close to how far the cut is along the range, so `dissolve` 0.5 takes about
 * half the logo. 1.2 cells per model unit makes holes about half a world unit across.
 */
const NOISE_WGSL = /* wgsl */ `
fn dissolveHash(p: vec2<f32>) -> f32 {
  var p3 = fract(vec3<f32>(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
fn dissolveValueNoise(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let t = fract(p);
  let u = t * t * (3.0 - 2.0 * t);
  let bottom = mix(dissolveHash(i), dissolveHash(i + vec2<f32>(1.0, 0.0)), u.x);
  let top = mix(dissolveHash(i + vec2<f32>(0.0, 1.0)), dissolveHash(i + vec2<f32>(1.0, 1.0)), u.x);
  return mix(bottom, top, u.y);
}
fn dissolveNoiseAt(p: vec2<f32>) -> f32 {
  let n = 0.65 * dissolveValueNoise(p * 1.2) + 0.35 * dissolveValueNoise(p * 2.76 + 17.0);
  return mix(${EDGE}, 1.0, smoothstep(0.15, 0.85, n));
}
`;

const NOISE_GLSL = /* glsl */ `
float dissolveHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float dissolveValueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 t = fract(p);
  vec2 u = t * t * (3.0 - 2.0 * t);
  float bottom = mix(dissolveHash(i), dissolveHash(i + vec2(1.0, 0.0)), u.x);
  float top = mix(dissolveHash(i + vec2(0.0, 1.0)), dissolveHash(i + vec2(1.0, 1.0)), u.x);
  return mix(bottom, top, u.y);
}
float dissolveNoiseAt(vec2 p) {
  float n = 0.65 * dissolveValueNoise(p * 1.2) + 0.35 * dissolveValueNoise(p * 2.76 + 17.0);
  return mix(${EDGE}, 1.0, smoothstep(0.15, 0.85, n));
}
`;

/**
 * Eats the logo away pixel by pixel, with a glowing rim along each cut
 *
 * The vertex stage hands each pixel the logo's own position, before any transform, through the `vDissolveXY`
 * varying, so the holes stay on the letters while the wobble moves them, whichever order the two bits are listed
 * in. The test is `<=` because the noise reaches exactly 1, so `dissolve` 1 leaves no pixel. Under the rim `albedo`
 * fades out, so the rim shows the edge colour itself rather than pink with the glow added.
 */
export const dissolveBit = {
  name: 'dissolve',
  bindings: { material: { dissolve: 'f32', dissolveEdgeColor: 'vec3<f32>' } },
  interStage: { vDissolveXY: 'vec2<f32>' },
  gpu: {
    header: NOISE_WGSL,
    vertex: { beforeTransform: /* wgsl */ `output.vDissolveXY = position.xy;` },
    fragment: {
      material: /* wgsl */ `
let dissolveNoise = dissolveNoiseAt(input.vDissolveXY);
if (dissolveNoise <= material.dissolve) { discard; }
let edge = 1.0 - smoothstep(0.0, ${EDGE}, dissolveNoise - material.dissolve);
albedo *= 1.0 - edge;
emissive += material.dissolveEdgeColor * edge * ${floatLiteral(GLOW)};
`,
    },
  },
  gl: {
    header: NOISE_GLSL,
    vertex: { beforeTransform: /* glsl */ `vDissolveXY = position.xy;` },
    fragment: {
      material: /* glsl */ `
float dissolveNoise = dissolveNoiseAt(vDissolveXY);
if (dissolveNoise <= material.dissolve) discard;
float edge = 1.0 - smoothstep(0.0, ${EDGE}, dissolveNoise - material.dissolve);
albedo *= 1.0 - edge;
emissive += material.dissolveEdgeColor * edge * ${floatLiteral(GLOW)};
`,
    },
  },
};
