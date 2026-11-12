/** One line per package in the Ecosystem section, keyed by the package's token in `src/data/packages.ts` */
export interface EcosystemEntry {
  text: string;
  install: string;
  /** Features the package across the grid's corner with a still drawn for it, as `Still` names one */
  still?: string;
}

export const ECOSYSTEM: Record<string, EcosystemEntry> = {
  filters: {
    text: 'Nearly 40 ready-made filters for any display object: glow, CRT, glitch, ASCII, shockwave and more.',
    install: 'npm i pixi-filters',
    still: 'pixi-filters',
  },
  react: { text: 'Write PixiJS scenes as React components.', install: 'npm i @pixi/react' },
  sound: { text: 'WebAudio playback, sound sprites and filters.', install: 'npm i @pixi/sound' },
  spine: {
    text: 'Skeletal animation with the official Spine runtime.',
    install: 'npm i @esotericsoftware/spine-pixi-v8',
  },
  assetpack: {
    text: 'Pack spritesheets, compress textures and write manifests at build time.',
    install: 'npm i -D @assetpack/core',
  },
  devtools: { text: 'Inspect your scene graph and textures from Chrome DevTools.', install: 'npm i -D @pixi/devtools' },
  cli: { text: 'Start a project from a template, with a bundler set up.', install: 'npm create pixi.js@latest' },
  layout: { text: 'Flexbox layout for your containers and sprites.', install: 'npm i @pixi/layout' },
  ui: { text: 'Buttons, sliders, lists and scroll boxes for in-game UI.', install: 'npm i @pixi/ui' },
};
