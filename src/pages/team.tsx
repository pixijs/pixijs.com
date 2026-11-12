import Layout from '@theme/Layout';
import TEAM_CSS from '!!raw-loader!sass-loader!./team.scss';
import MemberCard, { MEMBER_CARD_CSS } from '@site/src/components/MemberCard';
import { Accent, Band, Closing } from '@site/src/components/Page';
import { pageClasses } from '@site/src/components/Page/classes';
import MotionPage, { ClayHeader } from '@site/src/components/Page/MotionPage';
import Button from '@site/src/components/ui/Button';
import SectionHead from '@site/src/components/ui/SectionHead';
import { CONTRIBUTING, DISCORD } from '@site/src/data/navigation';
import team from './team.json';

import type { MemberData } from '@site/src/components/MemberCard';
import type { CSSProperties } from 'react';

const members: MemberData[] = team;
const core = members.filter((member) => member.active);
const past = members.filter((member) => !member.active);
const styles = pageClasses('team');

export default function Team() {
  return (
    <Layout title="Team" description="Meet the people who build PixiJS, and the past team members who helped build it.">
      <MotionPage css={TEAM_CSS + MEMBER_CARD_CSS}>
        <ClayHeader
          className={styles.header}
          eyebrow="Team"
          title={
            <>
              Meet the <Accent>team</Accent>
            </>
          }
          lede="A handful of people volunteer their time to build PixiJS, with help from hundreds of contributors."
          next="bg"
          clay={['sphere-violet', 'torus-pink']}
        >
          <h2 className={styles.crewTitle} id="core-team">
            Core team
          </h2>
          <ul className={styles.crew} aria-labelledby="core-team">
            {core.map((member, i) => (
              <li key={member.name} style={{ '--i': i } as CSSProperties}>
                <MemberCard member={member} />
              </li>
            ))}
          </ul>
        </ClayHeader>

        <Band className={styles.mentions}>
          <SectionHead
            eyebrow="Thank you"
            title="Honourable mentions"
            lede="Past team members who helped build PixiJS."
          />
          <ul className={styles.past}>
            {past.map((member) => (
              <li key={member.name} data-reveal="">
                <MemberCard member={member} compact />
              </li>
            ))}
          </ul>
        </Band>

        <Band surface="bg-alt" edge="c" flip>
          <Closing
            corners={{ br: 'torus-pink', bl: 'sphere-violet' }}
            title="Help build PixiJS"
            lede="We develop PixiJS in the open. Pick up an issue, improve the docs or come and say hi on Discord."
            actions={
              <>
                <Button to={CONTRIBUTING} arrow>
                  Contribute
                </Button>
                <Button to={DISCORD} variant="outline" icon="discord">
                  Join Discord
                </Button>
              </>
            }
          />
        </Band>
      </MotionPage>
    </Layout>
  );
}
