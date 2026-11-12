/**
 * The pane's rows under the theme switch: whether the castles are in the scene, the destroy flags, and the memory the
 * castles hold, read only, with the button that frees a leak
 */

/** The `Destroy3DOptions` flags the lesson sets, in the pane's order */
const DESTROY_FLAGS = [
  'children',
  'geometry',
  'material',
  'texture',
  'textureSource',
];
const MEGABYTES = { readonly: true, format: (mb) => `${mb.toFixed(2)} MB` };

export function createControls(options) {
  const {
    pane,
    state,
    destroyOptions,
    readout,
    leaked,
    moveCastles,
    destroyAgain,
    freeLeaked,
  } = options;

  pane.addBinding(state, 'inScene', { label: 'in scene' }).on('change', () => {
    moveCastles();
    refresh();
  });

  // The flags are destroy()'s arguments: while the castles are out, a change destroys the destroy bay's castle again
  // with them, and while they're in there's nothing destroyed for them to change, so they rest.
  const flags = pane.addFolder({ title: 'destroy options' });

  for (const flag of DESTROY_FLAGS) {
    flags.addBinding(destroyOptions, flag).on('change', () => {
      destroyAgain();
      refresh();
    });
  }

  const memory = pane.addFolder({ title: 'memory' });

  memory.addBinding(readout, 'gpu', { label: 'GPU', ...MEGABYTES });
  memory.addBinding(readout, 'cpu', { label: 'CPU', ...MEGABYTES });
  memory.addBinding(readout, 'leaked', {
    readonly: true,
    format: (n) => `${n} castle${n === 1 ? '' : 's'}`,
  });

  const freeButton = memory.addButton({ title: 'Free leaked', disabled: true });

  freeButton.on('click', () => {
    freeLeaked();
    refresh();
  });

  /** Rests the flags while the castles are in, enables Free leaked while anything has leaked, and reads out now */
  function refresh() {
    flags.disabled = state.inScene;
    freeButton.disabled = leaked.length === 0;
    // Read-only rows poll on a timer, so a leak's count would show a beat after its pink.
    pane.refresh();
  }
}
