---
id: "pixi_math.RoundedRectangle"
title: "Class: RoundedRectangle"
sidebar_label: "RoundedRectangle"
custom_edit_url: null
---

[@pixi/math](../modules/pixi_math.md).RoundedRectangle

The Rounded Rectangle object is an area that has nice rounded corners, as indicated by its
top-left corner point (x, y) and by its width and its height and its radius.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new RoundedRectangle**(`x?`, `y?`, `width?`, `height?`, `radius?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `x` | `number` | `0` | The X coordinate of the upper-left corner of the rounded rectangle |
| `y` | `number` | `0` | The Y coordinate of the upper-left corner of the rounded rectangle |
| `width` | `number` | `0` | The overall width of this rounded rectangle |
| `height` | `number` | `0` | The overall height of this rounded rectangle |
| `radius` | `number` | `20` | Controls the radius of the rounded corners |

#### Defined in

[pixijs/packages/math/src/shapes/RoundedRectangle.ts:39](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/RoundedRectangle.ts#L39)

## Properties

### height

• **height**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/RoundedRectangle.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/RoundedRectangle.ts#L20)

___

### radius

• **radius**: `number`

**`Default`**

20

#### Defined in

[pixijs/packages/math/src/shapes/RoundedRectangle.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/RoundedRectangle.ts#L23)

___

### type

• `Readonly` **type**: [`RREC`](../enums/pixi_math.SHAPES.md#rrec)

The type of the object, mainly used to avoid `instanceof` checks

**`Default`**

PIXI.SHAPES.RREC

**`See`**

PIXI.SHAPES

#### Defined in

[pixijs/packages/math/src/shapes/RoundedRectangle.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/RoundedRectangle.ts#L30)

___

### width

• **width**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/RoundedRectangle.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/RoundedRectangle.ts#L17)

___

### x

• **x**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/RoundedRectangle.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/RoundedRectangle.ts#L11)

___

### y

• **y**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/RoundedRectangle.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/RoundedRectangle.ts#L14)

## Methods

### clone

▸ **clone**(): [`RoundedRectangle`](pixi_math.RoundedRectangle.md)

Creates a clone of this Rounded Rectangle.

#### Returns

[`RoundedRectangle`](pixi_math.RoundedRectangle.md)

- A copy of the rounded rectangle.

#### Defined in

[pixijs/packages/math/src/shapes/RoundedRectangle.ts:53](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/RoundedRectangle.ts#L53)

___

### contains

▸ **contains**(`x`, `y`): `boolean`

Checks whether the x and y coordinates given are contained within this Rounded Rectangle

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The X coordinate of the point to test. |
| `y` | `number` | The Y coordinate of the point to test. |

#### Returns

`boolean`

- Whether the x/y coordinates are within this Rounded Rectangle.

#### Defined in

[pixijs/packages/math/src/shapes/RoundedRectangle.ts:64](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/RoundedRectangle.ts#L64)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[pixijs/packages/math/src/shapes/RoundedRectangle.ts:111](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/RoundedRectangle.ts#L111)
