import clsx from 'clsx';
import { useRef } from 'react';
import { ButtonRow } from '@site/src/components/ui/Button';
import WaveDivider from '@site/src/components/ui/WaveDivider';
import PauseMotionButton from '@site/src/motion/PauseMotionButton';
import { useHeadlineWave } from '@site/src/motion/useHeadlineWave';
import styles, { HERO_CSS } from './styles';
import HeroField from './HeroField';
import { useScrollOut } from './useScrollOut';

export { Logo, Logo3D } from './Logo';

import type { WaveSurface } from '@site/src/components/ui/WaveDivider';
import type { ReactNode, Ref } from 'react';
import type { HeroFieldHandle } from './HeroField';

export type { HeroFieldHandle };

interface HeroProps {
  /** The PixiJS logo over everything else: `Logo`, or `Logo3D` */
  logo?: ReactNode;
  /** The H1's content. Mark accent words with `data-accent`, inside a `data-accent-group` with a `<Squiggle stretch />`; never re-render it */
  title: ReactNode;
  lede?: ReactNode;
  /** CTA buttons, laid out in a `ButtonRow` */
  actions?: ReactNode;
  /** Announcement chips under the buttons */
  chips?: ReactNode;
  /** The surface of the band below, which the drifting wave hands off to */
  next?: WaveSurface;
  /** Handle for the field's puffs, such as one from "3D" when it's hovered */
  field?: Ref<HeroFieldHandle>;
  /** Stands the shapes the other way round, so a second page with this hero has its own composition */
  mirror?: boolean;
}

/**
 * The homepage hero (section 8.1): the clay field with its poster, the copy the field keeps clear of line by
 * line, the Pause motion control and the drifting wave into the next band. Motion: the headline wave (M1/M2),
 * the squiggle wiping in (CSS, so it's hidden from the first paint) and the scroll-out (M16).
 */
export default function Hero({ logo, title, lede, actions, chips, next = 'bg-alt', field, mirror }: HeroProps) {
  const section = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);

  useHeadlineWave(headline);
  useScrollOut(section, copy, `.${styles.field}`, `.${styles.wave}`);

  return (
    <section ref={section} className={clsx(styles.root, mirror && styles.mirrored)}>
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />
      <HeroField ref={field} guard={copy} mirror={mirror} className={styles.field} />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.copy}>
        <div ref={copy} className={styles.copyInner}>
          {logo && <div className={styles.mark}>{logo}</div>}
          <h1 ref={headline} className={styles.title}>
            <span data-lines="">{title}</span>
          </h1>
          {lede && (
            <p className={styles.lede}>
              <span data-lines="">{lede}</span>
            </p>
          )}
          {actions && <ButtonRow className={styles.actions}>{actions}</ButtonRow>}
          {chips && <div className={styles.chips}>{chips}</div>}
        </div>
      </div>
      <PauseMotionButton glass className={styles.pause} />
      <WaveDivider from="hero" to={next} variant="drift" className={styles.wave} />
    </section>
  );
}
