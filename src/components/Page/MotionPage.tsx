import { useEffect, useRef } from 'react';
import { useClayField } from '@site/src/motion/useClayField';
import { useReveal } from '@site/src/motion/useReveal';
import { useSplitTitle } from '@site/src/motion/useSplitTitle';
import { Page, PageHeader } from '.';

import type { PageHeaderProps, PageProps } from '.';

/**
 * A `Page` with the homes' entrances: `[data-reveal]` rises in (M4) and every `SectionHead` plays its title (M3). It
 * sets `window.__siteMotionSettled` once the fonts are in, which the verification scripts wait for. Kept apart from
 * `Page` so the 404 doesn't bring GSAP along.
 */
export default function MotionPage({ css, children }: Omit<PageProps, 'ref'>) {
  const root = useRef<HTMLDivElement>(null);

  useReveal(root);
  useSplitTitle(root);

  useEffect(() => {
    let mounted = true;

    void document.fonts.ready.then(() => mounted && Object.assign(window, { __siteMotionSettled: true }));

    return () => {
      mounted = false;
      Object.assign(window, { __siteMotionSettled: false });
    };
  }, []);

  return (
    <Page ref={root} css={css}>
      {children}
    </Page>
  );
}

/** `PageHeader` with its two clay shapes live, for pages that bring GSAP */
export function ClayHeader(props: Omit<PageHeaderProps, 'live' | 'ref'>) {
  const header = useRef<HTMLElement>(null);

  useClayField(header);

  return <PageHeader {...props} ref={header} live />;
}
