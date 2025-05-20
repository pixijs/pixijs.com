// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const { themes } = require('prism-react-renderer');

const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'PixiJS',
    tagline: 'Homepage still needs to be revamped',
    url: 'https://pixijs.com',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'throw',
    favicon: 'images/favicon.png',

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
        // eslint-disable-next-line camelcase
        experimental_faster: true,
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
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
                    customCss: require.resolve('./src/css/custom.scss'),
                },
                gtag: {
                    trackingID: 'G-YXHQVRJ694',
                },
            }),
        ],
    ],

    plugins: [
        'docusaurus-plugin-sass',
        [
            '@docusaurus/plugin-client-redirects',
            {
                redirects: [
                    {
                        to: '/8.x/guides/getting-started/intro',
                        from: '/8.x/guides',
                    },
                    {
                        to: '/8.x/guides/getting-started/intro#what-is-pixijs',
                        from: '/8.x/guides/basics/what-pixijs-is',
                    },
                    {
                        to: '/8.x/guides/getting-started/intro#what-is-not-pixijs',
                        from: '/8.x/guides/basics/basics/what-pixijs-is-not',
                    },
                    {
                        to: '/8.x/guides/getting-started/quick-start',
                        from: '/8.x/guides/basics/getting-started',
                    },
                    {
                        to: '/8.x/guides/concepts/architecture',
                        from: '/8.x/guides/basics/architecture-overview',
                    },
                    {
                        to: '/8.x/guides/concepts/render-loop',
                        from: '/8.x/guides/basics/render-loop',
                    },
                    {
                        to: '/8.x/guides/concepts/scene-graph',
                        from: '/8.x/guides/basics/scene-graph',
                    },
                    {
                        to: '/8.x/guides/concepts/render-groups',
                        from: '/8.x/guides/advanced/render-groups',
                    },
                    {
                        to: '/8.x/guides/concepts/render-layers',
                        from: '/8.x/guides/advanced/render-layers',
                    },
                    {
                        to: '/8.x/guides/components/assets/svg',
                        from: '/8.x/guides/basics/svg',
                    },
                    {
                        to: '/8.x/guides/components/scene-objects/container/cache-as-texture',
                        from: '/8.x/guides/advanced/cache-as-texture',
                    },
                    {
                        to: '/8.x/guides/third-party/mixing-three-and-pixi',
                        from: '/8.x/guides/advanced/mixing-three-and-pixi',
                    },
                    {
                        to: '/8.x/guides/components/scene-objects/container',
                        from: '/8.x/guides/components/containers',
                    },
                    {
                        to: '/8.x/guides/components/scene-objects/graphics',
                        from: '/8.x/guides/components/graphics',
                    },
                    {
                        to: '/8.x/guides/components/scene-objects/graphics/graphics-pixel-line',
                        from: '/8.x/guides/components/graphics-pixel-line',
                    },
                    {
                        to: '/8.x/guides/components/scene-objects/graphics/graphics-fill',
                        from: '/8.x/guides/components/graphics-fill',
                    },
                    {
                        to: '/8.x/guides/components/events',
                        from: '/8.x/guides/components/interaction',
                    },
                    {
                        to: '/8.x/guides/components/scene-objects/sprite',
                        from: '/8.x/guides/components/sprites',
                    },
                    {
                        to: '/8.x/guides/components/scene-objects/text',
                        from: '/8.x/guides/components/text',
                    },
                    {
                        to: '/8.x/guides/components/assets',
                        from: '/8.x/guides/components/sprite-sheets',
                    },
                    {
                        to: '/8.x/guides/concepts/performance-tips',
                        from: '/8.x/guides/production/performance-tips',
                    },
                ],
                // eslint-disable-next-line consistent-return
                createRedirects(existingPath)
                {
                    if (existingPath.includes('/7.x')) return undefined;

                    const pathsToRedirect = ['guides', 'examples', 'tutorials', 'playground'];
                    const res = existingPath;

                    for (let i = 0; i < pathsToRedirect.length; i++)
                    {
                        const path = pathsToRedirect[i];

                        if (existingPath.includes(`/${path}`))
                        {
                            return [existingPath.replace(`/8.x/${path}`, `/${path}`)];
                        }
                    }
                },
            },
        ],
    ],

    themes: [
        [
            require.resolve('@easyops-cn/docusaurus-search-local'),
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
        ({
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
                                href: 'https://pixijs.io/pixi-text-style/#',
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
                                type: 'doc',
                                label: 'FAQ',
                                docId: 'faq',
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
                                type: 'doc',
                                label: 'Branding',
                                docId: 'branding',
                            },
                        ],
                    },
                    {
                        to: 'blog',
                        label: 'Blog',
                        position: 'left',
                    },
                    {
                        label: 'Sponsor',
                        position: 'left',
                        href: 'https://opencollective.com/pixijs',
                    },
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
                // eslint-disable-next-line max-len
                copyright: `© ${new Date().getFullYear()} PixiJS.<br>A labour of love built by the <a href="/team">PixiJS team</a>.`,
            },
            image: 'images/ogimage.png',
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
        }),
};

export default config;
