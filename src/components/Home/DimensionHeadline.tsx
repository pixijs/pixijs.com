import { useRef } from 'react';
import { Squiggle } from '@site/src/components/ui/SectionHead';
import { gsap } from '@site/src/motion/gsap';
import { useMotion } from '@site/src/motion/useMotion';
import styles from './classes';

import type { HeroFieldHandle } from './Hero';
import type { RefObject } from 'react';

interface DimensionHeadlineProps {
  field: RefObject<HeroFieldHandle | null>;
}

/**
 * The combined home's headline (section 8.4 item 1). Hovering or tapping "2D" squashes the word, and "3D" pops it and
 * sends a puff through the hero's clay from it, as on `/3d`. The two words are decoration, not controls: nothing
 * depends on them.
 */
export default function DimensionHeadline({ field }: DimensionHeadlineProps) {
  const root = useRef<HTMLSpanElement>(null);

  useMotion(root, (el, { safe }) => {
    const [flat, deep] = gsap.utils.toArray<HTMLElement>('[data-accent]', el);
    const squash = safe(() =>
      gsap.fromTo(
        flat,
        { scaleY: 0.8, transformOrigin: '50% 100%' },
        { scaleY: 1, duration: 0.6, ease: 'back.out(3)', overwrite: true },
      ),
    );
    const pop = safe(() =>
      gsap.fromTo(deep, { scale: 1.15 }, { scale: 1, duration: 0.6, ease: 'back.out(3)', overwrite: true }),
    );

    flat.addEventListener('pointerenter', squash);
    deep.addEventListener('pointerenter', pop);

    return () => {
      flat.removeEventListener('pointerenter', squash);
      deep.removeEventListener('pointerenter', pop);
    };
  });

  return (
    <span ref={root}>
      The HTML5 Creation Engine, <br className={styles.heroBreak} />
      now in{' '}
      <span data-accent-group="">
        <span data-accent="" data-dimension="2d" role="presentation">
          2D
        </span>{' '}
        and{' '}
        <span
          data-accent=""
          data-extrude=""
          data-dimension="3d"
          role="presentation"
          onPointerEnter={(event) => field.current?.pump(event.currentTarget)}
        >
          3D
        </span>
        <Squiggle stretch />
      </span>
    </span>
  );
}
