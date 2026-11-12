// The files this example loads, by their names in pixi-3d's examples/assets/manifest.ts
const urls = {
  'pixijs.Diorama':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/pixijs/diorama.gltf',
};
const url = (name) => urls[name];
export { url as model };
