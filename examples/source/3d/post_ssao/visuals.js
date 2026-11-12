/**
 * What the frame draws to explain ambient occlusion: two panels, the frame without the effect and the occlusion the
 * effect multiplies in, on the right under the pane or along the bottom
 *
 * Each `View3D` draws its own world, so each panel holds copies of the props that share their geometry. The `without
 * SSAO` panel's copies wear the same clay on a stage of their own, with no post effect. The `occlusion only` panel's
 * copies are flat white on a white floor and run through the lesson's own effect, so what's left is the grey the
 * effect multiplies onto the frame. Both cameras look the way the main one does, framed on the props. It reads the
 * scene each frame and never changes it, so `index.ts` runs the same without it; on a screen too narrow for the props
 * at their landscape distance, it keeps a band at the bottom of the main view free for the panels.
 */

import { Material3D, Mesh3D, PlaneGeometry } from '@pixi/3d';

import { InsetView } from './theme/InsetView';
import { NARROW_BELOW } from './theme/overlay';
import { BRAND, mixColor, screenColor, THEMES } from './theme/palette';

import { ThemeStage } from './theme/ThemeStage';

/**
 * Each picture's size in px, 16:9 like the main view at 1280 × 720; the smallest that still reads, 144 px wide, room
 * for the `occlusion only` tag; and its height on a phone
 */
const PICTURE = { width: 288, height: 162, minHeight: 81, narrowHeight: 190 };
/** The column keeps the panels with the pane, so it wins over a row whose pictures come out up to 5% bigger */
const COLUMN_BIAS = 0.95;
/**
 * How far the props and the grey round them reach at the opening pose, in shares of the screen's height from its
 * middle: to either side, and down. The panels keep out of that box.
 */
const SUBJECT = { side: 0.5, below: 0.23 };
/** The kit's 24 px from a panel to the screen's edge, and its 8 px between panels */
const MARGIN = 24;
const GAP = 8;
/** How far a title tag stands out above its panel, so a stacked panel sits that much further off */
const TAG = 15;
/** The px a panel adds round its picture: its 4 px rim on each side */
const RIM = 8;
/** Px the framing leaves round the props, room for the grey that spreads past them on the floor */
const FRAME_MARGIN = 14;
/** The occlusion panel's floor: small, so no far floor runs out to the horizon */
const OCCLUSION_FLOOR_SIZE = 12;
/**
 * The occlusion panel's white on the dark theme: soft ink dimmed toward the floor, so the panel doesn't outshine the
 * props, yet light enough for the grey to show
 */
const DARK_GROUND = mixColor(THEMES.dark.inkSoft, THEMES.dark.floor, 0.3);

/** Copies every prop under `parent`, sharing its geometry, in its own material or in `material` */
function copyProps(cluster, parent, material) {
  return cluster.props.map(
    (source) =>
      new Mesh3D({
        geometry: source.geometry,
        material: material ?? source.material,
        position: source.position,
        rotation: source.rotation,
        scale: source.scale,
        parent,
      }),
  );
}

/** The corners of every prop's box as it rests, in world space: what the panels frame */
function cornersOf(props) {
  return props.flatMap((prop) => {
    const { min, max } = prop.getLocalBounds();

    return [0, 1, 2, 3, 4, 5, 6, 7].map((i) =>
      prop.toGlobal({
        x: i & 1 ? max.x : min.x,
        y: i & 2 ? max.y : min.y,
        z: i & 4 ? max.z : min.z,
      }),
    );
  });
}

export function createVisuals({
  app,
  view3d,
  stage,
  cluster,
  effect,
  pane,
  fit,
}) {
  const mainCamera = view3d.camera;
  // The occlusion panel docks in the bottom-right corner. The other docks there too, on a screen moved up or left
  // by the occlusion panel and the gap, so it sits above it or beside it as the layout picks.
  const withoutScreen = app.screen.clone();
  const panel = {
    app,
    stage,
    corner: 'bottom-right',
    width: PICTURE.width,
    height: PICTURE.height,
    narrow: { width: 'full', height: PICTURE.narrowHeight },
  };
  const occlusion = new InsetView({ ...panel, title: 'occlusion only' });
  const without = new InsetView({
    ...panel,
    screen: withoutScreen,
    title: 'without SSAO',
  });
  // Own-scene insets always have their own view.
  const withoutView = without.view3d;
  const occlusionView = occlusion.view3d;
  // The same floor, fog, fill and lights as the main view, faded with it.
  const withoutStage = new ThemeStage(withoutView, { theme: stage.theme });
  // Flat colour, written as emissive so it shows exactly; it still writes the depth the effect reads.
  const white = new Material3D({
    baseColor: 0,
    roughness: 1,
    specular: { factor: 0 },
    emissive: { color: BRAND.white },
    fog: false,
  });
  // Built with an emissive group, so it has one.
  const whiteGlow = white.emissive;
  const ballIndex = cluster.props.indexOf(cluster.ball);
  const withoutBall = copyProps(cluster, withoutView.root)[ballIndex];
  const occlusionBall = copyProps(cluster, occlusionView.root, white)[
    ballIndex
  ];
  const corners = cornersOf(cluster.props);
  const laidOut = { width: 0, height: 0 };
  let darkness = -1;
  let stacked = true;
  // Tweakpane's fold animates the pane's height, and the observer follows it frame by frame.
  let paneResized = true;

  new ResizeObserver(() => (paneResized = true)).observe(pane.element);

  // As in the main view, so the two pictures differ by the effect alone.
  withoutStage.key.castShadow = false;
  new Mesh3D({
    geometry: new PlaneGeometry({
      width: OCCLUSION_FLOOR_SIZE,
      height: OCCLUSION_FLOOR_SIZE,
    }),
    material: white,
    rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    parent: occlusionView.root,
  });
  occlusionView.passes = [effect];
  app.stage.addChild(without, occlusion);

  /**
   * Turns a panel's camera the way the main one faces and moves it along that line until the props fill the
   * picture: the same view, closer. `frame()` fits near and far round the props, which would cut the floor off short
   * of the fog, so they go back to the main camera's.
   */
  function follow(inset, panelView) {
    const camera = panelView.camera;

    camera.fov = mainCamera.fov;
    camera.quaternion = mainCamera.quaternion;
    camera.position.copyFrom(mainCamera.position);
    inset.frame(corners, FRAME_MARGIN);
    camera.near = mainCamera.near;
    camera.far = mainCamera.far;
  }

  /**
   * Stacks the panels down the right under the pane, or sets them side by side along the bottom, keeping their 16:9
   * shape: a wide screen has room beside the props, a squarer one under them. Under an open pane on a short screen
   * neither has room, so the row takes the smallest pictures that read and reaches into the props' corner, where the
   * floor is bare. On a phone they span its width, stacked along the bottom. Runs when the screen's size or the pane's
   * height changes.
   */
  function layOut() {
    const { width, height } = app.screen;

    if (!paneResized && width === laidOut.width && height === laidOut.height)
      return;
    paneResized = false;
    laidOut.width = width;
    laidOut.height = height;

    const paneBottom = pane.element.getBoundingClientRect().bottom;
    const toHeight = PICTURE.height / PICTURE.width;
    // Two pictures and two tags between the pane and the screen's bottom, right of the props.
    const columnHeight = Math.min(
      PICTURE.height,
      (height - paneBottom - MARGIN - 2 * (GAP + TAG + RIM)) / 2,
      (width / 2 - SUBJECT.side * height - GAP - MARGIN - RIM) * toHeight,
    );
    // One picture and its tag under the props, and two pictures across.
    const rowHeight = Math.min(
      PICTURE.height,
      height * (0.5 - SUBJECT.below) - GAP - TAG - RIM - MARGIN,
      ((width - 2 * MARGIN - GAP) / 2 - RIM) * toHeight,
    );

    stacked =
      width < NARROW_BELOW ||
      (columnHeight >= PICTURE.minHeight &&
        columnHeight >= rowHeight * COLUMN_BIAS);

    const pictureHeight = Math.round(
      Math.max(stacked ? columnHeight : rowHeight, PICTURE.minHeight),
    );

    without.setSize(Math.round(pictureHeight / toHeight), pictureHeight);
    occlusion.setSize(Math.round(pictureHeight / toHeight), pictureHeight);
  }

  /** Docks both panels, then keeps their band free of the props on a view narrower than the fit's `minAspect` */
  function dock(dt) {
    const { width, height } = app.screen;
    const { rect } = occlusion;

    occlusion.update(dt);
    withoutScreen.set(
      stacked ? 0 : -(rect.width + GAP),
      stacked ? -(rect.height + GAP + TAG) : 0,
      width,
      height,
    );
    without.update(dt);

    const clearBottom = height - without.rect.y + TAG + GAP;

    if (fit.clearBottom !== clearBottom) {
      fit.clearBottom = clearBottom;
      fit.refit();
    }
  }

  return {
    setEffect(next) {
      occlusionView.passes = [next];
    },
    update(dt) {
      if (stage.darkness !== darkness) {
        darkness = stage.darkness;
        withoutStage.darkness = darkness;

        const shade = screenColor(mixColor(BRAND.white, DARK_GROUND, darkness));

        whiteGlow.color = shade;
        occlusionView.background = shade;
      }
      layOut();
      withoutBall.position.copyFrom(cluster.ball.position);
      occlusionBall.position.copyFrom(cluster.ball.position);
      follow(without, withoutView);
      follow(occlusion, occlusionView);
      dock(dt);
    },
  };
}
