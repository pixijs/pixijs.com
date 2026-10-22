import Cover from './Cover';
import styles from './classes';
import Card from '@site/src/components/ui/Card';
import Icon from '@site/src/components/ui/Icon';

import type { PropBlogPostContent } from '@docusaurus/plugin-content-blog';

/** What a card needs from a post: the MDX module's exports apart from its content */
export type PostCardData = Pick<PropBlogPostContent, 'metadata' | 'frontMatter' | 'assets'>;

const DATE = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** `June 12, 2026 · 9 min read` */
export function PostMeta({ metadata: { date, readingTime } }: Pick<PostCardData, 'metadata'>) {
  return (
    <>
      <time dateTime={date}>{DATE.format(new Date(date))}</time>
      {readingTime !== undefined && ` · ${Math.ceil(readingTime)} min read`}
    </>
  );
}

/** A post in a list (blog index, tag and author pages): one link card with its cover, date, title and summary */
export default function PostCard({ post }: { post: PostCardData }) {
  const { permalink, title, description, authors } = post.metadata;

  return (
    <article className={styles.item}>
      <Card variant="link" to={permalink} media={<Cover {...post} />} className={styles.card}>
        <p className={styles.meta}>
          <PostMeta metadata={post.metadata} />
        </p>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.summary}>{description}</p>
        <p className={styles.by}>
          <span className={styles.faces}>
            {authors.map(
              (author) =>
                author.imageURL && (
                  <img key={author.imageURL} src={author.imageURL} alt="" width={24} height={24} loading="lazy" />
                ),
            )}
          </span>
          <span className={styles.names}>{authors.map((author) => author.name).join(' & ')}</span>
          <Icon name="arrow-right" size={16} className={styles.go} />
        </p>
      </Card>
    </article>
  );
}
