/**
 * The particle shader bit this example teaches: it swirls each spark about the system's y axis, in the vertex shader
 *
 * It runs after the built-in lifetime and motion bits, so it reads the `particleAge` and `particleProgress` they
 * declare, and `position` already holds where the launch velocity has carried the spark. Nothing in it runs on the
 * CPU: every frame the shader works the swirl out again from the spark's record and the clock.
 */

// `satisfies` rather than a `: ShaderBit` annotation keeps the attribute's name in the type, so the system's
// `spawn()` takes `aSwirlPhase` and checks it.
export const swirlBit = {
  // Compiled shaders are cached by their bits' names, so the name must be unique.
  name: 'swirl',
  // A value every spark carries, written once, when it's born.
  attributes: { aSwirlPhase: 'float32' },
  // Values the whole system shares, written through `sparks.uniforms`.
  bindings: { material: { uSwirlSpeed: 'f32', uSwirlRadius: 'f32' } },
  // Each block sits in braces, as the motion bit's does, so `angle` and `radius` can't clash with another bit's
  // locals. WGSL reads the attribute from the vertex input, GLSL by its bare name.
  gpu: {
    vertex: {
      beforeTransform: /* wgsl */ `
  {
    let angle = input.aSwirlPhase + particleAge * material.uSwirlSpeed;
    let radius = material.uSwirlRadius * particleProgress;

    position.x += cos(angle) * radius;
    position.z += sin(angle) * radius;
  }
`,
    },
  },
  gl: {
    vertex: {
      beforeTransform: /* glsl */ `
  {
    float angle = aSwirlPhase + particleAge * material.uSwirlSpeed;
    float radius = material.uSwirlRadius * particleProgress;

    position.x += cos(angle) * radius;
    position.z += sin(angle) * radius;
  }
`,
    },
  },
};
