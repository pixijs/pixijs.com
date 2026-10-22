import useIsBrowser from '@docusaurus/useIsBrowser';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Icon from '@site/src/components/ui/Icon';
import styles from './styles.module.scss';

import type OriginalSearchBarType from '@theme-original/SearchBar';
import type { ComponentProps, RefObject } from 'react';

type Props = ComponentProps<typeof OriginalSearchBarType>;

// easyops's bar brings mark.js and its worker client; it loads after hydration instead of with main.js
const OriginalSearchBar = lazy(() => import('@theme-original/SearchBar'));

/**
 * If the dialog is already open when the bar arrives, its input takes over the placeholder's focus. It waits one
 * render: the bar sets its search context in an effect, and focus loads the index for whichever context it has.
 */
function FocusWhenOpen({ host }: { host: RefObject<HTMLDivElement | null> }) {
  const [settled, setSettled] = useState(false);

  useEffect(() => setSettled(true), []);
  useEffect(() => {
    if (settled && host.current?.closest('dialog[open]')) host.current.querySelector('input')?.focus();
  }, [host, settled]);

  return null;
}

/**
 * The easyops search field restyled to live inside the shell's search dialog: a 56 px input with results flowing
 * below it rather than in a floating dropdown. A read-only look-alike stands in until the bar's chunk arrives.
 */
export default function SearchBar(props: Props) {
  const isBrowser = useIsBrowser();
  const host = useRef<HTMLDivElement>(null);
  const placeholder = (
    <div className={`navbar__search ${styles.placeholder}`}>
      <Icon name="search" size={18} className={styles.placeholderIcon} />
      <input className="navbar__search-input" placeholder="Search" aria-label="Search" readOnly />
    </div>
  );

  return (
    <div ref={host} className={styles.host}>
      {isBrowser ? (
        <Suspense fallback={placeholder}>
          <OriginalSearchBar {...props} />
          <FocusWhenOpen host={host} />
        </Suspense>
      ) : (
        placeholder
      )}
    </div>
  );
}
