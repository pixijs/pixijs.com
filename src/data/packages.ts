export type PackageId = '2d' | '3d';

/** pixi.js for the 7.x docs */
export const PIXI_V7_VERSION = '7.4.2';

/** `customFields` from `docusaurus.config.ts` */
export interface SiteCustomFields {
  pixiVersion: string;
  pixi3d: { version: string; status: 'beta' | 'public'; apiUrl: string | null };
}

export interface PackageVersion {
  /** Pill text */
  label: string;
  /** Full version, shown in the version menu */
  npm: string;
  guides: string;
  tutorials: string;
  examples: string;
  playground: string;
  /** `null` renders "API · soon", disabled */
  api: string | null;
}

export interface PackageDef {
  id: PackageId;
  label: '2D' | '3D';
  name: string;
  npm: 'pixi.js' | '@pixi/3d';
  badge?: 'NEW';
  home: string;
  github: string;
  /** Docs version name -> targets, newest first */
  versions: Record<string, PackageVersion>;
}

export interface ExternalPackage {
  label: string;
  /** Picks the dot colour `--px-pkg-<token>` */
  token: string;
  href: string;
}

export function getPackages({ pixiVersion, pixi3d }: SiteCustomFields): Record<PackageId, PackageDef> {
  return {
    '2d': {
      id: '2d',
      label: '2D',
      name: 'PixiJS',
      npm: 'pixi.js',
      home: '/2d',
      github: 'https://github.com/pixijs/pixijs',
      versions: {
        current: {
          label: 'v8',
          npm: pixiVersion,
          guides: '/8.x/guides/getting-started/intro',
          tutorials: '/8.x/tutorials',
          examples: '/8.x/examples',
          playground: '/playground',
          api: 'https://pixijs.download/release/docs/index.html',
        },
        '7.x': {
          label: 'v7',
          npm: PIXI_V7_VERSION,
          guides: '/7.x/guides',
          tutorials: '/7.x/tutorials',
          examples: '/7.x/examples',
          playground: '/7.x/playground',
          api: 'https://pixijs.download/v7.x/docs/index.html',
        },
      },
    },
    '3d': {
      id: '3d',
      label: '3D',
      name: 'PixiJS 3D',
      npm: '@pixi/3d',
      badge: 'NEW',
      home: '/3d',
      github: pixi3d.status === 'public' ? 'https://github.com/pixijs/pixi-3d' : 'https://github.com/pixijs/pixijs',
      versions: {
        current: {
          label: 'beta',
          npm: pixi3d.version,
          guides: '/3d/guides/getting-started/intro',
          tutorials: '/3d/tutorials',
          examples: '/3d/examples',
          playground: '/3d/playground',
          api: pixi3d.apiUrl,
        },
      },
    },
  };
}

/** The packages the footer lists after 2D and 3D */
export const EXTERNAL_PACKAGES: ExternalPackage[] = [
  { label: 'Filters', token: 'filters', href: 'https://github.com/pixijs/filters' },
  { label: 'React', token: 'react', href: 'https://react.pixijs.io/' },
  { label: 'Sound', token: 'sound', href: 'https://github.com/pixijs/sound' },
];

/** Every package besides 2D and 3D: the rail's "More packages", the homes' Ecosystem section and blog covers */
export const ECOSYSTEM_PACKAGES: ExternalPackage[] = [
  ...EXTERNAL_PACKAGES,
  { label: 'Spine', token: 'spine', href: 'https://esotericsoftware.com/spine-pixi' },
  { label: 'AssetPack', token: 'assetpack', href: 'https://pixijs.io/assetpack/' },
  { label: 'DevTools', token: 'devtools', href: 'https://pixijs.io/devtools/' },
  { label: 'CLI', token: 'cli', href: 'https://pixijs.io/create-pixi/' },
  { label: 'Layout', token: 'layout', href: 'https://layout.pixijs.io/' },
  { label: 'UI', token: 'ui', href: 'https://pixijs.io/ui/' },
];

export const PACKAGE_COUNT = 2 + ECOSYSTEM_PACKAGES.length;
