---
id: "pixi_text_bitmap.IBitmapFontOptions"
title: "Interface: IBitmapFontOptions"
sidebar_label: "IBitmapFontOptions"
custom_edit_url: null
---

[@pixi/text-bitmap](../modules/pixi_text_bitmap.md).IBitmapFontOptions

**`Memberof`**

PIXI

## Hierarchy

- `BaseOptions`

  ↳ **`IBitmapFontOptions`**

## Properties

### alphaMode

• `Optional` **alphaMode**: `ALPHA_MODES`

Pre multiply the image alpha.  Note: for MSDF/SDF fonts, alphaMode is not supported.

**`Default`**

PIXI.BaseTexture.defaultOptions.alphaMode

#### Overrides

BaseOptions.alphaMode

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:83](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L83)

___

### anisotropicLevel

• `Optional` **anisotropicLevel**: `number`

Anisotropic filtering level of texture.

**`Default`**

PIXI.BaseTexture.defaultOptions.anisotropicLevel

#### Overrides

BaseOptions.anisotropicLevel

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:71](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L71)

___

### chars

• `Optional` **chars**: `string` \| (`string` \| `string`[])[]

Characters included in the font set. You can also use ranges.
For example, `[['a', 'z'], ['A', 'Z'], "!@#$%^&*()~{}[] "]`.
Don't forget to include spaces ' ' in your character set!

**`Default`**

PIXI.BitmapFont.ALPHANUMERIC

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L31)

___

### mipmap

• `Optional` **mipmap**: `MIPMAP_MODES`

If mipmapping is enabled for texture. For instance, by default PixiJS only enables mipmapping
on Power-of-Two textures. If your textureWidth or textureHeight are not power-of-two, you
may consider enabling mipmapping to get better quality with lower font sizes. Note:
for MSDF/SDF fonts, mipmapping is not supported.

**`Default`**

PIXI.BaseTexture.defaultOptions.mipmap

#### Overrides

BaseOptions.mipmap

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L65)

___

### padding

• `Optional` **padding**: `number`

Padding between glyphs on texture atlas. Lower values could mean more visual artifacts
and bleeding from other glyphs, larger values increase the space required on the texture.

**`Default`**

4

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L44)

___

### resolution

• `Optional` **resolution**: `number`

Render resolution for glyphs.

**`Default`**

1

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L37)

___

### scaleMode

• `Optional` **scaleMode**: `SCALE_MODES`

Default scale mode, linear, nearest. Nearest can be helpful for bitmap-style fonts.

**`Default`**

PIXI.BaseTexture.defaultOptions.scaleMode

#### Overrides

BaseOptions.scaleMode

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:77](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L77)

___

### textureHeight

• `Optional` **textureHeight**: `number`

Optional height of atlas, smaller values to reduce memory.

**`Default`**

512

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:56](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L56)

___

### textureWidth

• `Optional` **textureWidth**: `number`

Optional width of atlas, smaller values to reduce memory.

**`Default`**

512

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:50](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L50)
