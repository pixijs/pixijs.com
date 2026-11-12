/**
 * What the frame draws to explain particle spaces: each cube's ring, the local system's own axes on its cube, the
 * world's axes at the origin, and a placard under each ring naming its cube's space
 *
 * It reads the scene each frame and never changes it, so `index.ts` runs the same without it.
 */

import { AxesHelper } from './theme/AxesHelper';

import { LabelLayer } from './theme/LabelLayer';
import { NARROW_BELOW } from './theme/overlay';
import { PathHelper } from './theme/PathHelper';

import { CUBE_NAMES, CUBE_REACH } from './scene';

/** The px between a placard's top and the lowest a cube reaches on screen; scene.ts's `TAG_ROOM` leaves room for it */
const PLACARD_GAP = 8;
/**
 * Past the cube's half-width of 0.4, far enough that the red and blue heads clear the cube's outline at the first
 * frame's angle, where both lean toward the camera
 */
const LOCAL_AXES_LENGTH = 1.05;
/** Short enough that the x arrow stops clear of where the sky cube passes the ring's inner side */
const WORLD_AXES_LENGTH = 0.45;
/** About half the arrows' thickness, so the world's x and z arrows lie on the floor instead of sinking into it */
const WORLD_AXES_LIFT = 0.02;
/** Line widths on a large screen, and on a phone either way up, where the picture is smaller and thin lines fade out */
const RING_THICKNESS = { large: 0.02, phone: 0.035 };
const AXES_THICKNESS = { large: 0.03, phone: 0.05 };

/** One cube's marks, and the system they last showed */

export function createVisuals({ app, view3d, stage, rings, sparks, layout }) {
  // The screen, not the view: the layout grows the view past the screen's edge to move the rings under the pane.
  const labels = new LabelLayer({ view3d, stage, bounds: app.screen });
  const phone = Math.min(app.screen.width, app.screen.height) < NARROW_BELOW;
  // AxesHelper takes its thickness at construction only, so the axes keep the width the page loaded at.
  const axesThickness = phone ? AXES_THICKNESS.phone : AXES_THICKNESS.large;

  /** A cube's ring, its system's axes and its placard under the ring */
  function markCube(name) {
    const { centre, cube, radius } = rings[name];
    // A wire through the cube, so it reads as a bead on the path its emitter follows.
    const path = new PathHelper({
      closed: true,
      thickness: RING_THICKNESS.large,
      parent: centre,
    });

    path.setPoints(PathHelper.circle(radius));

    return {
      path,
      // At the system's origin: the axes its local positions are measured along. It's the cube's child, not the
      // system's, so it outlives a rebuild; the system has no turn of its own, so the two match.
      axes: new AxesHelper({
        length: LOCAL_AXES_LENGTH,
        thickness: axesThickness,
        position: sparks[name].position,
        parent: cube,
      }),
      placard: labels.add({
        text: '',
        anchor: { x: 0.5, y: 0 },
        offset: { x: 0, y: PLACARD_GAP },
      }),
      shown: sparks[name],
    };
  }

  const marks = { pink: markCube('pink'), sky: markCube('sky') };

  // World positions are measured from here, which is why world sparks stay put.
  const worldAxes = new AxesHelper({
    length: WORLD_AXES_LENGTH,
    thickness: axesThickness,
    position: { x: 0, y: WORLD_AXES_LIFT, z: 0 },
    parent: view3d.root,
  });

  const worldTag = labels.add({ text: 'origin', node: worldAxes });
  let shownPhone = false;
  let shownStacked = null;

  app.stage.addChild(labels);

  /** Names a cube's space where it is, and shows its axes only while its sparks are measured along them */
  function show(name) {
    const { axes, placard, shown } = marks[name];

    placard.text = shown.space;
    axes.visible = shown.space === 'local';
  }

  /** Puts the tags where the layout leaves room: each placard hung under its ring, the world's by its axes */
  function place(stacked) {
    for (const name of CUBE_NAMES) {
      const { centre, radius } = rings[name];
      const { x, y, z } = centre.position;

      // Just under the lowest a cube reaches as it passes the ring's front, so the placard sits by its ring.
      marks[name].placard.at.set(
        x,
        y - CUBE_REACH.below,
        z + radius + CUBE_REACH.ahead,
      );
    }
    // Side by side, under the axes, clear of the cubes passing either side and the pink x arrow passing over them;
    // stacked, beside the x arrow, clear of the rings above and below.
    worldTag.at.copyFrom(stacked ? worldAxes.tips.x : worldAxes.tips.z);
    worldTag.anchor.set(stacked ? 0 : 0.5, 0.5);
    worldTag.offset.set(stacked ? 8 : 0, stacked ? 0 : 20);
  }

  for (const name of CUBE_NAMES) show(name);

  return {
    update() {
      const onPhone =
        Math.min(app.screen.width, app.screen.height) < NARROW_BELOW;

      for (const name of CUBE_NAMES) {
        if (sparks[name] === marks[name].shown) continue;
        marks[name].shown = sparks[name];
        show(name);
      }

      if (layout.stacked !== shownStacked) {
        shownStacked = layout.stacked;
        place(layout.stacked);
      }
      // On a phone the rings thicken, to show at the smaller picture's scale.
      if (onPhone !== shownPhone) {
        shownPhone = onPhone;
        for (const name of CUBE_NAMES) {
          marks[name].path.thickness = onPhone
            ? RING_THICKNESS.phone
            : RING_THICKNESS.large;
        }
      }

      labels.update();
    },
  };
}
