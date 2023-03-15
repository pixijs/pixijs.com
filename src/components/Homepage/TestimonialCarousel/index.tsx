/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from 'react';
import styles from './index.module.scss';

export default function TestimonialCarousel(): JSX.Element {
  const brands = [
    'adobe',
    '20th_century_fox',
    'barclays',
    'bbc',
    'bose',
    'cartoon_network',
    'disney',
    'google',
    'hbo',
    'hm',
    'lego',
    'lucasfilm',
    'marvel',
    'mcdonalds',
    'orange',
    'pbs',
    'rayban',
    'redbull',
    'spotify',
    'steam',
    'tedx',
    'toyota',
    'ubisoft',
    'volkswagen',
    'youtube',
  ];

  return (
    <div className={`${styles.testimonialsSection} padding-vert--lg`}>
      <p className={styles.carouselText}>
        A mature solution for hundreds of global brands
      </p>
      <div
        style={{ '--carousel-amount': brands.length } as any}
        className={styles.carouselWrapper}
      >
        <div className={`col col--12 ${styles.carousel}`}>
          {[...brands, ...brands].map((brand, index) => (
            <div key={index} className={styles.carouselItem}>
              <img src={`/images/brand-logos/${brand}.png`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
