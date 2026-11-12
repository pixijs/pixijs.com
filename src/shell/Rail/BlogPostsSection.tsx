import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import Icon from '@site/src/components/ui/Icon';
import styles from './Rail.module.scss';

import type { BlogSidebarItem } from '@docusaurus/plugin-content-blog';

/** Year in UTC, so the server and every reader's time zone agree */
const yearOf = (date: Date | string) => new Date(date).toISOString().slice(0, 4);

/** Posts grouped by year, in the order given (newest first): the rail's list and the archive page */
export function postsByYear<T extends { date: Date | string }>(posts: T[]): [year: string, posts: T[]][] {
  const years = new Map<string, T[]>();

  for (const post of posts) {
    const year = yearOf(post.date);

    years.set(year, [...(years.get(year) ?? []), post]);
  }

  return [...years];
}

/** The rail's drill-down on blog pages: posts by year */
export default function BlogPostsSection({ items }: { items: BlogSidebarItem[] }) {
  const { pathname } = useLocation();

  return (
    <div data-verify="rail-section">
      <Link to="/blog" className={styles.sectionHead} aria-current={pathname === '/blog' ? 'page' : undefined}>
        <Icon name="newspaper" size={16} />
        <span>Blog</span>
      </Link>
      <nav aria-label="Blog posts" className={styles.sectionBody}>
        {postsByYear(items.filter((post) => !post.unlisted)).map(([year, posts]) => (
          <div key={year} className={styles.year}>
            <div className={styles.label}>{year}</div>
            <ul>
              {posts.map((post) => (
                <li key={post.permalink}>
                  <Link
                    to={post.permalink}
                    className={styles.post}
                    aria-current={pathname === post.permalink ? 'page' : undefined}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
