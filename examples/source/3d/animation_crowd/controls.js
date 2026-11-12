/**
 * The pane: the crowd's size, start times and fur colour, with the herd's draw calls read out; the front fox's clip
 * and speed; and which rigs show
 *
 * The fur colour binds straight to the shared material, and Bones only sets a value `visuals.ts` reads. Every other
 * row you can change calls a function from `index.ts`, so the engine calls the lesson makes stay there. Draws and
 * Shadow draws are read-only and measured: a `RenderGraphDebugger` capture counts the draws that bind the fox's
 * geometry, in the view's passes and the shadow pass, once the herd has been drawn at its new size.
 */

import { RenderGraphDebugger } from '@pixi/3d/extras';

import { MAX_FOXES } from './scene';

/** The pane's values */

/** The pane's value column in px: as wide as it can be with `animationSpeed` whole in the name column */
const VALUE_WIDTH = 140;
/**
 * Updates from a size change to its count: the next frame draws the new herd, and the update after reads that frame,
 * since a capture reads the frame drawn last. A capture allocates, so it runs once per change rather than every frame.
 */
const COUNT_DELAY = 2;

const START_OPTIONS = { scattered: 'scattered', 'all at 0': 'all at 0' };
const CLIP_OPTIONS = { Survey: 'Survey', Walk: 'Walk', Run: 'Run' };
const BONES_OPTIONS = {
  'every fox': 'every fox',
  'front fox': 'front fox',
  none: 'none',
};
/** A read-only row that shows a count */
const COUNT_ROW = { readonly: true, format: (value) => value.toFixed(0) };

export function createControls(options) {
  const { pane, view3d, source, settings, fur } = options;
  const debug = new RenderGraphDebugger({ view: view3d });
  const foxGeometry = source.geometries[0][0].uid;
  const draws = { view: 0, shadow: 0 };
  // index.ts calls update() once after drawing the first frame, which counts that frame.
  let countIn = 1;

  // A narrower value column than Tweakpane's 160 px leaves the names room for `animationSpeed` on one line.
  pane.element.style.setProperty('--tp-blade-value-width', `${VALUE_WIDTH}px`);

  const crowd = pane.addFolder({ title: 'Every fox' });
  const front = pane.addFolder({ title: 'Front fox' });

  crowd
    .addBinding(settings, 'crowdSize', {
      label: 'Foxes',
      min: 1,
      max: MAX_FOXES,
      step: 1,
    })
    .on('change', ({ value }) => {
      options.setCrowdSize(value);
      countIn = COUNT_DELAY;
    });
  crowd.addBinding(draws, 'view', { label: 'Draws', ...COUNT_ROW });
  crowd.addBinding(draws, 'shadow', { label: 'Shadow draws', ...COUNT_ROW });
  crowd
    .addBinding(settings, 'startTimes', {
      label: 'Start times',
      options: START_OPTIONS,
    })
    .on('change', () => options.restartClips());
  // One material for every fox, so one row tints the whole herd; baseColor multiplies the fur texture.
  crowd.addBinding(fur, 'baseColor', { view: 'color' });
  front
    .addBinding(settings, 'clip', { label: 'Clip', options: CLIP_OPTIONS })
    .on('change', ({ value }) => options.playClip(value));
  // A step exact in floats, so the slider lands on 0 itself rather than a hair off it.
  front
    .addBinding(settings, 'speed', {
      label: 'animationSpeed',
      min: -2,
      max: 2,
      step: 0.25,
    })
    .on('change', ({ value }) => options.setFrontSpeed(value));
  pane.addBinding(settings, 'bones', {
    label: 'Bones',
    options: BONES_OPTIONS,
  });

  /** Counts the draws that bind the fox's geometry in the frame drawn last */
  function countDraws() {
    const frame = debug.capture();

    if (!frame) return;
    draws.view = 0;
    draws.shadow = 0;
    for (const batch of frame.batches) {
      for (const pass of batch.passes) {
        for (const draw of pass.draws) {
          if (!draw.geometryIds.includes(foxGeometry)) continue;
          if (pass.name === 'shadow') draws.shadow++;
          else draws.view++;
        }
      }
    }
  }

  return {
    update() {
      if (countIn > 0 && --countIn === 0) countDraws();
    },
  };
}
