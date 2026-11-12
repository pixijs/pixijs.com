import stylesheet from '!!raw-loader!sass-loader!./styles.scss';

/**
 * Docusaurus merges every CSS module into the one site-wide stylesheet, so the tutorial compiles its SCSS to a string
 * and inlines it on its pages (`Tutorial`), keeping it out of every other page's CSS
 */
export const STYLESHEET = stylesheet;

/** `styles.guide` → `px-tut-guide`, the prefixed class names in styles.scss */
const styles = new Proxy({} as Record<string, string>, { get: (_, name) => `px-tut-${String(name)}` });

export default styles;
