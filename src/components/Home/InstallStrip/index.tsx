import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import Button from '@site/src/components/ui/Button';
import { gsap, ScrollTrigger } from '@site/src/motion/gsap';
import { useMotion } from '@site/src/motion/useMotion';
import { scoped } from '../scoped';

const COMMAND = 'npm create pixi.js@latest';
const COPIED_MS = 1600;
/** Its own `hm-install*` classes, so `/3d` can use it without the rest of the home stylesheet */
const styles = scoped();

/**
 * "Scaffold a project in seconds" on `/2d` and `/3d` (section 8.5 item 2): a terminal card with the create command,
 * typed in when its line scrolls into view, a copy button, and `install` for adding the package to an app.
 */
export default function InstallStrip({ install }: { install: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), COPIED_MS);

    return () => window.clearTimeout(timer);
  }, [copied]);

  useMotion(root, (el, { paused }) => {
    const command = el.querySelector('[data-command]');

    // The strip's top edge shows under most heroes: only a command that's already in full view is left as it is
    if (paused || !command || ScrollTrigger.isInViewport(command, 1)) return undefined;
    command.textContent = '';
    gsap.to(command, {
      duration: 0.9,
      ease: 'none',
      scrambleText: { text: COMMAND, chars: 'lowerCase', speed: 0.5 },
      scrollTrigger: { trigger: command, start: 'top 85%', once: true },
    });

    return () => void (command.textContent = COMMAND);
  });

  return (
    <div ref={root} className={styles.install}>
      <div>
        <p className={styles.installEyebrow}>GET GOING</p>
        <h2 className={styles.installTitle} id="install-title">
          Scaffold a project in seconds.
        </h2>
      </div>
      <div>
        <div className={clsx(styles.terminal, 'px-on-dark')}>
          <div className={styles.terminalBar} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className={styles.terminalBody}>
            <code className={styles.terminalLine}>
              <span className={styles.terminalPrompt} aria-hidden="true">
                $
              </span>
              <span data-command="">{COMMAND}</span>
              <span className={styles.terminalCaret} aria-hidden="true" />
            </code>
            <Button
              variant="small"
              icon={copied ? 'check' : 'copy'}
              onClick={() => void navigator.clipboard?.writeText(COMMAND).then(() => setCopied(true))}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
        <p className={styles.installAlt}>
          or add it to an app: <code>{install}</code>
        </p>
      </div>
    </div>
  );
}
