import styles from './index.module.scss';
import Link from '@docusaurus/Link';

import type React from 'react';

export interface MemberData {
  name: string;
  profile: string;
  badges: string[];
  country: string;
  description: string;
  social: Record<string, string>;
  active: boolean;
}

export default function MemberCard(props: MemberData): React.JSX.Element {
  const links = [];

  for (const key in props.social) {
    links.push({
      className: `header-link header-${key}-link`,
      to: props.social[key],
    });
  }

  let profileUrl = props.profile;

  if (!profileUrl) {
    profileUrl = props.social?.github ? `${props.social.github}.png` : 'images/placeholders/avatar.jpg';
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <img src={profileUrl} alt={`${props.name}'s Profile`} />
        <h3 className={styles.name}>
          {props.name} {props.country}
        </h3>
        <div className={`${styles.badges} ${props.active ? '' : styles.inactive}`}>
          {props.badges.map((badge, i) => (
            <span key={i} className={styles.badge}>
              {badge}
            </span>
          ))}
        </div>
        {props.active && <p className={styles.description}>{props.description}</p>}
        <div className={styles.separator} />
        <div className={styles.social}>
          {links.map((link, i) => (
            <Link key={i} {...link} />
          ))}
        </div>
      </div>
    </div>
  );
}
