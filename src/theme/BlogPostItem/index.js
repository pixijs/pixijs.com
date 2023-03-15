import clsx from 'clsx';
import { useBlogPost } from '@docusaurus/theme-common/internal';
import BlogPostItemContainer from '@theme/BlogPostItem/Container';
import BlogPostItemHeader from '@theme/BlogPostItem/Header';
import BlogPostItemContent from '@theme/BlogPostItem/Content';
import BlogPostItemFooter from '@theme/BlogPostItem/Footer';
import styles from './index.module.scss';

// apply a bottom margin in list view
function useContainerClassName()
{
  const { isBlogPostPage } = useBlogPost();

  return !isBlogPostPage ? 'margin-bottom--md' : undefined;
}

// TODO: add prop-types and/or convert to TS!
// eslint-disable-next-line react/prop-types
export default function BlogPostItem({ children, className })
{
  const containerClassName = useContainerClassName();

  return (
    <BlogPostItemContainer
      className={clsx(containerClassName, className, styles.card)}
    >
      <BlogPostItemHeader />
      <BlogPostItemContent>{children}</BlogPostItemContent>
      <BlogPostItemFooter />
    </BlogPostItemContainer>
  );
}
