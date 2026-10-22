import Link from '@docusaurus/Link';
import { useEffect, useRef, useState } from 'react';
import Button from '@site/src/components/ui/Button';
import Card from '@site/src/components/ui/Card';
import Icon from '@site/src/components/ui/Icon';
import SectionHead from '@site/src/components/ui/SectionHead';
import Tag from '@site/src/components/ui/Tag';
import { showcaseItems } from '@site/src/data/showcase';
import styles from '../classes';

const ITEMS = showcaseItems.slice(0, 10);

/**
 * "Made with PixiJS" (section 8.4 item 7): the first ten showcase entries in a native, snapping horizontal
 * scroller that bleeds to the band's edges. Fine pointers get previous and next buttons; nothing scrolls on its own.
 */
export default function ShowcaseStrip() {
  const strip = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = strip.current;

    if (!el) return undefined;
    const measure = () =>
      setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });

    measure();
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      el.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const page = (direction: 1 | -1) => {
    const el = strip.current;

    el?.scrollBy({ left: direction * Math.max(280, el.clientWidth * 0.6), behavior: 'smooth' });
  };

  return (
    <>
      <SectionHead
        className={styles.head}
        layout="split"
        eyebrow="SHOWCASE"
        title="Made with PixiJS."
        id="showcase-title"
        control={
          <div className={styles.stripControls}>
            <Link to="/showcase" className={styles.more}>
              See the showcase
              <Icon name="arrow-right" size={14} strokeWidth={2} />
            </Link>
            <span className={styles.stripArrows}>
              <Button
                variant="icon"
                icon="chevron-left"
                aria-label="Previous projects"
                disabled={edge.start}
                onClick={() => page(-1)}
              />
              <Button
                variant="icon"
                icon="chevron-right"
                aria-label="Next projects"
                disabled={edge.end}
                onClick={() => page(1)}
              />
            </span>
          </div>
        }
      />
      {/* A scroller the keyboard can reach and arrow through, even before its cards have risen in */}
      <ul ref={strip} className={styles.strip} tabIndex={0} aria-labelledby="showcase-title">
        {ITEMS.map((item) => (
          <li key={item.title} className={styles.shot} data-reveal="">
            <Card
              variant="link"
              to={item.link}
              media={
                <img
                  className={styles.shotImage}
                  src={item.imageUrl}
                  width={720}
                  height={405}
                  alt={item.alt ?? ''}
                  loading="lazy"
                  decoding="async"
                />
              }
            >
              <h3>{item.title}</h3>
              <p>{item.author}</p>
              {item.sponsoredLink && <Tag className={styles.shotTag}>Sponsored</Tag>}
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
