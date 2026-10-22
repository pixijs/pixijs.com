import { useLayoutEffect, useMemo, useRef } from 'react';
import styles from '../classes';
import Icon, { type IconName } from '@site/src/components/ui/Icon';

import type { ConsoleLevel } from '@site/src/runtime/frame';
import type { RunnerError, RunnerLog } from '@site/src/runtime/useRunner';

interface Entry {
  level: ConsoleLevel;
  text: string;
  count: number;
}

const ICONS: Partial<Record<ConsoleLevel, IconName>> = {
  warn: 'triangle-alert',
  error: 'circle-alert',
  info: 'info',
};

/** Consecutive identical lines fold into one with a count, as in browser devtools; an uncaught error comes last */
function entriesOf(logs: RunnerLog[], error: RunnerError | null): Entry[] {
  const entries: Entry[] = [];

  for (const { level, args } of logs) {
    const text = args.join(' ');
    const last = entries.at(-1);

    if (last?.level === level && last.text === text) last.count++;
    else entries.push({ level, text, count: 1 });
  }
  if (error) entries.push({ level: 'error', text: error.stack || error.message, count: 1 });

  return entries;
}

/** The badge colour for a run's output: `error` if anything failed, else `warn` if anything warned */
export function toneOf(logs: RunnerLog[], error: RunnerError | null): 'error' | 'warn' | undefined {
  if (error || logs.some((log) => log.level === 'error')) return 'error';
  if (logs.some((log) => log.level === 'warn')) return 'warn';

  return undefined;
}

interface ConsolePanelProps {
  id: string;
  logs: RunnerLog[];
  error: RunnerError | null;
  open: boolean;
  /** Omitted when the panel can't collapse (the Log tab on narrow editors) */
  onToggle?: () => void;
  onClear: () => void;
}

/** Console output of the latest run, under the preview */
export default function ConsolePanel({ id, logs, error, open, onToggle, onClear }: ConsolePanelProps) {
  const body = useRef<HTMLOListElement>(null);
  const pinned = useRef(true);
  const entries = useMemo(() => entriesOf(logs, error), [logs, error]);
  const count = logs.length + (error ? 1 : 0);
  const tone = toneOf(logs, error);

  useLayoutEffect(() => {
    const list = body.current;

    if (list && pinned.current) list.scrollTop = list.scrollHeight;
  }, [entries, open]);

  return (
    <section id={id} className={styles.console} data-open={open ? '' : undefined} data-verify="editor-console">
      <div className={styles.consoleHead}>
        {onToggle ? (
          <button
            type="button"
            className={styles.consoleToggle}
            aria-expanded={open}
            aria-controls={`${id}-body`}
            onClick={onToggle}
          >
            <Icon name="chevron-down" size={14} className={styles.chevron} />
            <Icon name="terminal" size={15} />
            <span>Console</span>
            <span key={count} className={styles.count} data-tone={tone} aria-label={`${count} messages`}>
              {count}
            </span>
          </button>
        ) : (
          <p className={styles.consoleSummary}>{count === 1 ? '1 message' : `${count} messages`}</p>
        )}
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Clear console"
          title="Clear console"
          disabled={count === 0}
          onClick={onClear}
        >
          <Icon name="ban" size={15} />
        </button>
      </div>
      <ol
        ref={body}
        id={`${id}-body`}
        className={styles.consoleBody}
        hidden={!open}
        onScroll={(event) => {
          const list = event.currentTarget;

          pinned.current = list.scrollHeight - list.scrollTop - list.clientHeight < 24;
        }}
      >
        {entries.length === 0 ? (
          <li className={styles.consoleEmpty}>
            Nothing logged yet. Output from <code>console.log()</code> shows up here.
          </li>
        ) : (
          entries.map(({ level, text, count: repeats }, index) => {
            const icon = ICONS[level];

            return (
              <li key={index} className={styles.row} data-level={level}>
                <span className={styles.rowIcon}>{icon && <Icon name={icon} size={14} />}</span>
                <span className={styles.rowText}>{text}</span>
                {repeats > 1 && <span className={styles.rowCount}>{repeats}</span>}
              </li>
            );
          })
        )}
      </ol>
    </section>
  );
}
