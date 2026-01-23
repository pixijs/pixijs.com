import { Config } from '@docusaurus/types';
import { themes } from 'prism-react-renderer';

const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

const config: Config = {
  title: 'PixiJS',
  tagline: 'Homepage still needs to be revamped',
  url: 'https://pixijs.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  favicon: 'images/favicon.png',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
      onBrokenMarkdownImages: 'throw',
    },
  },

  customFields: {
    PIXI_VERSION: process.env.PIXI_VERSION || 'dev',
  },

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'pixijs', // Usually your GitHub org/user name.
  projectName: 'pixijs.com', // Usually your repo name.
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  future: {
    v4: true,
    experimental_faster: {
      rspackBundler: true, // required flag
      rspackPersistentCache: true, // new flag
      ssgWorkerThreads: true,
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/pixijs/pixijs.com/tree/main/',
          routeBasePath: '/',
          lastVersion: 'current',
          versions: {
            '7.x': {
              label: 'v7.x',
              path: '7.x',
              banner: 'none',
              badge: true,
            },

            current: {
              label: 'v8.x',
              path: '8.x',
              banner: 'none',
              badge: false,
            },
          },
          breadcrumbs: false,
        },
        blog: {
          blogTitle: 'PixiJS News',
          blogDescription: 'Latest news from the PixiJS team',
          postsPerPage: 'ALL',
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: './src/css/custom.scss',
        },
        gtag: {
          trackingID: 'G-YXHQVRJ694',
        },
      },
    ],
  ],

  plugins: [
    [
      './scripts/docusaurus-plugin-llms-txt-replace.ts',
      {
        // Options here
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        docsDir: 'docs',
        ignoreFiles: [
          '7.x/*',
          '**/examples/*',
          '**/tutorials/*',
          '**/playground/*',
          'docs/guides/getting-started/intro.mdx',
          'docs/guides/migrations/v5.md',
          'docs/guides/migrations/v6.md',
          'docs/guides/migrations/v7.md',
        ],
        title: 'PixiJS Documentation for LLMs',
        description:
          'PixiJS is the fastest, most lightweight 2D library available for the web, working across all devices and allowing you to create rich, interactive graphics and cross-platform applications using WebGL and WebGPU.',
        includeBlog: false,
        includeOrder: [
          '**/getting-started/*',
          '**/concepts/*',
          '**/components/*',
          '**/third-party/*',
          '**/migrations/*',
        ],
        includeUnmatchedLast: true,
        // Path transformation options
        pathTransformation: {
          // Paths to ignore when constructing URLs (will be removed if found)
          ignorePaths: ['docs'],
          // Paths to add when constructing URLs (will be prepended if not already present)
          addPaths: ['8.x'],
        },
      },
    ],
    'docusaurus-plugin-sass',
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/llms',
            from: ['/8.x/llms', '/docs/llms', '/llms/index'],
          },
          {
            to: '/8.x/guides/getting-started/intro',
            from: ['/8.x/guides', '/guides'],
          },
          {
            to: '/sponsor',
            from: ['/8.x/sponsor'],
          },
          {
            to: '/bug-bounty',
            from: ['/8.x/bug-bounty', '/docs/bug-bounty'],
          },
          {
            to: '/faq',
            from: ['/8.x/faq', '/docs/faq'],
          },
          {
            to: '/branding',
            from: ['/8.x/branding', '/docs/branding'],
          },
          {
            to: '/8.x/guides/getting-started/intro#what-is-pixijs',
            from: ['/8.x/guides/basics/what-pixijs-is', '/guides/basics/what-pixijs-is'],
          },
          {
            to: '/8.x/guides/getting-started/intro#what-is-not-pixijs',
            from: ['/8.x/guides/basics/basics/what-pixijs-is-not', '/guides/basics/basics/what-pixijs-is-not'],
          },
          {
            to: '/8.x/guides/getting-started/quick-start',
            from: ['/8.x/guides/basics/getting-started', '/guides/basics/getting-started'],
          },
          {
            to: '/8.x/guides/concepts/architecture',
            from: ['/8.x/guides/basics/architecture-overview', '/guides/basics/architecture-overview'],
          },
          {
            to: '/8.x/guides/concepts/render-loop',
            from: ['/8.x/guides/basics/render-loop', '/guides/basics/render-loop'],
          },
          {
            to: '/8.x/guides/concepts/scene-graph',
            from: ['/8.x/guides/basics/scene-graph', '/guides/basics/scene-graph'],
          },
          {
            to: '/8.x/guides/concepts/render-groups',
            from: ['/8.x/guides/advanced/render-groups', '/guides/advanced/render-groups'],
          },
          {
            to: '/8.x/guides/concepts/render-layers',
            from: ['/8.x/guides/advanced/render-layers', '/guides/advanced/render-layers'],
          },
          {
            to: '/8.x/guides/components/assets/svg',
            from: ['/8.x/guides/basics/svg', '/guides/basics/svg'],
          },
          {
            to: '/8.x/guides/components/scene-objects/container/cache-as-texture',
            from: ['/8.x/guides/advanced/cache-as-texture', '/guides/advanced/cache-as-texture'],
          },
          {
            to: '/8.x/guides/third-party/mixing-three-and-pixi',
            from: ['/8.x/guides/advanced/mixing-three-and-pixi', '/guides/advanced/mixing-three-and-pixi'],
          },
          {
            to: '/8.x/guides/components/scene-objects/container',
            from: ['/8.x/guides/components/containers', '/guides/components/containers'],
          },
          {
            to: '/8.x/guides/components/scene-objects/graphics',
            from: ['/8.x/guides/components/graphics', '/guides/components/graphics'],
          },
          {
            to: '/8.x/guides/components/scene-objects/graphics/graphics-pixel-line',
            from: ['/8.x/guides/components/graphics-pixel-line', '/guides/components/graphics-pixel-line'],
          },
          {
            to: '/8.x/guides/components/scene-objects/graphics/graphics-fill',
            from: ['/8.x/guides/components/graphics-fill', '/guides/components/graphics-fill'],
          },
          {
            to: '/8.x/guides/components/events',
            from: ['/8.x/guides/components/interaction', '/guides/components/interaction'],
          },
          {
            to: '/8.x/guides/components/scene-objects/sprite',
            from: ['/8.x/guides/components/sprites', '/guides/components/sprites'],
          },
          {
            to: '/8.x/guides/components/scene-objects/text',
            from: ['/8.x/guides/components/text', '/guides/components/text'],
          },
          {
            to: '/8.x/guides/components/assets',
            from: ['/8.x/guides/components/sprite-sheets', '/guides/components/sprite-sheets'],
          },
          {
            to: '/8.x/guides/concepts/performance-tips',
            from: ['/8.x/guides/production/performance-tips', '/guides/production/performance-tips'],
          },
          {
            to: '/8.x/examples?example=container_transform_pivot_basic',
            from: ['/8.x/examples/basic/container', '/examples/basic/container'],
          },
          {
            to: '/8.x/examples?example=container_transform_origin',
            from: ['/8.x/examples/basic/container-origin', '/examples/basic/container-origin'],
          },
          {
            to: '/8.x/examples?example=app_transparent-background',
            from: ['/8.x/examples/basic/transparent-background', '/examples/basic/transparent-background'],
          },
          {
            to: '/8.x/examples?example=container_tinting',
            from: ['/8.x/examples/basic/tinting', '/examples/basic/tinting'],
          },
          {
            to: '/8.x/examples?example=particle-container_basic',
            from: ['/8.x/examples/basic/particle-container', '/examples/basic/particle-container'],
          },
          {
            to: '/8.x/examples?example=container_blend-modes_comparison',
            from: ['/8.x/examples/basic/blend-modes', '/examples/basic/blend-modes'],
          },
          {
            to: '/8.x/examples?example=mesh_plane',
            from: ['/8.x/examples/basic/mesh-plane', '/examples/basic/mesh-plane'],
          },
          {
            to: '/8.x/examples?example=rendering_render-group',
            from: ['/8.x/examples/basic/render-group', '/examples/basic/render-group'],
          },
          {
            to: '/8.x/examples?example=container_cache-as-texture_optimization',
            from: ['/8.x/examples/basic/cache-as-texture', '/examples/basic/cache-as-texture'],
          },
          {
            to: '/8.x/examples?example=dom-container_html_text-area',
            from: ['/8.x/examples/basic/dom-container', '/examples/basic/dom-container'],
          },
          {
            to: '/8.x/examples?example=misc_slots',
            from: ['/8.x/examples/advanced/slots', '/examples/advanced/slots'],
          },
          {
            to: '/8.x/examples?example=rendering_render-texture_scratch-card',
            from: ['/8.x/examples/advanced/scratch-card', '/examples/advanced/scratch-card'],
          },
          {
            to: '/8.x/examples?example=misc_star-warp',
            from: ['/8.x/examples/advanced/star-warp', '/examples/advanced/star-warp'],
          },
          {
            to: '/8.x/examples?example=three_basic-integration',
            from: ['/8.x/examples/advanced/three-and-pixi', '/examples/advanced/three-and-pixi'],
          },
          {
            to: '/8.x/examples?example=mesh_mouse-trail',
            from: ['/8.x/examples/advanced/mouse-trail', '/examples/advanced/mouse-trail'],
          },
          {
            to: '/8.x/examples?example=misc_screen-shot',
            from: ['/8.x/examples/advanced/screen-shot', '/examples/advanced/screen-shot'],
          },
          {
            to: '/8.x/examples?example=misc_physics_aabb',
            from: ['/8.x/examples/advanced/collision-detection', '/examples/advanced/collision-detection'],
          },
          {
            to: '/8.x/examples?example=misc_spinners',
            from: ['/8.x/examples/advanced/spinners', '/examples/advanced/spinners'],
          },
          {
            to: '/8.x/examples?example=sprite_transform_rotation',
            from: ['/8.x/examples/sprite/basic', '/examples/sprite/basic'],
          },
          {
            to: '/8.x/examples?example=sprite_gif_animation_loading',
            from: ['/8.x/examples/sprite/gif', '/examples/sprite/gif'],
          },
          {
            to: '/8.x/examples?example=sprite_texture-swap',
            from: ['/8.x/examples/sprite/texture-swap', '/examples/sprite/texture-swap'],
          },
          {
            to: '/8.x/examples?example=animated-sprite_particles',
            from: ['/8.x/examples/sprite/animated-sprite-explosion', '/examples/sprite/animated-sprite-explosion'],
          },
          {
            to: '/8.x/examples?example=animated-sprite_spritesheet',
            from: ['/8.x/examples/sprite/animated-sprite-jet', '/examples/sprite/animated-sprite-jet'],
          },
          {
            to: '/8.x/examples?example=animated-sprite_animation',
            from: ['/8.x/examples/sprite/animated-sprite-speed', '/examples/sprite/animated-sprite-speed'],
          },
          {
            to: '/8.x/examples?example=tiling-sprite_transform_animation',
            from: ['/8.x/examples/sprite/tiling-sprite', '/examples/sprite/tiling-sprite'],
          },
          {
            to: '/8.x/examples?example=sprite_video_texture',
            from: ['/8.x/examples/sprite/video', '/examples/sprite/video'],
          },
          {
            to: '/8.x/examples?example=nine-slice-sprite_transform_anchor',
            from: ['/8.x/examples/sprite/nine-slice-sprite-anchor', '/examples/sprite/nine-slice-sprite-anchor'],
          },
          {
            to: '/8.x/examples?example=nine-slice-sprite_basic',
            from: ['/8.x/examples/sprite/nine-slice-sprite', '/examples/sprite/nine-slice-sprite'],
          },
          {
            to: '/8.x/examples?example=text_fill_gradient',
            from: ['/8.x/examples/text/pixi-text', '/examples/text/pixi-text'],
          },
          {
            to: '/8.x/examples?example=text_bitmap_word-wrap_break-words',
            from: ['/8.x/examples/text/bitmap-text-break', '/examples/text/bitmap-text-break'],
          },
          {
            to: '/8.x/examples?example=text_bitmap_xml',
            from: ['/8.x/examples/text/bitmap-text', '/examples/text/bitmap-text'],
          },
          {
            to: '/8.x/examples?example=text_bitmap_web-font_loading',
            from: ['/8.x/examples/text/from-font', '/examples/text/from-font'],
          },
          {
            to: '/8.x/examples?example=text_web-font_google',
            from: ['/8.x/examples/text/web-font', '/examples/text/web-font'],
          },
          {
            to: '/8.x/examples?example=text_filters_cartoon',
            from: ['/8.x/examples/text/text-filters', '/examples/text/text-filters'],
          },
          {
            to: '/8.x/examples?example=text_bitmap_split-text',
            from: ['/8.x/examples/text/text-split-bitmap-overlap', '/examples/text/text-split-bitmap-overlap'],
          },
          {
            to: '/8.x/examples?example=text_texture-style_scale-mode',
            from: ['/8.x/examples/text/text-texture-style', '/examples/text/text-texture-style'],
          },
          {
            to: '/8.x/examples?example=text_trim_bounds',
            from: ['/8.x/examples/text/text-trim', '/examples/text/text-trim'],
          },
          {
            to: '/8.x/examples?example=graphics_basic_shapes',
            from: ['/8.x/examples/graphics/simple', '/examples/graphics/simple'],
          },
          {
            to: '/8.x/examples?example=graphics_curves_arcs_holes_textures',
            from: ['/8.x/examples/graphics/advanced', '/examples/graphics/advanced'],
          },
          {
            to: '/8.x/examples?example=graphics_dynamic',
            from: ['/8.x/examples/graphics/dynamic', '/examples/graphics/dynamic'],
          },
          {
            to: '/8.x/examples?example=sprite_svg_custom-data',
            from: ['/8.x/examples/graphics/svg-texture-large', '/examples/graphics/svg-texture-large'],
          },
          {
            to: '/8.x/examples?example=sprite_svg',
            from: ['/8.x/examples/graphics/svg-texture', '/examples/graphics/svg-texture'],
          },
          {
            to: '/8.x/examples?example=graphics_svg_string-parsing',
            from: ['/8.x/examples/graphics/svg', '/examples/graphics/svg'],
          },
          {
            to: '/8.x/examples?example=graphics_svg_file',
            from: ['/8.x/examples/graphics/svg-load', '/examples/graphics/svg-load'],
          },
          {
            to: '/8.x/examples?example=graphics_texture-fill',
            from: ['/8.x/examples/graphics/texture', '/examples/graphics/texture'],
          },
          {
            to: '/8.x/examples?example=graphics_fill_stroke_gradient',
            from: ['/8.x/examples/graphics/fill-gradient', '/examples/graphics/fill-gradient'],
          },
          {
            to: '/8.x/examples?example=graphics_pixel-line_antialiasing',
            from: ['/8.x/examples/graphics/pixel-line', '/examples/graphics/pixel-line'],
          },
          {
            to: '/8.x/examples?example=rendering_render-layer',
            from: ['/8.x/examples/ordering/render-layer', '/examples/ordering/render-layer'],
          },
          {
            to: '/8.x/examples?example=events_click',
            from: ['/8.x/examples/events/click', '/examples/events/click'],
          },
          {
            to: '/8.x/examples?example=events_buttons',
            from: ['/8.x/examples/events/interactivity', '/examples/events/interactivity'],
          },
          {
            to: '/8.x/examples?example=events_dragging',
            from: ['/8.x/examples/events/dragging', '/examples/events/dragging'],
          },
          {
            to: '/8.x/examples?example=events_custom-pointer',
            from: ['/8.x/examples/events/custom-mouse-icon', '/examples/events/custom-mouse-icon'],
          },
          {
            to: '/8.x/examples?example=events_custom-hitarea',
            from: ['/8.x/examples/events/custom-hitarea', '/examples/events/custom-hitarea'],
          },
          {
            to: '/8.x/examples?example=events_order',
            from: ['/8.x/examples/events/logger', '/examples/events/logger'],
          },
          {
            to: '/8.x/examples?example=events_move',
            from: ['/8.x/examples/events/pointer-tracker', '/examples/events/pointer-tracker'],
          },
          {
            to: '/8.x/examples?example=events_slider',
            from: ['/8.x/examples/events/slider', '/examples/events/slider'],
          },
          {
            to: '/8.x/examples?example=graphics_mask_animation',
            from: ['/8.x/examples/masks/graphics', '/examples/masks/graphics'],
          },
          {
            to: '/8.x/examples?example=sprite_mask_animation',
            from: ['/8.x/examples/masks/sprite', '/examples/masks/sprite'],
          },
          {
            to: '/8.x/examples?example=container_mask_filters_blur',
            from: ['/8.x/examples/masks/filter', '/examples/masks/filter'],
          },
          {
            to: '/8.x/examples?example=container_inverse-mask',
            from: ['/8.x/examples/masks/inverse-mask', '/examples/masks/inverse-mask'],
          },
          {
            to: '/8.x/examples?example=filters_blur',
            from: ['/8.x/examples/filters-basic/blur', '/examples/filters-basic/blur'],
          },
          {
            to: '/8.x/examples?example=filters_color-matrix',
            from: ['/8.x/examples/filters-basic/color-matrix', '/examples/filters-basic/color-matrix'],
          },
          {
            to: '/8.x/examples?example=filters_displacement_interactive',
            from: [
              '/8.x/examples/filters-basic/displacement-map-crawlies',
              '/examples/filters-basic/displacement-map-crawlies',
            ],
          },
          {
            to: '/8.x/examples?example=filters_displacement',
            from: [
              '/8.x/examples/filters-basic/displacement-map-flag',
              '/examples/filters-basic/displacement-map-flag',
            ],
          },
          {
            to: '/8.x/examples?example=filters_custom_interactive_blending',
            from: ['/8.x/examples/filters-advanced/mouse-blending', '/examples/filters-advanced/mouse-blending'],
          },
          {
            to: '/8.x/examples?example=filters_custom-shader_glsl',
            from: ['/8.x/examples/filters-advanced/custom', '/examples/filters-advanced/custom'],
          },
          {
            to: '/8.x/examples?example=mesh_perspective_3d',
            from: ['/8.x/examples/mesh-and-shaders/perspective-mesh', '/examples/mesh-and-shaders/perspective-mesh'],
          },
          {
            to: '/8.x/examples?example=mesh_rope_textured',
            from: [
              '/8.x/examples/mesh-and-shaders/textured-mesh-basic',
              '/examples/mesh-and-shaders/textured-mesh-basic',
            ],
          },
          {
            to: '/8.x/examples?example=mesh_rope_texture_vertices',
            from: [
              '/8.x/examples/mesh-and-shaders/textured-mesh-advanced',
              '/examples/mesh-and-shaders/textured-mesh-advanced',
            ],
          },
          {
            to: '/8.x/examples?example=mesh_custom_shader_geometry',
            from: ['/8.x/examples/mesh-and-shaders/triangle', '/examples/mesh-and-shaders/triangle'],
          },
          {
            to: '/8.x/examples?example=mesh_custom_color_attributes',
            from: ['/8.x/examples/mesh-and-shaders/triangle-color', '/examples/mesh-and-shaders/triangle-color'],
          },
          {
            to: '/8.x/examples?example=mesh_custom_texture_uv',
            from: ['/8.x/examples/mesh-and-shaders/triangle-textured', '/examples/mesh-and-shaders/triangle-textured'],
          },
          {
            to: '/8.x/examples?example=mesh_shared-geometry',
            from: ['/8.x/examples/mesh-and-shaders/shared-geometry', '/examples/mesh-and-shaders/shared-geometry'],
          },
          {
            to: '/8.x/examples?example=mesh_shared-shader',
            from: ['/8.x/examples/mesh-and-shaders/shared-shader', '/examples/mesh-and-shaders/shared-shader'],
          },
          {
            to: '/8.x/examples?example=mesh_custom_instanced_geometry',
            from: [
              '/8.x/examples/mesh-and-shaders/instanced-geometry',
              '/examples/mesh-and-shaders/instanced-geometry',
            ],
          },
          {
            to: '/8.x/examples?example=mesh_shader-toy',
            from: ['/8.x/examples/mesh-and-shaders/shader-toy-mesh', '/examples/mesh-and-shaders/shader-toy-mesh'],
          },
          {
            to: '/8.x/examples?example=mesh_multipass_shader_effects',
            from: ['/8.x/examples/mesh-and-shaders/multipass-mesh', '/examples/mesh-and-shaders/multipass-mesh'],
          },
          {
            to: '/8.x/examples?example=rendering_texture_rotation',
            from: ['/8.x/examples/textures/texture-rotate', '/examples/textures/texture-rotate'],
          },
          {
            to: '/8.x/examples?example=rendering_render-texture_basic',
            from: ['/8.x/examples/textures/render-texture-basic', '/examples/textures/render-texture-basic'],
          },
          {
            to: '/8.x/examples?example=rendering_render-texture_buffer',
            from: ['/8.x/examples/textures/render-texture-advanced', '/examples/textures/render-texture-advanced'],
          },
          {
            to: '/8.x/examples?example=assets_promises',
            from: ['/8.x/examples/assets/promise', '/examples/assets/promise'],
          },
          {
            to: '/8.x/examples?example=assets_async',
            from: ['/8.x/examples/assets/async', '/examples/assets/async'],
          },
          {
            to: '/8.x/examples?example=assets_multi-loading',
            from: ['/8.x/examples/assets/multiple', '/examples/assets/multiple'],
          },
          {
            to: '/8.x/examples?example=assets_background-loading',
            from: ['/8.x/examples/assets/background', '/examples/assets/background'],
          },
          {
            to: '/8.x/examples?example=assets_manifest_bundles',
            from: ['/8.x/examples/assets/bundle', '/examples/assets/bundle'],
          },
          {
            to: '/8.x/examples?example=offscreen-canvas',
            from: ['/8.x/examples/offscreen-canvas/basic', '/examples/offscreen-canvas/basic'],
          },
          {
            to: '/8.x/examples',
            from: ['/examples/'],
          },
        ],

        createRedirects(existingPath: string) {
          if (existingPath.includes('/7.x')) return undefined;

          const pathsToRedirect = ['guides', 'tutorials', 'playground'];

          for (let i = 0; i < pathsToRedirect.length; i++) {
            const path = pathsToRedirect[i];

            if (existingPath.includes(`/${path}`)) {
              return [existingPath.replace(`/8.x/${path}`, `/${path}`)];
            }
          }

          if (existingPath.includes('/examples?example=')) {
            // send to /8.x/examples
            return [existingPath.replace('/examples?example=', '/8.x/examples?example=')];
          }
        },
      },
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        removeDefaultStemmer: true,
        highlightSearchTermsOnTargetPage: true,
        docsRouteBasePath: '/',
        explicitSearchResultPath: true,
        searchContextByPaths: [
          { label: 'Guides', path: '8.x/guides' },
          { label: 'Examples', path: '8.x/examples' },
          { label: 'Tutorials', path: '8.x/tutorials' },
          { label: 'Blog', path: 'blog' },
        ],
        useAllContextsWithNoSearchContext: true,
        docsPluginIdForPreferredVersion: 'current',
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      navbar: {
        logo: {
          alt: 'PixiJS',
          src: 'images/logo.svg',
        },
        items: [
          {
            type: 'dropdown',
            label: 'Docs',
            position: 'left',
            items: [
              {
                type: 'doc',
                docId: 'guides/getting-started/intro',
                label: 'Guides',
              },
              {
                type: 'doc',
                docId: 'tutorials/index',
                label: 'Tutorials',
              },
              {
                type: 'doc',
                docId: 'examples/index',
                label: 'Examples',
              },
              {
                to: '/llms',
                label: 'LLM Docs',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'API',
            position: 'left',
            items: [
              {
                label: 'v8.x',
                href: 'https://pixijs.download/release/docs/index.html',
              },
              {
                label: 'v7.x',
                href: 'https://pixijs.download/v7.x/docs/index.html',
              },
            ],
          },
          {
            type: 'doc',
            docId: 'playground/index',
            label: 'Playground',
            position: 'left',
          },
          {
            to: 'showcase',
            label: 'Showcase',
            position: 'left',
          },
          {
            type: 'dropdown',
            label: 'Ecosystem',
            position: 'left',
            items: [
              {
                type: 'html',
                value: 'Libraries',
                className: 'nav-section-heading',
              },
              {
                label: 'React',
                href: 'https://github.com/pixijs/pixi-react',
              },
              {
                label: 'Layout',
                href: 'https://github.com/pixijs/layout',
              },
              {
                label: 'Spine',
                href: 'https://esotericsoftware.com/spine-pixi',
              },
              {
                label: 'Filters',
                href: 'https://github.com/pixijs/filters',
              },
              {
                label: 'Sound',
                href: 'https://github.com/pixijs/sound',
              },
              {
                label: 'UI',
                href: 'https://github.com/pixijs/ui',
              },
              {
                type: 'html',
                value: 'Tools',
                className: 'nav-section-heading',
              },
              {
                label: 'DevTools',
                href: 'https://pixijs.io/devtools/',
              },
              {
                label: 'AssetPack',
                href: 'https://pixijs.io/assetpack/',
              },
              {
                label: 'Storybook',
                href: 'https://github.com/pixijs/storybook',
              },
              {
                label: 'Text Style Editor',
                href: 'https://text-style.pixijs.io/',
              },
              {
                type: 'html',
                value: 'Help',
                className: 'nav-section-heading',
              },
              {
                label: 'Discussions',
                href: 'https://github.com/pixijs/pixijs/discussions',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/CPTjeb28nH',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'About',
            position: 'left',
            items: [
              {
                label: 'Team',
                to: 'team',
              },
              {
                label: 'FAQ',
                to: 'faq',
              },
              {
                to: 'bug-bounty',
                label: 'Bug Bounty',
              },
              {
                label: 'Community Guide',
                href: 'https://github.com/pixijs/pixijs/blob/dev/.github/CONTRIBUTING.md',
              },
              {
                label: 'Code of Conduct',
                href: 'https://github.com/pixijs/pixijs/blob/dev/.github/CODE_OF_CONDUCT.md',
              },
              {
                to: 'branding',
                label: 'Branding',
              },
            ],
          },
          {
            to: 'blog',
            label: 'Blog',
            position: 'left',
          },
          {
            to: 'sponsor',
            label: 'Sponsor',
            position: 'left',
          },
          // {
          //   type: 'doc',
          //   label: 'Sponsor',
          //   docId: 'sponsor/index',
          // },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
            dropdownItemsAfter: [
              {
                to: '/versions',
                label: 'All versions',
              },
            ],
          },
          {
            href: 'https://twitter.com/pixijs',
            position: 'right',
            className: 'header-link header-twitter-link',
            'aria-label': 'Twitter account',
          },
          {
            href: 'https://discord.gg/CPTjeb28nH',
            position: 'right',
            className: 'header-link header-discord-link',
            'aria-label': 'Discord server',
          },
          {
            href: 'https://github.com/pixijs/pixijs',
            position: 'right',
            className: 'header-link header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        logo: {
          alt: 'PixiJS',
          src: 'images/logo.svg',
          width: 100,
        },

        copyright: `© ${new Date().getFullYear()} PixiJS.<br>A labour of love built by the <a href="/team">PixiJS team</a>.`,
      },
      image: 'images/ogimage.jpg',
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'diff', 'json'],
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    },
};

export default config;
