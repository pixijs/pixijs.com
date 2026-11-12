import Link from '@docusaurus/Link';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import AuthorSocials from '@theme/Blog/Components/Author/Socials';
import BlogPostItemContent from '@theme/BlogPostItem/Content';
import PostCard, { PostMeta } from '@site/src/components/Blog/PostCard';
import { EyebrowLabel } from '@site/src/shell/Eyebrow';
import styles from '@site/src/components/Blog/classes';

import type { Props } from '@theme/BlogPostItem';

/** The post page: eyebrow, title and authors over the prose (`src/css/docs.scss`), tags below */
function Post({ children }: Props) {
  const { metadata } = useBlogPost();
  const { title, authors, tags } = metadata;

  return (
    <article className={styles.post}>
      <header className={styles.head}>
        <EyebrowLabel>
          <span>
            <PostMeta metadata={metadata} />
          </span>
        </EyebrowLabel>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.authors}>
          {authors.map((author) => (
            <div key={author.key ?? author.name} className={styles.author}>
              {author.imageURL && <img src={author.imageURL} alt="" width={40} height={40} />}
              <div>
                <Link to={author.url} className={styles.name}>
                  {author.name}
                </Link>
                {author.title && <span className={styles.role}>{author.title}</span>}
              </div>
              <AuthorSocials author={author} />
            </div>
          ))}
        </div>
      </header>
      <BlogPostItemContent>{children}</BlogPostItemContent>
      {tags.length > 0 && (
        <footer className={styles.tags}>
          {tags.map((tag) => (
            <Link key={tag.permalink} to={tag.permalink} rel="tag">
              {tag.label}
            </Link>
          ))}
        </footer>
      )}
    </article>
  );
}

/** Rewritten (theme-classic 3.10.2): a compact card in lists (tag and author pages), the full article on its own page */
export default function BlogPostItem({ children }: Props) {
  const post = useBlogPost();

  return post.isBlogPostPage ? <Post>{children}</Post> : <PostCard post={post} />;
}
