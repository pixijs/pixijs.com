/** A vignette as a post effect of your own: one fragment in WGSL and GLSL, and three uniforms in one vec4 */

import { PostEffect } from '@pixi/3d';

import { UniformGroup } from 'pixi.js';

/**
 * The vignette's shader, once per backend. `effect(uv)` runs for every pixel of the finished frame: `uv` runs 0 to 1
 * across the view, `sampleColor(uv)` reads the frame there, and what it returns is the new colour. The uniforms bind
 * as `fx.uVignette` in WGSL and plain `uVignette` in GLSL.
 *
 * It darkens by distance from the centre, the same in every direction, on purpose: `uv.y` runs down the screen on
 * WebGPU and up it on WebGL, so an effect that isn't symmetric top to bottom draws upside down on one of them.
 */
const VIGNETTE_FRAGMENT = {
  gpu: /* wgsl */ `
fn effect(uv: vec2<f32>) -> vec4<f32> {
  let strength = fx.uVignette.x;
  let radius = fx.uVignette.y;
  let softness = fx.uVignette.z;
  let d = distance(uv, vec2(0.5));
  let edge = smoothstep(radius, radius + softness, d);
  let shade = 1.0 - strength * edge;
  let color = sampleColor(uv);
  return vec4(color.rgb * shade, color.a);
}
`,
  gl: /* glsl */ `
vec4 effect(vec2 uv) {
  float strength = uVignette.x;
  float radius = uVignette.y;
  float softness = uVignette.z;
  float d = distance(uv, vec2(0.5));
  float edge = smoothstep(radius, radius + softness, d);
  float shade = 1.0 - strength * edge;
  vec4 color = sampleColor(uv);
  return vec4(color.rgb * shade, color.a);
}
`,
};

/**
 * Darkens the frame toward its edges
 *
 * The declarative kind of post effect: it declares a `fragment` and its `uniforms`, and the base class's `build()`
 * makes the one fullscreen pass that runs them. Each property writes one lane of `uVignette`, a uniform write, so it
 * can change every frame.
 */
export class VignetteEffect extends PostEffect {
  uniforms = new UniformGroup({
    uVignette: { value: new Float32Array(4), type: 'vec4<f32>' },
  });

  fragment = VIGNETTE_FRAGMENT;

  constructor({
    strength = 0.55,
    radius = 0.25,
    softness = 0.35,
    ...options
  } = {}) {
    // A vignette shades the picture as it shows, so it runs after the tone curve: darkening linear light by the same
    // factor would show far fainter once the curve encodes it.
    super({ stage: 'afterToneMapping', ...options });
    this.strength = strength;
    this.radius = radius;
    this.softness = softness;
  }

  /** How dark the frame gets past `radius + softness`, 0 to 1: lane x of `uVignette` */
  get strength() {
    return this.uniforms.uniforms.uVignette[0];
  }
  set strength(value) {
    this.writeLane(this.uniforms, 'uVignette', 0, value);
  }

  /** Where the darkening starts, in `uv` from the centre: lane y */
  get radius() {
    return this.uniforms.uniforms.uVignette[1];
  }
  set radius(value) {
    this.writeLane(this.uniforms, 'uVignette', 1, value);
  }

  /** How far past `radius` the darkening reaches full strength: lane z */
  get softness() {
    return this.uniforms.uniforms.uVignette[2];
  }
  set softness(value) {
    this.writeLane(this.uniforms, 'uVignette', 2, value);
  }
}
