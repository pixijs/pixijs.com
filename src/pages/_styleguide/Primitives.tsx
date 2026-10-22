import { useColorMode } from '@docusaurus/theme-common';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useRef, useState } from 'react';
import Badge from '@site/src/components/ui/Badge';
import Button, { ButtonRow } from '@site/src/components/ui/Button';
import Card from '@site/src/components/ui/Card';
import Chip from '@site/src/components/ui/Chip';
import SectionHead from '@site/src/components/ui/SectionHead';
import SegmentedControl from '@site/src/components/ui/SegmentedControl';
import Tag from '@site/src/components/ui/Tag';
import WaveDivider from '@site/src/components/ui/WaveDivider';
import { useSplitTitle } from '@site/src/motion/useSplitTitle';
import Blob from './Blob';
import { PACKAGES } from './data';
import { Block, State } from './Frame';
import styles from './classes';

import type { ButtonVariant } from '@site/src/components/ui/Button';
import type { IconName } from '@site/src/components/ui/Icon';
import type { WaveVariant } from '@site/src/components/ui/WaveDivider';

const BUTTONS: Array<{ variant: ButtonVariant; note: string; label?: string; icon?: IconName; arrow?: boolean }> = [
  { variant: 'primary', note: 'pink-fill, 5 px offset shadow, deep sweep', label: 'Getting started', arrow: true },
  { variant: 'outline', note: 'ink ring, ink sweep, text flips to bg', label: 'Tutorials' },
  { variant: 'outline-pink', note: 'pink ring and sweep', label: 'Get started' },
  { variant: 'small', note: '36 px on field, no shadow', label: 'Open in playground', icon: 'play' },
  { variant: 'github', note: '40 px, glow, glyph tilts', label: 'GitHub', icon: 'github' },
  { variant: 'icon', note: '40 px circle, 44 on touch', icon: 'search' },
];

const STATES = [
  ['Rest', undefined],
  ['Hover', 'hover'],
  ['Pressed', 'active'],
  ['Focus', 'focus'],
] as const;

export function Buttons() {
  return (
    <>
      <Block
        title="Variants and states"
        note="Hover and press transforms sit on the inner body, so magnetic pull on the outer element never fights them."
      >
        <div className={styles.matrix}>
          {BUTTONS.map(({ variant, note, label, icon, arrow }) => (
            <div key={variant} className={styles.matrixRow}>
              <div className={styles.matrixHead}>
                <span className={styles.spaceName}>{variant}</span>
                <span className={styles.easeUse}>{note}</span>
              </div>
              <div className={styles.matrixStates}>
                {STATES.map(([name, state]) => (
                  <State key={name} label={name}>
                    <Button
                      variant={variant}
                      icon={icon}
                      arrow={arrow}
                      aria-label={label ? undefined : 'Search'}
                      data-state={state}
                    >
                      {label}
                    </Button>
                  </State>
                ))}
                <State label="Disabled">
                  <Button
                    variant={variant}
                    icon={icon}
                    arrow={arrow}
                    aria-label={label ? undefined : 'Search'}
                    disabled
                  >
                    {label}
                  </Button>
                </State>
              </div>
            </div>
          ))}
        </div>
      </Block>
      <Block
        title="Over the hero"
        note="Outline buttons get a frosted backing over the hero only; CTA rows stack full width below 480 px."
      >
        <div className={styles.heroPanel}>
          <Blob
            shape="torus-pink"
            size={84}
            className={styles.hideSm}
            style={{ position: 'absolute', left: '8%', top: '18%' }}
          />
          <Blob
            shape="sphere-violet"
            size={64}
            className={styles.hideSm}
            style={{ position: 'absolute', right: '10%', bottom: '14%' }}
          />
          <Blob
            shape="cube-violet"
            size={56}
            className={styles.hideSm}
            style={{ position: 'absolute', right: '22%', top: '12%' }}
          />
          <ButtonRow>
            <Button to="#buttons" arrow>
              Getting started
            </Button>
            <Button to="#buttons" variant="outline" glass>
              Tutorials
            </Button>
          </ButtonRow>
        </div>
      </Block>
    </>
  );
}

export function Labels() {
  return (
    <>
      <Block title="Badges" note="18 px, mono 700, pink-fill with white text.">
        <div className={styles.row}>
          {['New', '+ Z axis', '+ glTF', '+ PBR', '+ 3D picking'].map((text) => (
            <Badge key={text}>{text}</Badge>
          ))}
        </div>
      </Block>
      <Block
        title="Announcement chips"
        note="Glass pill with a badge, the ›_ prompt and an arrow that nudges on hover."
      >
        <div className={styles.row}>
          <State label="Rest">
            <Chip to="#labels" badge="New">
              PixiJS 3D is in preview
            </Chip>
          </State>
          <State label="Hover">
            <Chip to="#labels" badge="New" data-state="hover">
              Skills for AI coding agents
            </Chip>
          </State>
          <State label="Static">
            <Chip>npm install @pixi/3d</Chip>
          </State>
        </div>
      </Block>
      <Block
        title="Tags"
        note="Mono labels for HUDs, code-card headers and filters; the accent tag tints with the page accent."
      >
        <div className={styles.row}>
          <span data-package="3d">
            <Tag dot>HUD layer · Bitmap text</Tag>
          </span>
          <Tag tone="accent">Mesh3D + Sprite · one stage</Tag>
          <Tag pill>One stage · one ticker</Tag>
          <Tag>pixi.js + @pixi/3d</Tag>
        </div>
      </Block>
      <Block title="Package chips" note="The dot and tint come from --px-pkg-*; the label stays ink.">
        <div className={styles.row}>
          {PACKAGES.map(([id, label]) => (
            <Tag key={id} pkg={id}>
              {label}
            </Tag>
          ))}
        </div>
      </Block>
    </>
  );
}

const ART = ['pink', 'cyan', 'violet'];

export function Cards() {
  return (
    <>
      <Block
        title="Base and link"
        note="Link cards lift toward their offset shadow; a pointer glow follows the cursor."
      >
        <div className={styles.cardGrid}>
          <Card>
            <span className={styles.cardEyebrow}>Base</span>
            <h3 className={styles.cardTitle}>Card, base</h3>
            <p className={styles.cardText}>1 px line, r-lg, well surface and shadow-md, with fluid padding.</p>
            <div className={styles.row}>
              <Tag pkg="2d">2D</Tag>
              <Tag>Guides</Tag>
            </div>
          </Card>
          {[
            { title: 'Sprite transforms', meta: 'Sprites · rest', state: undefined, accent: undefined },
            { title: 'Hello cube', meta: 'Basics · hover', state: 'hover' as const, accent: 'var(--px-pkg-3d)' },
            { title: 'Fish pond', meta: 'Tutorial · focus', state: 'focus' as const, accent: undefined },
          ].map(({ title, meta, state, accent }, i) => (
            <Card
              key={title}
              variant="link"
              to="#cards"
              accent={accent}
              data-state={state}
              media={
                <span className={styles.art} data-tint={ART[i]}>
                  <Blob shape={i === 1 ? 'cube-pink' : `sphere-${ART[(i + 1) % 3]}`} size={64} />
                </span>
              }
            >
              <h3>{title}</h3>
              <p>{meta}</p>
            </Card>
          ))}
        </div>
      </Block>
      <Block title="Closing" note="r-xl, a pink glow from the top and clay centred on its four corners.">
        <Card
          variant="closing"
          className={styles.closingDemo}
          corners={{
            tl: <Blob shape="pyramid-pink" size={56} />,
            tr: <Blob shape="cube-violet" size={76} />,
            br: <Blob shape="torus-cyan" size={66} />,
            bl: <Blob shape="sphere-cyan" size={62} />,
          }}
        >
          <h3 className={styles.closingTitle}>Elevate your Traditional HTML5 Techniques</h3>
          <p className={styles.closingLede}>
            Unbeatable performance, intuitive API, globally used and battle tested. In 2D since 2013, and now in 3D.
          </p>
          <ButtonRow>
            <Button to="#cards">Download</Button>
            <Button to="#cards" variant="outline-pink">
              Get started
            </Button>
          </ButtonRow>
        </Card>
      </Block>
    </>
  );
}

type Dimension = '2d' | '3d' | 'mixed';
type Section = 'guides' | 'tutorials' | 'examples' | 'api';

export function Controls() {
  const [dimension, setDimension] = useState<Dimension>('mixed');
  const [section, setSection] = useState<Section>('guides');
  const { colorMode, setColorMode } = useColorMode();
  const isBrowser = useIsBrowser();

  return (
    <div className={styles.controls}>
      <Block title="Segmented, md" note="Pink thumb with glow; arrows, Home and End move the selection.">
        <div className={styles.row}>
          <SegmentedControl<Dimension>
            label="Dimension"
            value={dimension}
            onChange={setDimension}
            options={[
              { value: '2d', label: '2D' },
              { value: '3d', label: '3D' },
              { value: 'mixed', label: 'Mixed' },
            ]}
          />
          <p className={styles.readout}>value: {dimension}</p>
        </div>
      </Block>
      <Block
        title="Segmented, sm"
        note="The rail's theme toggle: tinted thumb, accent-text label. This one switches the site theme."
      >
        <div className={styles.railFoot}>
          <SegmentedControl<'light' | 'dark'>
            label="Colour theme"
            size="sm"
            fill
            value={isBrowser ? colorMode : 'dark'}
            onChange={setColorMode}
            options={[
              { value: 'light', label: 'Light', icon: 'sun' },
              { value: 'dark', label: 'Dark', icon: 'moon' },
            ]}
          />
        </div>
      </Block>
      <Block title="Segmented, xs" note="32 px, the rail's section tabs.">
        <div className={styles.railFoot}>
          <SegmentedControl<Section>
            label="Section"
            size="xs"
            fill
            value={section}
            onChange={setSection}
            options={[
              { value: 'guides', label: 'Guides' },
              { value: 'tutorials', label: 'Tutorials' },
              { value: 'examples', label: 'Examples' },
              { value: 'api', label: 'API' },
            ]}
          />
        </div>
      </Block>
      <Block title="As links" note="The same look with links and aria-current, for package switches.">
        <div className={styles.row}>
          <SegmentedControl
            as="links"
            label="Package"
            value="2d"
            options={[
              { value: '2d', label: '2D', to: '#controls' },
              { value: '3d', label: '3D', to: '#controls' },
            ]}
          />
        </div>
      </Block>
    </div>
  );
}

const WAVES: Array<[WaveVariant, boolean]> = [
  ['a', false],
  ['b', false],
  ['c', false],
  ['drift', false],
  ['a', true],
];

export function Dividers() {
  return (
    <Block
      title="Waves"
      note="Inline SVG, 28-56 px tall, filled with the next band. Drift is twice as wide so the hero can slide it."
    >
      <ul className={styles.waves}>
        {WAVES.map(([variant, flip]) => (
          <li key={`${variant}${flip}`}>
            <div className={styles.wavePreview}>
              <div className={styles.waveTop} />
              <WaveDivider from="bg" to="bg-alt" variant={variant} flip={flip} />
              <div className={styles.waveBottom} />
            </div>
            <span className={styles.spaceName}>
              {variant}
              {flip ? ', flip' : ''}
            </span>
          </li>
        ))}
      </ul>
    </Block>
  );
}

export function Heads() {
  const scope = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState<Dimension>('mixed');

  useSplitTitle(scope);

  return (
    <div ref={scope} className={styles.heads}>
      <SectionHead
        as="h3"
        eyebrow="Features"
        title="PixiJS Features"
        underline
        lede="Everything that made 2D fast, now spanning both dimensions."
      />
      <SectionHead
        as="h3"
        layout="split"
        eyebrow="One engine, two dimensions"
        title="Sprites and meshes, on the same stage."
        lede="Everything you already know about the stage, the ticker and the asset loader still applies. The bunny just gets a z."
        control={
          <SegmentedControl<Dimension>
            label="Stage mode"
            value={dimension}
            onChange={setDimension}
            options={[
              { value: '2d', label: '2D' },
              { value: '3d', label: '3D' },
              { value: 'mixed', label: 'Mixed' },
            ]}
          />
        }
      />
      <SectionHead
        as="h3"
        eyebrow="Pick a dimension"
        title="2D, 3D or both."
        lede="PixiJS 3D is an extension, not a fork. It renders inside your 2D app."
      />
    </div>
  );
}
