import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import useIsomorphicLayoutEffect from '@docusaurus/useIsomorphicLayoutEffect';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../../../motion/gsap';
import { motionAllowed, onMotionPause } from '../../../motion/pause';
import Icon from '../../ui/Icon';
import SectionHead from '../../ui/SectionHead';
import Tag from '../../ui/Tag';
import CodeCard from './CodeCard';
import styles, { STAGE_CSS } from './styles';
import Tabs from './Tabs';
import { hasWebGL2 } from './webgl';

import type { StageScene, StageTheme } from './scenes/shared';
import type { StageDemoProps } from './types';

export type { StageDemoProps, StageTab } from './types';

type Status = 'idle' | 'loading' | 'live' | 'nowebgl' | 'error';

/** How long the auto tour rests on each tab: long enough to take in the scene and the first lines of its code */
const TOUR_MS = 4500;
const REDUCED = '(prefers-reduced-motion: reduce)';

/**
 * Header, tabs, a live scene card and its code (section 8.2). The scene module loads when the card is 600 px from
 * the viewport and runs only while it's on screen; until then, without WebGL and without JS, posters stand in. Tabs
 * fall back to anchors whose `:target` swaps the posters and the code.
 */
export default function StageDemo({
  eyebrow,
  title,
  lede,
  tabs,
  defaultTab,
  scene,
  anchor = 'tour',
  badge = 'ONE STAGE · ONE TICKER',
  links = [],
}: StageDemoProps) {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const live = useRef<StageScene | null>(null);
  const [active, setActive] = useState(defaultTab);
  /** Follows the tab until the live scene takes over, so posters it covers are never downloaded */
  const [posterTab, setPosterTab] = useState(defaultTab);
  const [status, setStatus] = useState<Status>('idle');
  const [tourStep, setTourStep] = useState<number | null>(null);
  const activeRef = useRef(defaultTab);
  const previous = useRef(defaultTab);
  const touched = useRef(false);
  const tourTimer = useRef(0);
  const { colorMode } = useColorMode();
  const theme = useRef<StageTheme>(colorMode);
  const { withBaseUrl } = useBaseUrlUtils();
  const { contextSafe } = useGSAP({ scope: root });
  const panelId = `${anchor}-panel`;
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];

  const stopTour = () => {
    touched.current = true;
    window.clearTimeout(tourTimer.current);
    setTourStep(null);
  };

  const select = (id: string) => {
    if (id === activeRef.current) return;
    activeRef.current = id;
    setActive(id);
    if (!live.current) {
      setPosterTab(id);

      return;
    }
    if (motionAllowed()) {
      live.current.setTab(id);

      return;
    }
    // Reduced motion: a 150 ms dip on the canvas instead of the transition (WAAPI, which the global reduced-motion
    // rule leaves alone), with the new pose rendered at its darkest point
    host.current?.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 150 });
    window.setTimeout(() => live.current?.setTab(id), 75);
  };

  // Mount: without JS the anchors' :target rules apply, so they're switched off once React is in charge
  useEffect(() => {
    const el = root.current;

    if (!el) return undefined;
    el.dataset.js = '';
    const fromHash = tabs.find((tab) => window.location.hash === `#${anchor}-${tab.id}`);

    if (fromHash) {
      touched.current = true;
      select(fromHash.id);
    }
    const stop = () => {
      if (!touched.current) stopTour();
    };

    el.addEventListener('pointerdown', stop);
    el.addEventListener('keydown', stop);
    el.addEventListener('focusin', stop);

    return () => {
      el.removeEventListener('pointerdown', stop);
      el.removeEventListener('keydown', stop);
      el.removeEventListener('focusin', stop);
      window.clearTimeout(tourTimer.current);
    };
  }, []);

  // The live scene (from the `scene` given at mount): loaded on approach, active while on screen and the page is visible
  useEffect(() => {
    const el = card.current;
    const mount = host.current;

    if (!el || !mount) return undefined;
    let disposed = false;
    let visible = false;
    let instance: StageScene | null = null;
    const sync = () => instance?.setActive(visible && !document.hidden);
    const onMotion = () => instance?.setMotion(motionAllowed());
    const reduced = window.matchMedia(REDUCED);
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        near.disconnect();
        if (!hasWebGL2()) {
          setStatus('nowebgl');

          return;
        }
        setStatus('loading');
        scene()
          .then(({ createScene }) =>
            createScene(mount, { theme: theme.current, tab: activeRef.current, motion: motionAllowed() }),
          )
          .then(
            (created) => {
              if (disposed) {
                created.destroy();

                return;
              }
              instance = created;
              live.current = created;
              created.setTab(activeRef.current);
              sync();
              setStatus('live');
            },
            (error: Error) => {
              if (disposed) return;
              if (error.name === 'NoWebGLError') {
                setStatus('nowebgl');

                return;
              }
              console.warn('StageDemo: the live scene failed to start; showing the posters instead.', error);
              setStatus('error');
            },
          );
      },
      { rootMargin: '600px 0px' },
    );
    const onScreen = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      sync();
    });

    near.observe(el);
    onScreen.observe(el);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', onMotion);
    const offPause = onMotionPause(onMotion);

    return () => {
      disposed = true;
      near.disconnect();
      onScreen.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', onMotion);
      offPause();
      instance?.destroy();
      live.current = null;
    };
  }, []);

  useEffect(() => {
    theme.current = colorMode;
    live.current?.setTheme(colorMode);
  }, [colorMode]);

  // Auto tour: once, when the card is first on screen and untouched, the default tab gets its turn, then every
  // other tab, ending back on the default. Any pointer, key or focus inside the section ends it for good (WCAG 2.2.2).
  const ready = status === 'live' || status === 'nowebgl' || status === 'error';

  useEffect(() => {
    const el = card.current;

    if (!el || !ready || touched.current) return undefined;
    const order = [...tabs.filter((tab) => tab.id !== defaultTab), tabs.find((tab) => tab.id === defaultTab)!];
    /** Step -1 is the default tab's own turn, before the tour leaves it */
    const step = (index: number) => {
      if (touched.current) return;
      if (!motionAllowed()) {
        stopTour();

        return;
      }
      if (index >= 0) select(order[index].id);
      if (index === order.length - 1) {
        touched.current = true;
        setTourStep(null);

        return;
      }
      setTourStep(index);
      tourTimer.current = window.setTimeout(() => step(index + 1), TOUR_MS);
    };
    const reveal = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        reveal.disconnect();
        if (touched.current || !motionAllowed()) return;
        step(-1);
      },
      { threshold: 0.85 },
    );

    reveal.observe(el);

    return () => reveal.disconnect();
  }, [ready, tabs, defaultTab]);

  // DOM side of a tab change: code lines out and in, new lines flagged, tags re-typed
  const animateTab = contextSafe((from: string, to: string) => {
    const el = root.current;

    if (!el) return;
    const panel = (id: string) => el.querySelector<HTMLElement>(`pre[data-tab="${id}"]`);
    const outgoing = panel(from);
    const incoming = panel(to);
    const scroller = incoming?.closest<HTMLElement>('[data-code-scroll]');

    if (!outgoing || !incoming) return;
    // A quick second switch cuts the first short: every other panel goes straight back to hidden and at rest
    gsap.killTweensOf(el.querySelectorAll('[data-line]'));
    el.querySelectorAll<HTMLElement>('pre[data-tab]').forEach((pre) => {
      if (pre === outgoing || pre === incoming) return;
      gsap.set(pre, { visibility: 'hidden' });
      gsap.set(pre.querySelectorAll('[data-line]'), { clearProps: 'all' });
    });
    if (scroller) scroller.scrollTop = 0;
    const known = new Set(Array.from(outgoing.querySelectorAll('[data-line]'), (line) => line.textContent?.trim()));
    const lines = Array.from(incoming.querySelectorAll<HTMLElement>('[data-line]'));
    const changed = lines.filter((line) => line.textContent?.trim() && !known.has(line.textContent.trim()));

    const leaving = Array.from(outgoing.querySelectorAll<HTMLElement>('[data-line]'));

    gsap.set(outgoing, { visibility: 'visible' });
    gsap.to(leaving, {
      y: -6,
      autoAlpha: 0,
      duration: 0.15,
      ease: 'power1.in',
      onComplete: () => {
        gsap.set(leaving, { clearProps: 'all' });
        gsap.set(outgoing, { visibility: 'hidden' });
      },
    });
    gsap.fromTo(
      lines,
      { y: 8, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out', stagger: 0.012, delay: 0.12, clearProps: 'transform' },
    );
    gsap.fromTo(changed, { '--bar': 1 }, { '--bar': 0, duration: 1.2, delay: 0.35, ease: 'power1.in' });

    const before = el.querySelector<HTMLElement>(`[data-pane="${from}"] [data-scramble]`)?.textContent ?? '';

    el.querySelectorAll<HTMLElement>(`[data-pane="${to}"] [data-scramble]`).forEach((label) => {
      const text = label.dataset.scramble ?? '';

      label.textContent = before;
      gsap.to(label, { duration: 0.5, scrambleText: { text, chars: 'upperCase', speed: 0.6 }, ease: 'none' });
    });
  });

  useIsomorphicLayoutEffect(() => {
    const from = previous.current;

    previous.current = active;
    if (from === active || typeof window === 'undefined' || !motionAllowed()) return;
    animateTab(from, active);
  }, [active]);

  const targets = tabs
    .map(({ id }) => {
      const on = `[data-stage="${anchor}"]:not([data-js]) #${anchor}-${id}:target ~`;

      return (
        `${on} * [data-pane]:not([data-pane="${id}"]){display:none!important}` +
        `${on} * [data-pane="${id}"]{display:var(--pane,block)!important}` +
        `${on} * pre[data-tab="${id}"]{visibility:visible!important}` +
        `${on} * pre[data-tab]:not([data-tab="${id}"]){visibility:hidden!important}` +
        `${on} * [role="tab"][data-tab="${id}"]{background:var(--px-pink-fill);color:#fff}` +
        `${on} * [role="tab"]:not([data-tab="${id}"]){background:none;color:var(--px-ink-2)}`
      );
    })
    .join('');

  return (
    <section
      ref={root}
      className={styles.demo}
      data-stage={anchor}
      data-status={status}
      aria-labelledby={`${anchor}-title`}
    >
      <style dangerouslySetInnerHTML={{ __html: STAGE_CSS + targets }} />
      {tabs.map((tab) => (
        <span key={tab.id} id={`${anchor}-${tab.id}`} className={styles.anchor} />
      ))}
      <SectionHead
        className={styles.head}
        layout="split"
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        id={`${anchor}-title`}
        control={
          <Tabs
            tabs={tabs}
            active={active}
            anchor={(id) => `${anchor}-${id}`}
            panelId={panelId}
            label="Scene"
            tourStep={tourStep}
            tourMs={TOUR_MS}
            onSelect={(id) => {
              stopTour();
              select(id);
            }}
          />
        }
      />
      <div id={panelId} className={styles.panel} role="tabpanel" aria-labelledby={`${anchor}-${active}-tab`}>
        <div className={styles.sceneColumn}>
          <div ref={card} className={styles.canvasCard}>
            <div className={styles.view} role="img" aria-label={current.ariaLabel}>
              {tabs.map((tab) => (
                <span key={tab.id} className={styles.posterSlot} data-pane={tab.id} hidden={tab.id !== posterTab}>
                  {(['dark', 'light'] as const).map((variant) => (
                    <img
                      key={variant}
                      className={styles.poster}
                      src={withBaseUrl(tab.poster[variant])}
                      width={1280}
                      height={960}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      data-variant={variant}
                    />
                  ))}
                </span>
              ))}
              <div ref={host} className={styles.canvasHost} />
            </div>
            <div className={styles.tags} aria-hidden="true">
              {tabs.map((tab) => (
                <span key={tab.id} className={styles.tagSlot} data-pane={tab.id} hidden={tab.id !== active}>
                  <Tag pkg={tab.pkg} className={styles.tag}>
                    <span data-scramble={tab.tag}>{tab.tag}</span>
                  </Tag>
                </span>
              ))}
              <Tag tone="accent" className={`${styles.tag} ${styles.badge}`}>
                {badge}
              </Tag>
            </div>
            {tabs.map(
              ({ id, credit }) =>
                credit && (
                  <Link key={id} to={credit.to} className={styles.credit} data-pane={id} hidden={id !== active}>
                    {credit.label}
                  </Link>
                ),
            )}
          </div>
        </div>
        <CodeCard tabs={tabs} active={active} />
      </div>
      <div className={styles.foot}>
        <p className={styles.hint}>
          <Icon name="hand" size={16} />
          {status === 'nowebgl' ? (
            <span>The live demo needs WebGL2.</span>
          ) : (
            tabs.map((tab) => (
              <span key={tab.id} data-pane={tab.id} hidden={tab.id !== active}>
                <span className={styles.fine}>{tab.hint.fine}</span>
                <span className={styles.coarse}>{tab.hint.coarse}</span>
              </span>
            ))
          )}
        </p>
        {links.length > 0 && (
          <nav className={styles.links} aria-label="Next steps">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className={styles.link}>
                {link.label}
                <Icon name="arrow-right" size={14} strokeWidth={2} />
              </Link>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
