/**
 * What the frame draws to explain the keyframes: a dot at every position keyframe, the path each interpolation draws
 * through them, the tangent handles in `'CUBICSPLINE'`, ghosts of the badge at its rotation keys, and the light's bulb
 *
 * Every helper sits under the logo's root, in the space the tracks' values are in. It reads the animations, the
 * playback and the scene each frame and never changes them, so `index.ts` runs the same without it.
 */

import { GhostHelper } from './theme/GhostHelper';
import { LabelLayer } from './theme/LabelLayer';
import { LightHelper } from './theme/LightHelper';

import { NARROW_BELOW } from './theme/overlay';
import { BRAND } from './theme/palette';
import { PathHelper } from './theme/PathHelper';
import { PointsHelper } from './theme/PointsHelper';

import { FLASH_PEAK } from './keyframes';
import { readKeys, sampleLines } from './samples';

/** A keyframe's dot, the largest mark on a path, since it's the data the path is worked out from */
const KEY_RADIUS = 0.065;
/** The lines' widths; a tangent handle is thinner than the path it lies along */
const PATH_THICKNESS = 0.02;
const HANDLE_THICKNESS = 0.014;
/** On a phone the camera backs off, so the lines widen to stay over a pixel */
const NARROW_WIDEN = 1.8;
/** The bulb's radius with the light off; it doubles at the flash's peak */
const BULB_RADIUS = 0.1;
/** The px between the light's tag and the top of its bulb at full size */
const FLASH_TAG_GAP = 6;
/** How close the badge comes to a ghost, in logo units, before the ghost hides behind it */
const GHOST_CLEAR = 0.05;
/** The piece whose handle carries the tangent tags: `p`'s has the most room round it */
const TANGENT_NODE = 'p';
const PEN_LIFT = new Float32Array([Number.NaN, 0, 0]);

export function createVisuals({ app, view3d, stage, logo, flash, animations }) {
  const parent = logo.root;
  const keys = readKeys(animations[0]);
  const lines = animations.map((animation) =>
    sampleLines(animation, logo.pieces),
  );
  /** The most numbers any one animation's lines need, which sizes the arrays they're drawn from */
  const most = (count) =>
    Math.max(
      ...lines.map((set) => set.reduce((sum, line) => sum + count(line), 0)),
    );
  const linePoints = new Float32Array(
    most((line) => line.points.length + PEN_LIFT.length),
  );
  const handlePoints = new Float32Array(most((line) => line.handles.length));
  const dotPoints = new Float32Array(keys.positions.length);
  const labels = new LabelLayer({ view3d, stage });
  const paths = new PathHelper({ thickness: PATH_THICKNESS, parent });
  const handles = new PathHelper({
    color: BRAND.purple,
    thickness: HANDLE_THICKNESS,
    parent,
  });
  // Each position keyframe's value: the data, which never moves whatever the interpolation.
  const dots = new PointsHelper({
    positions: dotPoints,
    radius: KEY_RADIUS,
    parent,
  });
  // The handle's back end, then its front end, each tagged on its outer side.
  const tangentTags = ['in-tangent', 'out-tangent'].map((text, end) =>
    labels.add({
      text,
      node: parent,
      color: BRAND.purple,
      anchor: { x: 1 - end, y: 0.5 },
      offset: { x: end === 0 ? -8 : 8, y: 0 },
    }),
  );
  // The rotation track's keys, each posed where the badge's position track puts it at the same time.
  const badge = logo.pieces.js;
  const ghosts = keys.turns.map(({ position, quaternion }) => {
    const ghost = new GhostHelper({ source: badge.pivot, parent });

    ghost.position.copyFrom(position);
    ghost.quaternion.copyFrom(quaternion);

    return ghost;
  });
  const bulb = new LightHelper({ light: flash, bulb: BULB_RADIUS, parent });
  let shown = null;
  let landedMask = -1;
  let dotMask = -1;
  let tangents = false;

  // Over the bulb at its largest, named as the light is in the code.
  labels.add({
    text: 'flash',
    node: flash,
    at: { x: 0, y: 2 * BULB_RADIUS, z: 0 },
    anchor: { x: 0.5, y: 1 },
    offset: { x: 0, y: -FLASH_TAG_GAP },
  });
  app.stage.addChild(labels);

  /** Draws each piece's path, stopping at its place once it has landed there, and the tangent handles */
  function drawLines(current, landed) {
    let points = 0;
    let handleCount = 0;

    tangents = false;
    for (let i = 0; i < current.length; i++) {
      const line = current[i];

      if (points > 0) points = append(linePoints, points, PEN_LIFT);
      points = append(
        linePoints,
        points,
        (landed & (1 << i)) !== 0 ? line.landed : line.points,
      );
      handleCount = append(handlePoints, handleCount, line.handles);
      // The tangent tags mark the two ends of this piece's handle, which only 'CUBICSPLINE' has.
      if (line.node !== TANGENT_NODE || line.handles.length === 0) continue;
      tangents = true;
      tangentTags[0].at.fromArray(line.handles, 0);
      tangentTags[1].at.fromArray(line.handles, 3);
    }
    paths.setPoints(linePoints, points);
    handles.setSegments(handlePoints, handleCount / 2);
  }

  /** Copies the keyframes `mask` picks into the dots' positions, xyz each, and returns how many */
  function pickDots(mask) {
    let count = 0;

    for (let i = 0; i < keys.times.length; i++) {
      if (mask & (1 << i))
        count = append(dotPoints, count, keys.positions, 1, i);
    }

    return count;
  }

  return {
    update({ animation, time }) {
      const narrow = app.screen.width < NARROW_BELOW;
      const current = lines[animations.indexOf(animation)];
      let landed = 0;
      let shownKeys = 0;

      for (let i = 0; i < current.length; i++)
        if (time >= current[i].lands) landed |= 1 << i;
      if (current !== shown || landed !== landedMask) {
        shown = current;
        landedMask = landed;
        drawLines(current, landed);
      }
      // A landing key sits inside its piece once it has landed, so its dot hides from then on.
      for (let i = 0; i < keys.times.length; i++)
        if (!keys.landing[i] || time < keys.times[i]) shownKeys |= 1 << i;
      if (shownKeys !== dotMask) {
        dotMask = shownKeys;
        dots.count = pickDots(shownKeys);
        dots.update();
      }
      // Each rewrites its bars only when the value changes.
      paths.thickness = PATH_THICKNESS * (narrow ? NARROW_WIDEN : 1);
      handles.thickness = HANDLE_THICKNESS * (narrow ? NARROW_WIDEN : 1);
      // A phone has no room for them beside the path.
      for (const tag of tangentTags) tag.hidden = narrow || !tangents;
      for (const ghost of ghosts) {
        ghost.visible =
          badge.pivot.position.distanceToSquared(ghost.position) >
          GHOST_CLEAR ** 2;
      }
      // The bulb brightens and swells with the intensity the NumberTrack writes.
      bulb.brightness = flash.intensity / FLASH_PEAK;
      bulb.bulb = BULB_RADIUS * (1 + bulb.brightness);
      bulb.update();
      labels.update();
    },
  };
}

/** Copies `count` points of `from`, starting at point `first`, into `to` after its first `at`; returns the new total */
function append(to, at, from, count = from.length / 3, first = 0) {
  for (let i = 0; i < count * 3; i++) to[at * 3 + i] = from[first * 3 + i];

  return at + count;
}
