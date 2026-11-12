import stylesheet from '!!raw-loader!sass-loader!./stage.scss';
import { scoped } from '../scoped';

/** The demo's stylesheet (`hm-stage-*`), which `StageDemo` inlines so it stays out of the site-wide CSS */
export const STAGE_CSS = stylesheet;

export default scoped('stage');
