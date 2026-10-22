import clsx from 'clsx';
import { useRef } from 'react';
import Card from '@site/src/components/ui/Card';
import Icon from '@site/src/components/ui/Icon';
import SectionHead from '@site/src/components/ui/SectionHead';
import { gsap } from '@site/src/motion/gsap';
import { useMotion } from '@site/src/motion/useMotion';
import { HEAD } from '../Band';
import { inlineCode } from '../inlineCode';
import { scoped } from '../scoped';
import Still from '../Still';

import type { IconName } from '@site/src/components/ui/Icon';

/** `hm-tiles-*`, from `_tiles.scss`, which the `/2d` and `/3d` stylesheets include */
const styles = scoped('tiles');

export interface Tile {
  title: string;
  /** Inline code is marked with backticks */
  text: string;
  icon?: IconName;
  /** Wide tiles show a still drawn for them: `/images/home/<dir>/<still>-<theme>.webp` */
  still?: string;
  /** Credit for what the still shows, over its corner */
  credit?: string;
}

interface TileGridProps {
  eyebrow: string;
  title: string;
  /** The title's id, for the band's `aria-labelledby` */
  id?: string;
  tiles: Tile[];
  /** The home the stills were drawn for */
  dir?: '2d' | '3d';
  /** Added to each still, for its backdrop */
  stillClassName?: string;
}

/** A home's features: wide tiles with stills, and icon tiles around them */
export default function TileGrid({ eyebrow, title, id, tiles, dir, stillClassName }: TileGridProps) {
  const grid = useRef<HTMLUListElement>(null);

  // The wide tiles' stills drift inside their clipped frames as the tile crosses the screen
  useMotion(grid, (root) => {
    for (const frame of gsap.utils.toArray<HTMLElement>(`.${styles.media}`, root)) {
      gsap.fromTo(
        frame.firstElementChild,
        { y: 30 },
        { y: -30, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 1 } },
      );
    }
  });

  return (
    <>
      <SectionHead eyebrow={eyebrow} title={title} underline id={id} className={HEAD} />
      <ul ref={grid} className={styles.grid}>
        {tiles.map((tile) => (
          <li key={tile.title} className={clsx(tile.still && styles.wide)} data-reveal="">
            <Card className={styles.tile}>
              {tile.still && (
                <figure className={styles.media}>
                  <Still dir={dir} name={tile.still} className={stillClassName} />
                  {tile.credit && <figcaption>{tile.credit}</figcaption>}
                </figure>
              )}
              {tile.icon && (
                <span className={styles.icon}>
                  <Icon name={tile.icon} size={24} strokeWidth={1.6} />
                </span>
              )}
              <div className={styles.text}>
                <h3>{tile.title}</h3>
                <p>{inlineCode(tile.text)}</p>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
