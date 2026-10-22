import { type KeyboardEvent, type PointerEvent, type RefObject, useState } from 'react';
import styles from './classes';

const KEY = 'pixi:editor:split';
const MIN = 0.2;
const MAX = 0.8;
const STEP = 0.05;

const clamp = (ratio: number) => Math.min(MAX, Math.max(MIN, ratio));

function stored(): number {
  try {
    const value = Number(localStorage.getItem(KEY));

    return value ? clamp(value) : 0.5;
  } catch {
    return 0.5;
  }
}

function store(ratio: number) {
  try {
    localStorage.setItem(KEY, String(ratio));
  } catch {
    /* storage blocked: the split resets next time */
  }
}

/** The code pane's share of a resizable editor's width, remembered across visits */
export function useSplit(): [number, (ratio: number) => void] {
  const [ratio, setRatio] = useState(stored);

  return [ratio, (next: number) => setRatio(clamp(next))];
}

interface SplitHandleProps {
  root: RefObject<HTMLElement | null>;
  ratio: number;
  onChange: (ratio: number) => void;
}

/**
 * The divider between code and preview: drag it, step it with the arrow keys, or double-click it to share the width
 * evenly. While it's dragged the preview frames ignore the pointer, so they don't swallow the moves.
 */
export default function SplitHandle({ root, ratio, onChange }: SplitHandleProps) {
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const box = root.current?.getBoundingClientRect();

    if (box && event.currentTarget.hasPointerCapture(event.pointerId)) {
      onChange((event.clientX - box.left) / box.width);
    }
  };
  const settle = (next: number) => {
    onChange(next);
    store(clamp(next));
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: -STEP, ArrowRight: STEP }[event.key];

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      settle(event.key === 'Home' ? MIN : MAX);
    } else if (step) {
      event.preventDefault();
      settle(ratio + step);
    }
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize the code and preview"
      aria-valuemin={MIN * 100}
      aria-valuemax={MAX * 100}
      aria-valuenow={Math.round(ratio * 100)}
      tabIndex={0}
      className={styles.split}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        root.current?.toggleAttribute('data-dragging', true);
      }}
      onPointerMove={move}
      onLostPointerCapture={() => {
        root.current?.removeAttribute('data-dragging');
        store(ratio);
      }}
      onDoubleClick={() => settle(0.5)}
      onKeyDown={onKeyDown}
    />
  );
}
