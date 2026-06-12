import manualSponsors from '../../data/manualSponsors.json';
import sponsorOverrides from '../../data/sponsor-overrides.json';
import sponsorData from '../../data/sponsors.json';
import styles from './BlogSponsors.module.scss';

import type React from 'react';
import type { Sponsorship } from 'sponsorkit';

const SILVER_MONTHLY_DOLLARS = 250;

type SponsorOverride = { login: string; avatarUrl?: string; linkUrl?: string };

const overridesByLogin = new Map<string, SponsorOverride>(
  (sponsorOverrides as SponsorOverride[]).map((o) => [o.login, o]),
);

export function BlogSponsors(): React.JSX.Element | null {
  const sponsors = ([...sponsorData, ...manualSponsors] as Sponsorship[])
    .filter((sponsor) => !sponsor.isOneTime && sponsor.monthlyDollars >= SILVER_MONTHLY_DOLLARS)
    .sort((a, b) => b.monthlyDollars - a.monthlyDollars);

  if (sponsors.length === 0) {
    return null;
  }

  return (
    <div className={styles.sponsors}>
      {sponsors.map((sponsor) => {
        const override = overridesByLogin.get(sponsor.sponsor.login);
        const href = override?.linkUrl || sponsor.sponsor.websiteUrl || sponsor.sponsor.linkUrl;
        const imgSrc = override?.avatarUrl || sponsor.sponsor.avatarUrl;

        return (
          <a
            key={sponsor.sponsor.login}
            className={styles.sponsor}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={sponsor.sponsor.name}
          >
            <img src={imgSrc} alt={`${sponsor.sponsor.name} logo`} className={styles.logo} />
          </a>
        );
      })}
    </div>
  );
}
