---
id: "pixi_core.Ellipse"
title: "Class: Ellipse"
sidebar_label: "Ellipse"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Ellipse

The Ellipse object is used to help draw graphics and can also be used to specify a hit area for displayObjects.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Ellipse**(`x?`, `y?`, `halfWidth?`, `halfHeight?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `x` | `number` | `0` | The X coordinate of the center of this ellipse |
| `y` | `number` | `0` | The Y coordinate of the center of this ellipse |
| `halfWidth` | `number` | `0` | The half width of this ellipse |
| `halfHeight` | `number` | `0` | The half height of this ellipse |

#### Defined in

[pixijs/packages/math/src/shapes/Ellipse.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Ellipse.ts#L35)

## Properties

### height

• **height**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/Ellipse.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Ellipse.ts#L20)

___

### type

• `Readonly` **type**: [`ELIP`](../enums/pixi_core.SHAPES.md#elip)

The type of the object, mainly used to avoid `instanceof` checks

**`Default`**

PIXI.SHAPES.ELIP

**`See`**

PIXI.SHAPES

#### Defined in

[pixijs/packages/math/src/shapes/Ellipse.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Ellipse.ts#L27)

___

### width

• **width**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/Ellipse.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Ellipse.ts#L17)

___

### x

• **x**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/Ellipse.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Ellipse.ts#L11)

___

### y

• **y**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/Ellipse.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Ellipse.ts#L14)

## Methods

### clone

▸ **clone**(): [`Ellipse`](pixi_core.Ellipse.md)

Creates a clone of this Ellipse instance

#### Returns

[`Ellipse`](pixi_core.Ellipse.md)

A copy of the ellipse

#### Defined in

[pixijs/packages/math/src/shapes/Ellipse.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Ellipse.ts#L49)

___

### contains

▸ **contains**(`x`, `y`): `boolean`

Checks whether the x and y coordinates given are contained within this ellipse

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The X coordinate of the point to test |
| `y` | `number` | The Y coordinate of the point to test |

#### Returns

`boolean`

Whether the x/y coords are within this ellipse

#### Defined in

[pixijs/packages/math/src/shapes/Ellipse.ts:60](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Ellipse.ts#L60)

___

### getBounds

▸ **getBounds**(): [`Rectangle`](pixi_core.Rectangle.md)

Returns the framing rectangle of the ellipse as a Rectangle object

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

The framing rectangle

#### Defined in

[pixijs/packages/math/src/shapes/Ellipse.ts:81](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Ellipse.ts#L81)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[pixijs/packages/math/src/shapes/Ellipse.ts:87](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Ellipse.ts#L87)
