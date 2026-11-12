import Layout from '@theme/Layout';
import FAQPage from './_FAQPage';

export default function FAQ() {
  return (
    <Layout
      title="FAQ"
      description="Answers to common questions about PixiJS: what it's for, what it costs, how to get started and who makes it."
      wrapperClassName="shell-reading"
    >
      <FAQPage />
    </Layout>
  );
}
