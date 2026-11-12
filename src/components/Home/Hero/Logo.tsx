import { useColorMode } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useEffect, useRef } from 'react';
import { gsap } from '@site/src/motion/gsap';
import { useJelly } from '@site/src/motion/useJelly';
import { scoped } from '../scoped';
import { runLiveCanvas } from './liveCanvas';

import type { HeroLogo } from './logo/createLogo';

/** Not `./styles`, which would bring the hero's stylesheet along to `/2d`, whose hero has its own */
const styles = scoped('hero');

const THEMES = ['dark', 'light'] as const;

/** The PixiJS logo over a hero's headline, squashing like a jelly as it arrives and on hover */
export function Logo({ className = styles.logo }: { className?: string }) {
  const logo = useRef<HTMLImageElement>(null);

  useJelly(logo);

  return (
    <img ref={logo} className={className} src={useBaseUrl('/images/logo.svg')} alt="PixiJS" width={735} height={289} />
  );
}

/**
 * The PixiJS logo as a 3D model, for `/3d`. The server renders its poster, a still of the model per theme; once the
 * page is idle and the hero on screen, the live model (`home-logo` chunk) fades in over it in the same pose, and
 * floats, squashes on hover and spins on a tap. Reduced motion, Save-Data, a paused page and no WebGL2 keep the
 * poster, and a lost WebGL context brings it back.
 */
export function Logo3D() {
  const root = useRef<HTMLSpanElement>(null);
  const stage = useRef<HTMLSpanElement>(null);
  const live = useRef<HeroLogo | null>(null);
  const { colorMode } = useColorMode();
  const theme = useRef(colorMode);
  const poster = useBaseUrl('/images/home/stage/hero-logo');

  theme.current = colorMode;

  useEffect(() => {
    live.current?.setTheme(colorMode);
  }, [colorMode]);

  useEffect(() => {
    const element = root.current;
    const host = stage.current;

    if (!element || !host) return undefined;
    const posters = Array.from(host.querySelectorAll('img'));

    return runLiveCanvas(element, live, {
      name: 'hero logo',
      load: () => import(/* webpackChunkName: "home-logo" */ './logo/createLogo'),
      create: ({ createLogo }, onLost) => createLogo(host, { theme: theme.current, motion: true, onLost }),
      show: () => gsap.to(posters, { autoAlpha: 0, duration: 0.3, ease: 'none' }),
      restore: () => gsap.set(posters, { autoAlpha: 1 }),
    })?.stop;
  }, []);

  return (
    <span
      ref={root}
      className={styles.logo3d}
      role="img"
      aria-label="PixiJS"
      onPointerEnter={(event) => event.pointerType === 'mouse' && live.current?.wobble()}
      onPointerDown={() => live.current?.spin()}
    >
      <span ref={stage} className={styles.logoStage}>
        {THEMES.map((each) => (
          <img
            key={each}
            className={styles.logoPoster}
            data-on={each}
            src={`${poster}-${each}.webp`}
            width={884}
            height={510}
            alt=""
            decoding="async"
          />
        ))}
      </span>
    </span>
  );
}
