import stylesheet from '!!raw-loader!sass-loader!./styles.scss';
import { prefixedClasses } from '@site/src/css/classes';

/**
 * Docusaurus merges every CSS module into the one site-wide stylesheet, so the styleguide compiles its own SCSS to a
 * string instead and inlines it on its page (`Styleguide`), keeping it out of every other page's CSS.
 */
export const STYLESHEET = stylesheet;

/** `styles.band` → `sg-band`, the prefixed class names in styles.scss */
const styles = prefixedClasses('sg', { kebab: false });

export default styles;
