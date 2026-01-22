import MemberCard, { type MemberData } from '../components/MemberCard';
import team from './team.json';
import styles from './team.module.scss';
import Layout from '@theme/Layout';

import type React from 'react';

export default function Team(): React.JSX.Element {
  const actives: Array<Record<string, any>> = [];
  const inactives: Array<Record<string, any>> = [];

  team.forEach((member) => {
    member.active ? actives.push(member) : inactives.push(member);
  });

  return (
    <Layout
      title={'Meet the Team'}
      description="The handful of dedicated individuals who volunteer their time to make PixiJS better."
    >
      <main className={styles.teamPage}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className="underline">Meet the Team</h1>
            <p className={styles.subtitle}>
              The Core Team is comprised of a handful of dedicated individuals who volunteer their time to make PixiJS
              better.
            </p>
          </div>
        </section>

        {/* Active Members Section */}
        <section className={styles.membersSection}>
          <div className={styles.membersGrid}>
            {actives.map((member, i) => (
              <MemberCard key={i} {...(member as MemberData)} />
            ))}
          </div>
        </section>

        {/* Honorable Mentions Section */}
        <div className={styles.sectionDivider}>
          <h1 className="underline">Honorable Mentions</h1>
          <p className={styles.subtitle}>
            Here we honor some no-longer-active team members who have made valuable contributions in the past.
          </p>
        </div>

        <section className={styles.membersSection}>
          <div className={styles.membersGrid}>
            {inactives.map((member, i) => (
              <MemberCard key={i} {...(member as MemberData)} />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
