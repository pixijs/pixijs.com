/**
 * What the frame draws to explain flat shading: a ring of normals round the ball's outline that turn between blended
 * and one per face, with a tag naming them
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it. The ring is a slice
 * through the ball in the plane facing the camera, so every hair is seen side on; once the camera settles somewhere
 * new, the ball is sliced again.
 */

import { Vector3 } from '@pixi/3d';

import { LabelLayer } from './theme/LabelLayer';
import { NormalsHelper } from './theme/NormalsHelper';

import { createRingSlice, HAIR_COUNT, sliceRing, TOP_HAIR } from './slice';

/** Scene units: long enough that each hair's lean reads, short enough that the ring stays clear of the shapes */
const HAIR_LENGTH = 0.38;
/** About 1.7 CSS px across at the landscape distance */
const HAIR_THICKNESS = 0.014;
/** Seconds the hairs take to turn from one kind of normal to the other */
const TURN_SECONDS = 0.4;
/** Seconds the camera holds still before a new slice: at detail 3 a slice tests 37 × 1,280 triangles */
const SETTLE_SECONDS = 0.2;
/** A settled camera more than 2° round from the last slice gets a new one */
const RESLICE_COS = Math.cos((2 * Math.PI) / 180);
/** A turn under 0.05° between frames counts as holding still */
const STILL_COS = Math.cos((0.05 * Math.PI) / 180);

const _cameraWorld = new Vector3();
const _toCamera = new Vector3();
const _direction = new Vector3();

export function createVisuals({ app, view3d, stage, ball }) {
  const slice = createRingSlice();
  /** What each hair draws: the face normal, the blended one, or a mix part way through a turn */
  const directions = new Float32Array(HAIR_COUNT * 3);
  const ring = new NormalsHelper({
    positions: slice.roots,
    normals: directions,
    length: HAIR_LENGTH,
    thickness: HAIR_THICKNESS,
    color: 'accent',
    parent: ball,
  });
  const labels = new LabelLayer({ view3d, stage });
  const tag = labels.add({ text: 'normals', node: ball, color: 'accent' });
  /** How far the hairs have turned, from blended normals (0) to face normals (1) */
  let flatness = ball.material.flatShading ? 1 : 0;
  let shownGeometry = null;
  /** The camera's direction from the ball last frame, the last slice's, and how long it has held still */
  const lastToCamera = new Vector3();
  const slicedFor = new Vector3();
  let stillFor = 0;

  app.stage.addChild(labels);

  /** Points each hair `flatness` of the way from its blended normal to its face's, and stands the tag on the top one */
  function drawHairs() {
    // Smoothstep, so a turn eases out of one look and into the other.
    const s = flatness * flatness * (3 - 2 * flatness);

    for (let i = 0; i < directions.length; i++) {
      directions[i] =
        slice.blendedNormals[i] +
        (slice.faceNormals[i] - slice.blendedNormals[i]) * s;
    }
    ring.update();
    _direction.fromArray(directions, TOP_HAIR * 3).normalize();
    tag.at
      .fromArray(slice.roots, TOP_HAIR * 3)
      .addScaledVector(_direction, HAIR_LENGTH);
  }

  return {
    update(dt) {
      // The ring faces the camera, so a camera that has settled somewhere new gets a new slice; none runs mid-drag.
      ball
        .toLocal(
          view3d.camera.getGlobalPosition(_cameraWorld),
          undefined,
          _toCamera,
        )
        .normalize();
      if (_toCamera.dot(lastToCamera) < STILL_COS) {
        lastToCamera.copyFrom(_toCamera);
        stillFor = 0;
      } else {
        stillFor += dt;
      }

      const geometry = ball.geometry;
      const newGeometry = geometry !== shownGeometry;
      const resettled =
        stillFor >= SETTLE_SECONDS && _toCamera.dot(slicedFor) < RESLICE_COS;

      if (newGeometry || resettled) {
        shownGeometry = geometry;
        slicedFor.copyFrom(_toCamera);
        sliceRing(geometry, slicedFor, slice);
        drawHairs();
      }

      const target = ball.material.flatShading ? 1 : 0;

      if (flatness !== target) {
        const step = dt / TURN_SECONDS;

        flatness =
          flatness < target
            ? Math.min(target, flatness + step)
            : Math.max(target, flatness - step);
        drawHairs();
      }
      labels.update();
    },
  };
}
