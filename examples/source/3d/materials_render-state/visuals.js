/**
 * What the frame draws to explain the render state: arrows out of the tube's front side, and a line up from the pin
 * that the wall hides as the pin slides behind it
 *
 * It reads the scene and never changes it, so `index.ts` runs the same without it.
 */

import { Vector3 } from '@pixi/3d';

import { ArrowHelper } from './theme/ArrowHelper';
import { LabelLayer } from './theme/LabelLayer';
import { NARROW_BELOW } from './theme/overlay';
import { BRAND } from './theme/palette';

/** Eight arrows round the tube's middle, each this long, out of the front side of the surface there */
const ARROWS = 8;
const ARROW_LENGTH = 0.35;
/** Where round the tube the arrow that `front side` names points, front right; the others follow it round */
const FRONT_ANGLE = Math.PI / 4;
/** From inside the pin's top point, so the line and the pin meet */
const PIN_TIP = 0.3;
/** Where the pin's line ends and its tag hangs: high enough over the wall's top (2.4) that the wall visibly cuts it */
const LINE_TOP = 2.9;
/**
 * Where the `front side` tag sits, and how thick the lines draw, on a wide view and on a narrow one. On a phone the
 * right of the tube is off the screen, so the tag goes under it, and the camera backs off, so the lines thicken to
 * stay seen.
 */
const LAYOUT = {
  wide: {
    arrow: 0.03,
    line: 0.025,
    anchor: { x: 0, y: 0.5 },
    offset: { x: 10, y: 0 },
  },
  narrow: {
    arrow: 0.05,
    line: 0.04,
    anchor: { x: 0.5, y: 0 },
    offset: { x: 6, y: 22 },
  },
};

export function createVisuals(options) {
  const { app, view3d, stage, pin, tube, tubeRadius } = options;
  const labels = new LabelLayer({ view3d, stage });
  const arrows = aimArrows(tube, tubeRadius);
  // An ordinary helper, depth-tested like the wall, so the wall hides its foot while the pin shows through. It's the
  // pin's purple, which stands out on the night face on both themes, so the place where the wall cuts it shows.
  const line = new ArrowHelper({
    color: BRAND.purple,
    head: false,
    parent: view3d.root,
  });
  const lineFrom = new Vector3();
  const lineTo = new Vector3();
  const frontTip = tubeRadius + ARROW_LENGTH;
  const frontTag = labels.add({
    text: 'front side',
    node: tube,
    at: {
      x: Math.cos(FRONT_ANGLE) * frontTip,
      y: 0,
      z: Math.sin(FRONT_ANGLE) * frontTip,
    },
  });

  const pinTag = labels.add({
    text: 'pin',
    anchor: { x: 0.5, y: 1 },
    offset: { x: 0, y: 0 },
  });

  let layout = null;

  app.stage.addChild(labels);

  return {
    update() {
      const next =
        app.screen.width < NARROW_BELOW ? LAYOUT.narrow : LAYOUT.wide;

      if (next !== layout) {
        layout = next;
        for (const arrow of arrows) arrow.thickness = layout.arrow;
        line.thickness = layout.line;
        frontTag.anchor.copyFrom(layout.anchor);
        frontTag.offset.copyFrom(layout.offset);
      }

      const { x, y, z } = pin.position;

      line.set(lineFrom.set(x, y + PIN_TIP, z), lineTo.set(x, LINE_TOP, z));
      pinTag.at.copyFrom(lineTo);
      labels.update();
    },
  };
}

/** Eight ink arrows out of the tube's outside at mid-height; as its children they tip with it */
function aimArrows(tube, radius) {
  const from = new Vector3();
  const to = new Vector3();

  return Array.from({ length: ARROWS }, (_, i) => {
    const angle = FRONT_ANGLE + (i * Math.PI * 2) / ARROWS;
    const x = Math.cos(angle);
    const z = Math.sin(angle);

    return new ArrowHelper({ color: 'ink', parent: tube }).set(
      from.set(x * radius, 0, z * radius),
      to.set(x * (radius + ARROW_LENGTH), 0, z * (radius + ARROW_LENGTH)),
    );
  });
}
