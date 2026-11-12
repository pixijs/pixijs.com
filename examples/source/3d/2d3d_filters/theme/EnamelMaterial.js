/** The 3D logo's lacquered pink, with a glow and a heat you can drive every frame */

import { Material3D } from '@pixi/3d';

import { BRAND, mixColor } from './palette';

/** A glow's emissive tint: a hot pink that brightens the enamel without washing it out */
const GLOW_COLOR = BRAND.hotPink;

/** A hot piece's emissive tint: deeper and more saturated, so it reads as neon */
const HOT_COLOR = 0xff1a4a;

/** Share of its reflections and ambient fill an enamel keeps at full heat, so nothing pales its glow */
const HOT_REFLECTIONS = 0.1;

/** Emissive strength at glow 1 */
const GLOW_STRENGTH = 0.8;

/** The logo's lacquered pink; fog is off, so the logo keeps its colour in a hazy scene */
export class EnamelMaterial extends Material3D {
  _coat = 1;
  _glow = 0;
  _heat = 0;
  _reflections = 0.2;

  constructor({
    color = BRAND.logoFace,
    roughness = 0.32,
    coat = 1,
    coatRoughness = 0.06,
    reflections = 0.2,
  } = {}) {
    super({
      baseColor: color,
      roughness,
      metallic: 0,
      specular: { factor: 1 },
      clearcoat: { factor: coat, roughness: coatRoughness },
      emissive: { color: GLOW_COLOR, strength: 0 },
      fog: false,
    });
    this._coat = coat;
    this._reflections = reflections;
    this._tune();
  }

  /** Light from within: 0 is off, 1 a strong hit */
  get glow() {
    return this._glow;
  }
  set glow(value) {
    if (this._glow === value) return;
    this._glow = value;
    this.emissive.strength = value * GLOW_STRENGTH;
  }

  /**
   * How hot it runs, 0 to 1
   *
   * A hot enamel glows a deeper pink and loses most of its reflections and fill, so in the dark it reads as its
   * own light rather than a pale sheen. Pair it with {@link EnamelMaterial#glow}.
   */
  get heat() {
    return this._heat;
  }
  set heat(value) {
    if (this._heat === value) return;
    this._heat = value;
    this.emissive.color = mixColor(GLOW_COLOR, HOT_COLOR, value);
    this._tune();
  }

  /** Share of the lacquer's reflections kept, 0 to 1; see {@link EnamelOptions.reflections} */
  get reflections() {
    return this._reflections;
  }
  set reflections(value) {
    if (this._reflections === value) return;
    this._reflections = value;
    this._tune();
  }

  _tune() {
    const cooled = 1 + (HOT_REFLECTIONS - 1) * this._heat;

    this.clearcoat.factor = this._coat * this._reflections * cooled;
    this.specular.factor = this._reflections;
    this.occlusionStrength = cooled;
  }
}
