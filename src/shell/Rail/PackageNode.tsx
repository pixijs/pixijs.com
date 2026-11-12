import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import Badge from '@site/src/components/ui/Badge';
import { Chevron, Group } from './Disclosure';
import NewTab, { external } from './NewTab';
import styles from './Rail.module.scss';

import type { PackageDef, PackageVersion } from '@site/src/data/packages';
import type { CSSProperties, MouseEvent } from 'react';

type Section = 'guides' | 'tutorials' | 'examples';

const SECTIONS: { key: Section; label: string }[] = [
  { key: 'guides', label: 'Guides' },
  { key: 'tutorials', label: 'Tutorials' },
  { key: 'examples', label: 'Examples' },
];

/** `/8.x/guides/getting-started/intro` -> `/8.x/guides` */
const sectionRoot = (href: string) => href.split('/').slice(0, 3).join('/');
const within = (pathname: string, root: string) => pathname === root || pathname.startsWith(`${root}/`);

interface PackageNodeProps {
  def: PackageDef;
  version: PackageVersion;
  /** The route's package (2D on global pages, as the version pill shows) */
  active: boolean;
  open: boolean;
  onToggle: () => void;
  /** Called instead of navigating when the reader picks the section the rail's drill-down already shows */
  onSection?: () => void;
  index: number;
}

/** A 2D or 3D row: the label links to the package home, the chevron shows its sections */
export default function PackageNode({ def, version, active, open, onToggle, onSection, index }: PackageNodeProps) {
  const { pathname } = useLocation();
  const id = `rail-pkg-${def.id}`;

  return (
    <li style={{ '--i': index } as CSSProperties} data-package={def.id}>
      <div className={styles.row} data-active={active || undefined} data-verify="rail-package">
        <Link to={def.home} className={styles.rowLink} aria-current={pathname === def.home ? 'page' : undefined}>
          <span className={styles.glyph}>
            <span className={styles.dot} />
          </span>
          <span className={styles.text}>{def.label}</span>
          {def.badge && <Badge className={styles.badge}>{def.badge}</Badge>}
        </Link>
        <Chevron id={id} open={open} label={`${def.name} sections`} onToggle={onToggle} />
      </div>
      <Group id={id} open={open}>
        {SECTIONS.map(({ key, label }) => {
          const here = within(pathname, sectionRoot(version[key]));
          const onClick =
            here && onSection
              ? (event: MouseEvent) => {
                  event.preventDefault();
                  onSection();
                }
              : undefined;

          return (
            <li key={key}>
              <Link to={version[key]} className={styles.sub} data-current={here || undefined} onClick={onClick}>
                {label}
              </Link>
            </li>
          );
        })}
        <li>
          {version.api ? (
            <Link to={version.api} className={styles.sub} {...external}>
              API
              <NewTab />
            </Link>
          ) : (
            <span className={styles.sub} aria-disabled="true">
              API <span className={styles.soon}>· soon</span>
            </span>
          )}
        </li>
      </Group>
    </li>
  );
}
