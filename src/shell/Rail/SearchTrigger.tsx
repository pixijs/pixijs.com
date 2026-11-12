import { useEffect, useState } from 'react';
import Icon from '@site/src/components/ui/Icon';
import { usePackage } from '../package';
import { useShell } from '../ShellProvider';
import styles from './Rail.module.scss';

/** The platform's search shortcut, known only after mount: the server renders the Mac form */
export function useModKey(): string {
  const [key, setKey] = useState('⌘K');

  useEffect(() => {
    if (!/Mac|iPhone|iPad|iPod/.test(navigator.platform)) setKey('Ctrl K');
  }, []);

  return key;
}

/** A button styled as a search field; the shell owns the one ⌘K listener and the modal */
export default function SearchTrigger() {
  const { setSearchOpen, setDrawerOpen, railOwner } = useShell();
  const { pkg, def } = usePackage();
  const modKey = useModKey();
  const label = pkg && railOwner === 'docs' ? `Search ${def.label} docs` : 'Search';

  return (
    <button
      type="button"
      className={styles.search}
      onClick={() => {
        setDrawerOpen(false);
        setSearchOpen(true);
      }}
      aria-keyshortcuts="Meta+K Control+K /"
      data-verify="search-trigger"
    >
      <Icon name="search" size={15} strokeWidth={2} />
      <span>{label}</span>
      <kbd aria-hidden="true">{modKey}</kbd>
    </button>
  );
}
