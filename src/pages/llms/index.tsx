import Layout from '@theme/Layout';
import LLMsPage from './_LLMsPage';

import type React from 'react';

export default function LLMs(): React.JSX.Element {
  return (
    <Layout
      title="PixiJS Skills"
      description="Install the official pixijs-skills collection for Claude Code, Cursor, Windsurf, Copilot, and 40+ other AI agents. Plain-text llms.txt docs also available."
    >
      <LLMsPage />
    </Layout>
  );
}
