import { FEATURES } from '@site/src/components/Home/content/features';
import { ECOSYSTEM_PACKAGES } from '@site/src/data/packages';

import type { IconName } from '@site/src/components/ui/Icon';

export interface SwatchGroup {
  title: string;
  note: string;
  /** Theme-independent tokens render one swatch instead of a light/dark pair */
  fixed?: boolean;
  tokens: string[];
}

export const PACKAGES: Array<[token: string, label: string]> = [
  ['2d', '2D'],
  ['3d', '3D'],
  ...ECOSYSTEM_PACKAGES.map(({ token, label }): [string, string] => [token, label]),
];

export const SWATCHES: SwatchGroup[] = [
  {
    title: 'Brand',
    note: 'Theme-independent. #e91e63 decorates; #d81b60 carries white text.',
    fixed: true,
    tokens: [
      'pink',
      'pink-fill',
      'pink-deep',
      'pink-hi',
      'violet',
      'violet-hi',
      'sky',
      'teal',
      'orange',
      'red',
      'amber',
    ],
  },
  {
    title: 'Surfaces',
    note: 'Ground under everything, then page, bands, rail, wells and raised popovers.',
    tokens: ['ground', 'bg', 'bg-alt', 'hero', 'hero-blob', 'rail', 'well', 'raised', 'field', 'active', 'hover'],
  },
  {
    title: 'Ink',
    note: 'Headings, docs prose, marketing body, labels, decoration; pink text and the focus ring.',
    tokens: ['ink', 'ink-prose', 'ink-2', 'ink-3', 'ink-4', 'accent-text', 'focus'],
  },
  {
    title: 'Lines and status',
    note: 'Hairlines and the band grid; admonition and state colours.',
    tokens: ['line', 'line-strong', 'grid-line', 'green', 'info', 'warn', 'danger'],
  },
  {
    title: 'Code',
    note: 'Kept in step with the Prism and Monaco themes.',
    tokens: ['code-bg', 'code-plain', 'code-kw', 'code-str', 'code-fn', 'code-num', 'code-com', 'code-punct'],
  },
  {
    title: 'Packages',
    note: 'Wayfinding only: rail dots, eyebrows, active bars. CTAs and links stay pink.',
    tokens: PACKAGES.map(([token]) => `pkg-${token}`),
  },
];

/** Section 5.6: foreground token (or literal colour) on background token, and the level it must reach */
export const CONTRAST: Array<{ label: string; fg: string; bg: string; large?: boolean }> = [
  { label: 'ink on bg', fg: 'ink', bg: 'bg' },
  { label: 'prose on bg', fg: 'ink-prose', bg: 'bg' },
  { label: 'ink-2 on bg', fg: 'ink-2', bg: 'bg' },
  { label: 'ink-3 on bg', fg: 'ink-3', bg: 'bg' },
  { label: 'ink-3 on rail', fg: 'ink-3', bg: 'rail' },
  { label: 'ink-3 on field', fg: 'ink-3', bg: 'field' },
  { label: 'accent-text on bg', fg: 'accent-text', bg: 'bg' },
  { label: 'white on pink-fill', fg: '#ffffff', bg: 'pink-fill' },
  { label: 'white on pink (large only)', fg: '#ffffff', bg: 'pink', large: true },
  { label: 'pink display accent', fg: 'pink', bg: 'bg', large: true },
  { label: 'code keyword', fg: 'code-kw', bg: 'code-bg' },
  { label: 'code string', fg: 'code-str', bg: 'code-bg' },
  { label: 'code function', fg: 'code-fn', bg: 'code-bg' },
  { label: 'code number', fg: 'code-num', bg: 'code-bg' },
  { label: 'code comment', fg: 'code-com', bg: 'code-bg' },
  { label: 'code plain', fg: 'code-plain', bg: 'code-bg' },
  { label: 'focus ring (3:1)', fg: 'focus', bg: 'bg', large: true },
];

export interface TypeStep {
  name: string;
  token?: string;
  range: string;
  spec: string;
  className: string;
  sample: string;
}

export const TYPE_SCALE: TypeStep[] = [
  {
    name: 'Display 1',
    token: '--px-text-display-1',
    range: '40 → 76',
    spec: 'Outfit 700 / 0.98 / −0.035em, balance',
    className: 'display1',
    sample: 'The HTML5 Creation Engine',
  },
  {
    name: 'Display 2',
    token: '--px-text-display-2',
    range: '34 → 56',
    spec: 'Outfit 700 / 1.02 / −0.03em',
    className: 'display2',
    sample: 'Sprites and meshes, on the same stage.',
  },
  {
    name: 'Display 3',
    token: '--px-text-display-3',
    range: '28 → 40',
    spec: 'Outfit 700 / 1.1 / −0.02em',
    className: 'display3',
    sample: 'Fast · Flexible · Free',
  },
  {
    name: 'Docs H1',
    token: '--px-text-h1',
    range: '32 → 44',
    spec: 'Outfit 600 / 1.1 / −0.025em',
    className: 'h1',
    sample: 'Scene graph',
  },
  {
    name: 'Docs H2',
    token: '--px-text-h2',
    range: '24 → 30',
    spec: 'Outfit 600 / 1.2 / −0.015em',
    className: 'h2',
    sample: 'Containers and transforms',
  },
  {
    name: 'Docs H3',
    token: '--px-text-h3',
    range: '19 → 22',
    spec: 'Outfit 600 / 1.3 / −0.01em',
    className: 'h3',
    sample: 'Local and global positions',
  },
  { name: 'Docs H4', range: '17', spec: 'Outfit 600 / 1.4', className: 'h4', sample: 'Culling off-screen objects' },
  {
    name: 'Lede',
    token: '--px-text-lede',
    range: '17 → 20',
    spec: 'Roboto 400 / 1.55, ink-2',
    className: 'lede',
    sample: 'Create beautiful games, apps and interactive digital content with the fastest 2D WebGPU/WebGL renderer.',
  },
  {
    name: 'Body, docs',
    range: '16',
    spec: 'Roboto 400 / 1.7, ink-prose',
    className: 'bodyDocs',
    sample:
      'Every scene object is a node in a tree. Moving, rotating or scaling a container applies to all of its children, so a whole character can turn with one property.',
  },
  {
    name: 'Body, marketing',
    range: '15.5',
    spec: 'Roboto 400 / 1.6, ink-2',
    className: 'bodyMarketing',
    sample: 'Friendly, feature-rich API lets PixiJS take care of the fundamentals whilst you focus on the experience.',
  },
  {
    name: 'Small, meta',
    range: '14',
    spec: 'Roboto 400 / 1.5, ink-3',
    className: 'small',
    sample: 'Updated 12 October 2026 · 6 min read',
  },
  {
    name: 'Nav, rail item',
    range: '15',
    spec: 'Outfit 500 / 1',
    className: 'nav',
    sample: 'Docs  Examples  Playground',
  },
  {
    name: 'Button',
    range: '15 (14 < 480)',
    spec: 'Outfit 600 / 1 / +0.06em, uppercase',
    className: 'buttonText',
    sample: 'Getting started',
  },
  {
    name: 'Feature title',
    range: '14',
    spec: 'Roboto 700 / 1.3 / +0.04em, uppercase',
    className: 'featureTitle',
    sample: 'Multi-touch interactivity',
  },
  {
    name: 'Rail label',
    range: '11',
    spec: 'Roboto 500 / 1 / +0.16em, uppercase, ink-3',
    className: 'railLabel',
    sample: 'Packages',
  },
  {
    name: 'Eyebrow',
    range: '12',
    spec: 'Roboto Mono 500 / 1 / +0.18em, uppercase, accent-text',
    className: 'eyebrow',
    sample: 'One engine, two dimensions',
  },
  {
    name: 'Badge, tag',
    range: '10-11',
    spec: 'Roboto Mono 700 / 500, +0.1-0.12em, uppercase',
    className: 'tagText',
    sample: 'Mesh3D + Sprite · one stage',
  },
];

/** Section 8.4.6: one icon per homepage feature */
export const FEATURE_ICONS: Array<[IconName, string]> = FEATURES.map(({ icon, title }) => [icon, title]);

export const BRAND_LOGOS = [
  'marvel',
  'redbull',
  'spotify',
  'youtube',
  'disney',
  'google',
  'bbc',
  'hbo',
  'lego',
  'adobe',
  'ubisoft',
  'toyota',
];
