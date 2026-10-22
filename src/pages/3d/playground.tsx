import PlaygroundPage from '@site/src/components/Playground';
import Layout from '@theme/Layout';

import type React from 'react';

export default function Playground3D(): React.JSX.Element {
  return (
    <Layout
      app
      title="PixiJS 3D playground"
      description="Write and run PixiJS 3D code in your browser, then share it as a link."
    >
      <main>
        <PlaygroundPage pkg="3d" />
      </main>
    </Layout>
  );
}
