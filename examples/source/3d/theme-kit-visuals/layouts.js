/**
 * The stations' grids, one for each shape of screen, and the moves that lay the stations out on one and frame the
 * camera on it beside the pane and the inset
 */

import { STATIONS } from './scene';

/**
 * The screen's shape, which picks the stations' layout and the inset's size: wide enough for five columns beside the
 * pane's column, landscape but too small for that (a phone held sideways), or upright
 */

/** A grid of stations, and how the camera frames it */

/** Five columns of three rows */
const WIDE_LAYOUT = {
  columns: 5,
  order: STATIONS,
  cellWidth: 2.7,
  cellDepth: 3.6,
  spread: 0.15,
  center: { x: -0.43, y: 0.2, z: 0.7 },
  elevation: 0.82,
  span: { width: 15.3, height: 9.2 },
  fog: { distance: 16, near: 18, far: 46 },
};

/**
 * Three columns of five rows, read top to bottom on a phone. Its side columns hold the shorter names, since a tag
 * there may only reach the screen's margin; a long second tag sits below a single one beside it. The camera looks
 * almost straight down on the front row, so the fox stands in the back row, the one it sees most from the side.
 */
const TALL_LAYOUT = {
  columns: 3,
  order: [
    'turn',
    'rig',
    'lean',
    'hit',
    'normals',
    'tap',
    'orbit',
    'struck',
    'measure',
    'vertices',
    'lens',
    'lamp',
    'bounds',
    'wire',
    'mark',
  ],
  cellWidth: 4.2,
  cellDepth: 4,
  spread: 0.2,
  center: { x: 0, y: 0, z: 1.5 },
  elevation: 1.3,
  span: { width: 13.2, height: 18.4 },
  fog: { distance: 39, near: 34, far: 80 },
};

/**
 * Four columns of four rows for a phone held sideways, beside the inset's column on the right. A column is only a
 * little wider than the longest tag, so a long name sits beside short ones, and the front row holds the stations with
 * two tags, which have nothing in front of them to cover. The one empty cell is under the mark station, for its two
 * tags.
 */
const COMPACT_LAYOUT = {
  columns: 4,
  order: [
    'lamp',
    'mark',
    'wire',
    'orbit',
    'lens',
    null,
    'rig',
    'vertices',
    'normals',
    'tap',
    'struck',
    'bounds',
    'lean',
    'measure',
    'turn',
    'hit',
  ],
  cellWidth: 4.2,
  cellDepth: 3,
  spread: 0.18,
  center: { x: 0, y: 0, z: 1.3 },
  elevation: 1.2,
  span: { width: 18.7, height: 13.4 },
  fog: { distance: 19, near: 19, far: 50 },
};

/** Each shape's grid */
export const LAYOUTS = {
  wide: WIDE_LAYOUT,
  compact: COMPACT_LAYOUT,
  tall: TALL_LAYOUT,
};

/** The collapsed pane's bar and a gap under it, which a compact or upright screen keeps the stations below, in px */
const PANE_BAR = 48;
/** The space between the stations and the inset, in px */
const GAP = 8;

/** Moves every station to its cell in `layout`, the grid centred on the world's origin */
export function placeStations(scene, layout) {
  const rows = Math.ceil(layout.order.length / layout.columns);

  layout.order.forEach((name, i) => {
    const column = i % layout.columns;
    const row = Math.floor(i / layout.columns);
    const widen =
      1 + (layout.spread * (rows - 1 - row)) / Math.max(rows - 1, 1);

    if (name === null) return;
    scene.stations[name].position.set(
      (column - (layout.columns - 1) / 2) * layout.cellWidth * widen,
      0,
      (row - (rows - 1) / 2) * layout.cellDepth,
    );
  });
}

/**
 * Writes into `out` the part of the screen the stations fit in, given the inset's rect and the pane's left edge in px.
 * On a wide screen the open pane and the inset share a column down the right side, so it's the rest, left of
 * whichever reaches further in. A compact screen's collapsed pane is a bar, wider than its inset, so it keeps under the
 * bar and left of the inset. On an upright screen it's the band between the bar and the inset.
 */
export function clearOfPanels(shape, screen, inset, paneLeft, out) {
  if (shape === 'tall')
    return out.set(0, PANE_BAR, screen.width, inset.y - GAP - PANE_BAR);
  if (shape === 'compact')
    return out.set(0, PANE_BAR, inset.x - GAP, screen.height - PANE_BAR);

  return out.set(0, 0, Math.min(inset.x, paneLeft) - GAP, screen.height);
}

/**
 * Frames the camera so the grid fills `clear`, the part of the screen the panels leave, and sits in its middle. The
 * camera backs off until the grid's span fits both ways, then the orbit's target slides off the grid's middle by as
 * far as the clear part's middle is from the screen's, which moves the picture without turning it. The fog follows
 * the camera's distance.
 */
export function frameStations(orbit, stage, layout, screen, clear) {
  const { center, elevation, span, fog } = layout;
  // Px per world unit at the grid's middle, the most that fits the clear part across and down.
  const scale = Math.min(clear.width / span.width, clear.height / span.height);
  const distance =
    screen.height / (2 * Math.tan((orbit.camera.fov * Math.PI) / 360) * scale);
  // The target moves right to slide the grid left, and towards the camera to slide it up.
  const across = (screen.width / 2 - (clear.x + clear.width / 2)) / scale;
  const up = (screen.height / 2 - (clear.y + clear.height / 2)) / scale;

  orbit.target.set(
    center.x + across,
    center.y,
    center.z + up / Math.sin(elevation),
  );
  orbit.camera.position.set(
    orbit.target.x,
    orbit.target.y + Math.sin(elevation) * distance,
    orbit.target.z + Math.cos(elevation) * distance,
  );
  stage.fog.near = (fog.near * distance) / fog.distance;
  stage.fog.far = (fog.far * distance) / fog.distance;
  orbit.update();
}
