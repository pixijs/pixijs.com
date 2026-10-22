import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { ButtonRow } from '@site/src/components/ui/Button';
import WaveDivider from '@site/src/components/ui/WaveDivider';
import { motionAllowed, onMotionPause } from '@site/src/motion/pause';
import PauseMotionButton from '@site/src/motion/PauseMotionButton';
import { useHeadlineWave } from '@site/src/motion/useHeadlineWave';
import { savingData } from '../Hero/liveCanvas';
import { Logo } from '../Hero/Logo';
import { useScrollOut } from '../Hero/useScrollOut';
import styles, { NEBULON_CSS } from './styles';

import type { ReactNode } from 'react';

interface NebulonHeroProps {
  title: ReactNode;
  /** CTA buttons, laid out in a `ButtonRow` */
  actions?: ReactNode;
  /** Announcement chips under the buttons */
  chips?: ReactNode;
}

/** The old pixijs.com header scene; `static/header/index.html` shows its poster until it's posted 'resume' */
const SCENE = '/header/index.html';

/**
 * The `/2d` hero: production pixijs.com's header, the Nebulon scene of clouds and a nebula blob, under the PixiJS
 * logo. The frame loads once the page is idle and fades in on its poster; the scene itself only starts while the
 * hero is on screen and motion is allowed, so reduced motion, Save-Data and Pause motion keep the poster still.
 * A fine pointer steers the blob. Motion: the logo's jelly, the headline wave (M1/M2) and the scroll-out (M16).
 */
export default function NebulonHero({ title, actions, chips }: NebulonHeroProps) {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const [src, setSrc] = useState<string>();
  const [ready, setReady] = useState(false);
  const [sky, setSky] = useState(true);

  // The scene loads once the page is idle and the hero within half a screen, and unloads once it's a screen away,
  // back to the backdrop, so a scrolled page holds no more WebGL contexts than its own demos
  useEffect(() => {
    const root = section.current;

    if (!root) return undefined;
    let idle = false;
    let near = true;
    const load = () => {
      if (idle && near) setSrc(SCENE);
    };
    const onIdle = () => {
      idle = true;
      load();
    };
    const hasIdle = typeof requestIdleCallback === 'function';
    const id = hasIdle ? requestIdleCallback(onIdle, { timeout: 1000 }) : window.setTimeout(onIdle, 200);
    const approach = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        load();
      },
      { rootMargin: '50% 0px' },
    );
    const leave = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) return;
        setSrc(undefined);
        setReady(false);
      },
      { rootMargin: '100% 0px' },
    );
    const view = new IntersectionObserver(([entry]) => setSky(entry.isIntersecting));

    approach.observe(root);
    leave.observe(root);
    view.observe(root);

    return () => {
      if (hasIdle) cancelIdleCallback(id);
      else window.clearTimeout(id);
      approach.disconnect();
      leave.disconnect();
      view.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = section.current;
    const scene = frame.current?.contentWindow;

    if (!ready || !root || !scene) return undefined;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const lite = savingData();
    let onScreen = false;
    let running = false;
    let pending = 0;

    const sync = () => {
      const run = onScreen && !document.hidden && motionAllowed() && !lite;

      if (run !== running) scene.postMessage(run ? 'resume' : 'pause', location.origin);
      running = run;
    };
    const point = (event: PointerEvent) => {
      if (!running || !fine.matches || pending) return;
      const { clientX, clientY } = event;

      pending = requestAnimationFrame(() => {
        const box = frame.current?.getBoundingClientRect();

        pending = 0;
        if (box) scene.postMessage({ type: 'pointer', x: clientX - box.left, y: clientY - box.top }, location.origin);
      });
    };
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    const stopPause = onMotionPause(sync);

    visibility.observe(root);
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    root.addEventListener('pointermove', point, { passive: true });

    return () => {
      visibility.disconnect();
      stopPause();
      reduced.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      root.removeEventListener('pointermove', point);
      cancelAnimationFrame(pending);
      scene.postMessage('pause', location.origin);
    };
  }, [ready]);

  useHeadlineWave(headline);
  useScrollOut(section, copy, `.${styles.frame}`, `.${styles.wave}`);

  return (
    <section ref={section} className={styles.root} data-sky={sky ? '' : undefined}>
      <style dangerouslySetInnerHTML={{ __html: NEBULON_CSS }} />
      <div className={styles.backdrop} aria-hidden="true">
        <iframe
          ref={frame}
          className={styles.frame}
          src={src}
          title="PixiJS Nebulon animation"
          tabIndex={-1}
          aria-hidden="true"
          data-ready={ready ? '' : undefined}
          onLoad={(event) => setReady(!!event.currentTarget.getAttribute('src'))}
        />
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={clsx(styles.copy, 'px-on-dark')}>
        <div ref={copy} className={styles.copyInner}>
          <div className={styles.mark}>
            <Logo className={styles.logo} />
          </div>
          <h1 ref={headline} className={styles.title}>
            {title}
          </h1>
          {actions && <ButtonRow className={styles.actions}>{actions}</ButtonRow>}
          {chips && <div className={styles.chips}>{chips}</div>}
        </div>
      </div>
      <PauseMotionButton glass className={clsx(styles.pause, 'px-on-dark')} />
      <WaveDivider from="hero" to="bg" variant="drift" className={styles.wave} />
    </section>
  );
}
