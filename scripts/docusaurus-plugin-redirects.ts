/**
 * `@docusaurus/plugin-client-redirects` with the site's redirects built in. Options written in docusaurus.config.ts
 * are serialized into the copy of the config that ships in main.js, where this list alone weighed 2.4 KB gz.
 */
import pluginClientRedirects, { validateOptions as validateRedirectOptions } from '@docusaurus/plugin-client-redirects';

import type { Options, PluginOptions } from '@docusaurus/plugin-client-redirects';
import type { LoadContext, OptionValidationContext } from '@docusaurus/types';

/** Guides that moved, by their old path, which also redirects with a `/8.x` prefix */
const MOVED_GUIDES: Record<string, string> = {
  '/guides/basics/what-pixijs-is': '/8.x/guides/getting-started/intro#what-is-pixijs',
  '/guides/basics/basics/what-pixijs-is-not': '/8.x/guides/getting-started/intro#what-is-not-pixijs',
  '/guides/basics/getting-started': '/8.x/guides/getting-started/quick-start',
  '/guides/basics/architecture-overview': '/8.x/guides/concepts/architecture',
  '/guides/basics/render-loop': '/8.x/guides/concepts/render-loop',
  '/guides/basics/scene-graph': '/8.x/guides/concepts/scene-graph',
  '/guides/advanced/render-groups': '/8.x/guides/concepts/render-groups',
  '/guides/advanced/render-layers': '/8.x/guides/concepts/render-layers',
  '/guides/basics/svg': '/8.x/guides/components/assets/svg',
  '/guides/advanced/cache-as-texture': '/8.x/guides/components/scene-objects/container/cache-as-texture',
  '/guides/advanced/mixing-three-and-pixi': '/8.x/guides/third-party/mixing-three-and-pixi',
  '/guides/components/containers': '/8.x/guides/components/scene-objects/container',
  '/guides/components/graphics': '/8.x/guides/components/scene-objects/graphics',
  '/guides/components/graphics-pixel-line': '/8.x/guides/components/scene-objects/graphics/graphics-pixel-line',
  '/guides/components/graphics-fill': '/8.x/guides/components/scene-objects/graphics/graphics-fill',
  '/guides/components/interaction': '/8.x/guides/components/events',
  '/guides/components/sprites': '/8.x/guides/components/scene-objects/sprite',
  '/guides/components/text': '/8.x/guides/components/scene-objects/text',
  '/guides/components/sprite-sheets': '/8.x/guides/components/assets',
  '/guides/production/performance-tips': '/8.x/guides/concepts/performance-tips',
};

/** Old example pages, `<category>/<slug>` under `/examples` and `/8.x/examples`, and the example each now opens */
const MOVED_EXAMPLES: Record<string, string> = {
  'basic/container': 'container_transform_pivot_basic',
  'basic/container-origin': 'container_transform_origin',
  'basic/transparent-background': 'app_transparent-background',
  'basic/tinting': 'container_tinting',
  'basic/particle-container': 'particle-container_basic',
  'basic/blend-modes': 'container_blend-modes_comparison',
  'basic/mesh-plane': 'mesh_plane',
  'basic/render-group': 'rendering_render-group',
  'basic/cache-as-texture': 'container_cache-as-texture_optimization',
  'basic/dom-container': 'dom-container_html_text-area',
  'advanced/slots': 'misc_slots',
  'advanced/scratch-card': 'rendering_render-texture_scratch-card',
  'advanced/star-warp': 'misc_star-warp',
  'advanced/three-and-pixi': 'three_basic-integration',
  'advanced/mouse-trail': 'mesh_mouse-trail',
  'advanced/screen-shot': 'misc_screen-shot',
  'advanced/collision-detection': 'misc_physics_aabb',
  'advanced/spinners': 'misc_spinners',
  'sprite/basic': 'sprite_transform_rotation',
  'sprite/gif': 'sprite_gif_animation_loading',
  'sprite/texture-swap': 'sprite_texture-swap',
  'sprite/animated-sprite-explosion': 'animated-sprite_particles',
  'sprite/animated-sprite-jet': 'animated-sprite_spritesheet',
  'sprite/animated-sprite-speed': 'animated-sprite_animation',
  'sprite/tiling-sprite': 'tiling-sprite_transform_animation',
  'sprite/video': 'sprite_video_texture',
  'sprite/nine-slice-sprite-anchor': 'nine-slice-sprite_transform_anchor',
  'sprite/nine-slice-sprite': 'nine-slice-sprite_basic',
  'text/pixi-text': 'text_fill_gradient',
  'text/bitmap-text-break': 'text_bitmap_word-wrap_break-words',
  'text/bitmap-text': 'text_bitmap_xml',
  'text/from-font': 'text_bitmap_web-font_loading',
  'text/web-font': 'text_web-font_google',
  'text/text-filters': 'text_filters_cartoon',
  'text/text-split-bitmap-overlap': 'text_bitmap_split-text',
  'text/text-texture-style': 'text_texture-style_scale-mode',
  'text/text-trim': 'text_trim_bounds',
  'graphics/simple': 'graphics_basic_shapes',
  'graphics/advanced': 'graphics_curves_arcs_holes_textures',
  'graphics/dynamic': 'graphics_dynamic',
  'graphics/svg-texture-large': 'sprite_svg_custom-data',
  'graphics/svg-texture': 'sprite_svg',
  'graphics/svg': 'graphics_svg_string-parsing',
  'graphics/svg-load': 'graphics_svg_file',
  'graphics/texture': 'graphics_texture-fill',
  'graphics/fill-gradient': 'graphics_fill_stroke_gradient',
  'graphics/pixel-line': 'graphics_pixel-line_antialiasing',
  'ordering/render-layer': 'rendering_render-layer',
  'events/click': 'events_click',
  'events/interactivity': 'events_buttons',
  'events/dragging': 'events_dragging',
  'events/custom-mouse-icon': 'events_custom-pointer',
  'events/custom-hitarea': 'events_custom-hitarea',
  'events/logger': 'events_order',
  'events/pointer-tracker': 'events_move',
  'events/slider': 'events_slider',
  'masks/graphics': 'graphics_mask_animation',
  'masks/sprite': 'sprite_mask_animation',
  'masks/filter': 'container_mask_filters_blur',
  'masks/inverse-mask': 'container_inverse-mask',
  'filters-basic/blur': 'filters_blur',
  'filters-basic/color-matrix': 'filters_color-matrix',
  'filters-basic/displacement-map-crawlies': 'filters_displacement_interactive',
  'filters-basic/displacement-map-flag': 'filters_displacement',
  'filters-advanced/mouse-blending': 'filters_custom_interactive_blending',
  'filters-advanced/custom': 'filters_custom-shader_glsl',
  'mesh-and-shaders/perspective-mesh': 'mesh_perspective_3d',
  'mesh-and-shaders/textured-mesh-basic': 'mesh_rope_textured',
  'mesh-and-shaders/textured-mesh-advanced': 'mesh_rope_texture_vertices',
  'mesh-and-shaders/triangle': 'mesh_custom_shader_geometry',
  'mesh-and-shaders/triangle-color': 'mesh_custom_color_attributes',
  'mesh-and-shaders/triangle-textured': 'mesh_custom_texture_uv',
  'mesh-and-shaders/shared-geometry': 'mesh_shared-geometry',
  'mesh-and-shaders/shared-shader': 'mesh_shared-shader',
  'mesh-and-shaders/instanced-geometry': 'mesh_custom_instanced_geometry',
  'mesh-and-shaders/shader-toy-mesh': 'mesh_shader-toy',
  'mesh-and-shaders/multipass-mesh': 'mesh_multipass_shader_effects',
  'textures/texture-rotate': 'rendering_texture_rotation',
  'textures/render-texture-basic': 'rendering_render-texture_basic',
  'textures/render-texture-advanced': 'rendering_render-texture_buffer',
  'assets/promise': 'assets_promises',
  'assets/async': 'assets_async',
  'assets/multiple': 'assets_multi-loading',
  'assets/background': 'assets_background-loading',
  'assets/bundle': 'assets_manifest_bundles',
  'offscreen-canvas/basic': 'offscreen-canvas',
};

const withV8 = (path: string) => ['/8.x' + path, path];

const OPTIONS: Options = {
  redirects: [
    {
      to: '/llms',
      from: ['/8.x/llms', '/docs/llms', '/llms/index'],
    },
    {
      to: '/8.x/guides/getting-started/intro',
      from: ['/8.x/guides', '/guides', '/2d/guides'],
    },
    {
      to: '/3d/guides/getting-started/intro',
      from: ['/3d/guides'],
    },
    {
      to: '/8.x/tutorials',
      from: ['/2d/tutorials'],
    },
    {
      to: '/playground',
      from: ['/8.x/playground'],
    },
    {
      to: '/sponsor',
      from: ['/8.x/sponsor', '/sponsor/SponsorPage'],
    },
    {
      // The bug bounty programme was paused in v8.17.0 and its page removed
      to: '/',
      from: ['/bug-bounty', '/8.x/bug-bounty', '/docs/bug-bounty', '/bug-bounty/BugBountyPage'],
    },
    {
      to: '/faq',
      from: ['/8.x/faq', '/docs/faq', '/faq/FAQPage'],
    },
    {
      to: '/branding',
      from: ['/8.x/branding', '/docs/branding', '/branding/BrandingPage'],
    },
    {
      to: '/showcase',
      from: ['/showcase/ShowcasePage'],
    },
    ...Object.entries(MOVED_GUIDES).map(([from, to]) => ({ to, from: withV8(from) })),
    ...Object.entries(MOVED_EXAMPLES).map(([slug, name]) => ({
      to: `/8.x/examples?example=${name}`,
      from: withV8(`/examples/${slug}`),
    })),
    {
      to: '/8.x/examples',
      from: ['/examples', '/2d/examples'],
    },
  ],

  createRedirects(existingPath: string) {
    if (!existingPath.startsWith('/8.x/')) return undefined;
    for (const section of ['guides', 'tutorials']) {
      if (existingPath.startsWith(`/8.x/${section}`)) return [existingPath.replace('/8.x', '')];
    }
    return undefined;
  },
};

// A function of its own: the imported one also carries the original `validateOptions`, which Docusaurus would prefer
export default function redirects(context: LoadContext, options: PluginOptions) {
  return pluginClientRedirects(context, options);
}

export function validateOptions({ validate }: OptionValidationContext<Options | undefined, PluginOptions>) {
  return validateRedirectOptions({ validate, options: OPTIONS });
}
