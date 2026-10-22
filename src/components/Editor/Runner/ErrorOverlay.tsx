import styles from '../classes';
import Icon from '@site/src/components/ui/Icon';

import type { RunnerError } from '@site/src/runtime/useRunner';

interface ErrorOverlayProps {
  error: RunnerError;
  /** Moves the editor to the error; omitted when there's no editor to show it in */
  onReveal?: () => void;
  onDismiss: () => void;
}

const ERROR_NAME = /^([A-Z]\w*(?:Error|Exception))\b/;

/** The first uncaught error of a run, or why it didn't compile, as a card over the bottom of the preview */
export default function ErrorOverlay({ error, onReveal, onDismiss }: ErrorOverlayProps) {
  const name = ERROR_NAME.exec(error.stack ?? '')?.[1] ?? ERROR_NAME.exec(error.message)?.[1] ?? 'Error';
  const message = error.message.replace(ERROR_NAME, '').replace(/^:\s*/, '') || error.message;
  const location = error.file && error.line ? `${error.file}:${error.line}:${error.column ?? 1}` : error.file;

  return (
    <div className={styles.error} role="alert" data-verify="editor-error">
      <Icon name="circle-alert" size={18} className={styles.errorIcon} />
      <div className={styles.errorText}>
        <p className={styles.errorTitle}>
          <span>{name}</span>
          {location && <span className={styles.errorWhere}>{location}</span>}
        </p>
        <p className={styles.errorMessage}>{message}</p>
        {onReveal && location && (
          <button type="button" className={styles.textButton} onClick={onReveal}>
            Show in editor
            <Icon name="arrow-right" size={14} />
          </button>
        )}
      </div>
      <button type="button" className={styles.iconButton} aria-label="Dismiss error" onClick={onDismiss}>
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}
