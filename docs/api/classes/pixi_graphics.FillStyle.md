---
id: "pixi_graphics.FillStyle"
title: "Class: FillStyle"
sidebar_label: "FillStyle"
custom_edit_url: null
---

[@pixi/graphics](../modules/pixi_graphics.md).FillStyle

Fill style object for Graphics.

**`Memberof`**

PIXI

## Hierarchy

- **`FillStyle`**

  ↳ [`LineStyle`](pixi_graphics.LineStyle.md)

## Constructors

### constructor

• **new FillStyle**()

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L35)

## Properties

### alpha

• **alpha**: `number` = `1.0`

The alpha value used when filling the Graphics object.

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L18)

___

### color

• **color**: `number` = `0xFFFFFF`

The hex color value used when coloring the Graphics object.

**`Default`**

0xFFFFFF

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L15)

___

### matrix

• **matrix**: `Matrix` = `null`

The transform applied to the texture.

**`Default`**

null

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L30)

___

### texture

• **texture**: `Texture`<`Resource`\> = `Texture.WHITE`

The texture to be used for the fill.

**`Default`**

0

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L24)

___

### visible

• **visible**: `boolean` = `false`

If the current fill is visible.

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L33)

## Methods

### clone

▸ **clone**(): [`FillStyle`](pixi_graphics.FillStyle.md)

Clones the object

#### Returns

[`FillStyle`](pixi_graphics.FillStyle.md)

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:41](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L41)

___

### destroy

▸ **destroy**(): `void`

Destroy and don't use after this.

#### Returns

`void`

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L65)

___

### reset

▸ **reset**(): `void`

Reset

#### Returns

`void`

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L55)
