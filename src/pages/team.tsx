/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import Layout from '@theme/Layout'
import React from 'react'
import MemberCard, { MemberData } from '../components/MemberCard'
import team from './team.json'
import styles from './team.module.scss'

export default function Team (): JSX.Element {
  const actives: Array<Record<string, any>> = []
  const inactives: Array<Record<string, any>> = []

  team.forEach(member => {
    member.active ? actives.push(member) : inactives.push(member)
  })

  return (
        <Layout
            title={'Meet the Team'}
            description='Description will go into a meta tag in <head />'>
            <main>
                <div className={`${styles.header} padding-horiz--lg text--center margin-vert--xl`}>
                    <h1 className='underline'>Meet the Team</h1>
                    <h4>The Core Team is comprised of a handful of dedicated individuals who volunteer their time to make PixiJS better.</h4>
                </div>
                <div className={`${styles.members} container flex margin-bottom--xl`}>{ actives.map((member, i) => <MemberCard key={i} {...member as MemberData} />) }</div>
                <div className={`${styles.header} padding-horiz--lg text--center`}>
                    <h1 className='margin-top--xl underline'>Honorable Mentions</h1>
                    <h4>Here we honor some no-longer-active team members who have made valuable contributions in the past.</h4>
                </div>
                <div className={`${styles.members} container flex margin-bottom--xl`}>{ inactives.map((member, i) => <MemberCard key={i} {...member as MemberData} />) }</div>
            </main>
        </Layout>
  )
}
