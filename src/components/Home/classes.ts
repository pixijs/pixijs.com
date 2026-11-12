import stylesheet from '!!raw-loader!sass-loader!./styles.scss';
import { scoped } from './scoped';

/**
 * Docusaurus merges every CSS module into the one site-wide stylesheet, so the home sections compile their SCSS to a
 * string instead, which `HomePage` inlines on `/` and `/2d` only
 */
export const STYLESHEET = stylesheet;

/** `styles.band` → `hm-band`, the prefixed class names in the section partials */
const styles = scoped();

export default styles;
