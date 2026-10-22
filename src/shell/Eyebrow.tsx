import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import { useLocation } from '@docusaurus/router';
import { usePackage } from './package';
import styles from './Eyebrow.module.scss';

import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import type { ReactNode } from 'react';

/** Labels of the categories that lead to `pathname` (docs set `breadcrumbs: false`, so Docusaurus doesn't track them) */
function trail(items: PropSidebarItem[], pathname: string): string[] | null {
  for (const item of items) {
    if (item.type === 'link' && item.href === pathname) return [];
    if (item.type !== 'category') continue;
    if (item.href === pathname) return [item.label];
    const below = trail(item.items, pathname);

    if (below) return [item.label, ...below];
  }

  return null;
}

/** The eyebrow line: a dot in the package accent, then `children` */
export function EyebrowLabel({ pkg, children }: { pkg?: string; children: ReactNode }) {
  return (
    <p className={styles.eyebrow} data-package={pkg}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </p>
  );
}

/** `● 2D · GUIDES · CORE CONCEPTS` above a doc's title */
export default function Eyebrow() {
  const sidebar = useDocsSidebar();
  const { pathname } = useLocation();
  const { def, version, versionName } = usePackage();
  const section = /\/(guides|tutorials|examples)(\/|$)/.exec(pathname)?.[1];
  const category = sidebar ? trail(sidebar.items, pathname)?.[0] : undefined;
  const parts = [versionName === 'current' ? def.label : `${def.label} ${version.label}`, section, category];

  return <EyebrowLabel pkg={def.id}>{parts.filter(Boolean).join(' · ')}</EyebrowLabel>;
}
