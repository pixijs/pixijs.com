/**
 * How the frame fits the screen: the lens, and where the side view and the feed card go, on the right with the pane
 *
 * The lens is 40°, widened on a screen narrower than FIT_ASPECT rather than backing the camera off, so the side view
 * keeps its scale. The panels dock under the pane as it is now, folded or open, and keep clear of the logo and the
 * stand. On a screen taller than wide with room under the stand, the card docks under the pane and the side view along
 * the bottom. Elsewhere the side view docks under the pane, with the card under it, or on its left where the screen is
 * too short for both; each shrinks to clear the subject, and the lens shifts the picture left through the camera's
 * viewport as far as their smallest need. Where neither clears it, the lens widens a step and they try again.
 *
 * It fits at once, and again when the renderer resizes or the pane folds or opens.
 */

import { DEG_TO_RAD, RAD_TO_DEG, Rectangle } from 'pixi.js';

import { NARROW_BELOW } from './theme/overlay';

import { createSubjectOutline } from './subjectOutline';

/** The landscape lens, in degrees */
const FOV = 40;
/** The narrowest view, width over height, that shows the stand whole at FOV from the orbit's opening side */
const FIT_ASPECT = 1.35;
/**
 * The panels' gaps in px: to the screen's edges and between the panels, the kit panels' margins on a wide screen and
 * on a phone, which leave room for a title tag; the least they keep from the logo and the stand; and the room an
 * inset's title tag stands out over its top edge
 */
const GAP = { edge: 24, narrowEdge: 16, subject: 16, tag: 16 };
/** The rim between each panel's edge and its picture, in px */
export const RIM = 4;
/**
 * The side view's picture, in px: full size, its most height across a phone, and the least share of full size its
 * tags still fit at
 */
export const SIDE = { width: 360, height: 255, narrowHeight: 250, least: 0.7 };
/** The card's picture: its most width in px, and on a phone; the least it shrinks to; its shape, width over height */
export const CARD = { width: 300, narrowWidth: 220, least: 120, aspect: 1.5 };
/** How much the side view shrinks by at each try while it covers the subject */
const SCALE_STEP = 0.01;
/** How much the lens widens by at each try while the panels at their smallest cover the subject, and at most */
const WIDEN = { step: 1.03, most: 2 };

export function createLayout({ orbit, renderer, pane, logo, stand }) {
  const { camera } = orbit;
  const { screen } = renderer;
  const outline = createSubjectOutline({ orbit, logo, stand });
  const layout = {
    side: new Rectangle(),
    card: new Rectangle(),
    stand: { left: 0, right: 0, top: 0, bottom: 0 },
    fits: 0,
  };
  const { side, card } = layout;
  // How far left the lens shifts the picture, in px.
  let shift = 0;

  /**
   * How far the panel round `picture`, its title tag included, reaches over the gap round the logo and the stand, in
   * px: the shift left it still needs, 0 or less once it's clear
   */
  function overlap(picture) {
    const right = outline.rightmost(
      picture.y - RIM - GAP.tag - GAP.subject,
      picture.bottom + RIM + GAP.subject,
    );

    return right - shift + GAP.subject - (picture.x - RIM);
  }

  /** Puts the card's picture `width` px wide against `right`, from `top` down */
  function placeCard(right, top, width) {
    card.width = width;
    card.height = Math.round(width / CARD.aspect);
    card.x = right - width;
    card.y = top;
  }

  /**
   * The side view under the pane at the right, and the card under it, or on its left where the screen is too short
   * for both down the right, each as big as clears the subject. Says whether they clear it.
   */
  function fitBeside(right, top, bottom, edge) {
    // The rims and the gap between the two pictures, and the card's least height.
    const between = RIM * 2 + edge;
    const cardLeast = CARD.least / CARD.aspect;
    const under =
      top + SIDE.height * SIDE.least + between + cardLeast <= bottom;
    const place = (scale, width) => {
      side.width = Math.round(SIDE.width * scale);
      side.height = Math.round(SIDE.height * scale);
      side.x = right - side.width;
      side.y = top;
      if (under) placeCard(right, side.bottom + between, width);
      else placeCard(side.x - between, top, width);
    };
    // As tall as the screen allows, the card's least height left under it when it's under.
    let scale = Math.min(
      1,
      (bottom - top - (under ? between + cardLeast : 0)) / SIDE.height,
    );

    // The lens shifts as far as the two at their smallest need, never so far that the stand leaves the screen.
    place(SIDE.least, CARD.least);
    shift = Math.max(
      0,
      Math.min(
        Math.max(overlap(side), overlap(card)),
        outline.stand.left - GAP.subject,
      ),
    );
    place(scale, CARD.least);
    while (scale > SIDE.least && (overlap(side) > 0 || overlap(card) > 0)) {
      scale = Math.max(SIDE.least, scale - SCALE_STEP);
      place(scale, CARD.least);
    }

    // As wide as it is in scale with the side view, and under it, no wider than the room down to the bottom allows.
    let width = Math.round(
      Math.min(
        CARD.width * scale,
        under ? (bottom - card.y) * CARD.aspect : Infinity,
      ),
    );

    place(scale, width);
    while (width > CARD.least && overlap(card) > 0) place(scale, --width);

    return overlap(side) <= 0 && overlap(card) <= 0;
  }

  /** The card under the pane at the right, and the side view along the bottom under the stand. Says whether it fits. */
  function fitStacked(right, top, bottom, narrow) {
    // The most height the side view's picture can take under the stand's foot, its tag and the gaps kept.
    const room =
      bottom - (outline.stand.foot + GAP.subject + GAP.tag + RIM * 2);
    const scale = Math.min(1, room / SIDE.height);
    let width = narrow ? CARD.narrowWidth : CARD.width;

    // A phone's side view spans the screen; a wider screen's keeps its shape, at the right.
    side.width = narrow
      ? right - (screen.width - right)
      : Math.round(SIDE.width * scale);
    side.height = narrow
      ? Math.min(SIDE.narrowHeight, Math.round(room))
      : Math.round(SIDE.height * scale);
    side.x = right - side.width;
    side.y = bottom - side.height;
    placeCard(right, top, width);
    while (width > CARD.least && overlap(card) > 0)
      placeCard(right, top, --width);

    return scale >= SIDE.least && overlap(card) <= 0;
  }

  /** Fits the lens to the screen at its size now, and places the panels */
  function fit() {
    const { width, height } = screen;
    const narrow = width < NARROW_BELOW;
    const edge = narrow ? GAP.narrowEdge : GAP.edge;
    // The pictures' bounds: inside the screen's edges and under the pane, rims kept. On a short screen an open pane
    // ends too low for the side view under it, so the side view tucks its top under the pane instead.
    const right = width - edge - RIM;
    const bottom = height - edge - RIM;
    const top = Math.min(
      pane.element.getBoundingClientRect().bottom + edge + RIM,
      bottom - SIDE.height * SIDE.least,
    );
    const base = Math.max(1, (FIT_ASPECT * height) / width);
    // A screen taller than wide tries the card and the side view stacked first; any but a phone held upright, which
    // has no width to spare, tries them beside the subject.
    const stacks = height > width;
    const besides = !stacks || !narrow;

    for (let widen = base; widen < base * WIDEN.most; widen *= WIDEN.step) {
      setFov(camera, widen);
      outline.measure(width, height);
      shift = 0;
      if (
        (stacks && fitStacked(right, top, bottom, narrow)) ||
        (besides && fitBeside(right, top, bottom, edge))
      )
        break;
    }
    // A viewport wider than the view, out past its left edge, centres the lens `shift` px left of the screen's middle.
    camera.viewport.set((-2 * shift) / width, 0, 1 + (2 * shift) / width, 1);
    layout.stand.left = outline.stand.left - shift;
    layout.stand.right = outline.stand.right - shift;
    layout.stand.top = outline.stand.top;
    layout.stand.bottom = outline.stand.bottom;
    layout.fits++;
  }

  fit();
  renderer.on('resize', fit);
  // The pane folding or opening moves the panels with it.
  new ResizeObserver(() => fit()).observe(pane.element);

  return layout;
}

/** Sets FOV, widened by `widen`: the tangent of the half angle scales, so the picture shrinks by that much */
function setFov(camera, widen) {
  camera.fov =
    2 * Math.atan(Math.tan((FOV * DEG_TO_RAD) / 2) * widen) * RAD_TO_DEG;
}
