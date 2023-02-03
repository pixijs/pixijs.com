---
id: "pixi_text_bitmap.BitmapFont"
title: "Class: BitmapFont"
sidebar_label: "BitmapFont"
custom_edit_url: null
---

[@pixi/text-bitmap](../modules/pixi_text_bitmap.md).BitmapFont

BitmapFont represents a typeface available for use with the BitmapText class. Use the `install`
method for adding a font to be used.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new BitmapFont**(`data`, `textures`, `ownsTextures?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`BitmapFontData`](pixi_text_bitmap.BitmapFontData.md) |  |
| `textures` | `Texture`<`Resource`\>[] \| `Dict`<`Texture`<`Resource`\>\> |  |
| `ownsTextures?` | `boolean` | Setting to `true` will destroy page textures when the font is uninstalled. |

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:170](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L170)

## Properties

### chars

• `Readonly` **chars**: `Dict`<[`IBitmapFontCharacter`](../interfaces/pixi_text_bitmap.IBitmapFontCharacter.md)\>

The map of characters by character code.

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:151](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L151)

___

### distanceFieldRange

• `Readonly` **distanceFieldRange**: `number`

The range of the distance field in pixels.

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:157](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L157)

___

### distanceFieldType

• `Readonly` **distanceFieldType**: `string`

The kind of distance field for this font or "none".

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:160](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L160)

___

### font

• `Readonly` **font**: `string`

The name of the font face.

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:142](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L142)

___

### lineHeight

• `Readonly` **lineHeight**: `number`

The line-height of the font face in pixels.

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:148](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L148)

___

### pageTextures

• `Readonly` **pageTextures**: `Dict`<`Texture`<`Resource`\>\>

The map of base page textures (i.e., sheets of glyphs).

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:154](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L154)

___

### size

• `Readonly` **size**: `number`

The size of the font face in pixels.

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:145](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L145)

___

### ALPHA

▪ `Static` `Readonly` **ALPHA**: (`string` \| `string`[])[]

This character set includes all the letters in the alphabet (both lower- and upper- case).

**`Example`**

```ts
BitmapFont.from('ExampleFont', style, { chars: BitmapFont.ALPHA })
```

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:99](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L99)

___

### ALPHANUMERIC

▪ `Static` `Readonly` **ALPHANUMERIC**: (`string` \| `string`[])[]

This character set is the union of `BitmapFont.ALPHA` and `BitmapFont.NUMERIC`.

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L113)

___

### ASCII

▪ `Static` `Readonly` **ASCII**: `string`[][]

This character set consists of all the ASCII table.

**`Member`**

**`See`**

http://www.asciitable.com/

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:120](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L120)

___

### NUMERIC

▪ `Static` `Readonly` **NUMERIC**: `string`[][]

This character set includes all decimal digits (from 0 to 9).

**`Example`**

```ts
BitmapFont.from('ExampleFont', style, { chars: BitmapFont.NUMERIC })
```

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L107)

___

### available

▪ `Static` `Readonly` **available**: `Dict`<[`BitmapFont`](pixi_text_bitmap.BitmapFont.md)\> = `{}`

Collection of available/installed fonts.

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:139](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L139)

___

### defaultOptions

▪ `Static` `Readonly` **defaultOptions**: [`IBitmapFontOptions`](../interfaces/pixi_text_bitmap.IBitmapFontOptions.md)

Collection of default options when using `BitmapFont.from`.

**`Property`**

**`Property`**

**`Property`**

**`Property`**

**`Property`**

= PIXI.BitmapFont.ALPHANUMERIC

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:130](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L130)

## Methods

### destroy

▸ **destroy**(): `void`

Remove references to created glyph textures.

#### Returns

`void`

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:258](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L258)

___

### from

▸ `Static` **from**(`name`, `textStyle?`, `options?`): [`BitmapFont`](pixi_text_bitmap.BitmapFont.md)

Generates a bitmap-font for the given style and character set. This does not support
kernings yet. With `style` properties, only the following non-layout properties are used:

- PIXI.TextStyle#dropShadow|dropShadow
- PIXI.TextStyle#dropShadowDistance|dropShadowDistance
- PIXI.TextStyle#dropShadowColor|dropShadowColor
- PIXI.TextStyle#dropShadowBlur|dropShadowBlur
- PIXI.TextStyle#dropShadowAngle|dropShadowAngle
- PIXI.TextStyle#fill|fill
- PIXI.TextStyle#fillGradientStops|fillGradientStops
- PIXI.TextStyle#fillGradientType|fillGradientType
- PIXI.TextStyle#fontFamily|fontFamily
- PIXI.TextStyle#fontSize|fontSize
- PIXI.TextStyle#fontVariant|fontVariant
- PIXI.TextStyle#fontWeight|fontWeight
- PIXI.TextStyle#lineJoin|lineJoin
- PIXI.TextStyle#miterLimit|miterLimit
- PIXI.TextStyle#stroke|stroke
- PIXI.TextStyle#strokeThickness|strokeThickness
- PIXI.TextStyle#textBaseline|textBaseline

**`Example`**

```ts
import { BitmapFont, BitmapText } from 'pixi.js';

BitmapFont.from('TitleFont', {
    fontFamily: 'Arial',
    fontSize: 12,
    strokeThickness: 2,
    fill: 'purple',
});

const title = new BitmapText('This is the title', { fontName: 'TitleFont' });
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The name of the custom font to use with BitmapText. |
| `textStyle?` | `TextStyle` \| `Partial`<`ITextStyle`\> | Style options to render with BitmapFont. |
| `options?` | [`IBitmapFontOptions`](../interfaces/pixi_text_bitmap.IBitmapFontOptions.md) | Setup options for font or name of the font. |

#### Returns

[`BitmapFont`](pixi_text_bitmap.BitmapFont.md)

Font generated by style options.

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:383](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L383)

___

### install

▸ `Static` **install**(`data`, `textures`, `ownsTextures?`): [`BitmapFont`](pixi_text_bitmap.BitmapFont.md)

Register a new bitmap font.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `string` \| `XMLDocument` \| [`BitmapFontData`](pixi_text_bitmap.BitmapFontData.md) | The characters map that could be provided as xml or raw string. |
| `textures` | `Texture`<`Resource`\> \| `Texture`<`Resource`\>[] \| `Dict`<`Texture`<`Resource`\>\> | List of textures for each page. |
| `ownsTextures?` | `boolean` | Set to `true` to destroy page textures when the font is uninstalled. By default fonts created with `BitmapFont.from` or from the `BitmapFontLoader` are `true`. |

#### Returns

[`BitmapFont`](pixi_text_bitmap.BitmapFont.md)

Result font object with font, size, lineHeight
        and char fields.

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:292](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L292)

___

### uninstall

▸ `Static` **uninstall**(`name`): `void`

Remove bitmap font by name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the font to uninstall. |

#### Returns

`void`

#### Defined in

[pixijs/packages/text-bitmap/src/BitmapFont.ts:333](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/text-bitmap/src/BitmapFont.ts#L333)
