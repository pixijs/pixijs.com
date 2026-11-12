/**
 * The pane: the interpolation every track uses, play and stop, the time to scrub to, and the light's intensity
 *
 * Each row calls a function from `index.ts`, so every engine call the lesson teaches stays there. This file keeps the
 * rows showing what the player does.
 */

import { INTERPOLATIONS } from './keyframes';

/** The interpolation row's options, each shown as its own name */
const OPTIONS = Object.fromEntries(INTERPOLATIONS.map((mode) => [mode, mode]));

export function createControls(options) {
  const {
    pane,
    interpolation,
    duration,
    flash,
    onInterpolation,
    onPlay,
    onScrub,
  } = options;
  // What the rows show; sync writes the playback's own values in before the first frame.
  const params = { interpolation, play: true, time: 0 };
  // A refresh fires the row's change handler too, so the handlers ignore what sync writes.
  let syncing = false;

  pane
    .addBinding(params, 'interpolation', { options: OPTIONS })
    .on('change', ({ value }) => onInterpolation(value));

  // Plain words, since `playing` is a getter: the row calls play() and stop().
  const playRow = pane.addBinding(params, 'play', { label: 'Play' });
  const timeRow = pane.addBinding(params, 'time', {
    min: 0,
    max: duration,
    step: 0.01,
  });

  playRow.on('change', ({ value }) => {
    if (!syncing) onPlay(value);
  });
  timeRow.on('change', ({ value }) => {
    if (!syncing) onScrub(value);
  });
  pane.addBinding(flash, 'intensity', {
    readonly: true,
    format: (v) => v.toFixed(1),
  });

  /** Shows a row's new value without its change handler taking it for the reader's */
  function refresh(row) {
    syncing = true;
    row.refresh();
    syncing = false;
  }

  return {
    sync(playback) {
      // The slider's own step, so a stopped playhead holds the row still.
      const time = Math.round(playback.time * 100) / 100;

      if (playback.playing !== params.play) {
        params.play = playback.playing;
        refresh(playRow);
      }
      if (time !== params.time) {
        params.time = time;
        refresh(timeRow);
      }
    },
  };
}
