/**
 * The props: the 2D poster that fills the screen behind the view, and the layout that sizes the view inside it
 *
 * The poster is plain pixi 2D: grid paper, three clay-coloured shapes and a headline, laid out round the view's centre
 * so each shape sits behind the same piece of the logo at any screen size.
 */

import { Container, Graphics, Point, Rectangle, Text } from 'pixi.js';

import { helperColorAt, overlayColor, viewRect } from './theme/overlay';

import { CLAY } from './theme/palette';

/** The open pane's column at the right: 260 px wide, 12 px in, then a 16 px gap */
const PANE_COLUMN = 288;
/**
 * The centred view's share of the screen beside an open pane. Of the width, what the pane's columns leave, up to
 * `max`; under `min` (a screen narrower than 960 px) the pane opens folded and the view fills the screen instead. Of
 * the height, room for the logo stood on end, which `index.ts` sets the camera back far enough to fit.
 */
const VIEW_SHARE = { min: 0.4, max: 0.6, height: 0.72 };
/**
 * The view's gaps where it fills the screen: 16 px at the sides and bottom, and 64 px at the top, for the folded pane's
 * bar and, beside it on a short screen, the outline's tag above the view
 */
const FULL_GAP = { side: 16, top: 64 };

/**
 * The poster's shapes in px from the view's centre at 1280 × 720, where the view is 518 px tall and the logo, turned
 * 32°, has the circle behind the P, the triangle inside the `ixi` and the square half behind the JS badge
 */
const LAYOUT_HEIGHT = 518;
const CIRCLE = { x: -190, y: 10, radius: 80 };
/** Purple, not pink, so the P's pale-pink glass shows against it */
const CIRCLE_COLOR = CLAY.purple;
const TRIANGLE = [20, -70, -60, 60, 100, 60];
const SQUARE = { x: 100, y: -70, size: 120, radius: 22 };
/** The headline's top half sits behind the logo's bottom edge, so the glass bends half of every letter */
const HEADLINE = { y: 95, size: 88 };
/**
 * How far from the view's centre the logo reaches on screen, turned any way, in px at that layout: half its width
 * stood on end, and a few px more
 */
const LOGO_REACH = 252;
/** A grid cell in px at that layout, and every fourth line drawn stronger, crossing at the view's centre */
const GRID_CELL = 40;
const MAJOR_EVERY = 4;

/**
 * Whether the view fits beside the open pane, the pane's column kept clear on both sides; it needs a screen 960 px
 * wide. Narrower, a phone either way up or a tablet held upright, the pane opens folded and the view fills the screen.
 */
export function fitsBesidePane(screen) {
  return (screen.width - PANE_COLUMN * 2) / screen.width >= VIEW_SHARE.min;
}

/**
 * Sizes the view so the poster shows round it: centred at a share of the screen beside the open pane, or else filling
 * the screen under the folded pane's bar
 *
 * It writes the view's centre into `position`, so it relies on `index.ts` building the view with `anchor: 0.5`.
 */
export function placeView(view3d, screen) {
  const { width, height } = screen;

  if (fitsBesidePane(screen)) {
    const viewWidth = Math.round(
      width * Math.min(VIEW_SHARE.max, (width - PANE_COLUMN * 2) / width),
    );

    // No taller than it's wide: a narrower view fits the logo across, smaller, so stood on end it needs less height.
    view3d.setSize(
      viewWidth,
      Math.round(Math.min(height * VIEW_SHARE.height, viewWidth)),
    );
    view3d.position.set(Math.round(width / 2), Math.round(height / 2));

    return;
  }

  const viewHeight = height - FULL_GAP.top - FULL_GAP.side;

  view3d.setSize(width - FULL_GAP.side * 2, viewHeight);
  view3d.position.set(width / 2, FULL_GAP.top + viewHeight / 2);
}

/**
 * The 2D page behind the view: paper and grid across the whole screen, and the shapes and headline round its centre
 *
 * It repaints itself in `onRender` when the theme fades and lays itself out again when the screen or the view
 * changes size, a few compares a frame.
 */
export function createPoster({ stage, view3d, screen, fitAspect }) {
  const paper = new Graphics().rect(0, 0, 1, 1).fill(0xffffff);
  const minorGrid = new Graphics();
  const majorGrid = new Graphics();
  const shapes = new Graphics()
    .circle(CIRCLE.x, CIRCLE.y, CIRCLE.radius)
    .fill(CIRCLE_COLOR)
    .poly(TRIANGLE)
    .fill(CLAY.orange)
    .roundRect(SQUARE.x, SQUARE.y, SQUARE.size, SQUARE.size, SQUARE.radius)
    .fill(CLAY.sky);
  const headline = new Text({
    text: 'Drawn in 2D',
    style: {
      fontFamily: 'system-ui, sans-serif',
      fontWeight: '800',
      fontSize: HEADLINE.size,
      fill: 0xffffff,
    },
    anchor: 0.5,
    y: HEADLINE.y,
  });
  const group = new Container({ children: [shapes, headline] });
  const poster = new Container({
    label: 'poster',
    children: [paper, minorGrid, majorGrid, group],
  });
  const triangle = [new Point(), new Point(), new Point()];
  const aboveLogo = new Point();
  const rect = new Rectangle();
  // The view's rect and the screen's at the last layout.
  const laidOut = new Rectangle();
  const laidOutScreen = new Rectangle();
  let paintedDarkness = -1;

  function paint(darkness) {
    paper.tint = helperColorAt('haze', darkness);
    minorGrid.tint = majorGrid.tint = helperColorAt('ink', darkness);
    headline.tint = overlayColor('ink', darkness);
  }

  function layOut() {
    const centreX = rect.x + rect.width / 2;
    const centreY = rect.y + rect.height / 2;
    // As tall as the view, then smaller again where the camera backs off to fit the logo across a narrow view.
    const scale =
      rect.height /
      LAYOUT_HEIGHT /
      Math.max(1, fitAspect / (rect.width / rect.height));

    paper.setSize(screen.width, screen.height);
    drawGrid(minorGrid, majorGrid, screen, centreX, centreY, GRID_CELL * scale);
    group.position.set(centreX, centreY);
    group.scale.set(scale);
    for (let i = 0; i < triangle.length; i++) {
      triangle[i].set(
        centreX + TRIANGLE[i * 2] * scale,
        centreY + TRIANGLE[i * 2 + 1] * scale,
      );
    }
    aboveLogo.set(triangle[0].x, centreY - LOGO_REACH * scale);
  }

  function follow() {
    if (stage.darkness !== paintedDarkness)
      paint((paintedDarkness = stage.darkness));
    viewRect(view3d, rect);
    if (sameRect(rect, laidOut) && sameRect(screen, laidOutScreen)) return;
    laidOut.copyFrom(rect);
    laidOutScreen.copyFrom(screen);
    layOut();
  }

  poster.onRender = follow;
  follow();

  return { poster, triangle, aboveLogo };
}

/** Whether two rects match, since pixi's `Rectangle` has no `equals` */
export function sameRect(a, b) {
  return (
    a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
  );
}

/** Grid lines across the screen, `step` px apart, with a strong line every fourth one through the view's centre */
function drawGrid(minor, major, screen, centreX, centreY, step) {
  minor.clear();
  major.clear();
  for (
    let i = Math.ceil(-centreX / step);
    centreX + i * step <= screen.width;
    i++
  ) {
    const x = centreX + i * step;

    (i % MAJOR_EVERY === 0 ? major : minor)
      .moveTo(x, 0)
      .lineTo(x, screen.height);
  }
  for (
    let i = Math.ceil(-centreY / step);
    centreY + i * step <= screen.height;
    i++
  ) {
    const y = centreY + i * step;

    (i % MAJOR_EVERY === 0 ? major : minor)
      .moveTo(0, y)
      .lineTo(screen.width, y);
  }
  minor.stroke({ color: 0xffffff, width: 1, alpha: 0.12 });
  major.stroke({ color: 0xffffff, width: 1.5, alpha: 0.24 });
}
