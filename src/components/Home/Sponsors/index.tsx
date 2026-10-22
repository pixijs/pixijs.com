import { useRef } from 'react';
import Button from '@site/src/components/ui/Button';
import Icon from '@site/src/components/ui/Icon';
import SectionHead from '@site/src/components/ui/SectionHead';
import manualSponsors from '@site/src/data/manualSponsors.json';
import overrides from '@site/src/data/sponsor-overrides.json';
import sponsorData from '@site/src/data/sponsors.json';
import { gsap, ScrollTrigger } from '@site/src/motion/gsap';
import { useMotion } from '@site/src/motion/useMotion';
import styles from '../classes';

import type { CSSProperties } from 'react';

interface Sponsor {
  monthlyDollars: number;
  sponsor: { name: string; login: string; avatarUrl: string; websiteUrl?: string; linkUrl?: string };
  /** The avatar trimmed to its artwork and the colour around it (`npm run generate:sponsors -- --logos`) */
  logo?: { src: string; background: string };
}

/** Tiers from the top down, with the monthly amount each starts at; anything smaller counts as the last */
const TIERS = [
  { id: 'platinum', label: 'Platinum', from: 2000 },
  { id: 'gold', label: 'Gold', from: 500 },
  { id: 'silver', label: 'Silver', from: 250 },
  { id: 'bronze', label: 'Bronze', from: 100 },
];

const OVERRIDES = new Map(overrides.map((override) => [override.login, override]));
const SPONSORS = ([...sponsorData, ...manualSponsors] as Sponsor[]).sort((a, b) => b.monthlyDollars - a.monthlyDollars);
const tierOf = ({ monthlyDollars }: Sponsor) =>
  TIERS.find((tier) => monthlyDollars >= tier.from) ?? TIERS[TIERS.length - 1];
const BY_TIER = TIERS.map((tier) => ({
  ...tier,
  sponsors: SPONSORS.filter((sponsor) => tierOf(sponsor) === tier),
})).filter((tier) => tier.sponsors.length);

/**
 * The sponsors, grouped by tier from `src/data/sponsors.json` (`npm run generate:sponsors`) plus the manual entries
 * (section 8.4 item 9). Every tile in a tier is the same size and filled with its logo's own background, so the
 * artwork sits centred whatever the avatar's shape. Each tier rises in and its logos pop from the centre outward.
 */
export default function Sponsors() {
  const root = useRef<HTMLDivElement>(null);

  useMotion(root, (el, { paused }) => {
    if (paused) return;
    for (const tier of gsap.utils.toArray<HTMLElement>('[data-tier]', el)) {
      if (ScrollTrigger.isInViewport(tier, 0.1)) continue;
      gsap
        .timeline({ scrollTrigger: { trigger: tier, start: 'top 94%', once: true } })
        .from(tier.querySelector('h3'), { y: 16, opacity: 0, duration: 0.6 })
        .from(
          tier.querySelectorAll('li'),
          { scale: 0.9, opacity: 0, duration: 0.6, ease: 'back.out(1.7)', stagger: { each: 0.02, from: 'center' } },
          0.1,
        );
    }
  });

  return (
    <div ref={root}>
      <SectionHead
        className={styles.head}
        title="Sponsors"
        id="sponsors-title"
        lede="These sponsors support PixiJS financially, so we can spend more time working on it."
      />
      <div className={styles.tiers}>
        {BY_TIER.map(({ id, label, from, sponsors }) => (
          <section key={id} className={styles.tier} data-tier={id} style={{ '--n': sponsors.length } as CSSProperties}>
            <h3 className={styles.tierLabel}>
              <a
                href={`https://github.com/sponsors/pixijs?frequency=recurring&sponsor=${from}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label} {sponsors.length === 1 ? 'sponsor' : 'sponsors'}
                <Icon name="external" size={14} strokeWidth={2} />
              </a>
            </h3>
            <ul className={styles.tierList}>
              {sponsors.map(({ sponsor, logo }) => {
                const override = OVERRIDES.get(sponsor.login);

                return (
                  <li key={sponsor.login}>
                    <a
                      className={styles.sponsor}
                      href={override?.linkUrl ?? sponsor.websiteUrl ?? sponsor.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ '--tile': logo?.background } as CSSProperties}
                    >
                      <img
                        src={logo?.src ?? override?.avatarUrl ?? sponsor.avatarUrl}
                        alt={sponsor.name}
                        width={240}
                        height={100}
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <p className={styles.sponsorsMore}>
        <Button to="/sponsor" variant="outline" arrow>
          Become a sponsor
        </Button>
      </p>
    </div>
  );
}
