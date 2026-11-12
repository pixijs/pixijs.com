// The files this example loads, by their names in pixi-3d's examples/assets/manifest.ts
const urls = {
  'gltf.DamagedHelmet':
    'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@main/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
};
const url = (name) => urls[name];
export { url as model };
