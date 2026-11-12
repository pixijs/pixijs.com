/**
 * What the frame draws to explain a first-person camera: the maze from above, with the camera drawn into it
 *
 * Nobody can see the camera they look through, so a corner plan shows it from outside: a `FrustumHelper` at the
 * camera's position, facing its yaw, over a flat copy of the maze. It reads the camera each frame and never changes
 * it, so `index.ts` runs the same without it.
 */

import { Container3D, Mesh3D, PlaneGeometry, Vector3 } from '@pixi/3d';

import { Rectangle } from 'pixi.js';

import { FrustumHelper } from './theme/FrustumHelper';
import { createHelperMaterial } from './theme/HelperMaterial';
import { helperMaterial } from './theme/helpers';
import { InsetView } from './theme/InsetView';
import { NARROW_BELOW, overlayColor } from './theme/overlay';
import { CLAY } from './theme/palette';

import { STICK_REACH } from './joystick';
import { buildMazeWalls, MAZE_EDGE, WALKER_RADIUS } from './scene';

/** The plan's picture at its largest, in px, and on a phone */
const PLAN = { width: 208, height: 260 };
const PLAN_NARROW = { width: 144, height: 180 };
/**
 * Px the panel's rim, its gap to the stick or the screen's bottom and its gap under the pane (room for its title tag)
 * add to the picture
 */
const PLAN_ROOM = 8 + 24 + 24;
/** The shortest the picture gets, in px: with less room above the stick it moves beside it, and with less there it hides */
const PLAN_MIN_HEIGHT = 120;
/** The frustum's line width and the camera body's length behind the eye, in CSS px, whatever the plan's scale */
const LINE_PX = 1.5;
const GLYPH_PX = 14;
/** The view volume's depth: the walker's radius, so it reaches a wall the walker stands against and never crosses it */
const FRUSTUM_DEPTH = WALKER_RADIUS;
/** How far the outer walls reach past the maze's edge, so the plan shows them whole */
const WALL_ROOM = 0.2;
/**
 * Px of room round the area the walker can reach. The camera's body sits behind the eye, so more below, for the eye at
 * the area's back edge, and either side, for the eye at a side facing across the plan.
 */
const MARGIN = { top: 8, bottom: 22, left: 20, right: 20 };
/** The sheet under the plan, wider than any picture of it, in units */
const PAPER_SIZE = 60;

export function createVisuals({ app, view3d, stage, maze, pane }) {
  // The part of the screen the plan docks in the bottom-right corner of: above the stick, so the pane, the plan and the
  // stick stack down the right side, or left of the stick when a short screen has no room above it.
  const dock = new Rectangle().copyFrom(app.screen);
  const plan = new InsetView({
    app,
    stage,
    title: 'from above',
    screen: dock,
    corner: 'bottom-right',
    mode: 'orthographic',
    width: PLAN.width,
    height: PLAN.height,
    // The kit centres a bottom panel on a phone; this one keeps the corner, by the stick.
    narrow: { corner: 'bottom-right' },
  });
  // An own-scene inset always has a root and a camera.
  const root = plan.root;
  const planCamera = plan.camera;
  const framed = [
    new Vector3(-maze.area.halfWidth - WALL_ROOM, 0, -MAZE_EDGE - WALL_ROOM),
    new Vector3(maze.area.halfWidth + WALL_ROOM, 0, maze.area.back),
  ];
  // The inset's own background covers only a 2 × 2 square behind an orthographic camera, a PixiJS 3D bug, so an opaque
  // sheet in the panel's colour lies under the map instead.
  const paper = createHelperMaterial({
    color: overlayColor('panel', stage.darkness),
  });
  // Flattened, so the frustum, at eye height, draws over the walls.
  const flatMaze = new Container3D({
    scale: { x: 1, y: 0.01, z: 1 },
    parent: root,
  });
  const frustum = new FrustumHelper({
    camera: view3d.camera,
    view: view3d,
    length: FRUSTUM_DEPTH,
    parent: root,
  });
  const shown = { darkness: stage.darkness, unitsPerPixel: 0 };

  new Mesh3D({
    geometry: new PlaneGeometry({ width: PAPER_SIZE, height: PAPER_SIZE }),
    material: paper,
    position: { x: 0, y: -0.05, z: 0 },
    // A plane faces +z; this turns it up, at the camera above.
    rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    parent: root,
  });
  buildMazeWalls(
    flatMaze,
    { panel: helperMaterial(CLAY.lilac), post: helperMaterial(CLAY.purple) },
    false,
  );
  // Straight down, with -z up the map and +x to the right.
  planCamera.rotation.x = -Math.PI / 2;
  app.stage.addChild(plan);

  // The plan fits under the pane, open or folded, so the pane never covers it: above the stick while it's tall enough
  // there, else beside the stick along the bottom.
  function fitPlan() {
    const largest = app.screen.width < NARROW_BELOW ? PLAN_NARROW : PLAN;
    const underPane =
      app.screen.height -
      pane.element.getBoundingClientRect().bottom -
      PLAN_ROOM;
    const besideStick = underPane - STICK_REACH < PLAN_MIN_HEIGHT;
    const height = Math.min(
      largest.height,
      besideStick ? underPane : underPane - STICK_REACH,
    );

    dock.copyFrom(app.screen);
    if (besideStick) dock.width -= STICK_REACH;
    else dock.height -= STICK_REACH;
    plan.visible = height >= PLAN_MIN_HEIGHT;
    if (plan.visible)
      plan.setSize(
        Math.round((height * largest.width) / largest.height),
        height,
      );
  }

  fitPlan();
  app.renderer.on('resize', fitPlan);
  // The pane folds and opens too: the reader's fold button, and a mouse lock in index.ts.
  new ResizeObserver(() => fitPlan()).observe(pane.element);

  return {
    update(dt) {
      plan.frame(framed, MARGIN);
      // The plan's scale changes on a resize or a phone turned; the frustum's lines keep their px width.
      if (plan.unitsPerPixel !== shown.unitsPerPixel) {
        shown.unitsPerPixel = plan.unitsPerPixel;
        frustum.thickness = LINE_PX * plan.unitsPerPixel;
        frustum.size = GLYPH_PX * plan.unitsPerPixel;
      }
      if (stage.darkness !== shown.darkness) {
        shown.darkness = stage.darkness;
        paper.color = overlayColor('panel', stage.darkness);
      }
      frustum.update();
      plan.update(dt);
    },
  };
}
