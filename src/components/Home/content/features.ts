import type { IconName } from '@site/src/components/ui/Icon';

export interface Feature {
  icon: IconName;
  title: string;
  copy: string;
  /** What PixiJS 3D adds */
  badge?: string;
}

/** The feature list on `/`, spanning both dimensions (section 8.4 item 6) */
export const FEATURES: Feature[] = [
  {
    icon: 'monitor-smartphone',
    title: 'Multi-platform support',
    copy: 'Run your content on desktop, mobile and any other device with a modern browser. Write one codebase and ship it to all of them.',
  },
  {
    icon: 'type',
    title: 'Advanced text rendering',
    copy: 'Text renders anti-aliased at native and retina resolutions, so it reads as clearly on the canvas as it does anywhere else.',
  },
  {
    icon: 'network',
    title: 'Full scene graph',
    badge: '+ Z AXIS',
    copy: 'Organise your objects in hierarchical trees, with parent-child relationships, in two dimensions or three.',
  },
  {
    icon: 'blend',
    title: 'Tinting & blending modes',
    copy: 'Tint any object and use the Photoshop-style blend modes that designers already know.',
  },
  {
    icon: 'package',
    title: 'Asset loader',
    badge: '+ glTF',
    copy: 'Load spritesheets, graphics, fonts and animation data, and now glTF and GLB models with their materials, skins and animations.',
  },
  {
    icon: 'images',
    title: 'Spritesheet support',
    copy: 'Load a range of spritesheet formats, with support for trimming and rotational packing to fit more sprites on each sheet.',
  },
  {
    icon: 'wand-sparkles',
    title: 'Filters & materials',
    badge: '+ PBR',
    copy: 'Use the built-in filters or write your own shaders. Meshes get metallic-roughness materials, image-based lighting and point, spot and directional lights.',
  },
  {
    icon: 'cpu',
    title: 'Renderer auto-detect',
    copy: "Ask for WebGPU and PixiJS falls back to WebGL wherever it isn't available. It handles the switch for you, in 2D and 3D.",
  },
  {
    icon: 'coffee',
    title: 'Easy API',
    copy: "The API is designed to be easy to learn. It's simple enough for beginners and still gives experienced developers full control.",
  },
  {
    icon: 'hand',
    title: 'Multi-touch interactivity',
    badge: '+ 3D PICKING',
    copy: 'PixiJS tracks multi-touch input, and now ray-picks meshes so they take the same pointer events as your sprites.',
  },
  {
    icon: 'accessibility',
    title: 'Accessibility',
    copy: 'PixiJS places hidden DOM elements over accessible objects, so screen readers and keyboard users can reach them. No other WebGL renderer does this.',
  },
  {
    icon: 'app-window',
    title: 'Deploy into apps',
    copy: 'Wrap your project with Capacitor, Electron or Cordova to ship it to app stores and desktops. You can prototype and release with the same code.',
  },
];
