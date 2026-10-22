import { useRef } from 'react';
import { ButtonRow } from '@site/src/components/ui/Button';
import Card from '@site/src/components/ui/Card';
import { EASE, gsap, ScrollTrigger, SplitText } from '@site/src/motion/gsap';
import { useClayField } from '@site/src/motion/useClayField';
import { useMotion } from '@site/src/motion/useMotion';
import { scoped } from '../scoped';

import type { CardCorner } from '@site/src/components/ui/Card';
import type { ReactNode } from 'react';

/** `hm-closingCard`, from `_closing-card.scss`, which the `/2d` and `/3d` stylesheets include */
const styles = scoped();

interface ClosingCardProps {
  /** Clay shapes on the card's corners */
  corners: Record<CardCorner, ReactNode>;
  title: string;
  /** The title's id, for the band's `aria-labelledby` */
  titleId?: string;
  lede: string;
  /** The buttons, laid out in a `ButtonRow` */
  children: ReactNode;
}

/** The closing card on `/2d` and `/3d` (M19): its words tumble in, the rest rises, and clay springs from its corners */
export default function ClosingCard({ corners, title, titleId, lede, children }: ClosingCardProps) {
  const root = useRef<HTMLDivElement>(null);

  useClayField(root);
  useMotion(root, (card, { paused }) => {
    if (paused || ScrollTrigger.isInViewport(card, 0.1)) return;
    const scrollTrigger = { trigger: card, start: 'top 78%', once: true };

    SplitText.create(card.querySelector('h2'), {
      type: 'words',
      aria: 'auto',
      autoSplit: true,
      onSplit: (split) =>
        gsap.from(split.words, {
          rotation: (i) => [-6, 5, -9][i % 3],
          yPercent: 60,
          scale: 0.8,
          autoAlpha: 0,
          duration: 0.8,
          ease: EASE.spring,
          stagger: 0.1,
          scrollTrigger,
        }),
    });
    gsap.from(card.querySelectorAll('[data-rise]'), {
      y: 24,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      delay: 0.35,
      scrollTrigger,
    });
  });

  return (
    <div ref={root} className={styles.closingCard}>
      <Card variant="closing" corners={corners}>
        <h2 id={titleId}>{title}</h2>
        <p data-rise="">{lede}</p>
        <div data-rise="">
          <ButtonRow>{children}</ButtonRow>
        </div>
      </Card>
    </div>
  );
}
