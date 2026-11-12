import stylesheet from '!!raw-loader!sass-loader!./threeD.scss';
import { scoped } from '../scoped';

/** The `/3d` stylesheet (`hm-3d-*`, the bands, tiles, install strip and closing card), which `ThreeDHome` inlines */
export const THREE_D_CSS = stylesheet;

export default scoped('3d');
