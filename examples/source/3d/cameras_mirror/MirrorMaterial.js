/**
 * The mirror's glass: an unlit surface that shows the mirror camera's picture, turned over, under a tint
 *
 * Each pixel reads the feed at its own place on the screen rather than at the quad's UVs, so the reflection holds
 * still against the world as the viewer moves, the way a real mirror's does. The read is flipped top to bottom: the
 * mirror camera stands upright under the glass, so it sees the world the right way up, and a reflection is that
 * picture turned over. A camera mirrored through the glass (`scale.y = -1`) would need no flip, but the engine picks
 * which side of a triangle faces it from the render target alone, so that camera would draw the scene inside out.
 */

import { BaseMaterial3D } from '@pixi/3d';

/** The texture slot `mirrorBit` declares, as `material.textures` holds it */

/**
 * Samples the feed where the pixel lands on screen, `ndc * 0.5 + 0.5`, and tints it by `baseColor`
 *
 * It reads both through the colour-space helpers, as the engine's `portalBit` does: `decodeFrame` for the feed, a frame
 * the view drew, and `inputTint` for the tint, so they land in whichever colour space the shader runs in.
 *
 * The engine's `portalBit` reads a feed the same way with `1 -` on y, which shows it upright on both backends; without
 * it the picture turns over on both.
 */
const mirrorBit = {
  name: 'mirror',
  // A slot in `material.textures` and a generated `sampleMirror(uv)` in both languages.
  textures: ['mirror'],
  // The lanes `BaseMaterial3D` packs `baseColor` into, linear and as authored. The glass is opaque, so the bit reads
  // only their rgb.
  bindings: {
    material: { baseColor: 'vec4<f32>', displayBaseColor: 'vec4<f32>' },
  },
  gpu: {
    header: /* wgsl */ `
fn mirrorUV(worldPos: vec3<f32>) -> vec2<f32> {
  let clip = camera.uViewProjectionMatrix * vec4<f32>(worldPos, 1.0);
  return clip.xy / clip.w * 0.5 + 0.5;
}
`,
    fragment: {
      material: /* wgsl */ `albedo *= decodeFrame(sampleMirror(mirrorUV(input.vPosition)).rgb)
  * inputTint(material.baseColor, material.displayBaseColor).rgb;`,
    },
  },
  gl: {
    header: /* glsl */ `
vec2 mirrorUV(vec3 worldPos) {
  vec4 clip = uViewProjectionMatrix * vec4(worldPos, 1.0);
  return clip.xy / clip.w * 0.5 + 0.5;
}
`,
    fragment: {
      material: /* glsl */ `albedo *= decodeFrame(sampleMirror(mirrorUV(vPosition)).rgb)
  * inputTint(material.baseColor, material.displayBaseColor).rgb;`,
    },
  },
};

export class MirrorMaterial extends BaseMaterial3D {
  lit = false;
  // The glass only multiplies colours, so it can skip the decode and encode that cancel, as PortalMaterial does.
  colorSpace = 'display';

  constructor({ texture, baseColor }) {
    super({
      // The feed is a finished picture, lit, fogged and toned from under the glass, so the glass adds no lighting or
      // fog of its own. It shows the picked colour multiplied over the feed, the way a pixi tint does.
      fog: false,
      baseColor,
      descriptor: { bitsGpu: [mirrorBit], bitsGl: [mirrorBit] },
      textures: { mirror: texture },
    });
  }
}
