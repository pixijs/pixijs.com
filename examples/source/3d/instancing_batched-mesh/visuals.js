/**
 * What the frame draws to explain `BatchedMesh3D`: the loupe, an inset that draws a patch of the ring again from the
 * main camera through a narrow lens, and that patch outlined on the main view with a leader to the inset
 *
 * A shape is about 3 px across in the main view, too small to tell a cube from a torus; in the loupe it's about 20 px,
 * so each slot's own geometry and material show. It reads the scene each frame and never changes it, so `index.ts`
 * runs the same without it.
 */

import { Vector3 } from '@pixi/3d';

import { DEG_TO_RAD, Point, Rectangle } from 'pixi.js';

import { InsetView } from './theme/InsetView';
import { viewRect } from './theme/overlay';
import { ScreenLines } from './theme/ScreenLines';

import { ROPE } from './scene';

/**
 * The world units the loupe shows top to bottom at 100,000 slots: a slot and a few of its neighbours. A smaller batch
 * spaces its slots further apart and grows its shapes by as much, and the span grows by the square root of that: a few
 * neighbours still show, each a little bigger, and the patch outlined on the ring stays small.
 */
const SPAN = 0.7;
/** The picture's size in px, and its height on a phone held upright, where it spans the screen */
const PICTURE = { width: 240, height: 135 };
const NARROW_HEIGHT = 140;
/** The most of the screen's height the picture takes, so on a phone on its side it stays clear of the ring */
const PICTURE_SHARE = 0.22;
/** The rope's outer front-right edge, where nothing stands between a slot and the camera */
const PICK_NEAR = new Vector3(
  ROPE.outer * Math.cos(Math.PI / 3),
  ROPE.top,
  ROPE.outer * Math.sin(Math.PI / 3),
);

const _eye = new Vector3();
const _at = new Point();
const _view = new Rectangle();
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** The slot the loupe follows: the one nearest the rope's outer front-right edge */
function pickSlot({ rest, size }) {
  let nearest = Infinity;
  let slot = 0;

  for (let i = 0; i < size; i++) {
    const distance = Math.hypot(
      rest[i * 3] - PICK_NEAR.x,
      rest[i * 3 + 1] - PICK_NEAR.y,
      rest[i * 3 + 2] - PICK_NEAR.z,
    );

    if (distance >= nearest) continue;
    nearest = distance;
    slot = i;
  }

  return slot;
}

export function createVisuals(options) {
  const { app, view3d, stage } = options;
  let { swarm, layout } = options;
  let slot = pickSlot(layout);
  const loupe = new InsetView({
    app,
    view3d,
    stage,
    corner: 'bottom-right',
    title: 'up close',
    ...PICTURE,
    narrow: { width: 'full', height: NARROW_HEIGHT },
  });
  // A same-scene inset always has a camera.
  const camera = loupe.camera;
  const callout = new ScreenLines({ stage, color: 'ink', alpha: 0.6 });
  /** The slot's position, which the loupe follows as the band lifts and lowers it */
  const aim = new Vector3();
  let pictureHeight = PICTURE.height;

  app.stage.addChild(callout, loupe);

  /** The patch the loupe shows, outlined on the main view, and a leader from it to the inset */
  function drawCallout(distance, span) {
    const view = viewRect(view3d, _view);
    const at = view3d.worldToScreen(aim, _at);

    callout.clear();
    if (!at) return;

    const tall =
      (span * view.height) /
      (2 * distance * Math.tan((view3d.camera.fov * DEG_TO_RAD) / 2));
    const wide = (tall * loupe.picture.width) / loupe.picture.height;
    const left = at.x - wide / 2;
    const top = at.y - tall / 2;
    const panel = loupe.rect;
    // The panel's nearest point to the patch, and the patch's nearest point to that.
    const toX = clamp(at.x, panel.left, panel.right);
    const toY = clamp(at.y, panel.top, panel.bottom);

    callout
      .rect(left, top, wide, tall, 2)
      .line(
        clamp(toX, left, left + wide),
        clamp(toY, top, top + tall),
        toX,
        toY,
      );
  }

  return {
    setSwarm(next, nextLayout) {
      swarm = next;
      layout = nextLayout;
      slot = pickSlot(layout);
    },
    update(dt) {
      const { data, stride, offset } = swarm.matrices;
      const o = offset + slot * stride;
      const height = Math.min(
        PICTURE.height,
        Math.round(app.screen.height * PICTURE_SHARE),
      );

      // A phone held upright takes the narrow size whatever this sets.
      if (height !== pictureHeight) {
        pictureHeight = height;
        loupe.setSize(
          Math.round((height * PICTURE.width) / PICTURE.height),
          height,
        );
      }
      // A shorter picture shows less of the rope at the same zoom.
      const span =
        (SPAN * Math.sqrt(layout.spacing) * loupe.picture.height) /
        PICTURE.height;

      // The swarm sits unmoved at the origin, so a slot's own space is the world's.
      aim.set(data[o + 12], data[o + 13], data[o + 14]);

      const eye = view3d.camera.getGlobalPosition(_eye);
      const distance = eye.distanceTo(aim);

      camera.position.copyFrom(eye);
      camera.lookAt(aim);
      // Camera3D.fov is the vertical angle, in degrees: wide enough to hold the span at the aim.
      camera.fov = (2 * Math.atan(span / 2 / distance)) / DEG_TO_RAD;
      camera.near = distance * 0.5;
      camera.far = distance + 40;
      loupe.update(dt);
      drawCallout(distance, span);
      callout.update();
    },
  };
}
