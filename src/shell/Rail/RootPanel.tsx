import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import Icon from '@site/src/components/ui/Icon';
import { hrefOf, RESOURCES } from '@site/src/data/navigation';
import { ECOSYSTEM_PACKAGES, PACKAGE_COUNT } from '@site/src/data/packages';
import { usePackage } from '../package';
import { Group, useOpenState } from './Disclosure';
import NewTab, { external } from './NewTab';
import PackageNode from './PackageNode';
import styles from './Rail.module.scss';

import type { NavLink } from '@site/src/data/navigation';
import type { PackageVersion } from '@site/src/data/packages';
import type { CSSProperties, ReactNode } from 'react';

interface DisclosureRowProps {
  id: string;
  label: string;
  icon: ReactNode;
  open: boolean;
  onToggle: () => void;
  muted?: boolean;
  index: number;
  children: ReactNode;
}

/** A row that only opens and closes its group: More packages, About */
function DisclosureRow({ id, label, icon, open, onToggle, muted, index, children }: DisclosureRowProps) {
  return (
    <li style={{ '--i': index } as CSSProperties}>
      <div className={styles.row}>
        <button
          type="button"
          className={`${styles.rowLink} ${muted ? styles.muted : ''}`}
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
        >
          <span className={styles.glyph}>{icon}</span>
          <span className={styles.text}>{label}</span>
          <span className={`${styles.chevron} ${styles.badge}`} aria-hidden="true">
            <Icon name="chevron-down" size={14} strokeWidth={2} className={styles.caret} />
          </span>
        </button>
      </div>
      <Group id={id} open={open}>
        {children}
      </Group>
    </li>
  );
}

function SubLink({ link, version }: { link: NavLink; version: PackageVersion }) {
  const { pathname } = useLocation();
  const to = hrefOf(link, version);

  return link.href ? (
    <a href={link.href} className={styles.sub} {...external}>
      {link.label}
      <NewTab />
    </a>
  ) : (
    <Link to={to} className={styles.sub} aria-current={pathname === to ? 'page' : undefined}>
      {link.label}
    </Link>
  );
}

function ResourceRow({ link, version, index }: { link: NavLink; version: PackageVersion; index: number }) {
  const { pathname } = useLocation();
  const to = hrefOf(link, version);
  const content = (
    <>
      <span className={styles.glyph}>{link.icon && <Icon name={link.icon} size={16} />}</span>
      <span className={styles.text}>{link.label}</span>
    </>
  );

  return (
    <li style={{ '--i': index } as CSSProperties}>
      <div className={styles.row} data-active={pathname === to || undefined}>
        {link.href ? (
          <a href={link.href} className={styles.rowLink} {...external}>
            {content}
            <NewTab />
          </a>
        ) : (
          <Link to={to} className={styles.rowLink} aria-current={pathname === to ? 'page' : undefined}>
            {content}
          </Link>
        )}
      </div>
    </li>
  );
}

/** Packages and resources: the rail on every page without a tree, and one step back from a tree */
export default function RootPanel({ onSection }: { onSection?: () => void }) {
  const { pathname } = useLocation();
  const current = usePackage();
  const { packages } = current;
  const aboutRoutes = RESOURCES.find((link) => link.children)?.children ?? [];
  // Both packages start open, whichever page this is; a reader's own toggles stick for the session
  const { isOpen, toggle } = useOpenState({
    '2d': true,
    '3d': true,
    about: aboutRoutes.some((link) => link.to === pathname),
  });
  const versionOf = (id: '2d' | '3d') => (current.def.id === id ? current.version : packages[id].versions.current);
  let index = 0;

  return (
    <nav aria-label="Packages and resources">
      <div className={styles.label}>
        <span>Packages</span>
        <span className={styles.count}>{PACKAGE_COUNT}</span>
      </div>
      <ul className={styles.list}>
        {(['2d', '3d'] as const).map((id) => (
          <PackageNode
            key={id}
            def={packages[id]}
            version={versionOf(id)}
            active={current.pkg === id}
            open={isOpen(id)}
            onToggle={() => toggle(id, !isOpen(id))}
            onSection={current.pkg === id ? onSection : undefined}
            index={index++}
          />
        ))}
        <DisclosureRow
          id="rail-more"
          label="More packages"
          icon={<Icon name="grid-plus" size={16} />}
          open={isOpen('more')}
          onToggle={() => toggle('more', !isOpen('more'))}
          muted
          index={index++}
        >
          {ECOSYSTEM_PACKAGES.map((pkg) => (
            <li key={pkg.token}>
              <a href={pkg.href} className={`${styles.sub} ${styles.subDot}`} data-package={pkg.token} {...external}>
                {pkg.label}
                <NewTab />
              </a>
            </li>
          ))}
        </DisclosureRow>
      </ul>
      <hr className={styles.divider} />
      <div className={styles.label}>
        <span>Resources</span>
      </div>
      <ul className={styles.list}>
        {RESOURCES.map((link) =>
          link.children ? (
            <DisclosureRow
              key={link.label}
              id="rail-about"
              label={link.label}
              icon={link.icon && <Icon name={link.icon} size={16} />}
              open={isOpen('about')}
              onToggle={() => toggle('about', !isOpen('about'))}
              index={index++}
            >
              {link.children.map((child) => (
                <li key={child.label}>
                  <SubLink link={child} version={current.version} />
                </li>
              ))}
            </DisclosureRow>
          ) : (
            <ResourceRow key={link.label} link={link} version={current.version} index={index++} />
          ),
        )}
      </ul>
    </nav>
  );
}
