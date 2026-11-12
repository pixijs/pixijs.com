/**
 * Finding a node by its label, and moving it to a new parent with `addChild` or `reparentChild`
 *
 * A node's `label` is a name you give it to search by: `view3d.root.getChildByLabel('js', true)` finds the logo's JS
 * badge anywhere below the root, and without `deep` it checks only the root's own children, the two boards. A node's
 * `position` and `quaternion` are measured in its parent's space, and the boards face different ways, so moving a
 * piece to the other board is a choice: `addChild` keeps the numbers, and the piece jumps to the same spot on the new
 * board, turned with it; `reparentChild` keeps the piece where it is in the world and rewrites the numbers. Either way
 * the old parent emits `childRemoved`, the piece `removed`, the new parent `childAdded` and the piece `added`.
 *
 * Controls: drag to orbit; in the pane, pick a label to find and whether the search goes `deep`, then press
 * `addChild` or `reparentChild` to move the found piece to the other board and watch its `position`, or Reset to put
 * the logo back. URL flags: `?theme=light|dark`, `?renderer=webgl|webgpu`.
 */

import { Container3D, View3D } from '@pixi/3d';
import { Application } from 'pixi.js';

import { rendererPreference } from './getPreference';
import { LoadingScreen } from './theme/LoadingScreen';
import { LOGO_PIECES, loadPixiLogo } from './theme/logo';
import { THEMES, themeFromUrl } from './theme/palette';
import { ThemePane } from './theme/ThemePane';
import { ThemeStage } from './theme/ThemeStage';
import { createControls } from './controls';

import { BELOW_ORIGIN, dressBoards, placeCamera } from './scene';
import { createVisuals } from './visuals';

/** Small enough that the logo fits a board, and both boards fit beside the pane */
const LOGO_WIDTH = 3;
/**
 * Each board's origin, the left one at -x: the middle of its face, near its foot on the floor. The boards stand a
 * quarter turn apart like an open book, so a walk-off (`reparentChild`, then `addChild`) swings a piece round a point in
 * front of them, and four bring it back; side by side, each would carry it a board's width further off.
 */
const BOARD_AT = { x: 1.46, y: BELOW_ORIGIN, z: 0.41 };
const BOARD_TURN = 45;
/** How far the logo's centre sits above a board's origin, which leaves the space below it for the board's axes */
const LOGO_LIFT = 1.15;
/** How far the logo's back stands off a board's face, so the two never touch */
const STANDOFF = 0.03;

const theme = themeFromUrl();
// Up before the renderer, so the page is never blank.
const loading = new LoadingScreen({ theme, label: 'Find and reparent' });
const app = new Application();

await app.init({
  preference: rendererPreference,
  resizeTo: window,
  background: THEMES[theme].haze,
  antialias: true,
  autoStart: false,
  resolution: Math.min(window.devicePixelRatio, 2),
  autoDensity: true,
});
loading.progress(0.2);

// At the screen's size from the start, so the first frame's tags are placed for it.
const view3d = new View3D({
  autoResize: true,
  width: app.screen.width,
  height: app.screen.height,
});
const stage = new ThemeStage(view3d, { theme });
const logo = await loading.load(() => loadPixiLogo({ width: LOGO_WIDTH }));

app.stage.addChild(view3d);

// A label is the name a search finds a node by. `leftBoard` is only how this file holds the node labelled 'left'.
const leftBoard = new Container3D({
  label: 'left',
  position: { x: -BOARD_AT.x, y: BOARD_AT.y, z: BOARD_AT.z },
  angle: { x: 0, y: BOARD_TURN, z: 0 },
  parent: view3d.root,
});
const rightBoard = new Container3D({
  label: 'right',
  position: BOARD_AT,
  angle: { x: 0, y: -BOARD_TURN, z: 0 },
  parent: view3d.root,
});
const boards = [leftBoard, rightBoard];

dressBoards(boards);

// The logo's five pieces are nodes the kit labels 'p', 'ixi', 'dotL', 'dotR' and 'js'. Each moves onto the left board
// with its place in the logo, lifted off the board's origin and stood just in front of its face.
const pieces = LOGO_PIECES.map((id) => {
  const { pivot, rest } = logo.pieces[id];

  pivot.position.set(
    rest.x,
    rest.y + LOGO_LIFT,
    rest.z + logo.half.z + STANDOFF,
  );
  leftBoard.addChild(pivot);

  return pivot;
});
// Where each piece starts, for the pane's Reset.
const seats = pieces.map((piece) => piece.position.clone());

/** The first node below the root labelled `label`, or `null` */
function find(label, deep) {
  // Without `deep` only the root's own children are checked: the boards, not the pieces on them.
  return view3d.root.getChildByLabel(label, deep);
}

/** Moves a piece to another board */
function move(piece, to, method) {
  if (method === 'addChild') {
    // Keeps `position` and `quaternion`, which are measured in the board's space, so the piece takes the same spot on
    // the new board, turned with it.
    to.addChild(piece);
  } else {
    // Keeps the piece's place in the world by writing its `position`, `quaternion` and `scale` for the new board.
    // `rotation` and `angle` aren't rebuilt from the quaternion, so turn a reparented node through `quaternion`.
    to.reparentChild(piece);
  }
}

/**
 * Puts every piece back on the left board as it started. `addChild` keeps whatever numbers a piece holds, and
 * `reparentChild` may have rewritten them, so they're set again too.
 */
function reset() {
  pieces.forEach((piece, i) => {
    leftBoard.addChild(piece);
    piece.position.copyFrom(seats[i]);
    piece.quaternion.set(0, 0, 0, 1);
    piece.scale.set(1);
  });
}

const visuals = createVisuals({ app, view3d, stage, boards, pieces });
const pane = new ThemePane({ title: 'Find and reparent', stage });
const labels = [...LOGO_PIECES, ...boards.map((board) => board.label ?? '')];
// A reset puts the logo back rather than making a move to explain, so it leaves no ghost.
const startOver = () => {
  reset();
  visuals.forgetMoves();
};
const controls = createControls({
  pane,
  labels,
  start: 'js',
  boards,
  pieces,
  find,
  move,
  reset: startOver,
});
// Placed once the pane is full, so a narrow screen keeps the boards below it.
const orbit = placeCamera({ renderer: app.renderer, view3d, stage, pane });

// A parent reports the child it gained or lost, and a child the parent it joined or left.
for (const board of boards) {
  board.on('childRemoved', (child) =>
    controls.log(board, 'childRemoved', child),
  );
  board.on('childAdded', (child) => controls.log(board, 'childAdded', child));
}
for (const piece of pieces) {
  piece.on('removed', (parent) => controls.log(piece, 'removed', parent));
  piece.on('added', (parent) => controls.log(piece, 'added', parent));
}

app.ticker.add((ticker) => {
  stage.update(Math.min(ticker.deltaMS / 1000, 1 / 15));
  visuals.update(controls.found);
});

// The canvas joins with its first frame already drawn, then the loading screen dissolves onto it.
orbit.update();
visuals.update(controls.found);
app.render();
document.body.appendChild(app.canvas);
await loading.finish();
app.start();
