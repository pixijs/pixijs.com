/**
 * A stylised material of our own, built on `BaseMaterial3D`, that does its own shading with no lights
 *
 * It colours each pixel from a ramp texture by how directly the surface faces the camera, cut into flat bands, with an
 * edge colour where the surface turns away. The shader is `rampBit`; this class hands it to the engine, fills the
 * texture and uniforms it declares, and gives the edge colour a setter that takes any colour.
 */

import { BaseMaterial3D } from '@pixi/3d';

import { Color } from 'pixi.js';

import { rampBit } from './rampBit';

/**
 * `RampMaterial`'s options. The class fills `descriptor` and `textures` itself, and `rampBit` declares no base colour,
 * alpha or uv transform, so the options for those are left out.
 */

/** The uniforms `rampBit` declares, as `material.data` holds them */

/** The texture slot `rampBit` declares, as `material.textures` holds it */

/**
 * A material that colours each pixel from a ramp by how directly it faces the camera
 *
 * `rampBit` declares no base colour, alpha or uv transform, so the inherited `baseColor`, `alpha`, `alphaCutoff` and
 * `uvTransform` do nothing here.
 */
export class RampMaterial extends BaseMaterial3D {
  lit = false;

  _edgeColor = 0;

  constructor({
    ramp,
    bands = 4,
    edgeWidth = 0.2,
    edgeColor = 0x000000,
    ...options
  } = {}) {
    super({
      ...options,
      // rampBit does no lighting, so the engine leaves out the shadow lookup a light loop would call. The lights never
      // reach it anyway: it writes `albedo`, and no bit fills the `fragment.lighting` slot.
      // rampBit decodes the ramp's colours and the engine encodes them back for the screen, so the ramp shows as
      // painted, and the view's fog fades it toward the fog colour like the rest of the scene.
      // One bit carries both languages, so both backends lay out the same uniforms and texture slot.
      descriptor: { bitsGpu: [rampBit], bitsGl: [rampBit] },
      textures: { ramp },
    });
    this.data.bands = bands;
    this.data.edgeWidth = edgeWidth;
    this.edgeColor = edgeColor;
  }

  /** The colour where the surface turns edge-on, read back as a hex number */
  get edgeColor() {
    return this._edgeColor;
  }
  set edgeColor(value) {
    const color = Color.shared.setValue(value);

    this._edgeColor = color.toNumber();
    // As written, like the ramp's colours: rampBit decodes it.
    color.toRgbArray(this.data.edgeColor);
    // A write into a field's live view doesn't queue the upload by itself.
    this.update();
  }
}
