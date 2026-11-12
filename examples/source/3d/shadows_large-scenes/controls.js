/**
 * The pane: cascades or a fixed box, each one's settings in its own folder, the update rate and a refresh button
 *
 * Changing a cascade row picks cascades and changing the box's length picks the box, so the scene always shows the
 * placement the reader just set. The refresh button works only under 'manual': at any other rate the next scheduled
 * redraw would swallow the press.
 */

import { ListInputBindingApi } from 'tweakpane';

/** The update choices, written the way the code writes each value */

/** Everything the pane sets */

/** The distance rows in whole metres */
const METRES = { step: 1, format: (value) => value.toFixed(0) };

const CASCADE_UPDATES = ['1', '4', '8', '[1, 2, 4, 8]', "'manual'"].map(
  (text) => ({ text, value: text }),
);
// A fixed box takes no per-cascade array: it has only the one map.
const BOX_UPDATES = CASCADE_UPDATES.filter(
  ({ value }) => value !== '[1, 2, 4, 8]',
);

export function createControls({ pane, settings, apply, refresh }) {
  const shadowRow = pane.addBinding(settings, 'shadow', {
    label: 'Shadow',
    options: { Cascades: 'cascades', 'Fixed box': 'box' },
  });
  const cascadesFolder = pane.addFolder({ title: 'Cascades' });
  const cascadesRow = cascadesFolder.addBinding(settings, 'cascades', {
    options: { 1: 1, 2: 2, 3: 3, 4: 4 },
  });
  const maxDistanceRow = cascadesFolder.addBinding(settings, 'maxDistance', {
    min: 20,
    max: 120,
    ...METRES,
  });
  const boxFolder = pane.addFolder({ title: 'Fixed box' });
  // From 20 m, the box's far face stands past the nearest shapes and posts.
  const lengthRow = boxFolder.addBinding(settings, 'boxLength', {
    label: 'Box length',
    min: 20,
    max: 120,
    ...METRES,
  });

  // Both placements redraw on the same rule, so the row sits apart from their folders.
  pane.addBlade({ view: 'separator' });

  const updateRow = pane.addBinding(settings, 'update', {
    options: CASCADE_UPDATES,
  });

  const refreshButton = pane.addButton({ title: 'Refresh shadows' });

  refreshButton.on('click', refresh);

  /** Opens the placement's own folder, offers the update choices it takes, and lets Refresh work under 'manual' */
  function showPlacement() {
    const box = settings.shadow === 'box';

    cascadesFolder.expanded = !box;
    boxFolder.expanded = box;
    if (updateRow instanceof ListInputBindingApi)
      updateRow.options = box ? BOX_UPDATES : CASCADE_UPDATES;
    if (box && settings.update === '[1, 2, 4, 8]') {
      settings.update = '1';
      updateRow.refresh();
      pane.flash(updateRow);
    }
    refreshButton.disabled = settings.update !== "'manual'";
  }

  /** Puts a row's change on the sun, in the placement that row belongs to */
  function change(placement) {
    if (placement && placement !== settings.shadow) {
      settings.shadow = placement;
      shadowRow.refresh();
    }
    showPlacement();
    apply();
  }

  for (const row of [shadowRow, updateRow]) row.on('change', () => change());
  for (const row of [cascadesRow, maxDistanceRow])
    row.on('change', () => change('cascades'));
  lengthRow.on('change', () => change('box'));

  showPlacement();
}
