---
id: "pixi_core.Point"
title: "Class: Point"
sidebar_label: "Point"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).Point

The Point object represents a location in a two-dimensional coordinate system, where `x` represents
the position on the horizontal axis and `y` represents the position on the vertical axis

**`Memberof`**

PIXI

**`Implements`**

## Hierarchy

- `Point`

- [`IPoint`](../interfaces/pixi_core.IPoint.md)

  ↳ **`Point`**

## Implements

- [`IPoint`](../interfaces/pixi_core.IPoint.md)

## Constructors

### constructor

• **new Point**(`x?`, `y?`)

Creates a new `Point`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `x?` | `number` | `0` | position of the point on the x axis |
| `y?` | `number` | `0` | position of the point on the y axis |

#### Inherited from

GlobalMixins.Point.constructor

#### Defined in

[pixijs/packages/math/src/Point.ts:25](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Point.ts#L25)

## Properties

### x

• **x**: `number` = `0`

Position of the point on the x axis

#### Implementation of

[IPoint](../interfaces/pixi_core.IPoint.md).[x](../interfaces/pixi_core.IPoint.md#x)

#### Inherited from

[IPoint](../interfaces/pixi_core.IPoint.md).[x](../interfaces/pixi_core.IPoint.md#x)

#### Defined in

[pixijs/packages/math/src/Point.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Point.ts#L16)

___

### y

• **y**: `number` = `0`

Position of the point on the y axis

#### Implementation of

[IPoint](../interfaces/pixi_core.IPoint.md).[y](../interfaces/pixi_core.IPoint.md#y)

#### Inherited from

[IPoint](../interfaces/pixi_core.IPoint.md).[y](../interfaces/pixi_core.IPoint.md#y)

#### Defined in

[pixijs/packages/math/src/Point.ts:18](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Point.ts#L18)

## Methods

### add

▸ **add**(`other`): [`Point`](pixi_core.Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Returns

[`Point`](pixi_core.Point.md)

#### Inherited from

GlobalMixins.Point.add

#### Defined in

[pixijs/packages/math-extras/global.d.ts:29](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L29)

▸ **add**<`T`\>(`other`, `outPoint`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`IPointData`](../interfaces/pixi_core.IPointData.md) |
| `outPoint` | `T` |

#### Returns

`T`

#### Inherited from

GlobalMixins.Point.add

#### Defined in

[pixijs/packages/math-extras/global.d.ts:30](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L30)

___

### clone

▸ **clone**(): [`Point`](pixi_core.Point.md)

Creates a clone of this point

#### Returns

[`Point`](pixi_core.Point.md)

A clone of this point

#### Defined in

[pixijs/packages/math/src/Point.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Point.ts#L35)

___

### copyFrom

▸ **copyFrom**(`p`): [`Point`](pixi_core.Point.md)

Copies `x` and `y` from the given point into this point

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `p` | [`IPointData`](../interfaces/pixi_core.IPointData.md) | The point to copy from |

#### Returns

[`Point`](pixi_core.Point.md)

The point instance itself

#### Inherited from

[IPoint](../interfaces/pixi_core.IPoint.md).[copyFrom](../interfaces/pixi_core.IPoint.md#copyfrom)

#### Defined in

[pixijs/packages/math/src/Point.ts:45](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Point.ts#L45)

___

### copyTo

▸ **copyTo**<`T`\>(`p`): `T`

Copies this point's x and y into the given point (`p`).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`IPoint`](../interfaces/pixi_core.IPoint.md)<`T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `p` | `T` | The point to copy to. Can be any of type that is or extends `IPointData` |

#### Returns

`T`

The point (`p`) with values updated

#### Inherited from

[IPoint](../interfaces/pixi_core.IPoint.md).[copyTo](../interfaces/pixi_core.IPoint.md#copyto)

#### Defined in

[pixijs/packages/math/src/Point.ts:57](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Point.ts#L57)

___

### cross

▸ **cross**(`other`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Returns

`number`

#### Inherited from

GlobalMixins.Point.cross

#### Defined in

[pixijs/packages/math-extras/global.d.ts:46](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L46)

___

### dot

▸ **dot**(`other`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Returns

`number`

#### Inherited from

GlobalMixins.Point.dot

#### Defined in

[pixijs/packages/math-extras/global.d.ts:44](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L44)

___

### equals

▸ **equals**(`p`): `boolean`

Accepts another point (`p`) and returns `true` if the given point is equal to this point

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `p` | [`IPointData`](../interfaces/pixi_core.IPointData.md) | The point to check |

#### Returns

`boolean`

Returns `true` if both `x` and `y` are equal

#### Inherited from

[IPoint](../interfaces/pixi_core.IPoint.md).[equals](../interfaces/pixi_core.IPoint.md#equals)

#### Defined in

[pixijs/packages/math/src/Point.ts:69](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Point.ts#L69)

___

### magnitude

▸ **magnitude**(): `number`

#### Returns

`number`

#### Inherited from

GlobalMixins.Point.magnitude

#### Defined in

[pixijs/packages/math-extras/global.d.ts:51](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L51)

___

### magnitudeSquared

▸ **magnitudeSquared**(): `number`

#### Returns

`number`

#### Inherited from

GlobalMixins.Point.magnitudeSquared

#### Defined in

[pixijs/packages/math-extras/global.d.ts:53](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L53)

___

### multiply

▸ **multiply**(`other`): [`Point`](pixi_core.Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Returns

[`Point`](pixi_core.Point.md)

#### Inherited from

GlobalMixins.Point.multiply

#### Defined in

[pixijs/packages/math-extras/global.d.ts:35](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L35)

▸ **multiply**<`T`\>(`other`, `outPoint`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`IPointData`](../interfaces/pixi_core.IPointData.md) |
| `outPoint` | `T` |

#### Returns

`T`

#### Inherited from

GlobalMixins.Point.multiply

#### Defined in

[pixijs/packages/math-extras/global.d.ts:36](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L36)

___

### multiplyScalar

▸ **multiplyScalar**(`scalar`): [`Point`](pixi_core.Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `scalar` | `number` |

#### Returns

[`Point`](pixi_core.Point.md)

#### Inherited from

GlobalMixins.Point.multiplyScalar

#### Defined in

[pixijs/packages/math-extras/global.d.ts:41](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L41)

▸ **multiplyScalar**<`T`\>(`scalar`, `outPoint`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `scalar` | `number` |
| `outPoint` | `T` |

#### Returns

`T`

#### Inherited from

GlobalMixins.Point.multiplyScalar

#### Defined in

[pixijs/packages/math-extras/global.d.ts:42](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L42)

___

### normalize

▸ **normalize**(): [`Point`](pixi_core.Point.md)

#### Returns

[`Point`](pixi_core.Point.md)

#### Inherited from

GlobalMixins.Point.normalize

#### Defined in

[pixijs/packages/math-extras/global.d.ts:48](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L48)

▸ **normalize**<`T`\>(`outPoint`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `outPoint` | `T` |

#### Returns

`T`

#### Inherited from

GlobalMixins.Point.normalize

#### Defined in

[pixijs/packages/math-extras/global.d.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L49)

___

### project

▸ **project**(`onto`): [`Point`](pixi_core.Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `onto` | [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Returns

[`Point`](pixi_core.Point.md)

#### Inherited from

GlobalMixins.Point.project

#### Defined in

[pixijs/packages/math-extras/global.d.ts:55](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L55)

▸ **project**<`T`\>(`onto`, `outPoint`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `onto` | [`IPointData`](../interfaces/pixi_core.IPointData.md) |
| `outPoint` | `T` |

#### Returns

`T`

#### Inherited from

GlobalMixins.Point.project

#### Defined in

[pixijs/packages/math-extras/global.d.ts:56](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L56)

___

### reflect

▸ **reflect**(`normal`): [`Point`](pixi_core.Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `normal` | [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Returns

[`Point`](pixi_core.Point.md)

#### Inherited from

GlobalMixins.Point.reflect

#### Defined in

[pixijs/packages/math-extras/global.d.ts:58](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L58)

▸ **reflect**<`T`\>(`normal`, `outPoint`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `normal` | [`IPointData`](../interfaces/pixi_core.IPointData.md) |
| `outPoint` | `T` |

#### Returns

`T`

#### Inherited from

GlobalMixins.Point.reflect

#### Defined in

[pixijs/packages/math-extras/global.d.ts:59](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L59)

___

### set

▸ **set**(`x?`, `y?`): [`Point`](pixi_core.Point.md)

Sets the point to a new `x` and `y` position.
If `y` is omitted, both `x` and `y` will be set to `x`.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `x?` | `number` | `0` | position of the point on the `x` axis |
| `y?` | `number` | `x` | position of the point on the `y` axis |

#### Returns

[`Point`](pixi_core.Point.md)

The point instance itself

#### Inherited from

[IPoint](../interfaces/pixi_core.IPoint.md).[set](../interfaces/pixi_core.IPoint.md#set)

#### Defined in

[pixijs/packages/math/src/Point.ts:81](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Point.ts#L81)

___

### subtract

▸ **subtract**(`other`): [`Point`](pixi_core.Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Returns

[`Point`](pixi_core.Point.md)

#### Inherited from

GlobalMixins.Point.subtract

#### Defined in

[pixijs/packages/math-extras/global.d.ts:32](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L32)

▸ **subtract**<`T`\>(`other`, `outPoint`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`IPointData`](../interfaces/pixi_core.IPointData.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`IPointData`](../interfaces/pixi_core.IPointData.md) |
| `outPoint` | `T` |

#### Returns

`T`

#### Inherited from

GlobalMixins.Point.subtract

#### Defined in

[pixijs/packages/math-extras/global.d.ts:33](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math-extras/global.d.ts#L33)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[pixijs/packages/math/src/Point.ts:90](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/Point.ts#L90)
