/**
 * The split screen: two views of one scene side by side, or stacked on a portrait screen, that look and move as one
 *
 * Each half is a whole `View3D`, so each keeps its own `environment`. The split sizes and places them, draws the line
 * between them, lets a drag on either half orbit the first view's camera, backs that camera off when a half is too
 * narrow for the subject, and copies the camera, the theme and the fog to the second view each tick, so the halves
 * differ only in what the lesson changes.
 */

import { Rectangle } from 'pixi.js';

import { fitPortrait } from './theme/fitPortrait';
import { ScreenLines } from './theme/ScreenLines';

/** The line between the halves: px wide, and how strongly it shows */
const DIVIDER = { width: 2, alpha: 0.5 };

export function createSplitView({ app, views, stages, orbit, minAspect }) {
  const [main, copy] = views;
  const [mainStage, copyStage] = stages;
  const halves = [new Rectangle(), new Rectangle()];
  const divider = new ScreenLines({
    stage: mainStage,
    width: DIVIDER.width,
    alpha: DIVIDER.alpha,
  });
  let stacked = false;

  // One drag anywhere orbits: the first view spans both halves and draws only into its own, through its camera's
  // viewport, and the second, over the other half, lets the pointer through to it.
  copy.eventMode = 'none';

  function layout() {
    const { width, height } = app.screen;

    stacked = width < height;

    const half = Math.floor((stacked ? height : width) / 2);

    // The second half takes the odd px, so the halves tile the screen and differ in size by 1 px at most.
    if (stacked) {
      halves[0].set(0, 0, width, half);
      halves[1].set(0, half, width, height - half);
    } else {
      halves[0].set(0, 0, half, height);
      halves[1].set(half, 0, width - half, height);
    }
    main.setSize(width, height);
    main.camera.viewport.set(
      0,
      0,
      halves[0].width / width,
      halves[0].height / height,
    );
    copy.position.set(halves[1].x, halves[1].y);
    copy.setSize(halves[1].width, halves[1].height);
    divider.clear();
    if (stacked) divider.line(0, half, width, half);
    else divider.line(half, 0, half, height);
  }

  /** Gives the second view the first one's camera, theme and fog */
  function follow() {
    copy.camera.position.copyFrom(main.camera.position);
    copy.camera.quaternion.copyFrom(main.camera.quaternion);
    copy.camera.fov = main.camera.fov;
    if (copyStage.darkness !== mainStage.darkness)
      copyStage.darkness = mainStage.darkness;
    copyStage.fog.near = mainStage.fog.near;
    copyStage.fog.far = mainStage.fog.far;
  }

  layout();

  // After the first layout, so it measures the first view's camera viewport, a half.
  const fit = fitPortrait({
    renderer: app.renderer,
    orbit,
    stage: mainStage,
    minAspect,
  });

  // The halves have to be laid out before the fit measures them, so the split runs it on a resize, not the fit.
  fit.stop();
  app.renderer.on('resize', () => {
    layout();
    fit.refit();
    follow();
  });

  return {
    halves,
    get stacked() {
      return stacked;
    },
    divider,
    update() {
      follow();
      divider.update();
    },
  };
}
