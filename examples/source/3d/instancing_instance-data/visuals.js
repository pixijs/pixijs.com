/**
 * What the frame draws to explain per-instance data: one slot, the probe, with a ghost where its matrix holds it and
 * an arrow for the lift the bit gives it on the GPU
 *
 * It reads the probe's row and the wave's phase each frame and never writes them, so `index.ts` runs the same without
 * it.
 */

import { Mesh3D, Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { ArrowHelper } from './theme/ArrowHelper';
import { ghostMaterial, HEAD_LENGTH } from './theme/helpers';
import { LabelLayer } from './theme/LabelLayer';
import { clayGeometry } from './theme/shapes';

import { CUBE_SCALE, slotPosition, waveHeight } from './scene';
import { waveLift } from './waveBit';

/** The middle of the front row, clear in front of every other cube */
const PROBE_SLOT = 78;
/** The ghost sits a hair outside the cube, so the cube's faces never fight it as they pass through */
const GHOST_GROWTH = 1.06;
/** How far in front of the cube's face the arrow runs */
const ARROW_GAP = 0.08;
const ARROW_THICKNESS = 0.04;
/** The shortest lift the arrow draws, one full head's length: any shorter and its head flattens into a disc on the cube */
const MIN_ARROW = ARROW_THICKNESS * HEAD_LENGTH;
/**
 * Where on the ghost's front face the `matrix` tag points, as a share of its half-width down and left of the centre:
 * on the flat face, since the clay cube rolls its edges and its corner is empty space
 */
const MATRIX_POINT = 0.5;
/** px under the probe's deepest trough to the two tags, and from the centre line to each tag's inner end */
const TAG_DROP = 18;
const TAG_GAP = 20;

export function createVisuals({ app, view3d, stage, field, motion }) {
  const rest = slotPosition(PROBE_SLOT, new Vector3());
  const cube = clayGeometry('cube', 'low');
  // The cube's half-width in the field, from the kit's bounds, so the ghost and arrow follow any change to its size.
  const half = cube.bounds3D.max.x * CUBE_SCALE;
  const ghostHalf = half * GHOST_GROWTH;

  // Where the matrix holds the probe, which never moves.
  new Mesh3D({
    geometry: cube,
    material: ghostMaterial(),
    castShadow: false,
    position: rest,
    scale: CUBE_SCALE * GHOST_GROWTH,
    parent: view3d.root,
  });
  const arrow = new ArrowHelper({
    thickness: ARROW_THICKNESS,
    parent: view3d.root,
  });
  const arrowFrom = new Vector3(rest.x, rest.y, rest.z + half + ARROW_GAP);
  const arrowTo = new Vector3();
  const labels = new LabelLayer({ view3d, stage });
  const matrixTag = labels.add({
    text: 'matrix',
    at: {
      x: rest.x - ghostHalf * MATRIX_POINT,
      y: rest.y - ghostHalf * MATRIX_POINT,
      z: rest.z + ghostHalf,
    },
    anchor: { x: 1, y: 0.5 },
    leader: true,
  });
  const liftTag = labels.add({
    text: 'lift',
    at: arrowFrom,
    anchor: { x: 0, y: 0.5 },
    leader: true,
  });
  // The front bottom edge of the cube at its lowest; the wave's height at the probe is the same for every pattern.
  const trough = new Vector3(
    rest.x,
    rest.y - waveHeight(rest.x, rest.z) - half,
    rest.z + half,
  );
  /** Screen points, reused each frame */
  const troughPx = new Point();
  const pointPx = new Point();

  app.stage.addChild(labels);

  /** Lines both tags up under the deepest trough, either side of the centre line, so they clear the cube at any zoom */
  function hangTags() {
    if (!view3d.worldToScreen(trough, troughPx)) return;
    if (view3d.worldToScreen(matrixTag.at, pointPx)) {
      matrixTag.offset.set(
        troughPx.x - TAG_GAP - pointPx.x,
        troughPx.y + TAG_DROP - pointPx.y,
      );
    }
    if (view3d.worldToScreen(liftTag.at, pointPx)) {
      liftTag.offset.set(
        troughPx.x + TAG_GAP - pointPx.x,
        troughPx.y + TAG_DROP - pointPx.y,
      );
    }
  }

  return {
    update() {
      const { data, offset, stride, fields } = field.instanceData;
      const at = offset + PROBE_SLOT * stride + fields.wave;
      const lift = waveLift(motion.phase, data[at], data[at + 1]);

      arrow.visible = Math.abs(lift) >= MIN_ARROW;
      arrow.set(
        arrowFrom,
        arrowTo.set(arrowFrom.x, rest.y + lift, arrowFrom.z),
      );
      hangTags();
      labels.update();
    },
  };
}
