---
id: "pixi_core.Circle"
title: "Class: Circle"
sidebar_label: "Circle"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Circle

The Circle object is used to help draw graphics and can also be used to specify a hit area for displayObjects.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Circle**(`x?`, `y?`, `radius?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `x` | `number` | `0` | The X coordinate of the center of this circle |
| `y` | `number` | `0` | The Y coordinate of the center of this circle |
| `radius` | `number` | `0` | The radius of the circle |

#### Defined in

[pixijs/packages/math/src/shapes/Circle.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Circle.ts#L31)

## Properties

### radius

• **radius**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/Circle.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Circle.ts#L17)

___

### type

• `Readonly` **type**: [`CIRC`](../enums/pixi_core.SHAPES.md#circ)

The type of the object, mainly used to avoid `instanceof` checks

**`Default`**

PIXI.SHAPES.CIRC

**`See`**

PIXI.SHAPES

#### Defined in

[pixijs/packages/math/src/shapes/Circle.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Circle.ts#L24)

___

### x

• **x**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/Circle.ts:11](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Circle.ts#L11)

___

### y

• **y**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/Circle.ts:14](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Circle.ts#L14)

## Methods

### clone

▸ **clone**(): [`Circle`](pixi_core.Circle.md)

Creates a clone of this Circle instance

#### Returns

[`Circle`](pixi_core.Circle.md)

A copy of the Circle

#### Defined in

[pixijs/packages/math/src/shapes/Circle.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Circle.ts#L44)

___

### contains

▸ **contains**(`x`, `y`): `boolean`

Checks whether the x and y coordinates given are contained within this circle

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The X coordinate of the point to test |
| `y` | `number` | The Y coordinate of the point to test |

#### Returns

`boolean`

Whether the x/y coordinates are within this Circle

#### Defined in

[pixijs/packages/math/src/shapes/Circle.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Circle.ts#L55)

___

### getBounds

▸ **getBounds**(): [`Rectangle`](pixi_core.Rectangle.md)

Returns the framing rectangle of the circle as a Rectangle object

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

The framing rectangle

#### Defined in

[pixijs/packages/math/src/shapes/Circle.ts:76](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Circle.ts#L76)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[pixijs/packages/math/src/shapes/Circle.ts:82](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Circle.ts#L82)
