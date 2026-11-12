/** The pane: split screen, where the security camera stands, how many texels its feed has, whether its pass runs */

import { NARROW_BELOW } from './theme/overlay';

/** The feed sizes the pane offers, as fractions of the size it starts at, so each keeps the screen's shape */
const FEED_FRACTIONS = [1, 1 / 2, 1 / 4, 1 / 8];

export function createControls(options) {
  const {
    pane,
    securityCamera,
    feed,
    feedPass,
    post,
    setSplitScreen,
    resizeFeed,
  } = options;
  const { width, height } = feed;
  const sizes = {};
  const settings = { splitScreen: false, size: 1 };
  const standPost = () => post.standUnder(securityCamera.position);

  for (const fraction of FEED_FRACTIONS)
    sizes[`${width * fraction} × ${height * fraction}`] = fraction;
  pane
    .addBinding(settings, 'splitScreen', { label: 'split screen' })
    .on('change', ({ value }) => {
      setSplitScreen(value);
      // On a phone either way up the open pane covers much of a half, so it folds once the split is on.
      if (
        value &&
        Math.min(window.innerWidth, window.innerHeight) < NARROW_BELOW
      )
        pane.expanded = false;
    });
  // Wide enough to see the footprint shift and grow, and narrow enough that its far corner stays on screen.
  pane
    .addBinding(securityCamera.position, 'x', {
      label: 'position.x',
      min: -1.3,
      max: -0.5,
      step: 0.01,
    })
    .on('change', standPost);
  pane
    .addBinding(securityCamera.position, 'y', {
      label: 'position.y',
      min: 3.4,
      max: 4,
      step: 0.01,
    })
    .on('change', standPost);

  const resize = pane
    .addBinding(settings, 'size', { label: 'feed size', options: sizes })
    .on('change', ({ value }) => resizeFeed(width * value, height * value));

  // A resized texture starts blank, and with the pass off nothing would draw into it, so the monitor would go black.
  // The size waits until the pass runs again.
  pane
    .addBinding(feedPass, 'enabled', { label: 'feedPass' })
    .on('change', ({ value }) => {
      resize.disabled = !value;
    });
}
