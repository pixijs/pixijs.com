import useIsomorphicLayoutEffect from '@docusaurus/useIsomorphicLayoutEffect';
import { useRef } from 'react';
import styles from './styles';

import type { KeyboardEvent, MouseEvent } from 'react';

interface TabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  /** Tab id → the anchor it links to without JS */
  anchor: (id: string) => string;
  panelId: string;
  label: string;
  /** Auto-tour step running in the active tab: its fill restarts whenever this changes */
  tourStep: number | null;
  tourMs: number;
  onSelect: (id: string) => void;
}

const KEY_STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * WAI-ARIA tabs that look like the segmented control. Each tab is an anchor to its `:target`, so the tabs still
 * switch posters and code without JS; with JS the click is handled here and the URL is left alone. The thumb slides
 * to the tab the visitor picks; when the auto tour wraps round to the first tab it fades across instead of
 * sweeping back over the others.
 */
export default function Tabs({ tabs, active, anchor, panelId, label, tourStep, tourMs, onSelect }: TabsProps) {
  const track = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const shown = useRef(active);
  const picked = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const el = track.current;

    if (!el) return undefined;
    const place = () => {
      const current = el.querySelector<HTMLElement>('[aria-selected="true"]');

      if (!current) return;
      el.style.setProperty('--x', `${current.offsetLeft}px`);
      el.style.setProperty('--y', `${current.offsetTop}px`);
      el.style.setProperty('--w', `${current.offsetWidth}px`);
      el.style.setProperty('--h', `${current.offsetHeight}px`);
      if (el.dataset.ready === undefined) {
        el.dataset.ready = '';
        requestAnimationFrame(() => (el.dataset.animate = ''));
      }
    };
    const index = (id: string) => tabs.findIndex((tab) => tab.id === id);
    const far = Math.abs(index(active) - index(shown.current)) > 1;
    const jump = far && !picked.current && el.dataset.animate !== undefined;

    shown.current = active;
    picked.current = false;
    el.dataset.move = jump ? 'jump' : 'slide';
    // The cut happens while the thumb is clear (WAAPI, which the reduced-motion rule leaves alone: no tour runs then)
    if (jump) thumb.current?.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 300 });
    const observer = new ResizeObserver(place);

    place();
    observer.observe(el);
    void document.fonts?.ready.then(place);

    return () => observer.disconnect();
  }, [active]);

  const select = (index: number, focus: boolean) => {
    const tab = tabs[(index + tabs.length) % tabs.length];

    picked.current = true;
    onSelect(tab.id);
    if (focus) track.current?.querySelector<HTMLElement>(`[data-tab="${tab.id}"]`)?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.id === active);

    if (event.key in KEY_STEP) select(index + KEY_STEP[event.key], true);
    else if (event.key === 'Home') select(0, true);
    else if (event.key === 'End') select(tabs.length - 1, true);
    else return;
    event.preventDefault();
  };

  const onClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    picked.current = true;
    onSelect(id);
  };

  return (
    <div
      ref={track}
      className={styles.tabs}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      data-touring={tourStep === null ? undefined : ''}
      data-count={tabs.length}
    >
      <span ref={thumb} className={styles.thumb} aria-hidden="true">
        {tourStep !== null && (
          <span key={tourStep} className={styles.tourFill} style={{ animationDuration: `${tourMs}ms` }} />
        )}
      </span>
      {tabs.map((tab) => {
        const selected = tab.id === active;

        return (
          <a
            key={tab.id}
            href={`#${anchor(tab.id)}`}
            id={`${anchor(tab.id)}-tab`}
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            className={styles.tab}
            data-tab={tab.id}
            onClick={(event) => onClick(event, tab.id)}
          >
            {tab.label}
          </a>
        );
      })}
    </div>
  );
}
