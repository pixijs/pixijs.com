/**
 * Matte clay with a pale sheen, the surface of every shape in `shapes.ts`
 *
 * One material serves both themes: a theme changes the light, not the clay, so a toggle never swaps materials
 * under a batch. `ThemeStage` turns the sheen down and brightens orange to amber as it darkens, on every clay
 * material the kit made that is still alive, shared or your own.
 */

import { Material3D } from '@pixi/3d';

import { CLAY, DARK_ORANGE, mixColor } from './palette';

/** How a shared clay material draws: see-through or two-sided, with shader bits of your own */

/** Clay built with an `emissive` group, whose glow controls are always there */

/** The sheen's tint at full strength: a pale lilac velvet at grazing angles */
const SHEEN = 0xe6e0f2;

/** The sheen left on the dark theme, where the rim that softens clay on paper reads as frost */
const DARK_SHEEN = 0.3;

/** Clay colours that muddy on a dark ground, and the brighter one each turns to there */
const DARK_COLORS = new Map([[CLAY.orange, DARK_ORANGE]]);

const cache = new Map();
/** Every clay material alive, shared or not, which {@link setClayDarkness} repaints */
const live = new Set();
let darkness = 0;

function themed(hex) {
  const dark = DARK_COLORS.get(hex);

  return dark === undefined ? hex : mixColor(hex, dark, darkness);
}

function sheenColor() {
  return mixColor(0, SHEEN, 1 + (DARK_SHEEN - 1) * darkness);
}

/** Clay that follows the theme while it lives: it joins the set the darkness walk repaints, and leaves on destroy */
class ClayMaterial extends Material3D {
  /** The colour on the light theme, which the dark one may brighten */
  _hex = 0;

  constructor(hex, options) {
    super({
      baseColor: themed(hex),
      baseColorTexture: options.baseColorTexture,
      extraBits: options.extraBits,
      alphaMode: options.alphaMode,
      alpha: options.alpha,
      doubleSided: options.doubleSided,
      metallic: 0,
      roughness: 0.58,
      sheen: { color: sheenColor(), roughness: 0.42 },
      emissive: options.emissive,
    });
    this._hex = hex;
    live.add(this);
  }

  /** Writes the sheen and, for a colour that brightens in the dark, the base colour for the current darkness */
  repaint(sheen) {
    this.sheen.color = sheen;
    if (DARK_COLORS.has(this._hex)) this.baseColor = themed(this._hex);
  }

  destroy(options) {
    live.delete(this);
    super.destroy(options);
  }
}

/**
 * Clay in one colour, shared and cached per colour and look: its bit names, alpha mode, opacity and sides
 *
 * The kit owns these: don't destroy them yourself. Call {@link releaseClayMaterials} in your teardown, after
 * `view3d.unload()`.
 * @param color - A clay colour name, or any 0xRRGGBB.
 * @param options - How it draws: `extraBits`, `alphaMode` with `alpha` for see-through clay, `doubleSided`.
 */
export function clayMaterial(color, options = {}) {
  const hex = typeof color === 'number' ? color : CLAY[color];
  const { extraBits, alphaMode = 'opaque', doubleSided = false } = options;
  const alpha = Math.round((options.alpha ?? 1) * 100) / 100;
  const bits = extraBits?.length
    ? extraBits.map((bit) => bit.name).join(',')
    : '';
  const key = `${hex}:${alphaMode}:${alpha}:${doubleSided ? 2 : 1}:${bits}`;
  let material = cache.get(key);

  if (!material) {
    material = new ClayMaterial(hex, {
      extraBits,
      alphaMode,
      alpha,
      doubleSided,
    });
    cache.set(key, material);
  }

  return material;
}

/**
 * A clay material of your own, not shared: one per toy with its own painted texture, or one that glows
 *
 * A shared clay material is on every mesh of its colour and look, and glow controls exist only on a material built
 * with an `emissive` group, so this is how clay gets a texture of its own or a glow. It follows the theme like the
 * shared ones until you destroy it. The caller owns the result.
 * @example
 * ```ts
 * const lamp = createClayMaterial({ color: 'pink', emissive: { color: BRAND.hotPink, strength: 0 } });
 *
 * lamp.emissive.strength = 0.8; // a hit lights it
 * ```
 */

export function createClayMaterial(options = {}) {
  const { color = 'white' } = options;

  return new ClayMaterial(
    typeof color === 'number' ? color : CLAY[color],
    options,
  );
}

/**
 * Moves every live clay material between the light theme (0) and the dark one (1)
 *
 * `ThemeStage` calls it; call it yourself only when lighting a scene without one. A uniform write or two per
 * material, cheap enough to fade.
 */
export function setClayDarkness(t) {
  if (t === darkness) return;
  darkness = t;

  const sheen = sheenColor();

  for (const material of live) material.repaint(sheen);
}

/**
 * Destroys every shared clay material, so the next {@link clayMaterial} call builds afresh, and stops the ones
 * {@link createClayMaterial} made from following the theme; those stay yours to destroy
 */
export function releaseClayMaterials() {
  for (const material of cache.values()) material.destroy();
  cache.clear();
  live.clear();
}
