import stylesheet from '!!raw-loader!sass-loader!./styles.scss';
import { prefixedClasses } from '@site/src/css/classes';

/** The blog's stylesheet, which BlogLayout inlines so the blog's CSS stays out of the site-wide file */
export const STYLESHEET = stylesheet;

/** `styles.coverHeadline` → `px-blog-cover-headline`, the prefixed class names in styles.scss */
const styles = prefixedClasses('px-blog');

export default styles;
