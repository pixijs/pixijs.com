import PlaygroundPage from '@site/src/components/Playground';
import Layout from '@theme/Layout';

import type React from 'react';

export default function Playground(): React.JSX.Element {
  return (
    <Layout app title="Playground" description="Write and run PixiJS code in your browser, then share it as a link.">
      <main>
        <PlaygroundPage pkg="2d" />
      </main>
    </Layout>
  );
}
