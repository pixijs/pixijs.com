/**
 * The pane: the pass's colour, its depthTest, its stage, and whether each critter is in it
 *
 * Each row calls a function `index.ts` passes in, which makes the engine call.
 */

import { CRITTER_NAMES } from './scene';

export function createControls(options) {
  const {
    pane,
    xrayState,
    xrayBuild,
    members,
    rebuildXRay,
    setDepthTest,
    setMember,
  } = options;
  /** What the colour and stage rows show: a pass takes both only when it's built, so a change rebuilds it */
  const settings = { ...xrayBuild };

  pane
    .addBinding(settings, 'color', { view: 'color' })
    .on('change', ({ value, last }) => {
      // A picker drag sends a change a frame; building on the last one compiles one shader, not one per step.
      if (last) rebuildXRay({ color: value });
    });
  pane
    .addBinding(xrayState, 'depthTest')
    .on('change', ({ value }) => setDepthTest(value));
  pane
    .addBinding(settings, 'stage', {
      options: { beforeOpaque: 'beforeOpaque', afterOpaque: 'afterOpaque' },
    })
    .on('change', ({ value }) => rebuildXRay({ stage: value }));

  const folder = pane.addFolder({ title: "in 'xray'" });

  for (const name of CRITTER_NAMES) {
    folder
      .addBinding(members, name)
      .on('change', ({ value }) => setMember(name, value));
  }
}
