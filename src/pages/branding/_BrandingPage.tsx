import useBrokenLinks from '@docusaurus/useBrokenLinks';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Accent, Band, Closing } from '@site/src/components/Page';
import MotionPage, { ClayHeader } from '@site/src/components/Page/MotionPage';
import MagneticButton from '@site/src/components/Home/MagneticButton';
import Icon from '@site/src/components/ui/Icon';
import SectionHead from '@site/src/components/ui/SectionHead';
import { DISCORD } from '@site/src/data/navigation';
import { motionAllowed } from '@site/src/motion/pause';
import { EASE, gsap } from '@site/src/motion/gsap';
import { useMotion } from '@site/src/motion/useMotion';
import styles from './Branding.module.scss';

import type { IconName } from '@site/src/components/ui/Icon';
import type { CSSProperties, MouseEvent } from 'react';

const FILES = 'https://files.pixijs.download/branding';
const DOWNLOAD_ICONS = { idle: 'download', busy: 'loader-circle', done: 'check' } satisfies Record<string, IconName>;

type DownloadState = keyof typeof DOWNLOAD_ICONS;

interface Asset {
  name: string;
  file: string;
  formats: string[];
  width: number;
  height: number;
  /**
   * What the preview sits on: a checkerboard or brand pink for the transparent logos, the full width for the banner,
   * the image's own background, cropped to the frame, or a square tile standing off the frame
   */
  surface?: 'checker' | 'pink' | 'banner' | 'cover' | 'tile';
}

const BANNER: Asset = {
  name: 'Banner',
  file: 'pixijs-banner',
  formats: ['png'],
  width: 898,
  height: 227,
  surface: 'banner',
};

/** The transparent logos, then the ones on their own ground */
const LOGOS: Asset[] = [
  {
    name: 'Logo, pink',
    file: 'pixijs-logo-transparent-dark',
    formats: ['svg', 'png'],
    width: 735,
    height: 289,
    surface: 'checker',
  },
  {
    name: 'Logo, white',
    file: 'pixijs-logo-transparent-light',
    formats: ['svg', 'png'],
    width: 735,
    height: 289,
    surface: 'pink',
  },
  {
    name: 'Logo on dark',
    file: 'pixijs-logo-full-dark',
    formats: ['svg', 'png'],
    width: 512,
    height: 512,
    surface: 'cover',
  },
  {
    name: 'Logo on pink',
    file: 'pixijs-logo-full-light',
    formats: ['svg', 'png'],
    width: 512,
    height: 512,
    surface: 'cover',
  },
];

const MARKS: Asset[] = [
  {
    name: 'Mark on pink',
    file: 'pixijs-logo-mark-dark',
    formats: ['svg', 'png'],
    width: 380,
    height: 380,
    surface: 'tile',
  },
  {
    name: 'Mark on white',
    file: 'pixijs-logo-mark-light',
    formats: ['svg', 'png'],
    width: 380,
    height: 380,
    surface: 'tile',
  },
];

/** The colours the logo files are drawn in */
const COLOURS = [
  { name: 'PixiJS pink', hex: '#E72264', rgb: '231, 34, 100', use: 'The logo, and the background of the mark' },
  { name: 'Night', hex: '#181A21', rgb: '24, 26, 33', use: 'The background of the logo on dark' },
  { name: 'White', hex: '#FFFFFF', rgb: '255, 255, 255', use: 'The P, and the logo on pink' },
];

/** `true` for a moment after `copy` succeeds */
function useCopy(text: string): [boolean, () => void] {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1600);

    return () => clearTimeout(timer);
  }, [copied]);

  return [copied, () => void navigator.clipboard.writeText(text).then(() => setCopied(true))];
}

/** Springs an icon in when it changes to show a new state */
function usePop(key: unknown) {
  const ref = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;

      return;
    }
    if (ref.current && motionAllowed()) {
      gsap.fromTo(ref.current, { scale: 0.4, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.5, ease: EASE.pop });
    }
  }, [key]);

  return ref;
}

/**
 * The asset host sends CORS headers, so the file comes down as a blob and saves under its own name; a plain link
 * to another origin would only open it. The button spins while it fetches and ticks when it's done. If the fetch
 * fails, the file opens in a new tab instead.
 */
function DownloadButton({ asset, format }: { asset: Asset; format: string }) {
  const [state, setState] = useState<DownloadState>('idle');
  const icon = usePop(state === 'done');
  const href = `${FILES}/${asset.file}.${format}`;

  useEffect(() => {
    if (state !== 'done') return undefined;
    const timer = setTimeout(() => setState('idle'), 1800);

    return () => clearTimeout(timer);
  }, [state]);

  const download = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (state === 'busy') return;
    setState('busy');
    try {
      const response = await fetch(href);

      if (!response.ok) throw new Error(`${response.status}`);
      const url = URL.createObjectURL(await response.blob());

      Object.assign(document.createElement('a'), { href: url, download: `${asset.file}.${format}` }).click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setState('done');
    } catch {
      setState('idle');
      window.open(href, '_blank', 'noopener');
    }
  };

  return (
    <a
      href={href}
      className={styles.download}
      data-state={state}
      download
      aria-label={state === 'done' ? `Downloaded ${asset.name} as ${format}` : `Download ${asset.name} as ${format}`}
      aria-busy={state === 'busy'}
      onClick={(event) => void download(event)}
    >
      <span ref={icon} className={styles.downloadIcon}>
        <Icon name={DOWNLOAD_ICONS[state]} size={14} strokeWidth={2.25} />
      </span>
      {format}
    </a>
  );
}

function AssetCard({ asset }: { asset: Asset }) {
  return (
    <li className={styles.asset} data-reveal="">
      <div className={clsx(styles.preview, asset.surface && styles[asset.surface])}>
        <img src={`${FILES}/${asset.file}.png`} alt="" width={asset.width} height={asset.height} loading="lazy" />
      </div>
      <div className={styles.info}>
        <h3>{asset.name}</h3>
        <div className={styles.downloads}>
          {asset.formats.map((format) => (
            <DownloadButton key={format} asset={asset} format={format} />
          ))}
        </div>
      </div>
    </li>
  );
}

function CopyValue({ label, value }: { label: string; value: string }) {
  const [copied, copy] = useCopy(value);
  const icon = usePop(copied);

  return (
    <button
      type="button"
      className={styles.value}
      data-copied={copied || undefined}
      aria-label={copied ? `Copied ${value}` : `Copy ${label} ${value}`}
      onClick={copy}
    >
      <span className={styles.valueKey}>{label}</span>
      <span className={styles.valueText}>{value}</span>
      <span ref={icon} className={styles.valueIcon}>
        <Icon name={copied ? 'check' : 'copy'} size={14} strokeWidth={2} />
      </span>
    </button>
  );
}

/** The swatches wipe up into their cards as the row scrolls into view */
function Swatches() {
  const root = useRef<HTMLUListElement>(null);

  useMotion(root, (list, { paused }) => {
    if (paused) return;
    gsap.from(gsap.utils.toArray(`.${styles.chip}`, list), {
      clipPath: 'inset(100% 0% 0% 0% round 14px)',
      duration: 0.9,
      ease: EASE.inOut,
      stagger: 0.12,
      clearProps: 'clipPath',
      scrollTrigger: { trigger: list, start: 'top 85%', once: true },
    });
  });

  return (
    <ul ref={root} className={styles.swatches}>
      {COLOURS.map(({ name, hex, rgb, use }) => (
        <li key={hex} className={styles.swatch} style={{ '--swatch': hex } as CSSProperties}>
          <div className={styles.chip}>
            <span>{name}</span>
          </div>
          <p>{use}</p>
          <div className={styles.values}>
            <CopyValue label="HEX" value={hex} />
            <CopyValue label="RGB" value={rgb} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * The mark as a pink tile with depth, the page's own hero art. It drops in with CSS, so it moves from the first paint,
 * then GSAP floats it and turns it to face a pointer.
 */
function MarkTile() {
  const tile = useRef<HTMLSpanElement>(null);

  useMotion(tile, (el, { fine, safe }) => {
    gsap.to(el, { y: -7, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.2 });
    if (!fine) return undefined;
    const face = safe(() => gsap.to(el, { rotation: 8, scale: 1.08, duration: 0.6, ease: EASE.spring }));
    const rest = safe(() => gsap.to(el, { rotation: 0, scale: 1, duration: 0.8, ease: EASE.elastic }));

    el.addEventListener('pointerenter', face);
    el.addEventListener('pointerleave', rest);

    return () => {
      el.removeEventListener('pointerenter', face);
      el.removeEventListener('pointerleave', rest);
    };
  });

  return (
    <span ref={tile} className={styles.markTile}>
      <svg viewBox="0 0 198 265" focusable="false" aria-hidden="true">
        <path d="M98.56 0.23C44.16 0.23 0.07 44.33 0.07 98.72L0.14 231.5C0.67 249.78 15.65 264.44 34.06 264.44C52.47 264.44 67.59 249.78 68.12 231.5V196.57H98.55C152.95 196.57 197.05 153.11 197.05 98.71C197.05 44.31 152.95 0.22 98.56 0.22ZM68.14 128.58V98.72C68.14 81.98 81.82 68.41 98.56 68.41C115.3 68.41 128.87 81.98 128.87 98.72C128.87 115.46 115.3 128.58 98.56 128.58L68.12 128.6Z" />
        <path
          opacity="0.15"
          fill="#1d1d1b"
          d="M33.24 196.58H68.1V231.51H67.94C67.41 249.79 52.44 264.45 34.04 264.45C15.64 264.45 0.66 249.79 0.13 231.51H0.12V227.52C1.16 211.17 16.6 196.59 33.23 196.59Z"
        />
      </svg>
    </span>
  );
}

export default function BrandingPage() {
  const anchors = useBrokenLinks();

  anchors.collectAnchor('logo');
  anchors.collectAnchor('colours');

  return (
    <MotionPage>
      <ClayHeader
        className={styles.header}
        art={<MarkTile />}
        eyebrow="Branding"
        title={
          <>
            Brand <Accent>assets</Accent>
          </>
        }
        lede={
          <>
            Logos, marks and colours for your site, game or app. They&apos;re all free to use. Questions or requests?{' '}
            <a href="https://github.com/pixijs/pixijs.com/issues/new" target="_blank" rel="noopener noreferrer">
              File an issue
            </a>
            .
          </>
        }
        actions={
          <>
            <MagneticButton to="#logo" arrow>
              Get the logo
            </MagneticButton>
            <MagneticButton to="#colours" variant="outline" glass>
              Brand colours
            </MagneticButton>
          </>
        }
        next="bg"
        clay={['sphere-pink', 'cube-violet']}
      />
      <Band glow labelledBy="logo">
        <SectionHead
          id="logo"
          className={styles.target}
          eyebrow="Logo"
          title="The full logo"
          lede="Use the logo where your audience might not know PixiJS yet."
        />
        <ul className={styles.assets}>
          {LOGOS.map((asset) => (
            <AssetCard key={asset.file} asset={asset} />
          ))}
        </ul>
      </Band>

      <Band surface="bg-alt" edge="a" labelledBy="mark">
        <SectionHead
          id="mark"
          eyebrow="Mark"
          title="The mark on its own"
          lede="Use the mark where your audience already knows the ecosystem, such as Discord, plugin pages or social media."
        />
        <ul className={clsx(styles.assets, styles.pair)}>
          {MARKS.map((asset) => (
            <AssetCard key={asset.file} asset={asset} />
          ))}
        </ul>
      </Band>

      <Band edge="c" flip labelledBy="colours">
        <SectionHead
          id="colours"
          className={styles.target}
          eyebrow="Colours"
          title="Three colours"
          lede="Every logo file is drawn in these. Click a value to copy it."
        />
        <Swatches />
      </Band>

      <Band surface="bg-alt" edge="b" labelledBy="banner">
        <SectionHead
          id="banner"
          eyebrow="Banner"
          title="The README banner"
          lede="The banner from the top of our README."
        />
        <ul className={clsx(styles.assets, styles.single)}>
          <AssetCard asset={BANNER} />
        </ul>
        <Closing
          corners={{ tr: 'cube-pink', bl: 'sphere-violet' }}
          title="Need another format?"
          lede="Ask for the file you need and we'll add it. The PixiJS community on Discord can help with the rest."
          actions={
            <>
              <MagneticButton to="https://github.com/pixijs/pixijs.com/issues/new" icon="github" arrow>
                File an issue
              </MagneticButton>
              <MagneticButton to={DISCORD} icon="discord" variant="outline">
                Join Discord
              </MagneticButton>
            </>
          }
        />
      </Band>
    </MotionPage>
  );
}
