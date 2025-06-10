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
      </div>
    </header>
  );
}
