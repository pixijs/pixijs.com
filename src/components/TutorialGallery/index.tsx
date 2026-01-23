import styles from './index.module.scss';
import TutorialCard from './TutorialCard';
import { getTutorialCardsData } from '@site/src/tutorials';

import type React from 'react';
import type { IVersion } from '../Playground/PixiPlayground/usePixiVersions';
import { useClassModifier, useRowClassNameModifier } from '@site/src/hooks/useContainerClassNameModifier';

export default function TutorialGallery({ pixiVersion }: { pixiVersion: IVersion }): React.JSX.Element {
  const version = pixiVersion.version;
  const data = getTutorialCardsData(version);

  useRowClassNameModifier('justifyContentCenter', true);
  useClassModifier('.main-wrapper', 'tileBackground', true);

  return (
    <main className={styles.tutorialsPage}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className="underline">Tutorials</h1>
          <p className={styles.subtitle}>
            Hand-crafted exercises to help you learn PixiJS. Build real projects step-by-step with interactive code
            editors.
          </p>
        </div>
      </section>

      <section className={styles.cardsSection}>
        <div className={styles.cardsGrid}>
          {data.map((card) => (
            <TutorialCard data={card} key={card.title} />
          ))}
        </div>
      </section>
    </main>
  );
}
