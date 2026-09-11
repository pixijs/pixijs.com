import { useEffect, useRef, useState } from 'react';
import styles from './BetaSignup.module.css';

interface KitGuardProps {
  url: string;
  onConfirmed: () => void;
}

interface GuardMessage {
  name?: string;
  height?: number;
}

/**
 * Kit's spam challenge, embedded the way its own ck.js does it: the framed page reports its
 * size and the outcome over postMessage. Only the frame's own window is trusted, since the
 * guard can redirect between Kit's domains.
 */
export default function KitGuard({ url, onConfirmed }: KitGuardProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const listen = (event: MessageEvent<GuardMessage>) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.name === 'ckjs:guard:size') setHeight(event.data.height);
      if (event.data?.name === 'ckjs:guard:confirmed') onConfirmed();
    };

    window.addEventListener('message', listen);

    return () => window.removeEventListener('message', listen);
  }, [onConfirmed]);

  return <iframe ref={frameRef} className={styles.guard} src={url} title="Spam check" style={{ height }} />;
}
