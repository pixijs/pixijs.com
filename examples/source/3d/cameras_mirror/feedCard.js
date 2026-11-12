/**
 * The feed card: `mirrorCamera`'s render texture, live, the right way up, before the glass turns it over
 *
 * It shows the band of the feed round the glass, where the reflection is. Shown whole, the feed is mostly sky, with
 * the logo too small to see `resolution` change it. It reads the scene each frame and never changes it.
 */

import { Rectangle, Texture } from 'pixi.js';

import { InsetView } from './theme/InsetView';

import { CARD, RIM } from './layout';

/** The band's height over the glass's on screen, a little more so the glass's edges show in it */
const BAND_HEIGHT = 1.2;

export function createFeedCard({ app, stage, layout, feed }) {
  // A frame of the feed's own source, so it shows the same live pixels; `frameBand` sets the frame.
  const band = new Texture({
    source: feed.source,
    frame: new Rectangle(0, 0, feed.width, feed.height),
    dynamic: true,
  });
  const inset = new InsetView({
    app,
    stage,
    texture: band,
    title: 'render texture',
    width: CARD.width,
    height: CARD.width / CARD.aspect,
    padding: RIM,
  });

  return {
    inset,
    frameBand() {
      // The glass's middle lands in the feed upside down: as far up it as it is down the screen.
      const { left, right, top, bottom } = layout.stand;
      const height = (bottom - top) * BAND_HEIGHT;
      const width = height * CARD.aspect;

      band.frame.set(
        (left + right - width) / 2,
        feed.height - (top + bottom + height) / 2,
        width,
        height,
      );
      band.update();
    },
  };
}
