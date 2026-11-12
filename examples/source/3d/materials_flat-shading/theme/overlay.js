/**
 * What every 2D overlay over a view shares: the theme it follows, its colours, the label font, the screen corners a
 * panel docks in, and the rect a camera fills on screen
 *
 * Labels, panels and screen marks all read from here, so a tag, an inset and a mark look like one set.
 */

import { BitmapFont, CanvasSource, Matrix, Point, Texture } from 'pixi.js';

import { helperColor } from './helpers';

import { BRAND, mixColor, THEMES } from './palette';

/** Where an overlay reads the theme from: a `ThemeStage`, or `{ darkness: 0 }` in an example without one */

/** How opaque a panel or a neutral tag is over the scene */
export const PANEL_ALPHA = 0.88;

/**
 * An overlay colour at a darkness, 0 light to 1 dark
 *
 * `'panel'` is a neutral tag's or a panel's fill, white to night. `'ink'` is the theme's text colour and `'inkSoft'`
 * its secondary text colour, for titles, comments and notes. Mid-fade the panel is grey, and a text colour mixed
 * between the themes would be grey too, so the two text colours take whichever theme's colour reads better on it.
 */
export function overlayColor(role, darkness) {
  const panel = mixColor(BRAND.white, BRAND.night, darkness);

  if (role === 'panel') return panel;

  return contrast(THEMES.light[role], panel) >=
    contrast(THEMES.dark[role], panel)
    ? THEMES.light[role]
    : THEMES.dark[role];
}

/**
 * A helper colour as a 2D overlay draws it at a darkness, 0 light to 1 dark
 *
 * It's {@link helperColor} with the theme read from the overlay's `stage` rather than from the 3D helpers, so an
 * example without a ThemeStage still gets the right `'ink'` and `'haze'`. `'ink'` is the theme's `inkSoft`, taking a
 * theme's side mid-fade as {@link overlayColor} does, so a mark never fades into the grey behind it. `'haze'` is the
 * background colour, mixing between the themes as the background does.
 */
export function helperColorAt(color, darkness) {
  if (color === 'ink') return overlayColor('inkSoft', darkness);
  if (color === 'haze')
    return mixColor(THEMES.light.haze, THEMES.dark.haze, darkness);

  return helperColor(color);
}

/**
 * The text colour that reads best on a solid `fill`: night or white, whichever has the higher contrast ratio
 *
 * The axis colours, the accent and the brand and clay colours all get night text; a dark fill such as the light
 * theme's ink gets white.
 */
export function textOn(fill) {
  return contrast(BRAND.night, fill) >= contrast(BRAND.white, fill)
    ? BRAND.night
    : BRAND.white;
}

/** The WCAG contrast ratio between two colours, 1 to 21 */
function contrast(a, b) {
  const first = luminance(a);
  const second = luminance(b);

  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

/** A colour's relative luminance, 0 to 1, as the WCAG contrast ratio defines it */
function luminance(color) {
  return (
    0.2126 * linearChannel(color >> 16) +
    0.7152 * linearChannel(color >> 8) +
    0.0722 * linearChannel(color)
  );
}

/** The low byte of `value`, an sRGB channel, as linear light from 0 to 1 */
function linearChannel(value) {
  const channel = (value & 255) / 255;

  return channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
}

/** The bitmap font every overlay writes in, a monospace */
export const LABEL_FONT = 'theme-label';
/** The label font's size, in px */
export const LABEL_FONT_SIZE = 13;

const FONT_FAMILY = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
/** The glyphs drawn up front; any other character is added the first time a text uses it */
const FONT_CHARS = [[' ', '~'], '°·×−→←↑↓≈πθ…≥≤'];

let fontUsers = 0;

/** Installs the label font on first use; pair every call with {@link releaseLabelFont} in the caller's `destroy()` */
export function useLabelFont() {
  if (fontUsers++ > 0) return;
  BitmapFont.install({
    name: LABEL_FONT,
    chars: FONT_CHARS,
    resolution: 2,
    style: {
      fontFamily: FONT_FAMILY,
      fontSize: LABEL_FONT_SIZE,
      fill: 0xffffff,
    },
  });
}

/** Releases one use of the label font, uninstalling it after the last */
export function releaseLabelFont() {
  if (--fontUsers === 0) BitmapFont.uninstall(LABEL_FONT);
}

/** A screen corner, or the middle of the top or bottom edge, that a panel docks in */

/** Under this many px wide, panels dock the narrow way and the pane opens collapsed */
export const NARROW_BELOW = 600;

const _matrix = new Matrix();
const _corner = new Point();
const _far = new Point();

/**
 * The rect, in global px, that `camera`'s viewport fills on the view: the whole view by default, half of it in a
 * split screen
 *
 * It follows the view's position, anchor and size, so it's the rect to outline a view with or keep tags inside.
 */
export function viewRect(view3d, out, camera = view3d.camera) {
  const { x, y, width, height } = camera.viewport;
  const left = (x - view3d.anchor.x) * view3d.width;
  const top = (y - view3d.anchor.y) * view3d.height;

  view3d.getGlobalTransform(_matrix);
  _matrix.apply(_corner.set(left, top), _corner);
  _matrix.apply(
    _far.set(left + width * view3d.width, top + height * view3d.height),
    _far,
  );

  return out.set(
    Math.min(_corner.x, _far.x),
    Math.min(_corner.y, _far.y),
    Math.abs(_far.x - _corner.x),
    Math.abs(_far.y - _corner.y),
  );
}

/** The side of the disc and triangle textures, in px */
export const MARK_SIZE = 128;
/** The disc's radius in its texture, short of the edge so its antialiased rim isn't cut */
export const DISC_RADIUS = 62;

/** White marks that screen lines tint and scale: a disc for dots and a right-pointing triangle for arrow heads */

let marks = null;
let markUsers = 0;

/** The shared mark textures, made on first use; pair every call with {@link releaseMarkTextures} */
export function useMarkTextures() {
  markUsers++;
  marks ??= {
    disc: markTexture((context) =>
      context.arc(MARK_SIZE / 2, MARK_SIZE / 2, DISC_RADIUS, 0, Math.PI * 2),
    ),
    head: markTexture((context) => {
      context.moveTo(0, 0);
      context.lineTo(MARK_SIZE, MARK_SIZE / 2);
      context.lineTo(0, MARK_SIZE);
    }),
  };

  return marks;
}

/** Releases one use of the mark textures, destroying them after the last */
export function releaseMarkTextures() {
  if (--markUsers > 0 || !marks) return;
  marks.disc.destroy(true);
  marks.head.destroy(true);
  marks = null;
}

/** A white shape on its own mipmapped canvas, so small marks stay smooth and never bleed into each other */
function markTexture(path) {
  const source = new CanvasSource({
    width: MARK_SIZE,
    height: MARK_SIZE,
    resolution: 1,
    autoGenerateMipmaps: true,
  });

  source.context2D.fillStyle = '#fff';
  source.context2D.beginPath();
  path(source.context2D);
  source.context2D.fill();
  source.update();

  return new Texture({ source });
}
