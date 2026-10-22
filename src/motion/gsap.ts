/**
 * GSAP for marketing pages. Import it from page components only, so Rspack keeps it out of `main.js`; the shell and
 * docs never import anything from `src/motion` except `pause.ts`.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DOCKED_MEDIA } from '@site/src/shell/modal';
import { isMotionPaused, onMotionPause } from './pause';

export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  spring: 'back.out(1.7)',
  pop: 'back.out(2.2)',
  elastic: 'elastic.out(1, 0.45)',
} as const;

export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  fine: '(hover: hover) and (pointer: fine)',
  wide: DOCKED_MEDIA,
} as const;

export const DUR = { xs: 0.2, sm: 0.35, md: 0.6, lg: 0.9 } as const;
export const STAGGER = { chars: 0.025, words: 0.06, items: 0.08, shapes: 0.08 } as const;

/** Ends an entrance at once, with its ScrollTrigger; loops and scrubs aren't entrances and are left running */
function finishEntrance(animation: gsap.core.Animation): void {
  if (animation.scrollTrigger?.vars.scrub || animation.repeat() === -1) return;
  animation.scrollTrigger?.kill();
  animation.progress(1);
}

/**
 * Applies the Pause motion switch: entrances jump to their end so nothing stays hidden, loops and the global
 * timeline stop, and scrubbed ScrollTriggers stop following the scroll. Resuming restarts loops and scrubs.
 */
export function applyMotionPause(paused = isMotionPaused()): void {
  const scrubbed = ScrollTrigger.getAll().filter((trigger) => trigger.vars.scrub);

  if (!paused) {
    // enable() alone leaves isActive false (and onToggle unfired) until the next scroll
    scrubbed.forEach((trigger) => {
      trigger.enable(false);
      trigger.update();
    });
    gsap.globalTimeline.resume();

    return;
  }
  scrubbed.forEach((trigger) => trigger.disable(false));
  gsap.globalTimeline.getChildren(false).forEach(finishEntrance);
  gsap.globalTimeline.pause();
}

/**
 * Focus scrolls only as far as it must, which can stop short of an entrance's trigger; finish any entrance the
 * focused element sits in, so a focused control is never invisible
 */
function revealFocused(event: FocusEvent): void {
  for (let node = event.target instanceof Element ? event.target : null; node; node = node.parentElement) {
    for (const tween of gsap.getTweensOf(node)) {
      let entrance: gsap.core.Animation = tween;

      while (entrance.parent && entrance.parent !== gsap.globalTimeline) entrance = entrance.parent;
      finishEntrance(entrance);
    }
    // Batch reveals (useReveal) hold their targets at opacity 0, with no tween yet, until they enter
    if (node instanceof HTMLElement && node.style.opacity === '0') gsap.set(node, { opacity: 1 });
  }
}

/**
 * Lets SplitText's line masks clear the glyphs: descenders fall below a tight line and end letters overhang it, so
 * each mask reaches past both while the text stays put
 */
export function bleedMasks(masks: Element[]): void {
  gsap.set(masks, { padding: '0 0.1em 0.12em', margin: '0 -0.1em -0.12em' });
}

/** Finishes an animation at once while motion is paused; use it for tweens created later, such as on scroll */
export function settle<T extends gsap.core.Animation>(animation: T): T {
  if (isMotionPaused()) animation.progress(1);

  return animation;
}

if (ExecutionEnvironment.canUseDOM) {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin);
  gsap.defaults({ ease: EASE.out, duration: DUR.md });
  ScrollTrigger.config({ ignoreMobileResize: true });
  onMotionPause(applyMotionPause);
  document.addEventListener('focusin', revealFocused);
  void document.fonts?.ready.then(() => ScrollTrigger.refresh());

  /*
   * Crossing a breakpoint (a tablet turning) reverts the useMotion branches before ScrollTrigger records the scroll,
   * so its refresh measures from the top and leaves the page there; put the reader back where they were
   */
  let lastY = 0;
  const keepScroll = () => {
    const y = lastY;
    const restore = () => {
      ScrollTrigger.removeEventListener('refresh', restore);
      window.scrollTo(0, y);
    };

    ScrollTrigger.addEventListener('refresh', restore);
  };

  window.addEventListener('scroll', () => (lastY = window.scrollY), { passive: true });
  [MQ.wide, MQ.fine].forEach((query) => matchMedia(query).addEventListener('change', keepScroll));
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
