/** Whether to run motion: off under `prefers-reduced-motion: reduce`. Free of GSAP, so the shell can read it. */
export function motionAllowed(): boolean {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
