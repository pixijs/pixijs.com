---
id: "pixi_core.Rectangle"
title: "Class: Rectangle"
sidebar_label: "Rectangle"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Rectangle

Rectangle object is an area defined by its position, as indicated by its top-left corner
point (x, y) and by its width and its height.

**`Memberof`**

PIXI

## Hierarchy

- `Rectangle`

  ↳ **`Rectangle`**

## Constructors

### constructor

• **new Rectangle**(`x?`, `y?`, `width?`, `height?`)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `x` | `string` \| `number` | `0` | The X coordinate of the upper-left corner of the rectangle |
| `y` | `string` \| `number` | `0` | The Y coordinate of the upper-left corner of the rectangle |
| `width` | `string` \| `number` | `0` | The overall width of the rectangle |
| `height` | `string` \| `number` | `0` | The overall height of the rectangle |

#### Inherited from

GlobalMixins.Rectangle.constructor

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:50](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L50)

## Properties

### height

• **height**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L35)

___

### type

• `Readonly` **type**: [`RECT`](../enums/pixi_core.SHAPES.md#rect)

The type of the object, mainly used to avoid `instanceof` checks

**`Default`**

PIXI.SHAPES.RECT

**`See`**

PIXI.SHAPES

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:42](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L42)

___

### width

• **width**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:32](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L32)

___

### x

• **x**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:27](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L27)

___

### y

• **y**: `number`

**`Default`**

0

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L30)

## Accessors

### bottom

• `get` **bottom**(): `number`

Returns the bottom edge of the rectangle.

#### Returns

`number`

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L78)

___

### left

• `get` **left**(): `number`

Returns the left edge of the rectangle.

#### Returns

`number`

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:60](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L60)

___

### right

• `get` **right**(): `number`

Returns the right edge of the rectangle.

#### Returns

`number`

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:66](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L66)

___

### top

• `get` **top**(): `number`

Returns the top edge of the rectangle.

#### Returns

`number`

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:72](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L72)

___

### EMPTY

• `Static` `get` **EMPTY**(): [`Rectangle`](pixi_core.Rectangle.md)

A constant empty rectangle.

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:84](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L84)

## Methods

### ceil

▸ **ceil**(`resolution?`, `eps?`): [`Rectangle`](pixi_core.Rectangle.md)

Enlarges rectangle that way its corners lie on grid

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `resolution` | `number` | `1` | resolution |
| `eps` | `number` | `0.001` | precision |

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

Returns itself.

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:292](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L292)

___

### clone

▸ **clone**(): [`Rectangle`](pixi_core.Rectangle.md)

Creates a clone of this Rectangle

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

a copy of the rectangle

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:93](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L93)

___

### contains

▸ **contains**(`x`, `y`): `boolean`

Checks whether the x and y coordinates given are contained within this Rectangle

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | The X coordinate of the point to test |
| `y` | `number` | The Y coordinate of the point to test |

#### Returns

`boolean`

Whether the x/y coordinates are within this Rectangle

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:134](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L134)

___

### containsRect

▸ **containsRect**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Rectangle`](pixi_core.Rectangle.md) |

#### Returns

`boolean`

#### Inherited from

GlobalMixins.Rectangle.containsRect

#### Defined in

[pixijs/packages/math-extras/global.d.ts:15](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L15)

___

### copyFrom

▸ **copyFrom**(`rectangle`): [`Rectangle`](pixi_core.Rectangle.md)

Copies another rectangle to this one.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rectangle` | [`Rectangle`](pixi_core.Rectangle.md) | The rectangle to copy from. |

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

Returns itself.

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:103](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L103)

___

### copyTo

▸ **copyTo**(`rectangle`): [`Rectangle`](pixi_core.Rectangle.md)

Copies this rectangle to another one.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rectangle` | [`Rectangle`](pixi_core.Rectangle.md) | The rectangle to copy to. |

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

Returns given parameter.

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:118](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L118)

___

### enlarge

▸ **enlarge**(`rectangle`): [`Rectangle`](pixi_core.Rectangle.md)

Enlarges this rectangle to include the passed rectangle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rectangle` | [`Rectangle`](pixi_core.Rectangle.md) | The rectangle to include. |

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

Returns itself.

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:311](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L311)

___

### equals

▸ **equals**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Rectangle`](pixi_core.Rectangle.md) |

#### Returns

`boolean`

#### Inherited from

GlobalMixins.Rectangle.equals

#### Defined in

[pixijs/packages/math-extras/global.d.ts:17](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L17)

___

### fit

▸ **fit**(`rectangle`): [`Rectangle`](pixi_core.Rectangle.md)

Fits this rectangle around the passed one.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rectangle` | [`Rectangle`](pixi_core.Rectangle.md) | The rectangle to fit. |

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

Returns itself.

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:271](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L271)

___

### intersection

▸ **intersection**(`other`): [`Rectangle`](pixi_core.Rectangle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Rectangle`](pixi_core.Rectangle.md) |

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

#### Inherited from

GlobalMixins.Rectangle.intersection

#### Defined in

[pixijs/packages/math-extras/global.d.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L19)

▸ **intersection**<`T`\>(`other`, `outRect`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Rectangle`](pixi_core.Rectangle.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Rectangle`](pixi_core.Rectangle.md) |
| `outRect` | `T` |

#### Returns

`T`

#### Inherited from

GlobalMixins.Rectangle.intersection

#### Defined in

[pixijs/packages/math-extras/global.d.ts:20](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L20)

___

### intersects

▸ **intersects**(`other`, `transform?`): `boolean`

Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
Returns true only if the area of the intersection is >0, this means that Rectangles
sharing a side are not overlapping. Another side effect is that an arealess rectangle
(width or height equal to zero) can't intersect any other rectangle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `other` | [`Rectangle`](pixi_core.Rectangle.md) | The Rectangle to intersect with `this`. |
| `transform?` | [`Matrix`](pixi_core.Matrix.md) | The transformation matrix of `other`. |

#### Returns

`boolean`

A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:161](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L161)

___

### pad

▸ **pad**(`paddingX?`, `paddingY?`): [`Rectangle`](pixi_core.Rectangle.md)

Pads the rectangle making it grow in all directions.
If paddingY is omitted, both paddingX and paddingY will be set to paddingX.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `paddingX` | `number` | `0` | The horizontal padding amount. |
| `paddingY` | `number` | `paddingX` | The vertical padding amount. |

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

Returns itself.

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:255](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L255)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[pixijs/packages/math/src/shapes/Rectangle.ts:327](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/shapes/Rectangle.ts#L327)

___

### union

▸ **union**(`other`): [`Rectangle`](pixi_core.Rectangle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Rectangle`](pixi_core.Rectangle.md) |

#### Returns

[`Rectangle`](pixi_core.Rectangle.md)

#### Inherited from

GlobalMixins.Rectangle.union

#### Defined in

[pixijs/packages/math-extras/global.d.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L22)

▸ **union**<`T`\>(`other`, `outRect`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Rectangle`](pixi_core.Rectangle.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Rectangle`](pixi_core.Rectangle.md) |
| `outRect` | `T` |

#### Returns

`T`

#### Inherited from

GlobalMixins.Rectangle.union

#### Defined in

[pixijs/packages/math-extras/global.d.ts:23](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L23)
