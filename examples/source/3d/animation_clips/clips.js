/**
 * The fox's clips: the labels Fox.glb names them by, how the pane offers them, the walk's and the run's colours, and
 * what the pane asks the player for
 *
 * Every clip name lives here, so a copy of this folder for another model starts with this file.
 */

import { CLAY } from './theme/palette';

/** What the pane can pick: the walk and the run blended, or one clip on its own */

/** The labels each of the pane's clips plays, as the file names them */
export const CLIP_LABELS = {
  'Walk + Run': ['Walk', 'Run'],
  Survey: ['Survey'],
  Walk: ['Walk'],
  Run: ['Run'],
};

/** The colour of each blended clip's ghost and its tag */
export const CLIP_COLORS = { Walk: CLAY.sky, Run: CLAY.purple };

/** What the pane asks the player for */

/** How often the picked clip's first state ran each callback since the clip was picked */
