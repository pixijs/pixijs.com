import clsx from 'clsx';
import { useRef } from 'react';
import SPONSOR_CSS from '!!raw-loader!sass-loader!./sponsor.scss';
import MagneticButton from '@site/src/components/Home/MagneticButton';
import { Accent, Band, Closing } from '@site/src/components/Page';
import { pageClasses } from '@site/src/components/Page/classes';
import MotionPage, { ClayHeader } from '@site/src/components/Page/MotionPage';
import Button from '@site/src/components/ui/Button';
import Icon from '@site/src/components/ui/Icon';
import SectionHead from '@site/src/components/ui/SectionHead';
import { GITHUB_SPONSORS, OPEN_COLLECTIVE } from '@site/src/data/navigation';
import { useClayField } from '@site/src/motion/useClayField';

import type { IconName } from '@site/src/components/ui/Icon';

const styles = pageClasses('sponsor');

const PLATFORMS = {
  oc: { label: 'Open Collective', url: OPEN_COLLECTIVE },
  gh: { label: 'GitHub Sponsors', url: GITHUB_SPONSORS },
};

const STATS = [
  { value: '8M+', label: 'Monthly downloads' },
  { value: '46K+', label: 'GitHub stars' },
  { value: '40K+', label: 'Developers' },
  { value: '10+', label: 'Years active' },
];

const REASONS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'zap',
    title: 'Speed up development',
    text: 'Fund new features and performance work that every project built on PixiJS benefits from.',
  },
  {
    icon: 'eye',
    title: 'Reach developers',
    text: 'Put your brand in front of the developers and studios who build with PixiJS every day.',
  },
  {
    icon: 'heart',
    title: 'Support open source',
    text: 'Back open source and help maintain a library that many web games and apps depend on.',
  },
];

interface Tier {
  id: string;
  name: string;
  price: number;
  /** The tier this one includes */
  includes?: string;
  benefits: string[];
}

const TIERS: Tier[] = [
  { id: 'bronze', name: 'Bronze', price: 100, benefits: ['Logo on our home page with a link to your site'] },
  {
    id: 'silver',
    name: 'Silver',
    price: 250,
    includes: 'Bronze',
    benefits: ['Logo in release blog posts', '1 sponsored link in the showcase'],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 500,
    includes: 'Silver',
    benefits: ['Logo on all documentation pages', 'Logo in the GitHub README', 'Sponsors-only Discord channel'],
  },
  {
    id: 'gold-plus',
    name: 'Gold++',
    price: 1000,
    includes: 'Gold',
    benefits: ['2 sponsored links in the showcase', 'Shared social media promotion', 'Priority on bug fixes'],
  },
];

const PLATINUM: Tier = {
  id: 'platinum',
  name: 'Platinum',
  price: 2000,
  includes: 'Gold++',
  benefits: ['Most prominent logo placement', 'Highest priority on bug fixes', 'Help shape what we work on next'],
};

function Price({ value }: { value: number }) {
  return (
    <p className={styles.price}>
      <span className={styles.amount}>${value.toLocaleString('en-US')}</span>
      <span className={styles.per}>per month</span>
    </p>
  );
}

function Benefits({ tier }: { tier: Tier }) {
  return (
    <ul className={styles.benefits}>
      <li className={styles.includes}>
        {tier.includes ? `Everything in ${tier.includes}, plus` : 'Every sponsor gets'}
      </li>
      {tier.benefits.map((benefit) => (
        <li key={benefit}>
          <Icon name="check" size={16} strokeWidth={2.25} className={styles.check} />
          {benefit}
        </li>
      ))}
    </ul>
  );
}

/** A tier as a blog-style cover (its name and price) over its benefits and a button for each platform */
function TierCard({ tier, featured }: { tier: Tier; featured?: boolean }) {
  return (
    <li className={clsx(styles.tier, featured && styles.featured)} data-tier={tier.id} data-reveal="">
      <div className={styles.cover}>
        <h3 className={styles.tierName}>{tier.name}</h3>
        {featured && <p className={styles.flag}>Most impact</p>}
        <Price value={tier.price} />
      </div>
      <Benefits tier={tier} />
      <div className={styles.pay}>
        <Button
          to={PLATFORMS.oc.url}
          variant={featured ? 'primary' : 'small'}
          icon="heart"
          aria-label={`Choose ${tier.name} on ${PLATFORMS.oc.label}`}
        >
          Open Collective
        </Button>
        <Button
          to={PLATFORMS.gh.url}
          variant={featured ? 'outline' : 'small'}
          icon="github"
          aria-label={`Choose ${tier.name} on ${PLATFORMS.gh.label}`}
        >
          GitHub
        </Button>
      </div>
    </li>
  );
}

export default function SponsorPage() {
  const closing = useRef<HTMLDivElement>(null);

  useClayField(closing);

  return (
    <MotionPage css={SPONSOR_CSS}>
      <ClayHeader
        eyebrow="Sponsor"
        title={
          <>
            Sponsor <Accent>PixiJS</Accent>
          </>
        }
        lede="PixiJS is free and open source, built by a small team. Sponsorship pays for new features, faster fixes and better docs, in 2D and now in 3D."
        actions={
          <>
            <MagneticButton to={PLATFORMS.oc.url} icon="heart" arrow>
              Open Collective
            </MagneticButton>
            <MagneticButton to={PLATFORMS.gh.url} variant="outline" icon="github" glass>
              GitHub Sponsors
            </MagneticButton>
          </>
        }
        next="bg"
        clay={['torus-cyan', 'octahedron-violet']}
      >
        <dl className={styles.stats}>
          {STATS.map(({ value, label }) => (
            <div key={label} className={styles.stat}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </ClayHeader>

      <Band glow>
        <SectionHead
          eyebrow="Why sponsor"
          title="Fund what's next"
          lede="Your support turns spare-time maintenance into focused work on the engine."
        />
        <ul className={styles.reasons}>
          {REASONS.map(({ icon, title, text }) => (
            <li key={title} className={styles.reason} data-reveal="">
              <span className={styles.reasonIcon}>
                <Icon name={icon} size={22} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </Band>

      <Band surface="bg-alt" edge="a" id="tiers">
        <SectionHead
          eyebrow="Tiers"
          title="Sponsorship tiers"
          lede="Monthly tiers, through Open Collective or GitHub Sponsors. Each tier includes everything below it."
        />
        <ul className={styles.tiers}>
          {TIERS.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
          <TierCard tier={PLATINUM} featured />
        </ul>
      </Band>

      <Band edge="c" flip>
        <Closing
          ref={closing}
          title="Ready to sponsor PixiJS?"
          lede={
            <>
              Pick a tier, or talk to us about something custom at <a href="mailto:sean@pixijs.com">sean@pixijs.com</a>.
            </>
          }
          actions={
            <>
              <Button to={PLATFORMS.oc.url} icon="heart">
                Open Collective
              </Button>
              <Button to={PLATFORMS.gh.url} variant="outline" icon="github">
                GitHub Sponsors
              </Button>
            </>
          }
        />
      </Band>
    </MotionPage>
  );
}
