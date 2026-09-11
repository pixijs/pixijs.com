import { useCallback, useEffect, useRef, useState } from 'react';
import { useColorMode, type ColorMode } from '@docusaurus/theme-common';
import useIsBrowser from '@docusaurus/useIsBrowser';
import clsx from 'clsx';
import { CHANNEL, isFrameMessage } from './bridge';
import styles from './index.module.scss';

import type { HostMessage } from './bridge';
import type React from 'react';

/** The built hero, deployed from the `pixijs-3d-hero` project into `static/3d-hero`. */
const FRAME_SRC = '/3d-hero/index.html';

/**
 * The opening colour mode, which the frame needs before its first paint. It goes in the fragment
 * rather than the query because this site normalises the frame's path with a redirect, and a
 * redirect keeps a fragment where it drops a query.
 */
const frameUrl = (theme: ColorMode): string => `${FRAME_SRC}#${new URLSearchParams({ theme })}`;

/** The hero's floating primitives, which run in a frame of their own; see `./bridge`. */
export default function ShapeField(): React.JSX.Element {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(true);
  const { colorMode } = useColorMode();
  const [failed, setFailed] = useState(false);
  const isBrowser = useIsBrowser();
  const srcRef = useRef<string | null>(null);

  // Built once. Every later colour-mode change goes over the bridge instead: folding it back into
  // the URL would reload the frame and restart the field from its opening scatter.
  if (isBrowser && srcRef.current === null) srcRef.current = frameUrl(colorMode);

  const send = useCallback((message: HostMessage) => {
    frameRef.current?.contentWindow?.postMessage(message, location.origin);
  }, []);

  useEffect(() => {
    send({ channel: CHANNEL, type: 'theme', theme: colorMode });
  }, [colorMode, send]);

  useEffect(() => {
    const listen = (event: MessageEvent<unknown>) => {
      if (event.source !== frameRef.current?.contentWindow || event.origin !== location.origin) return;
      if (!isFrameMessage(event.data)) return;

      // Anything sent before the frame's listener attached is lost, so replay its state on ready.
      if (event.data.type === 'ready') {
        send({ channel: CHANNEL, type: 'theme', theme: colorMode });
        send({ channel: CHANNEL, type: 'active', active: activeRef.current });
      }
      if (event.data.type === 'failed') setFailed(true);
    };

    window.addEventListener('message', listen);

    return () => window.removeEventListener('message', listen);
  }, [colorMode, send]);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) return;

    const observer = new IntersectionObserver(([entry]) => {
      activeRef.current = entry.isIntersecting;
      send({ channel: CHANNEL, type: 'active', active: entry.isIntersecting });
    });

    observer.observe(host);

    return () => observer.disconnect();
  }, [send]);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) return;

    // Cached so pointer moves don't force a layout flush; the hero only moves with scroll and resize.
    let rect = host.getBoundingClientRect();
    const measure = () => {
      rect = host.getBoundingClientRect();
    };

    // On the window because the frame takes no pointer events, so moves over the copy would be lost.
    const track = (event: PointerEvent) => {
      if (!activeRef.current) return;
      send({ channel: CHANNEL, type: 'pointer', x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    const trackHostSize = new ResizeObserver(measure);

    trackHostSize.observe(host);
    window.addEventListener('pointermove', track, { passive: true });
    window.addEventListener('pointerdown', track, { passive: true });
    window.addEventListener('scroll', measure, { passive: true });

    return () => {
      trackHostSize.disconnect();
      window.removeEventListener('pointermove', track);
      window.removeEventListener('pointerdown', track);
      window.removeEventListener('scroll', measure);
    };
  }, [send]);

  return (
    <div ref={hostRef} className={clsx(styles.host, failed && styles.failed)} aria-hidden="true">
      {srcRef.current && (
        <iframe ref={frameRef} className={styles.frame} src={srcRef.current} title="PixiJS 3D hero" tabIndex={-1} />
      )}
    </div>
  );
}
