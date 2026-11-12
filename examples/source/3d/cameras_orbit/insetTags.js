/**
 * The inset's tags, each beside the mark it names and clear of the rest. A tag tries points along its mark, from the
 * middle out, and eight sides round each, its own side first. It never covers the camera's glyph, the ghost, the
 * logo, a tag placed before it or more than the end of the mark it names; of the places left it takes the one that
 * hides the least of the marks, each counted as a share of its length so a short arrow weighs as much as a long arc,
 * and an arrow's head as the whole arrow, since it shows which way the arrow points. With none left it hides.
 */

import { Vector3 } from '@pixi/3d';

import { Bounds, Point, Rectangle } from 'pixi.js';

/** How far a tag stands off the point it names, in px */
const TAG_GAP = 12;
/** How far a tag keeps off the glyph, the ghost and the logo, in px */
const CLEARANCE = 3;
/** How far back from its tip an arrow's head reaches, in px: four widths of the 1.5 px shaft */
const HEAD_LENGTH = 6;
/** The most of the mark it names that a tag may cover: its end, as a tag at the end of a line does */
const OWN_SHARE = 0.15;
/** The quiet look of the ghost's tag, which names the ghost without drawing the eye */
const QUIET = 0.6;
/** The sides a tag tries, as eighths of a turn from its own, nearest first, each as its cos and sin */
const TURNS = [0, 1, -1, 2, -2, 3, -3, 4].flatMap((eighths) => [
  Math.cos((eighths * Math.PI) / 4),
  Math.sin((eighths * Math.PI) / 4),
]);
/** Where along its mark a tag may stand, as shares of the mark from its middle outward */
const SLIDES = [0.5, 0.375, 0.625, 0.25, 0.75];

/** Which way a tag stands off its point: away from the target, across the line from it on its upper side, or below */

const _point = new Point();
const _target = new Point();
const _facing = new Point();
const _candidate = new Rectangle();
const _bounds = new Bounds();
/** The part of a step still inside the rect being tested, from its start and from its end */
let _enter = 0;
let _leave = 1;

/** Clips the step being tested to one side of a rect, `false` once nothing of it is left (Liang and Barsky's test) */
function clip(toward, room) {
  if (toward === 0) return room >= 0;

  const t = room / toward;

  if (toward < 0) _enter = Math.max(_enter, t);
  else _leave = Math.min(_leave, t);

  return _enter <= _leave;
}

/** Whether the step from `a` to `b` runs through `rect` */
function crosses(rect, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  _enter = 0;
  _leave = 1;

  return (
    clip(-dx, a.x - rect.left) &&
    clip(dx, rect.right - a.x) &&
    clip(-dy, a.y - rect.top) &&
    clip(dy, rect.bottom - a.y)
  );
}

/** Lays the inset's four tags out each frame, for the marks as `marks.update()` just placed them */
export function createInsetTags({ inset, orbit, marks, logo }) {
  const labels = inset.labels;
  const tag = (text, color, side, own) => ({
    label: labels.add({ text, color }),
    side,
    own,
    anchors: own
      ? SLIDES.map((share) => own[Math.round(share * (own.length - 1))])
      : [marks.ghostEye],
    rect: new Rectangle(),
  });
  /** First to last in the order that keeps its place */
  const tags = [
    tag('polarAngle', 'y', 'away', marks.paths.polar),
    // Under the level ring, where the bottom of the picture has room for the widest tag.
    tag('azimuthAngle', 'z', 'below', marks.paths.azimuth),
    tag('distance', null, 'across', marks.paths.distance),
    tag('saved pose', null, 'below', null),
  ];
  const saved = tags[tags.length - 1];
  /** Every mark as a run of points in world space, where they land on screen, and its length there in px */
  const paths = Object.values(marks.paths).map((world) => ({
    world,
    screen: world.map(() => new Point()),
    length: 0,
  }));
  /** The zero arrows' tips, and the boxes round their heads on screen */
  const upTip = [marks.paths.up[1]];
  const frontTip = [marks.paths.front[1]];
  const upHead = new Rectangle();
  const frontHead = new Rectangle();
  // The logo stands still, so its box's corners are found once.
  const logoCorners = [0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
    new Vector3(i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1)
      .multiply(logo.half)
      .add(logo.root.position),
  );
  /** The glyph's, the ghost's and the logo's boxes on screen, in global px */
  const glyph = new Rectangle();
  const ghost = new Rectangle();
  const logoBox = new Rectangle();

  saved.label.alpha = QUIET;

  /** The screen box round `points`, grown by the clearance; the inset's orthographic camera projects every point */
  function boxOf(points, out) {
    _bounds.clear();
    for (const point of points) {
      inset.project(point, _point);
      _bounds.addFrame(_point.x, _point.y, _point.x, _point.y);
    }

    return out.copyFromBounds(_bounds).pad(CLEARANCE);
  }

  /**
   * How much of the marks `rect` hides, as the sum of the share of each it covers and 1 for each arrow's head; -1 past
   * `OWN_SHARE` of `own`
   */
  function hidden(rect, own) {
    let shares =
      Number(rect.intersects(upHead)) + Number(rect.intersects(frontHead));

    for (const { world, screen, length } of paths) {
      let share = 0;

      for (let i = 1; i < screen.length; i++) {
        const a = screen[i - 1];
        const b = screen[i];

        if (crosses(rect, a, b))
          share +=
            ((_leave - _enter) * Math.hypot(b.x - a.x, b.y - a.y)) /
            (length || 1);
      }
      if (world === own && share > OWN_SHARE) return -1;
      shares += share;
    }

    return shares;
  }

  /** Whether `rect` lands on the glyph, the logo, the ghost unless it's the ghost's tag, or a tag before `index` */
  function blocked(rect, index) {
    if (rect.intersects(glyph) || rect.intersects(logoBox)) return true;
    if (tags[index] !== saved && rect.intersects(ghost)) return true;
    for (let j = 0; j < index; j++)
      if (!tags[j].label.hidden && rect.intersects(tags[j].rect)) return true;

    return false;
  }

  /** The way `side` points from `_point`, as a unit vector into `_facing` */
  function face(side) {
    const awayX = _point.x - _target.x;
    const awayY = _point.y - _target.y;
    // Of the two square to the line from the target, the one that points up the screen.
    const up = awayX > 0 ? 1 : -1;

    if (side === 'away') _facing.set(awayX, awayY);
    else if (side === 'across') _facing.set(awayY * up, -awayX * up);
    else _facing.set(0, 1);

    const length = Math.hypot(_facing.x, _facing.y) || 1;

    _facing.set(_facing.x / length, _facing.y / length);
  }

  /** The rect a tag takes standing off `_point` toward (x, y), slid inside the picture the way its layer slides it */
  function rectToward(x, y, width, height, out) {
    const { picture } = inset;
    const margin = labels.margin;
    const left = _point.x + x * TAG_GAP - (0.5 - 0.5 * x) * width;
    const top = _point.y + y * TAG_GAP - (0.5 - 0.5 * y) * height;

    return out.set(
      Math.max(
        picture.x + margin,
        Math.min(left, picture.right - margin - width),
      ),
      Math.max(
        picture.y + margin,
        Math.min(top, picture.bottom - margin - height),
      ),
      width,
      height,
    );
  }

  /** Lays the `index`th tag out in its clearest place, or hides it when every place is blocked */
  function layOut(index) {
    const { label, side, own, anchors, rect } = tags[index];
    const { width, height } = label.getLocalBounds();
    let least = Infinity;

    label.hidden = true;
    for (let a = 0; a < anchors.length && least > 0; a++) {
      if (
        !inset.project(anchors[a], _point) ||
        !inset.picture.contains(_point.x, _point.y)
      )
        continue;
      // On the saved pose the ghost sits under the camera's glyph, so it has nothing to name.
      if (tags[index] === saved && glyph.contains(_point.x, _point.y)) return;
      face(side);
      for (let i = 0; i < TURNS.length && least > 0; i += 2) {
        const x = _facing.x * TURNS[i] - _facing.y * TURNS[i + 1];
        const y = _facing.x * TURNS[i + 1] + _facing.y * TURNS[i];

        if (blocked(rectToward(x, y, width, height, _candidate), index))
          continue;

        const covered = hidden(_candidate, own);

        if (covered < 0 || covered >= least) continue;
        least = covered;
        rect.copyFrom(_candidate);
        label.at.copyFrom(anchors[a]);
        label.offset.set(x * TAG_GAP, y * TAG_GAP);
        label.anchor.set(0.5 - 0.5 * x, 0.5 - 0.5 * y);
        label.hidden = false;
      }
    }
  }

  return {
    update() {
      for (const path of paths) {
        const { world, screen } = path;

        path.length = 0;
        for (let i = 0; i < world.length; i++) {
          inset.project(world[i], screen[i]);
          if (i > 0)
            path.length += Math.hypot(
              screen[i].x - screen[i - 1].x,
              screen[i].y - screen[i - 1].y,
            );
        }
      }
      boxOf(marks.glyphPoints, glyph);
      boxOf(marks.ghostPoints, ghost);
      boxOf(logoCorners, logoBox);
      boxOf(upTip, upHead).pad(HEAD_LENGTH);
      boxOf(frontTip, frontHead).pad(HEAD_LENGTH);
      inset.project(orbit.target, _target);
      for (let i = 0; i < tags.length; i++) layOut(i);
      labels.update();
    },
  };
}
