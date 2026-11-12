import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import { useRef } from 'react';
import Button, { ButtonRow } from '@site/src/components/ui/Button';
import Chip from '@site/src/components/ui/Chip';
import SectionHead, { Squiggle } from '@site/src/components/ui/SectionHead';
import WaveDivider from '@site/src/components/ui/WaveDivider';
import PauseMotionButton from '@site/src/motion/PauseMotionButton';
import { useClayField } from '@site/src/motion/useClayField';
import { useHeadlineWave } from '@site/src/motion/useHeadlineWave';
import { useMagnetic } from '@site/src/motion/useMagnetic';
import Blob from './_styleguide/Blob';
import { Colour, Contrast, Icons, MotionTokens, SpaceAndShape, TypeScale } from './_styleguide/Foundations';
import { Band } from './_styleguide/Frame';
import MotionLab from './_styleguide/MotionLab';
import { Buttons, Cards, Controls, Dividers, Heads, Labels } from './_styleguide/Primitives';
import styles, { STYLESHEET } from './_styleguide/classes';
import ThemePair from './_styleguide/ThemePair';

import type { WaveVariant } from '@site/src/components/ui/WaveDivider';
import type { ComponentType, CSSProperties, ReactNode } from 'react';

/** `--l/--r/--t/--b` place a shape; the `--p*` variants override them below 1280, where only `compact` shapes show */
const HERO_SHAPES: Array<{ shape: string; size: number; depth: number; at: CSSProperties; compact?: boolean }> = [
  {
    shape: 'torus-pink',
    size: 104,
    depth: 0.7,
    at: { '--l': '6%', '--t': '16%', '--pl': 'auto', '--pr': '-22px', '--pt': '12px' } as CSSProperties,
    compact: true,
  },
  { shape: 'sphere-violet', size: 72, depth: 1.1, at: { '--l': '9%', '--t': '66%' } as CSSProperties },
  { shape: 'pyramid-cyan', size: 66, depth: 0.5, at: { '--l': '2%', '--t': '42%' } as CSSProperties },
  {
    shape: 'cube-violet',
    size: 64,
    depth: 0.9,
    at: { '--r': '8%', '--t': '14%', '--pl': '-18px', '--pt': 'auto', '--pb': '56px' } as CSSProperties,
    compact: true,
  },
  { shape: 'sphere-cyan', size: 96, depth: 0.6, at: { '--r': '4%', '--t': '50%' } as CSSProperties },
  { shape: 'capsule-rose', size: 58, depth: 1.2, at: { '--r': '10%', '--t': '78%' } as CSSProperties },
];

interface SectionDef {
  id: string;
  group: string;
  title: string;
  lede: string;
  grid?: boolean;
  Body: ComponentType;
}

const BODIES: SectionDef[] = [
  {
    id: 'colour',
    group: 'Foundations',
    title: 'Colour',
    lede: 'Pink carries the brand. Each swatch shows light on the left and dark on the right, read from the stylesheet.',
    Body: Colour,
  },
  {
    id: 'contrast',
    group: 'Foundations',
    title: 'Contrast',
    lede: 'The section 5.6 pairs, computed from the live colours in both themes.',
    Body: Contrast,
  },
  {
    id: 'type',
    group: 'Foundations',
    title: 'Type',
    lede: 'Outfit for display, Roboto for reading, Roboto Mono for code and labels.',
    Body: TypeScale,
  },
  {
    id: 'space',
    group: 'Foundations',
    title: 'Space & shape',
    lede: 'Spacing, radii, elevation, layout widths, breakpoints and layers.',
    Body: SpaceAndShape,
  },
  {
    id: 'motion-tokens',
    group: 'Foundations',
    title: 'Motion tokens',
    lede: 'CSS owns hover, press and disclosure; GSAP owns scroll and the playful bits.',
    Body: MotionTokens,
  },
  {
    id: 'icons',
    group: 'Foundations',
    title: 'Icons',
    lede: 'One local sprite. Brand glyphs are filled; everything else is a 24 px line icon.',
    Body: Icons,
  },
  {
    id: 'buttons',
    group: 'Primitives',
    title: 'Buttons',
    lede: 'Pill buttons with the offset shadow from the mockups, in every state.',
    Body: Buttons,
  },
  {
    id: 'labels',
    group: 'Primitives',
    title: 'Labels',
    lede: 'Badges, announcement chips, tags and package chips.',
    Body: Labels,
  },
  { id: 'cards', group: 'Primitives', title: 'Cards', lede: 'Base, link and closing cards.', Body: Cards },
  {
    id: 'controls',
    group: 'Primitives',
    title: 'Controls',
    lede: 'The segmented control in its three sizes, and as links.',
    Body: Controls,
  },
  {
    id: 'dividers',
    group: 'Primitives',
    title: 'Dividers',
    lede: 'Bands join with a soft wave instead of a hard edge.',
    Body: Dividers,
  },
  {
    id: 'heads',
    group: 'Primitives',
    title: 'Section heads',
    lede: 'Eyebrow, title, underline and lede, centred or split. Scroll them in to see useSplitTitle.',
    grid: true,
    Body: Heads,
  },
  {
    id: 'motion',
    group: 'Motion',
    title: 'Motion lab',
    lede: 'Every hook in src/motion, live. With reduced motion on, each one sits still in its final state.',
    Body: MotionLab,
  },
  {
    id: 'themes',
    group: 'Themes',
    title: 'Side by side',
    lede: 'The same composition in a light and a dark island, whatever the site theme.',
    Body: ThemePair,
  },
];

const WAVES: WaveVariant[] = ['a', 'b', 'c'];

function Hero() {
  const band = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const primary = useRef<HTMLAnchorElement>(null);
  const secondary = useRef<HTMLAnchorElement>(null);

  useClayField(band);
  useHeadlineWave(headline);
  useMagnetic(primary);
  useMagnetic(secondary);

  return (
    <header ref={band} className={styles.hero}>
      {HERO_SHAPES.map(({ shape, size, depth, at, compact }) => (
        <Blob
          key={shape}
          shape={shape}
          size={size}
          depth={depth}
          className={clsx(styles.heroShape, !compact && styles.wideOnly)}
          style={at}
        />
      ))}
      <div className={styles.heroCopy}>
        <p className={styles.heroEyebrow}>PixiJS · design system</p>
        <h1 ref={headline} className={styles.heroTitle}>
          Tokens, type and motion for{' '}
          <span className={styles.accentGroup}>
            <span data-accent="" className={styles.accentWord}>
              2D
            </span>{' '}
            and{' '}
            <span data-accent="" className={styles.accentWord}>
              3D
            </span>
            <Squiggle className={styles.heroSquiggle} />
          </span>
        </h1>
        <p className={styles.heroLede}>
          Every colour, size and primitive pixijs.com is built from, read live from the CSS. Hover the headline, push
          the shapes around, then flip the theme.
        </p>
        <ButtonRow>
          <Button ref={primary} to="#buttons" arrow>
            Browse primitives
          </Button>
          <Button ref={secondary} to="#motion" variant="outline" glass>
            Motion lab
          </Button>
        </ButtonRow>
        <Chip to="#themes" badge="New">
          Light and dark, side by side
        </Chip>
      </div>
      <PauseMotionButton className={styles.heroPause} />
    </header>
  );
}

export default function Styleguide(): ReactNode {
  return (
    <Layout title="Styleguide" description="The pixijs.com design system: tokens, type, primitives and motion.">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className={styles.page}>
        <style dangerouslySetInnerHTML={{ __html: STYLESHEET }} />
        <Hero />
        <WaveDivider from="hero" to="bg" variant="drift" />
        <nav className={styles.jump} aria-label="Styleguide sections">
          {BODIES.map(({ id, title }) => (
            <Link key={id} to={`#${id}`}>
              {title}
            </Link>
          ))}
        </nav>
        {BODIES.map(({ id, group, title, lede, grid, Body }, i) => {
          const surface = i % 2 ? 'bg-alt' : 'bg';

          return (
            <div key={id}>
              {i > 0 && <WaveDivider from={i % 2 ? 'bg' : 'bg-alt'} to={surface} variant={WAVES[i % WAVES.length]} />}
              <Band id={id} surface={surface} grid={grid}>
                <SectionHead
                  layout="split"
                  eyebrow={`${String(i + 1).padStart(2, '0')} · ${group}`}
                  title={title}
                  lede={lede}
                  className={styles.sectionHead}
                />
                <Body />
              </Band>
            </div>
          );
        })}
      </main>
    </Layout>
  );
}
