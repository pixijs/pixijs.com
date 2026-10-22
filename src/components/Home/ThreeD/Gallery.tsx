import Link from '@docusaurus/Link';
import { useState } from 'react';
import Card from '@site/src/components/ui/Card';
import Icon from '@site/src/components/ui/Icon';
import SectionHead from '@site/src/components/ui/SectionHead';
import { motionAllowed } from '@site/src/motion/pause';
import { HEAD } from '../Band';
import { GALLERY } from '../content/threeD';
import Preview from './Preview';
import styles from './styles';

import type { GalleryItem } from '../content/threeD';

const EXAMPLES = '/3d/examples';

/** Examples that wait for the visitor, so their captured preview is one frame: the card keeps its sharper still */
const AT_REST = new Set(['models_viewer']);

function GalleryCard({ item }: { item: GalleryItem }) {
  const [playing, setPlaying] = useState(false);

  return (
    <li
      data-reveal=""
      onPointerEnter={() => setPlaying(!AT_REST.has(item.name) && motionAllowed())}
      onPointerLeave={() => setPlaying(false)}
    >
      <Card
        variant="link"
        to={`${EXAMPLES}?example=${item.name}`}
        className={styles.galleryCard}
        media={<Preview name={item.name} shape={item.shape} playing={playing} className={styles.galleryMedia} />}
      >
        <span className={styles.galleryCategory}>{item.category}</span>
        <h3>{item.title}</h3>
        <p>{item.blurb}</p>
      </Card>
    </li>
  );
}

/** "See it move": six 3D examples from the gallery, by their preview stills. Left out when there are none (stub mode) */
export default function Gallery() {
  return (
    <>
      <SectionHead
        className={HEAD}
        layout="split"
        eyebrow={GALLERY.eyebrow}
        title={GALLERY.title}
        control={
          <Link to={EXAMPLES} className={styles.more}>
            Browse all examples
            <Icon name="arrow-right" size={14} strokeWidth={2} />
          </Link>
        }
      />
      <ul className={styles.gallery}>
        {GALLERY.items.map((item) => (
          <GalleryCard key={item.name} item={item} />
        ))}
      </ul>
    </>
  );
}
