/**
 * What the frame draws to explain the portal: the whole feed, `portal.texture`, in a card at the bottom right
 *
 * Beside the opening, the card shows the full picture the portal camera draws, so the opening reads as the part of it
 * that falls on the doorway's place on screen. It reads the scene each frame and never changes it, so `index.ts` runs
 * the same without it.
 */

import { FlatMaterial, Mesh3D, PlaneGeometry } from '@pixi/3d';

import { InsetView } from './theme/InsetView';

/** The card's picture width in px: a share of the screen's, so it stays clear of the doorway as the screen narrows */
const CARD_WIDTH = { share: 0.22, max: 256 };

export function createVisuals({ app, stage, feed }) {
  // The feed on a plane in a small view of its own, not a texture card: a texture that pixi's 2D batcher draws as well
  // as a 3D material can take the wrong slot in that material's draw, and the opening comes out black.
  const card = new InsetView({
    app,
    stage,
    corner: 'bottom-right',
    narrow: { corner: 'bottom-right' },
    mode: 'orthographic',
    title: 'feed',
  });
  // An inset with neither a view3d nor a texture always has a camera and a root of its own.
  const camera = card.camera;
  const picture = new Mesh3D({
    geometry: new PlaneGeometry({ width: 1, height: 1, flipV: true }),
    material: new FlatMaterial({ baseColorTexture: feed }),
    parent: card.root,
  });

  camera.position.z = 1;

  /** The feed has the screen's size, so the card takes the screen's shape */
  function layout() {
    const { width, height } = app.screen;
    const aspect = width / height;
    const cardWidth = Math.min(
      CARD_WIDTH.max,
      Math.round(width * CARD_WIDTH.share),
    );

    // One unit tall and as wide as the feed, framed edge to edge by an orthographic camera half its width across.
    picture.scale.x = aspect;
    camera.orthographicSize = aspect / 2;
    card.setSize(cardWidth, Math.round(cardWidth / aspect));
  }

  layout();
  app.renderer.on('resize', layout);
  app.stage.addChild(card);

  return {
    update(dt) {
      card.update(dt);
    },
  };
}
