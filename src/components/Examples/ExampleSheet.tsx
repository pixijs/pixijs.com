import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './classes';
import { galleryCategories, searchExamples } from './data';
import GalleryCard from './GalleryCard';
import SearchField from './SearchField';
import Icon from '@site/src/components/ui/Icon';
import { usePackages } from '@site/src/shell/package';

import type { Item } from './types';
import type { PackageId } from '@site/src/data/packages';
import type { CSSProperties, MouseEvent } from 'react';

interface ExampleSheetProps {
  open: boolean;
  onClose: () => void;
  /** The package listed first */
  pkg: PackageId;
  current?: Item;
  /** Where a card goes; the sheet lists both packages */
  hrefOf: (item: Item) => string;
  /** Runs before a card navigates; `preventDefault()` stops it */
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>, item: Item) => void;
}

/**
 * The example picker: a modal sheet from the right (full screen on phones) with search, package and category chips,
 * and preview cards. The browser handles the top layer, Esc and focus; a click on the backdrop closes it.
 */
export default function ExampleSheet({ open, onClose, pkg, current, hrefOf, onNavigate }: ExampleSheetProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const packages = usePackages();
  const [listed, setListed] = useState(pkg);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const categories = useMemo(() => galleryCategories(listed), [listed]);
  const all = useMemo(() => categories.flatMap(({ examples }) => examples), [categories]);
  const pool = category ? (categories.find(({ id }) => id === category)?.examples ?? []) : all;
  const results = searchExamples(pool, query);

  useEffect(() => {
    const el = dialog.current;

    if (!el || open === el.open) return;
    if (open) {
      setListed(pkg);
      setCategory(null);
      el.showModal();
      if (matchMedia('(pointer: fine)').matches) search.current?.focus();
    } else {
      el.close();
    }
  }, [open, pkg]);

  return (
    <dialog
      ref={dialog}
      className={styles.sheet}
      aria-label="Examples"
      data-verify="example-sheet"
      data-package={listed}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      {open && (
        <div className={styles.sheetBody}>
          <header className={styles.sheetHead}>
            <p className={styles.sheetTitle}>Examples</p>
            <div className={styles.chipRow} role="group" aria-label="Package">
              {(['2d', '3d'] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  className={styles.chip}
                  data-package={id}
                  aria-pressed={id === listed}
                  onClick={() => {
                    setListed(id);
                    setCategory(null);
                  }}
                >
                  <span className={styles.dot} />
                  {packages[id].label}
                </button>
              ))}
            </div>
            <button type="button" className={styles.iconButton} aria-label="Close" onClick={onClose}>
              <Icon name="x" size={18} />
            </button>
          </header>
          <SearchField
            value={query}
            onChange={setQuery}
            count={all.length}
            inputRef={search}
            className={styles.sheetSearch}
          />
          <div className={styles.sheetCategories} role="group" aria-label="Category">
            {[{ id: null, label: 'All' }, ...categories].map(({ id, label }) => (
              <button
                key={id ?? ''}
                type="button"
                className={styles.chip}
                aria-pressed={category === id}
                onClick={() => setCategory(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className={styles.sheetScroll}>
            {results.length > 0 ? (
              <ul key={`${listed}:${category}`} className={styles.sheetGrid}>
                {results.map((item, index) => (
                  <li key={item.name} style={{ '--i': Math.min(index, 10) } as CSSProperties}>
                    <GalleryCard
                      item={item}
                      to={hrefOf(item)}
                      showCategory={!category}
                      eager={index < 6}
                      current={item === current}
                      onClick={(event) => {
                        onNavigate?.(event, item);
                        onClose();
                      }}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>
                {all.length
                  ? `Nothing matches “${query}”.`
                  : `The ${packages[listed].name} examples aren't in this build.`}
              </p>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
