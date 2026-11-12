import { gsap } from './gsap';
import { JELLY, JELLY_TIME } from './jelly';
import { useMotion } from './useMotion';

import type { RefObject } from 'react';

/** `target` wobbles like a jelly as it arrives and again when a fine pointer enters it, about its `transform-origin` */
export function useJelly(target: RefObject<HTMLElement | null>): void {
  useMotion(target, (element, { fine, paused, safe }) => {
    let jelly: gsap.core.Tween | undefined;
    const wobble = (delay = 0) => {
      if (!jelly?.isActive()) jelly = gsap.to(element, { keyframes: JELLY, duration: JELLY_TIME, ease: 'none', delay });
    };
    const replay = safe(() => wobble());

    if (!paused) wobble(0.1);
    if (!fine) return undefined;
    element.addEventListener('pointerenter', replay);

    return () => element.removeEventListener('pointerenter', replay);
  });
}
