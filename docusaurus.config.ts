import { Config } from '@docusaurus/types';
import type { ProcessBlogPostsFn } from '@docusaurus/plugin-content-blog';
import fs from 'fs';
import path from 'path';
import { LIBRARIES } from './scripts/libraries.mts';
import { pixiDark, pixiLight } from './src/theme/prism/pixi';

const readManifest = (name: string): { version: string; gitHead?: string } =>
  JSON.parse(fs.readFileSync(path.join(__dirname, 'node_modules', name, 'package.json'), 'utf8'));

const pixiVersion = readManifest('pixi.js').version;
const pixi3dPkg = readManifest('@pixi/3d');

const config: Config = {
  title: 'PixiJS',
  tagline: 'The HTML5 Creation Engine, now in 2D and 3D',
  url: 'https://pixijs.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',
  favicon: 'images/favicon.png',
  // Generated: `static-pixi` and `static-pixi-3d` by `npm run generate:pixi` and `generate:pixi-3d`,
  // `static-runtime` by `npm run generate:runtime`
  staticDirectories: ['static', 'static-pixi', 'static-pixi-3d', 'static-runtime'],
  markdown: {
    // `future.v4` turns these off from 3.10; content still uses HTML comments and `{#id}` headings.
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
    hooks: {
      onBrokenMarkdownLinks: 'throw',
      onBrokenMarkdownImages: 'throw',
    },
  },

  customFields: {
    pixiVersion,
    pixi3d: {
      version: pixi3dPkg.version,
      status: 'beta',
      apiUrl: LIBRARIES['3d'].api(pixi3dPkg.version, pixi3dPkg.gitHead),
    },
  },

  headTags: [
    {
      // The canvas before the stylesheet: dark or light with the system, as the theme itself starts
      tagName: 'meta',
      attributes: { name: 'color-scheme', content: 'dark light' },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/fonts/outfit-latin-wght.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/fonts/roboto-latin-wght.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
    },
    {
      // Before first paint: marks a gallery `?example=` link so CSS shows an editor frame instead of the server's
      // gallery (ExamplesPage clears it), and restores the pinned rail and paused motion
      tagName: 'script',
      attributes: {},
      innerHTML:
        "var d=document.documentElement;if(/\\/examples\\/?$/.test(location.pathname)&&/[?&]example=/.test(location.search))d.dataset.examplePending='';try{var r=localStorage.getItem('pixi:rail');if(r)d.dataset.rail=r;if(localStorage.getItem('pixi:motion')==='paused')d.dataset.motion='paused'}catch(e){}",
    },
  ],

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
    faster: {
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
          // The archive's props carry every post; only its metadata is shown, so drop the source text (RSS reads the
          // built HTML instead)
          processBlogPosts: (async ({ blogPosts }) =>
            blogPosts.map((post) => ({ ...post, content: '' }))) satisfies ProcessBlogPostsFn,
        },
        theme: {
          customCss: './src/css/custom.scss',
        },
        gtag: {
          trackingID: 'G-YXHQVRJ694',
        },
        sitemap: {
          ignorePatterns: ['/styleguide'],
        },
      },
    ],
  ],

  plugins: [
    './scripts/docusaurus-plugin-markdown-pages.ts',
    'docusaurus-plugin-sass',
    [
      '@docusaurus/plugin-content-docs',
      {
        id: '3d',
        path: 'docs-3d',
        routeBasePath: '3d',
        sidebarPath: './sidebars-3d.js',
        breadcrumbs: false,
        versions: { current: { label: 'beta', banner: 'none', badge: false } },
      },
    ],
    './scripts/docusaurus-plugin-redirects.ts',
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        removeDefaultStemmer: true,
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: '/',
        docsDir: ['docs', 'docs-3d'],
        searchContextByPaths: [
          { label: 'PixiJS 2D', path: '8.x' },
          { label: 'PixiJS 3D', path: '3d' },
        ],
        useAllContextsWithNoSearchContext: true,
        docsPluginIdForPreferredVersion: 'default',
        ignoreFiles: [/^blog\/(archive|authors)/],
        searchBarShortcut: false,
        searchBarShortcutHint: false,
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
        items: [],
      },
      // src/theme/Footer reads only the year from this
      footer: { copyright: String(new Date().getFullYear()) },
      image: 'images/ogimage.jpg',
      prism: {
        theme: pixiLight,
        darkTheme: pixiDark,
        additionalLanguages: ['bash', 'diff', 'json'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    },
};

export default config;
