/**
 * What the frame draws to explain the three lighting models: each column's model, the key light's rays, and the
 * reflection only PBR shows
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Quaternion, Vector3 } from '@pixi/3d';

import { LabelLayer } from './theme/LabelLayer';
import { LightHelper } from './theme/LightHelper';

import { BALL_RADIUS } from './scene';

/** Each column's lighting model, in column order: `index.ts` gives the class that draws each */
const MODELS = ['PBR', 'Blinn-Phong', 'unlit'];

/** Px from a logo's top or bottom edge to its model tag: clear of the bevel, near enough to read as its name */
const MODEL_TAG_GAP = 16;
/** World units between neighbouring rays: three of them span about half a logo, so they read as one beam */
const RAY_SPREAD = 0.64;
/** Px from the rays' middle tail up to their tag */
const RAY_TAG = { x: 0, y: -18 };
/** How far out from the ball's centre to its rim the reflection tag points: on the bright edge, not past it */
const RIM_OUT = 0.9;
const UP = { x: 0, y: 1, z: 0 };
/** A quarter turn about a light's beam; `update` says why */
const ROLL = new Quaternion().setFromAxisAngle(
  { x: 0, y: 0, z: 1 },
  Math.PI / 2,
);

const _centre = new Vector3();
const _toCamera = new Vector3();
const _right = new Vector3();
const _up = new Vector3();

export function createVisuals({ app, view3d, stage, layout, columns }) {
  const labels = new LabelLayer({ view3d, stage });
  const { target, gap, length } = layout.keyRays;
  const keyRays = new LightHelper({
    light: stage.key,
    target,
    gap,
    length,
    spread: RAY_SPREAD,
    thickness: layout.rayThickness,
    parent: view3d.root,
  });
  const keyTag = labels.add({ text: 'key light', offset: RAY_TAG });
  const reflectionTag = labels.add({
    text: 'environment reflection',
    offset: layout.reflection.offset,
    leader: true,
  });
  const pbrBall = columns[0].ball;
  const edge = layout.tagsBelow ? -1 : 1;

  columns.forEach(({ logo }, i) =>
    labels.add({
      text: MODELS[i],
      node: logo.root,
      at: { x: 0, y: edge * logo.half.y, z: 0 },
      offset: { x: 0, y: -edge * MODEL_TAG_GAP },
    }),
  );
  app.stage.addChild(labels);

  return {
    update() {
      // LightHelper spreads its rays across the light's local y, which for a light in front of the camera runs along
      // the view, so the rays would draw over each other. A quarter turn about the beam spreads them across its local
      // x instead, which `lookAt` keeps level.
      keyRays.update().quaternion.multiply(ROLL);
      keyTag.at.copyFrom(keyRays.tail);
      rimPoint(view3d, pbrBall, layout.reflection.clock, reflectionTag.at);
      labels.update();
    },
  };
}

/**
 * The point on a ball at `clock` hours as the camera sees it, near its rim, written into `out`
 *
 * The reflection is clearest near the rim, which the key light's highlight never reaches at any angle the pane gives
 * it, so the tag points there. Working from the camera keeps the point on the rim while the reader orbits.
 */
function rimPoint(view3d, ball, clock, out) {
  const angle = (clock * Math.PI) / 6;

  ball.getGlobalPosition(_centre);
  view3d.camera.getGlobalPosition(_toCamera).subtract(_centre).normalize();
  _right.copyFrom(UP).cross(_toCamera).normalize();
  _up.copyFrom(_toCamera).cross(_right);

  return out
    .copyFrom(_centre)
    .addScaledVector(_right, BALL_RADIUS * RIM_OUT * Math.sin(angle))
    .addScaledVector(_up, BALL_RADIUS * RIM_OUT * Math.cos(angle))
    .addScaledVector(_toCamera, BALL_RADIUS * Math.sqrt(1 - RIM_OUT * RIM_OUT));
}
