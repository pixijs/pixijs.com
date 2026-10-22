import { EXTERNAL_PACKAGES } from './packages';

import type { IconName } from '@site/src/components/ui/Icon';
import type { PackageVersion } from './packages';

/** A link that follows the current package and version */
export type NavTarget = keyof Pick<PackageVersion, 'guides' | 'tutorials' | 'examples' | 'playground'>;

export interface NavLink {
  label: string;
  /** Internal route */
  to?: string;
  /** External URL, opens in a new tab */
  href?: string;
  target?: NavTarget;
  icon?: IconName;
  children?: NavLink[];
}

export interface TopNavLink extends NavLink {
  active: RegExp;
}

export const TOP_NAV: TopNavLink[] = [
  { label: 'Docs', target: 'guides', active: /^\/(8\.x|7\.x|3d)\/(guides|tutorials)(\/|$)/ },
  { label: 'Examples', target: 'examples', active: /^\/(8\.x|7\.x|3d)\/examples(\/|$)/ },
  { label: 'Playground', target: 'playground', active: /^\/(3d\/|7\.x\/)?playground(\/|$)/ },
  { label: 'Showcase', to: '/showcase', active: /^\/showcase(\/|$)/ },
  { label: 'Blog', to: '/blog', active: /^\/blog(\/|$)/ },
];

export const GITHUB = 'https://github.com/pixijs/pixijs';
export const CONTRIBUTING = `${GITHUB}/blob/dev/.github/CONTRIBUTING.md`;
export const DISCORD = 'https://discord.gg/CPTjeb28nH';
export const OPEN_COLLECTIVE = 'https://opencollective.com/pixijs';
export const GITHUB_SPONSORS = 'https://github.com/sponsors/pixijs';

export const SOCIAL: NavLink[] = [
  { label: 'Twitter', href: 'https://twitter.com/pixijs', icon: 'x-twitter' },
  { label: 'Discord', href: DISCORD, icon: 'discord' },
  { label: 'GitHub', href: GITHUB, icon: 'github' },
];

const ABOUT: NavLink[] = [
  { label: 'Team', to: '/team' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Branding', to: '/branding' },
  { label: 'Versions', to: '/versions' },
  { label: 'Community Guide', href: CONTRIBUTING },
  { label: 'Code of Conduct', href: `${GITHUB}/blob/dev/.github/CODE_OF_CONDUCT.md` },
];

export const RESOURCES: NavLink[] = [
  { label: 'AI', to: '/llms', icon: 'bot' },
  { label: 'Playground', target: 'playground', icon: 'play' },
  { label: 'Showcase', to: '/showcase', icon: 'sparkles' },
  { label: 'About', icon: 'info', children: ABOUT },
  { label: 'Blog', to: '/blog', icon: 'newspaper' },
  { label: 'Sponsor', to: '/sponsor', icon: 'heart' },
  ...SOCIAL,
];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: 'Packages',
    links: [
      { label: 'PixiJS 2D', to: '/2d' },
      { label: 'PixiJS 3D', to: '/3d' },
      ...EXTERNAL_PACKAGES.map(({ label, href }) => ({ label, href })),
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Guides', target: 'guides' },
      { label: 'Tutorials', target: 'tutorials' },
      { label: 'Examples', target: 'examples' },
      { label: 'Playground', target: 'playground' },
      { label: 'AI', to: '/llms' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Showcase', to: '/showcase' },
      { label: 'Blog', to: '/blog' },
      { label: 'Sponsor', to: '/sponsor' },
      ...SOCIAL,
    ],
  },
  { title: 'About', links: ABOUT },
];

/** Where a nav link points for the given package version */
export function hrefOf(link: NavLink, version: PackageVersion): string {
  return link.target ? version[link.target] : (link.to ?? link.href ?? '/');
}
