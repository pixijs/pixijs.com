/** A deliberately inexpensive depth-of-field approximation: distance from a focus plane selects a blurred mip */

import { PostEffect } from '@pixi/3d';

import { UniformGroup } from 'pixi.js';

/**
 * Camera depth is -viewPos.z, not distance from the camera: points on one plane stay sharp together.
 * Mip levels blur the whole image before this mix, so silhouettes can bleed. This is not a physical bokeh solver.
 * The mask tints the frame with the helpers' y green (0x3fd47e) where it's sharp and BRAND.purple (0x8b5cf6) where
 * it's blurred, written as 0 to 1 channels. The effect runs at the default `'beforeToneMapping'` stage, on linear
 * light, so the display encode after it shows both lighter than those hex colours.
 */
const FRAGMENT = {
  gpu: /* wgsl */ `
fn effect(uv: vec2<f32>) -> vec4<f32> {
  let depth = -viewPos(uv).z;
  let amount = smoothstep(fx.uFocus.y, fx.uFocus.y * 2.0, abs(depth - fx.uFocus.x));
  let color = sampleColorLod(uv, log2(1.0 + amount * fx.uFocus.z));
  let mask = mix(vec3<f32>(0.247, 0.831, 0.494), vec3<f32>(0.545, 0.361, 0.965), amount);
  return vec4<f32>(mix(color.rgb, mask, 0.6 * fx.uFocus.w), color.a);
}
`,
  gl: /* glsl */ `
vec4 effect(vec2 uv) {
  float depth = -viewPos(uv).z;
  float amount = smoothstep(uFocus.y, uFocus.y * 2.0, abs(depth - uFocus.x));
  vec4 color = sampleColorLod(uv, log2(1.0 + amount * uFocus.z));
  vec3 mask = mix(vec3(0.247, 0.831, 0.494), vec3(0.545, 0.361, 0.965), amount);
  return vec4(mix(color.rgb, mask, 0.6 * uFocus.w), color.a);
}
`,
};

/** Uses the post chain's mipmapped input and depth helpers on both backends */
export class DepthOfFieldEffect extends PostEffect {
  inputMips = true;
  fragment = FRAGMENT;
  uniforms = new UniformGroup({
    uFocus: { value: new Float32Array(4), type: 'vec4<f32>' },
  });

  constructor({
    focusDistance = 13,
    focusRange = 0.65,
    blurRadius = 20,
    ...options
  } = {}) {
    super(options);
    this.focusDistance = focusDistance;
    this.focusRange = focusRange;
    this.blurRadius = blurRadius;
  }

  /** Camera-space distance of the sharp plane, in world units */
  get focusDistance() {
    return this.uniforms.uniforms.uFocus[0];
  }
  set focusDistance(value) {
    this.writeLane(this.uniforms, 'uFocus', 0, value);
  }

  /** Half-width of the sharp band; the blur reaches full strength at twice this distance */
  get focusRange() {
    return this.uniforms.uniforms.uFocus[1];
  }
  set focusRange(value) {
    this.writeLane(this.uniforms, 'uFocus', 1, value);
  }

  /** Maximum blur footprint, in texels of the input: device pixels, so a 2× screen needs twice the value */
  get blurRadius() {
    return this.uniforms.uniforms.uFocus[2];
  }
  set blurRadius(value) {
    this.writeLane(this.uniforms, 'uFocus', 2, value);
  }

  /** Tints the sharp band green and the blurred depths purple */
  get showFocus() {
    return this.uniforms.uniforms.uFocus[3] === 1;
  }
  set showFocus(value) {
    this.writeLane(this.uniforms, 'uFocus', 3, Number(value));
  }
}
