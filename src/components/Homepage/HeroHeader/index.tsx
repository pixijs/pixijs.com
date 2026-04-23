import Link from '@docusaurus/Link';
import clsx from 'clsx';
import HomeCTA from '../HomeCTA';
import styles from './index.module.scss';

import type React from 'react';

export default function HeroHeader(): React.JSX.Element {
  return (
    <header className={clsx('hero hero--dark', styles.heroBanner)}>
      <iframe className={styles.heroBackground} src="/header/index.html"></iframe>
      <div className="container">
        <img className={styles.heroLogo} src="/images/logo.svg" alt="" />
        <h1 className="hero__subtitle">The HTML5 Creation Engine</h1>
        <h4 className="hero__subsubtitle">
          Create beautiful digital content with the fastest, most flexible 2D WebGL renderer.
        </h4>
        <div className="buttonRow">
          <HomeCTA label="Getting Started" link="8.x/guides/getting-started/intro" />
          &nbsp;
          <HomeCTA label="Tutorials" link="8.x/tutorials" white={true} outline={true} />
        </div>
        <Link to="/llms" className={styles.aiPill}>
          <span className={styles.aiPillBadge}>NEW</span>
          <span className={styles.aiPillPrompt} aria-hidden="true">
            ›_
          </span>
          <span className={styles.aiPillText}>Skills for AI coding agents</span>
          <svg
            className={styles.aiPillArrow}
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1 7h12M8 2l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
