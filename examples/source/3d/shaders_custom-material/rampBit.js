/**
 * The shader bit behind `RampMaterial`
 *
 * The bit declares one texture and three uniforms, and fills the material template's `fragment.material` slot and
 * nothing else. It reads `normal`, the camera's position and the pixel's world position, and writes `albedo`. No bit
 * fills `fragment.lighting`, so `albedo` is the colour that reaches the screen and no light touches it.
 */

/**
 * Colours each pixel from the ramp by how directly its surface faces the camera
 *
 * `t` is the middle of the pixel's band, so every pixel in a band reads the same colour; the ramp is one row tall, so
 * `0.5` reads its middle. A pixel facing away has a negative `facing`, which the edge test always catches. It samples
 * the ramp before the edge test, not in an `else`, to keep `sampleRamp` in uniform control flow: it picks its mip level
 * from screen derivatives, which are undefined in a branch that some neighbouring pixels skip. Both colours are
 * written as painted, so `decodeColor` brings them into the shader's colour space; the engine encodes `albedo` for the
 * screen at the end, so they show as painted. WGSL reads the camera and the varyings through `camera.` and `input.`,
 * and GLSL reads them bare.
 */
export const rampBit = {
  name: 'ramp',
  // Each name gets a slot in `material.textures` and a generated `sampleRamp(uv)` in both languages.
  textures: ['ramp'],
  // The shader reads them as `material.bands`, and `material.data` holds them in the same layout.
  bindings: {
    material: { bands: 'f32', edgeWidth: 'f32', edgeColor: 'vec3<f32>' },
  },
  gpu: {
    fragment: {
      material: `let viewDir = normalize(
  camera.uCameraPosition - input.vPosition);
let facing = dot(normal, viewDir);
let band = floor(facing * material.bands);
let t = (band + 0.5) / material.bands;
albedo = decodeColor(sampleRamp(vec2(t, 0.5)).rgb);
if (facing < material.edgeWidth) {
  albedo = decodeColor(material.edgeColor);
}`,
    },
  },
  gl: {
    fragment: {
      material: `vec3 viewDir = normalize(
  uCameraPosition - vPosition);
float facing = dot(normal, viewDir);
float band = floor(facing * material.bands);
float t = (band + 0.5) / material.bands;
albedo = decodeColor(sampleRamp(vec2(t, 0.5)).rgb);
if (facing < material.edgeWidth) {
  albedo = decodeColor(material.edgeColor);
}`,
    },
  },
};
