/**
 * The pane: a Debug folder for the overlay and the captures, a Last capture folder that shows what the debugger read,
 * and a folder that makes the lesson's changes to the scene
 */

/** What the Debug and Change the scene rows bind */

/** What the last capture read, which `index.ts` writes and the read-only rows show */

/** The lesson's changes, each a function in `index.ts` */

/** The puck's colours, by the names `clayMaterial` takes */
const PUCK_OPTIONS = {
  lilac: 'lilac',
  orange: 'orange',
  sky: 'sky',
  pink: 'pink',
};
/** The octahedron's materials: its arc clay, or the see-through clay `index.ts` names `seeThrough` */
const OCTAHEDRON_OPTIONS = { clay: false, seeThrough: true };
/** A count the snapshot can leave null, which `index.ts` reads as NaN */
const COUNT = {
  readonly: true,
  format: (n) => (Number.isNaN(n) ? '-' : n.toFixed(0)),
};

export function createControls({ pane, state, readout, changes, captureNow }) {
  const debug = pane.addFolder({ title: 'Debug' });

  debug
    .addBinding(state, 'overlay')
    .on('change', ({ value }) => changes.setOverlay(value));
  debug.addBinding(state, 'live', { label: 'live capture' });
  debug.addButton({ title: 'Capture' }).on('click', captureNow);

  const last = pane.addFolder({ title: 'Last capture' });

  last.addBinding(readout, 'captureId', COUNT);
  last.addBinding(readout, 'passes', {
    readonly: true,
    multiline: true,
    rows: 5,
  });
  last.addBinding(readout, 'meshes', COUNT);
  last.addBinding(readout, 'draws', COUNT);
  last.addBinding(readout, 'drawn', COUNT);
  last.addBinding(readout, 'status', { readonly: true });
  last.addBinding(readout, 'causes', {
    readonly: true,
    multiline: true,
    rows: 2,
  });

  const scene = pane.addFolder({ title: 'Change the scene' });

  scene.addBinding(state, 'twin').on('change', ({ value }) => {
    changes.setTwin(value);
    // Hiding a mesh that isn't in the scene changes nothing in the frame.
    visibleRow.disabled = !value;
  });

  const visibleRow = scene
    .addBinding(state, 'twinVisible', { label: 'twin.visible' })
    .on('change', ({ value }) => changes.setTwinVisible(value));

  scene
    .addBinding(state, 'puckColor', {
      label: 'puck.material',
      options: PUCK_OPTIONS,
    })
    .on('change', ({ value }) => changes.setPuckColor(value));
  // `octahedron.material` would wrap to two lines in the pane, so the row takes the mesh's name.
  scene
    .addBinding(state, 'seeThrough', {
      label: 'octahedron',
      options: OCTAHEDRON_OPTIONS,
    })
    .on('change', ({ value }) => changes.setSeeThrough(value));
}
