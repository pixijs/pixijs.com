/**
 * The record of the latest press on a node, which `index.ts`'s listeners write, the visuals frame and the pane prints
 *
 * The listeners read the event's fields and hand over plain values, so every read of the event is in `index.ts`.
 */

/** One listener that ran */

/** What the listeners heard on the latest press on a node */

/** Which node's listener calls stopPropagation(), by its label ('' for none), and in which phase */

/** eventPhase's values by name, for the log: pixi's CAPTURING_PHASE (1), AT_TARGET (2) and BUBBLING_PHASE (3) */
const PHASE_NAMES = ['none', 'capture', 'target', 'bubble'];

/** What the log reads before a press, and again once a change in the pane has cleared it */
const EMPTY_LOG = 'press the cube, ball or table';

export function createTrip() {
  return { press: 0, target3D: '', hops: [], log: EMPTY_LOG };
}

/** Starts the record over for a new press */
export function startTrip(trip, press, target3D) {
  trip.press = press;
  trip.target3D = target3D;
  trip.hops.length = 0;
  trip.log = 'eventPhase currentTarget3D';
}

/** Empties the record, since the press it holds ran under settings the pane has just changed */
export function clearTrip(trip) {
  trip.target3D = '';
  trip.hops.length = 0;
  trip.log = EMPTY_LOG;
}

/** Records and logs a 3D listener's hop */
export function recordHop(trip, hop) {
  trip.hops.push(hop);
  writeLine(
    trip,
    hop.phase,
    hop.node.label ?? '',
    hop.stopped ? 'stopPropagation()' : '',
  );
}

/** Logs the eventPhase and currentTarget3D the View's own listeners read */
export function recordView(trip, phase, currentTarget3D) {
  writeLine(trip, phase, currentTarget3D, 'view3d heard it');
}

function writeLine(trip, phase, current, note) {
  trip.log += `\n${phase} ${PHASE_NAMES[phase].padEnd(9)}${current.padEnd(6)}${note}`;
}
