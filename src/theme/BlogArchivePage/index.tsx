import Link from '@docusaurus/Link';
import { HtmlClassNameProvider, PageMetadata, ThemeClassNames } from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import { EyebrowLabel } from '@site/src/shell/Eyebrow';
import { postsByYear } from '@site/src/shell/Rail/BlogPostsSection';
import styles from '@site/src/components/Blog/classes';

import type { Props } from '@theme/BlogArchivePage';

const DAY = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', timeZone: 'UTC' });

/**
 * Rewritten (theme-classic 3.10.2): every post by year, newest first, in the blog's layout. The rail's post list is
 * built from the same posts, since the archive route gets no sidebar.
 */
export default function BlogArchivePage({ archive }: Props) {
  const posts = archive.blogPosts.map((post) => post.metadata);
  const years = postsByYear(posts);

  return (
    <HtmlClassNameProvider className={`${ThemeClassNames.wrapper.blogPages} blog-archive-page`}>
      <PageMetadata title="Archive" description="Every post on the PixiJS blog, by year." />
      <BlogLayout sidebar={{ title: 'All posts', items: posts }}>
        <header>
          <EyebrowLabel>Blog</EyebrowLabel>
          <h1>Archive</h1>
          <p>
            {posts.length} posts since {years.at(-1)?.[0]}, newest first.
          </p>
        </header>
        {years.map(([year, yearPosts]) => (
          <section key={year} className={styles.year} aria-labelledby={`year-${year}`}>
            <h2 id={`year-${year}`}>{year}</h2>
            <ul>
              {yearPosts.map((post) => (
                <li key={post.permalink}>
                  <Link to={post.permalink}>
                    <time dateTime={post.date}>{DAY.format(new Date(post.date))}</time>
                    <span>{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
