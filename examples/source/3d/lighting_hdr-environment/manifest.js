// The files this example loads, by their names in pixi-3d's examples/assets/manifest.ts
const urls = {
  'hdri.VeniceSunset':
    'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr',
  'pixijs.Logo':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/pixijs/pixijs-logo.glb',
};
const url = (name) => urls[name];
export { url as model, url as environment };
