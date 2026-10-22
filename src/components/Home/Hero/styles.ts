import stylesheet from '!!raw-loader!sass-loader!./hero.scss';
import { scoped } from '../scoped';

/** The hero's stylesheet (`hm-hero-*`), which `Hero` inlines so it stays out of the site-wide CSS */
export const HERO_CSS = stylesheet;

export default scoped('hero');
