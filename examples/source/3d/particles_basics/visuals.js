/**
 * What the frame draws to explain the particle system: the emitter's shape on the tube, and one spark's path with and
 * without drag under the gravity that bends it
 *
 * It reads the system each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Vector3 } from '@pixi/3d';

import { Rectangle } from 'pixi.js';

import { LabelLayer } from './theme/LabelLayer';
import { NARROW_BELOW } from './theme/overlay';

import { EmitterShapeHelper } from './EmitterShapeHelper';

import { createSparkDiagram } from './sparkDiagram';

/** Px from the outline's rim to the shape's label: down and left, clear of the tube and away from the paths */
const SHAPE_TAG_OFFSET = { x: -34, y: 40 };
/** The band a phone's folded pane covers along the top of the screen, in px, which the labels keep under */
const PANE_BAR = 40;

/** The camera's side of the emitter, flat on the floor, its right, the line the drawn paths lie along, and its left */
const _toward = new Vector3(0, 0, 1);
const _right = new Vector3(1, 0, 0);
const _left = new Vector3(-1, 0, 0);

export function createVisuals({
  app,
  view3d,
  stage,
  sparks,
  tube,
  sparkOptions,
}) {
  // The screen, since fitPortrait grows the view past it on a phone, less the pane's bar there; update() sets it.
  const bounds = new Rectangle();
  const labels = new LabelLayer({ view3d, stage, bounds });
  // As the system's child, the outline sits at the emitter and turns with it, as its shape does.
  const outline = new EmitterShapeHelper({
    shape: sparks.shape,
    parent: sparks,
  });
  const diagram = createSparkDiagram({
    view3d,
    labels,
    sparks,
    tube,
    life: meanOf(sparkOptions.life),
    speed: meanOf(sparkOptions.speed),
  });
  // Its leader runs from the outline's rim, so it names the wireframe and not the tube under it.
  const shapeTag = labels.add({
    text: 'emitter shape',
    node: outline,
    anchor: { x: 1, y: 0.5 },
    offset: SHAPE_TAG_OFFSET,
    leader: true,
  });

  app.stage.addChild(labels);

  return {
    update() {
      const camera = view3d.camera.position;
      const emitter = sparks.position;
      const across = Math.hypot(camera.x - emitter.x, camera.z - emitter.z);

      if (across > 1e-6) {
        _toward.set(
          (camera.x - emitter.x) / across,
          0,
          (camera.z - emitter.z) / across,
        );
        _right.set(_toward.z, 0, -_toward.x);
        _left.copyFrom(_right).multiplyScalar(-1);
      }
      bounds.copyFrom(app.screen);
      if (app.screen.width < NARROW_BELOW) {
        bounds.y = PANE_BAR;
        bounds.height -= PANE_BAR;
      }
      outline.shape = sparks.shape;
      diagram.update(_right);
      outline.rim(_left, shapeTag.at);
      labels.update();
    },
  };
}

/** The value an average spark gets from a spread: the number itself, or the middle of a `[min, max]` pair */
function meanOf(spread) {
  return typeof spread === 'number' ? spread : (spread[0] + spread[1]) / 2;
}
