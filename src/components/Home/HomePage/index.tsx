import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import { useRef } from 'react';
import styles, { STYLESHEET } from '../classes';
import { useHomeMotion } from '../useHomeMotion';

import type { ReactNode } from 'react';

interface HomePageProps {
  /** The whole document title; the site name isn't appended */
  title: string;
  description: string;
  children: ReactNode;
}

/** How long the hero's headline wave and squiggle take once the fonts are in (M1) */
const INTRO_MS = 2200;

/**
 * The frame of a homepage: the shell, `[data-home]` so the hero starts under the top bar, the home sections'
 * stylesheet, and the page-wide motion (`useHomeMotion`).
 */
export default function HomePage({ title, description, children }: HomePageProps) {
  const root = useRef<HTMLDivElement>(null);

  useHomeMotion(root, INTRO_MS);

  return (
    <Layout description={description}>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: STYLESHEET }} />
      <div ref={root} className={styles.home} data-home="">
        {children}
      </div>
    </Layout>
  );
}
