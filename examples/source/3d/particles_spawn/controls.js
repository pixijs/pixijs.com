/**
 * The pane: a `sparks` folder with the tap's `count`, a button for each call, the system's `playing` flag and the
 * `scrub` slider
 *
 * Each button runs `index.ts`'s call through `press`, and the slider holds the clock through `scrubTo`. A button, or a
 * tap on the floor, brings a held clock back to live first, since every call acts on the live system.
 */

/** The calls the buttons make; `index.ts` holds each one */

/** Each call's row: the plain word, and the call the button makes as its title */
const BUTTONS = [
  ['Stop', 'stop()', 'stop'],
  ['Play', 'play()', 'play'],
  ['Clear', 'clear()', 'clear'],
  ['Replay', 'gotoAndPlay(0)', 'replay'],
  ['Rewind', 'gotoAndStop(0)', 'rewind'],
];
/** How far back the scrub reaches, in seconds: more than one whole show, so there are always sparks to go back over */
const SCRUB_RANGE = 3;

export function createControls({ pane, sparks, tap, scrub, press, scrubTo }) {
  // Refreshing the scrub row fires its change event, which would otherwise hold the clock again.
  let syncing = false;
  const folder = pane.addFolder({ title: 'sparks' });

  folder.addBinding(tap, 'count', { min: 1, max: 120, step: 1 });
  for (const [label, title, call] of BUTTONS) {
    folder.addButton({ label, title }).on('click', () => {
      backToLive();
      press(call);
    });
  }
  folder.addBinding(sparks, 'playing', { readonly: true });

  const scrubRow = folder
    .addBinding(scrub, 'seconds', {
      label: 'scrub',
      min: -SCRUB_RANGE,
      max: 0,
      format: (value) => value.toFixed(2),
    })
    .on('change', ({ value }) => {
      if (!syncing) scrubTo(value);
    });

  function backToLive() {
    if (scrub.seconds === 0) return;
    scrubTo(0);
    syncing = true;
    scrubRow.refresh();
    syncing = false;
  }

  return { backToLive };
}
