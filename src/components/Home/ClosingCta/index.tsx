import { useRef } from 'react';
import { ButtonRow } from '@site/src/components/ui/Button';
import Card from '@site/src/components/ui/Card';
import ClayShape from '@site/src/components/ui/Clay';
import { gsap, ScrollTrigger, SplitText } from '@site/src/motion/gsap';
import { useMotion } from '@site/src/motion/useMotion';
import styles from '../classes';
import MagneticButton from '../MagneticButton';

/** The page's one four-corner set, with the doughnut at the bottom right */
const CORNERS = {
  tl: <ClayShape shape="pyramid-pink" className={styles.closingShape} />,
  tr: <ClayShape shape="cube-violet" className={styles.closingShape} />,
  br: <ClayShape shape="torus-cyan" className={styles.closingShape} />,
  bl: <ClayShape shape="sphere-cyan" className={styles.closingShape} />,
};
const TILT = [-6, 5, -9];

/**
 * The closing card (section 8.4 item 8). Its words tumble in, the lede and buttons rise, and the corner shapes
 * spring out, then bob while the card is on screen and lean when hovered (M19).
 */
export default function ClosingCta({ lede }: { lede: string }) {
  const root = useRef<HTMLDivElement>(null);

  useMotion(root, (el, { fine, paused }) => {
    const shapes = gsap.utils.toArray<HTMLElement>('.clay', el);

    if (!paused && !ScrollTrigger.isInViewport(el, 0.1)) {
      const { words } = SplitText.create(el.querySelector('h2'), { type: 'words', aria: 'auto' });

      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
        .from(words, {
          yPercent: 60,
          rotation: (i) => TILT[i % TILT.length],
          scale: 0.8,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: 0.1,
        })
        .from(el.querySelectorAll('[data-rise]'), { y: 24, opacity: 0, duration: 0.7, stagger: 0.12 }, 0.35)
        .from(
          shapes,
          { scale: 0, rotation: -40, autoAlpha: 0, duration: 0.9, ease: 'back.out(2.2)', stagger: 0.09 },
          0.2,
        );
    }

    const bobs = shapes.map((shape, i) =>
      gsap.to(shape, {
        y: -10,
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.4,
        paused: true,
      }),
    );

    const bobbing = (active: boolean) => bobs.forEach((bob) => bob.paused(!active));

    bobbing(
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => bobbing(self.isActive),
      }).isActive,
    );
    if (!fine) return undefined;

    const lean = (event: Event) => {
      const shape = event.currentTarget as HTMLElement;
      const over = event.type === 'pointerenter';

      gsap.to(shape, {
        rotation: over ? (shapes.indexOf(shape) % 2 ? -10 : 10) : 0,
        duration: over ? 0.4 : 0.9,
        ease: over ? 'back.out(2)' : 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
    };

    shapes.forEach((shape) => {
      shape.addEventListener('pointerenter', lean);
      shape.addEventListener('pointerleave', lean);
    });

    return () =>
      shapes.forEach((shape) => {
        shape.removeEventListener('pointerenter', lean);
        shape.removeEventListener('pointerleave', lean);
      });
  });

  return (
    <div ref={root} className={styles.closing}>
      <Card variant="closing" corners={CORNERS}>
        <h2 className={styles.closingTitle} id="closing-title">
          Go beyond traditional HTML5.
        </h2>
        <p className={styles.closingLede} data-rise="">
          {lede}
        </p>
        <div data-rise="">
          <ButtonRow>
            <MagneticButton to="https://github.com/pixijs/pixijs/releases" arrow>
              Download
            </MagneticButton>
            <MagneticButton to="/8.x/guides/getting-started/intro" variant="outline-pink">
              Getting started
            </MagneticButton>
          </ButtonRow>
        </div>
      </Card>
    </div>
  );
}
