import { gsap, ScrollTrigger } from './gsap';
import { useMotion } from './useMotion';

import type { RefObject } from 'react';

interface MarqueeOptions {
  /** Seconds for one full pass of the first copy */
  duration?: number;
}

/**
 * M7: an endless loop over a track that holds two identical copies of its items. Scroll velocity speeds it up or
 * runs it backwards (time scale clamped to ±5) and skews it slightly, then it eases back. Hovering or focusing the
 * track's parent slows it to a stop, and it rests while off screen. Under reduced motion nothing moves, so the
 * component shows its static layout.
 */
export function useMarquee(track: RefObject<HTMLElement | null>, { duration = 70 }: MarqueeOptions = {}): void {
  useMotion(track, (el, { safe }) => {
    const zone = el.parentElement ?? el;
    const loop = gsap.to(el, { xPercent: -50, duration, ease: 'none', repeat: -1 });
    const speed = gsap.quickTo(loop, 'timeScale', { duration: 0.6, ease: 'power3' });
    const skew = gsap.quickTo(el, 'skewX', { duration: 0.4, ease: 'power3' });
    const clampSpeed = gsap.utils.clamp(-5, 5);
    const clampSkew = gsap.utils.clamp(-4, 4);
    let held = false;
    let calm: gsap.core.Tween | undefined;

    // Start far into the loop so a reversed scroll has room to run backwards
    loop.totalTime(duration * 1000);

    const visible = ScrollTrigger.create({
      trigger: zone,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => loop.paused(!self.isActive),
      onUpdate: (self) => {
        if (held) return;
        const velocity = self.getVelocity();

        speed(clampSpeed(1 + velocity / 300));
        skew(clampSkew(velocity / -400));
        calm?.kill();
        calm = gsap.delayedCall(0.2, () => {
          speed(1);
          skew(0);
        });
      },
    });

    loop.paused(!visible.isActive);

    const hold = safe(() => {
      held = true;
      speed(0);
    });
    const release = safe((event: Event) => {
      const next = (event as FocusEvent).relatedTarget;

      if (zone.matches(':hover, :focus-within') || (next instanceof Node && zone.contains(next))) return;
      held = false;
      speed(1);
    });

    zone.addEventListener('pointerenter', hold);
    zone.addEventListener('pointerleave', release);
    zone.addEventListener('focusin', hold);
    zone.addEventListener('focusout', release);

    return () => {
      zone.removeEventListener('pointerenter', hold);
      zone.removeEventListener('pointerleave', release);
      zone.removeEventListener('focusin', hold);
      zone.removeEventListener('focusout', release);
    };
  });
}
