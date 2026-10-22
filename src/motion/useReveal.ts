import { EASE, gsap, ScrollTrigger, settle } from './gsap';
import { onMotionPause } from './pause';
import { useMotion } from './useMotion';

import type { RefObject } from 'react';

const FROM: Record<string, gsap.TweenVars> = {
  up: { opacity: 0, y: 28 },
  scale: { opacity: 0, scale: 0.96 },
  left: { opacity: 0, x: -32 },
  right: { opacity: 0, x: 32 },
};

interface RevealOptions {
  /** Also animate elements already on screen, for content that mounts after an interaction */
  includeVisible?: boolean;
}

interface BatchOptions {
  /** Plays the entrance of the elements that have just scrolled into view */
  play: (entering: HTMLElement[]) => void;
  /** Puts elements in their final state at once; a `gsap.set` there needs `immediateRender`, as motion may be paused */
  finish: (elements: HTMLElement[]) => void;
  batchMax?: number;
}

/**
 * `ScrollTrigger.batch` for elements the caller has already hidden, so that none can stay hidden. A jump down the
 * page (an anchor link) passes everything above it in one batch: those finish at once and only what's on screen
 * plays, or the last of them would wait out the whole stagger. Pause motion stops the clock a batch waits on, so
 * pausing finishes whatever hasn't entered yet. Returns the cleanup for a `useMotion` setup.
 */
export function batchEntrance(targets: HTMLElement[], { play, finish, batchMax }: BatchOptions): () => void {
  const triggers = ScrollTrigger.batch(targets, {
    start: 'top 94%',
    once: true,
    batchMax,
    onEnter: (batch) => {
      const passed = targets.filter((el) => batch.includes(el) && el.getBoundingClientRect().bottom < 0);
      const entering = targets.filter((el) => batch.includes(el) && !passed.includes(el));

      if (passed.length) finish(passed);
      if (entering.length) play(entering);
    },
  });

  return onMotionPause((paused) => {
    if (!paused) return;
    triggers.forEach((trigger) => trigger.kill());
    finish(targets);
  });
}

/**
 * M4: elements marked `data-reveal` (or `data-reveal="scale|left|right"`) rise in as they scroll into view, in one
 * batch for the page (see {@link batchEntrance}). Call it once at the page root. Anything already on screen at setup
 * is left alone unless `includeVisible` is set.
 *
 * Entrances fade `opacity`, never `autoAlpha`: `visibility: hidden` would drop unrevealed links out of the tab order,
 * while a focused link scrolls into view and reveals itself.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, { includeVisible }: RevealOptions = {}): void {
  useMotion(scope, (root, { paused }) => {
    if (paused) return undefined;
    const targets = gsap.utils
      .toArray<HTMLElement>('[data-reveal]', root)
      .filter((el) => includeVisible || !ScrollTrigger.isInViewport(el, 0.1));

    if (!targets.length) return undefined;
    const shown = { opacity: 1, x: 0, y: 0, scale: 1, overwrite: true };

    targets.forEach((el) => gsap.set(el, FROM[el.dataset.reveal || 'up'] ?? FROM.up));

    return batchEntrance(targets, {
      play: (entering) => settle(gsap.to(entering, { ...shown, duration: 0.8, ease: EASE.out, stagger: 0.08 })),
      finish: (elements) => gsap.set(elements, { ...shown, immediateRender: true }),
    });
  });
}
