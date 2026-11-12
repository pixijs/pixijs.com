import { useEffect, useRef, useState } from 'react';
import Icon from '@site/src/components/ui/Icon';
import Sheet from '@site/src/shell/Sheet';
import StepLink from './StepLink';
import styles from './classes';

import type { RefObject } from 'react';

interface StepMenuProps {
  title: string;
  headers: string[];
  step: number;
  onGo: (step: number) => void;
  /** The popover opens under this element at 997 px and up */
  anchor: RefObject<HTMLElement | null>;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** "3 / 8" button that opens the list of steps: a popover under the guide's header, a bottom sheet on phones */
export default function StepMenu({ title, headers, step, onGo, anchor }: StepMenuProps) {
  const [open, setOpen] = useState(false);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>('[aria-current="step"]')?.focus();
  }, [open]);

  const go = (target: number) => {
    setOpen(false);
    onGo(target);
  };

  return (
    <>
      <button
        type="button"
        className={styles.stepButton}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Step ${step} of ${headers.length}, all steps`}
        onClick={() => setOpen(true)}
      >
        <span>
          <b>{step}</b> / {headers.length}
        </span>
        <Icon name="chevron-down" size={14} strokeWidth={2} />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} label="Steps" anchor={anchor}>
        <nav className={styles.menu} aria-label="All steps">
          <p className={styles.menuHead}>
            {title}
            <small>{headers.length} steps</small>
          </p>
          <ol ref={list}>
            {headers.map((header, i) => {
              const n = i + 1;

              return (
                <li key={n}>
                  <StepLink
                    step={n}
                    onGo={go}
                    className={styles.menuItem}
                    aria-current={n === step ? 'step' : undefined}
                    data-done={n < step ? '' : undefined}
                  >
                    <span className={styles.menuNumber} aria-hidden="true">
                      {n < step ? <Icon name="check" size={13} strokeWidth={2.5} /> : pad(n)}
                    </span>
                    {header}
                  </StepLink>
                </li>
              );
            })}
          </ol>
        </nav>
      </Sheet>
    </>
  );
}
