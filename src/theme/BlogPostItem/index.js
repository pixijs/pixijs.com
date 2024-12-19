import clsx from 'clsx';
import styles from './index.module.scss';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import BlogPostItemContainer from '@theme/BlogPostItem/Container';
import BlogPostItemContent from '@theme/BlogPostItem/Content';
import BlogPostItemFooter from '@theme/BlogPostItem/Footer';
import BlogPostItemHeader from '@theme/BlogPostItem/Header';

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
        <BlogPostItemContainer className={clsx(containerClassName, className, styles.card)}>
            <BlogPostItemHeader />
            <BlogPostItemContent>{children}</BlogPostItemContent>
            <BlogPostItemFooter />
        </BlogPostItemContainer>
    );
}
