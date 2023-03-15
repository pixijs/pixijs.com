// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'PixiJS',
    tagline: 'Homepage still needs to be revamped',
    url: 'https://beta.pixijs.com',
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
    projectName: 'beta.pixijs.com', // Usually your repo name.
    trailingSlash: false,

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
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
                    versions: {
                        current: {
                            label: 'Dev',
                        },
                    },
                },
                blog: {
                    blogTitle: 'PixiJS News',
                    blogDescription: 'Latest news from the PixiJS team',
                    postsPerPage: 'ALL',
                    blogSidebarTitle: 'All posts',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.scss'),
                },
                googleAnalytics: {
                    trackingID: 'UA-80710473-1',
                },
            }),
        ],
    ],

    plugins: ['docusaurus-plugin-sass'],

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
                                docId: 'guides/index',
                                label: 'Guides',
                            },
                            {
                                label: 'Tutorial',
                                to: 'tutorial',
                            },
                            {
                                type: 'doc',
                                docId: 'examples/index',
                                label: 'Examples',
                            },
                        ],
                    },
                    {
                        type: 'doc',
                        docId: 'api/index',
                        label: 'API',
                        position: 'left',
                    },
                    {
                        to: 'playground',
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
                                label: 'Spine',
                                href: 'https://github.com/pixijs/spine',
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
                                label: 'Animate',
                                href: 'https://github.com/pixijs/animate',
                            },
                            {
                                label: 'Lights',
                                href: 'https://github.com/pixijs/lights',
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
                                label: 'AssetPack',
                                href: 'https://github.com/ehtick/pixijs-assetpack',
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
                                label: 'Customise v6',
                                href: 'https://pixijs.io/customize/',
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
                copyright: `© ${new Date().getFullYear()} PixiJS.<br>A labor of love built by Mat Groves <a href="https://twitter.com/doormat23">@doormat23</a> and the <a href="/team">PixiJS team</a>.`,
            },
            image: 'images/ogimage.png',
            announcementBar: {
                isCloseable: true,
                id: 'beta',
                content: 'Please note that this is a beta version of the site and some features may not work as expected.',
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
            colorMode: {
                defaultMode: 'light',
                disableSwitch: false,
                respectPrefersColorScheme: true,
            },
            algolia: {
                appId: 'JX6EBQCAGQ',
                apiKey: '2ac1220b913a281bcfeccdf628fa6e99',
                indexName: 'beta_pixijs',
                contextualSearch: false,
            },
        }),
};

module.exports = config;
