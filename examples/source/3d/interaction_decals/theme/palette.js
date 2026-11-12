/**
 * Every colour the theme paints with: the PixiJS brand, the clay tints, and the light and dark stage
 *
 * The stage, the clay, the logo and the loading screen all read from here, so a colour changes in one place.
 */

import { linearToSrgb } from '@pixi/3d';
import { Color } from 'pixi.js';

export const BRAND = {
  /** The brand pink: the wordmark, accents and the first clay colour */
  pink: 0xe91e63,
  purple: 0x8b5cf6,
  sky: 0x38bdf8,
  orange: 0xf2a65a,
  white: 0xffffff,
  /** The 3D logo's lacquered face */
  logoFace: 0xed145b,
  /** The brand pink turned up, for light rather than paint: glows, sparks and flashes */
  hotPink: 0xff4a86,
  /** Text on the light theme */
  ink: 0x1c1e21,
  /** A violet near-black, the dark theme's deepest shade */
  night: 0x0b0710,
};

/** The clay colour names, in the order a crowd's material slots use */
export const CLAY_COLORS = [
  'pink',
  'palePink',
  'purple',
  'lilac',
  'sky',
  'paleSky',
  'orange',
  'white',
];

/** Clay colours: the brand's four, a softer tint of three of them, and white */
export const CLAY = {
  pink: BRAND.pink,
  palePink: 0xf48fb1,
  purple: BRAND.purple,
  lilac: 0xb79cf9,
  sky: BRAND.sky,
  paleSky: 0x9adcfb,
  orange: BRAND.orange,
  white: BRAND.white,
};

/**
 * The amber that orange clay turns to on the dark theme, where the brand orange reads as brown
 *
 * Use it for an orange baked once that has to hold on both themes, such as a vertex colour.
 */
export const DARK_ORANGE = 0xffb04a;

/** How often each clay colour turns up in a crowd, relative to the others */
export const CLAY_WEIGHTS = {
  pink: 26,
  purple: 18,
  sky: 18,
  palePink: 12,
  lilac: 8,
  orange: 7,
  paleSky: 6,
  white: 5,
};

/** The colours of one theme, as they show on screen */

export const THEMES = {
  // Pale lavender checks into a white-lavender haze.
  light: {
    name: 'light',
    haze: 0xf3f1f7,
    sky: 0xe7e3ef,
    floor: 0xe4e0ec,
    check: 0.91,
    ink: BRAND.ink,
    inkSoft: 0x4b4653,
  },
  // Charcoal-purple checks into a purple-black haze; the darker check needs more contrast to show at all.
  dark: {
    name: 'dark',
    haze: 0x110d17,
    sky: 0x09070d,
    floor: 0x3a3244,
    check: 0.7,
    ink: 0xf5f2f8,
    inkSoft: 0xc6bfd0,
  },
};

/** The theme named by `?theme=light|dark`, else `fallback` */
export function themeFromUrl(fallback = 'light') {
  const name = new URLSearchParams(window.location.search).get('theme');

  return name === 'light' || name === 'dark' ? name : fallback;
}

/** Mixes two 0xRRGGBB colours channel by channel, `t` from 0 (`a`) to 1 (`b`) */
export function mixColor(a, b, t) {
  let out = 0;

  for (let shift = 16; shift >= 0; shift -= 8) {
    const from = (a >> shift) & 255;
    const to = (b >> shift) & 255;

    out |= Math.round(from + (to - from) * t) << shift;
  }

  return out;
}

/**
 * The colour to give a view's fog or background so it shows on screen as `color`
 *
 * The view decodes colours and encodes its output with the same 2.2 gamma, so the round trip already lands on
 * `color` and this returns it unchanged.
 */
export function screenColor(color) {
  let out = 0;

  for (let shift = 16; shift >= 0; shift -= 8) {
    out |=
      Math.round(
        linearToSrgb(Math.pow(((color >> shift) & 255) / 255, 2.2)) * 255,
      ) << shift;
  }

  return out;
}

/** A colour as the CSS hex string a page's own styles need */
export function cssColor(color) {
  return Color.shared.setValue(color).toHex();
}
