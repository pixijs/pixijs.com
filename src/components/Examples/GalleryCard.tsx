import Link from '@docusaurus/Link';
import { useState } from 'react';
import styles from './classes';
import { categoryLabel, categoryOf, previewOf, titleOf } from './data';
import { usePointerGlow } from '@site/src/components/ui/Card';
import Icon from '@site/src/components/ui/Icon';
import { motionAllowed } from '@site/src/motion/pause';

import type { Item } from './types';
import type { MouseEvent } from 'react';

interface GalleryCardProps {
  item: Item;
  to: string;
  /** Names the category over the title, where the card isn't under its category's heading */
  showCategory?: boolean;
  /** Loads the preview straight away, for the first rows; `high` also fetches it ahead of other images */
  eager?: boolean | 'high';
  current?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * A gallery link with the example's preview still, which plays its animated preview under a hovering mouse while a
 * soft glow follows the pointer
 */
export default function GalleryCard({ item, to, showCategory, eager, current, onClick }: GalleryCardProps) {
  const [playing, setPlaying] = useState(false);
  const glow = usePointerGlow();

  return (
    <Link
      to={to}
      className={styles.card}
      aria-current={current ? 'page' : undefined}
      data-verify="example-card"
      data-package={item.pkg}
      onClick={onClick}
      onPointerEnter={(event) => event.pointerType === 'mouse' && motionAllowed() && setPlaying(true)}
      onPointerMove={glow}
      onPointerLeave={() => setPlaying(false)}
    >
      <span className={styles.media}>
        <Icon name={item.pkg === '3d' ? 'box' : 'layers'} size={22} className={styles.mediaIcon} />
        <img
          src={previewOf(item)}
          alt=""
          width={600}
          height={338}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager === 'high' ? 'high' : undefined}
          decoding="async"
          onError={(event) => (event.currentTarget.hidden = true)}
        />
        {playing && (
          <img
            src={previewOf(item, true)}
            alt=""
            className={styles.mediaLoop}
            onLoad={(event) => event.currentTarget.toggleAttribute('data-loaded', true)}
            onError={(event) => (event.currentTarget.hidden = true)}
          />
        )}
      </span>
      <span className={styles.cardBody}>
        {showCategory && <span className={styles.cardCategory}>{categoryLabel(categoryOf(item))}</span>}
        <span className={styles.cardTitle}>{titleOf(item)}</span>
        <span className={styles.cardText}>{item.description}</span>
      </span>
    </Link>
  );
}
