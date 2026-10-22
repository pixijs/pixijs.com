import stylesheet from '!!raw-loader!sass-loader!./nebulon.scss';
import { scoped } from '../scoped';

/** The Nebulon hero's stylesheet (`hm-nebulon-*`), which `NebulonHero` inlines so it stays out of the site-wide CSS */
export const NEBULON_CSS = stylesheet;

export default scoped('nebulon');
