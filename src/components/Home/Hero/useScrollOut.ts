import { gsap } from '@site/src/motion/gsap';
import { useMotion } from '@site/src/motion/useMotion';

import type { RefObject } from 'react';

/**
 * A hero's scroll-out (M16): as the page leaves it, the copy rises and fades, the backdrop (a selector inside
 * `section`) sinks a little and the drift wave (another) slides along.
 */
export function useScrollOut(
  section: RefObject<HTMLElement | null>,
  copy: RefObject<HTMLElement | null>,
  backdrop: string,
  wave: string,
): void {
  useMotion(section, (root) => {
    gsap
      .timeline({ scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.5 } })
      .to(copy.current, { y: -60, autoAlpha: 0.15, ease: 'none' }, 0)
      .to(root.querySelector(backdrop), { yPercent: 18, ease: 'none' }, 0)
      .to(root.querySelector(wave), { '--hm-drift': 24, ease: 'none' }, 0);
  });
}
