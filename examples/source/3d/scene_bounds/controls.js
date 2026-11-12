/**
 * The pane: the box size, how the fit scales and whether it centres, the swarm's `boundsVolume`, the bounds frames,
 * and which model is measured, with what `getLocalBounds()` and `getSize()` read from it
 */

import { ThemePane } from './theme/ThemePane';

/** How a model is fitted: scaled evenly by its longest side, stretched to fill the box, or scaled but not centred */

/** The values the pane sets and the lesson and its visuals read */

function sizeText({ width, height, depth }) {
  return `${width.toFixed(2)} × ${height.toFixed(2)} × ${depth.toFixed(2)}`;
}

export function createControls({ stage, state, useVolume, items, measured }) {
  const pane = new ThemePane({ title: 'Size and bounds', stage });

  pane.addBinding(state, 'boxSize', {
    label: 'Box size',
    min: 0.5,
    max: 2.2,
    format: (v) => v.toFixed(2),
  });
  pane.addBinding(state, 'fit', {
    label: 'Fit',
    options: {
      'Keep shape': 'keep-shape',
      Stretch: 'stretch',
      'Skip centring': 'skip-centring',
    },
  });
  pane
    .addBinding(state, 'useVolume', { label: 'boundsVolume' })
    .on('change', ({ value }) => useVolume(value));
  // Two-word labels take a no-break space, which keeps them on one line in the pane's narrow label column.
  pane.addBinding(state, 'showBounds', { label: 'Show\u00a0bounds' });

  const measure = pane.addFolder({ title: 'Measure' });
  // The pane reads these a few times a second: getLocalBounds() in the model's own units, and getSize(), the size it
  // shows at in its slot.
  const readout = {
    get local() {
      return sizeText(items[state.focus].bounds);
    },
    get size() {
      return sizeText(measured);
    },
  };

  measure.addBinding(state, 'focus', {
    label: 'Model',
    options: { capsule: 0, logo: 1, swarm: 2 },
  });
  measure.addBinding(readout, 'local', {
    label: 'Local\u00a0bounds',
    readonly: true,
  });
  measure.addBinding(readout, 'size', { label: 'Size', readonly: true });
}
