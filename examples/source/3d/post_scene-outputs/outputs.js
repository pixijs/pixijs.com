/**
 * Two scene outputs of our own: each surface's base colour, and its distance from the camera
 *
 * A `SceneOutput` names a texture the scene draw writes beside its colour, and its `bits` say which scene pass gives
 * each material the code that writes it. `{ opaque: bit }` hands the bit to every opaque surface on the engine's
 * template, clay and the logo's enamel included, so each writes the output in the same draw that shades it. A bit
 * declares the field in `outputs` and writes `outputs.<name>` in its fragment `end` slot, once lighting has run.
 */

/**
 * The depths the depth output reads as white and as black, in multiples of the camera's distance from the world's
 * origin, where the logo and the shapes stand
 *
 * A depth in world units would need a range fitted to one camera distance, but the orbit's zoom and a phone's portrait
 * fit back the camera off up to four times further, which would turn the whole card dark. Measured against the
 * camera's own distance, the subject reads the same light grey from anywhere, the floor in front of it near white,
 * and the floor fades to black at twice the subject's distance, so the floating logo stands out against it.
 */
const DEPTH_NEAR = 0.5;
const DEPTH_FAR = 2;
/** A number as a float literal, which both shading languages need beside a float, without losing a digit */
const floatLiteral = (value) =>
  Number.isInteger(value) ? value.toFixed(1) : String(value);
const NEAR = floatLiteral(DEPTH_NEAR);
const FAR = floatLiteral(DEPTH_FAR);

/**
 * The base colour the material slot worked out, before lights, shadows or fog touch it
 *
 * `albedo` is linear light, as the shader works in. The view encodes its colour for the screen with a 2.2 gamma, so
 * the same encode here makes the copy show the colours as the palette picks them.
 */
const albedoBit = {
  name: 'sceneOutputsAlbedo',
  outputs: { albedo: 'vec4<f32>' },
  gpu: {
    fragment: {
      end: /* wgsl */ 'outputs.albedo = vec4<f32>(pow(albedo, vec3<f32>(1.0 / 2.2)), 1.0);',
    },
  },
  gl: {
    fragment: {
      end: /* glsl */ 'outputs.albedo = vec4(pow(albedo, vec3(1.0 / 2.2)), 1.0);',
    },
  },
};

/**
 * Distance along the camera's view axis, white at `DEPTH_NEAR` and black at `DEPTH_FAR`
 *
 * The vertex stage knows where each vertex sits in the camera's space; the `interStage` value carries that depth to
 * the fragment, interpolated across the triangle. The fragment reads the camera's position from the engine's camera
 * uniforms, which every material's shader has without declaring them.
 */
const depthBit = {
  name: 'sceneOutputsDepth',
  outputs: { depth: 'vec4<f32>' },
  interStage: { vViewDepth: 'f32' },
  gpu: {
    vertex: {
      end: /* wgsl */ 'output.vViewDepth = -(camera.uViewMatrix * worldPosition).z;',
    },
    fragment: {
      end: /* wgsl */ `
  {
    let farness = input.vViewDepth / length(camera.uCameraPosition);
    let nearness = 1.0 - clamp((farness - ${NEAR}) / (${FAR} - ${NEAR}), 0.0, 1.0);
    outputs.depth = vec4<f32>(vec3<f32>(nearness), 1.0);
  }`,
    },
  },
  gl: {
    vertex: {
      end: /* glsl */ 'vViewDepth = -(uViewMatrix * worldPosition).z;',
    },
    fragment: {
      end: /* glsl */ `
  {
    float farness = vViewDepth / length(uCameraPosition);
    float nearness = 1.0 - clamp((farness - ${NEAR}) / (${FAR} - ${NEAR}), 0.0, 1.0);
    outputs.depth = vec4(vec3(nearness), 1.0);
  }`,
    },
  },
};

/** Each surface's base colour; where nothing drew, such as the sky, it keeps the default clear, transparent */
export const albedoOutput = {
  name: 'albedo',
  format: 'rgba8unorm',
  bits: { opaque: albedoBit },
};

export const depthOutput = {
  name: 'depth',
  format: 'rgba8unorm',
  bits: { opaque: depthBit },
  // The sky behind the floor is no surface, so nothing writes it. Cleared to black, it reads as far as the far floor;
  // the default clear, transparent, would show the card behind it and read as near on the light theme.
  clearValue: [0, 0, 0, 1],
};
