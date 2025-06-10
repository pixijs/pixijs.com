import ClosingSection from './ClosingSection';
import FeatureList from './FeatureList';
import HeroHeader from './HeroHeader';
import KeyOfferings from './KeyOfferings';
import OpenCollective from './OpenCollective';
import TestimonialCarousel from './TestimonialCarousel';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import type React from 'react';

export default function Homepage(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} | The HTML5 Creation Engine`}
      description={
        'PixiJS - The HTML5 Creation Engine. ' +
        'Create beautiful digital content with the fastest, ' +
        'most flexible 2D WebGL renderer.'
      }
    >
      <main>
        <div className="text--center">
          <HeroHeader />
          <TestimonialCarousel />
          <KeyOfferings />
          <FeatureList />
          <ClosingSection />
          <OpenCollective />
        </div>
      </main>
    </Layout>
  );
}
