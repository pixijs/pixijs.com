import { useCallback, useEffect, useState } from 'react';
import Icon from '@site/src/components/ui/Icon';
import styles from './Rail.module.scss';

import type { ReactNode } from 'react';

const OPEN_KEY = 'pixi:rail:open';

/**
 * Disclosure state: route defaults, plus the reader's own toggles from this session. Stored toggles load after
 * mount, so the server and first client render agree.
 */
export function useOpenState(defaults: Record<string, boolean>) {
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      setToggled(JSON.parse(sessionStorage.getItem(OPEN_KEY) ?? '{}'));
    } catch {
      /* storage blocked: route defaults only */
    }
  }, []);

  const isOpen = (id: string) => toggled[id] ?? defaults[id] ?? false;
  const toggle = useCallback(
    (id: string, open: boolean) =>
      setToggled((previous) => {
        const next = { ...previous, [id]: open };

        try {
          sessionStorage.setItem(OPEN_KEY, JSON.stringify(next));
        } catch {
          /* storage blocked */
        }

        return next;
      }),
    [],
  );

  return { isOpen, toggle };
}

interface ChevronProps {
  id: string;
  open: boolean;
  label: string;
  onToggle: () => void;
}

/** The chevron of a row whose label is a link */
export function Chevron({ id, open, label, onToggle }: ChevronProps) {
  return (
    <button
      type="button"
      className={styles.chevron}
      aria-expanded={open}
      aria-controls={id}
      aria-label={label}
      onClick={onToggle}
    >
      <Icon name="chevron-down" size={14} strokeWidth={2} className={styles.caret} />
    </button>
  );
}

/** Animated body of a disclosure; links inside are unreachable while it's closed */
export function Group({ id, open, children }: { id: string; open: boolean; children: ReactNode }) {
  return (
    <div id={id} className={styles.group} data-open={open || undefined} inert={!open}>
      <div className={styles.groupInner}>
        <ul>{children}</ul>
      </div>
    </div>
  );
}
