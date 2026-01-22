import { useCallback } from 'react';
import styles from './SponsorshipTiers.module.scss';

const tiers = [
  {
    name: 'Gold',
    price: 500,
    priceClass: styles.priceGold,
    titleClass: styles.tierTitleGold,
    benefitsClass: styles.benefitsGold,
    iconColor: styles.iconGreen,
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
    name: 'Platinum',
    price: 2000,
    priceClass: styles.pricePlatinum,
    titleClass: styles.tierTitlePlatinum,
    benefitsClass: styles.benefitsPlatinum,
    iconColor: styles.iconGreenLight,
    benefits: [
      'All Gold++ benefits',
      'Most prominent logo placement',
      'Highest priority on bug fixes',
      'Help shape what we work on next!',
    ],
    buttonText: 'Sponsor Platinum',
    buttonClass: styles.buttonPlatinum,
    cardClass: styles.tierPlatinum,
    header: 'Premium',
  },
  {
    name: 'Gold++',
    price: 1000,
    priceClass: styles.priceGoldPlus,
    titleClass: styles.tierTitleGoldPlus,
    benefitsClass: styles.benefitsGoldPlus,
    iconColor: styles.iconGreen,
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
    name: 'Bronze',
    price: 100,
    priceClass: styles.priceBronze,
    titleClass: styles.tierTitleBronze,
    benefitsClass: styles.benefitsBronze,
    iconColor: styles.iconGreen,
    benefits: ['Logo on our home page with a link to your site'],
    buttonText: 'Sponsor Bronze',
    buttonClass: styles.buttonBronze,
    cardClass: styles.tierBronze,
  },
  {
    name: 'Silver',
    price: 250,
    priceClass: styles.priceSilver,
    titleClass: styles.tierTitleSilver,
    benefitsClass: styles.benefitsSilver,
    iconColor: styles.iconGreen,
    benefits: ['All Bronze benefits', 'Logo in release blog posts', '1 sponsored link in the showcase'],
    buttonText: 'Sponsor Silver',
    buttonClass: styles.buttonSilver,
    cardClass: styles.tierSilver,
  },
];

export default function SponsorshipTiers() {
  const topTiers = tiers.slice(0, 3);
  const bottomTiers = tiers.slice(3);

  const onClickSponsor = useCallback(() => {
    window.open(`https://opencollective.com/pixijs`, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Sponsorship Tiers</h2>

      {/* Top Tiers */}
      <div className={styles.topTiers}>
        {topTiers.map((tier) => (
          <div key={tier.name} className={`${styles.tierCard} ${tier.cardClass}`}>
            {tier.header && <div className={styles.tierHeader}>{tier.header}</div>}
            <div className={`${styles['flex-grow']}`}>
              <h3 className={`${tier.titleClass} ${styles.tierTitle}`}>{tier.name}</h3>
              <p className={`${styles.price} ${tier.priceClass}`}>
                ${tier.price}
                <span>/month</span>
              </p>
              <ul className={`${styles.benefits} ${tier.benefitsClass}`}>
                {tier.benefits.map((benefit, i) => (
                  <li key={i}>
                    <svg className={tier.iconColor} viewBox="0 0 24 24">
                      <path
                        fill="none"
                        stroke={'currentColor'}
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
            <button className={`${styles.button} ${tier.buttonClass}`} onClick={() => onClickSponsor()}>
              {tier.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Tiers */}
      <div className={styles.bottomTiers}>
        {bottomTiers.map((tier) => (
          <div key={tier.name} className={`${styles.tierCard} ${tier.cardClass}`}>
            <div className={`${styles['flex-grow']}`}>
              <h3 className={`${tier.titleClass} ${styles.tierTitle}`}>{tier.name}</h3>
              <p className={`${styles.price} ${tier.priceClass}`}>
                ${tier.price}
                <span>/month</span>
              </p>
              <ul className={`${styles.benefits} ${tier.benefitsClass}`}>
                {tier.benefits.map((benefit, i) => (
                  <li key={i}>
                    <svg className={tier.iconColor} viewBox="0 0 24 24">
                      <path
                        fill="none"
                        stroke={'currentColor'}
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
            {/* <HomeCTA white label={tier.buttonText} link="8.x/guides/getting-started/intro" /> */}
            <button className={`${styles.button} ${tier.buttonClass}`}>{tier.buttonText}</button>
          </div>
        ))}
      </div>
    </section>
  );
}
