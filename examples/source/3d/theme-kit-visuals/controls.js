/** The pane: the theme, and a row per visual that shows or hides it, in a folder for each kind */

import { ThemePane } from './theme/ThemePane';

/** The folders, in the order the stations read: the small helpers first, the 2D overlays last */
const GROUPS = ['Helpers', 'Lines and points', 'Mesh and scene', 'Overlays'];
/** The checkbox column's width in px, narrow enough that 'DimensionHelper' reads whole beside it */
const VALUE_WIDTH = 80;

export function createControls({ title, stage, visuals, expanded }) {
  const pane = new ThemePane({ title, stage, expanded });
  const shown = Object.fromEntries(visuals.map((v) => [v.name, true]));
  const folders = [];

  // Tweakpane works out the value column's width on the pane's root, and every row takes it from there. A checkbox
  // needs little room, so the class names get the rest of the row.
  pane.element.style.setProperty('--tp-blade-value-width', `${VALUE_WIDTH}px`);

  for (const group of GROUPS) {
    const folder = pane.addFolder({ title: group, expanded: false });

    folders.push(folder);
    // One folder open at a time, so the pane stays a short column clear of the inset under it.
    folder.on('fold', ({ expanded: opened }) => {
      if (opened)
        for (const other of folders) other.expanded = other === folder;
    });
    for (const v of visuals) {
      if (v.group === group)
        folder
          .addBinding(shown, v.name)
          .on('change', ({ value }) => v.show(value));
    }
  }

  return pane;
}
