import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useCallback, useEffect, useRef } from 'react';
import Icon from '@site/src/components/ui/Icon';
import { DOCKED_MEDIA, inertOutside, lockScroll } from '../modal';
import { useShell } from '../ShellProvider';
import RootPanel from './RootPanel';
import SearchTrigger from './SearchTrigger';
import ThemeSegmented from './ThemeSegmented';
import VersionPill from './VersionPill';
import styles from './Rail.module.scss';

import type { ReactNode, RefObject } from 'react';

const SCROLL_KEY = 'pixi:rail:scroll';
const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

/**
 * Below 997 px the rail is a modal drawer: everything else goes inert, focus stays inside, Esc and the scrim close it,
 * and so does widening the window until the rail docks
 */
function useDrawer(rail: RefObject<HTMLElement | null>, open: boolean, close: () => void) {
  useEffect(() => {
    const el = rail.current;

    if (!open || !el) return undefined;
    const opener = document.activeElement as HTMLElement | null;
    const unlock = lockScroll();
    const restore = inertOutside(el.parentElement ?? el);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();

        return;
      }
      if (event.key !== 'Tab') return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (item) => item.offsetParent !== null && !item.closest('[inert]'),
      );
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    const docked = matchMedia(DOCKED_MEDIA);
    const onDocked = () => docked.matches && close();

    el.focus({ preventScroll: true });
    document.addEventListener('keydown', onKeyDown);
    docked.addEventListener('change', onDocked);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      docked.removeEventListener('change', onDocked);
      restore();
      unlock();
      opener?.focus({ preventScroll: true });
    };
  }, [rail, open, close]);
}

/** Keeps each panel's scroll position across page loads, and brings the current item into view */
function useScrollMemory(scroller: RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const el = scroller.current;

    if (!el) return undefined;
    let saved: Record<string, number> = {};

    try {
      saved = JSON.parse(sessionStorage.getItem(SCROLL_KEY) ?? '{}');
    } catch {
      /* storage blocked: start at the top */
    }
    if (saved[key] !== undefined) el.scrollTop = saved[key];
    // The last match is the doc itself; the section tabs above the tree are marked current too
    const current = Array.from(el.querySelectorAll<HTMLElement>('[aria-current="page"]')).pop();

    if (current) {
      const box = el.getBoundingClientRect();
      const item = current.getBoundingClientRect();

      if (item.top < box.top || item.bottom > box.bottom) el.scrollTop += item.top - box.top - box.height / 3;
    }
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        saved[key] = el.scrollTop;
        try {
          sessionStorage.setItem(SCROLL_KEY, JSON.stringify(saved));
        } catch {
          /* storage blocked */
        }
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
    };
  }, [scroller, key]);
}

/** Collapses or pins the rail; the stored choice beats the route default and is restored before first paint */
function PinButton() {
  const toggle = () => {
    const root = document.documentElement;
    const compact = root.dataset.rail ? root.dataset.rail === 'compact' : !!document.querySelector('[data-app-page]');
    const next = compact ? 'full' : 'compact';

    root.dataset.rail = next;
    try {
      localStorage.setItem('pixi:rail', next);
    } catch {
      /* storage blocked: the choice lasts for this page */
    }
  };

  return (
    <button type="button" className={`${styles.iconButton} ${styles.pin}`} onClick={toggle}>
      <span className={styles.pinCollapse}>
        <Icon name="panel-left-close" size={18} />
        <span className={styles.srOnly}>Collapse sidebar</span>
      </span>
      <span className={styles.pinExpand}>
        <Icon name="panel-left-open" size={18} />
        <span className={styles.srOnly}>Keep sidebar open</span>
      </span>
    </button>
  );
}

interface RailProps {
  /** Drill-down panel for routes with a tree: the doc sidebar or the blog's posts */
  section?: ReactNode;
}

/**
 * The site's left column: docked at 997 px and up (compact on app routes), a drawer below. One per page: `Layout`
 * renders it, except on docs routes where `DocRoot/Layout` does, because only it has the sidebar.
 */
export default function Rail({ section }: RailProps) {
  const { drawerOpen, setDrawerOpen, panel, setPanel } = useShell();
  const { pathname } = useLocation();
  const rail = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const showSection = Boolean(section) && panel === 'section';
  const logo = useBaseUrl('/images/logo.svg');
  const mark = useBaseUrl('/images/logo-p.svg');
  const close = useCallback(() => setDrawerOpen(false), [setDrawerOpen]);

  useDrawer(rail, drawerOpen, close);
  useScrollMemory(scroller, showSection ? `section:${pathname.split('/')[1]}` : 'root');

  useEffect(() => {
    const el = rail.current;

    if (el) requestAnimationFrame(() => (el.dataset.ready = ''));
  }, []);

  const switchPanel = (next: 'root' | 'section') => {
    moved.current = true;
    setPanel(next);
    scroller.current?.scrollTo({ top: 0 });
  };

  return (
    <div className={styles.root} data-open={drawerOpen || undefined}>
      <div className={styles.scrim} onClick={close} aria-hidden="true" />
      <aside
        ref={rail}
        id="pixi-rail"
        className={styles.rail}
        aria-label="Site"
        role={drawerOpen ? 'dialog' : undefined}
        aria-modal={drawerOpen || undefined}
        tabIndex={-1}
        data-verify="rail"
        data-panel={showSection ? 'section' : 'root'}
      >
        <div className={styles.head}>
          <div className={styles.top}>
            <Link to="/" className={styles.logo} aria-label="PixiJS home">
              <img className={styles.logoFull} src={logo} alt="" width={61} height={24} />
              <img className={styles.logoMark} src={mark} alt="" width={18} height={24} />
            </Link>
            <VersionPill />
            <button type="button" className={`${styles.iconButton} ${styles.close}`} onClick={close}>
              <Icon name="x" size={20} label="Close menu" />
            </button>
          </div>
          <SearchTrigger />
        </div>
        <div ref={scroller} className={styles.scroll}>
          {showSection ? (
            <div key="section" className={styles.panel} data-enter={moved.current ? 'right' : undefined}>
              <button type="button" className={styles.back} onClick={() => switchPanel('root')}>
                <Icon name="chevron-left" size={16} />
                All packages
              </button>
              {section}
            </div>
          ) : (
            <div key="root" className={styles.panel} data-enter={moved.current ? 'left' : undefined}>
              <RootPanel onSection={section ? () => switchPanel('section') : undefined} />
            </div>
          )}
        </div>
        <div className={styles.foot}>
          <ThemeSegmented />
          <PinButton />
        </div>
      </aside>
    </div>
  );
}
