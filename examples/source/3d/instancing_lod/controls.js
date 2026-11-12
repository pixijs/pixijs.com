/** The pane: the row that pauses the travel, the two values the policy reads, each subject's readouts and a reset */

export function createControls(options) {
  const { pane, state, motion, maxTravel, subjects } = options;
  const animateRow = pane.addBinding(motion, 'animate', { label: 'Animate' });
  const travelRow = pane.addBinding(state, 'travel', {
    min: 0,
    max: maxTravel,
    label: 'Travel away',
  });
  // A refresh fires the row's change handler too, so the handler ignores the animation's own writes.
  let syncing = false;

  /** The reader's own travel stops the animation, so the value stays where they put it */
  function pauseAnimation() {
    if (syncing || !motion.animate) return;
    motion.animate = false;
    animateRow.refresh();
  }

  travelRow.on('change', pauseAnimation);
  // Focus stops it too: a refresh rewrites the number box, so a half-typed value would be lost.
  travelRow.element.addEventListener('focusin', pauseAnimation);
  pane.addBinding(state, 'hysteresis', {
    min: 0,
    max: 3,
    label: 'Hysteresis band',
  });

  for (const subject of subjects) {
    // Folded where the pane opens folded, so on a phone the opened pane stops above the subjects' tags.
    const folder = pane.addFolder({
      title: subject.name,
      expanded: pane.expanded,
    });

    folder.addBinding(subject, 'distance', {
      readonly: true,
      format: (units) => units.toFixed(1),
    });
    folder.addBinding(subject, 'triangles', {
      readonly: true,
      format: (count) => count.toFixed(0),
    });
    folder.addBinding(subject, 'swaps', {
      readonly: true,
      format: (count) => count.toFixed(0),
    });
  }
  pane.addButton({ title: 'Reset swap counts' }).on('click', () => {
    for (const subject of subjects) subject.swaps = 0;
  });

  return {
    /** Shows the animation's travel on its row without the row taking it for the reader's */
    syncTravel() {
      syncing = true;
      travelRow.refresh();
      syncing = false;
    },
  };
}
