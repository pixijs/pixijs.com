import Link from '@docusaurus/Link';
import { useActiveDocContext, useDocsPreferredVersion } from '@docusaurus/plugin-content-docs/client';
import { useHistory } from '@docusaurus/router';
import { useEffect, useRef, useState } from 'react';
import Icon from '@site/src/components/ui/Icon';
import { usePackage } from '../package';
import Sheet from '../Sheet';
import styles from './Rail.module.scss';

import type { PackageId } from '@site/src/data/packages';
import type { KeyboardEvent } from 'react';

const MENU_KEYS: Record<string, (index: number, count: number) => number> = {
  ArrowDown: (index, count) => (index + 1) % count,
  ArrowUp: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (_index, count) => count - 1,
};

function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
  const move = MENU_KEYS[event.key];

  if (!move) return;
  event.preventDefault();
  const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role^="menuitem"]'));
  const index = items.indexOf(document.activeElement as HTMLElement);

  items[move(index, items.length)]?.focus();
}

interface VersionPillProps {
  /** `chip` is the mobile bar's "2D v8" */
  variant?: 'pill' | 'chip';
  className?: string;
}

/** The route's version (`v8`, `v7`, `beta`); its menu switches 2D versions in place, keeping the same doc */
export default function VersionPill({ variant = 'pill', className }: VersionPillProps) {
  const { pkg, versionName, version, def, packages } = usePackage();
  const { savePreferredVersionName } = useDocsPreferredVersion('default');
  const { alternateDocVersions } = useActiveDocContext('default');
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const groups: PackageId[] = pkg ? [pkg] : ['2d', '3d'];

  /* The compact rail stays expanded while its menu is open */
  useEffect(() => {
    button.current?.closest('aside')?.toggleAttribute('data-hold', open);
  }, [open]);

  const choose = (id: PackageId, name: string) => {
    setOpen(false);
    if (id === '2d') {
      savePreferredVersionName(name);
      if (name === versionName) return;
      history.push(alternateDocVersions[name]?.path ?? packages['2d'].versions[name].guides);
    } else if (pkg !== '3d') {
      history.push(packages['3d'].versions.current.guides);
    }
  };

  return (
    <>
      <button
        ref={button}
        type="button"
        className={className ?? styles.version}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${pkg ? def.name : 'PixiJS'} version ${version.label}, change version`}
        onClick={() => setOpen(true)}
        data-verify="version-pill"
      >
        {variant === 'chip' ? (
          <span>
            <b>{def.label}</b>
            {version.label}
            <Icon name="chevron-down" size={12} strokeWidth={2} />
          </span>
        ) : (
          <>
            {version.label}
            <Icon name="chevron-down" size={12} strokeWidth={2} />
          </>
        )}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} label="Versions" anchor={button}>
        <div className={styles.menu} role="menu" aria-label="Versions" onKeyDown={onMenuKeyDown}>
          {groups.map((id) => {
            const group = packages[id];
            const selected = id === '2d' ? (pkg === '3d' ? undefined : versionName) : 'current';

            return (
              <div key={id} className={styles.menuGroup} role="group" aria-label={group.name} data-package={id}>
                <div className={styles.label} aria-hidden="true">
                  <span className={styles.dot} />
                  {group.label}
                  <span className={styles.npm}>{group.npm}</span>
                </div>
                {Object.entries(group.versions).map(([name, target]) => (
                  <button
                    key={name}
                    type="button"
                    role="menuitemradio"
                    aria-checked={name === selected}
                    className={styles.menuItem}
                    onClick={() => choose(id, name)}
                  >
                    {id === '2d' ? `${target.label}.x` : target.label}
                    <small>{target.npm}</small>
                    {name === selected && <Icon name="check" size={16} strokeWidth={2} />}
                  </button>
                ))}
              </div>
            );
          })}
          {pkg !== '3d' && (
            <div className={styles.menuFoot}>
              <Link to="/versions" role="menuitem" className={styles.menuItem} onClick={() => setOpen(false)}>
                All versions
                <Icon name="arrow-right" size={14} strokeWidth={2} />
              </Link>
            </div>
          )}
        </div>
      </Sheet>
    </>
  );
}
