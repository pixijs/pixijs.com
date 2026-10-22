import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import Button from '@site/src/components/ui/Button';
import Icon, { ICON_NAMES } from '@site/src/components/ui/Icon';
import { EASE, gsap } from '@site/src/motion/gsap';
import { contrast, cssColor, formatColor, parseColor, resolveColors } from './color';
import { CONTRAST, FEATURE_ICONS, SWATCHES, TYPE_SCALE } from './data';
import { Block } from './Frame';
import styles from './classes';

import type { CSSProperties } from 'react';

/** Light and dark scopes for resolving tokens in both themes at once */
function useThemeScopes() {
  const light = useRef<HTMLSpanElement>(null);
  const dark = useRef<HTMLSpanElement>(null);
  const scopes = (
    <>
      <span ref={light} className="px-on-light" hidden />
      <span ref={dark} className="px-on-dark" hidden />
    </>
  );

  return { light, dark, scopes };
}

export function Colour() {
  const { light, dark, scopes } = useThemeScopes();
  const [values, setValues] = useState<Record<string, [string, string]>>({});

  useEffect(() => {
    const tokens = SWATCHES.flatMap((group) => group.tokens);
    const read = (scope: Element) =>
      resolveColors(scope, tokens.map(cssColor)).map((value) => formatColor(parseColor(value)));
    const [lights, darks] = [read(light.current!), read(dark.current!)];

    setValues(Object.fromEntries(tokens.map((token, i) => [token, [lights[i], darks[i]]])));
  }, [light, dark]);

  return (
    <>
      {scopes}
      {SWATCHES.map((group) => (
        <Block key={group.title} title={group.title} note={group.note}>
          <ul className={styles.swatches}>
            {group.tokens.map((token) => {
              const [lightValue, darkValue] = values[token] ?? [];
              const paint = { background: cssColor(token) };

              return (
                <li key={token} className={styles.swatch}>
                  <span className={styles.swatchChip}>
                    {group.fixed ? (
                      <span style={paint} />
                    ) : (
                      <>
                        <span className="px-on-light" style={paint} />
                        <span className="px-on-dark" style={paint} />
                      </>
                    )}
                  </span>
                  <span className={styles.swatchName}>--px-{token}</span>
                  <span className={styles.swatchValue}>
                    {group.fixed ? lightValue : lightValue && `${lightValue} · ${darkValue}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </Block>
      ))}
    </>
  );
}

const levelOf = (ratio: number, large?: boolean) => {
  if (ratio >= (large ? 3 : 4.5)) return large ? 'AA large' : ratio >= 7 ? 'AAA' : 'AA';

  return 'fails';
};

export function Contrast() {
  const { light, dark, scopes } = useThemeScopes();
  const [ratios, setRatios] = useState<number[][]>([]);

  useEffect(() => {
    const read = (scope: Element) => {
      const fgs = resolveColors(
        scope,
        CONTRAST.map((pair) => cssColor(pair.fg)),
      ).map(parseColor);
      const bgs = resolveColors(
        scope,
        CONTRAST.map((pair) => cssColor(pair.bg)),
      ).map(parseColor);

      return fgs.map((fg, i) => contrast(fg, bgs[i]));
    };

    setRatios([read(light.current!), read(dark.current!)]);
  }, [light, dark]);

  return (
    <Block
      title="Measured live"
      note="Each pair is read from the CSS in both themes. Text pairs need 4.5:1, display accents and the focus ring 3:1."
    >
      {scopes}
      <div className={styles.contrast} role="table" aria-label="Contrast pairs">
        <div className={styles.contrastRow} role="row">
          <span role="columnheader">Pair</span>
          <span role="columnheader">Light</span>
          <span role="columnheader">Dark</span>
        </div>
        {CONTRAST.map((pair, i) => (
          <div key={pair.label} className={styles.contrastRow} role="row">
            <span role="rowheader" className={styles.contrastLabel}>
              {pair.label}
            </span>
            {(['px-on-light', 'px-on-dark'] as const).map((scope, s) => {
              const ratio = ratios[s]?.[i];

              return (
                <span key={scope} role="cell" className={styles.contrastCell}>
                  <span
                    className={clsx(scope, styles.contrastSample)}
                    style={{ background: cssColor(pair.bg), color: cssColor(pair.fg) }}
                  >
                    Aa
                  </span>
                  <span className={styles.contrastRatio}>
                    {ratio ? ratio.toFixed(2) : '–'}
                    <span data-level={ratio ? levelOf(ratio, pair.large) : undefined}>
                      {ratio ? levelOf(ratio, pair.large) : ''}
                    </span>
                  </span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </Block>
  );
}

export function TypeScale() {
  const list = useRef<HTMLOListElement>(null);
  const [sizes, setSizes] = useState<string[]>([]);

  useEffect(() => {
    const el = list.current!;
    const measure = () =>
      setSizes(
        Array.from(el.querySelectorAll<HTMLElement>('[data-specimen]'), (node) => {
          const size = parseFloat(getComputedStyle(node).fontSize);

          return `${+size.toFixed(1)}px`;
        }),
      );
    const observer = new ResizeObserver(measure);

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Block title="Families" note="Self-hosted variable WOFF2 subsets with metric-matched fallbacks; no Google Fonts.">
        <div className={styles.families}>
          {[
            ['Outfit', 'display', 'Display · headings, nav, buttons, rail', '500 600 700', '32 KB latin'],
            ['Roboto', 'body', 'Body · prose and UI copy', '400 500 700', '43 KB latin'],
            ['Roboto Mono', 'mono', 'Mono · code, eyebrows, badges, tags', '400 500 700', '33 KB latin'],
          ].map(([family, key, role, weights, size]) => (
            <div key={family} className={styles.family} style={{ fontFamily: `var(--px-font-${key})` }}>
              <span className={styles.familyGlyph}>Aa</span>
              <span className={styles.familyName}>{family}</span>
              <span className={styles.familyRole}>{role}</span>
              <span className={styles.familyWeights}>
                {weights.split(' ').map((weight) => (
                  <span key={weight} style={{ fontWeight: Number(weight) }}>
                    {weight}
                  </span>
                ))}
              </span>
              <span className={styles.familyMeta}>{size}</span>
            </div>
          ))}
        </div>
      </Block>
      <Block
        title="Scale"
        note="Fluid steps interpolate between 360 and 1280 px of content width; the live size is measured here."
      >
        <ol ref={list} className={styles.typeScale}>
          {TYPE_SCALE.map((step, i) => (
            <li key={step.name} className={styles.typeRow}>
              <div className={styles.typeMeta}>
                <span className={styles.typeName}>{step.name}</span>
                {step.token && <span className={styles.typeToken}>{step.token}</span>}
                <span className={styles.typeSpec}>
                  {step.range} px · {step.spec}
                </span>
                <span className={styles.typeLive}>{sizes[i] ?? ''}</span>
              </div>
              <p className={clsx(styles.specimen, styles[step.className])} data-specimen="">
                {step.sample}
              </p>
            </li>
          ))}
          <li className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <span className={styles.typeName}>Code</span>
              <span className={styles.typeSpec}>14 px (13.5 docs) · Roboto Mono 400 / 1.75</span>
            </div>
            <pre className={styles.codeSample} tabIndex={0}>
              <code>
                <span style={{ color: 'var(--px-code-kw)' }}>import</span> {'{ '}
                <span style={{ color: 'var(--px-code-fn)' }}>Application</span>, Sprite {'}'}{' '}
                <span style={{ color: 'var(--px-code-kw)' }}>from</span>{' '}
                <span style={{ color: 'var(--px-code-str)' }}>&apos;pixi.js&apos;</span>;{'\n'}
                <span style={{ color: 'var(--px-code-com)', fontStyle: 'italic' }}>{'// one stage, one ticker'}</span>
                {'\n'}
                <span style={{ color: 'var(--px-code-kw)' }}>await</span> app.
                <span style={{ color: 'var(--px-code-fn)' }}>init</span>({'{ '}width:{' '}
                <span style={{ color: 'var(--px-code-num)' }}>800</span>, antialias:{' '}
                <span style={{ color: 'var(--px-code-num)' }}>true</span> {'}'});
              </code>
            </pre>
          </li>
          <li className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <span className={styles.typeName}>Inline code</span>
              <span className={styles.typeSpec}>0.88em · Roboto Mono 500, ink on field, never pink</span>
            </div>
            <p className={clsx(styles.specimen, styles.bodyDocs)}>
              Add children with <code>container.addChild(sprite)</code> and move them with <code>sprite.position</code>.
            </p>
          </li>
        </ol>
      </Block>
    </>
  );
}

const SPACE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const RADII = ['xs', 'sm', 'md', 'lg', 'xl', 'pill'];
const LAYOUT = ['rail-w', 'rail-compact', 'topbar-h', 'toc-w', 'gutter', 'container', 'prose', 'section-y'];
const Z = ['clay', 'content', 'sticky', 'topbar', 'rail', 'scrim', 'drawer', 'modal', 'toast', 'skip'];
const BREAKPOINTS: Array<[string, number]> = [
  ['sm', 480],
  ['md', 768],
  ['lg', 997],
  ['xl', 1280],
  ['xxl', 1440],
];

export function SpaceAndShape() {
  const probes = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<string[]>([]);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      setWidth(window.innerWidth);
      setLayout(
        Array.from(probes.current!.children, (probe) => `${Math.round(probe.getBoundingClientRect().width)}px`),
      );
    };

    measure();
    window.addEventListener('resize', measure);

    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <>
      <Block title="Spacing" note="A 4 px grid, --px-s-1 to --px-s-10.">
        <ul className={styles.space}>
          {SPACE.map((step) => (
            <li key={step}>
              <span className={styles.spaceName}>s-{step}</span>
              <span className={styles.spaceBar} style={{ width: `var(--px-s-${step})` }} />
            </li>
          ))}
        </ul>
      </Block>
      <Block title="Radius" note="Nested corners subtract the inset: a 22 px card holds 14 px media at 8 px.">
        <ul className={styles.radii}>
          {RADII.map((radius) => (
            <li key={radius}>
              <span className={styles.radiusTile} style={{ borderRadius: `var(--px-r-${radius})` }} />
              <span className={styles.spaceName}>r-{radius}</span>
            </li>
          ))}
        </ul>
      </Block>
      <Block title="Elevation" note="Soft violet shadows in light, deep black in dark; the glow belongs to pink fills.">
        <ul className={styles.elevation}>
          {['sm', 'md', 'lg'].map((level) => (
            <li key={level} style={{ boxShadow: `var(--px-shadow-${level})` }}>
              shadow-{level}
            </li>
          ))}
          <li className={styles.glow}>glow</li>
        </ul>
      </Block>
      <Block title="Layout" note="Measured at this width; the fluid ones follow the content column (cqi).">
        <div ref={probes} className={styles.layoutProbes} aria-hidden="true">
          {LAYOUT.map((token) => (
            <span key={token} style={{ width: `var(--px-${token})` }} />
          ))}
        </div>
        <dl className={styles.layoutList}>
          {LAYOUT.map((token, i) => (
            <div key={token}>
              <dt>--px-{token}</dt>
              <dd>{layout[i] ?? ''}</dd>
            </div>
          ))}
        </dl>
      </Block>
      <Block title="Breakpoints" note="Drawer below 997, docked rail from there, TOC column from 1280.">
        <div className={styles.ruler}>
          {BREAKPOINTS.map(([name, px]) => (
            <span key={name} className={styles.rulerMark} style={{ left: `${(px / 1920) * 100}%` }}>
              <b>{name}</b>
              {px}
            </span>
          ))}
          {width > 0 && (
            <span className={styles.rulerNow} style={{ left: `${Math.min(width / 1920, 1) * 100}%` }}>
              {width}px
            </span>
          )}
        </div>
      </Block>
      <Block title="Layers" note="z-index tokens, from clay under the copy to the skip link.">
        <ol className={styles.layers}>
          {Z.map((layer, i) => (
            <li key={layer} style={{ '--i': i } as CSSProperties}>
              <span>{layer}</span>
              <span className={styles.layerValue}>{[0, 1, 10, 30, 40, 50, 60, 70, 80, 100][i]}</span>
            </li>
          ))}
        </ol>
      </Block>
    </>
  );
}

const CSS_EASES: Array<[string, string, [number, number, number, number]]> = [
  ['--px-ease', 'Reveals, slides', [0.215, 0.61, 0.355, 1]],
  ['--px-ease-spring', 'Chips, thumbs, pops', [0.34, 1.56, 0.64, 1]],
  ['--px-ease-in-out', 'Underlines, morphs', [0.65, 0, 0.35, 1]],
];

export function MotionTokens() {
  const tracks = useRef<HTMLUListElement>(null);
  const play = () => {
    const dots = tracks.current!.querySelectorAll<HTMLElement>('[data-dot]');

    dots.forEach((dot) => {
      const distance = (dot.parentElement?.clientWidth ?? 0) - dot.offsetWidth;

      gsap.fromTo(dot, { x: 0 }, { x: distance, duration: 1.2, ease: dot.dataset.dot, overwrite: true });
    });
  };

  return (
    <>
      <Block
        title="CSS eases"
        note="Hover, press, disclosures, thumbs and drawers use CSS transitions only. Hover a curve."
      >
        <ul className={styles.eases}>
          {CSS_EASES.map(([token, use, [x1, y1, x2, y2]]) => (
            <li key={token} className={styles.ease} style={{ '--curve': `var(${token})` } as CSSProperties}>
              <svg viewBox="-4 -24 108 128" aria-hidden="true">
                <path className={styles.easeAxis} d="M0 100H100M0 100V0" />
                <path
                  className={styles.easeCurve}
                  d={`M0 100C${x1 * 100} ${100 - y1 * 100} ${x2 * 100} ${100 - y2 * 100} 100 0`}
                />
              </svg>
              <span className={styles.easeTrack}>
                <span className={styles.easeDot} />
              </span>
              <span className={styles.spaceName}>{token}</span>
              <span className={styles.easeUse}>{use}</span>
            </li>
          ))}
        </ul>
        <ul className={styles.durations}>
          {[150, 250, 400, 700].map((ms, i) => (
            <li key={ms} style={{ '--d': `var(--px-dur-${i + 1})` } as CSSProperties}>
              <span className={styles.spaceName}>dur-{i + 1}</span>
              <span className={styles.durationBar} />
              <span className={styles.easeUse}>{ms} ms</span>
            </li>
          ))}
        </ul>
      </Block>
      <Block
        title="GSAP eases"
        note="Scroll reveals, split titles, clay and the marquee: marketing pages only, never in main.js."
      >
        <ul ref={tracks} className={styles.gsapEases}>
          {Object.entries(EASE).map(([name, ease]) => (
            <li key={name}>
              <span className={styles.spaceName}>{name}</span>
              <span className={styles.gsapTrack}>
                <span className={styles.gsapDot} data-dot={ease} />
              </span>
              <span className={styles.easeUse}>{ease}</span>
            </li>
          ))}
        </ul>
        <div className={styles.blockActions}>
          <Button variant="small" icon="play" onClick={play}>
            Play eases
          </Button>
          <span className={styles.easeUse}>
            Durations xs .2 · sm .35 · md .6 · lg .9 s · staggers chars .025, words .06
          </span>
        </div>
      </Block>
    </>
  );
}

export function Icons() {
  return (
    <>
      <Block title="Sprite" note="Paths from lucide 0.577, stroke 1.75, currentColor. No new lucide-react imports.">
        <ul className={styles.icons}>
          {ICON_NAMES.map((name) => (
            <li key={name}>
              <Icon name={name} size={20} />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </Block>
      <Block
        title="Features and sizes"
        note="One glyph per homepage feature at 28 px, stroke 1.5; the sprite's sizes are 16, 18, 20 and 28."
      >
        <ul className={styles.features}>
          {FEATURE_ICONS.map(([name, label]) => (
            <li key={name}>
              <Icon name={name} size={28} strokeWidth={1.5} />
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <div className={styles.iconSizes}>
          {[16, 18, 20, 28].map((size) => (
            <span key={size}>
              <Icon name="sparkles" size={size} />
              {size}
            </span>
          ))}
        </div>
      </Block>
    </>
  );
}
