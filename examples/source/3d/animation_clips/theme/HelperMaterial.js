/**
 * A helper material of your own, whose colour and opacity you can change every frame
 *
 * The shared {@link helperMaterial} is cached per colour and opacity, so a colour that follows a picker or a ghost
 * that fades would fill the cache. A `HelperMaterial` is one material, not cached, that takes the new values in
 * place: `material.color = 0x38bdf8`, `material.alpha = 0.4`. It looks the same as the shared one, flat colour with
 * no shading, shadows or fog, and it's always blended, so `alpha` works from 1 down. An `'ink'` or `'haze'` one
 * follows the theme while it's alive. You own it: `destroy()` it when you're done.
 */

import { Material3D } from '@pixi/3d';

import {
  flatOptions,
  helperColor,
  unwatchHelperTheme,
  watchHelperTheme,
} from './helpers';

import { screenColor } from './palette';

/** Options for {@link createHelperMaterial} */

/** A flat helper material with a settable `color`; see {@link createHelperMaterial} */
export class HelperMaterial extends Material3D {
  _color;
  /** The glow its colour lives in */
  _glow;

  constructor({ color = 'ink', opacity = 1, xray = false } = {}) {
    super({
      ...flatOptions(helperColor(color)),
      alphaMode: 'blend',
      alpha: opacity,
      doubleSided: true,
    });

    this._color = color;
    // flatOptions passes an emissive group, so its controls are always there.
    this._glow = this.emissive;
    if (xray) this.state.depthTest = false;
    watchHelperTheme(this);
  }

  /** The colour it shows: an axis, `'ink'`, `'accent'`, `'haze'` or any 0xRRGGBB; written in place */
  get color() {
    return this._color;
  }
  set color(value) {
    if (value === this._color) return;
    this._color = value;
    this.repaint();
  }

  /** Writes the colour again, for the theme's current ink and haze; the kit calls it as the theme moves */
  repaint() {
    this._glow.color = screenColor(helperColor(this._color));
  }

  destroy(options) {
    unwatchHelperTheme(this);
    super.destroy(options);
  }
}

/**
 * A helper material of your own, for a colour or opacity that changes while the example runs
 *
 * ```ts
 * const tint = createHelperMaterial({ color: 'accent', opacity: 0.6 });
 *
 * picker.on('change', (event) => (tint.color = event.value));
 * ```
 */
export function createHelperMaterial(options = {}) {
  return new HelperMaterial(options);
}
