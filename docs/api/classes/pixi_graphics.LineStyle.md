---
id: "pixi_graphics.LineStyle"
title: "Class: LineStyle"
sidebar_label: "LineStyle"
custom_edit_url: null
---

[@pixi/graphics](../modules/pixi_graphics.md).LineStyle

Represents the line style for Graphics.

**`Memberof`**

PIXI

## Hierarchy

- [`FillStyle`](pixi_graphics.FillStyle.md)

  ↳ **`LineStyle`**

## Constructors

### constructor

• **new LineStyle**()

#### Inherited from

[FillStyle](pixi_graphics.FillStyle.md).[constructor](pixi_graphics.FillStyle.md#constructor)

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L35)

## Properties

### alignment

• **alignment**: `number` = `0.5`

The alignment of any lines drawn (0.5 = middle, 1 = outer, 0 = inner). WebGL only.

#### Defined in

[pixijs/packages/graphics/src/styles/LineStyle.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/LineStyle.ts#L14)

___

### alpha

• **alpha**: `number` = `1.0`

The alpha value used when filling the Graphics object.

#### Inherited from

[FillStyle](pixi_graphics.FillStyle.md).[alpha](pixi_graphics.FillStyle.md#alpha)

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L18)

___

### cap

• **cap**: [`LINE_CAP`](../enums/pixi_graphics.LINE_CAP.md) = `LINE_CAP.BUTT`

Line cap style.

**`Member`**

**`Default`**

PIXI.LINE_CAP.BUTT

#### Defined in

[pixijs/packages/graphics/src/styles/LineStyle.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/LineStyle.ts#L24)

___

### color

• **color**: `number` = `0xFFFFFF`

The hex color value used when coloring the Graphics object.

**`Default`**

0xFFFFFF

#### Inherited from

[FillStyle](pixi_graphics.FillStyle.md).[color](pixi_graphics.FillStyle.md#color)

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L15)

___

### join

• **join**: [`LINE_JOIN`](../enums/pixi_graphics.LINE_JOIN.md) = `LINE_JOIN.MITER`

Line join style.

**`Member`**

**`Default`**

PIXI.LINE_JOIN.MITER

#### Defined in

[pixijs/packages/graphics/src/styles/LineStyle.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/LineStyle.ts#L31)

___

### matrix

• **matrix**: `Matrix` = `null`

The transform applied to the texture.

**`Default`**

null

#### Inherited from

[FillStyle](pixi_graphics.FillStyle.md).[matrix](pixi_graphics.FillStyle.md#matrix)

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L30)

___

### miterLimit

• **miterLimit**: `number` = `10`

Miter limit.

#### Defined in

[pixijs/packages/graphics/src/styles/LineStyle.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/LineStyle.ts#L34)

___

### native

• **native**: `boolean` = `false`

If true the lines will be draw using LINES instead of TRIANGLE_STRIP.

#### Defined in

[pixijs/packages/graphics/src/styles/LineStyle.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/LineStyle.ts#L17)

___

### texture

• **texture**: `Texture`<`Resource`\> = `Texture.WHITE`

The texture to be used for the fill.

**`Default`**

0

#### Inherited from

[FillStyle](pixi_graphics.FillStyle.md).[texture](pixi_graphics.FillStyle.md#texture)

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L24)

___

### visible

• **visible**: `boolean` = `false`

If the current fill is visible.

#### Inherited from

[FillStyle](pixi_graphics.FillStyle.md).[visible](pixi_graphics.FillStyle.md#visible)

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L33)

___

### width

• **width**: `number` = `0`

The width (thickness) of any lines drawn.

#### Defined in

[pixijs/packages/graphics/src/styles/LineStyle.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/LineStyle.ts#L11)

## Methods

### clone

▸ **clone**(): [`LineStyle`](pixi_graphics.LineStyle.md)

Clones the object.

#### Returns

[`LineStyle`](pixi_graphics.LineStyle.md)

#### Overrides

[FillStyle](pixi_graphics.FillStyle.md).[clone](pixi_graphics.FillStyle.md#clone)

#### Defined in

[pixijs/packages/graphics/src/styles/LineStyle.ts:37](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/LineStyle.ts#L37)

___

### destroy

▸ **destroy**(): `void`

Destroy and don't use after this.

#### Returns

`void`

#### Inherited from

[FillStyle](pixi_graphics.FillStyle.md).[destroy](pixi_graphics.FillStyle.md#destroy)

#### Defined in

[pixijs/packages/graphics/src/styles/FillStyle.ts:65](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/FillStyle.ts#L65)

___

### reset

▸ **reset**(): `void`

Reset the line style to default.

#### Returns

`void`

#### Overrides

[FillStyle](pixi_graphics.FillStyle.md).[reset](pixi_graphics.FillStyle.md#reset)

#### Defined in

[pixijs/packages/graphics/src/styles/LineStyle.ts:57](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/styles/LineStyle.ts#L57)
