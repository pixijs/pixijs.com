/**
 * The stack's own effect: every pixel's luma written into all three channels
 *
 * It's built the way `TintEffect` is, one `fragment` with a WGSL and a GLSL body, which `PostEffect` compiles into a
 * single fullscreen pass; it needs no uniforms. No built-in effect pairs with `TintEffect` to show that order matters,
 * so the example brings this one; `post_custom-effect` covers writing your own.
 */

import { PostEffect } from '@pixi/3d';

export class GreyscaleEffect extends PostEffect {
  // A colour grade on the picture as it shows, at `TintEffect`'s stage: effects at different stages run stage by stage,
  // whatever their order in `passes`, so this has to share the tint's for the order to matter.
  constructor(options = {}) {
    super({ stage: 'afterToneMapping', ...options });
  }

  // The luma weights for sRGB primaries, applied to the stored colour as `TintEffect` applies its multiply.
  fragment = {
    gpu: /* wgsl */ `
fn effect(uv: vec2<f32>) -> vec4<f32> {
  let color = sampleColor(uv);
  let luma = dot(color.rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
  return vec4<f32>(vec3<f32>(luma), color.a);
}
`,
    gl: /* glsl */ `
vec4 effect(vec2 uv) {
  vec4 color = sampleColor(uv);
  float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
  return vec4(vec3(luma), color.a);
}
`,
  };
}
