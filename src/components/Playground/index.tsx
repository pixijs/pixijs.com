import { useHistory, useLocation } from '@docusaurus/router';
import { useEffect, useRef, useState } from 'react';
import { decodeState, encodeState, HASH_THRESHOLD, stateParam } from './state';
import V7Starter from '!!raw-loader!./v7.0.0/container';
import V8Starter from '!!raw-loader!./v8.0.0/container';
import { playgroundHref } from '@site/src/components/Editor/ExampleCard';
import LazyEditor from '@site/src/components/Editor/LazyEditor';
import styles, { ExamplesStyles } from '@site/src/components/Examples/classes';
import { fetchExampleFiles, getExample, posterOf, titleOf } from '@site/src/components/Examples/data';
import ExampleSheet from '@site/src/components/Examples/ExampleSheet';
import { EditorSkeleton } from '@site/src/components/Examples/ExampleView';
import Button from '@site/src/components/ui/Button';
import Icon from '@site/src/components/ui/Icon';
import { isPreV8, usePixiVersion } from '@site/src/hooks/usePixiVersion';
import PackageSwitch from '@site/src/shell/PackageSwitch';
import { usePackages } from '@site/src/shell/package';

import type { Item } from '@site/src/components/Examples/types';
import type { PackageId } from '@site/src/data/packages';
import type { SourceFiles } from '@site/src/runtime/compile';
import type { Renderer } from '@site/src/runtime/frame';
import type { MouseEvent } from 'react';

/** What the editor opened with: the starter, a gallery example, or a share link's state */
interface Session {
  /** Remounts the editor */
  key: string;
  files: SourceFiles;
  example?: Item;
  shared?: boolean;
  renderer?: Renderer;
  /** Why the address didn't open, shown above the starter */
  notice?: string;
}

/** A navigation held back while the editor has unsaved edits */
interface Pending {
  href: string;
  question: string;
  action: string;
}

const STARTER_3D = 'basics_hello-cube';
let sessions = 0;
const RENDERERS: { value: Renderer | ''; label: string }[] = [
  { value: '', label: 'Auto' },
  { value: 'webgpu', label: 'WebGPU' },
  { value: 'webgl', label: 'WebGL' },
];

async function starter(pkg: PackageId, v7: boolean): Promise<SourceFiles> {
  if (pkg === '2d') return { 'index.js': v7 ? V7Starter : V8Starter };
  const cube = getExample(STARTER_3D, '3d');

  if (!cube) throw new Error("The 3D starter isn't in this build");

  return fetchExampleFiles(cube);
}

/** Reads the address: `#state=` or `?state=` (a share link), then `?example=`, else the package's starter */
async function open(search: string, hash: string, pkg: PackageId, v7: boolean): Promise<Session> {
  const key = String(++sessions);
  const state = stateParam(search, hash);
  const name = new URLSearchParams(search).get('example');
  let notice: string | undefined;

  if (state) {
    const shared = await decodeState(state);

    if (shared) return { key, ...shared, shared: true };
    notice = "That share link couldn't be read, so here's the starter.";
  } else if (name && !v7) {
    const example = getExample(name, pkg);

    if (example) return { key, example, files: await fetchExampleFiles(example) };
    notice = `There's no ${pkg.toUpperCase()} example called “${name}”, so here's the starter.`;
  }

  return { key, files: await starter(pkg, v7), notice };
}

/**
 * The playground (`/playground`, `/3d/playground`, `/7.x/playground`): the editor full screen under a toolbar with the
 * 2D / 3D switch, the example picker, the renderer choice (3D) and Share. Edits go into the address as a compressed
 * `?state=v2.` (the first edit adds a history entry, later ones replace it), so every sketch is a link.
 */
export default function PlaygroundPage({ pkg: requested = '2d' }: { pkg?: PackageId }) {
  const v7 = isPreV8(usePixiVersion());
  const pkg = v7 ? '2d' : requested;
  const { pathname, search, hash, key: visit } = useLocation();
  const router = useHistory();
  const packages = usePackages();
  const [session, setSession] = useState<Session | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [renderer, setRenderer] = useState<Renderer | undefined>(undefined);
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const files = useRef<SourceFiles>({});
  const pushed = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let stale = false;

    open(search, hash, pkg, v7).then(
      (next) => {
        if (stale) return;
        files.current = next.files;
        pushed.current = false;
        setSession(next);
        setRenderer(next.renderer);
        setDirty(false);
        setPending(null);
        setFailure(null);
      },
      (error: unknown) => !stale && setFailure(error instanceof Error ? error.message : "The playground didn't load"),
    );

    return () => {
      stale = true;
      clearTimeout(timer.current);
    };
    // `visit` changes on every navigation, so opening the address the editor started from starts over
  }, [search, hash, pkg, v7, visit]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 2400);

    return () => clearTimeout(id);
  }, [toast]);

  /** Puts the current code in the address; the router isn't told, so the editor keeps its state */
  const save = async (nextRenderer = renderer) => {
    clearTimeout(timer.current);
    const state = await encodeState({ files: files.current, renderer: nextRenderer });
    const url = `${pathname}${state.length > HASH_THRESHOLD ? '#' : '?'}state=${state}`;

    history[pushed.current ? 'replaceState' : 'pushState'](history.state, '', url);
    pushed.current = true;
  };

  const onFilesChange = (next: SourceFiles) => {
    files.current = next;
    setDirty(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(save, 400);
  };

  const share = async () => {
    if (dirty) await save();
    try {
      await navigator.clipboard.writeText(location.href);
      setToast('Link copied');
    } catch {
      setToast('Copy the address bar to share');
    }
  };

  /** Asks before a link replaces edited code; the edits stay one step back in the browser's history */
  const guard = (event: MouseEvent, href: string, question: string, action: string) => {
    if (!dirty || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    setPending({ href, question, action });
  };

  const onSwitch = (event: MouseEvent<HTMLElement>) => {
    const link = (event.target as HTMLElement).closest('a');
    const other = pkg === '2d' ? '3d' : '2d';

    if (!link || link.getAttribute('aria-current')) return;
    guard(
      event,
      link.getAttribute('href') ?? '',
      `Start a new ${packages[other].label} sketch? Your ${packages[pkg].label} code stays in your browser history.`,
      `Start ${packages[other].label} sketch`,
    );
  };

  const label = session?.example
    ? titleOf(session.example)
    : dirty
      ? 'Your sketch'
      : session?.shared
        ? 'Shared sketch'
        : 'Starter';

  return (
    <div className={styles.pg} data-package={pkg} data-v7={v7 ? '' : undefined}>
      <ExamplesStyles />
      <div className={styles.pgBar} data-verify="playground-toolbar">
        {!v7 && (
          <span className={styles.pgSwitch} onClickCapture={onSwitch}>
            <PackageSwitch section="playground" />
          </span>
        )}
        {!v7 && (
          <Button
            variant="small"
            icon="layout-grid"
            className={styles.pgExamples}
            aria-label="Examples"
            onClick={() => setSheetOpen(true)}
          >
            Examples
          </Button>
        )}
        <h1 className={styles.pgTitle}>
          <span>{v7 ? 'PixiJS v7 playground' : 'Playground'}</span>
          <span className={styles.pgLabel} data-dirty={dirty ? '' : undefined}>
            {label}
          </span>
        </h1>
        {pkg === '3d' && (
          <label className={styles.select} title="Renderer">
            <Icon name="cpu" size={16} />
            <select
              aria-label="Renderer"
              value={renderer ?? ''}
              onChange={(event) => {
                const next = (event.target.value || undefined) as Renderer | undefined;

                setRenderer(next);
                void save(next);
              }}
            >
              {RENDERERS.map(({ value, label: text }) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
            <Icon name="chevron-down" size={14} />
          </label>
        )}
        <Button variant="small" icon="link" className={styles.pgShare} aria-label="Share" onClick={share}>
          <span className={styles.pgShareLabel}>Share</span>
        </Button>
      </div>
      {(pending || session?.notice) && (
        <div className={styles.pgAsk} role={pending ? 'alert' : 'status'}>
          <Icon name="info" size={16} />
          <p>{pending ? pending.question : session?.notice}</p>
          {pending && (
            <>
              <Button variant="small" className={styles.pgConfirm} onClick={() => router.push(pending.href)}>
                {pending.action}
              </Button>
              <button type="button" className={styles.textButton} onClick={() => setPending(null)}>
                Keep editing
              </button>
            </>
          )}
        </div>
      )}
      <div className={styles.pgStage}>
        <EditorSkeleton poster={session?.example && posterOf(session.example)} />
        {failure ? (
          <p className={styles.failure}>
            <Icon name="circle-alert" size={18} />
            {failure}. Reload the page to try again.
          </p>
        ) : (
          session && (
            <LazyEditor
              key={session.key}
              files={session.files}
              dependencies={session.example?.dependencies}
              pkg={pkg}
              name={session.example?.name ?? 'pixijs-playground'}
              renderer={renderer}
              initialPane={session.example || session.shared ? 'preview' : 'code'}
              resizable
              editableFiles
              onFilesChange={onFilesChange}
              className={styles.editor}
            />
          )
        )}
      </div>
      {!v7 && (
        <ExampleSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          pkg={pkg}
          current={session?.example}
          hrefOf={(item) => playgroundHref(packages[item.pkg], item.name)}
          onNavigate={(event, item) =>
            guard(
              event,
              event.currentTarget.getAttribute('href') ?? '',
              `Open “${titleOf(item)}”? Your code stays in your browser history.`,
              'Open example',
            )
          }
        />
      )}
      <p className={styles.toast} role="status" data-show={toast ? '' : undefined}>
        {toast && <Icon name="check" size={16} />}
        {toast}
      </p>
    </div>
  );
}
