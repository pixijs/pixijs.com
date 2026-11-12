import { useHistory, useLocation } from '@docusaurus/router';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import useIsBrowser from '@docusaurus/useIsBrowser';
import useIsomorphicLayoutEffect from '@docusaurus/useIsomorphicLayoutEffect';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles, { ExamplesStyles } from './classes';
import { galleryCategories, getExample, searchExamples } from './data';
import ExampleSheet from './ExampleSheet';
import ExamplesNav from './ExamplesNav';
import ExampleView, { EditorSkeleton } from './ExampleView';
import GalleryCard from './GalleryCard';
import SearchField from './SearchField';
import Icon from '@site/src/components/ui/Icon';
import PackageSwitch from '@site/src/shell/PackageSwitch';
import { usePackages } from '@site/src/shell/package';

import type { Item } from './types';
import type { PackageId } from '@site/src/data/packages';
import type { MouseEvent } from 'react';

const LEDE: Record<PackageId, string> = {
  '2d': 'Small, complete programs for every part of the engine. Open one to edit the code and watch it run.',
  '3d': 'Scenes, models, materials and effects, each a complete program. Open one to edit the code and watch it run.',
};

/** How eagerly the card at `index` loads its preview: the first rows load at once, the very first ones first */
const eagerness = (index: number) => (index < 3 ? 'high' : index < 10);

/** Scrolls the gallery to a category's section, below the sticky bars */
function scrollToCategory(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });
}

/**
 * A package's example gallery (`/8.x/examples`, `/3d/examples`): preview cards by category, with search and, from
 * 1280 px, a sidebar of every example. `?example=<name>` opens one in the editor.
 */
export default function ExamplesPage({ pkg }: { pkg: PackageId }) {
  const { pathname, search, hash } = useLocation();
  const history = useHistory();
  const isBrowser = useIsBrowser();
  const packages = usePackages();
  const categories = useMemo(() => galleryCategories(pkg), [pkg]);
  const listed = useMemo(() => categories.flatMap(({ examples }) => examples), [categories]);
  const [query, setQuery] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const scroll = useRef(0);
  const name = isBrowser ? new URLSearchParams(search).get('example') : null;
  const example = name ? getExample(name, pkg) : undefined;
  const results = useMemo(() => searchExamples(listed, query), [listed, query]);
  const searching = query.trim() !== '';
  const shown = searching
    ? categories
        .map((category) => ({ ...category, examples: category.examples.filter((item) => results.includes(item)) }))
        .filter(({ examples }) => examples.length > 0)
    : categories;
  const index = example ? listed.indexOf(example) : -1;
  const hrefOf = (item: Item) =>
    `${item.pkg === pkg ? pathname : packages[item.pkg].versions.current.examples}?example=${encodeURIComponent(item.name)}`;
  const def = packages[pkg];
  const brokenLinks = useBrokenLinks();

  // The category sections are the targets of the sidebar's and the chips' `#<category>` links
  for (const { id } of categories) brokenLinks.collectAnchor(id);

  // On a `?example=` link the head script (docusaurus.config.ts) hid the server's gallery behind an editor frame. It
  // lifts two frames after hydration, once the sidebar has opened the example's category.
  useEffect(() => {
    if (!isBrowser) return undefined;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => delete document.documentElement.dataset.examplePending);
    });

    return () => cancelAnimationFrame(frame);
  }, [isBrowser]);

  // Back from an example lands where the gallery was left; Docusaurus scrolls to a hash itself
  useIsomorphicLayoutEffect(() => {
    if (example) return undefined;
    if (!hash && scroll.current) window.scrollTo(0, scroll.current);

    return () => {
      scroll.current = window.scrollY;
    };
  }, [example, hash]);

  const onCategory = (id: string, event: MouseEvent<HTMLAnchorElement>) => {
    if (example || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    setQuery('');
    history.replace({ pathname, hash: id });
    scrollToCategory(id);
  };

  return (
    <div className={styles.page} data-package={pkg}>
      <ExamplesStyles />
      <ExamplesNav
        categories={shown}
        total={listed.length}
        query={query}
        onQuery={setQuery}
        current={example}
        galleryPath={pathname}
        hrefOf={hrefOf}
        onCategory={onCategory}
      />
      <div className={styles.main}>
        {example ? (
          <ExampleView
            example={example}
            previous={listed[index - 1]}
            next={index >= 0 ? listed[index + 1] : undefined}
            galleryPath={pathname}
            hrefOf={hrefOf}
            onBrowse={() => setSheetOpen(true)}
          />
        ) : (
          <div className={styles.browse}>
            <header className={styles.browseHead}>
              <div className={styles.browseTitles}>
                <p className={styles.eyebrow}>
                  <span className={styles.dot} />
                  {def.label} · {pkg === '3d' ? def.versions.current.label : `v${def.versions.current.npm}`}
                </p>
                <h1 className={styles.browseTitle}>{pkg === '3d' ? 'PixiJS 3D examples' : 'PixiJS examples'}</h1>
                <p className={styles.lede}>{LEDE[pkg]}</p>
              </div>
              <PackageSwitch section="examples" />
            </header>
            {name && (
              <p className={styles.notice} role="status">
                <Icon name="info" size={16} />
                There&apos;s no {def.label} example called “{name}”. Pick one below.
              </p>
            )}
            <div className={styles.filters}>
              <SearchField value={query} onChange={setQuery} count={listed.length} />
              <nav className={styles.jump} aria-label="Categories">
                {shown.map(({ id, label, examples }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={styles.chip}
                    data-verify="example-category"
                    onClick={(event) => onCategory(id, event)}
                  >
                    {label}
                    <span className={styles.chipCount}>{examples.length}</span>
                  </a>
                ))}
              </nav>
            </div>
            {listed.length === 0 ? (
              <div className={styles.empty}>
                <Icon name="box" size={28} />
                <p className={styles.emptyTitle}>No examples in this build</p>
                <p>The {def.name} examples come from the pixi-3d repo, which this build couldn&apos;t reach.</p>
              </div>
            ) : searching && results.length === 0 ? (
              <div className={styles.empty} role="status">
                <Icon name="search" size={28} />
                <p className={styles.emptyTitle}>No examples match “{query}”</p>
                <p>Try a class like Sprite or Mesh3D, or a feature like mask, shadow or text.</p>
                <button type="button" className={styles.textButton} onClick={() => setQuery('')}>
                  Clear search
                </button>
              </div>
            ) : searching ? (
              <section className={styles.section} aria-label="Search results">
                <p className={styles.resultCount} role="status">
                  {results.length} {results.length === 1 ? 'example' : 'examples'} for “{query}”
                </p>
                <ul className={styles.grid}>
                  {results.map((item, at) => (
                    <li key={item.name}>
                      <GalleryCard item={item} to={hrefOf(item)} showCategory eager={eagerness(at)} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              categories.map((category) => (
                <section key={category.id} id={category.id} className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    {category.label}
                    <span className={styles.count}>{category.examples.length}</span>
                  </h2>
                  <ul className={styles.grid}>
                    {category.examples.map((item) => (
                      <li key={item.name}>
                        <GalleryCard item={item} to={hrefOf(item)} eager={eagerness(listed.indexOf(item))} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}
          </div>
        )}
        <div className={styles.pending}>
          <EditorSkeleton />
        </div>
      </div>
      <ExampleSheet open={sheetOpen} onClose={() => setSheetOpen(false)} pkg={pkg} current={example} hrefOf={hrefOf} />
    </div>
  );
}
