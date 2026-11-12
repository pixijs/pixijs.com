/**
 * The props: each board's clay panel, and the camera
 *
 * None of this is the lesson. The boards are lesson nodes built in `index.ts`; this only gives each one a panel to show
 * where it is, and frames the camera on them.
 */

import { Mesh3D } from '@pixi/3d';

import { OrbitCamera } from '@pixi/3d/extras';

import { clayMaterial } from './theme/clay';
import { fitPortrait } from './theme/fitPortrait';
import { roundedBox } from './theme/shapes';

/** The logo's width with a margin each side, and its height with a margin above and the board's axes below */
const PANEL = { width: 3.7, height: 2.15, depth: 0.12, radius: 0.08 };
/**
 * How far the panel reaches below the board's origin, so the origin and its axes sit on the panel's face; a board
 * whose origin stands this high has its panel on the floor
 */
export const BELOW_ORIGIN = 0.2;
/** In front of the V and above it, so both boards face the camera and every walk-off spot stays in view */
const CAMERA = { x: 0, y: 4.65, z: 9.8 };
const TARGET = { x: 0, y: 0.7, z: 0.9 };
/**
 * How far the orbit swings either way, in radians. Each board faces 45° off the camera, so this stops short of
 * turning either one edge-on, and never reaches the boards' backs.
 */
const AZIMUTH = Math.PI / 5;
/**
 * The narrowest view, width over height, that shows both boards whole: clear of the pane when it opens unfolded, as
 * on a desktop window or a tablet, or under it folded to its title, as on a phone. The open pane is a fixed 260 px,
 * so a desktop window under 1.7 would put the right board's corner under it.
 */
const FIT_ASPECT = { open: 1.7, folded: 1.05 };
/** Px between the pane's bottom edge and the band the boards keep to on a narrow screen */
const PANE_GAP = 12;
/**
 * The share of the landscape view's height from the boards' tops to the nearest walk-off spot, which a narrow view's
 * band under the pane keeps whole
 */
const MIN_HEIGHT = 0.55;

/** Gives each board a panel, as the board's child with its face on the board's origin */
export function dressBoards(boards) {
  const geometry = roundedBox(
    PANEL.width,
    PANEL.height,
    PANEL.depth,
    PANEL.radius,
  );
  const material = clayMaterial('white');

  for (const board of boards) {
    new Mesh3D({
      geometry,
      material,
      position: {
        x: 0,
        y: PANEL.height / 2 - BELOW_ORIGIN,
        z: -PANEL.depth / 2,
      },
      parent: board,
    });
  }
}

/**
 * Places the camera in front of the boards with an orbit round them. On a screen narrower than the boards need, it
 * backs off until they fit and drops them below the pane, which takes a bigger share of a narrow screen.
 */
export function placeCamera({ renderer, view3d, stage, pane }) {
  view3d.camera.fov = 40;
  view3d.camera.position.set(CAMERA.x, CAMERA.y, CAMERA.z);

  const orbit = new OrbitCamera({
    view: view3d,
    target: TARGET,
    enableDamping: true,
    enablePan: false,
    minDistance: 6,
    maxDistance: 18,
    // Stays above the floor.
    maxPolarAngle: Math.PI * 0.45,
    minAzimuthAngle: -AZIMUTH,
    maxAzimuthAngle: AZIMUTH,
  });

  // It follows resizes, so a phone turned after load refits. The pane folds or unfolds only as it's built, so its
  // state then decides how narrow a view the boards fit beside it.
  fitPortrait({
    renderer,
    orbit,
    stage,
    minAspect: pane.expanded ? FIT_ASPECT.open : FIT_ASPECT.folded,
    clearTop: pane.element.getBoundingClientRect().bottom + PANE_GAP,
    minHeight: MIN_HEIGHT,
  });

  return orbit;
}
