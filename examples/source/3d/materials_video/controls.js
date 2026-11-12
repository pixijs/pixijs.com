/**
 * The pane: Play, Pause, Release video and Reload video, and a read-only Playback row for the clip's state
 *
 * Each button calls an action from `index.ts`, so every call the lesson teaches stays there. This file keeps each
 * button enabled only in the states where it does something.
 */

/** Whether Play, Pause, Release video and Reload video do something in each state */
const ENABLED = {
  Loading: [false, false, false, false],
  Playing: [false, true, true, false],
  Paused: [true, false, true, false],
  'Press Play': [true, false, true, false],
  Released: [false, false, false, true],
  'Load failed': [false, false, false, true],
};

export function createControls({
  pane,
  playback,
  play,
  pause,
  release,
  reload,
}) {
  const status = { playback };
  const buttons = ['Play', 'Pause', 'Release video', 'Reload video'].map(
    (title) => pane.addButton({ title }),
  );
  const [playButton, pauseButton, releaseButton, reloadButton] = buttons;

  pane.addBinding(status, 'playback', { label: 'Playback', readonly: true });

  function show(next) {
    status.playback = next;
    buttons.forEach((button, i) => (button.disabled = !ENABLED[next][i]));
    // A read-only row otherwise catches up on its own polling timer, after the buttons have changed.
    pane.refresh();
  }

  // Every button stays off until a press finishes, so a second press can't land on a clip that is still starting,
  // releasing or loading.
  async function run(action) {
    for (const button of buttons) button.disabled = true;
    show(await action());
  }

  async function playing(started) {
    return (await started) ? 'Playing' : 'Press Play';
  }

  playButton.on('click', () => void run(() => playing(play())));
  pauseButton.on('click', () => {
    pause();
    show('Paused');
  });
  releaseButton.on('click', () => {
    void run(async () => {
      await release();

      return 'Released';
    });
  });
  reloadButton.on('click', () => {
    show('Loading');
    void run(async () => {
      try {
        return await playing(reload());
      } catch (error) {
        console.error(error);

        return 'Load failed';
      }
    });
  });
  show(playback);
}
