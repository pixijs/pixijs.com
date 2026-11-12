import { useEffect } from 'react';
import { motionAllowed } from '@site/src/motion/pause';
import { useReveal } from '@site/src/motion/useReveal';
import { useSplitTitle } from '@site/src/motion/useSplitTitle';

import type { RefObject } from 'react';

/**
 * A home's page-wide motion: `[data-reveal]` (M4) and every `SectionHead` (M3). It sets `window.__siteMotionSettled`
 * once the fonts are in and the hero's intro has had `introMs` to play, which the verification scripts wait for.
 */
export function useHomeMotion(root: RefObject<HTMLElement | null>, introMs: number): void {
  useReveal(root);
  useSplitTitle(root);

  useEffect(() => {
    const delay = motionAllowed() ? introMs : 0;
    let timer = 0;
    let mounted = true;

    void document.fonts.ready.then(() => {
      if (!mounted) return;
      timer = window.setTimeout(() => Object.assign(window, { __siteMotionSettled: true }), delay);
    });

    return () => {
      mounted = false;
      window.clearTimeout(timer);
      Object.assign(window, { __siteMotionSettled: false });
    };
  }, [introMs]);
}
