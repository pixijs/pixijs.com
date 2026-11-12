/**
 * The pane: the clip to play, the walk-run blend, keeping blended cycles in step, the speed, looping, a time to stop
 * at, the playback button, and how often the callbacks ran
 *
 * Each row calls an action from `index.ts`, so every engine call the lesson teaches stays there. This file keeps the
 * rows showing what the player does: the gotoAndStop slider follows the playhead, and the button stops, plays or
 * replays.
 */

import { CLIP_LABELS } from './clips';

/** The lesson's actions in `index.ts`, one per row that changes the player */

/** The pane's handle for `index.ts` */

/** The Clip row's options, each shown as its own name */
const CLIPS = Object.fromEntries(
  Object.keys(CLIP_LABELS).map((clip) => [clip, clip]),
);
/** The gotoAndStop row's place in the folder, where it's built again for each clip's duration */
const TIME_ROW = 5;
/** A read-only row that shows a count as a whole number */
const COUNT = { readonly: true, format: (count) => count.toFixed(0) };

export function createControls({ pane, mix, calls, player, lead, actions }) {
  /** The rows' own values: every state loops until the loop row says otherwise, and the lead state's time */
  const shown = { loop: true, time: 0 };
  /** Whether the picked clip ran out, so play() would complete it again at once */
  let replay = false;
  // A refresh that changes a row's value fires its change handler, so the time row ignores what update() writes.
  let syncing = false;

  const folder = pane.addFolder({ title: 'Playback' });

  folder
    .addBinding(mix, 'clip', { label: 'Clip', options: CLIPS })
    .on('change', ({ value }) => actions.crossfadeTo(value));
  const blendRow = folder.addBinding(mix, 'blend', {
    label: 'Blend',
    min: 0,
    max: 1,
  });
  const inStepRow = folder
    .addBinding(mix, 'inStep', { label: 'In step' })
    .on('change', ({ value }) => actions.setInStep(value));
  // Tweakpane counts steps from the starting value, 1; a step of 0.25, exact in floats, lands on 0 rather than 1e-17.
  folder.addBinding(mix, 'speed', {
    label: 'Speed',
    min: -2,
    max: 2,
    step: 0.25,
  });
  folder
    .addBinding(shown, 'loop', { label: 'loop' })
    .on('change', ({ value }) => actions.setLoop(value));
  const playback = folder.addButton({ title: playbackTitle() });
  let timeRow = addTimeRow();
  let timeState = lead();

  folder.addBinding(calls, 'onLoop', COUNT);
  folder.addBinding(calls, 'onComplete', COUNT);
  playback.on('click', () => {
    if (player.playing) actions.stop();
    else actions.playClip(replay);
  });

  function playbackTitle() {
    if (player.playing) return 'Stop';

    return replay ? 'Replay' : 'Play';
  }

  /** The gotoAndStop slider, 0 to the picked clip's duration: Tweakpane can't change a slider's range in place */
  function addTimeRow() {
    const max = lead().animation.duration;
    const row = folder.addBinding(shown, 'time', {
      label: 'gotoAndStop',
      min: 0,
      max,
      step: 0.01,
      index: TIME_ROW,
    });

    // A scrubbed clip stops part way, where play() carries on.
    return row.on('change', ({ value }) => {
      if (syncing) return;
      replay = false;
      actions.scrubTo(lead(), value);
    });
  }

  return {
    update() {
      const state = lead();
      const blending = mix.clip === 'Walk + Run';

      // A new clip, a replay or play() plays the picked clip again, which ends the offer.
      if (state.playing) replay = false;
      if (state !== timeState) {
        timeState = state;
        timeRow.dispose();
        timeRow = addTimeRow();
      }
      blendRow.disabled = inStepRow.disabled = !blending;
      timeRow.disabled = blending;

      const title = playbackTitle();

      if (playback.title !== title) playback.title = title;
      // Disabled for a blend, the slider holds still rather than follow the walk's time.
      if (blending) return;
      shown.time = state.time;
      syncing = true;
      timeRow.refresh();
      syncing = false;
    },
    offerReplay() {
      replay = true;
    },
  };
}
