import { type KeyboardEvent, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './classes';
import Icon from '@site/src/components/ui/Icon';

/** File names the runtime can run: scripts, and shader or text files it imports as strings */
const FILE_NAME = /^[\w-]+(\/[\w-]+)*\.(js|mjs|ts|frag|vert|glsl|wgsl|txt)$/;

/** `scene` → `scene.js`; a name with an extension keeps it */
const withExtension = (name: string) => (/\.[^/]*$/.test(name) ? name : `${name}.js`);

interface FileTabsProps {
  files: string[];
  active: string;
  onSelect: (file: string) => void;
  /** The file the current error points at, marked with a dot */
  errorFile?: string;
}

/** Tab labels: the file name, or the whole path where two files share a name */
function labelsOf(files: string[]): Record<string, { dir: string; stem: string; ext: string }> {
  const base = (file: string) => file.split('/').pop() ?? file;
  const shared = new Set(files.map(base).filter((name, index, all) => all.indexOf(name) !== index));

  return Object.fromEntries(
    files.map((file) => {
      const name = base(file);
      const dot = name.lastIndexOf('.');
      const dir = shared.has(name) ? file.slice(0, -name.length - 1) : '';

      return [file, { dir, stem: dot > 0 ? name.slice(0, dot) : name, ext: dot > 0 ? name.slice(dot) : '' }];
    }),
  );
}

/** One tab per visible file; arrow keys, Home and End move between them */
export default function FileTabs({ files, active, onSelect, errorFile }: FileTabsProps) {
  const list = useRef<HTMLDivElement>(null);
  const labels = useMemo(() => labelsOf(files), [files]);

  useLayoutEffect(() => {
    const el = list.current;
    const tab = el?.querySelector<HTMLElement>('[aria-selected="true"]');

    if (!el || !tab) return;
    if (tab.offsetLeft < el.scrollLeft) el.scrollLeft = tab.offsetLeft;
    else if (tab.offsetLeft + tab.offsetWidth > el.scrollLeft + el.clientWidth) {
      el.scrollLeft = tab.offsetLeft + tab.offsetWidth - el.clientWidth;
    }
  }, [active]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = files.indexOf(active);
    const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: files.length - 1 }[event.key];

    if (next === undefined) return;
    event.preventDefault();
    const file = files[(next + files.length) % files.length];

    onSelect(file);
    list.current?.querySelectorAll<HTMLElement>('[role="tab"]')[files.indexOf(file)]?.focus();
  };

  return (
    <div ref={list} role="tablist" aria-label="Files" className={styles.tabs} onKeyDown={onKeyDown}>
      {files.map((file) => {
        const { dir, stem, ext } = labels[file];
        const selected = file === active;

        return (
          <button
            key={file}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className={styles.tab}
            title={file}
            onClick={() => onSelect(file)}
          >
            {dir && <span className={styles.tabDim}>{dir}/</span>}
            {stem}
            <span className={styles.tabDim}>{ext}</span>
            {file === errorFile && <span className={styles.tabError} role="img" aria-label="has an error" />}
          </button>
        );
      })}
    </div>
  );
}

interface NewFileProps {
  files: string[];
  onAdd: (file: string) => void;
}

/** A `+` after the tabs that turns into a name field: Enter adds the file, Escape or an empty name cancels */
export function NewFile({ files, onAdd }: NewFileProps) {
  const [name, setName] = useState<string | null>(null);
  const file = withExtension(name?.trim() ?? '');
  const empty = !name?.trim();
  const invalid = !empty && (!FILE_NAME.test(file) || files.includes(file));

  if (name === null) {
    return (
      <button
        type="button"
        className={styles.addFile}
        aria-label="Add a file"
        title="Add a file"
        onClick={() => setName('')}
      >
        <Icon name="plus" size={16} />
      </button>
    );
  }

  const close = () => {
    if (!empty && !invalid) onAdd(file);
    setName(null);
  };

  return (
    <input
      autoFocus
      className={styles.newFile}
      value={name}
      placeholder="scene.js"
      aria-label="New file name"
      aria-invalid={invalid}
      title={invalid ? 'Use a new name ending in .js, .ts, .frag, .vert, .glsl, .wgsl or .txt' : undefined}
      spellCheck={false}
      autoCapitalize="off"
      autoComplete="off"
      onChange={(event) => setName(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !invalid) close();
        if (event.key === 'Escape') {
          event.stopPropagation();
          setName(null);
        }
      }}
      onBlur={() => (invalid ? setName(null) : close())}
    />
  );
}
