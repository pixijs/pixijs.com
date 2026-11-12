import { useRef, useState } from 'react';
import Badge from '@site/src/components/ui/Badge';
import Button from '@site/src/components/ui/Button';
import Card from '@site/src/components/ui/Card';
import SectionHead from '@site/src/components/ui/SectionHead';
import { gsap } from '@site/src/motion/gsap';
import PauseMotionButton from '@site/src/motion/PauseMotionButton';
import { useClayField } from '@site/src/motion/useClayField';
import { useHeadlineWave } from '@site/src/motion/useHeadlineWave';
import { useMagnetic } from '@site/src/motion/useMagnetic';
import { useMarquee } from '@site/src/motion/useMarquee';
import { usePauseMotion } from '@site/src/motion/usePauseMotion';
import { useReveal } from '@site/src/motion/useReveal';
import { useSplitTitle } from '@site/src/motion/useSplitTitle';
import Blob from './Blob';
import { BRAND_LOGOS } from './data';
import styles from './classes';

import type { ReactNode } from 'react';

interface DemoProps {
  hook: string;
  spec: string;
  description: ReactNode;
  wide?: boolean;
  /** Remounts the demo so its hook runs again */
  replay?: boolean;
  children: (key: number) => ReactNode;
}

function Demo({ hook, spec, description, wide, replay = true, children }: DemoProps) {
  const [run, setRun] = useState(0);

  return (
    <Card as="article" className={wide ? styles.demoWide : styles.demo}>
      <header className={styles.demoHead}>
        <h3 className={styles.demoHook}>{hook}</h3>
        <span className={styles.demoSpec}>{spec}</span>
      </header>
      <p className={styles.demoText}>{description}</p>
      <div className={styles.demoStage}>{children(run)}</div>
      {replay && (
        <Button variant="small" icon="play" onClick={() => setRun((n) => n + 1)}>
          Replay
        </Button>
      )}
    </Card>
  );
}

function RevealDemo({ replayed }: { replayed: boolean }) {
  const scope = useRef<HTMLDivElement>(null);

  useReveal(scope, { includeVisible: replayed });

  return (
    <div ref={scope} className={styles.revealGrid}>
      {['up', 'scale', 'left', 'right', 'up', 'scale'].map((variant, i) => (
        <span key={i} className={styles.revealTile} data-reveal={variant}>
          {variant}
        </span>
      ))}
    </div>
  );
}

function SplitTitleDemo({ replayed }: { replayed: boolean }) {
  const scope = useRef<HTMLDivElement>(null);

  useSplitTitle(scope, { includeVisible: replayed });

  return (
    <div ref={scope}>
      <SectionHead
        as="h4"
        eyebrow="Made with PixiJS"
        title="Words rise out of their lines."
        underline
        lede="Eyebrow scrambles in, the lede follows, the squiggle draws. Hover the title to redraw it."
      />
    </div>
  );
}

function WaveDemo() {
  const headline = useRef<HTMLParagraphElement>(null);

  useHeadlineWave(headline);

  return (
    <p ref={headline} className={styles.waveHeadline}>
      Hover me, I wave in <span data-accent="">2D</span> and <span data-accent="">3D</span>
    </p>
  );
}

function MagneticDemo() {
  const primary = useRef<HTMLAnchorElement>(null);
  const outline = useRef<HTMLAnchorElement>(null);

  useMagnetic(primary);
  useMagnetic(outline);

  return (
    <div className={styles.row}>
      <Button ref={primary} to="#motion" arrow>
        Getting started
      </Button>
      <Button ref={outline} to="#motion" variant="outline">
        Tutorials
      </Button>
    </div>
  );
}

function MarqueeDemo() {
  const track = useRef<HTMLDivElement>(null);

  useMarquee(track, { duration: 40 });

  return (
    <div className={styles.marquee}>
      <ul className={styles.srOnly}>
        {BRAND_LOGOS.map((logo) => (
          <li key={logo}>{logo}</li>
        ))}
      </ul>
      <div ref={track} className={styles.marqueeTrack} aria-hidden="true">
        {[0, 1].map((copy) =>
          BRAND_LOGOS.map((logo) => (
            <img
              key={`${copy}-${logo}`}
              src={`/images/brand-logos/${logo}.png`}
              alt=""
              width={97}
              height={40}
              loading="lazy"
            />
          )),
        )}
      </div>
    </div>
  );
}

const FIELD: Array<[string, number, number, string, string]> = [
  ['sphere-violet', 76, 0.9, '8%', '18%'],
  ['torus-pink', 92, 0.6, '30%', '54%'],
  ['cube-violet', 60, 1.1, '52%', '14%'],
  ['pyramid-cyan', 70, 0.5, '70%', '50%'],
  ['sphere-pink', 46, 1.2, '86%', '20%'],
  ['capsule-rose', 64, 0.8, '18%', '70%'],
];

function ClayDemo() {
  const band = useRef<HTMLDivElement>(null);

  useClayField(band);

  return (
    <div ref={band} className={styles.clayField}>
      {FIELD.map(([shape, size, depth, left, top]) => (
        <Blob key={shape} shape={shape} size={size} depth={depth} style={{ position: 'absolute', left, top }} />
      ))}
      <span className={styles.clayHint}>Move close to shy them away · click to boop</span>
    </div>
  );
}

function ShineDemo() {
  const row = useRef<HTMLDivElement>(null);
  const shine = () =>
    gsap.fromTo(
      row.current!.children,
      { scale: 0, '--shine': '-100%' },
      {
        keyframes: [
          { scale: 1, duration: 0.45, ease: 'back.out(2.5)' },
          { '--shine': '200%', duration: 0.8, ease: 'power2.inOut' },
        ],
        stagger: 0.08,
      },
    );

  return (
    <div className={styles.shine}>
      <div ref={row} className={styles.row}>
        {['+ Z axis', '+ glTF', '+ PBR', '+ 3D picking'].map((text) => (
          <Badge key={text}>{text}</Badge>
        ))}
      </div>
      <Button variant="small" icon="sparkles" onClick={shine}>
        Pop and shine
      </Button>
    </div>
  );
}

function PauseDemo() {
  const [paused] = usePauseMotion();

  return (
    <div className={styles.pause}>
      <PauseMotionButton />
      <p className={styles.demoText}>
        {paused ? 'Paused: loops and scrubs stop, entrances finish at once.' : 'Running.'}
      </p>
      <p className={styles.readout}>localStorage[&apos;pixi:motion&apos;]</p>
    </div>
  );
}

export default function MotionLab() {
  return (
    <div className={styles.lab}>
      <Demo
        hook="useReveal"
        spec="M4"
        description="One ScrollTrigger.batch over [data-reveal]: up, scale, left and right variants. Anything already on screen is left alone."
      >
        {(run) => <RevealDemo key={run} replayed={run > 0} />}
      </Demo>
      <Demo
        hook="useSplitTitle"
        spec="M3 · M5"
        description="SplitText title in line masks, scrambled eyebrow, drawn squiggle."
      >
        {(run) => <SplitTitleDemo key={run} replayed={run > 0} />}
      </Demo>
      <Demo
        hook="useHeadlineWave"
        spec="M1 · M2"
        description="A wave that starts and ends at rest, so the text is never hidden. Accent words pop as it passes."
      >
        {(run) => <WaveDemo key={run} />}
      </Demo>
      <Demo
        hook="useMagnetic"
        spec="M8"
        description="Buttons lean toward a fine pointer, clamped to 10 px, and spring home."
        replay={false}
      >
        {() => <MagneticDemo />}
      </Demo>
      <Demo
        hook="Badge shine"
        spec="§8.4.6"
        description="Badges pop, then one shine sweep through the --shine variable."
        replay={false}
      >
        {() => <ShineDemo />}
      </Demo>
      <Demo
        hook="usePauseMotion"
        spec="§7.3 rule 9"
        replay={false}
        description="The global Pause motion control (WCAG 2.2.2), shared by CSS, GSAP and the WebGL tickers."
      >
        {() => <PauseDemo />}
      </Demo>
      <Demo
        hook="useMarquee"
        spec="M7"
        wide
        replay={false}
        description="An endless loop that scroll velocity speeds up or reverses. Hover or focus slows it to a stop; reduced motion shows a static row."
      >
        {() => <MarqueeDemo />}
      </Demo>
      <Demo
        hook="useClayField"
        spec="M12"
        wide
        description="Entrance, scroll parallax by data-depth, an idle bob while on screen, a shy push from the pointer and a boop that changes tint."
      >
        {(run) => <ClayDemo key={run} />}
      </Demo>
    </div>
  );
}
