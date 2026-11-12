/**
 * The global "Pause motion" switch (WCAG 2.2.2), free of GSAP so the shell, the hero field and StageDemo tickers can
 * read it. The choice persists in `localStorage['pixi:motion']`; the head script restores `html[data-motion]` before
 * first paint, CSS stops keyframes from it, and `gsap.ts` pauses GSAP when it changes.
 */
const KEY = 'pixi:motion';
const EVENT = 'pixi:motion';

export function isMotionPaused(): boolean {
  return typeof document !== 'undefined' && document.documentElement.dataset.motion === 'paused';
}

export function setMotionPaused(paused: boolean): void {
  const root = document.documentElement;

  if (paused) root.dataset.motion = 'paused';
  else delete root.dataset.motion;
  try {
    if (paused) localStorage.setItem(KEY, 'paused');
    else localStorage.removeItem(KEY);
  } catch {
    // Storage can be unavailable (private mode); the attribute still applies for this page view.
  }
  window.dispatchEvent(new CustomEvent<boolean>(EVENT, { detail: paused }));
}

/** Whether to run motion: off under Pause motion and under reduced motion */
export function motionAllowed(): boolean {
  return !isMotionPaused() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Calls `listener` with the new state whenever motion is paused or resumed; returns the unsubscribe */
export function onMotionPause(listener: (paused: boolean) => void): () => void {
  const handler = (event: Event) => listener((event as CustomEvent<boolean>).detail);

  window.addEventListener(EVENT, handler);

  return () => window.removeEventListener(EVENT, handler);
}
