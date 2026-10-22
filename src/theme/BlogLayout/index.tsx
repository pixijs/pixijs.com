import Layout from '@theme/Layout';
import clsx from 'clsx';
import BlogPostsSection from '@site/src/shell/Rail/BlogPostsSection';
import TocColumn from '@site/src/theme/DocItem/Layout/TocColumn';
import styles, { STYLESHEET } from '@site/src/components/Blog/classes';

import type { Props } from '@theme/BlogLayout';

/**
 * Rewritten (theme-classic 3.10.2). The rail lists the posts by year, so there's no sidebar column: a post is one
 * reading column with the TOC beside it from 1280 px, and the list, tag and author pages are a grid of cards.
 */
export default function BlogLayout({ sidebar, toc, children, ...layoutProps }: Props) {
  const railSection = sidebar?.items.length ? <BlogPostsSection items={sidebar.items} /> : undefined;

  return (
    <Layout {...layoutProps} railSection={railSection}>
      <style dangerouslySetInnerHTML={{ __html: STYLESHEET }} />
      <div className={styles.blog}>
        <div className={clsx(styles.layout, toc && styles.withToc)}>
          <main className={styles.main}>{children}</main>
          {toc && <TocColumn>{toc}</TocColumn>}
        </div>
      </div>
    </Layout>
  );
}
