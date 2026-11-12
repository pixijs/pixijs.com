/**
 * The pane: the label to find and whether the search goes deep, what it found, a button for each call that moves the
 * found piece to the other board, the piece's parent and `position`, a reset, and the events the last move fired
 *
 * Each row calls a function from `index.ts`, so every engine call the lesson teaches stays there.
 */

const METHODS = ['addChild', 'reparentChild'];
/** A move fires four events, so the log holds one move's worth */
const LOG_ROWS = 4;
/** Each log column's width in characters: the longest label, `right`, and event, `childRemoved`, plus a space */
const NODE_COLUMN = 6;
const EVENT_COLUMN = 13;

/** A value as the pane shows it, two decimals, with −0.00 written as 0.00 */
const fix = (value) => (Math.round(value * 100) / 100 || 0).toFixed(2);

export function createControls(options) {
  const { pane, labels, start, boards, pieces, find, move, reset } = options;
  const params = { label: start, deep: true };
  let found = null;
  // Read when the rows poll or refresh, so they always describe the found node as it is now.
  const readout = {
    get found() {
      return found?.label ?? 'null';
    },
    get parent() {
      // The root has no label.
      return found?.parent ? (found.parent.label ?? 'root') : '';
    },
    get position() {
      if (!found) return '';

      const { x, y, z } = found.position;

      return `${fix(x)}, ${fix(y)}, ${fix(z)}`;
    },
  };
  const events = { row: '' };
  const findFolder = pane.addFolder({ title: 'Find' });

  findFolder
    .addBinding(params, 'label', { options: optionsOf(labels) })
    .on('change', findAgain);
  findFolder.addBinding(params, 'deep').on('change', findAgain);

  const foundRow = findFolder.addBinding(readout, 'found', { readonly: true });
  const moveFolder = pane.addFolder({ title: 'Move' });
  // Each button names its call and the board it sends the piece to, so comparing the two calls is a click on each.
  const moveButtons = METHODS.map((method) => {
    const button = moveFolder.addButton({ title: method });

    button.on('click', () => {
      const to = target();

      if (!found || !to) return;
      move(found, to, method);
      showFound();
      // The call rewrote `position` or kept it, which is the lesson either way, so the row lights.
      pane.flash(positionRow);
    });

    return button;
  });
  const parentRow = moveFolder.addBinding(readout, 'parent', {
    readonly: true,
  });
  const positionRow = moveFolder.addBinding(readout, 'position', {
    readonly: true,
  });

  moveFolder.addButton({ title: 'Reset' }).on('click', () => {
    reset();
    showFound();
  });

  /** The board the found piece would move to, or `undefined` when the search found a board or nothing */
  function target() {
    const piece = found;

    return piece && pieces.includes(piece)
      ? boards.find((board) => board !== piece.parent)
      : undefined;
  }

  function findAgain() {
    found = find(params.label, params.deep);
    showFound();
  }

  /** Shows the found node's parent and position, and points the move buttons at the other board */
  function showFound() {
    const to = target();

    moveButtons.forEach((button, i) => {
      button.title = to ? `${METHODS[i]} → ${to.label}` : METHODS[i];
      button.disabled = !to;
    });
    foundRow.refresh();
    parentRow.refresh();
    positionRow.refresh();
  }

  // A phone opens the pane folded, and the log with it, so a reader who unfolds the pane to move a piece still sees
  // the boards below it. `label: undefined` drops Tweakpane's label column, so the log spans the folder.
  const logRow = pane
    .addFolder({ title: 'Events', expanded: pane.expanded })
    .addBinding(events, 'row', {
      label: undefined,
      readonly: true,
      multiline: true,
      rows: LOG_ROWS,
      bufferSize: LOG_ROWS,
      interval: 0,
    });

  findAgain();

  return {
    get found() {
      return found;
    },
    log(emitter, event, other) {
      events.row = `${(emitter.label ?? '').padEnd(NODE_COLUMN)}${event.padEnd(EVENT_COLUMN)}${other.label}`;
      logRow.refresh();
    },
  };
}

/** A list row's options, each shown as its own name */
function optionsOf(names) {
  return Object.fromEntries(names.map((name) => [name, name]));
}
