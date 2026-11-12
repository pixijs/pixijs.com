import styles from '../classes';
import { FRAME_ALLOW, FRAME_SANDBOX } from '@site/src/runtime/frame';

import type { Runner } from '@site/src/runtime/useRunner';

interface RunnerFrameProps {
  runner: Runner;
  title: string;
}

/**
 * The runner's two iframes, stacked: a run loads in the one underneath and fades in on top once it's ready. The
 * hidden one stays rendered, because a `display: none` frame gets no animation frames and would never report ready.
 */
export default function RunnerFrame({ runner, title }: RunnerFrameProps) {
  return runner.frames.map((frame, index) => {
    const active = runner.active === index;

    return (
      <iframe
        key={index}
        ref={frame}
        className={styles.frame}
        data-active={active ? '' : undefined}
        title={title}
        sandbox={FRAME_SANDBOX}
        allow={FRAME_ALLOW}
        tabIndex={active ? undefined : -1}
        aria-hidden={active ? undefined : true}
      />
    );
  });
}
