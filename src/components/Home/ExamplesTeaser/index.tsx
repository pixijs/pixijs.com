import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useState } from 'react';
import Card from '@site/src/components/ui/Card';
import Icon from '@site/src/components/ui/Icon';
import SectionHead from '@site/src/components/ui/SectionHead';
import styles from '../classes';
import { EXAMPLE_COUNT, EXAMPLES } from '../content/twoD';
import { motionAllowed } from '@site/src/motion/pause';

import type { ExampleTeaser } from '../content/twoD';

/** One example: its still, with the short animated preview over it while the pointer rests on the card */
function ExampleCard({ id, title, category, blurb }: ExampleTeaser) {
  const [playing, setPlaying] = useState(false);
  const [stuck, setStuck] = useState(false);
  const base = useBaseUrl(`/examples/previews/${id}`);

  return (
    <li
      className={styles.example}
      data-reveal=""
      onPointerEnter={() => setPlaying(motionAllowed())}
      onPointerLeave={() => setPlaying(false)}
    >
      <Card
        variant="link"
        to={`/8.x/examples?example=${id}`}
        media={
          <span className={styles.exampleMedia}>
            <img src={`${base}_thumbnail.webp`} width={598} height={338} alt="" loading="lazy" decoding="async" />
            {playing && !stuck && (
              <img src={`${base}.webp`} width={320} height={181} alt="" onError={() => setStuck(true)} />
            )}
          </span>
        }
      >
        <p className={styles.exampleCategory}>{category}</p>
        <h3>{title}</h3>
        <p>{blurb}</p>
      </Card>
    </li>
  );
}

/** Six examples from the 2D gallery, each opening in the examples app; phones swipe through them */
export default function ExamplesTeaser() {
  return (
    <>
      <SectionHead
        className={styles.head}
        layout="split"
        eyebrow="EXAMPLES"
        title={`${EXAMPLE_COUNT} examples, ready to remix.`}
        id="examples-title"
        control={
          <Link to="/8.x/examples" className={styles.more}>
            Browse all examples
            <Icon name="arrow-right" size={14} strokeWidth={2} />
          </Link>
        }
      />
      <ul className={styles.examples}>
        {EXAMPLES.map((example) => (
          <ExampleCard key={example.id} {...example} />
        ))}
      </ul>
    </>
  );
}
