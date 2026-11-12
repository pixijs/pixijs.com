import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useIsomorphicLayoutEffect from '@docusaurus/useIsomorphicLayoutEffect';
import { useEffect, useRef } from 'react';
import Button from '@site/src/components/ui/Button';
import Icon from '@site/src/components/ui/Icon';
import { hrefOf, TOP_NAV } from '@site/src/data/navigation';
import { usePackage } from '../package';
import { useShell } from '../ShellProvider';
import MobileBar from './MobileBar';
import styles from './TopNav.module.scss';

import type { RefObject } from 'react';

/** The thumb slides to the hovered or focused link and back to the current one; CSS does the motion */
function usePillThumb(nav: RefObject<HTMLElement | null>, pathname: string) {
  useIsomorphicLayoutEffect(() => {
    const el = nav.current;

    if (!el) return undefined;
    const place = (link: Element | null | undefined) => {
      if (!(link instanceof HTMLElement)) {
        el.style.setProperty('--o', '0');

        return;
      }
      const hidden = el.style.getPropertyValue('--o') !== '1';

      if (hidden) delete el.dataset.animate;
      el.style.setProperty('--x', `${link.offsetLeft}px`);
      el.style.setProperty('--w', `${link.offsetWidth}px`);
      el.style.setProperty('--o', '1');
      if (hidden) requestAnimationFrame(() => (el.dataset.animate = ''));
    };
    const home = () => place(el.querySelector('[aria-current="page"]'));
    const onOver = (event: Event) => place((event.target as Element).closest('a'));
    const onFocusOut = (event: FocusEvent) => {
      if (!el.contains(event.relatedTarget as Node | null)) home();
    };
    const observer = new ResizeObserver(home);

    home();
    observer.observe(el);
    void document.fonts?.ready.then(home);
    el.addEventListener('pointerover', onOver);
    el.addEventListener('focusin', onOver);
    el.addEventListener('pointerleave', home);
    el.addEventListener('focusout', onFocusOut);

    return () => {
      observer.disconnect();
      el.removeEventListener('pointerover', onOver);
      el.removeEventListener('focusin', onOver);
      el.removeEventListener('pointerleave', home);
      el.removeEventListener('focusout', onFocusOut);
    };
  }, [nav, pathname]);
}

/**
 * `data-scrolled` past 24 px (a sentinel and IntersectionObserver), and on docs pages `data-hidden` while scrolling
 * down. Both are attributes, so scrolling never re-renders React.
 */
function useScrollState(bar: RefObject<HTMLElement | null>, sentinel: RefObject<HTMLElement | null>, hide: boolean) {
  useEffect(() => {
    const el = bar.current;
    const mark = sentinel.current;

    if (!el || !mark) return undefined;
    const observer = new IntersectionObserver(([entry]) => el.toggleAttribute('data-scrolled', !entry.isIntersecting));

    observer.observe(mark);
    if (!hide) return () => observer.disconnect();
    let last = scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const delta = scrollY - last;

        if (Math.abs(delta) < 6) return;
        el.toggleAttribute('data-hidden', delta > 0 && scrollY > 120);
        last = scrollY;
      });
    };

    addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener('scroll', onScroll);
      el.removeAttribute('data-hidden');
    };
  }, [bar, sentinel, hide]);
}

/** Floating pill nav over the main column, the GitHub button, and the phone bar below 768 px */
export default function TopNav({ hideOnScroll }: { hideOnScroll: boolean }) {
  const { pathname } = useLocation();
  const { version, def } = usePackage();
  const { drawerOpen, setDrawerOpen } = useShell();
  const bar = useRef<HTMLElement>(null);
  const sentinel = useRef<HTMLSpanElement>(null);
  const pill = useRef<HTMLElement>(null);
  const logo = useBaseUrl('/images/logo.svg');

  usePillThumb(pill, pathname);
  useScrollState(bar, sentinel, hideOnScroll);

  return (
    <>
      <span ref={sentinel} className={styles.sentinel} aria-hidden="true" />
      {/* Docusaurus's TOC highlighter measures `.navbar` for its anchor offset */}
      <div className={`navbar ${styles.probe}`} aria-hidden="true" />
      <header ref={bar} className={styles.bar}>
        <div className={styles.inner}>
          <div className={styles.start}>
            <button
              type="button"
              className={styles.menu}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="pixi-rail"
              onClick={() => setDrawerOpen(true)}
            >
              <Icon name="menu" size={20} />
            </button>
            <Link to="/" className={styles.logo} aria-label="PixiJS home">
              <img src={logo} alt="" width={61} height={24} />
            </Link>
          </div>
          <nav ref={pill} className={styles.pill} aria-label="Main" data-verify="pill-nav">
            <span className={styles.thumb} aria-hidden="true" />
            {TOP_NAV.map((link) => (
              <Link
                key={link.label}
                to={hrefOf(link, version)}
                className={styles.link}
                aria-current={link.active.test(pathname) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className={styles.end}>
            <Button
              variant="github"
              icon="github"
              to={def.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={styles.github}
            >
              GitHub
            </Button>
          </div>
        </div>
        <MobileBar />
      </header>
    </>
  );
}
