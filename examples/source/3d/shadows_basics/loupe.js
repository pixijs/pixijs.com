/**
 * The loupe: a magnified inset of the logo's shadow edge on the wall, and the patch it shows outlined on the main view
 *
 * It draws the same scene again from a camera at the main camera's position with a narrow fov, so it frames a fixed
 * width of wall at any orbit distance and a shadow-map texel keeps its size in it.
 */

import { Vector3 } from '@pixi/3d';

import { DEG_TO_RAD, Point, Rectangle } from 'pixi.js';

import { InsetView } from './theme/InsetView';
import { viewRect } from './theme/overlay';

import { ScreenLines } from './theme/ScreenLines';

/** How much wall the loupe frames across, in world units: about five times the main view's size on a wide screen */
const FIELD = 0.56;
/**
 * The picture's size in px. Docked bottom right on a 4:3 screen it sits about 24 px under the plinth's front edge, with
 * its title tag at its right end, away from the plinth.
 */
const PICTURE = { width: 192, height: 120 };
const NARROW_PICTURE_HEIGHT = 170;

const _eye = new Vector3();
const _at = new Point();
const _view = new Rectangle();

export function createLoupe({ app, view3d, stage, corner }) {
  const inset = new InsetView({
    app,
    view3d,
    stage,
    title: 'up close',
    titleCorner: 'top-right',
    corner,
    ...PICTURE,
    narrow: { corner: 'bottom', width: 'full', height: NARROW_PICTURE_HEIGHT },
  });
  // A same-scene inset always has a camera.
  const camera = inset.camera;
  const outline = new ScreenLines({ stage, color: 'ink', alpha: 0.6 });

  /** The patch the loupe shows, outlined on the main view */
  function drawOutline(target, distance) {
    const view = viewRect(view3d, _view);
    const at = view3d.worldToScreen(target, _at);

    outline.clear();
    if (!at) return;

    const wide =
      (FIELD * view.height) /
      (2 * distance * Math.tan((view3d.camera.fov * DEG_TO_RAD) / 2));
    const tall = (wide * inset.picture.height) / inset.picture.width;

    outline.rect(at.x - wide / 2, at.y - tall / 2, wide, tall, 2);
  }

  return {
    inset,
    outline,
    update(dt, target) {
      const eye = view3d.camera.getGlobalPosition(_eye);
      const distance = eye.distanceTo(target);

      camera.position.copyFrom(eye);
      camera.lookAt(target);
      // Camera3D.fov is the vertical angle, in degrees.
      camera.fov =
        (2 *
          Math.atan(
            (FIELD * inset.picture.height) / inset.picture.width / 2 / distance,
          )) /
        DEG_TO_RAD;
      inset.update(dt);
      drawOutline(target, distance);
      outline.update();
    },
  };
}
