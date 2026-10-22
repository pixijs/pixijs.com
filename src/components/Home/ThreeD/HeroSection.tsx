import { useEffect, useRef, useState } from 'react';
import Chip from '@site/src/components/ui/Chip';
import Icon from '@site/src/components/ui/Icon';
import { Squiggle } from '@site/src/components/ui/SectionHead';
import { HERO } from '../content/threeD';
import Hero, { Logo3D } from '../Hero';
import MagneticButton from '../MagneticButton';
import styles from './styles';

import type { BandSurface } from '../Band';
import type { HeroFieldHandle } from '../Hero';

const GUIDES = '/3d/guides/getting-started/intro';

function CopyInstall() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 1600);

    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      className={styles.copy}
      aria-label={copied ? 'Copied' : 'Copy the install command'}
      onClick={() => void navigator.clipboard?.writeText(HERO.install).then(() => setCopied(true))}
    >
      <Icon name={copied ? 'check' : 'copy'} size={14} strokeWidth={2} />
    </button>
  );
}

/**
 * The `/3d` hero (section 8.6): the clay field at full depth. Hovering or tapping "3D" sends a ring of light out from
 * the word that puffs each shape up and shoves it outward as it passes.
 */
export default function HeroSection({ next }: { next: BandSurface }) {
  const field = useRef<HeroFieldHandle>(null);

  return (
    <Hero
      field={field}
      mirror
      next={next}
      logo={<Logo3D />}
      title={
        <>
          Build{' '}
          <span
            data-accent-group=""
            data-dimension="3d"
            role="presentation"
            onPointerEnter={(event) => field.current?.pump(event.currentTarget)}
          >
            <span data-accent="" data-extrude="">
              3D
            </span>
            <Squiggle stretch />
          </span>{' '}
          scenes with the API you already know
        </>
      }
      actions={
        <>
          <MagneticButton to={GUIDES} arrow>
            Getting started
          </MagneticButton>
          <MagneticButton to="/3d/examples" variant="outline" glass>
            Examples
          </MagneticButton>
        </>
      }
      chips={
        <Chip className={styles.install}>
          <code>{HERO.install}</code>
          <CopyInstall />
        </Chip>
      }
    />
  );
}
