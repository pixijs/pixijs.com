import { Heart, Rocket, Users } from 'lucide-react';
import React from 'react';
import styles from './Sponsor.module.css';
import whyStyles from './why.module.css';
import { Card, CardContent } from '../../components/Sponsor/card/Card';
import SponsorshipTiers from '../../components/Sponsor/tiers/SponsorshipTiers';
import CTASection from '../../components/Sponsor/cta/CTASection';

const statistics = [
  { value: '5M+', label: 'Monthly Downloads', color: 'greenBlue' },
  { value: '45K+', label: 'GitHub Stars', color: 'yellowOrange' },
  { value: '30K+', label: 'Developers', color: 'purplePink' },
  { value: '10+', label: 'Years Active', color: 'redRose' },
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

// Main Showcase Component
const Sponsor: React.FC = () => {
  return (
    <div className={styles.sponsor}>
      {/* Hero Section */}
      <section className={styles.heroSection} data-testid="hero-section">
        <div className={`${styles.maxWidth7xl} ${styles.mxAuto} ${styles.textCenter}`}>
          <h1 className={`${styles.heroTitle} underline`} data-testid="hero-title">
            Sponsor PixiJS
          </h1>
          <p className={`${styles.heroDescription} ${styles.mxAuto}`} data-testid="hero-description">
            Your support empowers us to build the fastest, most flexible 2D WebGL renderer. Join the companies and
            developers who make PixiJS possible.
          </p>

          {/* Statistics Grid */}
          <div className={`${styles.statisticsGrid} ${styles.mxAuto}`} data-testid="statistics-grid">
            {statistics.map((stat) => {
              return (
                <div
                  key={stat.label}
                  className={styles.statCard}
                  data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div
                    className={`${styles.statNumber} ${styles[stat.color]}`}
                    data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={styles.statLabel}
                    data-testid={`stat-label-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Why */}
          <section className={whyStyles.section} data-testid="why-sponsor-section">
            <div className={whyStyles.container}>
              <div className={whyStyles.header}>
                <h2 className={whyStyles.title} data-testid="why-sponsor-title">
                  Why Sponsor PixiJS?
                </h2>
              </div>

              <div className={whyStyles.featuresGrid} data-testid="why-sponsor-features">
                {whySponsorFeatures.map((feature) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card
                      key={feature.title}
                      className={whyStyles.card}
                      data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <CardContent className={whyStyles.cardContent}>
                        <div className={whyStyles.iconWrapper}>
                          <IconComponent className={whyStyles.icon} />
                        </div>
                        <h3
                          className={whyStyles.featureTitle}
                          data-testid={`feature-title-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {feature.title}
                        </h3>
                        <p
                          className={whyStyles.featureDescription}
                          data-testid={`feature-description-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
          {/* Sponsorship Tiers */}
          <SponsorshipTiers />
          {/* Call to Action Section */}
          <CTASection />
        </div>
      </section>
    </div>
  );
};

export default Sponsor;
