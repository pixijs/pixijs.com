// @ts-check
import guides from './src/data/generated/guides-sidebar.json';

/** @typedef {import('@docusaurus/plugin-content-docs').SidebarsConfig[string]} SidebarItems */

const pixi = /** @type {Record<'concepts' | 'components' | 'migrations', SidebarItems>} */ (guides);

/**
 * @param {string} label
 * @param {SidebarItems} items
 */
const section = (label, items) =>
  /** @type {const} */ ({ type: 'category', label, collapsed: false, collapsible: false, items });

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  guidesSidebar: [
    section('Getting Started', [
      'guides/getting-started/intro',
      'guides/getting-started/quick-start',
      'guides/getting-started/ecosystem',
    ]),
    section('Core Concepts', pixi.concepts),
    section('Components', pixi.components),
    section('Third Party Integrations', ['guides/third-party/mixing-three-and-pixi']),
    section('Migrations', pixi.migrations),
  ],
};

export default sidebars;
