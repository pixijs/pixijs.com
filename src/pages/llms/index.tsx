import Layout from '@theme/Layout';
import LLMsPage from './_LLMsPage';

import type React from 'react';

export default function LLMs(): React.JSX.Element {
  return (
    <Layout
      title="PixiJS Skills"
      description="Install the official pixijs-skills collection in Claude Code, Cursor, Windsurf, Copilot or any of 40+ AI agents. Plain-text llms.txt docs are also available."
    >
      <LLMsPage />
    </Layout>
  );
}
