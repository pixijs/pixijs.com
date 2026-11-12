/** A top-down texture projection: world x and z pick a texel, independent of each mesh's UVs */

export const cloudBit = {
  name: 'exampleProjectedCloud',
  textures: ['cloud'],
  bindings: {
    material: {
      cloudScale: 'f32',
      cloudOffset: 'f32',
      cloudStrength: 'f32',
      worldProjection: 'f32',
    },
  },
  gpu: {
    fragment: {
      material: /* wgsl */ `
let cloudWorldUV = input.vPosition.xz * material.cloudScale;
let cloudUV = mix(input.vUV, cloudWorldUV, material.worldProjection)
  + vec2<f32>(material.cloudOffset, 0.0);
let cloudMask = sampleCloud(cloudUV).r;
albedo *= 1.0 - cloudMask * material.cloudStrength;
`,
    },
  },
  gl: {
    fragment: {
      material: /* glsl */ `
vec2 cloudWorldUV = vPosition.xz * material.cloudScale;
vec2 cloudUV = mix(vUV, cloudWorldUV, material.worldProjection)
  + vec2(material.cloudOffset, 0.0);
float cloudMask = sampleCloud(cloudUV).r;
albedo *= 1.0 - cloudMask * material.cloudStrength;
`,
    },
  },
};
