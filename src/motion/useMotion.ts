import { gsap, MQ, useGSAP } from './gsap';

import type { RefObject } from 'react';

export interface MotionEnv {
  /** Hover-capable fine pointer */
  fine: boolean;
  /** Docked-rail widths (≥ 997 px) */
  wide: boolean;
  /** Wraps an event handler so the tweens it makes are reverted with the branch */
  safe: <T extends (...args: never[]) => unknown>(handler: T) => T;
}

/**
 * The shape every motion hook shares (section 7.3): `useGSAP` scoped to `scope`, one `gsap.matchMedia()` branch that
 * runs only without reduced motion and re-runs when the pointer or width condition flips, and cleanup that reverts
 * every tween, ScrollTrigger and SplitText. `setup` may return a function that removes its event listeners.
 */
export function useMotion<T extends Element>(
  scope: RefObject<T | null>,
  setup: (root: T, env: MotionEnv) => void | (() => void),
): void {
  useGSAP(
    () => {
      const root = scope.current;

      if (!root) return undefined;
      const mm = gsap.matchMedia(root);

      mm.add({ motion: MQ.motion, fine: MQ.fine, wide: MQ.wide }, (context, contextSafe) => {
        const { motion, fine, wide } = context.conditions ?? {};

        if (!motion) return undefined;
        const safe = (contextSafe ?? ((handler) => handler)) as MotionEnv['safe'];
        return setup(root, { fine: !!fine, wide: !!wide, safe });
      });

      return () => mm.revert();
    },
    { scope },
  );
}
