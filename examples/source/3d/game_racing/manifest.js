// The files this example loads, by their names in pixi-3d's examples/assets/manifest.ts
const urls = {
  'racing.decoration-empty':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/decoration-empty.glb',
  'racing.decoration-forest':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/decoration-forest.glb',
  'racing.decoration-tents':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/decoration-tents.glb',
  'racing.engine':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/audio/engine.ogg',
  'racing.impact':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/audio/impact.ogg',
  'racing.skid':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/audio/skid.ogg',
  'racing.smoke':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/sprites/smoke.png',
  'racing.track-bump':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/track-bump.glb',
  'racing.track-corner':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/track-corner.glb',
  'racing.track-finish':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/track-finish.glb',
  'racing.track-straight':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/track-straight.glb',
  'racing.vehicle-truck-green':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/vehicle-truck-green.glb',
  'racing.vehicle-truck-purple':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/vehicle-truck-purple.glb',
  'racing.vehicle-truck-red':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/vehicle-truck-red.glb',
  'racing.vehicle-truck-yellow':
    'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/vehicle-truck-yellow.glb',
};
const url = (name) => urls[name];
const models = {
  racing: {
    'decoration-empty':
      'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/decoration-empty.glb',
    'decoration-forest':
      'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/decoration-forest.glb',
    'decoration-tents':
      'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/decoration-tents.glb',
    'track-bump':
      'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/track-bump.glb',
    'track-corner':
      'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/track-corner.glb',
    'track-finish':
      'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/track-finish.glb',
    'track-straight':
      'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/track-straight.glb',
    'vehicle-truck-green':
      'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/vehicle-truck-green.glb',
    'vehicle-truck-purple':
      'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/vehicle-truck-purple.glb',
    'vehicle-truck-red':
      'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/vehicle-truck-red.glb',
    'vehicle-truck-yellow':
      'https://cdn.jsdelivr.net/gh/pixijs/pixi-asset-storage@e73783699c4953aee0453b5ca12506f6fa515f8d/kenney/starter-kit-racing/vehicle-truck-yellow.glb',
  },
};
export { url as model, url as texture, url as sound, models };
