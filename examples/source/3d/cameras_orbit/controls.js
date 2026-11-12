/**
 * The pane: damping, auto-rotate, zoom to the cursor, the camera's angles and distance, the limits, render on demand
 * with its frame count, and the saved pose
 *
 * Most rows bind straight to the orbit's own properties, under their own names, so a reader finds each in the code.
 */

/** Frames remembered for the count; more than a second's worth on any display */
const FRAME_SLOTS = 256;
/** How often the frame count reads again, in ms */
const COUNT_INTERVAL = 250;

export function createControls({
  pane,
  orbit,
  settings,
  limitAzimuth,
  saveView,
  resetView,
}) {
  const drawn = new Float64Array(FRAME_SLOTS).fill(-Infinity);
  let next = 0;

  // A DOM count, so it keeps reading while the canvas draws nothing: it falls to 0 then.
  const rate = {
    get fps() {
      const since = performance.now() - 1000;
      let count = 0;

      for (let i = 0; i < FRAME_SLOTS; i++) if (drawn[i] > since) count++;

      return count;
    },
  };

  pane.addBinding(orbit, 'enableDamping');
  pane.addBinding(orbit, 'dampingFactor', { min: 0.01, max: 0.3, step: 0.01 });
  // The orbit pauses auto-rotate during a gesture on its own, so switching it is one property.
  pane.addBinding(orbit, 'autoRotate');
  pane.addBinding(orbit, 'zoomToCursor');

  // Where the camera stands, in the units the limits below take. Both folders start folded, so the pane clears the
  // logo on a portrait tablet.
  const camera = pane.addFolder({ title: 'camera', expanded: false });
  const readout = { readonly: true, format: (value) => value.toFixed(2) };
  const readouts = [
    camera.addBinding(orbit, 'polarAngle', readout),
    camera.addBinding(orbit, 'azimuthAngle', readout),
    camera.addBinding(orbit, 'distance', readout),
  ];

  const limits = pane.addFolder({ title: 'limits', expanded: false });

  limits.addBinding(orbit, 'minDistance', { min: 1, max: 15, step: 0.1 });
  limits.addBinding(orbit, 'maxDistance', { min: 6, max: 30, step: 0.1 });
  limits.addBinding(orbit, 'minPolarAngle', {
    min: 0,
    max: Math.PI,
    step: 0.01,
  });
  limits.addBinding(orbit, 'maxPolarAngle', {
    min: 0,
    max: Math.PI,
    step: 0.01,
  });
  limits
    .addBinding({ limitAzimuth: false }, 'limitAzimuth', { label: 'azimuth' })
    .on('change', ({ value }) => limitAzimuth(value));

  const onDemand = pane.addFolder({ title: 'render on demand' });

  onDemand.addBinding(settings, 'renderOnDemand', { label: 'enabled' });
  readouts.push(
    onDemand.addBinding(rate, 'fps', {
      label: 'frames / s',
      readonly: true,
      interval: COUNT_INTERVAL,
      format: (value) => value.toFixed(0),
    }),
  );

  pane.addButton({ title: 'Save pose' }).on('click', saveView);
  pane.addButton({ title: 'Reset to saved pose' }).on('click', resetView);

  return {
    readouts,
    countFrame() {
      drawn[next] = performance.now();
      next = (next + 1) % FRAME_SLOTS;
    },
  };
}
