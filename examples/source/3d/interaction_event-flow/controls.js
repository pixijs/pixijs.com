/**
 * The pane: which listener stops the press, the tray's eventMode and interactiveChildren, and what the latest press
 * on a node reached
 *
 * The tray's rows bind straight to the node. A change in either folder clears the latest press, which ran under the
 * old settings, so the boxes and the log wait for a press under the new ones.
 */

import { clearTrip } from './trip';

/** The log's rows: the header, five hops (a cube press nobody stops) and the View's line */
const LOG_ROWS = 7;

export function createControls({ pane, stop, tray, trip }) {
  const stopFolder = pane.addFolder({ title: 'stopPropagation()' });

  stopFolder.addBinding(stop, 'at', {
    options: { nobody: '', table: 'table', tray: 'tray', cube: 'cube' },
  });
  stopFolder.addBinding(stop, 'phase', {
    options: { capture: 'capture', bubble: 'bubble' },
  });

  const trayFolder = pane.addFolder({ title: 'tray' });

  trayFolder.addBinding(tray, 'eventMode', {
    options: {
      none: 'none',
      passive: 'passive',
      auto: 'auto',
      static: 'static',
      dynamic: 'dynamic',
    },
  });
  // The pane has no label width option yet, and the default value column cuts the name to `interactiveChild`. A
  // checkbox needs little room, so its value column gives the label the rest.
  trayFolder
    .addBinding(tray, 'interactiveChildren')
    .element.style.setProperty('--bld-vw', '88px');

  stopFolder.on('change', () => clearTrip(trip));
  trayFolder.on('change', () => clearTrip(trip));

  const pressFolder = pane.addFolder({ title: 'Latest press' });

  pressFolder.addBinding(trip, 'target3D', { readonly: true });
  // `label: undefined` drops Tweakpane's label column, so the log spans the folder.
  pressFolder.addBinding(trip, 'log', {
    label: undefined,
    readonly: true,
    multiline: true,
    rows: LOG_ROWS,
  });
}
