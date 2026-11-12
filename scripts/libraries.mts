/**
 * The libraries the site publishes guides and examples for. `scripts/pixi-docs.mts` and `scripts/examples.mts`
 * take a package id as their first argument (default `2d`) and read everything library-specific from here. Each
 * library writes to its own folders, so a run for one never prunes the other's output. Paths are relative to the
 * site root unless a comment says they're relative to `repo`.
 */
export type PackageId = '2d' | '3d';

export interface Library {
  id: PackageId;
  /** Heading of the library's own `llms.txt` */
  name: string;
  /** The installed npm package whose version pins the checkout and everything else */
  pkg: 'pixi.js' | '@pixi/3d';
  /** Source checkout, kept by `npm run sync:repos` */
  repo: string;
  /** TypeDoc base URL for an installed version, or null while the API isn't hosted, so `{@link}` renders as code */
  api: (version: string) => string | null;
  /** Prefix of "Edit this page" links, followed by the doc's path in `<repo>/src`; null hides them */
  editUrl: string | null;
  docsDir: 'docs' | 'docs-3d';
  /** Where `<docsDir>/guides` is published */
  guidesPath: '/8.x/guides/' | '/3d/guides/';
  /** Folders of `<docsDir>/guides` that hold only generated files */
  generatedGuideDirs: string[];
  /**
   * Guides folder and sidebar section per TypeDoc category, for docs missing from `pages`; docs in any other
   * category are `components`
   */
  sections: Record<string, string>;
  /**
   * The URL contract: page path in `<docsDir>/guides` (no extension) per doc path in `<repo>/src`, so
   * `components/assets/index` is `<version>/guides/components/assets`. Moving a published page needs a client
   * redirect from its old URL.
   */
  pages: Record<string, string>;
  /** Literal fixes for upstream bugs, applied to a doc's raw body; an entry that no longer applies warns */
  patches: Record<string, [from: string, to: string][]>;
  sidebarFile: string;
  llmsFile: string;
  /** Appended to the `llms.txt` that TypeDoc publishes */
  llmsFooter?: string;
  /** Served folder for generated files that aren't pages */
  staticDir: 'static-pixi' | 'static-pixi-3d';
  examples: {
    /**
     * Gallery examples, relative to `repo`: scripts, and folders with an `index` script. `*.example.ts` files and
     * other folders aren't examples, and its `shared` folder holds code the examples share.
     */
    dir: string;
    /**
     * Folders published as a gallery example although their entry isn't `index`, by the name each is published
     * under. `file` is the entry relative to `dir`; its folder is the example, and that folder's own `package.json`
     * adds to `packageJson`. `patches` are literal replacements in the example's files; one that no longer applies
     * warns.
     */
    entries?: Record<string, { file: string; patches?: [from: string, to: string][] }>;
    /** The `package.json` whose dependencies and devDependencies give the versions of what examples import */
    packageJson: string;
    /** Assets the examples load, relative to `repo`, served at `/<publishedAssets>/` */
    assets: string;
    publishedAssets: string;
    /** The path the library's own playground serves `assets` at; examples' URLs under it load the published assets */
    localAssets?: string;
    /**
     * A module in `assets` (path relative to `repo`, without extension) whose functions turn a name into the URL of
     * a remote file. Each example gets a `manifest.js` with the URLs its own calls name instead.
     */
    manifest?: string;
    /**
     * Modules outside the examples that examples import (path relative to `repo`, without extension), and the code
     * each example gets in their place
     */
    stubs?: Record<string, string>;
    /** The site's own examples, which pixi's must not shadow. Like `dir`, its `shared` folder holds code they share. */
    siteDir?: string;
    /** Example files, served beside the pages; an item's `location` is relative to it */
    source: string;
    data: string;
    previews: string;
    /** Gallery examples that open only by name */
    hidden: Set<string>;
    /** Folders whose `<PixiExample>` tags for this library must name one of its examples */
    scanDocs: string[];
  };
  /** Upstream tutorials: `dir` relative to `repo`, step content and registry in `out`, one page each in `pages` */
  tutorials?: { dir: string; out: string; pages: string };
  /**
   * The upstream guides are still being written: a `pages` entry with no doc and a `<PixiExample>` naming a missing
   * example warn instead of throwing. Delete it once every guide in `pages` exists.
   */
  draft?: boolean;
}

export const LIBRARIES: Record<PackageId, Library> = {
  '2d': {
    id: '2d',
    name: 'PixiJS',
    pkg: 'pixi.js',
    repo: '.repos/pixijs',
    api: (version) => `https://pixijs.download/v${version}/docs/`,
    editUrl: 'https://github.com/pixijs/pixijs/edit/dev/src/',
    docsDir: 'docs',
    guidesPath: '/8.x/guides/',
    generatedGuideDirs: ['concepts', 'components', 'migrations', '_media'],
    sections: { 'core-concepts': 'concepts', migrations: 'migrations' },
    pages: {
      '__docs__/concepts/architecture.md': 'concepts/architecture',
      '__docs__/concepts/environments.md': 'concepts/environments',
      '__docs__/concepts/garbage-collection.md': 'concepts/garbage-collection',
      '__docs__/concepts/performance-tips.md': 'concepts/performance-tips',
      '__docs__/concepts/render-groups.md': 'concepts/render-groups',
      '__docs__/concepts/render-layers.mdx': 'concepts/render-layers',
      '__docs__/concepts/render-loop.md': 'concepts/render-loop',
      '__docs__/concepts/scene-graph.mdx': 'concepts/scene-graph',
      '__docs__/concepts/typescript.md': 'concepts/typescript',
      '__docs__/migrations/v5.md': 'migrations/v5',
      '__docs__/migrations/v6.md': 'migrations/v6',
      '__docs__/migrations/v7.md': 'migrations/v7',
      '__docs__/migrations/v8.md': 'migrations/v8',
      'accessibility/__docs__/accessibility.md': 'components/accessibility',
      'app/__docs__/app.md': 'components/application/index',
      'app/__docs__/ticker-plugin.md': 'components/application/ticker-plugin',
      'app/__docs__/resize-plugin.md': 'components/application/resize-plugin',
      'app/__docs__/culler-plugin.md': 'components/application/culler-plugin',
      'assets/__docs__/assets.md': 'components/assets/index',
      'assets/__docs__/resolver.md': 'components/assets/resolver',
      'assets/__docs__/manifest.md': 'components/assets/manifest',
      'assets/__docs__/background-loader.md': 'components/assets/background-loader',
      'assets/__docs__/compressed-textures.md': 'components/assets/compressed-textures',
      'assets/__docs__/svg.mdx': 'components/assets/svg',
      'color/__docs__/color.md': 'components/color',
      'environment/__docs__/environment.md': 'components/environment',
      'events/__docs__/events.md': 'components/events',
      'extensions/__docs__/extensions.md': 'components/extensions',
      'filters/__docs__/filters.md': 'components/filters',
      'maths/__docs__/math.md': 'components/math',
      'rendering/__docs__/rendering.md': 'components/renderers/index',
      'rendering/__docs__/textures.md': 'components/textures',
      'html-source/__docs__/html-source.md': 'components/renderers/html-source',
      'scene/__docs__/scene.md': 'components/scene-objects/index',
      'scene/__docs__/container/index.md': 'components/scene-objects/container/index',
      'scene/__docs__/container/cache-as-texture.md': 'components/scene-objects/container/cache-as-texture',
      'scene/__docs__/sprite.md': 'components/scene-objects/sprite',
      'scene/__docs__/nine-slice-sprite.md': 'components/scene-objects/nine-slice-sprite',
      'scene/__docs__/tiling-sprite.md': 'components/scene-objects/tiling-sprite',
      'scene/__docs__/graphics/index.md': 'components/scene-objects/graphics/index',
      'scene/__docs__/graphics/graphics-fill.md': 'components/scene-objects/graphics/graphics-fill',
      'scene/__docs__/graphics/graphics-pixel-line.mdx': 'components/scene-objects/graphics/graphics-pixel-line',
      'scene/__docs__/graphics/graphics-smooth.md': 'components/scene-objects/graphics/graphics-smooth',
      'scene/__docs__/text/index.md': 'components/scene-objects/text/index',
      'scene/__docs__/text/canvas.md': 'components/scene-objects/text/canvas',
      'scene/__docs__/text/bitmap.md': 'components/scene-objects/text/bitmap',
      'scene/__docs__/text/html.md': 'components/scene-objects/text/html',
      'scene/__docs__/text/style.md': 'components/scene-objects/text/style',
      'scene/__docs__/text/split-text.md': 'components/scene-objects/text/split-text',
      'scene/__docs__/mesh/index.md': 'components/scene-objects/mesh/index',
      'scene/__docs__/particle-container.md': 'components/scene-objects/particle-container',
      'gif/__docs__/scene-gif.md': 'components/gif',
      'ticker/__docs__/ticker.md': 'components/ticker',
      'utils/__docs__/utils.md': 'components/utils',
    },
    patches: {
      'scene/__docs__/scene.md': [['# Scene objects', '# Scene Objects']],
      '__docs__/migrations/v8.md': [
        ['## 1. Introduction\n', '## 1. Introduction {#introduction}\n'],
        ['## 2. Breaking Changes\n', '## 2. Breaking Changes {#breaking-changes}\n'],
        ['## 3. Deprecated Features\n', '## 3. Deprecated Features {#deprecated-features}\n'],
        ['## 4. Resources\n', '## 4. Resources {#resources}\n'],
      ],
    },
    sidebarFile: 'src/data/generated/guides-sidebar.json',
    llmsFile: 'static/llms.txt',
    llmsFooter: '\n## Other packages\n\n- [PixiJS 3D (beta)](https://pixijs.com/3d/llms.txt): guides for @pixi/3d\n',
    staticDir: 'static-pixi',
    examples: {
      dir: 'examples',
      packageJson: 'examples/package.json',
      assets: 'examples/assets',
      publishedAssets: 'assets',
      siteDir: 'blog/examples',
      source: 'static/examples/source',
      data: 'src/data/generated/examples.json',
      previews: 'static/examples/previews',
      hidden: new Set(['graphics_svg-export', 'sprite_mask-channel', 'html-source_interactive_form']),
      scanDocs: ['docs', 'blog'],
    },
  },
  '3d': {
    id: '3d',
    name: 'PixiJS 3D',
    pkg: '@pixi/3d',
    repo: '.repos/pixi-3d',
    api: (version) => `https://3d.pixijs.download/v${version}/docs/`,
    editUrl: null,
    docsDir: 'docs-3d',
    guidesPath: '/3d/guides/',
    generatedGuideDirs: ['getting-started', 'concepts', 'components', '_media'],
    sections: { 'getting-started': 'getting-started', 'core-concepts': 'concepts' },
    pages: {
      '__docs__/getting-started/introduction.md': 'getting-started/intro',
      '__docs__/getting-started/installation.md': 'getting-started/installation',
      '__docs__/getting-started/quick-start.md': 'getting-started/quick-start',
      '__docs__/getting-started/porting-from-threejs.md': 'getting-started/porting-from-threejs',
      '__docs__/concepts/view3d.md': 'concepts/view3d',
      '__docs__/concepts/scene-graph.md': 'concepts/scene-graph',
      '__docs__/concepts/rendering.md': 'concepts/rendering',
      '__docs__/concepts/webgl-and-webgpu.md': 'concepts/webgl-and-webgpu',
      '__docs__/concepts/performance.md': 'concepts/performance',
      '__docs__/concepts/resources.md': 'concepts/resources',
      'scene/__docs__/scene.md': 'components/scene-objects/index',
      'scene/__docs__/meshes.md': 'components/scene-objects/meshes/index',
      'geometry/__docs__/geometry.md': 'components/scene-objects/meshes/geometry',
      'scene/__docs__/sprite3d.md': 'components/scene-objects/sprite3d',
      'scene/__docs__/batched-mesh.md': 'components/scene-objects/batched-mesh',
      'scene/__docs__/cameras.md': 'components/scene-objects/cameras/index',
      'extras/__docs__/camera-controls.md': 'components/scene-objects/cameras/controls',
      'scene/__docs__/second-cameras.md': 'components/scene-objects/cameras/second-cameras',
      'scene/__docs__/lights.md': 'components/scene-objects/lights/index',
      'scene/__docs__/shadows.md': 'components/scene-objects/lights/shadows',
      'materials/__docs__/materials.md': 'components/materials/index',
      'materials/__docs__/pbr.md': 'components/materials/pbr',
      'materials/__docs__/physical.md': 'components/materials/physical',
      'extras/__docs__/custom-materials.md': 'components/materials/custom',
      'scene/__docs__/environment.md': 'components/environment',
      'assets/__docs__/models.md': 'components/models/index',
      'assets/__docs__/compression.md': 'components/models/compression',
      'animation/__docs__/animation.md': 'components/animation',
      'events/__docs__/interaction.md': 'components/interaction',
      'core/__docs__/container-texture.md': 'components/container-texture',
      'post-processing/__docs__/post-processing.md': 'components/post-processing/index',
      'post-processing/__docs__/custom-passes.md': 'components/post-processing/custom-passes',
      'extras/__docs__/particles.md': 'components/particles',
      'math/__docs__/math.md': 'components/math',
      'extras/__docs__/debugging.md': 'components/debugging',
    },
    patches: {},
    sidebarFile: 'src/data/generated/guides-sidebar-3d.json',
    llmsFile: 'static-pixi-3d/3d/llms.txt',
    staticDir: 'static-pixi-3d',
    examples: {
      dir: 'examples',
      entries: {
        // The playground's racing game, which the launch post embeds, without the playground's frame debugger
        game_racing: {
          file: 'racing/racing.example.ts',
          patches: [
            ["import { GraphDebugOverlay } from '@pixi/3d/extras';\n", ''],
            ['new GraphDebugOverlay({ view: () => view3d, renderer: app.renderer });\n\n', ''],
            // Firefox throws from getGamepads() in the editor's sandboxed frame, which stops the game
            [
              'navigator.getGamepads ? navigator.getGamepads() : []',
              "navigator.getGamepads && !navigator.userAgent.includes('Firefox') ? navigator.getGamepads() : []",
            ],
          ],
        },
      },
      packageJson: 'package.json',
      assets: 'examples/assets',
      publishedAssets: 'assets/3d',
      localAssets: '/test-assets/',
      manifest: 'examples/assets/manifest',
      stubs: {
        // The playground's renderer switch; the editor's renderer menu does that job here
        'playground/src/getPreference': "export const rendererPreference = 'webgpu';\n",
      },
      source: 'static-pixi-3d/examples/source/3d',
      data: 'src/data/generated/examples-3d.json',
      previews: 'static/examples/previews/3d',
      hidden: new Set(),
      scanDocs: ['docs-3d'],
    },
    tutorials: { dir: 'examples/tutorials', out: 'src/tutorials/generated-3d', pages: 'docs-3d/tutorials' },
  },
};

/**
 * The library for a package id from the command line
 * @param id - `2d` or `3d`; missing means `2d`
 */
export function getLibrary(id = '2d'): Library {
  if (!(id in LIBRARIES)) throw new Error(`Unknown package id ${id}: use ${Object.keys(LIBRARIES).join(' or ')}`);
  return LIBRARIES[id as PackageId];
}
