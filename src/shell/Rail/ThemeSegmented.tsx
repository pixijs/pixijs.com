import { useColorMode } from '@docusaurus/theme-common';
import { flushSync } from 'react-dom';
import Icon from '@site/src/components/ui/Icon';
import { motionAllowed } from '@site/src/motion/pause';
import styles from './Rail.module.scss';

import type { KeyboardEvent } from 'react';

type Mode = 'light' | 'dark';

const MODES: { mode: Mode; label: string; icon: 'sun' | 'moon' }[] = [
  { mode: 'light', label: 'Light', icon: 'sun' },
  { mode: 'dark', label: 'Dark', icon: 'moon' },
];

const REVEAL_MS = 520;

/**
 * Light / Dark. The thumb and selected colour follow `html[data-theme]` in CSS, so the server markup is right before
 * hydration; `aria-checked` catches up once Docusaurus reads the stored choice. Switching reveals the new theme in a
 * circle from the control where View Transitions exist and motion is allowed.
 */
export default function ThemeSegmented() {
  const { colorMode, setColorMode } = useColorMode();

  const choose = (next: Mode, from: HTMLElement) => {
    if (next === document.documentElement.dataset.theme) return;
    if (!document.startViewTransition || !motionAllowed()) {
      setColorMode(next);

      return;
    }
    const box = from.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => flushSync(() => setColorMode(next)));

    transition.ready
      .then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: REVEAL_MS,
            easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        ),
      )
      .catch(() => undefined);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: 0, ArrowUp: 0, Home: 0, ArrowRight: 1, ArrowDown: 1, End: 1 }[event.key];

    if (step === undefined) return;
    event.preventDefault();
    const button = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')[step];

    button.focus();
    choose(MODES[step].mode, button);
  };

  return (
    <>
      <div
        className={styles.theme}
        role="radiogroup"
        aria-label="Colour theme"
        onKeyDown={onKeyDown}
        data-verify="theme-toggle"
      >
        <span className={styles.themeThumb} aria-hidden="true" />
        {MODES.map(({ mode, label, icon }) => (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={colorMode === mode}
            tabIndex={colorMode === mode ? 0 : -1}
            className={styles.themeOption}
            data-mode={mode}
            onClick={(event) => choose(mode, event.currentTarget)}
          >
            <Icon name={icon} size={14} />
            {label}
          </button>
        ))}
      </div>
      <span className={styles.themeMark} aria-hidden="true">
        <Icon name="sun" size={16} />
        <Icon name="moon" size={16} />
      </span>
    </>
  );
}
