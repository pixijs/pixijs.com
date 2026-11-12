import { useEffect, useRef } from 'react';
import { DOCKED_MEDIA } from './modal';
import styles from './Sheet.module.scss';

import type { ReactNode, RefObject } from 'react';

const EDGE = 12;

interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the dialog */
  label: string;
  /** The popover hangs below this element at 997 px and up */
  anchor: RefObject<HTMLElement | null>;
  children: ReactNode;
}

/**
 * A modal `<dialog>`: a popover under its anchor at 997 px and up, a bottom sheet below. The browser handles the top
 * layer, the inert page, Esc and returning focus; a click on the backdrop closes it.
 */
export default function Sheet({ open, onClose, label, anchor, children }: SheetProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;

    if (!el || open === el.open) return;
    if (!open) {
      el.close();

      return;
    }
    const target = anchor.current;
    const popover = matchMedia(DOCKED_MEDIA).matches && target;

    el.dataset.mode = popover ? 'popover' : 'sheet';
    el.showModal();
    if (popover) {
      const box = target.getBoundingClientRect();

      el.style.setProperty('--top', `${box.bottom + 8}px`);
      el.style.setProperty('--left', `${Math.max(EDGE, Math.min(box.left, innerWidth - el.offsetWidth - EDGE))}px`);
    }
    el.querySelector<HTMLElement>('[aria-checked="true"], [role^="menuitem"]')?.focus();
  }, [open, anchor]);

  return (
    <dialog
      ref={dialog}
      className={styles.sheet}
      aria-label={label}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
    >
      {open && children}
    </dialog>
  );
}
