import clsx from 'clsx';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Fuse from 'fuse.js';
import { Flip } from 'gsap/Flip';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import SHOWCASE_CSS from '!!raw-loader!sass-loader!./showcase.scss';
import MagneticButton from '@site/src/components/Home/MagneticButton';
import { Accent, Band, Closing } from '@site/src/components/Page';
import { pageClasses } from '@site/src/components/Page/classes';
import MotionPage, { ClayHeader } from '@site/src/components/Page/MotionPage';
import Button from '@site/src/components/ui/Button';
import Icon from '@site/src/components/ui/Icon';
import { showcaseItems } from '@site/src/data/showcase';
import { EASE, gsap, ScrollTrigger } from '@site/src/motion/gsap';
import { motionAllowed } from '@site/src/motion/pause';
import { useClayField } from '@site/src/motion/useClayField';
import ShowcaseWall from './_ShowcaseWall';

import type { ShowcaseItem, ShowcaseKind } from '@site/src/data/showcase';
import type { PointerEvent } from 'react';

if (ExecutionEnvironment.canUseDOM) gsap.registerPlugin(Flip);

const styles = pageClasses('showcase');

const SUBMIT_URL = 'https://form.jotform.com/251755678972071';

type Filter = 'all' | ShowcaseKind | 'open-source';

const FILTERS: { id: Filter; label: string; test: (item: ShowcaseItem) => boolean }[] = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'game', label: 'Games', test: (item) => item.kind === 'game' },
  { id: 'app', label: 'Apps & tools', test: (item) => item.kind === 'app' },
  { id: 'site', label: 'Websites', test: (item) => item.kind === 'site' },
  { id: 'open-source', label: 'Open source', test: (item) => !!item.openSourceLink },
];

const KIND_LABEL: Record<ShowcaseKind, string> = { game: 'Game', app: 'App', site: 'Website' };

/** Projects shown before "Show all", while nothing is filtered or searched for */
const PREVIEW = 12;

const sponsored = showcaseItems.filter((item) => item.sponsoredLink);
const unsponsored = showcaseItems.filter((item) => !item.sponsoredLink);
const COUNTS = Object.fromEntries(FILTERS.map(({ id, test }) => [id, showcaseItems.filter(test).length]));
const fuse = new Fuse(showcaseItems, { keys: ['title', 'author'], threshold: 0.3 });

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/** Moves the hover glow of the card under the pointer */
function onGridPointerMove(event: PointerEvent<HTMLElement>) {
  const card = (event.target as HTMLElement).closest<HTMLElement>('article');

  if (!card) return;
  const rect = card.getBoundingClientRect();

  card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  card.style.setProperty('--my', `${event.clientY - rect.top}px`);
}

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <img src={item.imageUrl} alt="" width={720} height={405} loading="lazy" decoding="async" />
        <span className={styles.visit} aria-hidden="true">
          Visit
          <Icon name="external" size={14} strokeWidth={2} />
        </span>
      </div>
      <div className={styles.body}>
        <h2 className={styles.name}>
          <a href={item.link} className={styles.link} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        </h2>
        <p className={styles.author}>{item.author}</p>
        <div className={styles.meta}>
          <span className={styles.kind} data-kind={item.kind}>
            {KIND_LABEL[item.kind]}
          </span>
          {item.openSourceLink && (
            <a
              href={item.openSourceLink}
              className={styles.tag}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.title} source code`}
            >
              <Icon name="github" size={12} />
              Source
            </a>
          )}
          {item.sponsoredLink && (
            <a
              href={item.sponsoredLink}
              className={clsx(styles.tag, styles.sponsored)}
              target="_blank"
              rel="noopener noreferrer sponsored"
            >
              Sponsored
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ShowcasePage() {
  const closing = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const flip = useRef<{ state: Flip.FlipState; height: number } | null>(null);
  // The server renders sponsored projects first, in data order; each visit then gets a fresh order
  const [order, setOrder] = useState<ShowcaseItem[]>(() => [...sponsored, ...unsponsored]);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  useClayField(closing);
  useEffect(() => setOrder([...shuffle(sponsored), ...shuffle(unsponsored)]), []);

  const search = query.trim();
  const collapsed = !expanded && filter === 'all' && !search;
  const shown = useMemo(() => {
    const test = FILTERS.find(({ id }) => id === filter)?.test ?? (() => true);
    const found = search ? new Set(fuse.search(search).map(({ item }) => item)) : null;
    const matches = order.filter((item) => test(item) && (!found || found.has(item)));

    return new Set(collapsed ? matches.slice(0, PREVIEW) : matches);
  }, [order, filter, search, collapsed]);

  /**
   * Records where every card is, so the grid can glide from there to the result of `apply`. Cards still waiting to
   * rise in are shown first: the scroll positions their entrances wait for are about to move.
   */
  const change = (apply: () => void) => {
    const root = grid.current;

    if (root && motionAllowed()) {
      gsap.set(root.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0, overwrite: true });
      flip.current = { state: Flip.getState(root.children), height: root.offsetHeight };
    }
    apply();
  };

  /*
   * The cards leave the flow while they glide, so the grid holds a height meanwhile: a shrinking one eases down to its
   * new height, so the band below follows; a growing one takes its new height at once, so the cards fading in never
   * run under that band
   */
  useLayoutEffect(() => {
    const root = grid.current;
    const from = flip.current;

    if (!root || !from) return;
    flip.current = null;
    // A glide still under way ends here, so the grid's own height can be measured
    Flip.killFlipsOf(root.children, true);
    gsap.killTweensOf(root);
    root.style.height = '';
    const timing = { duration: 0.6, ease: EASE.inOut };
    const height = root.offsetHeight;

    gsap.fromTo(root, { height: Math.max(height, from.height) }, { ...timing, height });
    Flip.from(from.state, {
      ...timing,
      absolute: true,
      onEnter: (cards) =>
        gsap.fromTo(cards, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.2 }),
      onLeave: (cards) => gsap.to(cards, { opacity: 0, scale: 0.9, duration: 0.3 }),
      onComplete: () => {
        root.style.height = '';
        ScrollTrigger.refresh();
      },
    });
  }, [shown]);

  const reset = () =>
    change(() => {
      setFilter('all');
      setQuery('');
    });

  return (
    <MotionPage css={SHOWCASE_CSS}>
      <ClayHeader
        className={styles.header}
        clay={['cube-violet', 'torus-pink']}
        backdrop={<ShowcaseWall />}
        eyebrow="Showcase"
        title={
          <>
            Made with <Accent>PixiJS</Accent>
          </>
        }
        lede="Games, apps and interactive sites from studios and developers around the world, all drawn with PixiJS."
        actions={
          <>
            <MagneticButton to={SUBMIT_URL} arrow>
              Submit your project
            </MagneticButton>
            <MagneticButton to="/8.x/guides/getting-started/intro" variant="outline" glass>
              Getting started
            </MagneticButton>
          </>
        }
        next="bg-alt"
      />

      <Band surface="bg-alt" id="projects" label="Projects" glow className={styles.projects}>
        <div className={styles.toolbar}>
          <div className={styles.search} role="search">
            <Icon name="search" size={18} className={styles.searchIcon} />
            <input
              ref={input}
              type="search"
              className={styles.input}
              placeholder="Search projects or studios"
              aria-label="Search projects"
              value={query}
              onChange={(event) => {
                const { value } = event.target;

                change(() => setQuery(value));
              }}
            />
            {query && (
              <button
                type="button"
                className={styles.clear}
                aria-label="Clear search"
                onClick={() => {
                  change(() => setQuery(''));
                  input.current?.focus();
                }}
              >
                <Icon name="x" size={16} strokeWidth={2} />
              </button>
            )}
          </div>
          <div className={styles.chips} role="group" aria-label="Filter projects">
            {FILTERS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={styles.chip}
                aria-pressed={filter === id}
                onClick={() => change(() => setFilter(id))}
              >
                {label}
                <span className={styles.count}>{COUNTS[id]}</span>
              </button>
            ))}
          </div>
        </div>

        <p className={styles.status} aria-live="polite">
          {shown.size === showcaseItems.length
            ? `${shown.size} projects`
            : `${shown.size} of ${showcaseItems.length} projects`}
        </p>

        <ul ref={grid} className={styles.grid} onPointerMove={onGridPointerMove}>
          {order.map((item, slot) => (
            // Keyed by slot: the shuffle after hydration swaps what each cell shows instead of moving cells, and the
            // order stays put after that, so Flip can follow each cell. Flip moves the cell, the reveal raises its
            // inside and hover lifts the card, each on its own element.
            <li key={slot} hidden={!shown.has(item)}>
              <div className={styles.cell} data-reveal="">
                <ShowcaseCard item={item} />
              </div>
            </li>
          ))}
        </ul>
        {collapsed && (
          <div className={styles.more}>
            <Button
              variant="outline"
              onClick={() => {
                change(() => setExpanded(true));
                requestAnimationFrame(() =>
                  grid.current?.children[PREVIEW]?.querySelector('a')?.focus({ preventScroll: true }),
                );
              }}
            >
              Show all {showcaseItems.length}
            </Button>
          </div>
        )}
        {shown.size === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <Icon name="search" size={22} />
            </span>
            <p>{search ? `Nothing matches “${search}” here.` : 'No projects here yet.'}</p>
            <Button variant="small" onClick={reset}>
              Clear search and filters
            </Button>
          </div>
        )}
      </Band>

      <Band edge="b">
        <Closing
          ref={closing}
          corners={{ tl: 'pyramid-cyan', tr: 'cube-pink', br: 'torus-pink', bl: 'sphere-violet' }}
          title="Built something with PixiJS?"
          lede="Send it in. We feature games, apps and sites that show what PixiJS can do."
          actions={
            <>
              <Button to={SUBMIT_URL} arrow>
                Submit your project
              </Button>
              <Button to="/8.x/examples" variant="outline">
                Explore examples
              </Button>
            </>
          }
        />
      </Band>
    </MotionPage>
  );
}
