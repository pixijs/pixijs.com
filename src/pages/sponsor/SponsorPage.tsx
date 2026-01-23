import { Heart, Rocket, Users } from 'lucide-react';
import React from 'react';
import styles from './Sponsor.module.scss';
import SponsorshipTiers from '../../components/Sponsor/tiers/SponsorshipTiers';
import CTASection from '../../components/Sponsor/cta/CTASection';
import { useClassModifier } from '@site/src/hooks/useContainerClassNameModifier';

const statistics = [
  { value: '5M+', label: 'Monthly Downloads' },
  { value: '45K+', label: 'GitHub Stars' },
  { value: '30K+', label: 'Developers' },
  { value: '10+', label: 'Years Active' },
];

const whySponsorFeatures = [
  {
    icon: Rocket,
    title: 'Accelerate Innovation',
    description:
      'Help fund new features, performance improvements, and cutting-edge graphics capabilities that benefit the entire web development ecosystem.',
  },
  {
    icon: Users,
    title: 'Reach Developers',
    description:
      'Gain visibility among 30,000+ active developers and millions of monthly users who rely on PixiJS for their projects.',
  },
  {
    icon: Heart,
    title: 'Support Open Source',
    description:
      'Demonstrate your commitment to open source software and help maintain a library that powers countless web applications.',
  },
];

const Sponsor: React.FC = () => {
  useClassModifier('.main-wrapper', 'tileBackground', true);
  return (
    <main className={styles.sponsorPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className="underline">Sponsor PixiJS</h1>
          <p className={styles.subtitle}>
            Your support empowers us to build the fastest, most flexible 2D WebGL renderer. Join the companies and
            developers who make PixiJS possible.
          </p>
        </div>
      </section>

      {/* Statistics Grid */}
      <section className={styles.statisticsSection}>
        <div className={styles.statisticsGrid}>
          {statistics.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statNumber}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Sponsor Section */}
      <section className={styles.whySection}>
        <h2>Why Sponsor PixiJS?</h2>
        <div className={styles.whyGrid}>
          {whySponsorFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.title} className={styles.whyCard}>
                <div className={styles.iconWrapper}>
                  <IconComponent className={styles.icon} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <SponsorshipTiers />

      {/* Call to Action Section */}
      <CTASection />
    </main>
  );
};

export default Sponsor;
