// No `@ts-check` as in sidebars.js: a checkout that hasn't run `npm run generate:pixi-3d` has no JSON to check
import guides from './src/data/generated/guides-sidebar-3d.json';

const section = (label, items) => ({ type: 'category', label, collapsed: false, collapsible: false, items });

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Docusaurus rejects an empty category, and stub mode or a partly written pixi-3d leaves sections without guides
  guidesSidebar: [
    section('Getting Started', guides['getting-started']),
    section('Core Concepts', guides.concepts),
    section('Components', guides.components),
  ].filter((category) => category.items.length),
};

export default sidebars;
