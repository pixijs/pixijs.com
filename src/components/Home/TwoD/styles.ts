import stylesheet from '!!raw-loader!sass-loader!./twoD.scss';
import { scoped } from '../scoped';

/** The `/2d` stylesheet (`hm-2d-*`, the tiles and the closing card), which the page inlines so it stays off `/` */
export const TWO_D_CSS = stylesheet;

export default scoped('2d');
