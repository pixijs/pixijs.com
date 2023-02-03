---
id: "pixi_core.Polygon"
title: "Class: Polygon"
sidebar_label: "Polygon"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Polygon

A class to define a shape via user defined coordinates.

**`Memberof`**

PIXI

## Constructors

### constructor

• **new Polygon**(`points`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `points` | `number`[] \| [`IPointData`](../interfaces/pixi_core.IPointData.md)[] | This can be an array of Points that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or the arguments passed can be all the points of the polygon e.g. `new Polygon(new Point(), new Point(), ...)`, or the arguments passed can be flat x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers. |

#### Defined in

[pixijs/packages/math/src/shapes/Polygon.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Polygon.ts#L24)

• **new Polygon**(`...points`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...points` | `number`[] \| [`IPointData`](../interfaces/pixi_core.IPointData.md)[] | This can be an array of Points that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or the arguments passed can be all the points of the polygon e.g. `new Polygon(new Point(), new Point(), ...)`, or the arguments passed can be flat x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers. |

#### Defined in

[pixijs/packages/math/src/shapes/Polygon.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Polygon.ts#L25)

## Properties

### closeStroke

• **closeStroke**: `boolean`

`false` after moveTo, `true` after `closePath`. In all other cases it is `true`.

#### Defined in

[pixijs/packages/math/src/shapes/Polygon.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Polygon.ts#L15)

___

### points

• **points**: `number`[]

An array of the points of this polygon.

#### Defined in

[pixijs/packages/math/src/shapes/Polygon.ts:12](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Polygon.ts#L12)

___

### type

• `Readonly` **type**: [`POLY`](../enums/pixi_core.SHAPES.md#poly)

The type of the object, mainly used to avoid `instanceof` checks

**`Default`**

PIXI.SHAPES.POLY

**`See`**

PIXI.SHAPES

#### Defined in

[pixijs/packages/math/src/shapes/Polygon.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Polygon.ts#L22)

## Methods

### clone

▸ **clone**(): [`Polygon`](pixi_core.Polygon.md)

Creates a clone of this polygon.

#### Returns

[`Polygon`](pixi_core.Polygon.md)

- A copy of the polygon.

#### Defined in

[pixijs/packages/math/src/shapes/Polygon.ts:60](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Polygon.ts#L60)

___

### contains

▸ **contains**(`x`, `y`): `boolean`

Checks whether the x and y coordinates passed to this function are contained within this polygon.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The X coordinate of the point to test. |
| `y` | `number` | The Y coordinate of the point to test. |

#### Returns

`boolean`

- Whether the x/y coordinates are within this polygon.

#### Defined in

[pixijs/packages/math/src/shapes/Polygon.ts:76](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Polygon.ts#L76)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[pixijs/packages/math/src/shapes/Polygon.ts:102](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Polygon.ts#L102)
