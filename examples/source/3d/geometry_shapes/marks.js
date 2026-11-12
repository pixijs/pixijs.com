/**
 * The marks a size is drawn with (the hero's own axes, bars, radius arrows, arcs and a ring), each with a tag naming
 * the option it measures (`radius`)
 *
 * They're shared by every class, and they're the hero's children, so they turn with its pose. Each tag is pushed just
 * outside what it names every frame, so it stays off the shape as the reader orbits, then out of the tags already
 * placed, so two marks that meet at the end of a slider still read apart.
 */

import { Vector3 } from '@pixi/3d';

import { Point, Rectangle } from 'pixi.js';

import { AngleHelper } from './theme/AngleHelper';
import { ArrowHelper } from './theme/ArrowHelper';
import { AxesHelper } from './theme/AxesHelper';
import { DimensionHelper } from './theme/DimensionHelper';

import { PathHelper } from './theme/PathHelper';

/** How far a bar stands off the edge it measures */
const BAR_GAP = 0.2;
/** Px left between a tag and what it names, or another tag */
const TAG_GAP = 6;

/** A tag, the point it's pushed away from (both in its node's space), and where it landed on screen last update */

/** A size mark, and whether it has a tag; a radius of 0 has none */

/** Where a sweep turns: about `axis` through `centre`, from `from`, `radius` out, its tag pinned past `pin` */

const _world = new Vector3();
const _from = new Vector3();
const _to = new Vector3();
const _edge = new Vector3();
const _away = new Point();
const _end = new Point();
const _circle = new Float32Array(64 * 3);

/** Where a point in a tag's node space lands on screen, or `null` behind the camera */
function project(view3d, tag, point, out) {
  return view3d.worldToScreen(tag.node.toGlobal(point, _world), out);
}

/**
 * Sets a tag's offset so it sits just past its pin, on the far side from `away`, clearing the line through the pin
 * square to the push. Given a bar's far end `along`, it moves square to the bar on screen instead and clears the whole
 * bar, which a bar slanting in perspective needs.
 */
function pushOut(view3d, pinned) {
  const { tag, away, along, centre } = pinned;
  const pin = project(view3d, tag, tag.at, pinned.pin);
  const from = project(view3d, tag, away, _away);
  const end = along && project(view3d, tag, along, _end);

  if (!pin || !from) return;

  const side = end
    ? Math.sign(
        (pin.y - end.y) * (pin.x - from.x) + (end.x - pin.x) * (pin.y - from.y),
      ) || 1
    : 0;
  const x = end ? (pin.y - end.y) * side : pin.x - from.x;
  const y = end ? (end.x - pin.x) * side : pin.y - from.y;
  const length = Math.hypot(x, y);
  // Straight up when the two points land on one another.
  const dx = length < 0.5 ? 0 : x / length;
  const dy = length < 0.5 ? -1 : y / length;
  // Half the box, measured along the push.
  const reach =
    (tag.width / 2) * Math.abs(dx) + (tag.height / 2) * Math.abs(dy) + TAG_GAP;

  tag.offset.set(dx * reach, dy * reach);
  centre.set(pin.x + tag.offset.x, pin.y + tag.offset.y);
  fitBox(pinned);
}

/** Sets a tag's box to its own rect joined with the point it names */
function fitBox({ tag, pin, centre, box }) {
  const halfW = tag.width / 2;
  const halfH = tag.height / 2;

  box.x = Math.min(pin.x, centre.x - halfW);
  box.y = Math.min(pin.y, centre.y - halfH);
  box.width = Math.max(pin.x, centre.x + halfW) - box.x;
  box.height = Math.max(pin.y, centre.y + halfH) - box.y;
}

/** Moves a tag the shortest way out of each other shown size tag and the point it names, never back over its own */
function keepClear(pinned, others) {
  const { tag, centre } = pinned;
  const length = Math.hypot(tag.offset.x, tag.offset.y) || 1;
  const outX = tag.offset.x / length;
  const outY = tag.offset.y / length;

  for (const { tag: other, box } of others) {
    const reachX = (tag.width + box.width) / 2 + TAG_GAP;
    const reachY = (tag.height + box.height) / 2 + TAG_GAP;
    const dx = centre.x - box.x - box.width / 2;
    const dy = centre.y - box.y - box.height / 2;

    if (
      other === tag ||
      other.hidden ||
      Math.abs(dx) >= reachX ||
      Math.abs(dy) >= reachY
    )
      continue;

    // How far it moves to clear going right, left, down or up; a way back towards what it names doesn't count.
    const right = outX > -0.5 ? reachX - dx : Infinity;
    const left = outX < 0.5 ? reachX + dx : Infinity;
    const down = outY > -0.5 ? reachY - dy : Infinity;
    const up = outY < 0.5 ? reachY + dy : Infinity;
    const move = Math.min(right, left, down, up);
    const shiftX = move === right ? right : move === left ? -left : 0;
    const shiftY = shiftX ? 0 : move === down ? down : -up;

    tag.offset.set(tag.offset.x + shiftX, tag.offset.y + shiftY);
    centre.set(centre.x + shiftX, centre.y + shiftY);
  }
  // The tags after it clear where it ended up.
  fitBox(pinned);
}

/** A tag to lay out, pushed away from its node's origin until `away` is set */
function pinned(tag, along = null) {
  return {
    tag,
    away: new Vector3(),
    along,
    pin: new Point(),
    centre: new Point(),
    box: new Rectangle(),
  };
}

export function createMarks({ hero, view3d, labels }) {
  // Drawn over the shape, so the origin shows at its centre and every tip shows, however big the shape grows.
  const axes = new AxesHelper({
    length: 1.5,
    thickness: 0.025,
    xray: true,
    parent: hero,
  });
  const axisTags = ['x', 'y', 'z'].map((axis) =>
    pinned(
      labels.add({ text: axis, node: axes, at: axes.tips[axis], color: axis }),
    ),
  );
  // Accent, so a mark stands out from the ink wireframe it often crosses.
  const look = { color: 'accent', thickness: 0.022, parent: hero };
  const mark = (helper, along = null) => ({
    ...pinned(labels.add({ text: '', node: hero }), along),
    helper,
    tagged: false,
  });
  const bars = [0, 1, 2].map(() =>
    mark(new DimensionHelper(look), new Vector3()),
  );
  const arrows = [0, 1].map(() =>
    mark(new ArrowHelper({ ...look, xray: true })),
  );
  // The tube's sweep runs round behind the tube, so it draws over it.
  const sweeps = {
    ring: mark(new AngleHelper({ ...look, wedge: false })),
    tube: mark(new AngleHelper({ ...look, wedge: false, xray: true })),
  };
  const circle = new PathHelper({ ...look, closed: true, xray: true });
  const marks = [...bars, ...arrows, sweeps.ring, sweeps.tube];
  let values = {};
  let barsUsed = 0;
  let arrowsUsed = 0;

  /** Shows a mark for `key`, its tag naming it, pinned at `pin` and pushed away from `away` */
  function show(m, key, pin, away) {
    m.helper.visible = m.tagged = true;
    m.tag.text = key;
    m.tag.at.copyFrom(pin);
    m.away.copyFrom(away);
  }

  return {
    clear(next) {
      values = next;
      barsUsed = arrowsUsed = 0;
      for (const m of marks) m.helper.visible = m.tagged = false;
      circle.visible = false;
    },
    bar(key, start, end, out, ticks) {
      const m = bars[barsUsed++];

      _edge.copyFrom(start).add(end).multiplyScalar(0.5);
      _from.copyFrom(start).addScaledVector(out, BAR_GAP);
      _to.copyFrom(end).addScaledVector(out, BAR_GAP);
      m.helper.divisions = Number(values[`${key}Segments`]);
      m.helper.ticks = ticks ?? null;
      m.helper.set(_from, _to);
      m.along?.copyFrom(_to);
      show(m, key, m.helper.middle, _edge);
    },
    arrow(key, from, to, pin = to, away = from) {
      const m = arrows[arrowsUsed++];

      m.helper.set(from, to);
      show(m, key, pin, away);
      m.tagged = Number(values[key]) > 0;
    },
    sweep(which, key, at) {
      const m = sweeps[which];

      m.helper.position.copyFrom(at.centre);
      m.helper.setAxis(at.axis, at.from);
      m.helper.radius = at.radius;
      m.helper.radians = Number(values[key]);
      show(m, key, at.pin, at.centre);
    },
    circle(radius) {
      circle.setPoints(PathHelper.circle(radius, _circle.length / 3, _circle));
      circle.visible = true;
    },
    update() {
      for (const m of marks) {
        m.tag.hidden = !m.helper.visible || !m.tagged;
        if (!m.tag.hidden) pushOut(view3d, m);
      }
      for (const m of marks) {
        if (!m.tag.hidden) keepClear(m, marks);
      }
      for (const pin of axisTags) {
        pushOut(view3d, pin);
        keepClear(pin, marks);
      }
    },
  };
}
