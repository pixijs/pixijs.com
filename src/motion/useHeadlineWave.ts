import { gsap, SplitText, STAGGER } from './gsap';
import { useMotion } from './useMotion';

import type { RefObject } from 'react';

const WAVE = {
  '35%': { yPercent: -14, rotation: -5, scaleY: 1.06 },
  '65%': { yPercent: 3, rotation: 0, scaleY: 0.94 },
  '100%': { yPercent: 0, rotation: 0, scaleY: 1 },
  easeEach: 'power2.out',
};

/**
 * M1/M2: a wave runs through the headline's letters once on mount and starts and ends at rest, so the SSR text is
 * never hidden. Words inside `[data-accent]` pop as the wave reaches them. Hovering replays it unless one is still
 * running.
 *
 * The headline is split into letters only after it has painted whole, in its web font: a hero headline has to be
 * the page's LCP element, and once split it is dozens of small candidates that lose to the paragraph under it.
 */
export function useHeadlineWave(target: RefObject<HTMLElement | null>): void {
  useMotion(target, (headline, { fine, paused, safe }) => {
    let frame = 0;
    let live = true;
    let replay: (() => void) | undefined;

    const start = safe(() => {
      const { chars, words } = SplitText.create(headline, { type: 'words,chars', aria: 'auto' });
      const accents = words.filter((word) => word.closest('[data-accent]'));
      const wave = (at: number) => {
        const timeline = gsap
          .timeline({ delay: at })
          .to(chars, { keyframes: WAVE, duration: 0.7, ease: 'none', stagger: STAGGER.chars }, 0);

        for (const word of accents) {
          const reached = chars.findIndex((char) => word.contains(char)) * STAGGER.chars + 0.2;

          timeline.to(
            word,
            {
              keyframes: [
                { scale: 1.14, duration: 0.15, ease: 'power2.out' },
                { scale: 1, duration: 0.5, ease: 'back.out(3)' },
              ],
            },
            reached,
          );
        }

        return timeline;
      };
      let current = paused ? undefined : wave(0.15);

      if (!fine) return;
      replay = safe(() => {
        if (!current?.isActive()) current = wave(0);
      });
      headline.addEventListener('pointerenter', replay);
    });

    void document.fonts.ready.then(() => {
      if (!live) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(start);
      });
    });

    return () => {
      live = false;
      cancelAnimationFrame(frame);
      if (replay) headline.removeEventListener('pointerenter', replay);
    };
  });
}
