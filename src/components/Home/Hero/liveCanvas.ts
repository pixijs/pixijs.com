import { gsap } from '@site/src/motion/gsap';
import { motionAllowed, onMotionPause } from '@site/src/motion/pause';
import { hasWebGL2 } from '../StageDemo/webgl';

import type { RefObject } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** Save-Data or `prefers-reduced-data`: a poster costs nothing more to show */
export function savingData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

  return !!connection?.saveData || matchMedia('(prefers-reduced-data: reduce)').matches;
}

/** A WebGL scene that takes over from a server-rendered poster, as the hero's field and `/3d`'s logo do */
export interface LiveCanvas {
  readonly canvas: HTMLCanvasElement;
  /** Runs or stops its ticker */
  setActive(active: boolean): void;
  destroy(): void;
}

export interface LiveScene<Chunk, Live extends LiveCanvas> {
  /** What the warning calls it when it can't start */
  name: string;
  /** Imports the scene's chunk */
  load(): Promise<Chunk>;
  /** `onLost` hears the browser take the scene's WebGL context away */
  create(chunk: Chunk, onLost: () => void): Promise<Live>;
  /** Hands over from the poster; the canvas fades in by itself */
  show(live: Live): void;
  /** Brings the poster back once the context is lost */
  restore(): void;
  /** No WebGL2, or the scene failed to start: the poster stays */
  fail?(): void;
  /** Pause motion or reduced motion changed; called before the scene starts or follows the change */
  motionChanged?(): void;
  /** A lost context starts over after this many seconds; without it the poster stays */
  retryAfter?: number;
}

export interface LiveRun {
  readonly onScreen: boolean;
  stop(): void;
}

/**
 * Brings a poster in `element` to life as `scene`, held in `live`. Once the page is idle and `element` on screen
 * with motion allowed, the scene's chunk loads and its canvas fades in; it runs only while on screen, with the page
 * visible and motion allowed, so Play motion starts one that Pause motion held back. Save-Data and
 * `prefers-reduced-data` keep the poster and return nothing. No WebGL2 keeps it too; that's checked only once the
 * scene would start, so a paused or reduced-motion visit never makes a context to find out.
 */
export function runLiveCanvas<Chunk, Live extends LiveCanvas>(
  element: Element,
  live: RefObject<Live | null>,
  scene: LiveScene<Chunk, Live>,
): LiveRun | undefined {
  if (savingData()) return undefined;

  const reduced = matchMedia(REDUCED_MOTION);
  let alive = true;
  let requested = false;
  let onScreen = false;
  const sync = () => live.current?.setActive(onScreen && !document.hidden && motionAllowed());

  const lose = () => {
    if (!alive || !live.current) return;
    live.current.destroy();
    live.current = null;
    scene.restore();
    if (scene.retryAfter === undefined) return;
    requested = false;
    gsap.delayedCall(scene.retryAfter, start);
  };

  const load = async () => {
    try {
      const chunk = await scene.load();

      if (!alive) return;
      // Out of the event that reports it, which the canvas is still dispatching
      const created = await scene.create(chunk, () => window.setTimeout(lose));

      if (!alive) {
        created.destroy();

        return;
      }
      live.current = created;
      scene.show(created);
      gsap.fromTo(created.canvas, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'none' });
      sync();
    } catch (error) {
      console.warn(`The ${scene.name} could not start; keeping its poster.`, error);
      if (alive) scene.fail?.();
    }
  };

  function start() {
    if (requested || !alive || !onScreen || !motionAllowed()) return;
    requested = true;
    if (!hasWebGL2()) {
      scene.fail?.();

      return;
    }
    if ('requestIdleCallback' in window) requestIdleCallback(() => void load(), { timeout: 1500 });
    else setTimeout(() => void load(), 200);
  }

  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    start();
    sync();
  });
  const motionChanged = () => {
    scene.motionChanged?.();
    start();
    sync();
  };
  const stopPause = onMotionPause(motionChanged);

  visibility.observe(element);
  reduced.addEventListener('change', motionChanged);
  document.addEventListener('visibilitychange', sync);

  return {
    get onScreen() {
      return onScreen;
    },
    stop() {
      alive = false;
      visibility.disconnect();
      stopPause();
      reduced.removeEventListener('change', motionChanged);
      document.removeEventListener('visibilitychange', sync);
      live.current?.destroy();
      live.current = null;
    },
  };
}
