/**
 * The pane: how the view shares pointer input with the swatches under it, its background, and its place and size in
 * the card
 *
 * The Layout rows bind straight to the view. position.x and anchor.x end where the widest view would leave the screen
 * or run under the open pane, so their ends follow the card's place on screen, and anchor.x's follows position.x.
 */

import { CLAY } from './theme/palette';

import { VIEW_REACH } from './scene';

/** How the view shares pointer input with the swatches under it */

/** The Pointer row's choices, named so a reader can find each one in `setPointerMode` in `index.ts` */
const POINTER_CHOICES = {
  'hitArea = null': 'default',
  'hitArea = logoArea': 'logoArea',
  "eventMode = 'none'": 'none',
  'swatches above': 'swatchesAbove',
};
/** position.y's reach in the card's px: from where the dot on the view's corner clears the subtitle on a small card */
const POSITION_Y = { min: 88, max: 120, step: 1 };
const SIZE = {
  width: { min: 200, max: VIEW_REACH.width, step: 1 },
  height: { min: 240, max: 400, step: 1 },
};
/** The furthest anchor.x slides the view left round the point `position` names, unless the screen's edge comes first */
const ANCHOR_X_MAX = 0.25;

export function createControls(options) {
  const { pane, view3d, page, pointer, setPointerMode } = options;
  const settings = { pointer, background: 'null' };

  /** position.x's end: where the widest view's right edge meets the room the layout gives it, at most `VIEW_REACH.x` */
  function xReach() {
    const { card, viewRoom } = page;

    return Math.min(
      VIEW_REACH.x,
      Math.floor((viewRoom.right - card.x) / card.scale.x - VIEW_REACH.width),
    );
  }

  /**
   * anchor.x's end: the anchor that slides the widest view left from where position.x has it to the room's left edge,
   * or `ANCHOR_X_MAX` if that's less. The card is placed in screen px, so its x less the room's is the space left of it.
   */
  function anchorReach() {
    const { card, viewRoom } = page;
    const room = view3d.position.x + (card.x - viewRoom.x) / card.scale.x;

    return Math.min(
      ANCHOR_X_MAX,
      Math.floor((room / VIEW_REACH.width) * 100) / 100,
    );
  }

  pane
    .addBinding(settings, 'pointer', {
      label: 'Pointer',
      options: POINTER_CHOICES,
    })
    .on('change', ({ value }) => setPointerMode(value));
  // Tweakpane can't bind a null, so the row holds a name and sets the view's background from it.
  pane
    .addBinding(settings, 'background', {
      options: { null: 'null', '0x9adcfb': 'paleSky' },
    })
    .on(
      'change',
      ({ value }) =>
        (view3d.background = value === 'null' ? null : CLAY.paleSky),
    );

  // A number row with a min and a max is a slider whose ends can move.
  const layout = pane.addFolder({ title: 'Layout' });
  const xRow = layout.addBinding(view3d.position, 'x', {
    label: 'position.x',
    min: 0,
    max: xReach(),
    step: 1,
  });

  layout.addBinding(view3d.position, 'y', {
    label: 'position.y',
    ...POSITION_Y,
  });
  layout.addBinding(view3d, 'width', SIZE.width);
  layout.addBinding(view3d, 'height', SIZE.height);

  // anchor.x alone, since an anchor.y over 0 slides the view up over the card's title.
  const anchorRow = layout.addBinding(view3d.anchor, 'x', {
    label: 'anchor.x',
    min: 0,
    max: anchorReach(),
    step: 0.01,
  });

  /** Moves the two ends to the screen and to position.x, and pulls a value past its end back in */
  function fitEnds() {
    xRow.max = xReach();
    view3d.position.x = Math.min(view3d.position.x, xRow.max);
    anchorRow.max = anchorReach();
    view3d.anchor.x = Math.min(view3d.anchor.x, anchorRow.max);
    layout.refresh();
  }

  return {
    update() {
      // A resize moves and scales the card, and position.x moves the room anchor.x has to its left.
      if (xRow.max !== xReach() || anchorRow.max !== anchorReach()) fitEnds();
    },
  };
}
