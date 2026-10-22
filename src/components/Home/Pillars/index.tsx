import { useRef } from 'react';
import { Squiggle } from '@site/src/components/ui/SectionHead';
import { bleedMasks, gsap, ScrollTrigger, SplitText } from '@site/src/motion/gsap';
import { useMotion } from '@site/src/motion/useMotion';
import styles from '../classes';

export interface Pillar {
  title: string;
  copy: string;
}

interface PillarsProps {
  items: Pillar[];
}

/**
 * Fast / Flexible / Free: numbered columns that play in one after another when the row scrolls in (section 8.4
 * item 3). The number scrambles, the title rises out of a mask, the squiggle draws and the copy fades up.
 */
export default function Pillars({ items }: PillarsProps) {
  const list = useRef<HTMLOListElement>(null);

  useMotion(list, (root, { paused }) => {
    if (paused || ScrollTrigger.isInViewport(root, 0.1)) return;
    const timeline = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 92%', once: true } });

    gsap.utils.toArray<HTMLElement>('[data-pillar]', root).forEach((pillar, i) => {
      const at = i * 0.12;
      const { chars, masks } = SplitText.create(pillar.querySelector('h3'), {
        type: 'lines,chars',
        mask: 'lines',
        aria: 'auto',
      });

      bleedMasks(masks);
      timeline
        .from(pillar.querySelector('[data-number]'), { autoAlpha: 0, duration: 0.3 }, at)
        .to(
          pillar.querySelector('[data-number]'),
          { duration: 0.6, scrambleText: { text: '{original}', chars: '0123456789', speed: 0.6 } },
          at,
        )
        .from(chars, { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.02 }, at + 0.05)
        .from(
          pillar.querySelector('[data-squiggle] path'),
          { drawSVG: '0%', duration: 0.7, ease: 'power2.inOut' },
          at + 0.25,
        )
        .from(pillar.querySelector('p'), { y: 16, autoAlpha: 0, duration: 0.7 }, at + 0.3);
    });
  });

  return (
    <ol ref={list} className={styles.pillars}>
      {items.map(({ title, copy }, index) => (
        <li key={title} className={styles.pillar} data-pillar="">
          <span className={styles.pillarNumber} data-number="" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className={styles.pillarTitle}>{title}</h3>
          <Squiggle className={styles.pillarSquiggle} />
          <p className={styles.pillarCopy}>{copy}</p>
        </li>
      ))}
    </ol>
  );
}
