import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import styles from './classes';
import Icon, { type IconName } from '@site/src/components/ui/Icon';

export type MenuEntry =
  { label: string; icon: IconName; onSelect: () => void; checked?: boolean; disabled?: boolean } | 'separator';

interface MenuProps {
  label: string;
  items: MenuEntry[];
}

/** An icon button that opens a list of actions; Escape, a click outside or focus leaving the page closes it */
export default function Menu({ label, items }: MenuProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const outside = (event: PointerEvent) => !root.current?.contains(event.target as Node) && close();

    root.current?.querySelector<HTMLElement>('[role^="menuitem"]:not(:disabled)')?.focus();
    document.addEventListener('pointerdown', outside);
    window.addEventListener('blur', close);

    return () => {
      document.removeEventListener('pointerdown', outside);
      window.removeEventListener('blur', close);
    };
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      button.current?.focus();

      return;
    }
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    const options = Array.from(root.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not(:disabled)') ?? []);

    if (!step || options.length === 0) return;
    event.preventDefault();
    const index = options.indexOf(document.activeElement as HTMLElement);

    options[(index + step + options.length) % options.length].focus();
  };

  return (
    <div ref={root} className={styles.menu} onKeyDown={onKeyDown}>
      <button
        ref={button}
        type="button"
        className={styles.iconButton}
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen(!open)}
      >
        <Icon name="ellipsis" size={18} />
      </button>
      {open && (
        <div id={id} role="menu" aria-label={label} className={styles.menuList}>
          {items.map((item, index) =>
            item === 'separator' ? (
              <div key={index} role="separator" className={styles.menuSeparator} />
            ) : (
              <button
                key={item.label}
                type="button"
                role={item.checked === undefined ? 'menuitem' : 'menuitemcheckbox'}
                aria-checked={item.checked}
                disabled={item.disabled}
                className={styles.menuItem}
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
                {item.checked !== undefined && (
                  <span className={styles.switch} data-on={item.checked ? '' : undefined} aria-hidden="true" />
                )}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
