import clsx from 'clsx';
import Card from '@site/src/components/ui/Card';
import Icon from '@site/src/components/ui/Icon';
import SectionHead from '@site/src/components/ui/SectionHead';
import { ECOSYSTEM_PACKAGES } from '@site/src/data/packages';
import styles from '../classes';
import { ECOSYSTEM } from '../content/ecosystem';
import Still from '../Still';

import type { CSSProperties } from 'react';

/**
 * The packages around the renderer, from the same list as the rail, each with the line that installs it. One with a
 * still leads the grid from its corner; phones swipe through them in a row.
 */
export default function Ecosystem() {
  return (
    <>
      <SectionHead className={styles.head} eyebrow="ECOSYSTEM" title="More than a renderer." id="ecosystem-title" />
      <ul className={styles.ecosystem}>
        {ECOSYSTEM_PACKAGES.map(({ label, token, href }) => {
          const { text, install, still } = ECOSYSTEM[token];

          return (
            <li key={token} className={clsx(styles.ecoItem, still && styles.ecoFeature)} data-reveal="">
              <Card
                variant="link"
                to={href}
                accent={`var(--px-pkg-${token})`}
                media={still && <Still name={still} height={500} className={styles.ecoStill} />}
              >
                <h3 className={styles.ecoName} style={{ '--dot': `var(--px-pkg-${token})` } as CSSProperties}>
                  <span className={styles.ecoDot} aria-hidden="true" />
                  {label}
                  <Icon name="external" size={13} strokeWidth={2} className={styles.ecoOut} />
                </h3>
                <p>{text}</p>
                <code className={styles.ecoInstall}>{install}</code>
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}
