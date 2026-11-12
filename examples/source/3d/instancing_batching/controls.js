/**
 * The pane: the field's count, shapes and colours, what the view culls with, the scout's sweep and where it looks, and
 * the debugger's counts
 *
 * `cull` binds to the view itself, and the scout's rows to its sweep in `scene.ts`. Every other row that changes the
 * scene calls one named function in `index.ts`, where the change it makes is written out.
 */

import { CLAY_SHAPES } from './theme/shapes';

import { COLOR_ORDER, MAX_COUNT } from './scene';

/** The field the pane shapes: how many pieces, and how many of the shapes and colours they wear */

/** The frustum the main view culls against: the scout's, or its own camera's */

/** What the debugger counted in its last capture */

const CULL_MODES = { off: 'off', cpu: 'cpu', gpu: 'gpu' };
const CULL_FRUSTUMS = {
  'scout.frustum': 'scout',
  'camera.frustum': 'camera',
};
const wholeNumber = (n) => n.toFixed(0);

export function createControls(options) {
  const { pane, view3d, settings, counts, sweep } = options;
  // Where the pane opens folded (on a phone), Batching does too, so the open pane covers less of the scout's inset.
  const batching = pane.addFolder({
    title: 'Batching',
    expanded: pane.expanded,
  });
  const culling = pane.addFolder({ title: 'Culling' });
  // index.ts starts the main view culling against the scout.
  const culledAgainst = { cullFrustum: 'scout' };
  // The rows' own copy: a refresh writes the slider's rounded value back into the object it binds.
  const scoutRows = { sweep: sweep.on, heading: sweep.heading };
  // A refresh fires the row's change handler too, so the handlers ignore what sync writes.
  let syncing = false;

  batching
    .addBinding(settings, 'count', {
      label: 'Count',
      min: 500,
      max: MAX_COUNT,
      step: 500,
    })
    .on('change', ({ value }) => options.setCount(value));
  batching
    .addBinding(settings, 'shapes', {
      label: 'Shapes',
      min: 1,
      max: CLAY_SHAPES.length,
      step: 1,
    })
    .on('change', ({ value }) => options.setShapes(value));
  batching
    .addBinding(settings, 'colors', {
      label: 'Colours',
      min: 1,
      max: COLOR_ORDER.length,
      step: 1,
    })
    .on('change', ({ value }) => options.setColors(value));
  batching.addBinding(counts, 'drawCalls', {
    label: 'drawCallCount',
    readonly: true,
    format: wholeNumber,
  });
  // A new mode takes effect on the next render and rebuilds nothing.
  culling.addBinding(view3d, 'cull', { options: CULL_MODES });
  culling
    .addBinding(culledAgainst, 'cullFrustum', { options: CULL_FRUSTUMS })
    .on('change', ({ value }) => options.setCullFrustum(value));
  const sweepRow = culling
    .addBinding(scoutRows, 'sweep', { label: 'Sweep' })
    .on('change', ({ value }) => {
      if (!syncing) sweep.on = value;
    });
  const aimRow = culling
    .addBinding(scoutRows, 'heading', {
      label: 'Scout aim',
      min: 0,
      max: 360,
      step: 1,
      format: wholeNumber,
    })
    .on('change', ({ value }) => {
      if (!syncing) sweep.aim(value);
    });
  culling.addBinding(counts, 'drawn', {
    label: 'Drawn',
    readonly: true,
    format: wholeNumber,
  });

  /** Shows a row's new value without its change handler taking it for the reader's */
  function refresh(row) {
    syncing = true;
    row.refresh();
    syncing = false;
  }

  return {
    sync() {
      // The slider's own step, so a still scout holds the row still.
      const shown = Math.round(sweep.heading);

      if (sweep.on !== scoutRows.sweep) {
        scoutRows.sweep = sweep.on;
        refresh(sweepRow);
      }
      // A refresh rewrites the number box, so it waits while the reader types a heading there.
      const typing =
        document.activeElement instanceof HTMLInputElement &&
        aimRow.element.contains(document.activeElement);

      if (shown !== scoutRows.heading && !typing) {
        scoutRows.heading = shown;
        refresh(aimRow);
      }
    },
  };
}
