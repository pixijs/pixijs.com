import { useActivePluginAndVersion, useDocsPreferredVersion } from '@docusaurus/plugin-content-docs/client';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useMemo } from 'react';
import { getPackages } from '@site/src/data/packages';

import type { PackageDef, PackageId, PackageVersion, SiteCustomFields } from '@site/src/data/packages';

/**
 * The package a route belongs to, from its path alone: the default docs instance is mounted at `/`, so the active
 * docs plugin can't tell a 2D page from a global one.
 */
export function packageFromPath(pathname: string): PackageId | null {
  if (/^\/3d(\/|$)/.test(pathname)) return '3d';
  if (/^\/(2d|8\.x|7\.x)(\/|$)/.test(pathname)) return '2d';
  if (pathname === '/playground') return '2d';

  return null;
}

export function usePackages(): Record<PackageId, PackageDef> {
  const { customFields } = useDocusaurusContext().siteConfig;

  return useMemo(() => getPackages(customFields as unknown as SiteCustomFields), [customFields]);
}

export interface CurrentPackage {
  /** `null` on global pages */
  pkg: PackageId | null;
  /** Docs version name: `current` or `7.x` */
  versionName: string;
  version: PackageVersion;
  /** The current package, 2D on global pages */
  def: PackageDef;
  packages: Record<PackageId, PackageDef>;
}

/**
 * The route's package and docs version. 2D docs pages use their own version; other 2D and global pages use the
 * reader's preferred version, which is `null` until mount, so server and first client render agree.
 */
export function usePackage(): CurrentPackage {
  const { pathname } = useLocation();
  const packages = usePackages();
  const active = useActivePluginAndVersion();
  const { preferredVersion } = useDocsPreferredVersion('default');
  const pkg = packageFromPath(pathname);
  const def = packages[pkg ?? '2d'];
  let versionName = 'current';

  if (pkg !== '3d' && pathname !== '/playground') {
    const docsVersion = active?.activePlugin.pluginId === 'default' ? active.activeVersion?.name : undefined;

    versionName = docsVersion ?? preferredVersion?.name ?? 'current';
  }

  return { pkg, versionName, version: def.versions[versionName] ?? def.versions.current, def, packages };
}
