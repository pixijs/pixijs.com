/**
 * The page the views sit on: each card's clay product, and where every card's panel and the overview's go on the
 * screen
 *
 * None of it is the lesson. The panels are plain pixi 2D (`ViewPanel.ts`), drawn before the views, so they show round
 * each card's shape.
 */

import { Mesh3D } from '@pixi/3d';

import { Rectangle } from 'pixi.js';

import { clayMaterial } from './theme/clay';
import { CLAY, CLAY_COLORS, mixColor, THEMES } from './theme/palette';
import { clayGeometry } from './theme/shapes';

/** One product card: its 2D panel, and its view with what the view's scene holds */

/** Where each card's panel and the overview's go, in px */

/** The top-right corner the pane keeps, in px: how far in from the screen's right edge it reaches, and how far down */

/** A grid's column and row counts, and each panel's size in it, in px */

/**
 * The products in grid order, each posed so a turn about y shows. No sphere, which looks the same at every angle, and
 * the round shapes lie or stand on their side: upright, a capsule, puck or torus would look the same as it turned too.
 */
const PRODUCTS = [
  { kind: 'cube', pose: { x: 0, y: 0, z: 0 } },
  { kind: 'capsule', pose: { x: 0, y: 0, z: Math.PI / 2 } },
  { kind: 'pyramid', pose: { x: 0, y: 0, z: 0 } },
  { kind: 'puck', pose: { x: 0, y: Math.PI / 2, z: Math.PI / 2 } },
  { kind: 'octahedron', pose: { x: 0, y: 0, z: 0 } },
  { kind: 'torus', pose: { x: 0, y: Math.PI / 2, z: Math.PI / 2 } },
];
/** The clay colours a card can take: white clay would vanish on a white panel */
const CARD_COLORS = CLAY_COLORS.filter((color) => color !== 'white');
/** Narrower than this, a screen puts the overview under the grid even when it's wider than tall */
const LANDSCAPE_MIN_WIDTH = 760;
/**
 * The room over a panel for its title tag, which stands 15 px up past the top edge, and a gap above it: the space
 * between rows, under the pane, and over the portrait overview
 */
const TAG_ROOM = 24;
/** In landscape: the margin round the screen, the room kept left of the pane, and the gap between panels across */
const LANDSCAPE = { margin: 32, gutter: 24, gap: 20 };
/** In portrait, a phone's 12 px edge, which is also the gap between cards across */
const PORTRAIT_EDGE = 12;
/** The portrait overview's height, enough for its frustum and labels at a phone's width */
const PORTRAIT_OVERVIEW = 260;
/** The widest a card's cell grows, in px */
const MAX_CELL = 320;

/**
 * Card `i`'s product: a clay shape in its own colour, its name, and that colour for its panel
 *
 * The kit caches one geometry per shape and one material per colour, so every card that uses them, and the
 * overview's stand-in, shares them. Only the Mesh3D is per view, since a node lives in one scene.
 */
export function createProduct(i) {
  const { kind, pose } = PRODUCTS[i % PRODUCTS.length];
  // Once the shapes come round again the colours shift three places, so no two cards match.
  const color =
    CARD_COLORS[(i + 3 * Math.floor(i / PRODUCTS.length)) % CARD_COLORS.length];
  const shape = new Mesh3D({
    geometry: clayGeometry(kind),
    material: clayMaterial(color),
    rotation: pose,
  });

  return { shape, name: kind, color: CLAY[color] };
}

/** The page's background for a darkness, behind the cards and between them */
export function pageColor(darkness) {
  return mixColor(THEMES.light.haze, THEMES.dark.haze, darkness);
}

/**
 * Where `count` cards and the overview go on `screen`, clear of the `pane`'s corner
 *
 * The overview reads as one more panel of the grid, a row's gap from the cards. In landscape it's the size of a card
 * and follows the last card on the bottom row, and the cards and overview centre as one block. In portrait, or on a
 * screen too narrow for that, it spans the grid's width under it.
 */
export function layoutPage(count, screen, pane) {
  const landscape =
    screen.width >= LANDSCAPE_MIN_WIDTH && screen.width >= screen.height;

  return landscape
    ? overviewBeside(count, screen, pane)
    : overviewUnder(count, screen, pane);
}

/**
 * The landscape page. The overview's row starts under the pane and the rows above it end left of the pane, so when
 * the bottom row is full the overview takes a column of its own and the pane sits in the corner above it.
 */
function overviewBeside(count, screen, pane) {
  const { margin, gutter, gap } = LANDSCAPE;
  const width = screen.width - 2 * margin;
  const height = screen.height - 2 * margin;
  const paneLeft = screen.width - pane.width - gutter;
  const underPane = pane.bottom + TAG_ROOM;
  const grid = bestGrid(count, (columns, rows) => {
    const across = Math.max(
      columns,
      cardsOnBottomRow(count, columns, rows) + 1,
    );
    // The rows above the overview's reach up beside the pane, so they fit left of it; the overview's row fits under it.
    const besidePane =
      rows > 1 ? (paneLeft - margin - (columns - 1) * gap) / columns : Infinity;
    const cellWidth = Math.min(
      MAX_CELL,
      (width - (across - 1) * gap) / across,
      besidePane,
    );
    const cellHeight = Math.min(
      cellWidth,
      (height - (rows - 1) * TAG_ROOM) / rows,
      screen.height - margin - underPane,
    );

    return { cellWidth, cellHeight };
  });
  const { columns, rows, cellWidth, cellHeight } = grid;
  const last = cardsOnBottomRow(count, columns, rows);
  const across = Math.max(columns, last + 1);
  const centredLeft =
    margin + (width - (across * cellWidth + (across - 1) * gap)) / 2;
  const centredTop =
    margin + (height - (rows * cellHeight + (rows - 1) * TAG_ROOM)) / 2;
  // Centred, unless that puts a row above the overview's under the pane, or the overview's row beside it.
  const left =
    rows > 1
      ? Math.min(
          centredLeft,
          paneLeft - (columns * cellWidth + (columns - 1) * gap),
        )
      : centredLeft;
  const top = Math.max(
    centredTop,
    underPane - (rows - 1) * (cellHeight + TAG_ROOM),
  );
  const cell = cellsOf(grid, left, top, gap);

  return {
    cards: cardCells(count, columns, cell),
    overview: cell(last, rows - 1),
  };
}

/** The portrait page: the grid starts under the pane, and the grid and the overview under it centre as one block */
function overviewUnder(count, screen, pane) {
  const edge = PORTRAIT_EDGE;
  const underPane = pane.bottom + TAG_ROOM;
  const width = screen.width - 2 * edge;
  const height = screen.height - edge - underPane;
  const gridHeight = height - TAG_ROOM - PORTRAIT_OVERVIEW;
  const grid = bestGrid(count, (columns, rows) => {
    const cellWidth = Math.min(
      MAX_CELL,
      (width - (columns - 1) * edge) / columns,
    );

    return {
      cellWidth,
      cellHeight: Math.min(
        cellWidth,
        (gridHeight - (rows - 1) * TAG_ROOM) / rows,
      ),
    };
  });
  const { columns, rows, cellWidth, cellHeight } = grid;
  const left =
    edge + (width - (columns * cellWidth + (columns - 1) * edge)) / 2;
  const top =
    underPane +
    (height - (rows * (cellHeight + TAG_ROOM) + PORTRAIT_OVERVIEW)) / 2;
  const cell = cellsOf(grid, left, top, edge);
  const cards = cardCells(count, columns, cell);
  // The row under the last, edge to edge with the cards above it, so rounding can't leave it a pixel out.
  const { x, y } = cell(0, rows);

  return {
    cards,
    overview: new Rectangle(
      x,
      y,
      cards[columns - 1].right - x,
      PORTRAIT_OVERVIEW,
    ),
  };
}

/**
 * The grid, out of every column count from 1 to `count`, whose panels have the longest shorter side, and that size
 *
 * `size` gives a panel's size for a column and row count; a panel is never taller than wide, so its height is the
 * shorter side. Comparing areas would pick long, thin strips.
 */
function bestGrid(count, size) {
  let best = { columns: 1, rows: count, cellWidth: 0, cellHeight: -1 };

  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns);
    const { cellWidth, cellHeight } = size(columns, rows);

    if (cellHeight > best.cellHeight)
      best = { columns, rows, cellWidth, cellHeight };
  }

  return best;
}

/** How many cards the bottom row holds */
function cardsOnBottomRow(count, columns, rows) {
  return count - (rows - 1) * columns;
}

/** The rect at a column and row of `grid`, laid out from (`left`, `top`), `gap` apart across and `TAG_ROOM` down */
function cellsOf(grid, left, top, gap) {
  const { cellWidth, cellHeight } = grid;

  return (column, row) =>
    new Rectangle(
      Math.round(left + column * (cellWidth + gap)),
      Math.round(top + row * (cellHeight + TAG_ROOM)),
      Math.round(cellWidth),
      Math.round(cellHeight),
    );
}

/** Each card's rect, left to right and row by row, from `cell`, which gives the rect at a column and row */
function cardCells(count, columns, cell) {
  const cards = [];

  for (let i = 0; i < count; i++)
    cards.push(cell(i % columns, Math.floor(i / columns)));

  return cards;
}
