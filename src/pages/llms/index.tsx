import Layout from '@theme/Layout';
import LLMsPage from './_LLMsPage';

import type React from 'react';

export default function LLMs(): React.JSX.Element {
  return (
    <Layout
      title="LLM Documentation"
      description="Machine-readable API documentation optimized for AI assistants. Use this file to give Claude, ChatGPT, Cursor, or other AI tools accurate knowledge about PixiJS."
    >
      <LLMsPage />
    </Layout>
  );
}
