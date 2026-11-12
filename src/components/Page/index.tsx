import clsx from 'clsx';
import { useId } from 'react';
import {
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  posterBlobs,
  RIM_REACH,
  SHADOW_GROW,
} from '@site/src/components/Home/Hero/poster';
import { ButtonRow } from '@site/src/components/ui/Button';
import Card from '@site/src/components/ui/Card';
import ClayShape from '@site/src/components/ui/Clay';
import WaveDivider from '@site/src/components/ui/WaveDivider';
import PauseMotionButton from '@site/src/motion/PauseMotionButton';
import styles, { STYLESHEET } from './classes';

import type { CardCorner } from '@site/src/components/ui/Card';
import type { ClayShapeName } from '@site/src/components/ui/Clay';
import type { WaveVariant } from '@site/src/components/ui/WaveDivider';
import type { ReactNode, RefObject } from 'react';

export type BandSurface = 'bg' | 'bg-alt';

/** Pink accent words in a page title, with the hero's hand-drawn underline */
export function Accent({ children }: { children: ReactNode }) {
  return <span className={styles.accent}>{children}</span>;
}

/** The homes' hero backdrop: the blob masses, each lit along its top and shading the surface under it */
function Backdrop() {
  const id = useId();

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <svg
        className={styles.blobs}
        viewBox={`0 0 ${DESIGN_WIDTH} ${DESIGN_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <linearGradient id={`${id}rim`} x2="0" y2="1">
            <stop offset="0" className={styles.rimStart} />
            <stop offset={RIM_REACH} className={styles.rimEnd} />
          </linearGradient>
          <radialGradient id={`${id}shade`}>
            <stop offset={1 / SHADOW_GROW} className={styles.shadeStart} />
            <stop offset="1" className={styles.shadeEnd} />
          </radialGradient>
        </defs>
        {posterBlobs.map(({ body, shadow }, index) => (
          <g key={index}>
            <path d={shadow} fill={`url(#${id}shade)`} />
            <path d={body} style={{ fill: `var(--blob-${index})` }} />
            <path d={body} fill={`url(#${id}rim)`} />
          </g>
        ))}
      </svg>
    </div>
  );
}

export interface PageHeaderProps {
  eyebrow: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  /** Above the eyebrow, such as the 404's clay */
  art?: ReactNode;
  /** The surface of the first band, which the header's wave is the edge of; none when the header is the whole page */
  next?: BandSurface;
  /** Two clay shapes framing the copy: the first above its top left, the second below its bottom right */
  clay: [ClayShapeName, ClayShapeName];
  /**
   * `useClayField` on `ref` drives the shapes (GSAP pages), and the Pause motion control sits in the corner;
   * otherwise they pop in once with CSS
   */
  live?: boolean;
  /** In place of the blob backdrop, such as the showcase's wall */
  backdrop?: ReactNode;
  /** Below the actions, such as a stats row */
  children?: ReactNode;
  className?: string;
  ref?: RefObject<HTMLElement | null>;
}

/**
 * The first band of every standalone page, in the homes' hero language: the blob backdrop with its lattice, shade
 * and glow, the page's only h1 with its eyebrow, lede and actions, and the drift wave that is the first band's edge
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  actions,
  art,
  next,
  clay,
  live,
  backdrop = <Backdrop />,
  children,
  className,
  ref,
}: PageHeaderProps) {
  return (
    <header ref={ref} className={clsx(styles.header, className)}>
      {backdrop}
      <div className={styles.copy}>
        <div className={styles.intro}>
          {art && <div className={styles.art}>{art}</div>}
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          {lede && <p className={styles.lede}>{lede}</p>}
          {actions && <ButtonRow className={styles.actions}>{actions}</ButtonRow>}
          {clay.map((shape, index) => (
            <ClayShape
              key={shape}
              shape={shape}
              depth={index ? 0.6 : 0.8}
              className={clsx(styles.clay, index ? styles.companion : styles.lead, live ? styles.live : styles.pop)}
            />
          ))}
        </div>
        {children}
      </div>
      {live && (
        <div className={styles.corner}>
          <PauseMotionButton glass />
        </div>
      )}
      {next && <WaveDivider from="hero" to={next} variant="drift" className={styles.headerWave} />}
    </header>
  );
}

interface BandProps {
  /** Tiled (`bg`) or plain (`bg-alt`); alternate them, up from a tiled last band */
  surface?: BandSurface;
  /** The wave that is this band's top edge; left out on the band under the header, whose wave is the edge */
  edge?: WaveVariant;
  /** Mirror the edge */
  flip?: boolean;
  /** A soft light behind the band's content */
  glow?: boolean;
  id?: string;
  label?: string;
  /** Id of the heading that names the band */
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}

/**
 * One layer of a page, as on the homes: tiled or plain, shaded from its lit ridge to its foot, with its edge drawn
 * by a wave that overlaps the seam with the layer above and casts a shadow onto it
 */
export function Band({ surface = 'bg', edge, flip, glow, id, label, labelledBy, className, children }: BandProps) {
  return (
    <>
      {edge && (
        <WaveDivider
          from={surface === 'bg' ? 'bg-alt' : 'bg'}
          to={surface}
          variant={edge}
          flip={flip}
          className={styles.wave}
        />
      )}
      <section
        id={id}
        aria-label={label}
        aria-labelledby={labelledBy}
        className={clsx(styles.band, glow && styles.glow, className)}
        data-surface={surface}
      >
        <div className={styles.container}>{children}</div>
      </section>
    </>
  );
}

const CLOSING_CORNERS: Record<CardCorner, ClayShapeName> = {
  tl: 'pyramid-pink',
  tr: 'cube-violet',
  br: 'torus-cyan',
  bl: 'sphere-cyan',
};

interface ClosingProps {
  title: ReactNode;
  lede?: ReactNode;
  actions: ReactNode;
  /** Shapes to swap in at the card's corners, so each page's set differs; the doughnut stays bottom right */
  corners?: Partial<Record<CardCorner, ClayShapeName>>;
  /** For `useClayField`, which springs and bobs the corner shapes on GSAP pages */
  ref?: RefObject<HTMLDivElement | null>;
}

/** The closing call to action, as on the homes: a lit card with clay at its corners */
export function Closing({ title, lede, actions, corners, ref }: ClosingProps) {
  const shapes = Object.fromEntries(
    Object.entries({ ...CLOSING_CORNERS, ...corners }).map(([corner, shape]) => [
      corner,
      <ClayShape key={corner} shape={shape} depth={0.25} />,
    ]),
  );

  return (
    <div ref={ref} className={styles.closing}>
      <Card variant="closing" corners={shapes}>
        <h2 className={styles.closingTitle}>{title}</h2>
        {lede && <p className={styles.closingLede}>{lede}</p>}
        <ButtonRow className={styles.closingActions}>{actions}</ButtonRow>
      </Card>
    </div>
  );
}

/** Running text with the site's link, list and emphasis styles */
export function Prose({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx(styles.prose, className)}>{children}</div>;
}

/** The class of a surface that stands off its band like the homes' cards, for content that isn't a card grid */
export const panel = styles.panel;

export interface PageProps {
  /** The page's own stylesheet, inlined after the pages' one (see `pageClasses`) */
  css?: string;
  children: ReactNode;
  ref?: RefObject<HTMLDivElement | null>;
}

/** The wrapper every page renders inside `Layout`: the page's stylesheet, its surfaces and the container query root */
export function Page({ css = '', children, ref }: PageProps) {
  return (
    <div ref={ref} className={styles.root}>
      <style dangerouslySetInnerHTML={{ __html: STYLESHEET + css }} />
      {children}
    </div>
  );
}
