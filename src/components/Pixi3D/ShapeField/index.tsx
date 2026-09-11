import { useCallback, useEffect, useRef, useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import clsx from 'clsx';
import { CHANNEL, isFrameMessage } from './bridge';
import styles from './index.module.scss';

import type { HostMessage } from './bridge';
import type React from 'react';

/**
 * The built hero, deployed from the `pixijs-3d-hero` project into `static/3d-hero`.
 *
 * A constant, so the frame is in this page's served markup and starts loading while the page is
 * still parsing rather than after it has hydrated. The frame needs the colour mode before its first
 * paint and reads it off this document itself — see its `index.html` — which is what lets the URL
 * stay the same in both modes. Later changes go over the bridge, and a URL that never changes is
 * also what keeps a toggle from reloading the field back to its opening scatter.
 */
const FRAME_SRC = '/3d-hero/index.html';

/** The hero's floating primitives, which run in a frame of their own; see `./bridge`. */
export default function ShapeField(): React.JSX.Element {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(true);
  const { colorMode } = useColorMode();
  const [failed, setFailed] = useState(false);

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
      <iframe ref={frameRef} className={styles.frame} src={FRAME_SRC} title="PixiJS 3D hero" tabIndex={-1} />
    </div>
  );
}
