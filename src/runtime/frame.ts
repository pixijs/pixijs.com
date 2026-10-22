import type { Imports } from './registry';

/** `sandbox` for runner frames: no `allow-same-origin`, so user code can't reach the site's storage or DOM */
export const FRAME_SANDBOX = 'allow-scripts allow-pointer-lock allow-popups allow-modals allow-downloads';

/** `allow` for runner frames */
export const FRAME_ALLOW = 'fullscreen; gamepad; xr-spatial-tracking; accelerometer; gyroscope; clipboard-write';

export type Renderer = 'webgl' | 'webgpu';
export type ConsoleLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

export interface FrameError {
  message: string;
  stack?: string;
  file?: string;
  line?: number;
  column?: number;
}

/** What a runner frame posts to its parent; `run` is the token the frame was built with */
export type FrameMessage =
  | { run: string; type: 'console'; data: { level: ConsoleLevel; args: string[] } }
  | { run: string; type: 'error'; data: FrameError }
  | { run: string; type: 'ready' };

export interface FrameOptions {
  /** Token every message from this frame carries */
  run: string;
  /** Forces pixi.js's renderer preference (pixi.js 8) */
  renderer?: Renderer;
}

/**
 * Runs in the frame before the user's code. It's sent as source text, so it must not use anything from outside its
 * own body. Forwards console calls and uncaught errors, and posts `ready` once the entry module has settled and the
 * first canvas has had two animation frames to draw (or after 3 s without one).
 */
function hook(run: string) {
  const post = (type: string, data?: unknown) => parent.postMessage({ run, type, data }, '*');
  const format = (value: unknown, depth: number): string => {
    if (typeof value === 'string') return value;
    if (value instanceof Error) return value.stack || `${value.name}: ${value.message}`;
    if (typeof value === 'function') return `ƒ ${value.name || 'anonymous'}()`;
    if (typeof value !== 'object' || value === null) return String(value);
    if (depth === 0) return Array.isArray(value) ? '[…]' : '{…}';
    const inner = (item: unknown) => (typeof item === 'string' ? JSON.stringify(item) : format(item, depth - 1));

    if (Array.isArray(value)) return `[${value.slice(0, 100).map(inner).join(', ')}]`;
    const name = value.constructor && value.constructor !== Object ? `${value.constructor.name} ` : '';
    const fields = Object.keys(value)
      .slice(0, 50)
      .map((key) => {
        try {
          return `${key}: ${inner((value as Record<string, unknown>)[key])}`;
        } catch {
          return `${key}: ?`;
        }
      });

    return `${name}{${fields.join(', ')}}`;
  };
  const report = (error: unknown, at?: ErrorEvent) => {
    const { message, stack } = error instanceof Error ? error : { message: String(error), stack: undefined };

    post('error', { message, stack, file: at?.filename, line: at?.lineno, column: at?.colno });
  };

  for (const level of ['log', 'info', 'warn', 'error', 'debug'] as const) {
    const original = console[level];

    console[level] = (...args: unknown[]) => {
      post('console', { level, args: args.map((arg) => format(arg, 3).slice(0, 2048)) });
      original.apply(console, args);
    };
  }
  addEventListener('error', (event) => report(event.error ?? event.message, event));
  addEventListener('unhandledrejection', (event) => report(event.reason));

  (window as unknown as { __runner: (entry: Promise<unknown>) => void }).__runner = (entry) => {
    const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => post('ready')));

    entry.catch(report).then(() => {
      if (document.querySelector('canvas')) return ready();
      const observer = new MutationObserver(() => {
        if (!document.querySelector('canvas')) return;
        observer.disconnect();
        clearTimeout(timeout);
        ready();
      });
      const timeout = setTimeout(() => {
        observer.disconnect();
        ready();
      }, 3000);

      observer.observe(document, { childList: true, subtree: true });
    });
  };
}

const HOOK = String(hook);

/** Overrides the renderer preference an example asks pixi.js for */
const rendererPrelude = (renderer: Renderer) => `import { Application } from 'pixi.js';
const init = Application.prototype.init;
Application.prototype.init = function (options) {
  return init.call(this, { ...options, preference: ${JSON.stringify(renderer)} });
};
`;

/** JSON that can sit inside a `<script>` element */
export const scriptJson = (value: unknown, indent?: number) =>
  JSON.stringify(value, null, indent).replaceAll('<', '\\u003c');

/**
 * The document a runner frame loads: the import map, the hook, then the entry module
 * @param map - Import map entries
 * @param entryUrl - URL of the compiled entry module
 * @param options - Run token and renderer override
 */
export function buildSrcdoc(map: Imports, entryUrl: string, { run, renderer }: FrameOptions): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>PixiJS</title>
<style>body { margin: 0; overflow: hidden; }</style>
<script type="importmap">${scriptJson({ imports: map })}</script>
<script>(${HOOK})(${scriptJson(run)});</script>
</head>
<body>
<script type="module">${renderer ? rendererPrelude(renderer) : ''}__runner(import(${scriptJson(entryUrl)}));</script>
</body>
</html>
`;
}
