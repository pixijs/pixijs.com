/**
 * The pane: Fly, the target's position, the turn rate, which head to read, and that head's view of the target from
 * `toLocal`
 *
 * The flight writes the target's position every frame, so the position rows follow it, and moving one pauses the
 * flight, so the target stays where the reader put it.
 */

import { ThemePane } from './theme/ThemePane';

export function createControls({ stage, target, readings, settings }) {
  const pane = new ThemePane({ title: 'Look at', stage });
  const flyRow = pane.addBinding(settings, 'fly', { label: 'Fly' });
  // In front of the turrets, and never so high that a head looks straight up, where lookAt with +y up breaks down.
  // No `step`: a stepped row writes its rounded value back when the flight refreshes it.
  const position = pane.addFolder({ title: 'target.position' });

  position.addBinding(target.position, 'x', { min: -3, max: 3 });
  position.addBinding(target.position, 'y', { min: 1.2, max: 3.2 });
  position.addBinding(target.position, 'z', { min: -6.5, max: -4.5 });
  pane.addBinding(settings, 'turnRate', {
    label: 'Turn rate',
    min: 10,
    max: 120,
    step: 5,
    format: (degrees) => `${degrees}°/s`,
  });
  pane.addBinding(settings, 'head', {
    label: 'Head',
    options: { left: 0, middle: 1, right: 2 },
  });

  // The selected head's reading, which the pane polls a few times a second, so the frame loop builds no string.
  const reading = {
    get toLocal() {
      const { x, y, z } = readings[settings.head];

      return `(${tenths(x)}, ${tenths(y)}, ${tenths(z)})`;
    },
  };

  pane.addBinding(reading, 'toLocal', { readonly: true });

  // A refresh fires the rows' change handler too, so the handler ignores the flight's own writes.
  let syncing = false;

  function pauseFlight() {
    if (syncing || !settings.fly) return;
    settings.fly = false;
    flyRow.refresh();
  }

  position.on('change', pauseFlight);
  // A refresh rewrites a number box, so focus pauses the flight too, before a half-typed value is lost.
  for (const row of position.children)
    row.element.addEventListener('focusin', pauseFlight);

  return {
    /** Shows the position the flight just wrote in the target's rows */
    showPosition() {
      syncing = true;
      position.refresh();
      syncing = false;
    },
  };
}

/** A number to one decimal, with -0.0 read as 0.0 */
function tenths(value) {
  return (Math.round(value * 10) / 10 + 0).toFixed(1);
}
