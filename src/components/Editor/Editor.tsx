import ErrorBoundary from '@docusaurus/ErrorBoundary';
import clsx from 'clsx';
import {
  type CSSProperties,
  lazy,
  type RefObject,
  Suspense,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import styles, { STYLESHEET } from './classes';
import { type CodeEditorHandle } from './CodeEditor';
import CodePreview, { lineHeightFor } from './CodePreview';
import { downloadHtml, type ExportOptions, openInStackBlitz } from './export';
import FileTabs, { NewFile } from './FileTabs';
import Menu from './Menu';
import { type EditorFiles, imports3d, languageOf, toProject } from './project';
import ConsolePanel, { toneOf } from './Runner/ConsolePanel';
import ErrorOverlay from './Runner/ErrorOverlay';
import RunnerFrame from './Runner/RunnerFrame';
import SplitHandle, { useSplit } from './SplitHandle';
import Button from '@site/src/components/ui/Button';
import Icon, { type IconName } from '@site/src/components/ui/Icon';
import { isPreV8, usePixiVersion } from '@site/src/hooks/usePixiVersion';
import { type RunnerError, useRunner } from '@site/src/runtime/useRunner';

import type { SourceFiles } from '@site/src/runtime/compile';
import type { Renderer } from '@site/src/runtime/frame';

export type { EditorFile, EditorFiles } from './project';

const CodeEditor = lazy(() => import('./CodeEditor'));

export interface EditorProps {
  /** Panes to show: code and preview side by side (`both`), or one of them */
  viewType?: 'both' | 'editor' | 'preview';
  /** Opens the console under the preview */
  showConsole?: boolean;
  width?: number | string;
  /** The whole editor's height; with `layout="stack"`, the preview's */
  height?: number | string;
  /** Version ranges for packages the code imports that the runtime doesn't pin */
  dependencies?: Record<string, string>;
  files?: EditorFiles;
  fontSize?: number;
  /** Called with every file each time one is edited */
  onFilesChange?: (files: SourceFiles) => void;
  /** Adds `@pixi/3d`'s types (they also load when the code imports it) and sets the package accent */
  pkg?: '2d' | '3d';
  /**
   * `split`: code beside the preview when there's room, the preview over the code in a tall narrow box, else one at a
   * time under tabs; `stack`: the preview, then the code
   */
  layout?: 'split' | 'stack';
  /** Narrowest a `split` editor puts the code beside the preview, in px; a narrower one that's tall enough stacks them */
  rowFrom?: number;
  /** Image shown until the first run draws */
  poster?: string;
  /** Names exported projects */
  name?: string;
  /** Forces pixi.js's renderer preference */
  renderer?: Renderer;
  /** The pane shown first when the editor is narrow enough for tabs */
  initialPane?: Pane;
  /** A draggable divider between code and preview when they sit side by side */
  resizable?: boolean;
  /** Lets the reader add files (a `+` after the tabs) and delete the open one (in the menu) */
  editableFiles?: boolean;
  className?: string;
}

type Pane = 'code' | 'preview' | 'log';
type Arrangement = 'row' | 'column' | 'tabs';

const DEFAULT_FILES: EditorFiles = { 'index.js': '// Your code here' };

/** How far past a breakpoint a resize has to go before a laid-out editor changes arrangement, in px */
const HYSTERESIS = 24;

function arrange(width: number, height: number, rowFrom: number): Arrangement {
  if (width < 560) return 'tabs';
  if (height >= 560 && (height > width || (width >= 720 && width < rowFrom))) return 'column';

  return width < 720 ? 'tabs' : 'row';
}

/** Keeps `current` while the size is within `HYSTERESIS` of where it still applies, so a scrollbar can't flip it */
function rearrange(current: Arrangement, width: number, height: number, rowFrom: number): Arrangement {
  const near = [-HYSTERESIS, HYSTERESIS].flatMap((dw) =>
    [-HYSTERESIS, HYSTERESIS].map((dh) => arrange(width + dw, height + dh, rowFrom)),
  );

  return near.includes(current) ? current : arrange(width, height, rowFrom);
}

/**
 * How a split editor lays out at its size. It's measured before paint and every change is rendered in the same frame
 * as the resize that caused it, so the editor never paints a frame in the wrong layout.
 */
function useArrangement(ref: RefObject<HTMLElement | null>, split: boolean, rowFrom: number): Arrangement {
  const [arrangement, setArrangement] = useState<Arrangement>('row');

  useLayoutEffect(() => {
    const el = ref.current;

    if (!el || !split) {
      setArrangement('row');

      return undefined;
    }
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      flushSync(() => setArrangement((current) => rearrange(current, width, height, rowFrom)));
    });

    setArrangement(arrange(el.clientWidth, el.clientHeight, rowFrom));
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, split, rowFrom]);

  return arrangement;
}

/**
 * Code editor and live preview on the import-map runtime (`src/runtime`): Monaco with file tabs, double-buffered
 * preview frames, a console, an error card, and export to StackBlitz or a single HTML file. A new `files` prop
 * starts over.
 */
export default function Editor(props: EditorProps) {
  const key = useMemo(() => JSON.stringify(props.files ?? null), [props.files]);

  return <EditorBody key={key} {...props} />;
}

function EditorBody({
  viewType = 'both',
  showConsole = false,
  width = '100%',
  height = '100%',
  dependencies,
  files = DEFAULT_FILES,
  fontSize = 14,
  onFilesChange,
  pkg = '2d',
  layout = 'split',
  rowFrom = 720,
  poster,
  name = 'pixijs-example',
  renderer,
  initialPane,
  resizable,
  editableFiles,
  className,
}: EditorProps) {
  const [project] = useState(() => toProject(files));
  const [sources, setSources] = useState(project.sources);
  const [active, setActive] = useState(project.active);
  const [revision, setRevision] = useState(0);
  const [autoRun, setAutoRun] = useState(true);
  const [consoleOpen, setConsoleOpen] = useState(showConsole);
  const [pane, setPane] = useState<Pane>(initialPane ?? (viewType === 'editor' ? 'code' : 'preview'));
  const [split, setSplit] = useSplit();
  const [drawn, setDrawn] = useState(false);
  const [dismissed, setDismissed] = useState<RunnerError | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const code = useRef<CodeEditorHandle>(null);
  const consoleId = useId();
  const latest = useRef(sources);
  const pixiVersion = usePixiVersion();
  const major = isPreV8(pixiVersion) ? 7 : 8;
  const runner = useRunner({ files: sources, entry: project.entry, major, dependencies, renderer, autoRun });
  const showCode = viewType !== 'preview';
  const showPreview = viewType !== 'editor';
  const arrangement = useArrangement(root, layout === 'split' && showCode && showPreview, rowFrom);
  const tabbed = arrangement === 'tabs';
  const splitting = resizable && arrangement === 'row' && showCode && showPreview;
  const error = runner.error && runner.error !== dismissed ? runner.error : null;
  const logCount = runner.logs.length + (runner.error ? 1 : 0);
  const tone = toneOf(runner.logs, runner.error);
  const exportOptions: ExportOptions = { files: sources, entry: project.entry, major, dependencies, name };
  const visible = [
    ...project.visible.filter((file) => file in sources),
    ...Object.keys(sources).filter((file) => !(file in project.sources)),
  ];

  useEffect(() => {
    if (runner.status === 'ready') setDrawn(true);
  }, [runner.status]);

  const update = (next: SourceFiles) => {
    latest.current = next;
    setSources(next);
    onFilesChange?.(next);
  };

  const onChange = (file: string, value: string) => update({ ...latest.current, [file]: value });

  const addFile = (file: string) => {
    update({ ...latest.current, [file]: '' });
    setActive(file);
  };

  const deleteFile = (file: string) => {
    const { [file]: _deleted, ...rest } = latest.current;

    update(rest);
    setActive(project.entry);
  };

  const reset = () => {
    update(project.sources);
    setActive(project.active);
    setRevision(revision + 1);
  };

  const reveal = (target: RunnerError) => {
    if (!target.file) return;
    setPane('code');
    setActive(target.file);
    code.current?.reveal(target.file, target.line ?? 1, target.column);
  };

  const running = showPreview && runner.status === 'running';
  const codeHeight = Math.min(
    400,
    Math.max(200, (project.sources[project.active] ?? '').split('\n').length * lineHeightFor(fontSize) + 32),
  );
  const codePreview = <CodePreview code={sources[active] ?? ''} language={languageOf(active)} fontSize={fontSize} />;
  const tabs: [Pane, string, IconName][] = [
    ['code', 'Code', 'code'],
    ['preview', 'Preview', 'play'],
    ['log', 'Console', 'terminal'],
  ];

  return (
    <div
      ref={root}
      className={clsx(styles.editor, className)}
      data-verify="editor"
      data-package={pkg}
      data-layout={layout}
      data-view={viewType}
      data-arrangement={arrangement}
      data-pane={tabbed ? pane : undefined}
      style={
        {
          width,
          height: layout === 'stack' ? undefined : height,
          '--ed-preview-h': typeof height === 'number' ? `${height}px` : height,
          '--ed-code-h': `${codeHeight}px`,
          ...(splitting && {
            '--ed-split': split,
            '--ed-code-fr': `${split * 100}fr`,
            '--ed-preview-fr': `${100 - split * 100}fr`,
          }),
        } as CSSProperties
      }
    >
      {/* The editor's stylesheet, which React hoists into the head once per page (see classes.ts) */}
      <style href="px-editor" precedence="default">
        {STYLESHEET}
      </style>
      {showCode && (
        <div className={styles.header}>
          {tabbed && pane !== 'code' ? (
            <span className={styles.headerTitle}>{pane === 'log' ? 'Console' : 'Preview'}</span>
          ) : (
            <>
              <FileTabs files={visible} active={active} onSelect={setActive} errorFile={error?.file} />
              {editableFiles && <NewFile files={Object.keys(sources)} onAdd={addFile} />}
            </>
          )}
          <div className={styles.actions}>
            {showPreview && !tabbed && (
              <button
                type="button"
                className={styles.consoleButton}
                aria-label="Console"
                title="Console"
                aria-expanded={consoleOpen}
                aria-controls={consoleOpen ? consoleId : undefined}
                onClick={() => setConsoleOpen(!consoleOpen)}
              >
                <Icon name="terminal" size={16} />
                {logCount > 0 && (
                  <span key={logCount} className={styles.count} data-tone={tone}>
                    {logCount}
                  </span>
                )}
              </button>
            )}
            <Button
              variant="small"
              icon={running ? 'loader-circle' : 'play'}
              className={styles.run}
              data-manual={autoRun ? undefined : ''}
              data-running={running ? '' : undefined}
              title={`Run (${/Mac|iP/.test(navigator.platform) ? '⌘' : 'Ctrl'} + Enter)`}
              onClick={runner.run}
            >
              Run
            </Button>
            <Menu
              label="More actions"
              items={[
                { label: 'Auto-run', icon: 'zap', checked: autoRun, onSelect: () => setAutoRun(!autoRun) },
                { label: 'Format code', icon: 'wand-sparkles', onSelect: () => code.current?.format() },
                'separator',
                { label: 'Open in StackBlitz', icon: 'external', onSelect: () => openInStackBlitz(exportOptions) },
                { label: 'Download HTML', icon: 'download', onSelect: () => downloadHtml(exportOptions) },
                'separator',
                ...(editableFiles && active !== project.entry
                  ? [{ label: `Delete ${active}`, icon: 'trash-2' as const, onSelect: () => deleteFile(active) }]
                  : []),
                { label: 'Reset code', icon: 'rotate-ccw', disabled: sources === project.sources, onSelect: reset },
              ]}
            />
          </div>
        </div>
      )}

      {showCode && (
        <div className={styles.code} inert={tabbed && pane !== 'code' ? true : undefined}>
          <ErrorBoundary fallback={() => codePreview}>
            <Suspense fallback={codePreview}>
              <CodeEditor
                key={revision}
                ref={code}
                sources={sources}
                active={active}
                onChange={onChange}
                onRun={runner.run}
                error={runner.error}
                fontSize={fontSize}
                pixiVersion={pixiVersion}
                with3d={pkg === '3d' || imports3d(sources)}
                settled={!showPreview || drawn || runner.status === 'error' || runner.status === 'unsupported'}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}

      {showPreview && (
        <div
          className={styles.preview}
          data-verify="editor-preview"
          inert={tabbed && pane === 'code' ? true : undefined}
        >
          <div className={styles.stage}>
            <RunnerFrame runner={runner} title={`${name} preview`} />
            <div
              className={styles.cover}
              data-hidden={drawn ? '' : undefined}
              style={poster ? { backgroundImage: `url(${poster})`, backgroundSize: 'cover' } : undefined}
              aria-hidden="true"
            >
              <Icon name="loader-circle" size={22} className={styles.spinner} />
            </div>
            <div className={styles.progress} data-on={running ? '' : undefined} />
            {runner.status === 'unsupported' && (
              <p className={styles.notice}>
                This browser can&apos;t run the live editor. It needs import maps: Chrome 89, Safari 16.4 or Firefox 108
                and later.
              </p>
            )}
            {error && (
              <ErrorOverlay
                error={error}
                onReveal={showCode && error.file ? () => reveal(error) : undefined}
                onDismiss={() => setDismissed(error)}
              />
            )}
          </div>
          {(tabbed ? pane === 'log' : consoleOpen || (!showCode && showConsole)) && (
            <ConsolePanel
              id={consoleId}
              logs={runner.logs}
              error={runner.error}
              open={tabbed || consoleOpen}
              onToggle={tabbed ? undefined : () => setConsoleOpen(!consoleOpen)}
              onClear={runner.clearLogs}
            />
          )}
        </div>
      )}

      {splitting && <SplitHandle root={root} ratio={split} onChange={setSplit} />}

      {tabbed && (
        <div role="tablist" aria-label="View" className={styles.tabbar} data-verify="editor-tabs">
          {tabs.map(([value, label, icon]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={pane === value}
              className={styles.tabbarItem}
              onClick={() => setPane(value)}
            >
              <Icon name={icon} size={16} />
              {label}
              {value === 'log' && logCount > 0 && (
                <span key={logCount} className={styles.count} data-tone={tone}>
                  {logCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
