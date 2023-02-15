/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  guidesSidebar: [
    'guides/index',
    {
      type: 'category',
      label: 'Basics',
      collapsed: false,
      items: [
        'guides/basics/what-pixijs-is',
        'guides/basics/what-pixijs-is-not',
        'guides/basics/getting-started',
        'guides/basics/architecture-overview',
        'guides/basics/containers',
        'guides/basics/display-object',
        'guides/basics/textures',
        'guides/basics/graphics',
        'guides/basics/interaction',
        'guides/basics/render-loop',
        'guides/basics/scene-graph',
        'guides/basics/sprites',
        'guides/basics/sprite-sheets',
        'guides/basics/text',
        'guides/basics/assets'
      ]
    },
    {
      type: 'category',
      label: 'Production',
      items: ['guides/production/performance-tips']
    }
  ],

  examplesSidebar: [
    'examples/index',
    {
      type: 'category',
      label: 'Basic',
      items: [
        'examples/demos-basic/container',
        'examples/demos-basic/transparent-background',
        'examples/demos-basic/tinting',
        'examples/demos-basic/cacheasbitmap',
        'examples/demos-basic/particle-container',
        'examples/demos-basic/blendmodes',
        'examples/demos-basic/simpleplane'
      ]
    },
    {
      type: 'category',
      label: 'Sprite',
      items: [
        'examples/sprite/basic',
        'examples/sprite/texture-swap',
        'examples/sprite/animatedsprite-explosion',
        'examples/sprite/animatedsprite-jet',
        'examples/sprite/animatedsprite-animationspeed',
        'examples/sprite/tiling-sprite',
        'examples/sprite/video'
      ]
    },
    {
      type: 'category',
      label: 'Text',
      items: [
        'examples/text/text',
        'examples/text/bitmap-text',
        'examples/text/from-font',
        'examples/text/webfont'
      ]
    },
    {
      type: 'category',
      label: 'Graphics',
      items: [
        'examples/graphics/simple',
        'examples/graphics/advanced',
        'examples/graphics/dynamic'
      ]
    },
    {
      type: 'category',
      label: 'Events',
      items: [
        'examples/events/click',
        'examples/events/interactivity',
        'examples/events/dragging',
        'examples/events/custom-mouse-icon',
        'examples/events/custom-hitarea',
        'examples/events/pointer-tracker',
        'examples/events/slider',
        'examples/events/hit-testing-with-spatial-hash',
        'examples/events/nested-boundary-with-projection',
        'examples/events/logger'
      ]
    },
    {
      type: 'category',
      label: 'Masks',
      items: [
        'examples/masks/graphics',
        'examples/masks/sprite',
        'examples/masks/filter'
      ]
    },
    {
      type: 'category',
      label: 'Textures',
      items: [
        'examples/textures/texture-rotate',
        'examples/textures/render-texture-basic',
        'examples/textures/render-texture-advanced',
        'examples/textures/gradient-basic',
        'examples/textures/gradient-resource'
      ]
    },
    {
      type: 'category',
      label: 'Assets',
      items: [
        'examples/assets/promise',
        'examples/assets/async',
        'examples/assets/multiple',
        'examples/assets/background',
        'examples/assets/bundle'
      ]
    },
    {
      type: 'category',
      label: 'Offscreen Canvas',
      items: [
        'examples/offscreen-canvas/basic',
        'examples/offscreen-canvas/web-worker'
      ]
    },
    {
      type: 'category',
      label: 'Filters - Basic',
      items: [
        'examples/filters-basic/blur',
        'examples/filters-basic/color-matrix',
        'examples/filters-basic/displacement-map-crawlies',
        'examples/filters-basic/displacement-map-flag'
      ]
    },
    {
      type: 'category',
      label: 'Filters - Advanced',
      items: [
        'examples/filters-advanced/mouse-blending',
        'examples/filters-advanced/custom',
        'examples/filters-advanced/pixie-shadow-filter',
        'examples/filters-advanced/shadertoy-filter-rendertexture'
      ]
    },
    {
      type: 'category',
      label: 'Plugin Filters',
      items: ['examples/plugin-filters/outline']
    },
    {
      type: 'category',
      label: 'Advanced Demos',
      items: [
        'examples/demos-advanced/slots',
        'examples/demos-advanced/scratchcard',
        'examples/demos-advanced/mouse-trail',
        'examples/demos-advanced/star-warp',
        'examples/demos-advanced/screenshot',
        'examples/demos-advanced/collision-detection',
        'examples/demos-advanced/spinners'
      ]
    },
    {
      type: 'category',
      label: 'Mesh and Shaders',
      items: [
        'examples/mesh-and-shaders/textured-mesh-basic',
        'examples/mesh-and-shaders/textured-mesh-advanced',
        'examples/mesh-and-shaders/triangle',
        'examples/mesh-and-shaders/triangle-color',
        'examples/mesh-and-shaders/triangle-textured',
        'examples/mesh-and-shaders/uniforms',
        'examples/mesh-and-shaders/sharing-geometry',
        'examples/mesh-and-shaders/shared-shader',
        'examples/mesh-and-shaders/merging-geometry',
        'examples/mesh-and-shaders/interleaving-geometry',
        'examples/mesh-and-shaders/instanced-geometry',
        'examples/mesh-and-shaders/shadertoy-mesh',
        'examples/mesh-and-shaders/multipass-shader-generated-mesh'
      ]
    },
    {
      type: 'category',
      label: 'Plugin Spine',
      items: [
        'examples/plugin-spine/dragon',
        'examples/plugin-spine/goblins',
        'examples/plugin-spine/pixie',
        'examples/plugin-spine/spineboy',
        'examples/plugin-spine/spineboy-pro'
      ]
    },
    {
      type: 'category',
      label: 'Plugin Dragonbones',
      items: [
        'examples/plugin-dragonbones/robot',
        'examples/plugin-dragonbones/eyetracking'
      ]
    },
    {
      type: 'category',
      label: 'Plugin Heaven',
      items: [
        'examples/plugin-heaven/invert',
        'examples/plugin-heaven/polygon',
        'examples/plugin-heaven/decals',
        'examples/plugin-heaven/unity-add-blend',
        'examples/plugin-heaven/spineboy-pro'
      ]
    },
    {
      type: 'category',
      label: 'Plugin Projection',
      items: [
        'examples/plugin-projection/basic',
        'examples/plugin-projection/plane',
        'examples/plugin-projection/plane-tiling',
        'examples/plugin-projection/quad-homo',
        'examples/plugin-projection/quad-bi',
        'examples/plugin-projection/iso-basic',
        'examples/plugin-projection/camera-spine-layers',
        'examples/plugin-projection/cards',
        'examples/plugin-projection/runner',
        'examples/plugin-projection/bunny-pack'
      ]
    },
    {
      type: 'category',
      label: 'Plugin Layers',
      items: [
        'examples/plugin-layers/normals',
        'examples/plugin-layers/lighting',
        'examples/plugin-layers/zorder',
        'examples/plugin-layers/bringtotop',
        'examples/plugin-layers/normals-drag',
        'examples/plugin-layers/trail'
      ]
    },
    {
      type: 'category',
      label: 'Plugin Picture',
      items: [
        'examples/plugin-picture/blend-modes',
        'examples/plugin-picture/dissolve',
        'examples/plugin-picture/overlay',
        'examples/plugin-picture/displacement',
        'examples/plugin-picture/pixelate',
        'examples/plugin-picture/mask-blur'
      ]
    },
    {
      type: 'category',
      label: 'Plugin Graphics Smooth',
      items: [
        'examples/plugin-graphics-smooth/simple',
        'examples/plugin-graphics-smooth/join-cap',
        'examples/plugin-graphics-smooth/thin-square'
      ]
    },
    {
      type: 'category',
      label: 'GSAP2',
      items: [
        'examples/gsap2-interaction/gsap2-tick',
        'examples/gsap2-interaction/gsap2-random-draw',
        'examples/gsap2-interaction/gsap2-basic',
        'examples/gsap2-interaction/gsap2-filters',
        'examples/gsap2-interaction/gsap2-trail',
        'examples/gsap2-interaction/gsap2-tint'
      ]
    },
    {
      type: 'category',
      label: 'GSAP3',
      items: [
        'examples/gsap3-interaction/gsap3-tick',
        'examples/gsap3-interaction/gsap3-random-draw',
        'examples/gsap3-interaction/gsap3-basic',
        'examples/gsap3-interaction/gsap3-filters',
        'examples/gsap3-interaction/gsap3-trail',
        'examples/gsap3-interaction/gsap3-tint'
      ]
    },
    {
      type: 'category',
      label: 'Tilemaps',
      items: ['examples/tilemaps/basic']
    }
  ],

  apiSidebar: [
    { type: 'autogenerated', dirName: 'api' }
  ]

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
}

module.exports = sidebars
