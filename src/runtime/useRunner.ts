import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type Compiled, compile, type SourceFiles } from './compile';
import { buildSrcdoc, type ConsoleLevel, type FrameError, type FrameMessage, type Renderer } from './frame';
import { importMap, type RuntimeMajor } from './registry';

/**
 * - `idle`: nothing has run yet
 * - `running`: a run is loading in the hidden frame
 * - `ready`: the latest run is on screen
 * - `error`: the latest run didn't compile; the previous preview stays
 * - `unsupported`: the browser has no import maps
 */
export type RunnerStatus = 'idle' | 'running' | 'ready' | 'error' | 'unsupported';

export interface RunnerLog {
  level: ConsoleLevel;
  args: string[];
}

/** An error with its location mapped back to a source file when the stack names one */
export type RunnerError = FrameError;

export interface RunnerOptions {
  files: SourceFiles;
  /** File to run; default `index.js` */
  entry?: string;
  /** pixi.js major; default 8 */
  major?: RuntimeMajor;
  /** Version ranges for packages the import map doesn't list */
  dependencies?: Record<string, string>;
  renderer?: Renderer;
  /** Rerun after edits; default true. The first run always happens */
  autoRun?: boolean;
  /** Debounce for reruns, in ms; default 400 */
  delay?: number;
}

export interface Runner {
  status: RunnerStatus;
  logs: RunnerLog[];
  /** The first uncaught error of the latest run, or why it didn't compile */
  error: RunnerError | null;
  /**
   * Refs for the two preview iframes, which take turns: a run loads into the hidden one and they swap on `ready`.
   * Render both with `FRAME_SANDBOX` and `FRAME_ALLOW`, stacked with the `active` one on top. Keep the other one
   * rendered (not `display: none` or `visibility: hidden`), or the browser throttles its animation frames and
   * `ready` never comes.
   */
  frames: [RefObject<HTMLIFrameElement | null>, RefObject<HTMLIFrameElement | null>];
  /** Index of the frame showing the latest ready run */
  active: 0 | 1;
  /** Compiles and runs now */
  run: () => void;
  clearLogs: () => void;
}

interface Run {
  token: string;
  frame: 0 | 1;
  compiled?: Compiled;
}

const MAX_LOGS = 500;
/** How long the previous run stays under a new one, so the preview can crossfade */
const SWAP_MS = 300;
const LOCATION = /([^\s()@]+):(\d+):(\d+)/g;
const SITE_ASSETS = 'https://pixijs.com/assets/';

/**
 * Points the examples' `https://pixijs.com/assets/` URLs at this page's own origin when it isn't pixijs.com, so local,
 * served and preview builds load the assets they ship (including ones not deployed yet)
 */
function ownAssets(files: SourceFiles): SourceFiles {
  const local = `${location.origin}/assets/`;

  if (local === SITE_ASSETS) return files;

  return Object.fromEntries(Object.entries(files).map(([file, code]) => [file, code.replaceAll(SITE_ASSETS, local)]));
}

/** Swaps `data:` URLs for file names (WebKit ignores `sourceURL`) and finds the first location in a source file */
function locate(error: FrameError, compiled?: Compiled): RunnerError {
  if (!compiled) return error;
  const name = (text = '') => [...compiled.urlToFile].reduce((out, [url, file]) => out.split(url).join(file), text);
  const stack = name(error.stack);
  const file = name(error.file);
  const files = new Set(compiled.urlToFile.values());
  const [, at, line, column] = [...stack.matchAll(LOCATION)].find(([, path]) => files.has(path)) ?? [];

  if (at) return { ...error, stack, file: at, line: Number(line), column: Number(column) };

  return { ...error, stack, file: files.has(file) ? file : undefined };
}

/**
 * Runs source files in sandboxed iframes through the import-map runtime: compiles them, reruns after edits
 * (debounced), double-buffers the frames so a rerun never flashes, and collects console output and errors
 * @param options - Files and how to run them
 */
export function useRunner(options: RunnerOptions): Runner {
  const { files, entry = 'index.js', major = 8, dependencies, renderer, autoRun = true, delay = 400 } = options;
  const frameA = useRef<HTMLIFrameElement>(null);
  const frameB = useRef<HTMLIFrameElement>(null);
  const frames = useRef<Runner['frames']>([frameA, frameB]).current;
  const [status, setStatus] = useState<RunnerStatus>('idle');
  const [logs, setLogs] = useState<RunnerLog[]>([]);
  const [error, setError] = useState<RunnerError | null>(null);
  const [active, setActive] = useState<0 | 1>(0);
  const shown = useRef<0 | 1 | null>(null);
  const current = useRef<Run | null>(null);
  const latest = useRef({ files, entry, major, dependencies, renderer });
  const started = useRef(false);

  latest.current = { files, entry, major, dependencies, renderer };

  const run = useCallback(async () => {
    if (!HTMLScriptElement.supports?.('importmap')) {
      setStatus('unsupported');

      return;
    }
    const { files, entry, major, dependencies, renderer } = latest.current;
    const job: Run = { token: Math.random().toString(36).slice(2), frame: shown.current === 0 ? 1 : 0 };

    current.current = job;
    setStatus('running');
    setLogs([]);
    setError(null);
    try {
      job.compiled = await compile(ownAssets(files), entry);
      if (current.current !== job) return;
      const map = importMap(major, job.compiled.imports, dependencies);
      const srcdoc = buildSrcdoc(map, job.compiled.entryUrl, { run: job.token, renderer });
      const frame = frames[job.frame].current;

      if (frame) frame.srcdoc = srcdoc;
    } catch (reason) {
      if (current.current !== job) return;
      setError({ message: reason instanceof Error ? reason.message : String(reason) });
      setStatus('error');
    }
  }, [frames]);

  useEffect(() => {
    const onMessage = (event: MessageEvent<FrameMessage>) => {
      const job = current.current;

      if (!job || event.data?.run !== job.token || event.source !== frames[job.frame].current?.contentWindow) return;
      const message = event.data;

      if (message.type === 'console') {
        setLogs((all) => [...all.slice(1 - MAX_LOGS), message.data]);
      } else if (message.type === 'error') {
        setError((first) => first ?? locate(message.data, job.compiled));
      } else {
        const old = shown.current === null || shown.current === job.frame ? null : frames[shown.current].current;

        shown.current = job.frame;
        setActive(job.frame);
        setStatus('ready');
        // Freed once the new frame has faded in over it, unless a newer run has taken it over by then
        if (old) {
          setTimeout(() => {
            if (current.current === job) old.srcdoc = '';
          }, SWAP_MS);
        }
      }
    };

    addEventListener('message', onMessage);

    return () => {
      removeEventListener('message', onMessage);
      current.current = null;
      shown.current = null;
      started.current = false;
      for (const frame of frames) if (frame.current) frame.current.srcdoc = '';
    };
  }, [frames]);

  const key = useMemo(
    () => JSON.stringify([files, entry, major, dependencies, renderer]),
    [files, entry, major, dependencies, renderer],
  );

  useEffect(() => {
    if (started.current && !autoRun) return undefined;
    const timer = setTimeout(
      () => {
        started.current = true;
        run();
      },
      started.current ? delay : 0,
    );

    return () => clearTimeout(timer);
  }, [key, autoRun, delay, run]);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { status, logs, error, frames, active, run, clearLogs };
}
