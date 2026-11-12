import { useRef } from 'react';
import Band from '../Band';
import { BENTO, GALLERY, HERO, TOUR } from '../content/threeD';
import InstallStrip from '../InstallStrip';
import StageDemo from '../StageDemo';
import TileGrid from '../TileGrid';
import { useHomeMotion } from '../useHomeMotion';
import Closing from './Closing';
import Gallery from './Gallery';
import HeroSection from './HeroSection';
import Parity from './Parity';
import styles, { THREE_D_CSS } from './styles';

import type { WaveVariant } from '@site/src/components/ui/WaveDivider';
import type { ComponentType } from 'react';
import type { BandSurface } from '../Band';

const WAVES: WaveVariant[] = ['a', 'b', 'c'];
/** The hero's headline wave and squiggle have played out by now (M1) */
const INTRO_MS = 1800;

function Install() {
  return <InstallStrip install={HERO.install} />;
}

function Tour() {
  return <StageDemo {...TOUR} />;
}

/** "A full 3D engine": two wide tiles with stills, and the rest of the feature list */
function Bento() {
  return <TileGrid {...BENTO} dir="3d" stillClassName={styles.preview} />;
}

/** The sections in order, each with its band's class. The gallery drops out in stub mode */
const SECTIONS: { Content: ComponentType; className?: string }[] = [
  { Content: Install },
  { Content: Tour, className: styles.tourBand },
  { Content: Bento, className: styles.bentoBand },
  { Content: Parity, className: styles.parityBand },
  ...(GALLERY.items.length ? [{ Content: Gallery }] : []),
  { Content: Closing, className: styles.closingBand },
];
/** Surfaces alternate up from the footer's */
const SURFACES = SECTIONS.map((_, i): BandSurface => ((SECTIONS.length - 1 - i) % 2 ? 'bg-alt' : 'bg'));

/** The `/3d` page body (section 8.6), from the hero to the closing card */
export default function ThreeDHome() {
  const page = useRef<HTMLDivElement>(null);

  useHomeMotion(page, INTRO_MS);

  return (
    <div ref={page} className={styles.home} data-home="">
      <style dangerouslySetInnerHTML={{ __html: THREE_D_CSS }} />
      <HeroSection next={SURFACES[0]} />
      {SECTIONS.map(({ Content, className }, i) => (
        <Band
          key={i}
          surface={SURFACES[i]}
          next={SURFACES[i + 1]}
          wave={WAVES[(i + 1) % 3]}
          flip={(i + 1) % 2 === 0}
          className={className}
        >
          <Content />
        </Band>
      ))}
    </div>
  );
}
