/**
 * The shader bit that reads every slot's own row: it lifts the slot on a wave and tints it, with the same sum in
 * JavaScript so the frame can draw where one slot lands
 */

/**
 * Lifts each slot by `sin(wavePhase - wave.x) * wave.y` and multiplies its colour by `tint`, in linear light as
 * `albedo` is
 *
 * `bindings.instance` names the batch's `instanceData` fields, matched by name and type, and the code reads them as
 * `instance.wave` and `instance.tint`. `wave.x` is the slot's phase offset in radians, `wave.y` its height, and `z`
 * and `w` are spare. `bindings.material` adds `wavePhase` to the material's data: the one number the ticker writes.
 * It's a material field rather than the engine's `global.uTime`, so the wave follows the ticker and a speed change
 * doesn't jump it.
 *
 * The lift runs in `beforeTransform`, since the template builds `worldPosition` from `modelMatrix` right after it,
 * and goes on `modelMatrix[3].y`, the translation, so it moves the slot in world units and the slot's own scale
 * doesn't shrink it. The tint runs in the fragment stage, after the clay has set `albedo`; `instance.tint` reaches
 * it as one flat varying.
 */
export const waveBit = {
  name: 'instanceDataWave',
  bindings: {
    material: { wavePhase: 'f32' },
    instance: { wave: 'vec4<f32>', tint: 'vec4<f32>' },
  },
  gpu: {
    vertex: {
      beforeTransform: /* wgsl */ `
let lift = sin(material.wavePhase - instance.wave.x) * instance.wave.y;
modelMatrix[3].y += lift;
`,
    },
    fragment: { material: /* wgsl */ `albedo *= instance.tint.rgb;` },
  },
  gl: {
    vertex: {
      beforeTransform: /* glsl */ `
float lift = sin(material.wavePhase - instance.wave.x) * instance.wave.y;
modelMatrix[3].y += lift;
`,
    },
    fragment: { material: /* glsl */ `albedo *= instance.tint.rgb;` },
  },
};

/** How far the bit lifts a slot whose row holds `offset` and `height`, at `phase`, worked out as the shader does */
export function waveLift(phase, offset, height) {
  return Math.sin(phase - offset) * height;
}
