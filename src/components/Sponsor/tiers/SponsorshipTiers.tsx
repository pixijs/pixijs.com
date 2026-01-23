import { useCallback } from 'react';
import styles from './SponsorshipTiers.module.scss';

const tiers = [
  {
    name: 'Bronze',
    price: 100,
    titleClass: styles.tierTitleBronze,
    benefits: ['Logo on our home page with a link to your site'],
    buttonText: 'Sponsor Bronze',
    buttonClass: styles.buttonBronze,
    cardClass: styles.tierBronze,
  },
  {
    name: 'Silver',
    price: 250,
    titleClass: styles.tierTitleSilver,
    benefits: ['All Bronze benefits', 'Logo in release blog posts', '1 sponsored link in the showcase'],
    buttonText: 'Sponsor Silver',
    buttonClass: styles.buttonSilver,
    cardClass: styles.tierSilver,
  },
  {
    name: 'Gold',
    price: 500,
    titleClass: styles.tierTitleGold,
    benefits: [
      'All Silver benefits',
      'Logo on all documentation pages',
      'Logo in GitHub README',
      'Access to Sponsors only Discord channel',
    ],
    buttonText: 'Sponsor Gold',
    buttonClass: styles.buttonGold,
    cardClass: styles.tierGold,
  },
  {
    name: 'Gold++',
    price: 1000,
    titleClass: styles.tierTitleGoldPlus,
    benefits: [
      'All Gold benefits',
      '2 sponsored links in the showcase',
      'Shared social media promotion',
      'Priority on bug fixes',
    ],
    buttonText: 'Sponsor Gold++',
    buttonClass: styles.buttonGoldPlus,
    cardClass: styles.tierGoldPlus,
  },
  {
    name: 'Platinum',
    price: 2000,
    titleClass: styles.tierTitlePlatinum,
    benefits: [
      'All Gold++ benefits',
      'Most prominent logo placement',
      'Highest priority on bug fixes',
      'Help shape what we work on next!',
    ],
    buttonText: 'Sponsor Platinum',
    buttonClass: styles.buttonPlatinum,
    cardClass: styles.tierPlatinum,
    featured: true,
  },
];

export default function SponsorshipTiers() {
  const onClickSponsor = useCallback(() => {
    window.open(`https://opencollective.com/pixijs`, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Sponsorship Tiers</h2>

      <div className={styles.tiersGrid}>
        {tiers.map((tier) => (
          <div key={tier.name} className={`${styles.tierCard} ${tier.cardClass}`}>
            {tier.featured && <div className={styles.featuredBadge}>Premium</div>}
            <div className={styles.cardContent}>
              <h3 className={`${styles.tierTitle} ${tier.titleClass}`}>{tier.name}</h3>
              <p className={styles.price}>
                ${tier.price}
                <span>/month</span>
              </p>
              <ul className={styles.benefits}>
                {tier.benefits.map((benefit, i) => (
                  <li key={i}>
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <button className={`${styles.button} ${tier.buttonClass}`} onClick={onClickSponsor}>
              {tier.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
