/**
 * What the frame draws to explain transparency: an outline round each flat card the wordmark is cut from, and a tag
 * under each naming the face it shows the camera
 *
 * The outline marks each card's edge, which `'mask'` and `'blend'` cut away and `'opaque'` draws black, where it sinks
 * into the dark theme's night. The tags find the card that turns its back to the camera, the one `doubleSided: false`
 * culls. It reads the cards' material and the camera each frame and never changes the scene, so `index.ts` runs the
 * same without it.
 */

import { Vector3 } from '@pixi/3d';

import { LabelLayer } from './theme/LabelLayer';
import { PathHelper } from './theme/PathHelper';

import { CARD_HEIGHT, CARD_WIDTH } from './scene';

/** The outline's width, and a wider one on a phone, where the cards draw small enough to thin it under a pixel */
const OUTLINE = 0.015;
const PHONE_OUTLINE = 0.025;
/** A screen whose shorter side is under this many px is a phone's */
const PHONE_BELOW = 600;
/** Half a card's width and height */
const HALF_W = CARD_WIDTH / 2;
const HALF_H = CARD_HEIGHT / 2;
/** A card's corners in its own space, in the order the closed outline joins them */
const CARD_CORNERS = new Float32Array([
  -HALF_W,
  -HALF_H,
  0,
  HALF_W,
  -HALF_H,
  0,
  HALF_W,
  HALF_H,
  0,
  -HALF_W,
  HALF_H,
  0,
]);
/** Where a face tag pins: the middle of its card's lower edge, hanging below it */
const TAG_AT = { x: 0, y: -HALF_H, z: 0 };
const TAG_ANCHOR = { x: 0.5, y: 0 };
const TAG_OFFSET = { x: 0, y: 14 };
/** What a face tag says for the face of its card the camera sees; a culled back takes a line of its own */
const FACE_TEXTS = {
  front: 'front face',
  back: 'back face',
  culled: 'back face\nculled',
};
/**
 * A tag hides while the camera sees its card more than 60 degrees off face-on, as that angle's cosine: there the face
 * hardly shows, and seen along the row the far card's tag would land on the near card. The opening view is at most
 * about 34 degrees off either card's face, so both tags show there.
 */
const EDGE_ON = 0.5;

export function createVisuals({ app, view3d, stage, cards }) {
  const labels = new LabelLayer({ view3d, stage });
  const outlines = [cards.front, cards.back].map((card) => {
    // As the card's child, the outline sways with it.
    const outline = new PathHelper({ closed: true, parent: card });

    outline.setPoints(CARD_CORNERS);

    return outline;
  });
  const tag = (card) =>
    labels.add({
      text: FACE_TEXTS.front,
      node: card,
      at: TAG_AT,
      anchor: TAG_ANCHOR,
      offset: TAG_OFFSET,
    });
  const frontTag = tag(cards.front);
  const backTag = tag(cards.back);
  const eye = new Vector3();
  const eyeOnCard = new Vector3();

  app.stage.addChild(labels);

  /**
   * Names the face of a card the camera sees: the front when the camera is in front of it, along the card's own +z,
   * and the back, culled or not, when it's behind
   */
  function showFace(faceTag, card, doubleSided) {
    const { x, y, z } = card.toLocal(eye, undefined, eyeOnCard);

    faceTag.hidden = Math.abs(z) < EDGE_ON * Math.hypot(x, y, z);
    faceTag.text =
      z > 0
        ? FACE_TEXTS.front
        : doubleSided
          ? FACE_TEXTS.back
          : FACE_TEXTS.culled;
  }

  return {
    update() {
      const { doubleSided } = cards.front.material;
      const thickness =
        Math.min(app.screen.width, app.screen.height) < PHONE_BELOW
          ? PHONE_OUTLINE
          : OUTLINE;

      for (const outline of outlines) outline.thickness = thickness;
      view3d.camera.getGlobalPosition(eye);
      showFace(frontTag, cards.front, doubleSided);
      showFace(backTag, cards.back, doubleSided);
      labels.update();
    },
  };
}
