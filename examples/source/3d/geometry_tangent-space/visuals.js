/**
 * What the frame draws to explain tangent space: the light's direction, and each tile's T, B and N
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { ArrowHelper } from './theme/ArrowHelper';
import { LabelLayer } from './theme/LabelLayer';
import { LightHelper } from './theme/LightHelper';

import { BACKING_SIZE } from './scene';

/** The right tile's tangents: correct, with w reversed, or none */

const FRAME_LENGTH = 0.5;
/** Between an upright B's tip and the tile's backing, so B never touches the tile it describes */
const FRAME_GAP = 0.1;
/** Each tile's frame sits under it, an upright B's length and the gap below the backing */
const FRAME_ORIGIN = {
  x: 0,
  y: -(BACKING_SIZE / 2 + FRAME_GAP + FRAME_LENGTH),
  z: 0.08,
};
/** N points almost at the camera, so it's drawn longer than T and B to show at all */
const NORMAL_LENGTH = 0.65;
/** Between the tiles and above them, where the light's ray crosses nothing */
const LIGHT_RAY_END = { x: 0.3, y: 3.4, z: 0 };
const TILE_TITLES = {
  correct: 'correct w',
  wrong: 'wrong w',
  derived: 'no tangents',
};

export function createVisuals({
  app,
  view3d,
  stage,
  left,
  right,
  light,
  settings,
}) {
  const labels = new LabelLayer({ view3d, stage, bounds: app.screen });

  // One ray along the light's own beam, read from its rotation each update.
  const lightRay = new LightHelper({
    light,
    rays: 1,
    target: LIGHT_RAY_END,
    gap: 0,
    length: 0.65,
    thickness: 0.025,
    parent: view3d.root,
  });
  const lightLabel = labels.add({ text: 'light', offset: { x: 0, y: -14 } });

  labels.add({
    text: TILE_TITLES.correct,
    node: left,
    at: { x: 0, y: 1.45, z: 0 },
  });
  const rightTitle = labels.add({
    text: '',
    node: right,
    at: { x: 0, y: 1.45, z: 0 },
  });

  const tangentTip = { x: 0, y: FRAME_ORIGIN.y, z: FRAME_ORIGIN.z };
  const bitangentTip = { x: 0, y: 0, z: FRAME_ORIGIN.z };
  const normalTip = {
    x: 0,
    y: FRAME_ORIGIN.y,
    z: FRAME_ORIGIN.z + NORMAL_LENGTH,
  };
  const frames = [left, right].map((parent, i) => {
    const t = new ArrowHelper({ parent, color: 'x', thickness: 0.022 });
    const b = new ArrowHelper({ parent, color: 'y', thickness: 0.022 });

    new ArrowHelper({ parent, color: 'z', thickness: 0.022 }).set(
      FRAME_ORIGIN,
      normalTip,
    );
    // Seen from between the tiles, each N leans toward its own screen edge, so its label goes that way, clear of B.
    labels.add({
      text: 'N',
      node: parent,
      at: normalTip,
      color: 'z',
      offset: { x: i === 0 ? -16 : 16, y: 10 },
    });

    // T and B labels sit just past their arrows' tips, which the pane can flip.
    const tLabel = labels.add({ text: 'T', node: parent, color: 'x' });
    const bLabel = labels.add({ text: 'B', node: parent, color: 'y' });

    return { t, b, tLabel, bLabel };
  });

  app.stage.addChild(labels);

  return {
    update() {
      lightLabel.at.copyFrom(lightRay.update().tail);

      // T follows u, so it points left on mirrored UVs. B points up the tile unless w is wrong.
      const sign = settings.mirror ? -1 : 1;

      tangentTip.x = sign * FRAME_LENGTH;
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const flipped = i === 1 && settings.mode === 'wrong';

        bitangentTip.y =
          FRAME_ORIGIN.y + (flipped ? -FRAME_LENGTH : FRAME_LENGTH);
        frame.t.set(FRAME_ORIGIN, tangentTip);
        frame.b.set(FRAME_ORIGIN, bitangentTip);
        frame.tLabel.at.copyFrom(tangentTip);
        frame.tLabel.offset.set(sign * 16, 0);
        frame.bLabel.at.copyFrom(bitangentTip);
        // Below a flipped B. Beside an upright one, and hung below its tip, so the tag stays off the backing.
        frame.bLabel.offset.set(flipped ? 0 : 17, flipped ? 16 : 10);
      }
      rightTitle.text = TILE_TITLES[settings.mode];
      rightTitle.color = settings.mode === 'wrong' ? 'accent' : null;
      labels.update();
    },
  };
}
