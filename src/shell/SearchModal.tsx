import Link from '@docusaurus/Link';
import SearchBar from '@theme/SearchBar';
import { useEffect, useRef, useState } from 'react';
import Icon from '@site/src/components/ui/Icon';
import { lockScroll } from './modal';
import { usePackage } from './package';
import { useShell } from './ShellProvider';
import styles from './SearchModal.module.scss';

import type { FormEvent } from 'react';

/**
 * Centred search dialog around the easyops `SearchBar`, rendered with the page (closed) so its search context is
 * settled before the input takes focus; the index loads on first focus. 2D pages search 2D, 3D pages 3D, other pages
 * everything.
 */
export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useShell();
  const { pkg, def, version } = usePackage();
  const dialog = useRef<HTMLDialogElement>(null);
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const el = dialog.current;

    if (!el || searchOpen === el.open) return undefined;
    if (!searchOpen) {
      el.close();

      return undefined;
    }
    el.showModal();
    const frame = requestAnimationFrame(() => el.querySelector('input')?.focus());
    const unlock = lockScroll();

    return () => {
      cancelAnimationFrame(frame);
      unlock();
    };
  }, [searchOpen]);

  const scope = pkg ? def.name : 'all of PixiJS';
  const jumps = [
    { label: 'Getting started', to: version.guides },
    { label: 'Examples', to: version.examples },
    { label: 'Tutorials', to: version.tutorials },
    { label: 'Playground', to: version.playground },
  ];

  return (
    <dialog
      ref={dialog}
      className={styles.modal}
      aria-label="Search"
      data-verify="search-modal"
      onClose={() => setSearchOpen(false)}
      onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
      onInput={(event: FormEvent) => setEmpty(!(event.target as HTMLInputElement).value)}
    >
      <div className={styles.panel} data-empty={empty || undefined}>
        <div className={styles.field}>
          <SearchBar />
          <button
            type="button"
            className={styles.esc}
            aria-label="Close search"
            onClick={() => dialog.current?.close()}
          >
            <span className={styles.escKey}>esc</span>
            <Icon name="x" size={20} className={styles.escIcon} />
          </button>
        </div>
        {empty && (
          <div className={styles.empty}>
            <p className={styles.scope}>Searching {scope}</p>
            <ul className={styles.jumps}>
              {jumps.map((jump) => (
                <li key={jump.label}>
                  <Link to={jump.to} className={styles.jump} onClick={() => setSearchOpen(false)}>
                    {jump.label}
                    <Icon name="arrow-right" size={14} strokeWidth={2} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={styles.hints} aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </div>
    </dialog>
  );
}
