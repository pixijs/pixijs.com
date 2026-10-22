import { gsap } from './gsap';
import { useMotion } from './useMotion';

import type { RefObject } from 'react';

/** Share of the pointer's offset from the centre that the element follows */
const STRENGTH = 0.25;
/** Largest pull in px */
const MAX = 10;
/** Extra share that `[data-magnetic-label]` follows, for a little parallax */
const LABEL = 0.1;

/**
 * M8: the element leans toward a fine pointer and springs back when it leaves. Put it on the outer element of a
 * `Button`; the CSS hover transforms live on the inner body, so the two never fight.
 */
export function useMagnetic(target: RefObject<HTMLElement | null>): void {
  useMotion(target, (el, { fine, safe }) => {
    if (!fine) return undefined;
    const text = el.querySelector<HTMLElement>('[data-magnetic-label]');
    const clamp = gsap.utils.clamp(-MAX, MAX);
    let follow: Array<(value: number) => void> = [];
    let centre = { x: 0, y: 0 };

    const enter = safe(() => {
      const rect = el.getBoundingClientRect();
      const x = Number(gsap.getProperty(el, 'x'));
      const y = Number(gsap.getProperty(el, 'y'));

      centre = { x: rect.left + rect.width / 2 - x, y: rect.top + rect.height / 2 - y };
      follow = [el, text]
        .filter((node) => node !== null)
        .flatMap((node) => ['x', 'y'].map((axis) => gsap.quickTo(node, axis, { duration: 0.4, ease: 'power3' })));
    });
    const move = safe((event: PointerEvent) => {
      const dx = event.clientX - centre.x;
      const dy = event.clientY - centre.y;
      const [x, y, labelX, labelY] = follow;

      x?.(clamp(dx * STRENGTH));
      y?.(clamp(dy * STRENGTH));
      labelX?.(clamp(dx * LABEL));
      labelY?.(clamp(dy * LABEL));
    });
    const leave = safe(() => {
      follow = [];
      gsap.to([el, text].filter(Boolean), { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)', overwrite: true });
    });

    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);

    return () => {
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  });
}
