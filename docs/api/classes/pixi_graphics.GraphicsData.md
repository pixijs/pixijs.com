---
id: "pixi_graphics.GraphicsData"
title: "Class: GraphicsData"
sidebar_label: "GraphicsData"
custom_edit_url: null
---

[@pixi/graphics](../modules/pixi_graphics.md).GraphicsData

A class to contain data useful for Graphics objects

**`Memberof`**

PIXI

## Constructors

### constructor

• **new GraphicsData**(`shape`, `fillStyle?`, `lineStyle?`, `matrix?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `shape` | `IShape` | `undefined` | The shape object to draw. |
| `fillStyle` | [`FillStyle`](pixi_graphics.FillStyle.md) | `null` | the width of the line to draw |
| `lineStyle` | [`LineStyle`](pixi_graphics.LineStyle.md) | `null` | the color of the line to draw |
| `matrix` | `Matrix` | `null` | Transform matrix |

#### Defined in

[pixijs/packages/graphics/src/GraphicsData.ts:42](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsData.ts#L42)

## Properties

### fillStyle

• **fillStyle**: [`FillStyle`](pixi_graphics.FillStyle.md)

The style of the fill.

#### Defined in

[pixijs/packages/graphics/src/GraphicsData.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsData.ts#L21)

___

### holes

• **holes**: [`GraphicsData`](pixi_graphics.GraphicsData.md)[] = `[]`

The collection of holes.

#### Defined in

[pixijs/packages/graphics/src/GraphicsData.ts:34](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsData.ts#L34)

___

### lineStyle

• **lineStyle**: [`LineStyle`](pixi_graphics.LineStyle.md)

The style of the line.

#### Defined in

[pixijs/packages/graphics/src/GraphicsData.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsData.ts#L18)

___

### matrix

• **matrix**: `Matrix`

The transform matrix.

#### Defined in

[pixijs/packages/graphics/src/GraphicsData.ts:24](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsData.ts#L24)

___

### points

• **points**: `number`[] = `[]`

The collection of points.

#### Defined in

[pixijs/packages/graphics/src/GraphicsData.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsData.ts#L30)

___

### shape

• **shape**: `IShape`

The shape object to draw.

**`Member`**

#### Defined in

[pixijs/packages/graphics/src/GraphicsData.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsData.ts#L15)

___

### type

• **type**: `SHAPES`

The type of the shape, see the Const.Shapes file for all the existing types,

#### Defined in

[pixijs/packages/graphics/src/GraphicsData.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsData.ts#L27)

## Methods

### clone

▸ **clone**(): [`GraphicsData`](pixi_graphics.GraphicsData.md)

Creates a new GraphicsData object with the same values as this one.

#### Returns

[`GraphicsData`](pixi_graphics.GraphicsData.md)

- Cloned GraphicsData object

#### Defined in

[pixijs/packages/graphics/src/GraphicsData.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsData.ts#L55)

___

### destroy

▸ **destroy**(): `void`

Destroys the Graphics data.

#### Returns

`void`

#### Defined in

[pixijs/packages/graphics/src/GraphicsData.ts:66](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/graphics/src/GraphicsData.ts#L66)
