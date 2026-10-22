import Link from '@docusaurus/Link';
import { HtmlClassNameProvider, PageMetadata, ThemeClassNames } from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import clsx from 'clsx';
import PostCard from '@site/src/components/Blog/PostCard';
import { EyebrowLabel } from '@site/src/shell/Eyebrow';
import styles from '@site/src/components/Blog/classes';

import type { Props } from '@theme/BlogListPage';

/**
 * Ejected (theme-classic 3.10.2) for the page header, since Docusaurus's blog index has no `h1`, and for the cards:
 * they're drawn from each post's metadata, not through `BlogPostItems`, so the index ships no MDX rendering code.
 * The paginator only renders when there's another page.
 */
export default function BlogListPage(props: Props) {
  const { metadata, items, sidebar } = props;
  const { blogTitle, blogDescription, permalink, previousPage, nextPage } = metadata;
  const base = permalink.replace(/\/page\/\d+$/, '');

  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}>
      <PageMetadata title={blogTitle} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
      <BlogListPageStructuredData {...props} />
      <BlogLayout sidebar={sidebar}>
        <header className={styles.header}>
          <EyebrowLabel>Blog</EyebrowLabel>
          <h1>{blogTitle}</h1>
          <p className={styles.lede}>{blogDescription}</p>
          <nav className={styles.links} aria-label="Blog">
            <Link to={`${base}/archive`}>Archive</Link>
            <Link to={`${base}/tags`}>Tags</Link>
            <Link to={`${base}/authors`}>Authors</Link>
            <Link to={`pathname://${base}/rss.xml`}>RSS</Link>
          </nav>
        </header>
        {items.map(({ content }) => (
          <PostCard key={content.metadata.permalink} post={content} />
        ))}
        {(previousPage || nextPage) && <BlogListPaginator metadata={metadata} />}
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
