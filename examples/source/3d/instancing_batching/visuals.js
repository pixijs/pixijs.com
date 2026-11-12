/**
 * What the frame draws to explain culling: the scout's frustum and footprint, a dot under every piece, and the
 * scout's own picture
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { FrustumHelper } from './theme/FrustumHelper';
import { InsetView } from './theme/InsetView';
import { LabelLayer } from './theme/LabelLayer';
import { PointsHelper } from './theme/PointsHelper';

import { MAX_COUNT } from './scene';

/** The length of the scout's camera body, behind its eye */
const BODY_LENGTH = 0.8;

export function createVisuals(options) {
  const { app, view3d, stage, field, scout, scoutTexture } = options;
  // The screen, since on an upright one the view reaches past it to centre the disc between the pane and the inset.
  const labels = new LabelLayer({ view3d, stage, bounds: app.screen });
  const frustum = new FrustumHelper({
    camera: scout,
    floor: 0,
    length: 10,
    fill: 0.1,
    size: BODY_LENGTH,
    thickness: 0.05,
    color: 'accent',
    parent: view3d.root,
  });
  // A dot on the floor under every piece: a piece the view draws hides its own, a culled one leaves it showing.
  const dots = new PointsHelper({
    positions: new Float32Array(MAX_COUNT * 3),
    radius: 0.035,
    opacity: 0.5,
    parent: view3d.root,
  });
  // The scout's picture is always the whole field: culling skips only what a camera can't see.
  const inset = new InsetView({
    app,
    stage,
    texture: scoutTexture,
    title: 'what the scout sees',
    corner: 'bottom-right',
    width: scoutTexture.width,
    height: scoutTexture.height,
  });
  let placed = -1;

  // On the back of the scout's body, the side away from its frustum, and lifted clear of the body.
  labels.add({
    text: 'scout',
    node: frustum,
    at: { x: 0, y: 0, z: BODY_LENGTH },
    offset: { x: 0, y: -26 },
  });
  app.stage.addChild(labels, inset);

  function placeDots() {
    const positions = dots.positions;

    for (let i = 0; i < field.length; i++) {
      positions[i * 3] = field[i].position.x;
      positions[i * 3 + 1] = 0.01;
      positions[i * 3 + 2] = field[i].position.z;
    }
    dots.count = placed = field.length;
    dots.update();
  }

  return {
    update(dt) {
      if (field.length !== placed) placeDots();
      // Quiet while the main view isn't culling against the scout.
      frustum.muted =
        view3d.cull === 'off' || view3d.camera.cullFrustum !== scout.frustum;
      frustum.update();
      inset.update(dt);
      labels.update();
    },
  };
}
