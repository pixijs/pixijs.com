import { useRef } from 'react';
import Badge from '@site/src/components/ui/Badge';
import Icon from '@site/src/components/ui/Icon';
import { gsap, ScrollTrigger, settle } from '@site/src/motion/gsap';
import { useMotion } from '@site/src/motion/useMotion';
import { batchEntrance } from '@site/src/motion/useReveal';
import styles from '../classes';

import type { Feature } from '../content/features';

interface FeatureListProps {
  items: Feature[];
}

/**
 * The feature rows (section 8.4 item 6). Rows rise in as they scroll into view, a few at a time; a row's badge pops
 * after it and catches the light once.
 */
export default function FeatureList({ items }: FeatureListProps) {
  const list = useRef<HTMLUListElement>(null);

  useMotion(list, (root, { paused }) => {
    if (paused) return undefined;
    const rows = gsap.utils
      .toArray<HTMLElement>('[data-feature]', root)
      .filter((row) => !ScrollTrigger.isInViewport(row, 0.1));
    const badgeOf = (row: Element) => row.querySelector(`.${styles.featureBadge}`);
    /** The rows' badges, at `scale`; most rows have none, and GSAP warns about an empty target */
    const setBadges = (among: Element[], scale: number) => {
      const badges = among.map(badgeOf).filter((badge) => badge !== null);

      if (badges.length) gsap.set(badges, { scale, overwrite: true, immediateRender: true });
    };

    if (!rows.length) return undefined;
    gsap.set(rows, { opacity: 0, y: 24 });
    setBadges(rows, 0);

    return batchEntrance(rows, {
      batchMax: 4,
      play: (entering) => {
        settle(gsap.to(entering, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, overwrite: true }));
        entering.forEach((row, i) => {
          const badge = badgeOf(row);

          if (!badge) return;
          settle(
            gsap
              .timeline({ delay: i * 0.08 + 0.2 })
              .to(badge, { scale: 1, duration: 0.5, ease: 'back.out(2.5)' })
              .fromTo(badge, { '--shine': '-100%' }, { '--shine': '200%', duration: 0.9, ease: 'power2.inOut' }, 0.3),
          );
        });
      },
      finish: (passed) => {
        gsap.set(passed, { opacity: 1, y: 0, overwrite: true, immediateRender: true });
        setBadges(passed, 1);
      },
    });
  });

  return (
    <ul ref={list} className={styles.features}>
      {items.map(({ icon, title, copy, badge }) => (
        <li key={title} className={styles.feature} data-feature="">
          <Icon name={icon} size={32} strokeWidth={1.5} className={styles.featureIcon} />
          <div>
            <h3 className={styles.featureTitle}>
              {title}
              {badge && <Badge className={styles.featureBadge}>{badge}</Badge>}
            </h3>
            <p className={styles.featureCopy}>{copy}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
