import Link from '@docusaurus/Link';
import { useEffect, useRef, useState } from 'react';
import styles from './classes';
import { titleOf } from './data';
import SearchField from './SearchField';
import Icon from '@site/src/components/ui/Icon';

import type { Category } from './data';
import type { Item } from './types';
import type { MouseEvent } from 'react';

interface ExamplesNavProps {
  categories: Category[];
  /** Every example the gallery lists, for the search placeholder */
  total: number;
  query: string;
  onQuery: (query: string) => void;
  current?: Item;
  galleryPath: string;
  hrefOf: (item: Item) => string;
  /** A category's heading was picked: jump to its section */
  onCategory: (id: string, event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * The gallery's sidebar from 1280 px: search, then every category as a disclosure over its examples. The current
 * example's category starts open, and a search opens every category with a match.
 */
export default function ExamplesNav(props: ExamplesNavProps) {
  const { categories, total, query, onQuery, current, galleryPath, hrefOf, onCategory } = props;
  const currentCategory = current && categories.find((category) => category.examples.includes(current))?.id;
  const [open, setOpen] = useState<Set<string>>(() => new Set(currentCategory ? [currentCategory] : []));
  const scroller = useRef<HTMLDivElement>(null);
  /** Categories whose links have rendered; a category's links render on its first opening and stay for the close */
  const opened = useRef(new Set<string>());
  const searching = query.trim() !== '';

  useEffect(() => {
    if (currentCategory) setOpen((ids) => (ids.has(currentCategory) ? ids : new Set(ids).add(currentCategory)));
  }, [currentCategory]);

  // Brings the current example into view when it changes
  useEffect(() => {
    const el = scroller.current;
    const item = el?.querySelector<HTMLElement>('[aria-current="page"]');

    if (!el || !item) return;
    const box = el.getBoundingClientRect();
    const row = item.getBoundingClientRect();

    if (row.top < box.top || row.bottom > box.bottom) el.scrollTop += row.top - box.top - box.height / 3;
  }, [current, open]);

  const toggle = (id: string) =>
    setOpen((ids) => {
      const next = new Set(ids);

      if (!next.delete(id)) next.add(id);

      return next;
    });

  return (
    <nav className={styles.nav} aria-label="Examples">
      <div className={styles.navHead}>
        <SearchField value={query} onChange={onQuery} count={total} />
      </div>
      <div ref={scroller} className={styles.navScroll}>
        <Link to={galleryPath} className={styles.navAll} aria-current={current ? undefined : 'page'}>
          <Icon name="layout-grid" size={16} />
          <span>All examples</span>
          <span className={styles.count}>{total}</span>
        </Link>
        {categories.length === 0 && <p className={styles.navEmpty}>Nothing matches “{query}”.</p>}
        <ul className={styles.tree}>
          {categories.map((category) => {
            const expanded = searching || open.has(category.id);

            if (expanded) opened.current.add(category.id);
            const listId = `examples-nav-${category.id}`;

            return (
              <li key={category.id} className={styles.treeItem}>
                <div className={styles.category} data-current={category.id === currentCategory ? '' : undefined}>
                  <Link
                    to={`${galleryPath}#${category.id}`}
                    className={styles.categoryLink}
                    data-verify="example-category"
                    onClick={(event) => onCategory(category.id, event)}
                  >
                    {category.label}
                    <span className={styles.count}>{category.examples.length}</span>
                  </Link>
                  <button
                    type="button"
                    className={styles.categoryToggle}
                    aria-label={`${category.label} examples`}
                    aria-expanded={expanded}
                    aria-controls={listId}
                    disabled={searching}
                    onClick={() => toggle(category.id)}
                  >
                    <Icon name="chevron-down" size={14} />
                  </button>
                </div>
                <div
                  id={listId}
                  className={styles.group}
                  data-open={expanded ? '' : undefined}
                  inert={expanded ? undefined : true}
                >
                  {opened.current.has(category.id) && (
                    <ul>
                      {category.examples.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={hrefOf(item)}
                            className={styles.leaf}
                            aria-current={item === current ? 'page' : undefined}
                          >
                            {titleOf(item)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
