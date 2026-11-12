/**
 * The pane, in the lesson's two halves. World to screen: how far the name tags lift off their pins, and the pixel
 * worldToScreen gives the pyramid's tag. Screen to world: the pointer's pixel, what a tap drops onto and how far along
 * the ray, the point the pointer aims at, and a button that clears the placed shapes.
 *
 * The read-only rows read getters, so the pane formats ten times a second and the ticker formats nothing for it.
 */

/**
 * The `distance` row's range, in units from the camera. 5 is about where a landscape view's bottom edge meets the floor
 * as it opens; nearer, a piece placed in the air looms over the row. 20 is past where rays at the near spot meet the
 * floor even on a phone, where the camera stands 1.7 times farther back, so the row reaches `ray.at` running on under
 * the floor on any screen; aimed higher up the floor, the point comes back above it.
 */
const DISTANCE_RANGE = { min: 5, max: 20 };
/** Ten times a second: often enough to follow the pointer, rarely enough that the formatting costs nothing */
const MONITOR = { readonly: true, interval: 100 };

/** A pixel, rounded as the screen counts them */
function pixel({ x, y }) {
  return `(${Math.round(x)}, ${Math.round(y)})`;
}

/**
 * A coordinate to 2 decimals, rounded first so -0.001 shows as 0.00, not -0.00. From 100 on it's whole units: the floor
 * point of a ray just under the horizon lies thousands of units off, and its decimals would push it out of the row.
 */
function coordinate(value) {
  const decimals = Math.abs(value) < 100 ? 2 : 0;
  const scale = 10 ** decimals;

  return (Math.round(value * scale) / scale || 0).toFixed(decimals);
}

function point({ x, y, z }) {
  return `(${coordinate(x)}, ${coordinate(y)}, ${coordinate(z)})`;
}

export function createControls({
  pane,
  params,
  pieces,
  placer,
  pointer,
  aim,
  pyramid,
}) {
  const readouts = {
    get pyramidTag() {
      return pixel(pyramid.tag.position);
    },
    get pointer() {
      return pixel(pointer);
    },
    // 'none' where screenToWorld returns null: the ray runs above the horizon and never meets the floor.
    get aimsAt() {
      return aim.hit ? point(aim.point) : 'none';
    },
  };

  const toScreen = pane.addFolder({ title: 'world to screen' });

  toScreen
    .addBinding(params, 'labelOffset', {
      label: 'tag.pivot.y',
      min: 0,
      max: 60,
      step: 1,
    })
    .on('change', ({ value }) => {
      // The offset is added after the projection, in px, so a near tag and a far one lift the same.
      for (const { tag } of pieces) tag.pivot.y = value;
    });
  toScreen.addBinding(readouts, 'pyramidTag', {
    label: 'pyramid tag',
    ...MONITOR,
  });

  const toWorld = pane.addFolder({ title: 'screen to world' });

  toWorld.addBinding(readouts, 'pointer', { label: 'pointer', ...MONITOR });
  toWorld
    .addBinding(params, 'dropOn', {
      label: 'drop on',
      options: { floor: 'floor', distance: 'distance' },
    })
    .on('change', ({ value }) => {
      distanceRow.disabled = value === 'floor';
    });

  const distanceRow = toWorld.addBinding(params, 'distance', {
    ...DISTANCE_RANGE,
    step: 0.1,
    disabled: true,
  });

  toWorld.addBinding(readouts, 'aimsAt', { label: 'aims at', ...MONITOR });
  toWorld
    .addButton({ title: 'Clear shapes' })
    .on('click', () => placer.clear());
}
