import { bleedMasks, gsap, ScrollTrigger, SplitText } from './gsap';
import { useMotion } from './useMotion';

import type { RefObject } from 'react';

interface SplitTitleOptions {
  /** Also animate heads already on screen, for content that mounts after an interaction */
  includeVisible?: boolean;
}

/**
 * M3 + M5 for every `SectionHead` (`[data-section-head]`) inside `scope`: title words rise out of line masks, the
 * eyebrow scrambles in, the lede and the control rise and the squiggle draws. Hovering a title
 * redraws its squiggle. Heads already on screen at setup stay as they are unless `includeVisible` is set.
 *
 * A head starts as soon as its top is clear of the viewport's foot, and quickly: until it has, its place is empty.
 */
export function useSplitTitle(scope: RefObject<HTMLElement | null>, { includeVisible }: SplitTitleOptions = {}): void {
  useMotion(scope, (root, { fine, paused, safe }) => {
    const listeners: Array<() => void> = [];

    for (const head of gsap.utils.toArray<HTMLElement>('[data-section-head]', root)) {
      const title = head.querySelector<HTMLElement>('[data-title]');
      const squiggle = head.querySelector('[data-squiggle] path');

      if (fine && title && squiggle) {
        const redraw = safe(() =>
          gsap.fromTo(squiggle, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power2.inOut' }),
        );

        title.addEventListener('pointerenter', redraw);
        listeners.push(() => title.removeEventListener('pointerenter', redraw));
      }
      if (paused || (!includeVisible && ScrollTrigger.isInViewport(head, 0.1))) continue;

      const trigger = { trigger: head, start: 'top 92%', once: true };
      const eyebrow = head.querySelector('[data-eyebrow]');
      const lede = head.querySelector('[data-lede]');
      const control = head.querySelector('[data-control]');
      const timeline = gsap.timeline({ scrollTrigger: { ...trigger } });

      if (title) {
        SplitText.create(title, {
          type: 'lines,words',
          mask: 'lines',
          aria: 'auto',
          autoSplit: true,
          onSplit: (split) => {
            bleedMasks(split.masks);

            return gsap.from(split.words, {
              yPercent: 110,
              duration: 0.6,
              ease: 'power4.out',
              stagger: 0.04,
              scrollTrigger: { ...trigger },
            });
          },
        });
      }
      if (eyebrow) {
        timeline
          .from(eyebrow, { autoAlpha: 0, y: 12, duration: 0.6 }, 0)
          .to(eyebrow, { scrambleText: { text: '{original}', chars: 'upperCase', speed: 0.4 }, duration: 0.6 }, 0);
      }
      if (lede) timeline.from(lede, { autoAlpha: 0, y: 20, duration: 0.8 }, 0.1);
      // Opacity, not autoAlpha: a control holds links, which must stay in the tab order
      if (control) timeline.from(control, { opacity: 0, y: 12, duration: 0.6 }, 0.15);
      if (squiggle) timeline.from(squiggle, { drawSVG: '0%', duration: 0.9, ease: 'power2.inOut' }, 0.3);
    }

    return () => listeners.forEach((remove) => remove());
  });
}
