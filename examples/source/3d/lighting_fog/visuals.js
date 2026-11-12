/**
 * What the frame draws to explain fog: a line across the floor at each depth the live curve names, with its name
 *
 * Linear fog gets two lines, where it starts (`near`) and where it's full (`far`); an exponential curve gets one, where
 * it's half way, the depth its `density` decides. Every point of a line sits at the same depth in front of the camera,
 * so the fog is the same amount all along it. The lines are worked out from the camera every frame, so they hold
 * still on screen while the camera moves and the field moves through them: the fog goes with the camera.
 *
 * It reads the fogs and the camera each frame and never changes them, so `index.ts` runs the same without it.
 */

import { Matrix4, Vector3 } from '@pixi/3d';

import { Rectangle } from 'pixi.js';

import { ArrowHelper } from './theme/ArrowHelper';

import { LabelLayer } from './theme/LabelLayer';
import { viewRect } from './theme/overlay';

/** Half a line's length either side of the camera's line of sight: just past the outer columns */
const HALF_LENGTH = 6.4;
/** A line's width on screen at any depth, in px */
const LINE_PX = 2;
/** Px between a line and its name */
const TAG_GAP = 8;
/**
 * What `density · depth` comes to where each exponential curve is half way: ln 2, and √ln 2 for exp2, so dividing it
 * by the density gives the depth of half fog
 */
const HALF_FOG_PRODUCT = { exponential: Math.LN2, exp2: Math.sqrt(Math.LN2) };

/** A line, its name, and the side the name takes when there's no room for it left of the line */

export function createVisuals({ app, view3d, stage, fogs, floorSize }) {
  const labels = new LabelLayer({ view3d, stage });
  const cameraMatrix = new Matrix4();
  const eye = new Vector3();
  const forward = new Vector3();
  /** The camera's line of sight along the floor, and the floor's direction square to it */
  const sight = new Vector3();
  const across = new Vector3();
  const view = new Rectangle();
  const centre = new Vector3();
  const from = new Vector3();
  const to = new Vector3();
  const floorEdge = floorSize / 2;
  /** How much of `forward` runs along the floor, and px per world unit at depth 1 */
  let ground = 1;
  let focal = 1;

  function addLine(text, side = 'above') {
    // X-ray: shapes standing across a line would cut it into dashes, even fully fogged ones the reader can't see.
    const line = new ArrowHelper({
      color: 'ink',
      head: false,
      xray: true,
      parent: view3d.root,
    });

    return { line, tag: labels.add({ text }), side };
  }

  // Nothing stands nearer than the first row, so on a narrow screen the near line's name hangs below it.
  const nearLine = addLine('fog near', 'below');
  const farLine = addLine('fog far');
  const halfLine = addLine('50% fog');

  app.stage.addChild(labels);

  function measureCamera() {
    const camera = view3d.camera;

    camera.getGlobalTransform(cameraMatrix);
    camera.getGlobalPosition(eye);
    forward.set(0, 0, -1).transformDirection(cameraMatrix);
    ground = Math.hypot(forward.x, forward.z);
    sight.set(forward.x / ground, 0, forward.z / ground);
    across.set(-sight.z, 0, sight.x);
    viewRect(view3d, view);
    // A perspective camera's zoom widens or narrows its view as a change of `fov` would.
    focal =
      ((view.height / 2) * camera.zoom) /
      Math.tan((camera.fov * Math.PI) / 360);
  }

  /** Lays a line across the floor at `depth`; `NaN` or a depth off the floor hides it and its name */
  function place({ line, tag, side }, depth) {
    // The floor point straight ahead of the camera at that depth.
    const along = (depth + eye.y * forward.y) / ground;

    centre.set(eye.x + sight.x * along, 0, eye.z + sight.z * along);

    const shown =
      depth > 0 &&
      Math.abs(centre.x) < floorEdge &&
      Math.abs(centre.z) < floorEdge;

    line.visible = shown;
    tag.hidden = !shown;
    if (!shown) return;

    // The width at that depth that draws LINE_PX on screen, resting on the floor rather than half in it.
    const thickness = (LINE_PX * depth) / focal;
    const pxPerUnit = focal / depth;
    const middle = view.x + view.width / 2;
    const edge = view.x + labels.margin;

    centre.y = thickness / 2;
    from.copyFrom(centre).addScaledVector(across, -HALF_LENGTH);
    to.copyFrom(centre).addScaledVector(across, HALF_LENGTH);
    line.thickness = thickness;
    line.set(from, to);

    if (middle - HALF_LENGTH * pxPerUnit - TAG_GAP - tag.width >= edge) {
      tag.at.copyFrom(from);
      tag.anchor.set(1, 0.5);
      tag.offset.set(-TAG_GAP, 0);
    } else {
      // No room left of the line: at the screen's left edge, just off the line.
      tag.at
        .copyFrom(centre)
        .addScaledVector(across, (edge - middle) / pxPerUnit);
      tag.anchor.set(0, side === 'above' ? 1 : 0);
      tag.offset.set(0, side === 'above' ? -TAG_GAP : TAG_GAP);
    }
  }

  return {
    update() {
      const type = view3d.fog?.type ?? 'linear';
      const linear = type === 'linear';

      measureCamera();
      // A line whose curve isn't live gets no depth, which hides it.
      place(nearLine, linear ? fogs.linear.near : Number.NaN);
      place(farLine, linear ? fogs.linear.far : Number.NaN);
      place(
        halfLine,
        linear ? Number.NaN : HALF_FOG_PRODUCT[type] / fogs[type].density,
      );
      labels.update();
    },
  };
}
