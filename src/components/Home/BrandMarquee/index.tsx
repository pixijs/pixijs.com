import { useRef } from 'react';
import { useMarquee } from '@site/src/motion/useMarquee';
import Band from '../Band';
import styles from '../classes';

import type { CSSProperties } from 'react';

/**
 * File name in `static/images/brand-logos/`, the name read out for it, and its size in CSS px at desktop. Each PNG
 * is a one-colour mask trimmed to its ink; the sizes are the old site's ink boxes, so the row reads at its scale.
 * Toyota and Red Bull are new artwork, sized to the weight of the lockups beside them.
 */
const BRANDS: [file: string, name: string, width: number, height: number][] = [
  ['marvel', 'Marvel', 77, 35],
  ['redbull', 'Red Bull', 101, 24],
  ['spotify', 'Spotify', 111, 33],
  ['youtube', 'YouTube', 80, 33],
  ['adobe', 'Adobe', 40, 55],
  ['disney', 'Disney', 95, 39],
  ['google', 'Google', 97, 32],
  ['bbc', 'BBC', 97, 27],
  ['hbo', 'HBO', 78, 32],
  ['lego', 'LEGO', 55, 55],
  ['20th_century_fox', '20th Century Fox', 68, 55],
  ['barclays', 'Barclays', 108, 18],
  ['bose', 'Bose', 114, 14],
  ['cartoon_network', 'Cartoon Network', 82, 47],
  ['hm', 'H&M', 66, 44],
  ['lucasfilm', 'Lucasfilm', 101, 33],
  ['mcdonalds', "McDonald's", 57, 50],
  ['orange', 'Orange', 55, 55],
  ['pbs', 'PBS', 58, 58],
  ['rayban', 'Ray-Ban', 82, 44],
  ['steam', 'Steam', 97, 29],
  ['tedx', 'TEDx', 88, 25],
  ['toyota', 'Toyota', 122, 20],
  ['ubisoft', 'Ubisoft', 64, 59],
  ['volkswagen', 'Volkswagen', 55, 55],
];

/**
 * The brand logos, looping (M7). The track holds two copies so the loop is seamless; both are decorative, and the
 * names are read at the end of the caption. Each logo is its mask filled with the ink colour, so it follows the
 * theme. Reduced motion shows them all in a still, centred grid.
 */
export default function BrandMarquee() {
  const track = useRef<HTMLDivElement>(null);

  useMarquee(track, { duration: 90 });

  return (
    <Band surface="bg-alt" next="bg" wave="b" contained={false} className={styles.marquee}>
      <p className={styles.marqueeCaption}>
        Used by hundreds of global brands
        <span className={styles.visuallyHidden}>, among them {BRANDS.map(([, name]) => name).join(', ')}.</span>
      </p>
      <div className={styles.marqueeView} aria-hidden="true">
        <div ref={track} className={styles.marqueeTrack}>
          {[0, 1].map((copy) => (
            <div key={copy} className={styles.marqueeCopy}>
              {BRANDS.map(([file, , width, height]) => (
                <span
                  key={file}
                  className={styles.marqueeLogo}
                  style={
                    { '--logo': `url(/images/brand-logos/${file}.png)`, '--w': width, '--h': height } as CSSProperties
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Band>
  );
}
