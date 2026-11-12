// The files this example loads, by their names in pixi-3d's examples/assets/manifest.ts
const urls = {
  'gltf.AnisotropyBarnLampKtx2':
    'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/AnisotropyBarnLamp/glTF-KTX-BasisU/AnisotropyBarnLamp.gltf',
  'gltf.BrainStemMeshopt':
    'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/BrainStem/glTF-Meshopt/BrainStem.gltf',
  'gltf.CesiumManDraco':
    'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/CesiumMan/glTF-Draco/CesiumMan.gltf',
  'gltf.DuckQuantized':
    'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/Duck/glTF-Quantized/Duck.gltf',
  'gltf.SunglassesKhronosDraco':
    'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/SunglassesKhronos/glTF-Draco/SunglassesKhronos.gltf',
};
const url = (name) => urls[name];
export { url as model };
