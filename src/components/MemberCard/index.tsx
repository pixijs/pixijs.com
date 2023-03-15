import styles from './index.module.scss';
import Link from '@docusaurus/Link';

export interface MemberData {
  name: string;
  profile: string;
  badges: string[];
  country: string;
  description: string;
  social: Record<string, string>;
  active: boolean;
}

export default function MemberCard(props: MemberData): JSX.Element
{
  const links = [];

  for (const key in props.social)
  {
    links.push({
      className: `header-link header-${key}-link`,
      to: props.social[key],
    });
  }

  let profileUrl = props.profile;

  if (!profileUrl)
  {
    profileUrl = props.social?.github
      ? `${props.social.github}.png`
      : 'images/placeholders/avatar.jpg';
  }

  return (
    <div className={`${styles.wrapper} col col--4`}>
      <div className={styles.card}>
        <img
          className="margin-vert--md"
          src={profileUrl}
          alt={`${props.name}'s Profile`}
        />
        <h3 className="margin-bottom--md padding-horiz--md">
          {props.name} {props.country}
        </h3>
        <div
          className={`${styles.badges} ${
            props.active ? '' : styles.inactive
          } margin-bottom--md`}
        >
          {props.badges.map((badge, i) => (
            <h4 key={i}>{badge}</h4>
          ))}
        </div>
        {props.active && (
          <p className="margin-bottom--lg padding-horiz--md">
            {props.description}
          </p>
        )}
        <div className={styles.separator} />
        <div className={`margin-top--lg margin-bottom--md ${styles.social}`}>
          {links.map((link, i) => (
            <Link key={i} {...link} />
          ))}
        </div>
      </div>
    </div>
  );
}
