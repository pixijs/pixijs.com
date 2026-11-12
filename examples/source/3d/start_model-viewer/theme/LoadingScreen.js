/**
 * The loading screen: the PixiJS wordmark over a thin pink bar, on the theme's backdrop
 *
 * It's markup rather than pixi, so it paints before the renderer exists. It covers the page until the first frame
 * is drawn, then dissolves onto the same colours the stage shows.
 */

import { BRAND, cssColor, THEMES } from './palette';

import { wordmarkSvg } from './wordmark';

/** Milliseconds the full bar holds before the screen goes, so finishing reads as finishing */
const HOLD_MS = 240;
/** Milliseconds the screen takes to dissolve */
const FADE_MS = 420;

const CSS = /* css */ `
.theme-load {
  --theme-load-width: clamp(170px, 44vw, 300px);
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(26px, 5vh, 44px);
  padding: 24px;
  box-sizing: border-box;
  user-select: none;
  background: var(--theme-load-ground);
  opacity: 1;
  transition: opacity ${FADE_MS}ms ease;
}
.theme-load.is-out { opacity: 0; }
.theme-load-mark {
  display: flex;
  animation: theme-load-in 700ms cubic-bezier(0.34, 1.8, 0.64, 1) both;
}
.theme-load-mark svg {
  width: calc(var(--theme-load-width) * 0.86);
  height: auto;
}
.theme-load-bar {
  position: relative;
  width: calc(var(--theme-load-width) * 0.72);
  height: 3px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(231, 34, 100, 0.16);
}
.theme-load-fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #eb3674, #e91e63);
  transition: width 180ms linear;
}
.theme-load-bar:not([aria-valuenow])::after {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 45%;
  background: linear-gradient(90deg, transparent, rgba(255, 74, 134, 0.85), transparent);
  animation: theme-load-sheen 1.3s ease-in-out infinite;
}
.theme-load-note {
  max-width: 30ch;
  margin: 0;
  color: var(--theme-load-ink);
  font: 14px/1.5 system-ui, -apple-system, 'Segoe UI', sans-serif;
  text-align: center;
}
.theme-load-note[hidden] { display: none; }
.theme-load.is-failed .theme-load-bar { opacity: 0.25; }
@keyframes theme-load-in {
  from { transform: scale(0.82) translateY(12px); opacity: 0; }
  to { transform: none; opacity: 1; }
}
@keyframes theme-load-sheen {
  from { transform: translateX(-100%); }
  to { transform: translateX(322%); }
}
@media (prefers-reduced-motion: reduce) {
  .theme-load, .theme-load-fill { transition: none; }
  .theme-load-mark { animation: none; }
  .theme-load-bar:not([aria-valuenow])::after { animation: none; opacity: 0.5; }
}
`;

/**
 * Runs `load` with the bytes of everything it downloads through `fetch` reported as they land
 *
 * Pixi's loaders download through the global `fetch`, except image textures, which load in a web worker by default.
 * Wrapping it for the length of the load counts the rest without asking for anything twice. A response that doesn't
 * declare its length passes through untouched.
 */
async function withDownloadProgress(report, load) {
  const original = globalThis.fetch;
  let expected = 0;
  let arrived = 0;

  globalThis.fetch = async (input, init) => {
    const response = await original(input, init);
    const length = Number(response.headers.get('content-length'));

    if (response.status !== 200 || !response.body || !(length > 0))
      return response;

    expected += length;

    const counted = new TransformStream({
      transform(chunk, controller) {
        arrived += chunk.byteLength;
        report(Math.min(1, arrived / expected));
        controller.enqueue(chunk);
      },
    });

    return new Response(response.body.pipeThrough(counted), response);
  };

  try {
    return await load();
  } finally {
    globalThis.fetch = original;
  }
}

/**
 * Covers the page while an example boots and loads
 *
 * Put it up first, before the renderer, so the page never shows blank; then report progress, and call
 * {@link LoadingScreen#finish} once the first frame is drawn.
 */
export class LoadingScreen {
  _style;
  _root;
  _bar;
  _fill;
  _note;
  _reducedMotion;
  _shown = 0;
  _timer = 0;
  _gone = false;
  /** Resolves whatever {@link LoadingScreen#finish} is waiting on, so cutting the screen short lets it carry on */
  _cut = null;

  constructor({ theme = 'light', label = 'example' } = {}) {
    const colors = THEMES[theme];
    const mark = document.createElement('div');

    this._reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    this._style = document.createElement('style');
    this._root = document.createElement('div');
    this._bar = document.createElement('div');
    this._fill = document.createElement('span');
    this._note = document.createElement('p');
    this._style.textContent = CSS;
    this._root.className = 'theme-load';
    this._root.setAttribute('role', 'status');
    this._root.setAttribute('aria-label', `Loading ${label}`);
    // The stage's backdrop: the sky at the top easing to the haze at the horizon.
    this._root.style.setProperty(
      '--theme-load-ground',
      `linear-gradient(${cssColor(colors.sky)} 0%, ${cssColor(colors.haze)} 65%)`,
    );
    this._root.style.setProperty('--theme-load-ink', cssColor(colors.ink));
    this._bar.className = 'theme-load-bar';
    this._bar.setAttribute('role', 'progressbar');
    this._bar.setAttribute('aria-label', 'Loading progress');
    this._bar.setAttribute('aria-valuemin', '0');
    this._bar.setAttribute('aria-valuemax', '100');
    this._fill.className = 'theme-load-fill';
    this._note.className = 'theme-load-note';
    this._note.hidden = true;
    mark.className = 'theme-load-mark';
    // The washes over the P are the brand's near-black on paper; on the dark theme they take the haze.
    mark.innerHTML = wordmarkSvg(
      cssColor(BRAND.pink),
      cssColor(theme === 'light' ? BRAND.night : colors.haze),
    );
    this._bar.appendChild(this._fill);
    this._root.append(mark, this._bar, this._note);
    document.head.appendChild(this._style);
    document.body.appendChild(this._root);
  }

  /** Reports how far the load is, 0 to 1; the bar only ever grows */
  progress(value) {
    const filled = Math.min(1, Math.max(0, value));

    if (this._gone || filled <= this._shown) return;
    this._shown = filled;
    this._fill.style.width = `${(filled * 100).toFixed(2)}%`;
    // Setting a value ends the sheen that runs until the first report.
    this._bar.setAttribute('aria-valuenow', String(Math.round(filled * 100)));
  }

  /**
   * Runs `task`, filling the bar from where it is to `until` as its downloads arrive
   *
   * Pixi's loaders download through `fetch`, so `Assets.load` calls inside `task` count, except image textures, which
   * load in a worker; run one task at a time, and put parallel loads inside it with `Promise.all`. A task that fails leaves the screen up with a note.
   * @param task - The loads to run.
   * @param until - How full the bar is once the task is done, 0 to 1.
   * @returns Whatever `task` returns.
   */
  async load(task, until = 0.9) {
    const from = this._shown;

    try {
      const result = await withDownloadProgress(
        (fraction) => this.progress(from + (until - from) * fraction),
        task,
      );

      this.progress(until);

      return result;
    } catch (error) {
      this.fail(
        'Something went wrong loading this example. Reloading may fix it.',
      );
      throw error;
    }
  }

  /** Fills the bar, holds it, dissolves and leaves the page; resolves once it's gone */
  async finish() {
    if (this._gone) return;
    this.progress(1);
    if (this._reducedMotion) {
      this.destroy();

      return;
    }
    await this._wait(HOLD_MS);
    if (this._gone) return;
    this._root.classList.add('is-out');
    await this._wait(FADE_MS);
    this.destroy();
  }

  /** Leaves the screen up with a message, for a load that fell over */
  fail(message) {
    if (this._gone) return;
    this._note.textContent = message;
    this._note.hidden = false;
    this._root.classList.add('is-failed');
  }

  /** Removes the screen at once */
  destroy() {
    if (this._gone) return;
    this._gone = true;
    window.clearTimeout(this._timer);
    this._cut?.();
    this._cut = null;
    this._root.remove();
    this._style.remove();
  }

  _wait(ms) {
    return new Promise((resolve) => {
      this._cut = resolve;
      this._timer = window.setTimeout(resolve, ms);
    });
  }
}
