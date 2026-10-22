import clsx from 'clsx';
import { useState } from 'react';
import Button, { ButtonRow } from '@site/src/components/ui/Button';
import Card from '@site/src/components/ui/Card';
import Chip from '@site/src/components/ui/Chip';
import SegmentedControl from '@site/src/components/ui/SegmentedControl';
import Tag from '@site/src/components/ui/Tag';
import Blob from './Blob';
import styles from './classes';

type Dimension = '2d' | '3d' | 'mixed';

function Sample({ theme }: { theme: 'light' | 'dark' }) {
  const [dimension, setDimension] = useState<Dimension>('mixed');

  return (
    <div className={clsx(theme === 'light' ? 'px-on-light' : 'px-on-dark', styles.pairPanel)}>
      <span className={styles.pairLabel}>{theme}</span>
      <p className={styles.pairEyebrow}>One engine, two dimensions</p>
      <h3 className={styles.pairTitle}>
        Sprites and meshes, on the same <span className={styles.accentWord}>stage</span>.
      </h3>
      <p className={styles.pairLede}>The bunny just gets a z. Everything else you know still applies.</p>
      <ButtonRow align="start">
        <Button to="#themes" arrow>
          Getting started
        </Button>
        <Button to="#themes" variant="outline">
          Tutorials
        </Button>
      </ButtonRow>
      <div className={styles.row}>
        <Chip to="#themes" badge="New">
          PixiJS 3D is in preview
        </Chip>
      </div>
      <div className={styles.row}>
        <SegmentedControl<Dimension>
          label={`Stage mode, ${theme}`}
          value={dimension}
          onChange={setDimension}
          options={[
            { value: '2d', label: '2D' },
            { value: '3d', label: '3D' },
            { value: 'mixed', label: 'Mixed' },
          ]}
        />
        <Tag pkg="3d">3D</Tag>
        <Tag tone="accent">Beta</Tag>
      </div>
      <div className={styles.pairCards}>
        <Card
          variant="link"
          to="#themes"
          media={
            <span className={styles.art} data-tint="violet">
              <Blob shape="torus-pink" size={56} />
            </span>
          }
        >
          <h3>Floating shapes</h3>
          <p>Tutorial · 3D</p>
        </Card>
        <div className={clsx('px-on-dark', styles.codeCard)}>
          <header>
            <span>pixi.js + @pixi/3d</span>
            <Tag pill>One stage</Tag>
          </header>
          <pre tabIndex={0}>
            <code>
              <span style={{ color: 'var(--px-code-kw)' }}>const</span> view ={' '}
              <span style={{ color: 'var(--px-code-kw)' }}>new</span>{' '}
              <span style={{ color: 'var(--px-code-fn)' }}>View3D</span>();{'\n'}
              app.stage.<span style={{ color: 'var(--px-code-fn)' }}>addChild</span>(view, hud);
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default function ThemePair() {
  return (
    <div className={styles.pair}>
      <Sample theme="light" />
      <Sample theme="dark" />
    </div>
  );
}
