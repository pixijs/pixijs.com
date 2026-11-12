/**
 * What the frame draws to explain the transforms: the letter's own axes, an unturned ghost of it at scale 1, an arrow
 * from the parent's origin to its position, the turn in use (a dial for the Euler turn, or the quaternion's axis with
 * a curl round it), and the door's turning point, the line it turns about and its swing, beside a ghost of the door
 * turning about its middle
 *
 * It reads the letter, the door and the pose each frame and never changes them, so `index.ts` runs the same without it.
 */

import { Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { AngleHelper } from './theme/AngleHelper';
import { ArrowHelper } from './theme/ArrowHelper';
import { AxesHelper } from './theme/AxesHelper';
import { DotHelper } from './theme/DotHelper';
import { GhostHelper } from './theme/GhostHelper';

import { LabelLayer } from './theme/LabelLayer';

/**
 * Where the letter's ghost stands, unturned and at scale 1, so the letter's turn and stretch show against it. It's a
 * fixed spot clear of the letter's opening pose, not position zero: that's the root dot the position arrow starts from.
 */
const GHOST_POSITION = { x: 0.75, y: 1.5, z: -0.5 };
const AXES_LENGTH = 1.25;
const DIAL_RADIUS = 1.1;
/** The dial floats this far under the letter's foot */
const DIAL_DROP = 0.08;
/** The quaternion's axis runs from this far behind the letter's centre to this far past it */
const AXIS_BEHIND = 1.2;
const AXIS_AHEAD = 2.2;
/** The curl round the axis sits near its head */
const CURL_AT = 1.75;
const CURL_RADIUS = 0.55;
/** Past this much y in the unit axis, +y lies too near along it to start the curl from, so it starts from +x */
const NEAR_Y = 0.9;
/** Under this many degrees the door and its ghost would pass through each other */
const DOOR_GHOST_FROM = 12;
/** With `origin.x` this near 0 the door already turns about its middle, so its ghost would only sit inside it */
const DOOR_GHOST_MIN_ORIGIN = 0.05;
const LINE_THICKNESS = 0.025;
/** The gap in px between an axis tip and its tag, so the tag never covers the arrowhead */
const TIP_GAP = 6;
/** Smaller differences than this count as none */
const EPSILON = 1e-3;
const ORIGIN = { x: 0, y: 0, z: 0 };
const UNIT = { x: 1, y: 1, z: 1 };
const X = { x: 1, y: 0, z: 0 };
const BACK_X = { x: -1, y: 0, z: 0 };
const Y = { x: 0, y: 1, z: 0 };
const Z = { x: 0, y: 0, z: 1 };
const AXIS_NAMES = ['x', 'y', 'z'];

const _axis = new Vector3();
const _from = new Vector3();
const _to = new Vector3();
const _fromOnScreen = new Point();
const _toOnScreen = new Point();

/** What each group of visuals builds from: the options, the one label layer, and the letter's bounds */

export function createVisuals(options) {
  const { app, view3d, stage, letter } = options;
  const labels = new LabelLayer({ view3d, stage });
  const parts = { ...options, labels, bounds: letter.getLocalBounds() };
  const groups = [
    createLetterVisuals(parts),
    createTurnVisuals(parts),
    createDoorVisuals(parts),
  ];

  app.stage.addChild(labels);

  return {
    update() {
      for (const group of groups) group.update();
      labels.update();
    },
  };
}

/** The letter's own axes, which turn and stretch with it; its unturned ghost; and its position as an arrow from root */
function createLetterVisuals({ view3d, labels, letter, pose }) {
  const root = view3d.root;
  // Built before the axes join the letter, so it copies no arrows.
  const ghost = new GhostHelper({ source: letter, parent: root });
  const axes = new AxesHelper({ length: AXES_LENGTH, parent: letter });
  const tips = AXIS_NAMES.map((name) =>
    labels.add({ text: name, node: axes, at: axes.tips[name], color: name }),
  );
  // In ink, so it never reads as the quaternion's accent axis through the same point. Through x-ray, its head shows
  // on the letter's origin, inside the P.
  const arrow = new ArrowHelper({ color: 'ink', xray: true, parent: root });

  new DotHelper({ radius: 0.05, outline: true, parent: root });
  labels.add({
    text: 'root',
    anchor: { x: 0, y: 0 },
    offset: { x: -10, y: 14 },
  });
  ghost.position = GHOST_POSITION;
  ghost.quaternion.set(0, 0, 0, 1);
  ghost.scale = UNIT;

  return {
    update() {
      const turned =
        pose.turnBy === 'angle' ? pose.angle.y !== 0 : pose.axisAngle !== 0;

      // Matching the letter, the ghost would only sit inside it.
      ghost.visible =
        turned ||
        !near(letter.position, GHOST_POSITION) ||
        !near(letter.scale, UNIT);
      arrow.set(ORIGIN, letter.position);
      axes.toGlobal(ORIGIN, _from);
      for (let i = 0; i < 3; i++)
        hangOff(view3d, tips[i], _from, axes.toGlobal(tips[i].at, _to));
    },
  };
}

/** The turn in use: a dial under the letter for the Euler turn, or the quaternion's axis through it with a curl */
function createTurnVisuals({ view3d, letter, bounds, pose }) {
  const root = view3d.root;
  // It sweeps from +z, where the letter faced at rest.
  const dial = new AngleHelper({ radius: DIAL_RADIUS, parent: root }).setAxis(
    Y,
    Z,
  );
  const axisArrow = new ArrowHelper({ parent: root });
  const curl = new AngleHelper({
    radius: CURL_RADIUS,
    wedge: false,
    parent: root,
  });
  // The axis the curl was last laid on; it's laid again only when the pane's axis changes.
  const curlAxis = new Vector3(Number.NaN, Number.NaN, Number.NaN);

  return {
    update() {
      const { position, scale } = letter;
      const byAngle = pose.turnBy === 'angle';

      dial.visible = byAngle && letter.rotation.y !== 0;
      dial.radians = letter.rotation.y;
      dial.position.set(
        position.x,
        Math.max(
          0.02,
          position.y + bounds.min.y * Math.abs(scale.y) - DIAL_DROP,
        ),
        position.z,
      );

      _axis.copyFrom(pose.axis).normalize();
      axisArrow.visible = curl.visible = !byAngle;
      axisArrow.set(
        _from.copyFrom(position).addScaledVector(_axis, -AXIS_BEHIND),
        _to.copyFrom(position).addScaledVector(_axis, AXIS_AHEAD),
      );
      curl.position.copyFrom(position).addScaledVector(_axis, CURL_AT);
      if (!curlAxis.equals(_axis)) {
        curlAxis.copyFrom(_axis);
        curl.setAxis(_axis, Math.abs(_axis.y) > NEAR_Y ? X : Y);
      }
      curl.radians = pose.axisAngle;
    },
  };
}

/** The door's `origin`: the point and line it turns about, the far edge's swing, and a ghost turning about its middle */
function createDoorVisuals({ view3d, labels, door }) {
  const root = view3d.root;
  const bounds = door.getLocalBounds();
  // Through x-ray, the point and its line show through the door when `origin` puts them inside it.
  const turnPoint = new DotHelper({
    color: 'accent',
    xray: true,
    parent: root,
  });
  const line = new ArrowHelper({
    head: false,
    thickness: LINE_THICKNESS,
    xray: true,
    parent: root,
  });
  // Under the line's foot, on the floor, where no pose of the door covers it.
  const tag = labels.add({
    text: 'origin',
    anchor: { x: 0.5, y: 0 },
    offset: { x: 0, y: 8 },
  });
  const swing = new AngleHelper({ wedge: false, parent: root });
  // The same door with `origin` at its middle, turned by the same angle: it spins in place instead of swinging.
  const ghost = new GhostHelper({ source: door, parent: root });
  const ghostPoint = new DotHelper({ muted: true, xray: true, parent: root });
  // Which side of the turning point the far edge is on, as the swing was last laid; it's laid again when that flips.
  let swingSide = 0;

  ghost.origin.x = 0;

  return {
    update() {
      const originX = door.origin.x;
      const turn = door.rotation.y;
      // The far edge is the one across the door from the turning point.
      const side = originX > 0 ? -1 : 1;

      // The point that stays still while the door turns: `position + origin`, in the door's parent.
      const at = turnPoint.position.copyFrom(door.position).add(door.origin);

      line.set(
        tag.at.set(at.x, 0, at.z),
        _to.set(at.x, door.position.y + bounds.max.y, at.z),
      );
      swing.position.copyFrom(at);
      swing.radius = bounds.max.x + Math.abs(originX);
      if (side !== swingSide) {
        swingSide = side;
        swing.setAxis(Y, side < 0 ? BACK_X : X);
      }
      swing.radians = turn;
      swing.visible = turn !== 0;

      ghost.visible =
        Math.abs(door.angle.y) > DOOR_GHOST_FROM &&
        Math.abs(originX) > DOOR_GHOST_MIN_ORIGIN;
      ghost.rotation.y = turn;
      ghostPoint.visible = ghost.visible;
      ghostPoint.position.copyFrom(door.position);
    },
  };
}

/** Hangs a tag past an arrow's tip on screen, along the arrow's direction there */
function hangOff(view3d, label, from, to) {
  if (
    !view3d.worldToScreen(from, _fromOnScreen) ||
    !view3d.worldToScreen(to, _toOnScreen)
  )
    return;

  const dx = _toOnScreen.x - _fromOnScreen.x;
  const dy = _toOnScreen.y - _fromOnScreen.y;
  const length = Math.hypot(dx, dy) || 1;
  const reach = Math.max(Math.abs(dx), Math.abs(dy)) || 1;

  label.anchor.set(0.5 - (0.5 * dx) / reach, 0.5 - (0.5 * dy) / reach);
  label.offset.set((TIP_GAP * dx) / length, (TIP_GAP * dy) / length);
}

/** Whether two points match to a thousandth */
function near(a, b) {
  return (
    Math.abs(a.x - b.x) < EPSILON &&
    Math.abs(a.y - b.y) < EPSILON &&
    Math.abs(a.z - b.z) < EPSILON
  );
}
