import clsx from 'clsx';
import Icon from '@site/src/components/ui/Icon';
import stylesheet from '!!raw-loader!sass-loader!./memberCard.scss';
import { pageClasses } from '@site/src/components/Page/classes';

import type { IconName } from '@site/src/components/ui/Icon';

export interface MemberData {
  name: string;
  badges: string[];
  country: string;
  social: Partial<Record<Network, string>>;
  active: boolean;
}

type Network = 'github' | 'twitter';

/** The card's stylesheet (`px-member-*`), for the page that shows it to inline through `Page`'s `css` */
export const MEMBER_CARD_CSS = stylesheet;

const styles = pageClasses('member');

const SOCIAL: Record<Network, { label: string; icon: IconName }> = {
  github: { label: 'GitHub', icon: 'github' },
  twitter: { label: 'X', icon: 'x-twitter' },
};

function avatarOf({ social }: MemberData, size: number): string {
  return social.github ? `${social.github}.png?size=${size * 2}` : '/images/placeholders/avatar.jpg';
}

interface MemberCardProps {
  member: MemberData;
  /** One row with a small avatar, for past members */
  compact?: boolean;
}

export default function MemberCard({ member, compact }: MemberCardProps) {
  const size = compact ? 48 : 112;

  return (
    <article className={clsx(styles.card, compact && styles.compact)}>
      <span className={styles.ring} data-ring="">
        <img className={styles.avatar} src={avatarOf(member, size)} alt="" width={size} height={size} loading="lazy" />
      </span>
      <div className={styles.info}>
        <h3 className={styles.name}>
          {member.name}&nbsp;<span className={styles.flag}>{member.country}</span>
        </h3>
        <p className={styles.badges}>
          {member.badges.map((badge) => (
            <span key={badge} className={clsx(styles.badge, badge !== 'Member' && styles.lead)}>
              {badge}
            </span>
          ))}
        </p>
      </div>
      <ul className={styles.social}>
        {(Object.keys(SOCIAL) as Network[])
          .filter((network) => member.social[network])
          .map((network) => (
            <li key={network}>
              <a
                href={member.social[network]}
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on ${SOCIAL[network].label}`}
              >
                <Icon name={SOCIAL[network].icon} size={compact ? 15 : 16} />
              </a>
            </li>
          ))}
      </ul>
    </article>
  );
}
