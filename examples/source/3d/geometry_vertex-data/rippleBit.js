/**
 * The shader bit that reads the mound's vertex data: it lifts each vertex by its `colors1` mask, on a wave that
 * reaches it `aPhase` radians late
 */

/** The `material` fields the bit declares, which `material.data` holds once the bit is in `extraBits` */

/** A `Material3D` with the bit in its `extraBits`, whose `data` holds the bit's fields too */

/**
 * Lifts each vertex in the vertex stage, before the model transform
 *
 * It reads the two attributes by their keys: `colors1` reaches the shader as `aColor1`, and an attribute you add keeps
 * its own name. `wave` runs from 0 to 1, never below, because the shadow pass draws the mound without this bit: a
 * surface that only rises never sinks into its own shadow.
 */
export const rippleBit = {
  name: 'ripple',
  // The types the shader reads, not the stored formats: the GPU turns `colors1`'s bytes (unorm8x4) into floats from
  // 0 to 1 on the way in, so a stored 255 reads as 1.
  attributes: { aColor1: 'float32x4', aPhase: 'float32' },
  bindings: {
    material: {
      liftHeight: 'f32',
      maskStrength: 'f32',
      phaseScale: 'f32',
      waveTime: 'f32',
    },
  },
  gpu: {
    vertex: {
      beforeTransform: `let mask = mix(1.0, input.aColor1.r, material.maskStrength);
let delay = input.aPhase * material.phaseScale;
let wave = 0.5 + 0.5 * sin(material.waveTime - delay);
position.y += mask * wave * material.liftHeight;`,
    },
  },
  gl: {
    vertex: {
      beforeTransform: `float mask = mix(1.0, aColor1.r, material.maskStrength);
float delay = aPhase * material.phaseScale;
float wave = 0.5 + 0.5 * sin(material.waveTime - delay);
position.y += mask * wave * material.liftHeight;`,
    },
  },
};
