/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react';
import Layout from '@theme/Layout';
import { tutorialData } from '../data/tutorial/TutorialData';
import Tutorial from '../components/Tutorial';

export default function TutorialPage(): JSX.Element {
  return (
    <Layout
      title="Tutorial"
      description="Description will go into a meta tag in <head />"
      noFooter
    >
      <Tutorial data={tutorialData.gettingStarted} />
    </Layout>
  );
}
