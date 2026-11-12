import { useColorMode } from '@docusaurus/theme-common';
import { type Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './classes';
import CodePreview, { isTouch, lineHeightFor } from './CodePreview';
import { loadMonaco, loadTypes, monacoRequested } from './Monaco/setup';
import { monacoTheme } from './Monaco/theme';
import { languageOf } from './project';

import type { Monaco } from '@monaco-editor/react';
import type { SourceFiles } from '@site/src/runtime/compile';
import type { RunnerError } from '@site/src/runtime/useRunner';
import type { editor } from 'monaco-editor';

export interface CodeEditorHandle {
  /** Opens `file` with the cursor at `line` and focuses the editor */
  reveal: (file: string, line: number, column?: number) => void;
  format: () => void;
}

export interface CodeEditorProps {
  ref?: Ref<CodeEditorHandle>;
  /** The files at mount; edits come back through `onChange` */
  sources: SourceFiles;
  active: string;
  onChange: (file: string, code: string) => void;
  /** ⌘/Ctrl + Enter */
  onRun: () => void;
  error: RunnerError | null;
  fontSize: number;
  pixiVersion: string;
  with3d: boolean;
  /** Whether the preview has run once (or there's none); Monaco loads when the page is next idle after that */
  settled: boolean;
}

let editors = 0;

/** `requestIdleCallback`, or a timer where there's none (Safari) */
const whenIdle = (callback: () => void): number =>
  typeof requestIdleCallback === 'function'
    ? requestIdleCallback(callback, { timeout: 3000 })
    : window.setTimeout(callback, 1500);

const cancelIdle = (id: number) =>
  typeof cancelIdleCallback === 'function' ? cancelIdleCallback(id) : window.clearTimeout(id);

/** Monaco with one model per file, so imports between the files resolve for completions and hovers */
export default function CodeEditor(props: CodeEditorProps) {
  const { ref, sources, active, error, fontSize, pixiVersion, with3d, settled } = props;
  const host = useRef<HTMLDivElement>(null);
  const [monaco, setMonaco] = useState<Monaco | null>(null);
  const [instance, setInstance] = useState<editor.IStandaloneCodeEditor | null>(null);
  const models = useRef(new Map<string, editor.ITextModel>());
  const folder = useRef('');
  const views = useRef(new Map<string, editor.ICodeEditorViewState | null>());
  const shown = useRef(active);
  /** Starts loading Monaco, once; a no-op after that */
  const loadNow = useRef(() => {});
  /** What the reader asked for before Monaco was there, done once it is */
  const whenCreated = useRef<((created: editor.IStandaloneCodeEditor) => void) | null>(null);
  const latest = useRef(props);
  const { colorMode } = useColorMode();
  const touch = isTouch();
  const size = touch ? 16 : fontSize;

  latest.current = props;

  const createModel = (loaded: Monaco, file: string, code: string) => {
    const model = loaded.editor.createModel(code, languageOf(file), loaded.Uri.parse(folder.current + file));

    model.onDidChangeContent(() => latest.current.onChange(file, model.getValue()));

    return model;
  };

  /** Runs `action` on the editor, loading Monaco first if the page hasn't yet */
  const withEditor = (action: (created: editor.IStandaloneCodeEditor) => void) => {
    if (instance) {
      action(instance);
    } else {
      whenCreated.current = action;
      loadNow.current();
    }
  };

  // Starting Monaco holds the main thread for a while, so the Prism copy shows until the page is idle after the
  // preview's first run (or a few seconds without one), unless the reader reaches for the code first
  useEffect(() => {
    const pane = host.current?.parentElement;
    let live = true;
    const start = () => {
      loadNow.current = () => {};
      pane?.removeEventListener('pointerdown', onPointerDown);
      loadMonaco().then(
        (loaded) => live && setMonaco(loaded),
        (error: unknown) => console.warn("Editor: Monaco didn't load, so the code is read-only", error),
      );
    };
    // The Prism copy lays out like Monaco, so the caret lands where the reader tapped, once Monaco has drawn its lines
    // where the Prism copy was (a few frames at most)
    const onPointerDown = ({ clientX, clientY }: PointerEvent) => {
      const place = (created: editor.IStandaloneCodeEditor, frames: number) =>
        requestAnimationFrame(() => {
          const position = created.getTargetAtClientPoint(clientX, clientY)?.position;

          if (!position && frames > 0) {
            place(created, frames - 1);
          } else {
            if (position) created.setPosition(position);
            created.focus();
          }
        });

      whenCreated.current ??= (created) => place(created, 10);
      start();
    };

    if (monacoRequested()) {
      start();
    } else {
      loadNow.current = start;
      pane?.addEventListener('pointerdown', onPointerDown);
    }

    return () => {
      live = false;
      loadNow.current = () => {};
      pane?.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  useEffect(() => {
    if (!settled) {
      const timer = setTimeout(() => loadNow.current(), 8000);

      return () => clearTimeout(timer);
    }
    const idle = whenIdle(() => loadNow.current());

    return () => cancelIdle(idle);
  }, [settled]);

  useEffect(() => {
    if (monaco) loadTypes(monaco, pixiVersion, with3d);
  }, [monaco, pixiVersion, with3d]);

  useEffect(() => {
    if (!monaco || !host.current) return undefined;
    const files = models.current;

    folder.current = `file:///editor-${++editors}/`;
    for (const [file, code] of Object.entries(latest.current.sources)) files.set(file, createModel(monaco, file, code));

    const created = monaco.editor.create(host.current, {
      model: files.get(shown.current) ?? null,
      theme: monacoTheme(colorMode),
      fontFamily: getComputedStyle(host.current).getPropertyValue('--px-font-mono').trim(),
      fontSize: size,
      lineHeight: lineHeightFor(size),
      lineNumbers: touch ? 'off' : 'on',
      lineNumbersMinChars: 3,
      lineDecorationsWidth: 12,
      glyphMargin: false,
      folding: !touch,
      showFoldingControls: 'mouseover',
      wordWrap: 'on',
      links: false,
      tabSize: 2,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
      automaticLayout: true,
      fixedOverflowWidgets: true,
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      overviewRulerBorder: false,
      renderLineHighlight: 'line',
      renderLineHighlightOnlyWhenFocus: true,
      stickyScroll: { enabled: false },
      bracketPairColorization: { enabled: false },
      guides: { bracketPairs: false, indentation: true },
      cursorBlinking: 'smooth',
      smoothScrolling: true,
      scrollbar: {
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
        useShadows: false,
        alwaysConsumeMouseWheel: false,
      },
    });

    created.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => latest.current.onRun());
    // On touch screens Monaco adds a tap-to-type button, an unlabelled textarea; asking for it creates it now
    created.getContribution('editor.contrib.iPadShowKeyboard');
    host.current.querySelector('.iPadShowKeyboard')?.setAttribute('aria-label', 'Show keyboard');
    whenCreated.current?.(created);
    whenCreated.current = null;
    setInstance(created);

    return () => {
      created.dispose();
      for (const model of files.values()) model.dispose();
      files.clear();
      setInstance(null);
    };
    // Built once per Monaco: theme, options and the active file update through the effects below
  }, [monaco]);

  useEffect(() => {
    if (monaco) monaco.editor.setTheme(monacoTheme(colorMode));
  }, [monaco, colorMode]);

  useEffect(() => {
    instance?.updateOptions({ fontSize: size, lineHeight: lineHeightFor(size) });
  }, [instance, size]);

  // Files added or deleted after mount get or lose their model
  useEffect(() => {
    if (!monaco || !instance) return;
    const files = models.current;

    for (const [file, code] of Object.entries(sources))
      if (!files.has(file)) files.set(file, createModel(monaco, file, code));
    for (const [file, model] of files) {
      if (file in sources) continue;
      if (shown.current === file) {
        shown.current = latest.current.active;
        instance.setModel(files.get(shown.current) ?? null);
      }
      model.dispose();
      files.delete(file);
      views.current.delete(file);
    }
  }, [monaco, instance, sources]);

  useEffect(() => {
    const model = models.current.get(active);

    if (!instance || !model || shown.current === active) return;
    views.current.set(shown.current, instance.saveViewState());
    instance.setModel(model);
    instance.restoreViewState(views.current.get(active) ?? null);
    shown.current = active;
  }, [instance, active]);

  useEffect(() => {
    if (!monaco) return;
    for (const [file, model] of models.current) {
      const here = error?.file === file && error.line;

      monaco.editor.setModelMarkers(
        model,
        'runner',
        here
          ? [
              {
                severity: monaco.MarkerSeverity.Error,
                message: error.message,
                startLineNumber: error.line ?? 1,
                startColumn: error.column ?? 1,
                endLineNumber: error.line ?? 1,
                endColumn: model.getLineMaxColumn(error.line ?? 1),
              },
            ]
          : [],
      );
    }
  }, [monaco, instance, error]);

  useImperativeHandle(
    ref,
    () => ({
      reveal(file, line, column = 1) {
        withEditor((target) => {
          const model = models.current.get(file);

          if (!model) return;
          if (shown.current !== file) {
            views.current.set(shown.current, target.saveViewState());
            target.setModel(model);
            shown.current = file;
          }
          target.revealLineInCenter(line);
          target.setPosition({ lineNumber: line, column });
          target.focus();
        });
      },
      format() {
        withEditor((target) => target.getAction('editor.action.formatDocument')?.run());
      },
    }),
    [instance],
  );

  return (
    <div className={styles.monaco}>
      <div ref={host} className={styles.monacoHost} data-ready={instance ? '' : undefined} />
      {!instance && <CodePreview code={sources[active] ?? ''} language={languageOf(active)} fontSize={fontSize} />}
    </div>
  );
}
