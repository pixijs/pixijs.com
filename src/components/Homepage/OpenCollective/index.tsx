import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import sponsorData from '../../../data/sponsors.json';
import sponsorOverrides from '../../../data/sponsor-overrides.json';
import manualSponsors from '../../../data/manualSponsors.json';
import styles from './index.module.scss';

import { ArrowUpRight } from 'lucide-react';
import type React from 'react';
import { Sponsorship } from 'sponsorkit';

const animShortUp = (duration: number, delay: number) => ({
  opacity: 0,
  animationDuration: `${duration}s`,
  animationDelay: `${delay}s`,
});

const SPONSOR_TIERS = {
  PLATINUM: 'Platinum Sponsor',
  GOLD: 'Gold Sponsor',
  SILVER: 'Silver Sponsor',
  BRONZE: 'Bronze Sponsor',
} as const;

const SPONSOR_TIER_AMOUNTS = {
  [SPONSOR_TIERS.PLATINUM]: 1000,
  [SPONSOR_TIERS.GOLD]: 500,
  [SPONSOR_TIERS.SILVER]: 250,
  [SPONSOR_TIERS.BRONZE]: 100,
} as const;

type SponsorTier = (typeof SPONSOR_TIERS)[keyof typeof SPONSOR_TIERS];

// Helper function to get sponsor tier based on monthly contribution
const getSponsorTier = (monthlyDollars: number): SponsorTier => {
  if (monthlyDollars >= 1000) return SPONSOR_TIERS.PLATINUM;
  if (monthlyDollars >= 500) return SPONSOR_TIERS.GOLD;
  if (monthlyDollars >= 250) return SPONSOR_TIERS.SILVER;
  return SPONSOR_TIERS.BRONZE;
};

export default function OpenCollective(): React.JSX.Element {
  const [sponsors, setSponsors] = useState<Sponsorship[]>([...sponsorData, ...manualSponsors] as Sponsorship[]);
  const overridesByLogin = new Map<string, { avatarUrl?: string; linkUrl?: string }>(
    (sponsorOverrides as Array<{ login: string; avatarUrl?: string; linkUrl?: string }>).map((o) => [
      o.login,
      {
        avatarUrl: o.avatarUrl,
        linkUrl: o.linkUrl,
      },
    ]),
  );

  useEffect(() => {
    const sponsorData = sponsors.map((sponsor) => ({
      ...sponsor,
      tierName: getSponsorTier(sponsor.monthlyDollars),
    })) as Sponsorship[];

    setSponsors(sponsorData);
  }, []);

  const sponsorsByTier = sponsors.reduce<Record<SponsorTier, Sponsorship[]>>(
    (acc, sponsor) => {
      if (!acc[sponsor.tierName as SponsorTier]) {
        acc[sponsor.tierName as SponsorTier] = [];
      }
      acc[sponsor.tierName as SponsorTier].push(sponsor);
      return acc;
    },
    {
      [SPONSOR_TIERS.PLATINUM]: [],
      [SPONSOR_TIERS.GOLD]: [],
      [SPONSOR_TIERS.SILVER]: [],
      [SPONSOR_TIERS.BRONZE]: [],
    },
  );

  const [ref, inView] = useInView({
    triggerOnce: true,
  });

  const renderSponsorTier = (tier: SponsorTier, sponsors: Sponsorship[]) => {
    // sort sponsors by monthlyDollars in descending order
    sponsors.sort((a, b) => b.monthlyDollars - a.monthlyDollars);

    const tierWord = sponsors.length === 1 ? tier : `${tier}s`;
    const amount = SPONSOR_TIER_AMOUNTS[tier];
    const sponsorUrl = `https://github.com/sponsors/pixijs?frequency=recurring&sponsor=${amount}`;

    return (
      <div key={tier} className={styles.tierSection}>
        <div className={styles.tierTitle} onClick={() => window.open(sponsorUrl, '_blank')}>
          <h2>{tierWord}</h2>
          <ArrowUpRight className={styles.arrow} size={18} aria-hidden="true" />
        </div>
        <div className={styles.sponsorGrid}>
          {sponsors.map((sponsor) => {
            const override = sponsor.sponsor.login ? overridesByLogin.get(sponsor.sponsor.login) : undefined;
            const href = override?.linkUrl || sponsor.sponsor.websiteUrl || sponsor.sponsor.linkUrl;
            const imgSrc = override?.avatarUrl || sponsor.sponsor.avatarUrl;

            return (
              <div
                key={sponsor.sponsor.name}
                className={`${styles.sponsor} ${styles[tier.toLowerCase().replace(' ', '-')]}`}
              >
                <a href={href}>
                  <img src={imgSrc} alt={`${sponsor.sponsor.name} logo`} className={styles.sponsorImage} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.wrapper}`}>
      <div ref={ref}>
        {inView && (
          <>
            <h3 className={`${styles.title} underline short-up-anim`} style={animShortUp(0.3, 0.25)}>
              Sponsors
            </h3>
            <h5 className={`${styles.subtitle} short-up-anim`} style={animShortUp(0.3, 0.4)}>
              These contributors support PixiJS financially, which allows us to spend more time working on PixiJS.
            </h5>
            <div className={`${styles.sponsorsContainer} short-up-anim`} style={animShortUp(0.3, 0.55)}>
              {renderSponsorTier(SPONSOR_TIERS.PLATINUM, sponsorsByTier[SPONSOR_TIERS.PLATINUM])}
              {renderSponsorTier(SPONSOR_TIERS.GOLD, sponsorsByTier[SPONSOR_TIERS.GOLD])}
              {renderSponsorTier(SPONSOR_TIERS.SILVER, sponsorsByTier[SPONSOR_TIERS.SILVER])}
              {renderSponsorTier(SPONSOR_TIERS.BRONZE, sponsorsByTier[SPONSOR_TIERS.BRONZE])}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
