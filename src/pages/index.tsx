import { useRef } from 'react';
import Band from '@site/src/components/Home/Band';
import BrandMarquee from '@site/src/components/Home/BrandMarquee';
import styles from '@site/src/components/Home/classes';
import ClosingCta from '@site/src/components/Home/ClosingCta';
import { FEATURES } from '@site/src/components/Home/content/features';
import DimensionHeadline from '@site/src/components/Home/DimensionHeadline';
import Ecosystem from '@site/src/components/Home/Ecosystem';
import FeatureList from '@site/src/components/Home/FeatureList';
import Hero, { Logo } from '@site/src/components/Home/Hero';
import HomePage from '@site/src/components/Home/HomePage';
import MagneticButton from '@site/src/components/Home/MagneticButton';
import PackageCards from '@site/src/components/Home/PackageCards';
import Pillars from '@site/src/components/Home/Pillars';
import ShowcaseStrip from '@site/src/components/Home/ShowcaseStrip';
import Sponsors from '@site/src/components/Home/Sponsors';
import Chip from '@site/src/components/ui/Chip';
import SectionHead from '@site/src/components/ui/SectionHead';

import type { HeroFieldHandle } from '@site/src/components/Home/Hero';
import type { Pillar } from '@site/src/components/Home/Pillars';

const PILLARS: Pillar[] = [
  {
    title: 'Fast',
    copy: "PixiJS is built for speed. It's the fastest 2D renderer there is, and PixiJS 3D batches meshes into instanced draw calls.",
  },
  {
    title: 'Flexible',
    copy: 'An easy-to-use, feature-rich API takes care of the fundamentals while you focus on building games and apps for any platform.',
  },
  {
    title: 'Free',
    copy: 'PixiJS is and always will be open source, with a large and supportive community that contributes to its development.',
  },
];

export default function Home() {
  const field = useRef<HeroFieldHandle>(null);

  return (
    <HomePage
      title="PixiJS | The HTML5 Creation Engine, now in 2D and 3D"
      description="Create beautiful games, apps and interactive content with PixiJS, the fastest 2D WebGPU or WebGL renderer, now with a 3D engine on the same stage."
    >
      <Hero
        field={field}
        logo={<Logo />}
        title={<DimensionHeadline field={field} />}
        lede="Create beautiful games, apps and interactive digital content with the fastest WebGPU or WebGL renderer."
        actions={
          <>
            <MagneticButton to="/8.x/guides/getting-started/intro" arrow intro={0}>
              Getting started
            </MagneticButton>
            <MagneticButton to="/8.x/tutorials" variant="outline" glass intro={1}>
              Tutorials
            </MagneticButton>
          </>
        }
        chips={
          <Chip to="/3d" badge="NEW">
            PixiJS 3D is in preview
          </Chip>
        }
      />
      <BrandMarquee />
      <Band next="bg-alt" wave="a">
        <Pillars items={PILLARS} />
      </Band>
      <Band surface="bg-alt" glow next="bg" wave="b" labelledBy="dimension-title">
        <SectionHead
          className={styles.head}
          eyebrow="PICK A DIMENSION"
          title="2D, 3D or both."
          lede="PixiJS 3D is an extension, not a fork. It renders inside your 2D app, so you can add it to a project you already have."
          id="dimension-title"
        />
        <PackageCards />
      </Band>
      <Band next="bg-alt" wave="a" labelledBy="features-title">
        <SectionHead
          className={styles.head}
          title="PixiJS features"
          underline
          lede="Everything that made PixiJS fast in 2D, now in 3D too."
          id="features-title"
        />
        <FeatureList items={FEATURES} />
      </Band>
      <Band surface="bg-alt" glow next="bg" wave="c" labelledBy="ecosystem-title">
        <Ecosystem />
      </Band>
      <Band next="bg-alt" wave="b" labelledBy="showcase-title">
        <ShowcaseStrip />
      </Band>
      <Band surface="bg-alt" next="bg" wave="a" labelledBy="closing-title">
        <ClosingCta lede="PixiJS is fast, easy to learn and used in production worldwide. It has rendered 2D since 2013 and now renders 3D too." />
      </Band>
      <Band labelledBy="sponsors-title">
        <Sponsors />
      </Band>
    </HomePage>
  );
}
