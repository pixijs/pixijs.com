/**
 * What the frame draws to explain the second cameras: the security camera's view volume and its footprint on the
 * floor, a frame round the minimap naming its camera, and the divider and names of a split screen's halves
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { Rectangle } from 'pixi.js';

import { FrustumHelper } from './theme/FrustumHelper';
import { LabelLayer } from './theme/LabelLayer';
import { viewRect } from './theme/overlay';
import { Panel } from './theme/Panel';
import { ScreenLines } from './theme/ScreenLines';

/** How far above the camera the tag hangs, so it clears the head */
const TAG_LIFT = 0.5;
/** The panel's rim round the minimap, and how far in from the panel's corner its title starts, in px */
const RIM = 4;
const TAG_INSET = 8;
/** The gap between the split screen's divider and its tags, and theirs to the screen's edge, in px */
const SPLIT_GAP = 8;
const SPLIT_EDGE = 16;

export function createVisuals(options) {
  const { app, view3d, stage, securityCamera, minimap } = options;
  const { position } = securityCamera;
  const frustum = new FrustumHelper({
    camera: securityCamera,
    color: 'accent',
    thickness: 0.025,
    // The edges run down to the floor, and 12 along the camera's view is past where they meet it at any height.
    floor: 0,
    length: 12,
    fill: 0.12,
    // See-through, so it draws with the transparent meshes: the second cameras redraw only the opaque ones, so it
    // stays out of their pictures and only the main view shows it.
    opacity: 0.9,
    // The scene has a clay camera head of its own.
    body: false,
    parent: view3d.root,
  });
  // Tags on the scene stay inside player one's half of a split; tags on the 2D pictures go anywhere on screen.
  const labels = new LabelLayer({ view3d, stage });
  const screenLabels = new LabelLayer({ view3d, stage, bounds: app.screen });
  const cameraTag = labels.add({ text: 'security camera', color: 'accent' });
  const mapPanel = new Panel({ stage, radius: 8 });
  // The picture's soft edge, as an InsetView draws it.
  const mapEdge = new ScreenLines({ stage, width: 1, alpha: 0.3 });
  const mapTitle = screenLabels.add({
    text: 'map camera',
    screen: { x: 0, y: 0 },
    anchor: { x: 0, y: 1 },
  });
  const divider = new ScreenLines({ stage, width: 2 });
  const playerOneTag = screenLabels.add({
    text: 'player one',
    screen: { x: 0, y: 0 },
  });
  const playerTwoTag = screenLabels.add({
    text: 'player two',
    screen: { x: 0, y: 0 },
    anchor: { x: 0, y: 0 },
  });
  const playerOneHalf = new Rectangle();
  const mapShown = new Rectangle();
  let splitShown = null;
  let widthShown = 0;
  let heightShown = 0;

  // The panel goes under the minimap, so it frames the picture rather than covering it.
  app.stage.addChildAt(mapPanel, app.stage.getChildIndex(minimap));
  app.stage.addChild(mapEdge, divider, labels, screenLabels);

  /** Frames the minimap wherever `index.ts` put it, redrawing only when it moved or resized */
  function frameMinimap() {
    const { x, y, width, height } = minimap;

    mapPanel.visible = mapEdge.visible = minimap.visible;
    mapTitle.hidden = !minimap.visible;
    if (
      x === mapShown.x &&
      y === mapShown.y &&
      width === mapShown.width &&
      height === mapShown.height
    )
      return;
    mapShown.set(x, y, width, height);
    mapPanel.position.set(x - RIM, y - RIM);
    mapPanel.setSize(width + RIM * 2, height + RIM * 2);
    mapEdge.clear().rect(x - 0.5, y - 0.5, width + 1, height + 1);
    // On the panel's top edge, overlapping it by the rim, so it never covers the picture.
    mapTitle.screen?.set(x - RIM + TAG_INSET, y);
  }

  /** The divider between the halves and the names beside it, laid out again when the split or the screen changes */
  function showSplit() {
    const { width, height } = view3d.camera.viewport;
    // The view's camera fills less than the whole view only while the screen is split.
    const split = width < 1 || height < 1;
    const { width: screenWidth, height: screenHeight } = app.screen;

    if (
      split === splitShown &&
      screenWidth === widthShown &&
      screenHeight === heightShown
    )
      return;
    splitShown = split;
    widthShown = screenWidth;
    heightShown = screenHeight;
    divider.clear();
    playerOneTag.hidden = playerTwoTag.hidden = !split;
    if (!split) return;
    viewRect(view3d, playerOneHalf);
    // Side by side, player one is the left half and the names sit at the top either side of the divider. Stacked,
    // player one is the bottom half and the names sit at the right above and below it.
    if (width < 1) {
      divider.line(
        playerOneHalf.right,
        playerOneHalf.top,
        playerOneHalf.right,
        playerOneHalf.bottom,
      );
      playerOneTag.screen?.set(playerOneHalf.right - SPLIT_GAP, SPLIT_EDGE);
      playerOneTag.anchor.set(1, 0);
      playerTwoTag.screen?.set(playerOneHalf.right + SPLIT_GAP, SPLIT_EDGE);
      playerTwoTag.anchor.set(0, 0);
    } else {
      divider.line(
        playerOneHalf.left,
        playerOneHalf.top,
        playerOneHalf.right,
        playerOneHalf.top,
      );
      playerTwoTag.screen?.set(
        screenWidth - SPLIT_EDGE,
        playerOneHalf.top - SPLIT_GAP,
      );
      playerTwoTag.anchor.set(1, 1);
      playerOneTag.screen?.set(
        screenWidth - SPLIT_EDGE,
        playerOneHalf.top + SPLIT_GAP,
      );
      playerOneTag.anchor.set(1, 0);
    }
  }

  return {
    update(dt) {
      frustum.update();
      cameraTag.at.set(position.x, position.y + TAG_LIFT, position.z);
      frameMinimap();
      mapPanel.update(dt);
      mapEdge.update();
      showSplit();
      divider.update();
      labels.update();
      screenLabels.update();
    },
  };
}
