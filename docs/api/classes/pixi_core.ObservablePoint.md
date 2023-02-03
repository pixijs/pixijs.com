---
id: "pixi_core.ObservablePoint"
title: "Class: ObservablePoint<T>"
sidebar_label: "ObservablePoint"
custom_edit_url: null
---

[@pixi/core](../modules/pixi_core.md).ObservablePoint

The ObservablePoint object represents a location in a two-dimensional coordinate system, where `x` represents
the position on the horizontal axis and `y` represents the position on the vertical axis.

An `ObservablePoint` is a point that triggers a callback when the point's position is changed.

**`Memberof`**

PIXI

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Hierarchy

- `Point`

- [`IPoint`](../interfaces/pixi_core.IPoint.md)

  ↳ **`ObservablePoint`**

## Implements

- [`IPoint`](../interfaces/pixi_core.IPoint.md)

## Constructors

### constructor

• **new ObservablePoint**<`T`\>(`cb`, `scope`, `x?`, `y?`)

Creates a new `ObservablePoint`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cb` | (`this`: `T`) => `any` | `undefined` | callback function triggered when `x` and/or `y` are changed |
| `scope` | `T` | `undefined` | owner of callback |
| `x?` | `number` | `0` | position of the point on the x axis |
| `y?` | `number` | `0` | position of the point on the y axis |

#### Inherited from

GlobalMixins.Point.constructor

#### Defined in

[pixijs/packages/math/src/ObservablePoint.ts:31](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L31)

## Properties

### \_x

• **\_x**: `number`

#### Defined in

[pixijs/packages/math/src/ObservablePoint.ts:21](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L21)

___

### \_y

• **\_y**: `number`

#### Defined in

[pixijs/packages/math/src/ObservablePoint.ts:22](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L22)

___

### cb

• **cb**: (`this`: `T`) => `any`

#### Type declaration

▸ (`this`): `any`

The callback function triggered when `x` and/or `y` are changed

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `T` |

##### Returns

`any`

#### Defined in

[pixijs/packages/math/src/ObservablePoint.ts:16](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L16)

___

### scope

• **scope**: `any`

The owner of the callback

#### Defined in

[pixijs/packages/math/src/ObservablePoint.ts:19](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L19)

## Accessors

### x

• `get` **x**(): `number`

Position of the observable point on the x axis.

#### Returns

`number`

#### Implementation of

[IPoint](../interfaces/pixi_core.IPoint.md).[x](../interfaces/pixi_core.IPoint.md#x)

#### Inherited from

IPoint.x

#### Defined in

[pixijs/packages/math/src/ObservablePoint.ts:120](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L120)

• `set` **x**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Implementation of

[IPoint](../interfaces/pixi_core.IPoint.md).[x](../interfaces/pixi_core.IPoint.md#x)

#### Inherited from

IPoint.x

#### Defined in

[pixijs/packages/math/src/ObservablePoint.ts:125](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L125)

___

### y

• `get` **y**(): `number`

Position of the observable point on the y axis.

#### Returns

`number`

#### Implementation of

[IPoint](../interfaces/pixi_core.IPoint.md).[y](../interfaces/pixi_core.IPoint.md#y)

#### Inherited from

IPoint.y

#### Defined in

[pixijs/packages/math/src/ObservablePoint.ts:135](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L135)

• `set` **y**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Implementation of

[IPoint](../interfaces/pixi_core.IPoint.md).[y](../interfaces/pixi_core.IPoint.md#y)

#### Inherited from

IPoint.y

#### Defined in

[pixijs/packages/math/src/ObservablePoint.ts:140](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L140)

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

▸ **clone**(`cb?`, `scope?`): [`ObservablePoint`](pixi_core.ObservablePoint.md)<`any`\>

Creates a clone of this point.
The callback and scope params can be overridden otherwise they will default
to the clone object's values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`this`: `T`) => `any` | The callback function triggered when `x` and/or `y` are changed |
| `scope` | `any` | The owner of the callback |

#### Returns

[`ObservablePoint`](pixi_core.ObservablePoint.md)<`any`\>

a copy of this observable point

#### Defined in

[pixijs/packages/math/src/ObservablePoint.ts:49](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L49)

___

### copyFrom

▸ **copyFrom**(`p`): [`ObservablePoint`](pixi_core.ObservablePoint.md)<`T`\>

Copies x and y from the given point (`p`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `p` | [`IPointData`](../interfaces/pixi_core.IPointData.md) | The point to copy from. Can be any of type that is or extends `IPointData` |

#### Returns

[`ObservablePoint`](pixi_core.ObservablePoint.md)<`T`\>

The observable point instance itself

#### Inherited from

[IPoint](../interfaces/pixi_core.IPoint.md).[copyFrom](../interfaces/pixi_core.IPoint.md#copyfrom)

#### Defined in

[pixijs/packages/math/src/ObservablePoint.ts:78](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L78)

___

### copyTo

▸ **copyTo**<`T`\>(`p`): `T`

Copies this point's x and y into that of the given point (`p`)

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

[pixijs/packages/math/src/ObservablePoint.ts:95](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L95)

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

[pixijs/packages/math/src/ObservablePoint.ts:107](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L107)

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

▸ **set**(`x?`, `y?`): [`ObservablePoint`](pixi_core.ObservablePoint.md)<`T`\>

Sets the point to a new `x` and `y` position.
If `y` is omitted, both `x` and `y` will be set to `x`.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `x?` | `number` | `0` | position of the point on the x axis |
| `y?` | `number` | `x` | position of the point on the y axis |

#### Returns

[`ObservablePoint`](pixi_core.ObservablePoint.md)<`T`\>

The observable point instance itself

#### Inherited from

[IPoint](../interfaces/pixi_core.IPoint.md).[set](../interfaces/pixi_core.IPoint.md#set)

#### Defined in

[pixijs/packages/math/src/ObservablePoint.ts:61](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L61)

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

[pixijs/packages/math/src/ObservablePoint.ts:113](https://github.com/pixijs/pixijs/blob/2194fe5c5/packages/math/src/ObservablePoint.ts#L113)
