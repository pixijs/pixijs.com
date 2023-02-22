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
        'guides/basics/render-loop',
        'guides/basics/scene-graph',
      ]
    },
    {
      type: 'category',
      label: 'Components',
      collapsed: false,
      items: [
        'guides/components/assets',
        'guides/components/containers',
        'guides/components/display-object',
        'guides/components/graphics',
        'guides/components/interaction',
        'guides/components/sprites',
        'guides/components/sprite-sheets',
        'guides/components/text',
        'guides/components/textures',
      ]
    },
    {
      type: 'category',
      label: 'Production',
      collapsed: false,
      items: ['guides/production/performance-tips']
    }
  ],

  examplesSidebar: [
    { type: 'autogenerated', dirName: 'examples' }
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
