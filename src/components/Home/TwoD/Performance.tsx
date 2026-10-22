import { useColorMode } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useEffect, useRef, useState } from 'react';
import Card from '@site/src/components/ui/Card';
import SectionHead from '@site/src/components/ui/SectionHead';
import Tag from '@site/src/components/ui/Tag';
import { gsap, ScrollTrigger } from '@site/src/motion/gsap';
import { motionAllowed, onMotionPause } from '@site/src/motion/pause';
import { useMotion } from '@site/src/motion/useMotion';
import { HEAD } from '../Band';
import { PERFORMANCE } from '../content/twoD';
import { hasWebGL2 } from '../StageDemo/webgl';
import { inlineCode } from '../inlineCode';
import styles from './styles';

import type { FieldStats, ParticleField } from './particles';

type Status = 'idle' | 'live' | 'off';

const THEMES = ['dark', 'light'] as const;
const COARSE = '(pointer: coarse)';

const format = (value: number, decimals: number) =>
  value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const readout = ({ count, fps }: FieldStats) =>
  [`${format(count, 0)} PARTICLES`, fps === null ? '' : `${fps} FPS`].filter(Boolean).join(' · ');

/**
 * "A million particles at 60 fps": the Bunnymark numbers, counting up as they scroll in, over a live field that finds
 * how many particles this device draws at full speed. The field's chunk loads on approach and runs only on screen,
 * growing out of the core as it starts, and is destroyed once it's well out of range; a still of it stands in without
 * JS or WebGL.
 */
export default function Performance() {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLSpanElement>(null);
  const live = useRef<ParticleField | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  /** What a tap on the field does, while it's moving */
  const [hint, setHint] = useState<string | null>(null);
  const { colorMode } = useColorMode();
  const theme = useRef(colorMode);
  const poster = useBaseUrl('/images/home/2d/particles');

  useEffect(() => {
    const el = card.current;
    const mount = host.current;

    if (!el || !mount) return undefined;
    let disposed = false;
    let visible = false;
    let inReach = false;
    let starting = false;
    const touch = window.matchMedia(COARSE).matches;
    const sync = () => live.current?.setActive(visible && !document.hidden);
    const onMotion = () => {
      setHint(motionAllowed() ? `${touch ? 'Tap' : 'Click'} to add more` : null);
      live.current?.setMotion(motionAllowed());
    };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const park = () => {
      if (!live.current) return;
      live.current.destroy();
      live.current = null;
      setStatus('idle');
    };
    const start = () => {
      if (live.current || starting) return;
      if (!hasWebGL2()) {
        near.disconnect();
        setStatus('off');

        return;
      }
      starting = true;
      import(/* webpackChunkName: "home-particles" */ './particles')
        .then(({ createField }) =>
          createField(mount, {
            theme: theme.current,
            motion: motionAllowed(),
            coarse: touch,
            onStats: (stats) => {
              if (hud.current) hud.current.textContent = readout(stats);
            },
          }),
        )
        .then(
          (field) => {
            starting = false;
            if (disposed || !inReach) {
              field.destroy();

              return;
            }
            live.current = field;
            sync();
            setStatus('live');
          },
          (error: Error) => {
            starting = false;
            if (disposed) return;
            near.disconnect();
            if (error.name !== 'NoWebGLError') console.warn('Performance: the live field failed to start.', error);
            setStatus('off');
          },
        );
    };
    // Made on approach and destroyed once twice as far away, freeing its WebGL context for the page's others
    const reach = new IntersectionObserver(
      ([entry]) => {
        inReach = !!entry?.isIntersecting;
        if (!inReach) park();
      },
      { rootMargin: '1200px 0px' },
    );
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
      },
      { rootMargin: '600px 0px' },
    );
    const onScreen = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      sync();
    });

    onMotion();
    root.current?.setAttribute('data-js', '');
    reach.observe(el);
    near.observe(el);
    onScreen.observe(el);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', onMotion);
    const offPause = onMotionPause(onMotion);

    return () => {
      disposed = true;
      reach.disconnect();
      near.disconnect();
      onScreen.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', onMotion);
      offPause();
      live.current?.destroy();
      live.current = null;
    };
  }, []);

  useEffect(() => {
    theme.current = colorMode;
    live.current?.setTheme(colorMode);
  }, [colorMode]);

  // Each number counts up from zero as its card scrolls in
  useMotion(root, (el, { paused }) => {
    if (paused) return undefined;
    const values = gsap.utils
      .toArray<HTMLElement>('[data-count]', el)
      .filter((value) => !ScrollTrigger.isInViewport(value, 0.2));

    values.forEach((value) => {
      const target = Number(value.dataset.count);
      const decimals = Number(value.dataset.decimals);
      const counter = { value: 0 };

      value.textContent = format(0, decimals);
      gsap.to(counter, {
        value: target,
        duration: 1.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: value, start: 'top 92%', once: true },
        onUpdate: () => (value.textContent = format(counter.value, decimals)),
      });
    });

    return () =>
      values.forEach(
        (value) => (value.textContent = format(Number(value.dataset.count), Number(value.dataset.decimals))),
      );
  });

  return (
    <div ref={root} className={styles.perf} data-status={status}>
      <SectionHead eyebrow={PERFORMANCE.eyebrow} title={PERFORMANCE.title} id="performance-title" className={HEAD} />
      <div ref={card} className={styles.perfScreen}>
        {THEMES.map((each) => (
          <img
            key={each}
            className={styles.perfPoster}
            data-on={each}
            src={`${poster}-${each}.webp`}
            width={1600}
            height={900}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ))}
        <div
          ref={host}
          className={styles.perfCanvas}
          role="img"
          aria-label="Thousands of particles swirl in a three-armed spiral, drawn live in one ParticleContainer."
        />
        <div className={styles.perfTags} aria-hidden="true">
          <Tag tone="accent" className={styles.perfApi}>
            ParticleContainer
          </Tag>
          <Tag className={styles.perfReadout}>
            <span ref={hud} />
          </Tag>
          {status === 'live' && hint && <Tag className={styles.perfHint}>{hint}</Tag>}
        </div>
      </div>
      <ul className={styles.perfStats}>
        {PERFORMANCE.stats.map(({ value, unit, label }) => {
          const decimals = Number.isInteger(value) ? 0 : 2;

          return (
            <li key={label} data-reveal="">
              <Card className={styles.stat}>
                <strong>
                  <span data-count={value} data-decimals={decimals}>
                    {format(value, decimals)}
                  </span>
                  {unit && <small>{unit}</small>}
                </strong>
                <span>{inlineCode(label)}</span>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
