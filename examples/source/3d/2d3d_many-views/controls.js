/**
 * The pane's rows: how many cards there are, which card's shape spins, which card is in focus, that card's
 * `camera.fov`, and a reset
 *
 * The rows only call back into `index.ts`, so every view and camera call stays there.
 */

/** `Spinning`'s value when no card's shape turns */
export const NO_CARD = -1;
/**
 * The `camera.fov` row's range: from a close zoom, where the tallest shape fills about half its view's height, to 50,
 * the widest at which the frustum stays inside the overview
 */
const FOV_RANGE = { min: 26, max: 50 };

/** What the rows show; `index.ts` writes it back when the scene changes under a row */

export function createControls(options) {
  const { pane, state, cards, maxCards, onCards, onFocus, onFov, onReset } =
    options;
  const count = pane.addBinding(state, 'cards', {
    label: 'Cards',
    min: 1,
    max: maxCards,
    step: 1,
  });
  // List blades, since a binding's options can't change once it's built and these follow the card count.
  const spinning = pane.addBlade({
    view: 'list',
    label: 'Spinning',
    options: [{ text: 'None', value: NO_CARD }, ...cardOptions(cards)],
    value: state.spinning,
  });
  const focus = pane.addBlade({
    view: 'list',
    label: 'Focus',
    options: cardOptions(cards),
    value: state.focus,
  });
  const fov = pane.addBinding(state, 'fov', {
    label: 'camera.fov',
    step: 1,
    ...FOV_RANGE,
  });
  // Setting a row from code fires its `change`, and a row the scene moved isn't a new choice.
  let refreshing = false;

  function refresh() {
    refreshing = true;
    spinning.options = [
      { text: 'None', value: NO_CARD },
      ...cardOptions(cards),
    ];
    spinning.value = state.spinning;
    focus.options = cardOptions(cards);
    focus.value = state.focus;
    fov.refresh();
    refreshing = false;
  }

  count.on('change', ({ value }) => {
    onCards(value);
    refresh();
  });
  spinning.on('change', ({ value }) => {
    if (!refreshing) state.spinning = value;
  });
  focus.on('change', ({ value }) => {
    if (refreshing) return;
    onFocus(value);
    refresh();
  });
  fov.on('change', ({ value }) => {
    if (!refreshing) onFov(value);
  });
  pane.addButton({ title: 'Reset cameras' }).on('click', () => {
    onReset();
    refresh();
  });

  return { refresh };
}

/** Each card by its place in the grid and its name */
function cardOptions(cards) {
  return cards.map((card, i) => ({
    text: `${i + 1} · ${card.name}`,
    value: i,
  }));
}
