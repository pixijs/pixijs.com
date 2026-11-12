/**
 * One spark's flight drawn in the scene: the path an average spark flies, a dashed copy of it with no drag, and the
 * gravity arrow that bends it, with their labels laid out so none crosses a line
 *
 * The paths lie in the upright plane through the nozzle that faces the camera, so they always read side on.
 */

import { Vector3 } from '@pixi/3d';

import { Point } from 'pixi.js';

import { ArrowHelper } from './theme/ArrowHelper';

import { PathHelper } from './theme/PathHelper';

import { crossing, highest, launchFor, sampleFlight } from './sparkPath';

/** Points along each path */
const PATH_POINTS = 48;
/** The gravity arrow's length per unit of pull, in world units */
const GRAVITY_SCALE = 0.1;
/** How far right of a straight up-and-down path the arrow stands, and how far under its top it starts */
const ARROW_SIDE = 0.35;
/** How far right of the launch the arrow stands when the path doesn't turn in view */
const LAUNCH_SIDE = 0.6;
/** The band under the view's top edge, in px, where the paths stop, leaving room for the labels over them */
const TOP_MARGIN = 90;
/** Room the gravity label needs on each side, in px, to sit inside the arch under the arrow's head */
const ARCH_PAD = 16;
/** How high over the launch the arrow's head must be, in world units, for its label to clear the tube */
const HEAD_CLEARANCE = 0.5;
/** The step between stacked labels, in px */
const TAG_GAP = 24;
/** Px the no-drag label hangs over the no-drag path's top when the path arches */
const NO_DRAG_RISE = 10;
/** Px in from the gravity label's left end where a leader up to the arrow meets it: past the label's rounded end */
const LEADER_INSET = 14;
/** Px between the base's rim and a label that would otherwise hang over it */
const BASE_GAP = 6;

/** One flight, traced each frame: its points, and the points its labels and arrow hang from */

const _from = new Vector3();
const _direction = new Vector3();
const _velocity = new Vector3();
const _point = new Vector3();
const _tail = new Vector3();
const _head = new Vector3();
const _middle = new Vector3();
const _riseAt = new Vector3();
const _rim = new Vector3();
const _rise = new Point();
const _fall = new Point();
const _screen = new Point();
const _end = new Point();
const _tip = new Point();

export function createSparkDiagram({
  view3d,
  labels,
  sparks,
  tube,
  life,
  speed,
}) {
  const dragPath = new PathHelper({
    color: 'accent',
    thickness: 0.03,
    parent: view3d.root,
  });
  const noDragPath = new PathHelper({
    thickness: 0.018,
    dash: 0.1,
    gap: 0.08,
    parent: view3d.root,
  });
  const gravityArrow = new ArrowHelper({
    color: 'ink',
    thickness: 0.035,
    parent: view3d.root,
  });
  const dragFlight = createFlight();
  const noDragFlight = createFlight();
  const noDragTag = labels.add({ text: 'no drag' });
  // With a leader, so wherever the layout puts it, a line runs from the arrow to it.
  const gravityTag = labels.add({ text: 'gravity', leader: true });
  const dragTag = labels.add({ text: 'with drag' });

  /** Samples a flight, then cuts it where it rises into the top band */
  function trace(flight, from, velocity, gravity, drag) {
    let count = sampleFlight(
      flight.points,
      from,
      velocity,
      gravity,
      drag,
      life,
      _point,
    );

    for (let i = 1; i < count; i++) {
      _point.fromArray(flight.points, i * 3);
      if (
        view3d.worldToScreen(_point, _screen) === null ||
        _screen.y < TOP_MARGIN
      ) {
        count = i;
        break;
      }
    }
    flight.count = count;
    flight.topIndex = highest(flight.points, count);
    flight.from.copyFrom(from);
    flight.top.fromArray(flight.points, flight.topIndex * 3);
    flight.end.fromArray(flight.points, (count - 1) * 3);
  }

  /**
   * The on-screen width of a flight's arch at `height`, between its two sides, with the point midway between them
   * written into `out`; 0 if a side never gets that low
   */
  function archAt(flight, height, out) {
    const { points, topIndex, count } = flight;

    if (
      !crossing(points, 1, topIndex, height, _riseAt) ||
      !view3d.worldToScreen(_riseAt, _rise)
    )
      return 0;
    if (
      !crossing(points, topIndex + 1, count - 1, height, out) ||
      !view3d.worldToScreen(out, _fall)
    )
      return 0;
    out.add(_riseAt).multiplyScalar(0.5);

    return Math.abs(_fall.x - _rise.x);
  }

  /**
   * Hangs the gravity label under the drag path's label at its end, or lower if the arrow's head reaches lower, with
   * its left end under the arrow, so its leader runs straight up to the arrow's middle through the arch's open bottom.
   * A narrow arch puts the arrow over the tube, so the label then moves right until it clears the base's rim.
   */
  function hangUnderEnd(end, right) {
    _middle.copyFrom(_tail).add(_head).multiplyScalar(0.5);
    _rim
      .set(tube.nozzle.x, tube.base.height, tube.nozzle.z)
      .addScaledVector(right, tube.base.radius);

    const middle = view3d.worldToScreen(_middle, _screen);
    const middleX = middle?.x ?? 0;
    const middleY = middle?.y ?? 0;
    const endY = view3d.worldToScreen(end, _end)?.y ?? middleY;
    const tipY = view3d.worldToScreen(_head, _tip)?.y ?? endY;
    const rimX = view3d.worldToScreen(_rim, _rise)?.x ?? middleX;
    const x = Math.max(-LEADER_INSET, rimX + BASE_GAP - middleX);

    pin(
      gravityTag,
      _middle,
      0,
      0,
      x,
      Math.max(endY, tipY) - middleY + 8 + TAG_GAP,
    );
  }

  /** Hangs the gravity label just under the arrow's head, centred on the arch's middle there, which `_middle` holds */
  function hangUnderHead() {
    const tipX = view3d.worldToScreen(_head, _tip)?.x ?? 0;
    const middleX = view3d.worldToScreen(_middle, _screen)?.x ?? tipX;

    pin(gravityTag, _head, 0.5, 0, middleX - tipX, 6);
  }

  /** Lays the gravity arrow and the three labels on the two flights, by the rules for the launch's shape */
  function layOut(dragged, free, right, upright, length) {
    if (!turnsInView(dragged)) {
      // Too little gravity to turn the path in view: the arrow stands beside the launch, ending at its height, and the
      // drag path's label sits where the path leaves the top of the view.
      _head.copyFrom(dragged.from).addScaledVector(right, LAUNCH_SIDE);
      _tail.copyFrom(_head);
      _tail.y += length;
      noDragTag.hidden = true;
      pin(
        gravityTag,
        _middle.copyFrom(_tail).add(_head).multiplyScalar(0.5),
        0,
        0.5,
        10,
        0,
      );
      pin(dragTag, dragged.end, 0, 0.5, 12, 0);
    } else if (upright) {
      // Both paths run up and down one line, so the labels sit right of their tops and the arrow hangs beside them.
      _tail.copyFrom(dragged.top).addScaledVector(right, ARROW_SIDE);
      _tail.y -= ARROW_SIDE;
      _head.copyFrom(_tail);
      _head.y -= length;
      pin(
        gravityTag,
        _middle.copyFrom(_tail).add(_head).multiplyScalar(0.5),
        0,
        0.5,
        10,
        0,
      );
      pin(dragTag, dragged.top, 0, 0.5, 12, 0);
      pin(noDragTag, free.top, 0, 0.5, 12, 0);
    } else {
      // The arrow hangs from the top of the arch. Its label goes just under the head, centred in the arch, where the
      // arch is wide enough at the head's height; otherwise it drops under the path's end. Its leader runs up to the
      // arrow either way, so it reads as the arrow's name.
      _tail.copyFrom(dragged.top);
      _head.copyFrom(dragged.top);
      _head.y -= length;
      pin(noDragTag, free.top, 0.5, 1, 0, -NO_DRAG_RISE);
      pin(dragTag, dragged.end, 0, 0, 8, 8);

      const arch =
        _head.y - dragged.from.y >= HEAD_CLEARANCE
          ? archAt(dragged, _head.y, _middle)
          : 0;

      // In both these placements the leader meets the label inside its width, so `width` measures the label alone.
      if (arch < gravityTag.width + ARCH_PAD * 2)
        hangUnderEnd(dragged.end, right);
      else hangUnderHead();
    }
    gravityArrow.visible = length > 0.01;
    gravityTag.hidden = !gravityArrow.visible;
    // With no gravity to bend them, both paths run along one straight line, the dashed one under the solid, so
    // there's no difference to name.
    if (!gravityArrow.visible) dragTag.hidden = true;
    gravityArrow.set(_tail, _head);
  }

  return {
    update(right) {
      const gravity = -(sparks.gravity?.y ?? 0);
      const drag = sparks.drag ?? 0;
      const upright = launchFor(sparks.shape, right, _from, _direction);

      _from.add(sparks.position);
      _velocity.copyFrom(_direction).multiplyScalar(speed);
      trace(dragFlight, _from, _velocity, gravity, drag);
      trace(noDragFlight, _from, _velocity, gravity, 0);

      dragPath.setPoints(dragFlight.points, dragFlight.count);
      noDragPath.setPoints(noDragFlight.points, noDragFlight.count);
      // With no drag the two paths are one, so neither needs a name.
      noDragPath.visible = drag > 0;
      noDragTag.hidden = !noDragPath.visible || !turnsInView(noDragFlight);
      dragTag.hidden = !noDragPath.visible;
      layOut(dragFlight, noDragFlight, right, upright, gravity * GRAVITY_SCALE);
    },
  };
}

function createFlight() {
  return {
    points: new Float32Array(PATH_POINTS * 3),
    count: 0,
    topIndex: 0,
    from: new Vector3(),
    top: new Vector3(),
    end: new Vector3(),
  };
}

/** Whether a flight turns over inside the view, rather than ending as it rises or reaching the top band first */
function turnsInView(flight) {
  return flight.topIndex < flight.count - 1;
}

/** Points a label at `at`, with the part of the label at (`anchorX`, `anchorY`) moved `x`, `y` px from it */
function pin(label, at, anchorX, anchorY, x, y) {
  label.at.copyFrom(at);
  label.anchor.set(anchorX, anchorY);
  label.offset.set(x, y);
}
