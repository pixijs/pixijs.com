/**
 * The 2D overlays besides the name tags: an inset drawn from the camera at the lens station, and a dashed
 * screen-space ring round the ball at the mark station
 *
 * The inset docks in the bottom-right corner on every screen, lined up under the pane, and every resize sizes it for
 * the screen's shape: the pane's width on a wide screen, a share of the width on a compact one (a phone held
 * sideways), and the screen's width less its margins on an upright one, up to TALL_MAX, so a phone's spans the bottom
 * and a tablet's stays a corner card.
 */

import { Vector3 } from '@pixi/3d';

import { Container, Point } from 'pixi.js';

import { InsetView } from './theme/InsetView';
import { ScreenLines } from './theme/ScreenLines';

import { visual } from './galleryVisual';

/** Where the lens station's camera stands, in the station's space */
const LENS_EYE = { x: -0.85, y: 0.75, z: 0.3 };
/** The inset's gap to the screen's edges, in px: the pane's own, so the inset's right edge lines up under it */
const INSET_MARGIN = 12;
/** The pane's width in px, which the inset matches on a wide screen so the two read as one column */
const PANE_WIDTH = 260;
/** The picture's shape: the inset camera's 16:9 */
const ASPECT = 16 / 9;
/** An upright screen's widest picture, in px, so a tablet's stays a corner card */
const TALL_MAX = 360;
/** A compact screen's picture: this share of the screen's width, within these bounds, in px */
const SIDE_SHARE = 0.18;
const SIDE_MIN = 150;
const SIDE_MAX = 240;
/** The marked ball's radius as the ring measures it: 0.5 at its scale of 0.8, past its clay sphere's 0.45 */
const MARK_RADIUS = 0.4;
/** The ring's gap round the ball's outline on screen, in px */
const RING_GAP = 9;
const ORIGIN = { x: 0, y: 0, z: 0 };
const RIGHT = { x: 1, y: 0, z: 0 };

export function createOverlayVisuals({ app, view3d, stage, scene, tags }) {
  const screen = app.screen;
  // Panel moves a bottom-right panel to the middle under 600 px wide; kept in the corner, a sideways phone's grid
  // keeps the room to its left.
  const inset = new InsetView({
    app,
    view3d,
    stage,
    corner: 'bottom-right',
    margin: INSET_MARGIN,
    narrow: { corner: 'bottom-right' },
    title: 'InsetView',
    caption: 'lens camera',
  });
  // A same-scene inset always has a camera.
  const lens = inset.camera;
  const marks = new ScreenLines({
    stage,
    color: 'accent',
    width: 1.5,
    dash: 5,
    gap: 4,
  });
  const layer = new Container({ children: [marks, inset] });
  const aim = new Vector3();
  const ball = new Vector3();
  const right = new Vector3();
  const center = new Point();
  const edge = new Point();
  let time = 0;

  /** Sizes the picture for the screen's shape; the panel docks itself as it resizes */
  function arrange(shape) {
    const rim = inset.padding * 2;
    const width =
      shape === 'wide'
        ? PANE_WIDTH - rim
        : shape === 'tall'
          ? Math.min(TALL_MAX, screen.width - INSET_MARGIN * 2 - rim)
          : Math.min(
              SIDE_MAX,
              Math.max(SIDE_MIN, Math.floor(screen.width * SIDE_SHARE)),
            );

    inset.setSize(width, Math.round(width / ASPECT));

    return inset.rect;
  }

  return {
    layer,
    lens,
    visuals: [
      visual('InsetView', 'Overlays', [inset], null),
      visual(
        'ScreenLines',
        'Overlays',
        [marks],
        tags.add('mark', 'ScreenLines'),
      ),
    ],
    arrange,
    update(dt) {
      time += dt;

      // The lens camera sways a little at its station, filming the pyramid.
      const station = scene.stations.lens.position;

      lens.position.set(
        station.x + LENS_EYE.x,
        station.y + LENS_EYE.y + Math.sin(time * 0.7) * 0.12,
        station.z + LENS_EYE.z + Math.sin(time * 0.5) * 0.15,
      );
      lens.lookAt(scene.pyramid.toGlobal(ORIGIN, aim));
      inset.update(dt);

      // The ball's radius on screen: from its centre to a point one radius along the camera's right.
      marks.clear();
      scene.marked.toGlobal(ORIGIN, ball);
      right.copyFrom(RIGHT).transformDirection(view3d.camera.worldTransform);
      if (
        view3d.worldToScreen(ball, center) &&
        view3d.worldToScreen(ball.addScaledVector(right, MARK_RADIUS), edge)
      ) {
        marks.dot(
          center.x,
          center.y,
          Math.hypot(edge.x - center.x, edge.y - center.y) + RING_GAP,
          true,
        );
      }
      marks.update();
    },
  };
}
